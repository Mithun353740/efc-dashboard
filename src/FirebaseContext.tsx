import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToAppVersion,
  subscribeToSystemLocks,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  addMatch,
  fetchPlayersOnce,
  fetchLeadersOnce,
  fetchMatchesOnce,
  fetchTournamentsOnce,
  fetchSystemLocks,
  ensureAdminSession,
} from './lib/store';
import { VERSION } from './constants';
import {
  persistToStorage,
  hydrateFromStorage,
  invalidateStorage,
  trackRead,
} from './lib/cache';

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CACHE — 30-minute in-memory TTL (zero re-reads on tab navigation)
// STORAGE CACHE — 30-minute localStorage TTL (zero re-reads on page refresh)
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes in-memory
/** How often non-admin users re-check systemLocks (tiny single doc). */
const LOCKS_POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
/** How often admin auto-refreshes collection data (replaces persistent listeners). */
const ADMIN_REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let _globalCache: {
  players: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  fetchedAt: number;
} | null = null;

// Admin fetch function ref — set during useEffect, called by refreshData
let _adminFetchRef: (() => Promise<void>) | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────────────────────────
interface FirebaseContextType {
  players: Player[];
  rankedPlayers: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  elos: Record<string, number>;
  isLoading: boolean;
  dbError: string | null;
  hasPendingWrites: boolean;
  appVersion: string;
  /** Force non-admin users to re-fetch all data (e.g. after self-registration). */
  refreshData: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Hydrate immediately from localStorage so the UI shows data before first Firestore call
  const storedPlayers = hydrateFromStorage<Player[]>('players') ?? _globalCache?.players ?? [];
  const storedLeaders = hydrateFromStorage<Leader[]>('leaders') ?? _globalCache?.leaders ?? [];
  const storedMatches = hydrateFromStorage<MatchRecord[]>('matches') ?? _globalCache?.matches ?? [];
  const storedTournaments = hydrateFromStorage<Tournament[]>('tournaments') ?? _globalCache?.tournaments ?? [];

  const [players, setPlayers] = useState<Player[]>(storedPlayers);
  const [leaders, setLeaders] = useState<Leader[]>(storedLeaders);
  const [matches, setMatches] = useState<MatchRecord[]>(storedMatches);
  const [tournaments, setTournaments] = useState<Tournament[]>(storedTournaments);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>(
    _globalCache?.systemLocks || {}
  );
  const [isLoading, setIsLoading] = useState(
    storedPlayers.length === 0 && (!_globalCache || _globalCache.players.length === 0)
  );
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [appVersion, setAppVersion] = useState<string>(VERSION);

  // Ref to avoid stale-closure issues in the poll callback
  const mountedRef = useRef(true);
  // Track whether we've done the initial one-time fetch so refreshData can force re-fetch
  const lastFetchedAt = useRef<number>(storedPlayers.length > 0 ? Date.now() : 0);

  // ─── Non-admin one-time fetch (shared by mount + refreshData) ──────────────
  const loadOnce = useCallback(async (force = false) => {
    if (!mountedRef.current) return;

    // Only re-fetch if forced or cache is expired
    const cacheAge = Date.now() - lastFetchedAt.current;
    if (!force && cacheAge < CACHE_TTL_MS && storedPlayers.length > 0) return;

    const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';
    const playerLimit = isPlayer ? 200 : 50;

    try {
      const [p, l, m, t] = await Promise.all([
        fetchPlayersOnce(playerLimit),
        fetchLeadersOnce(),
        isPlayer ? fetchMatchesOnce(50) : Promise.resolve([] as MatchRecord[]),
        fetchTournamentsOnce(20),
      ]);

      // Track reads
      trackRead(p.length + l.length + m.length + t.length);

      if (!mountedRef.current) return;

      setPlayers(p);
      setLeaders(l);
      setMatches(m);
      setTournaments(t);
      lastFetchedAt.current = Date.now();

      // Persist to localStorage for next page load
      persistToStorage('players', p);
      persistToStorage('leaders', l);
      persistToStorage('matches', m);
      persistToStorage('tournaments', t);

      // Update in-memory global cache
      _globalCache = {
        players: p,
        leaders: l,
        matches: m,
        tournaments: t,
        systemLocks: _globalCache?.systemLocks || {},
        fetchedAt: Date.now(),
      };
    } catch (err) {
      console.warn('[FirebaseContext] One-time fetch failed:', err);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Exposed to components — forces a fresh fetch and updates all state (e.g. after self-registration or admin writes). */
  const refreshData = useCallback(async () => {
    invalidateStorage(); // clear localStorage cache
    if (_globalCache) _globalCache.fetchedAt = 0;
    lastFetchedAt.current = 0;
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdmin && _adminFetchRef) {
      await _adminFetchRef();
    } else {
      await loadOnce(true);
    }
  }, [loadOnce]);

  useEffect(() => {
    mountedRef.current = true;
    const unsubscribers: (() => void)[] = [];

    // Minimum branding delay
    const minTimer = setTimeout(() => {
      if (mountedRef.current) setIsLoading(false);
    }, 1200);

    // Global error handler
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mountedRef.current || !customEvent.detail?.error) return;
      const errStr = String(customEvent.detail.error).toLowerCase();
      setIsLoading(false);
      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || errStr.includes('exceeded')) {
        setDbError('QUOTA_EXCEEDED');
      } else {
        setDbError('DATABASE_ERROR');
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    // Always ensure anonymous auth
    import('./firebase').then(({ loginAnonymously, auth }) => {
      if (!auth.currentUser) {
        loginAnonymously().catch(err => console.warn('[Firebase] Anonymous login failed:', err));
      }
    });

    // Real-time revocation listener for Player Admins
    const pRole = localStorage.getItem('playerRole');
    const pId = localStorage.getItem('playerId');
    if (pRole === 'admin' && pId) {
      import('./firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, onSnapshot }) => {
          const unsub = onSnapshot(doc(db, 'players', pId), (snap) => {
            if (snap.exists() && snap.data().role !== 'admin') {
              const realRole = snap.data().role || 'player';
              localStorage.setItem('playerRole', realRole);
              localStorage.setItem('userType', 'player');
              window.dispatchEvent(new StorageEvent('storage', { key: 'playerRole', newValue: realRole }));
              window.dispatchEvent(new StorageEvent('storage', { key: 'auth', newValue: 'player' }));
              if (window.location.hash.includes('/admin')) {
                window.location.hash = '/';
              }
            }
          });
          unsubscribers.push(unsub);
        });
      });
    }

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    if (isAdmin) {
      // ── ADMIN: ONE-TIME FETCH + 5-min auto-refresh ────────────────────────
      // Previously used 4 persistent onSnapshot listeners that re-fired on
      // every write — causing ~350 reads per match entry. Now uses one-time
      // fetches with a timed refresh, cutting admin reads by ~90%.
      ensureAdminSession();
      testFirestoreConnection();

      // systemLocks — real-time for admin (tiny single doc, needed for instant lock control)
      unsubscribers.push(subscribeToSystemLocks((locks) => {
        if (!mountedRef.current) return;
        setSystemLocks(locks);
        if (_globalCache) _globalCache.systemLocks = locks;
      }));

      // appVersion — real-time for admin (tiny single doc)
      unsubscribers.push(subscribeToAppVersion((version) => {
        if (mountedRef.current && version) setAppVersion(version);
      }));

      // ONE-TIME fetch for the 4 large collections
      const adminFetch = async () => {
        if (!mountedRef.current) return;
        try {
          const [p, l, m, t] = await Promise.all([
            fetchPlayersOnce(200),
            fetchLeadersOnce(),
            fetchMatchesOnce(100),
            fetchTournamentsOnce(50),
          ]);
          if (!mountedRef.current) return;
          setPlayers(p);
          setLeaders(l);
          setMatches(m);
          setTournaments(t);
          setIsLoading(false);
          if (_globalCache) {
            _globalCache.players = p;
            _globalCache.leaders = l;
            _globalCache.matches = m;
            _globalCache.tournaments = t;
            _globalCache.fetchedAt = Date.now();
          } else {
            _globalCache = { players: p, leaders: l, matches: m, tournaments: t, systemLocks: {}, fetchedAt: Date.now() };
          }
          // Persist for fast reloads
          import('./lib/cache').then(({ persistToStorage }) => {
            persistToStorage('players', p);
            persistToStorage('leaders', l);
            persistToStorage('matches', m);
            persistToStorage('tournaments', t);
          });
        } catch (err) {
          console.warn('[FirebaseContext] Admin fetch failed:', err);
          if (mountedRef.current) setIsLoading(false);
        }
      };

      // Expose to module-level ref so refreshData() can trigger a manual re-fetch
      _adminFetchRef = adminFetch;
      adminFetch();
      // Auto-refresh every 5 minutes so admin sees fresh data without reads on every write
      const adminRefreshInterval = setInterval(() => { if (mountedRef.current) adminFetch(); }, ADMIN_REFRESH_INTERVAL_MS);
      unsubscribers.push(() => { clearInterval(adminRefreshInterval); _adminFetchRef = null; });

    } else {
      // ── PLAYER / GUEST: ONE-TIME FETCH + controlled polling ───────────────
      // NO persistent WebSocket connections for regular users.

      // Check if in-memory cache is still fresh
      const cacheAge = _globalCache ? Date.now() - (_globalCache.fetchedAt || 0) : Infinity;
      const inMemoryCacheFresh = cacheAge < CACHE_TTL_MS && _globalCache && _globalCache.players.length > 0;
      // Check localStorage — storedPlayers already hydrated above at useState init
      const localStorageCacheFresh = storedPlayers.length > 0;

      if (inMemoryCacheFresh) {
        // Serve from memory — 0 Firestore reads
        setPlayers(_globalCache!.players);
        setLeaders(_globalCache!.leaders);
        setMatches(_globalCache!.matches);
        setTournaments(_globalCache!.tournaments);
        setSystemLocks(_globalCache!.systemLocks);
        setIsLoading(false);
      } else if (localStorageCacheFresh) {
        // localStorage data already loaded into state via useState initializer.
        // Just mark loading done and fetch systemLocks once in background.
        setIsLoading(false);
        lastFetchedAt.current = Date.now();
        // Populate in-memory cache from localStorage so navigations are instant
        _globalCache = {
          players: storedPlayers,
          leaders: storedLeaders,
          matches: storedMatches,
          tournaments: storedTournaments,
          systemLocks: {},
          fetchedAt: Date.now(),
        };
      } else {
        // Cold start — fetch from Firestore once
        loadOnce(true);
      }

      // ── systemLocks: one-time fetch + 60s poll ───────────────────────────
      // Replaces the permanent onSnapshot that all 50+ users previously held.
      // Cost: 1 read on load + 1 read per minute per user (vs. permanent WebSocket).
      const pollLocks = async () => {
        if (!mountedRef.current) return;
        try {
          const locks = await fetchSystemLocks();
          trackRead(1);
          if (!mountedRef.current) return;
          setSystemLocks(locks);
          if (_globalCache) _globalCache.systemLocks = locks;
        } catch {
          // Non-critical — fail silently
        }
      };
      pollLocks(); // immediate fetch on mount
      const locksInterval = setInterval(pollLocks, LOCKS_POLL_INTERVAL_MS);
      unsubscribers.push(() => clearInterval(locksInterval));

      // ── appVersion: fetch once on load ───────────────────────────────────
      // Version changes are infrequent; no need for a permanent WebSocket.
      // The AutoUpdater component handles forced reloads via a separate mechanism.
      import('./firebase').then(({ db }) => {
        import('firebase/firestore').then(({ getDoc, doc }) => {
          getDoc(doc(db, 'settings', 'version'))
            .then(snap => {
              if (snap.exists() && mountedRef.current) {
                setAppVersion(snap.data().currentVersion || VERSION);
              }
              trackRead(1);
            })
            .catch(() => {}); // Non-critical
        });
      });
    }

    // Safety timeout — never block UI more than 8s
    const timeout = setTimeout(() => {
      if (mountedRef.current) setIsLoading(false);
    }, 8000);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('firestore-error', errorHandler);
      unsubscribers.forEach(u => u());
      clearTimeout(timeout);
      clearTimeout(minTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const elos = React.useMemo(() => {
    const result: Record<string, number> = {};
    players.forEach(p => { result[p.id] = p.elo || 1200; });
    return result;
  }, [players]);

  const rankedPlayers = React.useMemo(() => sortRankedPlayers(players), [players]);

  const enrichedLeaders = React.useMemo(() => leaders.map(l => {
    if (l.playerId) {
      const p = players.find(player => player.id === l.playerId);
      if (p) return { ...l, name: p.name, image: p.image };
    }
    return l;
  }), [leaders, players]);

  const value = React.useMemo(() => ({
    players,
    rankedPlayers,
    leaders: enrichedLeaders,
    matches,
    tournaments,
    systemLocks,
    elos,
    isLoading,
    dbError,
    hasPendingWrites,
    appVersion,
    refreshData,
  }), [players, rankedPlayers, enrichedLeaders, matches, tournaments, systemLocks, elos, isLoading, dbError, hasPendingWrites, appVersion, refreshData]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

/**
 * Call this after any admin write to force non-admin users to re-fetch on next navigation.
 * Also evicts the localStorage cache so a page refresh gives fresh data.
 */
export function invalidateGlobalCache() {
  if (_globalCache) _globalCache.fetchedAt = 0;
  invalidateStorage(); // bust localStorage too
}

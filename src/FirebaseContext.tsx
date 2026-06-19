import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
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
  fetchAppSnapshot,
  AppSnapshot,
} from './lib/store';
import { isAdminUser } from './lib/utils';
import { VERSION } from './constants';
import {
  persistToStorage,
  hydrateFromStorage,
  invalidateStorage,
  trackRead,
  getSessionReadCount,
  AppSnapshot,
} from './lib/cache';

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CACHE — 60-minute in-memory TTL (zero re-reads on tab navigation)
// STORAGE CACHE — 60-minute localStorage TTL (zero re-reads on page refresh)
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes in-memory — reduces cold-start reads by 50%
/** How often non-admin users re-check systemLocks (tiny single doc). */
const LOCKS_POLL_INTERVAL_MS = 60 * 60 * 1000; // 60 minutes — reduced from 30 min (was 5 min = 4,800 reads/day for 50 users)
/** How often admin auto-refreshes collection data (replaces persistent listeners). */
const ADMIN_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 60 minutes

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
// StrictMode protection - prevents double initialization
let _initStarted = false;
// Global read counter for debugging
let _sessionReadCount = 0;
const _readLog: string[] = [];

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
  const storedSystemLocks = hydrateFromStorage<Record<string, boolean>>('systemLocks') ?? _globalCache?.systemLocks ?? {};
  // Note: appVersion uses a simple string key, not the JSON cache format
  const storedAppVersion = (() => {
    try {
      const raw = localStorage.getItem('efc_appVersion');
      if (raw) {
        const entry = JSON.parse(raw);
        // Check if version cache is still valid (60 min TTL)
        if (Date.now() - entry.savedAt < CACHE_TTL_MS) {
          return entry.version;
        }
      }
    } catch { /* ignore */ }
    return VERSION;
  })();

  const [players, setPlayers] = useState<Player[]>(storedPlayers);
  const [leaders, setLeaders] = useState<Leader[]>(storedLeaders);
  const [matches, setMatches] = useState<MatchRecord[]>(storedMatches);
  const [tournaments, setTournaments] = useState<Tournament[]>(storedTournaments);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>(storedSystemLocks);
  // Only show spinner on a true cold start with zero cached data
  const hasCachedData =
    storedPlayers.length > 0 ||
    (_globalCache !== null && _globalCache.players.length > 0);
  const [isLoading, setIsLoading] = useState(!hasCachedData);
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [appVersion, setAppVersion] = useState<string>(storedAppVersion);

  // Ref to avoid stale-closure issues in the poll callback
  const mountedRef = useRef(true);
  // Track whether we've done the initial one-time fetch so refreshData can force re-fetch
  const lastFetchedAt = useRef<number>(storedPlayers.length > 0 ? Date.now() : 0);

  // ─── Non-admin one-time fetch (shared by mount + refreshData) ──────────────
  const loadOnce = useCallback(async (force = false) => {
    if (!mountedRef.current) return;

    // Check fresh from localStorage (not the stale closure value)
    const freshPlayers = hydrateFromStorage<Player[]>('players');
    const cacheAge = Date.now() - lastFetchedAt.current;
    
    // Debug: Log localStorage state
    const localStorageKeys = Object.keys(localStorage).filter(k => k.startsWith('efc_'));
    console.log('[FirebaseContext DEBUG] loadOnce called', { 
      force, 
      cacheAge, 
      hasLocalStorage: !!freshPlayers, 
      playerCount: freshPlayers?.length || 0,
      localStorageEfcKeys: localStorageKeys,
      lastFetchedAt: lastFetchedAt.current
    });
    
    // Only skip if NOT forced, cache is fresh, AND we have players in localStorage
    if (!force && cacheAge < CACHE_TTL_MS && freshPlayers && freshPlayers.length > 0) {
      console.log('[FirebaseContext] Skipping load - cache fresh (age:', cacheAge, 'ms)');
      return;
    }

    console.log('[FirebaseContext] Starting loadOnce', { force, cacheAge, hasLocalStorage: !!freshPlayers, playerCount: freshPlayers?.length || 0 });
    const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';

    // Hard timeout: never show spinner for more than 3 seconds
    const loadingTimeout = setTimeout(() => {
      if (mountedRef.current) setIsLoading(false);
    }, 3000);

    try {
      // ── SNAPSHOT FAST PATH (1 read instead of 70-120) ────────────────────
      // Try the precomputed appSnapshot document first.
      // Falls back to individual fetches if snapshot doesn't exist yet.
      
      // First check localStorage cache for appSnapshot
      const cachedSnapshot = hydrateFromStorage<AppSnapshot>('appSnapshot');
      if (cachedSnapshot && cachedSnapshot.leaderboard && cachedSnapshot.leaderboard.length > 0) {
        console.log('[FirebaseContext] Using cached appSnapshot from localStorage');
        const p = cachedSnapshot.leaderboard;
        const t = cachedSnapshot.activeTournaments || [];
        
        setPlayers(p);
        setTournaments(t);
        setIsLoading(false);
        clearTimeout(loadingTimeout);

        const [l, m] = await Promise.all([
          fetchLeadersOnce(),
          isPlayer ? fetchMatchesOnce(50) : Promise.resolve([] as MatchRecord[]),
        ]);
        if (!mountedRef.current) return;
        setLeaders(l);
        setMatches(m);
        persistToStorage('players', p);
        persistToStorage('leaders', l);
        if (m.length) persistToStorage('matches', m);
        if (t.length) persistToStorage('tournaments', t);
        _globalCache = { players: p, leaders: l, matches: m, tournaments: t, systemLocks: _globalCache?.systemLocks || {}, fetchedAt: Date.now() };
        lastFetchedAt.current = Date.now();
        console.log('[FirebaseContext] loadOnce complete via cached appSnapshot - players:', p.length);
        return;
      }
      
      const snapshot = await fetchAppSnapshot();
      if (snapshot && snapshot.leaderboard && snapshot.leaderboard.length > 0) {
        if (!mountedRef.current) { clearTimeout(loadingTimeout); return; }
        console.log('[FirebaseContext] Using appSnapshot fast path');
        const p = snapshot.leaderboard;
        const t = snapshot.activeTournaments || [];
        
        // Persist appSnapshot to localStorage for fast subsequent loads
        persistToStorage('appSnapshot', snapshot);
        
        // Show data immediately to hide the loading screen
        setPlayers(p);
        setTournaments(t);
        setIsLoading(false);
        clearTimeout(loadingTimeout);

        // Leaders and matches still need separate fetches (not in appSnapshot)
        // but only if we're a logged-in player (guests see minimal data)
        const [l, m] = await Promise.all([
          fetchLeadersOnce(),
          isPlayer ? fetchMatchesOnce(50) : Promise.resolve([] as MatchRecord[]),
        ]);
        if (!mountedRef.current) return;
        setLeaders(l);
        setMatches(m);
        persistToStorage('players', p);
        persistToStorage('leaders', l);
        if (m.length) persistToStorage('matches', m);
        if (t.length) persistToStorage('tournaments', t);
        _globalCache = { players: p, leaders: l, matches: m, tournaments: t, systemLocks: _globalCache?.systemLocks || {}, fetchedAt: Date.now() };
        lastFetchedAt.current = Date.now();
        console.log('[FirebaseContext] loadOnce complete via appSnapshot - players:', p.length, 'matches:', m.length);
        return; // ← done in 2-3 reads instead of 70-120
      }

      // ── FALLBACK: Individual fetches (first run, no snapshot yet) ─────────
      console.log('[FirebaseContext] Using fallback individual fetches');
      const playerLimit = isPlayer ? 50 : 30;

      // Fetch players first — as soon as they arrive, hide the spinner
      const p = await fetchPlayersOnce(playerLimit);
      if (!mountedRef.current) { clearTimeout(loadingTimeout); return; }
      setPlayers(p);
      setIsLoading(false);
      clearTimeout(loadingTimeout);

      // Fetch the rest in the background (non-blocking)
      Promise.all([
        fetchLeadersOnce(),
        isPlayer ? fetchMatchesOnce(50) : Promise.resolve([] as MatchRecord[]),
        fetchTournamentsOnce(20),
      ]).then(([l, m, t]) => {
        trackRead(p.length + l.length + m.length + t.length);
        if (!mountedRef.current) return;
        setLeaders(l);
        setMatches(m);
        setTournaments(t);
        lastFetchedAt.current = Date.now();
        persistToStorage('players', p);
        persistToStorage('leaders', l);
        persistToStorage('matches', m);
        persistToStorage('tournaments', t);
        _globalCache = {
          players: p,
          leaders: l,
          matches: m,
          tournaments: t,
          systemLocks: _globalCache?.systemLocks || {},
          fetchedAt: Date.now(),
        };
      }).catch(err => console.warn('[FirebaseContext] Background fetch failed:', err));
    } catch (err) {
      console.warn('[FirebaseContext] One-time fetch failed:', err);
      clearTimeout(loadingTimeout);
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



    // Global error handler
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mountedRef.current || !customEvent.detail?.error) return;
      const errStr = String(customEvent.detail.error).toLowerCase();
      setIsLoading(false);
      const isAdmin = isAdminUser();
      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || errStr.includes('exceeded')) {
        if (isAdmin) setDbError('QUOTA_EXCEEDED');
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

    // Revocation check for Player Admins — POLLING instead of persistent listener
    // onSnapshot kept a permanent WebSocket open for every player admin
    // Polling every 30 min with cache = ~48 reads/day vs 24/7 WebSocket
    const pRole = localStorage.getItem('playerRole');
    const pId = localStorage.getItem('playerId');
    if (pRole === 'admin' && pId) {
      let revocationCheckInterval: ReturnType<typeof setInterval> | null = null;
      
      const checkRevocation = async () => {
        if (document.hidden) return; // Skip when tab is hidden
        // Check if we recently verified (within 30 min)
        const lastCheck = localStorage.getItem('efc_revocationLastCheck_v1');
        if (lastCheck && Date.now() - parseInt(lastCheck) < 30 * 60 * 1000) return;
        
        try {
          const { db } = await import('./firebase');
          const { getDoc, doc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'players', pId));
          trackRead(1);
          localStorage.setItem('efc_revocationLastCheck_v1', Date.now().toString());
          if (snap.exists() && snap.data().role !== 'admin') {
            const realRole = snap.data().role || 'player';
            localStorage.setItem('playerRole', realRole);
            localStorage.setItem('userType', 'player');
            window.dispatchEvent(new StorageEvent('storage', { key: 'playerRole', newValue: realRole }));
            window.dispatchEvent(new StorageEvent('storage', { key: 'auth', newValue: 'player' }));
            if (window.location.hash.includes('/admin')) {
              window.location.hash = '/';
            }
            // Stop polling once revoked
            if (revocationCheckInterval) clearInterval(revocationCheckInterval);
          }
        } catch {
          // Fail silently — non-critical check
        }
      };

      // Poll every 30 minutes instead of persistent listener
      revocationCheckInterval = setInterval(checkRevocation, 30 * 60 * 1000);
      checkRevocation(); // Check once immediately
      
      unsubscribers.push(() => {
        if (revocationCheckInterval) clearInterval(revocationCheckInterval);
      });
    }

    // Check if either Master Password or Player Admin is active
    const isAdmin = isAdminUser();

    if (isAdmin) {
      // ── ADMIN: ONE-TIME FETCH + visibility-aware polling ──────────────────
      // Replaced persistent onSnapshot listeners with polling to reduce reads.
      // onSnapshot fires on EVERY write to the collection, causing ~350 reads per match entry.
      // Polling only reads once per interval, cutting listener-related reads by ~95%.
      // Visibility API ensures NO reads when tab is in background.
      // Register admin session (1 write — needed for Firestore security rules)
      ensureAdminSession();

      let adminPollTimers: ReturnType<typeof setInterval>[] = [];

      const stopAdminPolling = () => {
        adminPollTimers.forEach(t => clearInterval(t));
        adminPollTimers = [];
      };

      const handleAdminVisibilityChange = () => {
        if (document.hidden) {
          stopAdminPolling();
          console.log('[Admin] Tab hidden - stopped all polling');
        } else {
          // Restart polling when tab becomes visible
          startAdminPolling();
          console.log('[Admin] Tab visible - resumed polling');
        }
      };

      document.addEventListener('visibilitychange', handleAdminVisibilityChange);
      unsubscribers.push(() => {
        document.removeEventListener('visibilitychange', handleAdminVisibilityChange);
        stopAdminPolling();
      });

      // systemLocks — polling with cache check (only when visible)
      const pollSystemLocks = async () => {
        if (!mountedRef.current || document.hidden) return;
        // Check if systemLocks cache is still fresh using the stored timestamp
        const storedLocksRaw = localStorage.getItem('efc_systemLocks_v4');
        if (storedLocksRaw) {
          try {
            const entry = JSON.parse(storedLocksRaw);
            if (Date.now() - entry.savedAt < CACHE_TTL_MS) return; // Cache fresh, skip
          } catch { /* ignore */ }
        }
        
        try {
          const locks = await fetchSystemLocks();
          trackRead(1);
          setSystemLocks(locks);
          if (_globalCache) _globalCache.systemLocks = locks;
          persistToStorage('systemLocks', locks);
        } catch {
          // Non-critical — fail silently
        }
      };

      // appVersion — polling with cache check (only when visible)
      const pollAppVersion = async () => {
        if (!mountedRef.current || document.hidden) return;
        // Check if appVersion cache is still fresh
        const storedVersionRaw = localStorage.getItem('efc_appVersion');
        if (storedVersionRaw) {
          try {
            const entry = JSON.parse(storedVersionRaw);
            if (Date.now() - entry.savedAt < CACHE_TTL_MS) return; // Cache fresh, skip
          } catch { /* ignore */ }
        }
        
        try {
          const { db } = await import('./firebase');
          const { getDoc, doc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'settings', 'version'));
          trackRead(1);
          if (snap.exists() && mountedRef.current) {
            const newVersion = snap.data().currentVersion || VERSION;
            setAppVersion(newVersion);
            // Save to localStorage with timestamp for cache check
            localStorage.setItem('efc_appVersion', JSON.stringify({ version: newVersion, savedAt: Date.now() }));
          }
        } catch {
          // Non-critical — fail silently
        }
      };

      // Main admin data fetch — polling only when visible
      const doFetch = async () => {
        if (!mountedRef.current || document.hidden) return;
        // Skip if cache is still fresh (within TTL)
        if (_globalCache && Date.now() - _globalCache.fetchedAt < CACHE_TTL_MS) {
          console.log('[Admin] Cache fresh, skipping fetch');
          return;
        }
        // Hard timeout: never show spinner for more than 3s even if Firestore is slow
        const adminTimeout = setTimeout(() => {
          if (mountedRef.current) setIsLoading(false);
        }, 3000);

        try {
          // Fetch players first
          const p = await fetchPlayersOnce(50); // reduced from 200 — sufficient for admin UI
          if (!mountedRef.current) { clearTimeout(adminTimeout); return; }
          setPlayers(p);
          setIsLoading(false);
          clearTimeout(adminTimeout);

          Promise.all([
            fetchLeadersOnce(),
            fetchMatchesOnce(50),          // reduced from 100
            fetchTournamentsOnce(20),      // reduced from 50
          ]).then(([l, m, t]) => {
            if (!mountedRef.current) return;
            setLeaders(l);
            setMatches(m);
            setTournaments(t);
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
            persistToStorage('players', p);
            persistToStorage('leaders', l);
            persistToStorage('matches', m);
            persistToStorage('tournaments', t);
          }).catch(err => console.warn('[FirebaseContext] Admin background fetch failed:', err));
        } catch (err) {
          console.warn('[FirebaseContext] Admin fetch failed:', err);
          clearTimeout(adminTimeout);
          if (mountedRef.current) setIsLoading(false);
        }
      };

      // Start all polling (only runs when tab is visible)
      const startAdminPolling = () => {
        stopAdminPolling(); // Clear any existing timers
        
        // Immediate fetches on visibility change (with cache check)
        pollSystemLocks();
        pollAppVersion();
        
        // Set up polling intervals
        adminPollTimers.push(setInterval(pollSystemLocks, LOCKS_POLL_INTERVAL_MS));
        adminPollTimers.push(setInterval(pollAppVersion, LOCKS_POLL_INTERVAL_MS));
        adminPollTimers.push(setInterval(doFetch, ADMIN_REFRESH_INTERVAL_MS));
        
        // Check localStorage cache for main data too
        const localStorageCacheFresh = storedPlayers.length > 0;
        if (!localStorageCacheFresh) {
          doFetch(); // Only fetch if no localStorage cache
        } else {
          // Use cached data, just update _globalCache
          _globalCache = {
            players: storedPlayers,
            leaders: storedLeaders,
            matches: storedMatches,
            tournaments: storedTournaments,
            systemLocks: storedSystemLocks,
            fetchedAt: Date.now(),
          };
          setPlayers(storedPlayers);
          setLeaders(storedLeaders);
          setMatches(storedMatches);
          setTournaments(storedTournaments);
          setSystemLocks(storedSystemLocks);
          setIsLoading(false);
        }
      };

      // Start polling if tab is currently visible
      if (!document.hidden) {
        startAdminPolling();
      }

      // Expose doFetch so refreshData can trigger it manually
      _adminFetchRef = doFetch;


    } else {
      // ── PLAYER / GUEST: ONE-TIME FETCH + controlled polling ───────────────
      // NO persistent WebSocket connections for regular users.
      // ONLY poll when tab is visible (Page Visibility API)

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
        // Use ref to prevent StrictMode double-execution
        if (!_initStarted) {
          _initStarted = true;
          loadOnce(true);
        }
      }

      // ── systemLocks: fetch with localStorage cache ────────────────────────
      // Only poll Firestore if localStorage cache is expired (> 60 min old)
      const checkAndFetchLocks = () => {
        const storedLocksRaw = localStorage.getItem('efc_systemLocks_v4');
        if (storedLocksRaw) {
          try {
            const entry = JSON.parse(storedLocksRaw);
            if (Date.now() - entry.savedAt < CACHE_TTL_MS) return; // Cache fresh, skip
          } catch { /* ignore */ }
        }
        // Cache expired or missing — fetch from Firestore
        fetchSystemLocks()
          .then(locks => {
            trackRead(1);
            if (!mountedRef.current) return;
            setSystemLocks(locks);
            if (_globalCache) _globalCache.systemLocks = locks;
            persistToStorage('systemLocks', locks);
          })
          .catch(() => {
            // Non-critical — fail silently, use cached data
          });
      };
      checkAndFetchLocks();

      // ── appVersion: fetch with localStorage cache ─────────────────────────
      const checkAndFetchVersion = () => {
        const storedVersionRaw = localStorage.getItem('efc_appVersion');
        if (storedVersionRaw) {
          try {
            const entry = JSON.parse(storedVersionRaw);
            if (Date.now() - entry.savedAt < CACHE_TTL_MS) return; // Cache fresh, skip
          } catch { /* ignore */ }
        }
        // Cache expired or missing — fetch from Firestore
        import('./firebase').then(({ db }) => {
          import('firebase/firestore').then(({ getDoc, doc }) => {
            getDoc(doc(db, 'settings', 'version'))
              .then(snap => {
                trackRead(1);
                if (snap.exists() && mountedRef.current) {
                  const newVersion = snap.data().currentVersion || VERSION;
                  setAppVersion(newVersion);
                  localStorage.setItem('efc_appVersion', JSON.stringify({ version: newVersion, savedAt: Date.now() }));
                }
              })
              .catch(() => {}); // Non-critical
          });
        });
      };
      checkAndFetchVersion();
    }



    return () => {
      mountedRef.current = false;
      window.removeEventListener('firestore-error', errorHandler);
      unsubscribers.forEach(u => u());
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

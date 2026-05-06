import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToAppVersion,
  subscribeToSystemLocks,
  subscribeToPlayers,
  subscribeToLeaders,
  subscribeToMatches,
  subscribeToTournaments,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  addMatch,
  fetchPlayersOnce,
  fetchLeadersOnce,
  fetchMatchesOnce,
  fetchTournamentsOnce,
  ensureAdminSession,
} from './lib/store';
import { VERSION } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CACHE — 15-minute TTL
// One fetch per session for non-admin users. Zero re-reads on navigation.
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
let _globalCache: {
  players: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  fetchedAt: number;
} | null = null;

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
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(_globalCache?.players || []);
  const [leaders, setLeaders] = useState<Leader[]>(_globalCache?.leaders || []);
  const [matches, setMatches] = useState<MatchRecord[]>(_globalCache?.matches || []);
  const [tournaments, setTournaments] = useState<Tournament[]>(_globalCache?.tournaments || []);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>(_globalCache?.systemLocks || {});
  const [isLoading, setIsLoading] = useState(!_globalCache || _globalCache.players.length === 0);
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [appVersion, setAppVersion] = useState<string>(VERSION);

  useEffect(() => {
    let mounted = true;
    const unsubscribers: (() => void)[] = [];

    // Minimum branding delay
    const minTimer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 1200);

    // Global error handler
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mounted || !customEvent.detail?.error) return;
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

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    // ── ALWAYS: System locks (tiny single doc) ────────────────────────────────
    unsubscribers.push(subscribeToSystemLocks((locks) => {
      if (!mounted) return;
      setSystemLocks(locks);
      if (_globalCache) _globalCache.systemLocks = locks;
    }));

    // ── ALWAYS: App version (tiny single doc) ─────────────────────────────────
    unsubscribers.push(subscribeToAppVersion((version) => {
      if (mounted && version) setAppVersion(version);
    }));

    if (isAdmin) {
      // ── ADMIN: Real-time subscriptions (1 admin only, cost acceptable) ──────
      ensureAdminSession();
      testFirestoreConnection();

      unsubscribers.push(subscribeToPlayers((data, pending) => {
        if (!mounted) return;
        setPlayers(data);
        setHasPendingWrites(pending);
        setIsLoading(false);
        if (_globalCache) { _globalCache.players = data; _globalCache.fetchedAt = Date.now(); }
      }, 100));

      unsubscribers.push(subscribeToLeaders((data) => {
        if (!mounted) return;
        setLeaders(data);
        if (_globalCache) _globalCache.leaders = data;
      }));

      unsubscribers.push(subscribeToMatches((data) => {
        if (!mounted) return;
        setMatches(data);
        if (_globalCache) _globalCache.matches = data;
      }));

      unsubscribers.push(subscribeToTournaments((data) => {
        if (!mounted) return;
        setTournaments(data);
        if (_globalCache) _globalCache.tournaments = data;
      }));

    } else {
      // ── PLAYER / GUEST: ONE-TIME FETCH — zero ongoing listener cost ──────────
      // Check if cache is still fresh (within TTL)
      const cacheAge = _globalCache ? Date.now() - (_globalCache.fetchedAt || 0) : Infinity;
      const cacheIsFresh = cacheAge < CACHE_TTL_MS && _globalCache && _globalCache.players.length > 0;

      if (cacheIsFresh) {
        // Serve instantly from memory — 0 Firestore reads
        setPlayers(_globalCache!.players);
        setLeaders(_globalCache!.leaders);
        setMatches(_globalCache!.matches);
        setTournaments(_globalCache!.tournaments);
        setSystemLocks(_globalCache!.systemLocks);
        setIsLoading(false);
      } else {
        // Fetch once, cache for 15 minutes
        const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';
        const playerLimit = isPlayer ? 100 : 15; // guests get fewer

        const loadOnce = async () => {
          try {
            const [p, l, m, t] = await Promise.all([
              fetchPlayersOnce(playerLimit),
              fetchLeadersOnce(),
              isPlayer ? fetchMatchesOnce(50) : Promise.resolve([] as MatchRecord[]),
              fetchTournamentsOnce(20),
            ]);

            if (!mounted) return;

            setPlayers(p);
            setLeaders(l);
            setMatches(m);
            setTournaments(t);

            // Populate cache so next navigation costs 0 reads
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
            if (mounted) setIsLoading(false);
          }
        };

        loadOnce();
      }
    }

    // Safety timeout — never block UI more than 8s
    const timeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 8000);

    return () => {
      mounted = false;
      window.removeEventListener('firestore-error', errorHandler);
      unsubscribers.forEach(u => u());
      clearTimeout(timeout);
      clearTimeout(minTimer);
    };
  }, []);

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
    appVersion
  }), [players, rankedPlayers, enrichedLeaders, matches, tournaments, systemLocks, elos, isLoading, dbError, hasPendingWrites, appVersion]);

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

/** Call this after any admin write to force non-admin users to re-fetch on next navigation. */
export function invalidateGlobalCache() {
  if (_globalCache) _globalCache.fetchedAt = 0;
}

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToPlayers,
  subscribeToLeaders,
  subscribeToMatches,
  subscribeToAppVersion,
  subscribeToSystemLocks,
  subscribeToTournaments,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  addMatch,
  fetchPlayersOnce,
  fetchLeadersOnce,
  ensureAdminSession,
} from './lib/store';
import { VERSION } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL MODULE CACHE
// Prevents redundant Firestore reads when navigating between pages.
// ─────────────────────────────────────────────────────────────────────────────
let _globalCache: {
  players: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  systemLocks: Record<string, boolean>;
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
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(!_globalCache);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(!_globalCache);
  const [isLoadingMatches, setIsLoadingMatches] = useState(!_globalCache);
  const [isMinLoadTimePassed, setIsMinLoadTimePassed] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [appVersion, setAppVersion] = useState<string>(VERSION);

  useEffect(() => {
    let mounted = true;
    const unsubscribers: (() => void)[] = [];

    // Minimum delay for branding aesthetics
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 1000);

    // Error handler
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mounted || !customEvent.detail?.error) return;
      const errStr = String(customEvent.detail.error).toLowerCase();
      setIsLoadingPlayers(false);
      setIsLoadingLeaders(false);
      setIsLoadingMatches(false);
      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || errStr.includes('exceeded')) {
        setDbError('QUOTA_EXCEEDED');
      } else {
        setDbError('DATABASE_ERROR');
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    // Anonymous auth for all users
    import('./firebase').then(({ loginAnonymously, auth }) => {
      if (!auth.currentUser) {
        loginAnonymously().catch(err => console.warn('[Firebase] Anonymous login failed:', err));
      }
    });

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';

    // 1. System Locks — real-time for everyone (tiny doc)
    unsubscribers.push(subscribeToSystemLocks((locks) => {
      if (mounted) {
        setSystemLocks(locks);
        if (_globalCache) _globalCache.systemLocks = locks;
      }
    }));

    if (isAdmin) {
      // ── ADMIN: Full real-time subscriptions ──────────────────────────────
      ensureAdminSession(); 
      testFirestoreConnection();

      unsubscribers.push(subscribeToPlayers((data, pending) => {
        if (!mounted) return;
        setPlayers(data);
        setIsLoadingPlayers(false);
        setHasPendingWrites(pending);
        if (_globalCache) _globalCache.players = data;
      }, 100));

      unsubscribers.push(subscribeToLeaders((data) => {
        if (!mounted) return;
        setLeaders(data);
        setIsLoadingLeaders(false);
        if (_globalCache) _globalCache.leaders = data;
      }));

      unsubscribers.push(subscribeToMatches((data, pending) => {
        if (!mounted) return;
        setMatches(data);
        setIsLoadingMatches(false);
        if (_globalCache) _globalCache.matches = data;
      }));

      unsubscribers.push(subscribeToTournaments((data) => {
        if (!mounted) return;
        setTournaments(data);
        if (_globalCache) _globalCache.tournaments = data;
      }));

      unsubscribers.push(subscribeToAppVersion((version) => {
        if (mounted && version) {
          setAppVersion(version);
        }
      }));

    } else if (isPlayer) {
      // ── PLAYER: Live players, leaders, tournaments. No match history. ──
      unsubscribers.push(subscribeToPlayers((data, pending) => {
        if (!mounted) return;
        setPlayers(data);
        setIsLoadingPlayers(false);
        setHasPendingWrites(pending);
        if (_globalCache) _globalCache.players = data;
      }, 100));

      unsubscribers.push(subscribeToLeaders((data) => {
        if (!mounted) return;
        setLeaders(data);
        setIsLoadingLeaders(false);
        if (_globalCache) _globalCache.leaders = data;
      }));

      unsubscribers.push(subscribeToTournaments((data) => {
        if (!mounted) return;
        setTournaments(data);
        if (_globalCache) _globalCache.tournaments = data;
      }, 20));

      setIsLoadingMatches(false);

    } else {
      // ── GUEST: One-time fetches only — maximum quota protection ──────────
      const loadGuestData = async () => {
        try {
          if (_globalCache && _globalCache.players.length > 0) {
            setPlayers(_globalCache.players);
            setLeaders(_globalCache.leaders);
          } else {
            const [guestPlayers, guestLeaders] = await Promise.all([
              fetchPlayersOnce(15),
              fetchLeadersOnce(),
            ]);
            if (mounted) {
              setPlayers(guestPlayers);
              setLeaders(guestLeaders);
              if (_globalCache) {
                _globalCache.players = guestPlayers;
                _globalCache.leaders = guestLeaders;
              }
            }
          }
        } catch (e) {
          console.warn('[Guest] Data fetch failed:', e);
        } finally {
          if (mounted) {
            setIsLoadingPlayers(false);
            setIsLoadingLeaders(false);
          }
        }
      };
      loadGuestData();
      setIsLoadingMatches(false);
    }

    if (!_globalCache) {
      _globalCache = { players: [], leaders: [], matches: [], tournaments: [], systemLocks: {} };
    }

    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
        setIsMinLoadTimePassed(true);
      }
    }, 8000);

    return () => {
      mounted = false;
      window.removeEventListener('firestore-error', errorHandler);
      unsubscribers.forEach(u => u());
      clearTimeout(timeout);
      clearTimeout(minLoadTimer);
    };
  }, []);

  const playersRef = useRef(players);
  const matchesRef = useRef(matches);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { matchesRef.current = matches; }, [matches]);

  const elos = React.useMemo(() => computeGlobalElo(players, matches), [players, matches]);

  const rankedPlayers = React.useMemo(() => sortRankedPlayers(players), [players]);

  const enrichedLeaders = React.useMemo(() => leaders.map(l => {
    if (l.playerId) {
      const p = players.find(player => player.id === l.playerId);
      if (p) return { ...l, name: p.name, image: p.image };
    }
    return l;
  }), [leaders, players]);

  const isLoading = isLoadingPlayers || isLoadingLeaders || isLoadingMatches || !isMinLoadTimePassed;

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
  }), [
    players,
    rankedPlayers,
    enrichedLeaders,
    matches,
    tournaments,
    systemLocks,
    elos,
    isLoading,
    dbError,
    hasPendingWrites,
    appVersion
  ]);

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

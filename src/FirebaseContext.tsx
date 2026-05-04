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
  fetchPlayers,
  fetchLeaders,
  fetchMatches,
  fetchTournaments
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

    // Minimum delay for branding aesthetics - Reduced for responsiveness
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 1000);

    // ─────────────────────────────────────────────────────────────────────────
    // Quota Awareness & Error handling
    // ─────────────────────────────────────────────────────────────────────────
    const checkQuota = (err: any) => {
      const errStr = String(err).toLowerCase();
      if (errStr.includes('quota') || errStr.includes('exceeded') || errStr.includes('resource-exhausted')) {
        setDbError('QUOTA_EXCEEDED');
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
        setIsMinLoadTimePassed(true);
        return true;
      }
      return false;
    };

    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mounted || !customEvent.detail?.error) return;
      if (checkQuota(customEvent.detail.error)) return;

      const errStr = String(customEvent.detail.error).toLowerCase();
      if (errStr.includes('offline')) {
        console.warn('[Firebase] Client reported offline');
      } else {
        setDbError('DATABASE_ERROR');
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    // ─────────────────────────────────────────────────────────────────────────
    // Ensure anonymous auth for guests
    // ─────────────────────────────────────────────────────────────────────────
    import('./firebase').then(({ loginAnonymously, auth }) => {
      if (!auth.currentUser) {
        loginAnonymously().catch(err => console.warn('[Firebase] Anonymous login failed:', err));
      }
    });

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';

    // Only probe server health for admins — guests use IndexedDB persistence as fallback
    if (isAdmin) testFirestoreConnection();

    // ─────────────────────────────────────────────────────────────────────────
    // OPTIMIZED DATA FETCHING (PULL + CACHE)
    // ─────────────────────────────────────────────────────────────────────────
    const loadInitialData = async () => {
      if (!mounted) return;
      try {
        const [p, l, m, t] = await Promise.all([
          fetchPlayers(isAdmin ? 100 : (isPlayer ? 60 : 30)),
          fetchLeaders(),
          isAdmin ? fetchMatches(100) : Promise.resolve([]),
          fetchTournaments()
        ]);

        if (mounted) {
          setPlayers(p);
          setLeaders(l);
          setMatches(m);
          setTournaments(t);
          
          setIsLoadingPlayers(false);
          setIsLoadingLeaders(false);
          setIsLoadingMatches(false);
          setIsMinLoadTimePassed(true);
          
          if (_globalCache) {
            _globalCache.players = p;
            _globalCache.leaders = l;
            _globalCache.matches = m;
            _globalCache.tournaments = t;
          }
        }
      } catch (err) {
        if (mounted) {
          checkQuota(err);
          setIsLoadingPlayers(false);
          setIsLoadingLeaders(false);
          setIsLoadingMatches(false);
          setIsMinLoadTimePassed(true);
        }
      }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // REAL-TIME SUBSCRIPTIONS (MINIMAL)
    // ─────────────────────────────────────────────────────────────────────────
    // 1. System Locks — Always needed (tiny doc)
    const unsubLocks = subscribeToSystemLocks((locks) => {
      if (mounted) {
        setSystemLocks(locks);
        if (_globalCache) _globalCache.systemLocks = locks;
      }
    });

    // 1b. App Version — Real-time update monitoring (tiny doc)
    const unsubVersion = subscribeToAppVersion((version) => {
      if (mounted && version) {
        setAppVersion(version);
        console.log('[System] DB Version:', version, 'Code Version:', VERSION);
      }
    });

    // Initial Pull
    loadInitialData();

    // 2. Only subscribe to big collections if Admin is logged in 
    // This allows admins to see changes live while managing, 
    // but saves 1000s of reads for regular users.
    let unsubPlayers: () => void = () => {};
    let unsubLeaders: () => void = () => {};
    let unsubMatches: () => void = () => {};
    let unsubTournaments: () => void = () => {};

    if (isAdmin) {
      unsubLeaders = subscribeToLeaders((data) => {
        if (mounted) {
          setLeaders(data);
          if (_globalCache) _globalCache.leaders = data;
        }
      });

      unsubMatches = subscribeToMatches((data) => {
        if (mounted) {
          setMatches(data);
          if (_globalCache) _globalCache.matches = data;
        }
      });

      unsubPlayers = subscribeToPlayers((data) => {
        if (mounted) {
          setPlayers(data);
          if (_globalCache) _globalCache.players = data;
        }
      }, 100);

      unsubTournaments = subscribeToTournaments((data) => {
        if (mounted) {
          setTournaments(data);
          if (_globalCache) _globalCache.tournaments = data;
        }
      }, 50);
    }

    // Initialize cache on first success
    if (!_globalCache) {
      _globalCache = {
        players: [],
        leaders: [],
        matches: [],
        tournaments: [],
        systemLocks: {}
      };
    }

    // Merge cleanups
    const origUnsub = unsubPlayers;
    unsubPlayers = () => { 
      origUnsub(); 
      unsubLeaders();
      unsubMatches();
      unsubTournaments();
      unsubLocks(); 
      unsubVersion();
    };

    // Fallback: don't hang forever if Firestore takes too long
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
        setIsMinLoadTimePassed(true); // CRITICAL: Stop the black screen even if data hangs
        console.warn('[System] Loading timeout reached. Releasing UI lock.');
      }
    }, 4500);

    // ─────────────────────────────────────────────────────────────────────────
    // TOURNAMENT INTEGRATION: Handle messages from the embedded Tournament System
    // ─────────────────────────────────────────────────────────────────────────
    const handleTournamentMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      const { type, match } = event.data;

      // 1. Respond to player data requests
      if (type === 'REQUEST_PLAYERS' && event.source) {
        (event.source as Window).postMessage({
          type: 'PLAYERS_LIST',
          players: playersRef.current
        }, { targetOrigin: '*' });
      }

      // 2. Handle automated match recording
      if (type === 'MATCH_COMPLETED' && match) {
        const { p1Id, p1Score, p2Id, p2Score, tournament } = match;
        const player1 = playersRef.current.find(p => p.id === p1Id);
        const player2 = playersRef.current.find(p => p.id === p2Id);

        if (player1) {
          console.log('[Dashboard] Auto-recording tournament match:', match);
          addMatch(player1, p1Score, p2Score, player2, matchesRef.current, tournament)
            .catch(err => console.error('[Dashboard] Match recording failed:', err));
        }
      }
    };

    window.addEventListener('message', handleTournamentMessage);

    return () => {
      mounted = false;
      window.removeEventListener('firestore-error', errorHandler);
      window.removeEventListener('message', handleTournamentMessage);
      unsubPlayers();
      unsubLeaders();
      unsubMatches();
      unsubTournaments();
      clearTimeout(timeout);
      clearTimeout(minLoadTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync refs for the message handler
  const playersRef = useRef(players);
  const matchesRef = useRef(matches);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { matchesRef.current = matches; }, [matches]);

  // ─────────────────────────────────────────────────────────────────────────────
  // DERIVED STATE
  // OVR is trusted from the stored Player document (computed from full match history
  // during admin writes). We do NOT recompute from the capped 200-match feed.
  //
  // `elos` is still computed for the admin match-add flow (addMatch uses it for
  // the two affected players) but is NOT used to override stored ovr values.
  // ─────────────────────────────────────────────────────────────────────────────

  // Lightweight ELO map from the limited feed — used only for admin match-add UI
  const elos = React.useMemo(() => computeGlobalElo(players, matches), [players, matches]);

  // Players are served as-is from Firestore — ovr is already correct
  const enrichedLeaders = leaders.map(l => {
    if (l.playerId) {
      const p = players.find(player => player.id === l.playerId);
      if (p) return { ...l, name: p.name, image: p.image };
    }
    return l;
  });

  const isLoading = isLoadingPlayers || isLoadingLeaders || isLoadingMatches || !isMinLoadTimePassed;

  const value = {
    players,
    rankedPlayers: sortRankedPlayers(players),
    leaders: enrichedLeaders,
    matches,
    tournaments,
    systemLocks,
    elos,
    isLoading,
    dbError,
    hasPendingWrites,
    appVersion
  };

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

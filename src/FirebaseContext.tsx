import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToPlayers,
  subscribeToLeaders,
  subscribeToMatches,
  subscribeToAppVersion,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  addMatch
} from './lib/store';

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
  const [appVersion, setAppVersion] = useState<string>('1.0.0');

  useEffect(() => {
    let mounted = true;

    // Minimum delay for branding aesthetics
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 2500);

    // ─────────────────────────────────────────────────────────────────────────
    // Error handler — triggered by store.ts when Firestore errors occur
    // ─────────────────────────────────────────────────────────────────────────
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

    let unsubPlayers: () => void = () => {};
    let unsubLeaders: () => void = () => {};
    let unsubMatches: () => void = () => {};
    let unsubTournaments: () => void = () => {};

    // Only probe server health for admins — guests use IndexedDB persistence as fallback
    if (isAdmin) testFirestoreConnection();

    // ─────────────────────────────────────────────────────────────────────────
    // OPTIMIZED SUBSCRIPTIONS
    // ─────────────────────────────────────────────────────────────────────────
    // 1. System Locks — Always needed (tiny doc)
    const unsubLocks = subscribeToSystemLocks((locks) => {
      if (mounted) {
        setSystemLocks(locks);
        if (_globalCache) _globalCache.systemLocks = locks;
      }
    });

    // 1b. App Version — Real-time update monitoring
    const unsubVersion = subscribeToAppVersion((version) => {
      if (mounted) setAppVersion(version);
    });

    // 2. Leaders — Always needed for Home Page (small collection)
    unsubLeaders = subscribeToLeaders((data, pending) => {
      if (!mounted) return;
      setLeaders(data);
      setHasPendingWrites(pending);
      setIsLoadingLeaders(false);
      if (_globalCache) _globalCache.leaders = data;
    });

    // 3. Conditional Heavy Data (Matches, Players, Tournaments)
    // - Members (Admins & Players): Get the "Advanced" full firehose.
    // - Guests: Get the "Fast" optimized view to save your daily quota.
    if (isAdmin || isPlayer) {
      if (isAdmin) {
        unsubMatches = subscribeToMatches((data, pending) => {
          if (mounted) {
            setMatches(data);
            setIsLoadingMatches(false);
            if (_globalCache) _globalCache.matches = data;
          }
          matchesRef.current = data;
        });
      } else {
        setIsLoadingMatches(false);
      }

      unsubPlayers = subscribeToPlayers((data, pending) => {
        if (!mounted) return;
        setPlayers(data);
        setIsLoadingPlayers(false);
        if (_globalCache) _globalCache.players = data;
      }, 100);

      unsubTournaments = subscribeToTournaments((data, pending) => {
        if (!mounted) return;
        setTournaments(data);
        if (_globalCache) _globalCache.tournaments = data;
      });
    } else {
      // FOR GUESTS (The Free Tier protection):
      unsubPlayers = subscribeToPlayers((data) => {
        if (mounted) {
          setPlayers(data);
          setIsLoadingPlayers(false);
          if (_globalCache) _globalCache.players = data;
        }
      }, 15);

      // Guests now use a limited real-time subscription instead of an unbounded fetch
      unsubTournaments = subscribeToTournaments((data) => {
        if (mounted) {
          setTournaments(data);
          if (_globalCache) _globalCache.tournaments = data;
        }
      }, 10);

      setIsLoadingMatches(false);
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
      }
    }, 6000);

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

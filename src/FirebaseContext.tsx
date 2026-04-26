import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToPlayers,
  subscribeToLeaders,
  subscribeToMatches,
  subscribeToTournaments,
  subscribeToSystemLocks,
  fetchSystemLocks,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  calculateOvrHybrid,
  addMatch,
  fetchPlayers,
  fetchLeaders,
  fetchMatches,
  fetchTournaments
} from './lib/store';

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
  isLoading: boolean;
  dbError: string | null;
  hasPendingWrites: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>({});
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isMinLoadTimePassed, setIsMinLoadTimePassed] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);

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

    let unsubPlayers: () => void = () => {};
    let unsubLeaders: () => void = () => {};
    let unsubMatches: () => void = () => {};
    let unsubTournaments: () => void = () => {};

    // Always probe server health
    testFirestoreConnection();

    // ─────────────────────────────────────────────────────────────────────────
    // UNIVERSAL REAL-TIME SUBSCRIPTIONS
    // ─────────────────────────────────────────────────────────────────────────
    // We rely on Firebase's native enableMultiTabIndexedDbPersistence()
    // and onSnapshot() resume tokens. 
    // - Initial load: 0 reads (served from local IndexedDB cache)
    // - Updates: 1 read per changed document (Delta sync)
    // ─────────────────────────────────────────────────────────────────────────

    unsubPlayers = subscribeToPlayers((data, pending) => {
      if (!mounted) return;
      setPlayers(data);
      setHasPendingWrites(pending);
      setIsLoadingPlayers(false);
    });

    unsubLeaders = subscribeToLeaders((data, pending) => {
      if (!mounted) return;
      setLeaders(data);
      setHasPendingWrites(pending);
      setIsLoadingLeaders(false);
    });

    unsubMatches = subscribeToMatches((data, pending) => {
      if (!mounted) return;
      setMatches(data);
      setHasPendingWrites(pending);
      setIsLoadingMatches(false);
    });

    unsubTournaments = subscribeToTournaments((data, pending) => {
      if (!mounted) return;
      setTournaments(data);
      setHasPendingWrites(pending);
    });

    const unsubLocks = subscribeToSystemLocks((locks) => {
      if (mounted) setSystemLocks(locks);
    });

    // Merge cleanups
    const origUnsub = unsubPlayers;
    unsubPlayers = () => { 
      origUnsub(); 
      unsubLeaders();
      unsubMatches();
      unsubTournaments();
      unsubLocks(); 
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

  const elos = React.useMemo(() => computeGlobalElo(players, matches), [players, matches]);
  const enrichedPlayers = players.map(p => ({
    ...p,
    ovr: calculateOvrHybrid(p, elos[p.id])
  }));

  const enrichedLeaders = leaders.map(l => {
    if (l.playerId) {
      const p = enrichedPlayers.find(player => player.id === l.playerId);
      if (p) return { ...l, name: p.name, image: p.image };
    }
    return l;
  });

  const isLoading = isLoadingPlayers || isLoadingLeaders || isLoadingMatches || !isMinLoadTimePassed;

  const value = {
    players: enrichedPlayers,
    rankedPlayers: sortRankedPlayers(enrichedPlayers),
    leaders: enrichedLeaders,
    matches,
    tournaments,
    systemLocks,
    isLoading,
    dbError,
    hasPendingWrites
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

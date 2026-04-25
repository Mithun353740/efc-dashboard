import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import { subscribeToPlayers, subscribeToLeaders, subscribeToMatches, subscribeToTournaments, subscribeToSystemLocks, bootstrapData, sortRankedPlayers, testFirestoreConnection, computeGlobalElo, calculateOvrHybrid, addMatch, fetchPlayers, fetchLeaders, fetchMatches, fetchTournaments } from './lib/store';

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

    // Minimum delay for branding aesthetics and to prevent cache flashes
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 2500);

    // Actively probe the server once to see if quota is blown, 
    // because IndexedDB offline persistence might silently hide quota errors from onSnapshot
    testFirestoreConnection();

    // Ensure anonymous auth for guests to access restricted collections (tournaments, etc.)
    import('./firebase').then(({ loginAnonymously, auth }) => {
      if (!auth.currentUser) {
        loginAnonymously().catch(err => console.warn('[Firebase] Anonymous login failed:', err));
      }
    });

    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (mounted && customEvent.detail?.error) {
        const errStr = String(customEvent.detail.error).toLowerCase();
        
        // ONLY rescue from cache if we have NO data at all
        // If we already have data in memory, DO NOT overwrite it with stale cache
        if (players.length === 0) {
          const cachedP = localStorage.getItem('vortex_players_cache');
          if (cachedP) setPlayers(JSON.parse(cachedP));
        }
        if (leaders.length === 0) {
          const cachedL = localStorage.getItem('vortex_leaders_cache');
          if (cachedL) setLeaders(JSON.parse(cachedL));
        }
        if (matches.length === 0) {
          const cachedM = localStorage.getItem('vortex_matches_cache');
          if (cachedM) setMatches(JSON.parse(cachedM));
        }
        
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);

        if (errStr.includes('resource-exhausted') || errStr.includes('quota') || errStr.includes('exceeded')) {
          setDbError('QUOTA_EXCEEDED');
        } else {
          setDbError('DATABASE_ERROR');
        }
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    let unsubPlayers: () => void = () => {};
    let unsubLeaders: () => void = () => {};
    let unsubMatches: () => void = () => {};
    let unsubTournaments: () => void = () => {};

    if (isAdmin) {
      unsubPlayers = subscribeToPlayers((data, pending) => {
        if (mounted) {
          setPlayers(data);
          setHasPendingWrites(pending);
          localStorage.setItem('vortex_players_cache', JSON.stringify(data));
          setIsLoadingPlayers(false);
        }
      });

      unsubLeaders = subscribeToLeaders((data, pending) => {
        if (mounted) {
          setLeaders(data);
          setHasPendingWrites(pending);
          localStorage.setItem('vortex_leaders_cache', JSON.stringify(data));
          setIsLoadingLeaders(false);
        }
      });

      unsubMatches = subscribeToMatches((data, pending) => {
        if (mounted) {
          setMatches(data);
          setHasPendingWrites(pending);
          localStorage.setItem('vortex_matches_cache', JSON.stringify(data));
          setIsLoadingMatches(false);
        }
      });

      unsubTournaments = subscribeToTournaments((data, pending) => {
        if (mounted) {
          setTournaments(data);
          setHasPendingWrites(pending);
        }
      });
    } else {
      // Public User: Manual Fetch every 5 Minutes
      const SYNC_INTERVAL = 5 * 60 * 1000;
      
      const performFetch = async () => {
        try {
          const [p, l, m, t] = await Promise.all([
            fetchPlayers(),
            fetchLeaders(),
            fetchMatches(),
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
          }
        } catch (err) {
          console.error('[Sync] Public fetch failed:', err);
        }
      };

      performFetch(); // Initial load
      const intervalId = setInterval(performFetch, SYNC_INTERVAL);
      
      // Cleanup for public view
      unsubPlayers = () => clearInterval(intervalId);
    }

    const unsubLocks = subscribeToSystemLocks((locks) => {
      if (mounted) {
        setSystemLocks(locks);
      }
    });

    // FALLBACK: don't hang forever if collections are completely empty and snapshot takes time
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
      }
    }, 3500);

    // TOURNAMENT INTEGRATION: Handle messages from the embedded Tournament System
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
      unsubLocks();
      clearTimeout(timeout);
      clearTimeout(minLoadTimer);
    };
  }, []); // REMOVED dependencies to stop the infinite loop

  // Sync refs for the message handler to use
  const playersRef = React.useRef(players);
  const matchesRef = React.useRef(matches);
  React.useEffect(() => { playersRef.current = players; }, [players]);
  React.useEffect(() => { matchesRef.current = matches; }, [matches]);

  const elos = React.useMemo(() => computeGlobalElo(players, matches), [players, matches]);
  const enrichedPlayers = players.map(p => ({
    ...p,
    ovr: calculateOvrHybrid(p, elos[p.id])
  }));

  const enrichedLeaders = leaders.map(l => {
    if (l.playerId) {
      const p = enrichedPlayers.find(player => player.id === l.playerId);
      if (p) {
        return { ...l, name: p.name, image: p.image };
      }
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


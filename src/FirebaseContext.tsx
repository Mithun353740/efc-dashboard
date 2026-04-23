import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Leader, MatchRecord } from './types';
import { subscribeToPlayers, subscribeToLeaders, subscribeToMatches, bootstrapData, sortRankedPlayers, testFirestoreConnection, computeGlobalElo, calculateOvrHybrid } from './lib/store';

interface FirebaseContextType {
  players: Player[];
  rankedPlayers: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  isLoading: boolean;
  dbError: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isMinLoadTimePassed, setIsMinLoadTimePassed] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Minimum delay for branding aesthetics and to prevent cache flashes
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 2500);

    // Actively probe the server once to see if quota is blown, 
    // because IndexedDB offline persistence might silently hide quota errors from onSnapshot
    testFirestoreConnection();

    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (mounted && customEvent.detail?.error) {
        const errStr = String(customEvent.detail.error).toLowerCase();
        
        // Attempt to rescue from cache
        const cachedP = localStorage.getItem('vortex_players_cache');
        const cachedL = localStorage.getItem('vortex_leaders_cache');
        const cachedM = localStorage.getItem('vortex_matches_cache');
        
        if (cachedP) setPlayers(JSON.parse(cachedP));
        if (cachedL) setLeaders(JSON.parse(cachedL));
        if (cachedM) setMatches(JSON.parse(cachedM));
        
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);

        // Set dbError to trigger Read-Only UI and Admin Lock
        if (errStr.includes('quota') || errStr.includes('exceeded') || errStr.includes('permission')) {
          setDbError('QUOTA_EXCEEDED');
        } else {
          setDbError('DATABASE_ERROR');
        }
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    const unsubPlayers = subscribeToPlayers((data) => {
      if (mounted) {
        setPlayers(data);
        localStorage.setItem('vortex_players_cache', JSON.stringify(data));
        setIsLoadingPlayers(false);
      }
    });

    const unsubLeaders = subscribeToLeaders((data) => {
      if (mounted) {
        setLeaders(data);
        localStorage.setItem('vortex_leaders_cache', JSON.stringify(data));
        setIsLoadingLeaders(false);
      }
    });

    const unsubMatches = subscribeToMatches((data) => {
      if (mounted) {
        setMatches(data);
        localStorage.setItem('vortex_matches_cache', JSON.stringify(data));
        setIsLoadingMatches(false);
      }
    });

    // Fallback: don't hang forever if collections are completely empty and snapshot takes time
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
      }
    }, 3500);

    return () => {
      mounted = false;
      window.removeEventListener('firestore-error', errorHandler);
      unsubPlayers();
      unsubLeaders();
      unsubMatches();
      clearTimeout(timeout);
      clearTimeout(minLoadTimer);
    };
  }, []);

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
    isLoading,
    dbError
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Leader, MatchRecord } from './types';
import { subscribeToPlayers, subscribeToLeaders, subscribeToMatches, bootstrapData, sortRankedPlayers, testFirestoreConnection } from './lib/store';

interface FirebaseContextType {
  players: Player[];
  rankedPlayers: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Run connection test and bootstrap in background without awaiting them
    testFirestoreConnection().catch(console.warn);
    bootstrapData().catch(console.warn);

    const unsubPlayers = subscribeToPlayers((data) => {
      if (mounted) {
        setPlayers(data);
        setIsLoadingPlayers(false);
      }
    });

    const unsubLeaders = subscribeToLeaders((data) => {
      if (mounted) {
        setLeaders(data);
        setIsLoadingLeaders(false);
      }
    });

    const unsubMatches = subscribeToMatches((data) => {
      if (mounted) {
        setMatches(data);
      }
    });

    // Fallback: don't hang forever if collections are completely empty and snapshot takes time
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      unsubPlayers();
      unsubLeaders();
      unsubMatches();
      clearTimeout(timeout);
    };
  }, []);


  const enrichedLeaders = leaders.map(l => {
    if (l.playerId) {
      const p = players.find(player => player.id === l.playerId);
      if (p) {
        return { ...l, name: p.name, image: p.image };
      }
    }
    return l;
  });

  const isLoading = isLoadingPlayers || isLoadingLeaders;

  const value = {
    players,
    rankedPlayers: sortRankedPlayers(players),
    leaders: enrichedLeaders,
    matches,
    isLoading
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


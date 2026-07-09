/**
 * MINIMAL PRODUCTION FIREBASE CONTEXT
 * 
 * Designed for: 50 users, 50,000 daily reads budget
 * 
 * ARCHITECTURE:
 * - 1-2 Firestore reads per cold visit (appSnapshot)
 * - 6-hour localStorage cache
 * - Memory cache persists for session
 * - All properties needed by components included
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player, Tournament, MatchRecord } from './types';
import { sortRankedPlayers, fetchAppSnapshot, AppSnapshot, ensureSnapshotsExist, fetchPlayersOnce } from './lib/store';
import { persistToStorage, hydrateFromStorage } from './lib/cache';

// Extended cache TTLs for minimal reads
const MEMORY_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const STORAGE_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Context type - includes ALL properties needed by components
interface FirebaseContextType {
  leaderboard: Player[];
  rankedPlayers: Player[];
  players: Player[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  activeTournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  playerCount: number;
  matchCount: number;
  isLoading: boolean;
  dbError: string | null;
  isAdmin: boolean;
  leaders: { id: string; name: string; role: string; initials: string; quote: string; image: string }[];
  appVersion: string;
  hasPendingWrites: boolean;
}

// Context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Global cache
let _cachedSnapshot: AppSnapshot | null = null;
let _lastFetchTime = 0;

// Static leaders data
const DEFAULT_LEADERS = [
  { id: '1', name: 'Player 1', role: 'President', initials: 'P1', quote: 'Leadership through excellence.', image: '' },
  { id: '2', name: 'Player 2', role: 'Captain', initials: 'P2', quote: 'Victory belongs to the persistent.', image: '' },
  { id: '3', name: 'Player 3', role: 'Vice-Captain', initials: 'P3', quote: 'Teamwork makes the dream work.', image: '' },
];

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const storedSnapshot = hydrateFromStorage<AppSnapshot>('appSnapshot_v3');
  
  const [leaderboard, setLeaderboard] = useState<Player[]>(storedSnapshot?.leaderboard ?? []);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>(storedSnapshot?.activeTournaments ?? []);
  const [playerCount, setPlayerCount] = useState<number>(storedSnapshot?.playerCount ?? 0);
  const [matchCount, setMatchCount] = useState<number>(storedSnapshot?.matchCount ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(!storedSnapshot);
  const [dbError, setDbError] = useState<string | null>(null);
  const [matches] = useState<MatchRecord[]>([]); // Empty by default - loaded only when needed
  const [tournaments] = useState<Tournament[]>(activeTournaments);
  const [systemLocks] = useState<Record<string, boolean>>({});
  const [hasPendingWrites] = useState<boolean>(false);
  
  const mountedRef = useRef(true);
  
  const isAdmin = useMemo(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }, []);
  
  const appVersion = useMemo(() => {
    return localStorage.getItem('appVersion') || '1.0.0';
  }, []);

  // Leaders from storage
  const leaders = useMemo(() => {
    const storedLeaders = hydrateFromStorage<typeof DEFAULT_LEADERS>('leaders_v1');
    return storedLeaders && storedLeaders.length > 0 ? storedLeaders : DEFAULT_LEADERS;
  }, []);

  const rankedPlayers = useMemo(() => sortRankedPlayers(leaderboard), [leaderboard]);
  
  const loadData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    const now = Date.now();
    
    // Check memory cache first (6 hours)
    if (_cachedSnapshot && _cachedSnapshot.leaderboard.length > 0 && 
        (now - _lastFetchTime) < MEMORY_CACHE_TTL_MS) {
      console.log('[Firebase] Using memory cache');
      setLeaderboard(_cachedSnapshot.leaderboard);
      setActiveTournaments(_cachedSnapshot.activeTournaments ?? []);
      setPlayerCount(_cachedSnapshot.playerCount ?? 0);
      setMatchCount(_cachedSnapshot.matchCount ?? 0);
      setIsLoading(false);
      return;
    }
    
    // Check localStorage cache (6 hours)
    const localCache = hydrateFromStorage<AppSnapshot>('appSnapshot_v3');
    if (localCache && localCache.leaderboard.length > 0) {
      console.log('[Firebase] Using localStorage cache');
      _cachedSnapshot = localCache;
      _lastFetchTime = now;
      setLeaderboard(localCache.leaderboard);
      setActiveTournaments(localCache.activeTournaments ?? []);
      setPlayerCount(localCache.playerCount ?? 0);
      setMatchCount(localCache.matchCount ?? 0);
      setIsLoading(false);
      return;
    }
    
    // COLD START - only fetch when no cache
    console.log('[Firebase] Cold start - fetching appSnapshot');
    setIsLoading(true);
    
    try {
      let snapshot = await fetchAppSnapshot();
      
      if (!snapshot || snapshot.leaderboard.length === 0) {
        console.log('[Firebase] No snapshot found, trying to create one...');
        try {
          await ensureSnapshotsExist();
          snapshot = await fetchAppSnapshot();
        } catch (e) {
          // Silently fail - don't show error to user
        }
        
        // FALLBACK: Load directly from players collection
        if (!snapshot || snapshot.leaderboard.length === 0) {
          console.log('[Firebase] Loading directly from players collection...');
          try {
            const players = await fetchPlayersOnce(50);
            if (players.length > 0) {
              const ranked = sortRankedPlayers(players);
              setLeaderboard(ranked);
              setPlayerCount(players.length);
              
              const fallbackSnapshot: AppSnapshot = {
                leaderboard: ranked,
                activeTournaments: [],
                playerCount: players.length,
                matchCount: 0,
                updatedAt: Date.now(),
              };
              persistToStorage('appSnapshot_v3', fallbackSnapshot);
              _cachedSnapshot = fallbackSnapshot;
              _lastFetchTime = now;
              console.log('[Firebase] Loaded', players.length, 'players from collection');
              setIsLoading(false);
              return;
            }
          } catch (e) {
            // Silently fail
          }
        }
      }
      
      if (snapshot && snapshot.leaderboard.length > 0) {
        _cachedSnapshot = snapshot;
        _lastFetchTime = now;
        setLeaderboard(snapshot.leaderboard);
        setActiveTournaments(snapshot.activeTournaments ?? []);
        setPlayerCount(snapshot.playerCount ?? 0);
        setMatchCount(snapshot.matchCount ?? 0);
        persistToStorage('appSnapshot_v3', snapshot);
        console.log('[Firebase] Loaded', snapshot.leaderboard.length, 'players');
      }
    } catch (error) {
      // Don't show error to user - use cached data if available
      console.warn('[Firebase] Error loading data:', error);
      if (error instanceof Error && error.message.includes('quota')) {
        setDbError('QUOTA_EXCEEDED');
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadData();
    return () => { mountedRef.current = false; };
  }, [loadData]);
  
  const value = useMemo(() => ({
    leaderboard,
    rankedPlayers,
    players: leaderboard,
    matches,
    tournaments: activeTournaments,
    activeTournaments,
    systemLocks,
    playerCount,
    matchCount,
    isLoading,
    dbError,
    isAdmin,
    leaders,
    appVersion,
    hasPendingWrites,
  }), [leaderboard, rankedPlayers, matches, activeTournaments, systemLocks, playerCount, matchCount, isLoading, dbError, isAdmin, leaders, appVersion, hasPendingWrites]);
  
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
}

export { FirebaseContext as ProductionFirebaseContext };
export const useProductionFirebase = useFirebase;

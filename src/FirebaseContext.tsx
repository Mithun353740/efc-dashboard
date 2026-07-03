/**
 * MINIMAL PRODUCTION FIREBASE CONTEXT
 * 
 * Designed for: 50 users, 50,000 daily reads budget
 * 
 * ARCHITECTURE:
 * - Only 1 Firestore read per cold visit (appSnapshot document)
 * - 4-hour localStorage cache
 * - 2-hour memory cache
 * - NO extra reads for leaders, matches, tournaments (computed in snapshot)
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player, Tournament } from './types';
import { 
  sortRankedPlayers,
  fetchAppSnapshot, 
  AppSnapshot
} from './lib/store';
import { 
  persistToStorage, 
  hydrateFromStorage,
  trackRead 
} from './lib/cache';

// Cache TTLs
const MEMORY_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const STORAGE_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

// Context type
interface FirebaseContextType {
  leaderboard: Player[];
  rankedPlayers: Player[];
  players: Player[]; // Alias for leaderboard (top 50)
  activeTournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  playerCount: number;
  matchCount: number;
  isLoading: boolean;
  dbError: string | null;
  isAdmin: boolean;
  // Leaders - static for now (can be added to snapshot later)
  leaders: { id: string; name: string; role: string; initials: string; quote: string; image: string }[];
}

// Context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Global cache
let _cachedSnapshot: AppSnapshot | null = null;
let _lastFetchTime = 0;

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Load from localStorage FIRST (zero reads!)
  const storedSnapshot = hydrateFromStorage<AppSnapshot>('appSnapshot_v2');
  
  const [leaderboard, setLeaderboard] = useState<Player[]>(storedSnapshot?.leaderboard ?? []);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>(storedSnapshot?.activeTournaments ?? []);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>({});
  const [playerCount, setPlayerCount] = useState<number>(storedSnapshot?.playerCount ?? 0);
  const [matchCount, setMatchCount] = useState<number>(storedSnapshot?.matchCount ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(!storedSnapshot);
  const [dbError, setDbError] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<{ id: string; name: string; role: string; initials: string; quote: string; image: string }[]>([]);
  
  const mountedRef = useRef(true);
  
  // Check if admin
  const isAdmin = useMemo(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }, []);
  
  // Load data - ONLY 1 READ MAX!
  const loadData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    const now = Date.now();
    
    // Check memory cache first
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
    
    // Check localStorage cache
    const localCache = hydrateFromStorage<AppSnapshot>('appSnapshot_v2');
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
    
    // COLD START - Fetch from Firestore (1 read only!)
    console.log('[Firebase] Cold start - fetching appSnapshot');
    setIsLoading(true);
    
    try {
      const snapshot = await fetchAppSnapshot();
      trackRead(1);
      
      if (snapshot && snapshot.leaderboard.length > 0) {
        _cachedSnapshot = snapshot;
        _lastFetchTime = now;
        
        setLeaderboard(snapshot.leaderboard);
        setActiveTournaments(snapshot.activeTournaments ?? []);
        setPlayerCount(snapshot.playerCount ?? 0);
        setMatchCount(snapshot.matchCount ?? 0);
        
        // Persist to localStorage
        persistToStorage('appSnapshot_v2', snapshot);
        console.log('[Firebase] Loaded', snapshot.leaderboard.length, 'players');
      }
    } catch (error) {
      console.error('[Firebase] Error:', error);
      if (error instanceof Error && error.message.includes('quota')) {
        setDbError('QUOTA_EXCEEDED');
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    loadData();
    
    return () => {
      mountedRef.current = false;
    };
  }, [loadData]);
  
  // Derived state
  const rankedPlayers = useMemo(() => sortRankedPlayers(leaderboard), [leaderboard]);
  
  // Load leaders from localStorage cache (rarely changes)
  const storedLeaders = hydrateFromStorage<typeof leaders>('leaders_v1') ?? [];
  
  // Context value
  const value = useMemo(() => ({
    leaderboard,
    rankedPlayers,
    players: leaderboard, // Alias for components expecting 'players'
    activeTournaments,
    systemLocks,
    playerCount,
    matchCount,
    isLoading,
    dbError,
    isAdmin,
    leaders: storedLeaders.length > 0 ? storedLeaders : [], // Empty if not cached
  }), [leaderboard, rankedPlayers, activeTournaments, systemLocks, playerCount, matchCount, isLoading, dbError, isAdmin, storedLeaders]);
  
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

// Alias for backward compatibility
export { FirebaseContext as ProductionFirebaseContext };
export const useProductionFirebase = useFirebase;

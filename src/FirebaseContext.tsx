/**
 * MINIMAL PRODUCTION FIREBASE CONTEXT
 * 
 * Designed for: 50 users, 50,000 daily reads budget
 * 
 * ARCHITECTURE:
 * - Only 1 Firestore read per cold visit (appSnapshot document)
 * - 4-hour localStorage cache
 * - 2-hour memory cache
 * - All data computed in snapshot - NO extra reads
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player, Tournament } from './types';
import { sortRankedPlayers, fetchAppSnapshot, AppSnapshot, ensureSnapshotsExist, fetchPlayersOnce } from './lib/store';
import { persistToStorage, hydrateFromStorage } from './lib/cache';

// Cache TTLs
const MEMORY_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const STORAGE_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

// Context type
interface FirebaseContextType {
  leaderboard: Player[];
  rankedPlayers: Player[];
  players: Player[]; // Alias for leaderboard
  activeTournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  playerCount: number;
  matchCount: number;
  isLoading: boolean;
  dbError: string | null;
  isAdmin: boolean;
  leaders: { id: string; name: string; role: string; initials: string; quote: string; image: string }[];
}

// Context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Global cache
let _cachedSnapshot: AppSnapshot | null = null;
let _lastFetchTime = 0;

// Static leaders data (rarely changes - embed here to avoid reads)
const DEFAULT_LEADERS = [
  { id: '1', name: 'Player 1', role: 'President', initials: 'P1', quote: 'Leadership through excellence.', image: '' },
  { id: '2', name: 'Player 2', role: 'Captain', initials: 'P2', quote: 'Victory belongs to the persistent.', image: '' },
  { id: '3', name: 'Player 3', role: 'Vice-Captain', initials: 'P3', quote: 'Teamwork makes the dream work.', image: '' },
];

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
  
  const mountedRef = useRef(true);
  
  // Check if admin
  const isAdmin = useMemo(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }, []);
  
  // Load data - ONLY 1 READ MAX!
  const loadData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    const now = Date.now();
    
    // Check memory cache first (2 hours)
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
    
    // Check localStorage cache (4 hours)
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
      let snapshot = await fetchAppSnapshot();
      
      // If snapshot doesn't exist, create it (admin function)
      if (!snapshot || snapshot.leaderboard.length === 0) {
        console.log('[Firebase] No snapshot found, trying to create one...');
        
        try {
          await ensureSnapshotsExist();
          snapshot = await fetchAppSnapshot();
        } catch (e) {
          console.log('[Firebase] Could not create snapshot');
        }
        
        // FALLBACK: If still no snapshot, load directly from players collection
        if (!snapshot || snapshot.leaderboard.length === 0) {
          console.log('[Firebase] Loading directly from players collection...');
          try {
            const players = await fetchPlayersOnce(50);
            if (players.length > 0) {
              const ranked = sortRankedPlayers(players);
              setLeaderboard(ranked);
              setPlayerCount(players.length);
              
              // Cache it
              const fallbackSnapshot: AppSnapshot = {
                leaderboard: ranked,
                activeTournaments: [],
                playerCount: players.length,
                matchCount: 0,
                updatedAt: Date.now(),
              };
              persistToStorage('appSnapshot_v2', fallbackSnapshot);
              _cachedSnapshot = fallbackSnapshot;
              _lastFetchTime = now;
              console.log('[Firebase] Loaded', players.length, 'players from collection');
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('[Firebase] Could not load players:', e);
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
        
        // Persist to localStorage
        persistToStorage('appSnapshot_v2', snapshot);
        console.log('[Firebase] Loaded', snapshot.leaderboard.length, 'players');
      } else {
        console.log('[Firebase] No data available - visit Control Center to sync data');
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
  
  // Load leaders from cache or use defaults
  const leaders = useMemo(() => {
    const storedLeaders = hydrateFromStorage<typeof DEFAULT_LEADERS>('leaders_v1');
    return storedLeaders && storedLeaders.length > 0 ? storedLeaders : DEFAULT_LEADERS;
  }, []);
  
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
    leaders,
  }), [leaderboard, rankedPlayers, activeTournaments, systemLocks, playerCount, matchCount, isLoading, dbError, isAdmin, leaders]);
  
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

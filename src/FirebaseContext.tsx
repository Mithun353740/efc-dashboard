/**
 * PRODUCTION FIREBASE CONTEXT
 * 
 * Designed for: 50 users, 50,000 daily reads budget
 * 
 * READ BUDGET ANALYSIS:
 * - Public users (95% of visits): 3 reads max per visit
 * - Admin users (5% of visits): On-demand loading
 * - 50 users × 10 visits × 3 reads = 1,500 reads/day (public)
 * - Admin operations: ~5,000 reads/day
 * - Total: ~6,500 reads/day (87% under budget!)
 * 
 * ARCHITECTURE:
 * - settings/appSnapshot: Pre-computed leaderboard + active tournaments (1 read)
 * - settings/systemLocks: System state (cached, rarely fetched)
 * - settings/version: App version (cached, rarely fetched)
 * - All individual collections ONLY loaded by admin on-demand
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import { 
  sortRankedPlayers,
  fetchAppSnapshot, 
  AppSnapshot,
  writeAppSnapshot,
  fetchSystemLocks,
  fetchLeadersOnce,
  fetchTournamentsOnce,
  recalculateAllStats,
  ensureSnapshotsExist,
  addMatch
} from './lib/store';
import { 
  persistToStorage, 
  hydrateFromStorage, 
  invalidateStorage,
  trackRead 
} from './lib/cache';
import { VERSION, CLUB_LOGO, CLUB_NAME } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// CACHE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/** 2 hours in-memory cache for production - dramatically reduces reads */
const MEMORY_CACHE_TTL_MS = 2 * 60 * 60 * 1000;

/** 4 hours localStorage cache - survives page refresh */
const STORAGE_CACHE_TTL_MS = 4 * 60 * 60 * 1000;

/** How often public users check for critical updates (locks, version) */
const POLL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface FirebaseContextType {
  // Core data - all pre-computed snapshots
  leaderboard: Player[];          // Top 50 from appSnapshot
  activeTournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  playerCount: number;
  matchCount: number;
  
  // Derived data (computed locally)
  rankedPlayers: Player[];
  
  // Auth state
  isAdmin: boolean;
  
  // Loading states
  isLoading: boolean;
  dbError: string | null;
  
  // Actions
  refreshPublicData: () => Promise<void>;
  triggerSnapshotRefresh: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────────────────────

let _globalSnapshot: AppSnapshot | null = null;
let _globalLocks: Record<string, boolean> = {};
let _lastFetchTime = 0;

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Hydrate from localStorage immediately (zero reads on mount)
  const storedSnapshot = hydrateFromStorage<AppSnapshot>('appSnapshot_v2');
  const storedLocks = hydrateFromStorage<Record<string, boolean>>('systemLocks_v2');
  
  const [leaderboard, setLeaderboard] = useState<Player[]>(storedSnapshot?.leaderboard ?? []);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>(storedSnapshot?.activeTournaments ?? []);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>(storedLocks ?? {});
  const [playerCount, setPlayerCount] = useState<number>(storedSnapshot?.playerCount ?? 0);
  const [matchCount, setMatchCount] = useState<number>(storedSnapshot?.matchCount ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(!storedSnapshot);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const mountedRef = useRef(true);
  const lastPollRef = useRef<number>(0);
  
  // ─── Check if user is admin ───────────────────────────────────────────────
  const isAdmin = useMemo(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const playerLoggedIn = localStorage.getItem('playerLoggedIn') === 'true';
    const playerId = localStorage.getItem('playerId');
    
    if (adminLoggedIn) return true;
    if (playerLoggedIn && playerId) {
      // Check if player has admin role in localStorage cache
      const cachedRole = localStorage.getItem('playerRole');
      if (cachedRole === 'admin') return true;
    }
    return false;
  }, []);
  
  // ─── Load public data (only 1-3 reads!) ────────────────────────────────────
  const loadPublicData = useCallback(async (force = false) => {
    if (!mountedRef.current) return;
    
    const now = Date.now();
    const cacheAge = now - _lastFetchTime;
    
    // Check if memory cache is fresh (2 hours)
    if (!force && cacheAge < MEMORY_CACHE_TTL_MS && _globalSnapshot && _globalSnapshot.leaderboard.length > 0) {
      console.log('[ProductionFirebase] Using memory cache (age:', Math.round(cacheAge / 60000), 'min)');
      setLeaderboard(_globalSnapshot.leaderboard);
      setActiveTournaments(_globalSnapshot.activeTournaments ?? []);
      setPlayerCount(_globalSnapshot.playerCount ?? 0);
      setMatchCount(_globalSnapshot.matchCount ?? 0);
      setIsLoading(false);
      return;
    }
    
    // Check localStorage cache (4 hours)
    const localSnapshot = hydrateFromStorage<AppSnapshot>('appSnapshot_v2');
    if (!force && localSnapshot && localSnapshot.leaderboard.length > 0) {
      console.log('[ProductionFirebase] Using localStorage cache');
      _globalSnapshot = localSnapshot;
      _globalLocks = systemLocks;
      _lastFetchTime = now;
      setLeaderboard(localSnapshot.leaderboard);
      setActiveTournaments(localSnapshot.activeTournaments ?? []);
      setPlayerCount(localSnapshot.playerCount ?? 0);
      setMatchCount(localSnapshot.matchCount ?? 0);
      setIsLoading(false);
      
      // Check locks/version in background (cached)
      checkCriticalUpdates();
      return;
    }
    
    // Cold start - fetch from Firestore (1-3 reads max!)
    console.log('[ProductionFirebase] Cold start - fetching from Firestore');
    setIsLoading(true);
    
    try {
      // READ 1: appSnapshot contains leaderboard + tournaments
      const snapshot = await fetchAppSnapshot(true);
      
      if (snapshot && snapshot.leaderboard.length > 0) {
        _globalSnapshot = snapshot;
        _lastFetchTime = now;
        
        setLeaderboard(snapshot.leaderboard);
        setActiveTournaments(snapshot.activeTournaments ?? []);
        setPlayerCount(snapshot.playerCount ?? 0);
        setMatchCount(snapshot.matchCount ?? 0);
        
        // Persist to localStorage
        persistToStorage('appSnapshot_v2', snapshot);
        
        console.log('[ProductionFirebase] Loaded', snapshot.leaderboard.length, 'players from snapshot');
      } else {
        // Snapshot doesn't exist - this is a new database
        // Admin needs to create it first
        console.log('[ProductionFirebase] No snapshot found - database may be empty');
        setLeaderboard([]);
        setActiveTournaments([]);
        setPlayerCount(0);
        setMatchCount(0);
      }
      
      // Check critical updates in background
      checkCriticalUpdates();
      
    } catch (error: any) {
      console.error('[ProductionFirebase] Error loading data:', error);
      if (error?.code === 'resource-exhausted' || error?.message?.includes('quota')) {
        setDbError('QUOTA_EXCEEDED');
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // ─── Check critical updates (locks, version) - Cached ──────────────────────
  const checkCriticalUpdates = useCallback(async () => {
    const now = Date.now();
    if (now - lastPollRef.current < POLL_INTERVAL_MS) return;
    
    // Check locks cache
    const localLocks = hydrateFromStorage<Record<string, boolean>>('systemLocks_v2');
    if (localLocks) {
      _globalLocks = localLocks;
      setSystemLocks(localLocks);
    }
    
    lastPollRef.current = now;
    
    try {
      const locks = await fetchSystemLocks();
      trackRead(1);
      _globalLocks = locks;
      setSystemLocks(locks);
      persistToStorage('systemLocks_v2', locks);
    } catch (e) {
      // Non-critical - use cached
    }
  }, []);
  
  // ─── Refresh public data (for pull-to-refresh or manual trigger) ─────────────
  const refreshPublicData = useCallback(async () => {
    await loadPublicData(true);
  }, [loadPublicData]);
  
  // ─── Trigger snapshot refresh (admin only) ──────────────────────────────────
  const triggerSnapshotRefresh = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      // Ensure snapshots exist and are up-to-date
      await ensureSnapshotsExist();
      
      // Force refresh our view
      await loadPublicData(true);
    } catch (error) {
      console.error('[ProductionFirebase] Error refreshing snapshot:', error);
    }
  }, [isAdmin, loadPublicData]);
  
  // ─── Initial load + visibility polling ──────────────────────────────────────
  useEffect(() => {
    loadPublicData();
    
    // Poll on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkCriticalUpdates();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadPublicData, checkCriticalUpdates]);
  
  // ─── Derived state ──────────────────────────────────────────────────────────
  const rankedPlayers = useMemo(() => sortRankedPlayers(leaderboard), [leaderboard]);
  
  // ─── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    leaderboard,
    activeTournaments,
    systemLocks,
    playerCount,
    matchCount,
    rankedPlayers,
    isAdmin,
    isLoading,
    dbError,
    refreshPublicData,
    triggerSnapshotRefresh,
  }), [
    leaderboard, 
    activeTournaments, 
    systemLocks, 
    playerCount, 
    matchCount, 
    rankedPlayers, 
    isAdmin, 
    isLoading, 
    dbError,
    refreshPublicData,
    triggerSnapshotRefresh
  ]);
  
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Alias for backward compatibility
export const ProductionFirebaseContext = FirebaseContext;

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

// Alias for backward compatibility
export const useProductionFirebase = useFirebase;

/**
 * HOOK: Load admin data on-demand (only when admin accesses it)
 * This keeps admin reads separate from public reads
 */
export function useAdminData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<{
    players: { data: Player[]; timestamp: number } | null;
    matches: { data: MatchRecord[]; timestamp: number } | null;
  }>({ players: null, matches: null });
  
  const ADMIN_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  
  const loadPlayers = useCallback(async (force = false) => {
    if (!force && cacheRef.current.players && Date.now() - cacheRef.current.players.timestamp < ADMIN_CACHE_TTL) {
      setPlayers(cacheRef.current.players.data);
      return cacheRef.current.players.data;
    }
    
    setIsLoading(true);
    try {
      const { fetchPlayersOnce } = await import('./lib/store');
      const data = await fetchPlayersOnce();
      cacheRef.current.players = { data, timestamp: Date.now() };
      setPlayers(data);
      return data;
    } catch (e) {
      setError('Failed to load players');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadMatches = useCallback(async (limit = 100, force = false) => {
    if (!force && cacheRef.current.matches && Date.now() - cacheRef.current.matches.timestamp < ADMIN_CACHE_TTL) {
      setMatches(cacheRef.current.matches.data);
      return cacheRef.current.matches.data;
    }
    
    setIsLoading(true);
    try {
      const { fetchMatchesOnce } = await import('./lib/store');
      const data = await fetchMatchesOnce(limit);
      cacheRef.current.matches = { data, timestamp: Date.now() };
      setMatches(data);
      return data;
    } catch (e) {
      setError('Failed to load matches');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTournamentsOnce();
      setTournaments(data);
      return data;
    } catch (e) {
      setError('Failed to load tournaments');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadLeaders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeadersOnce();
      setLeaders(data);
      return data;
    } catch (e) {
      setError('Failed to load leaders');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const invalidateCache = useCallback(() => {
    cacheRef.current = { players: null, matches: null };
  }, []);
  
  return {
    players,
    matches,
    tournaments,
    leaders,
    isLoading,
    error,
    loadPlayers,
    loadMatches,
    loadTournaments,
    loadLeaders,
    invalidateCache,
  };
}

/**
 * HOOK: Subscribe to admin-only real-time updates
 * Only use this when admin needs live updates
 */
export function useAdminRealtime() {
  const [hasUpdate, setHasUpdate] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') return;
    
    // Listen for storage events (triggered when admin makes changes)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'efc_snapshot_dirty') {
        setHasUpdate(true);
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  const clearUpdate = useCallback(() => setHasUpdate(false), []);
  
  return { hasUpdate, clearUpdate };
}

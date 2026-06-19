/**
 * Firestore Read Optimization - FirebaseContext
 * =============================================
 * Optimized version with:
 * - Cache-first data loading (localStorage + memory)
 * - 60-min TTL on all caches
 * - appSnapshot for 1-read cold starts
 * - Proper cache key consistency
 * 
 * This replaces FirebaseContext.tsx
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, getDocs, doc, collection, query, limit } from 'firebase/firestore';
import { db, auth } from './firebase';
import { trackRead } from './lib/cache';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
  number: string;
  ovr: number;
  win: number;
  loss: number;
  draw: number;
  goalsScored: number;
  goalsConceded: number;
  image: string;
  form: string[];
  elo?: number;
  // ... other fields
}

interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  playerId?: string;
}

interface MatchRecord {
  id: string;
  timestamp: number;
  p1Id: string;
  p1Name: string;
  p1Score: number;
  p2Id?: string;
  p2Name: string;
  p2Score: number;
  tournament?: string;
}

interface Tournament {
  id: string;
  name: string;
  status: string;
}

interface AppSnapshot {
  leaderboard: Player[];
  activeTournaments: Tournament[];
  playerCount: number;
  matchCount: number;
  updatedAt: number;
}

interface FirebaseContextType {
  user: any;
  players: Player[];
  rankedPlayers: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes
const CACHE_VERSION = 'v5'; // Version bump to bust old caches

// ─────────────────────────────────────────────────────────────────────────────
// CACHE HELPERS (localStorage with TTL)
// ─────────────────────────────────────────────────────────────────────────────

function getCacheKey(key: string): string {
  return `efc_${key}_${CACHE_VERSION}`;
}

function getFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(getCacheKey(key));
    if (!raw) return null;
    
    const entry = JSON.parse(raw);
    if (!entry || entry.version !== CACHE_VERSION) return null;
    
    // Check TTL
    if (Date.now() - entry.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }
    
    return entry.data as T;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    const entry = {
      data,
      savedAt: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(entry));
  } catch {
    // Storage full or unavailable - fail silently
  }
}

function clearCache(): void {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith('efc_'))
      .forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHE
// ─────────────────────────────────────────────────────────────────────────────

interface MemoryCache {
  players: Player[] | null;
  leaders: Leader[] | null;
  matches: MatchRecord[] | null;
  tournaments: Tournament[] | null;
  fetchedAt: number;
}

const _memoryCache: MemoryCache = {
  players: null,
  leaders: null,
  matches: null,
  tournaments: null,
  fetchedAt: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const FirebaseContext = createContext<FirebaseContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// RANKING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sortRankedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const aMatches = (a.win || 0) + (a.loss || 0) + (a.draw || 0);
    const bMatches = (b.win || 0) + (b.loss || 0) + (b.draw || 0);
    const aPoints = (a.win || 0) * 3 + (a.draw || 0);
    const bPoints = (b.win || 0) * 3 + (b.draw || 0);
    
    // Primary: points
    if (bPoints !== aPoints) return bPoints - aPoints;
    // Secondary: OVR
    return (b.ovr || 60) - (a.ovr || 60);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  
  // Initialize state from localStorage (instant, 0 reads)
  const [players, setPlayers] = useState<Player[]>(() => 
    getFromStorage<Player[]>('players') || _memoryCache.players || []
  );
  const [leaders, setLeaders] = useState<Leader[]>(() =>
    getFromStorage<Leader[]>('leaders') || _memoryCache.leaders || []
  );
  const [matches, setMatches] = useState<MatchRecord[]>(() =>
    getFromStorage<MatchRecord[]>('matches') || _memoryCache.matches || []
  );
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    getFromStorage<Tournament[]>('tournaments') || _memoryCache.tournaments || []
  );
  
  // Loading state - only true if we have NO cached data
  const hasCachedData = players.length > 0 || _memoryCache.players !== null;
  const [isLoading, setIsLoading] = useState(!hasCachedData);
  
  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);
  
  // Check if cache is fresh
  const isCacheFresh = useMemo(() => {
    const age = Date.now() - _memoryCache.fetchedAt;
    return age < CACHE_TTL_MS && _memoryCache.players !== null;
  }, [_memoryCache.fetchedAt, players]);
  
  // ─── MAIN DATA FETCH ────────────────────────────────────────────────────
  
  const loadData = useCallback(async (force = false) => {
    // Skip if cache is fresh and not forced
    if (!force && isCacheFresh) {
      console.log('[FirebaseContext] Cache fresh, skipping fetch');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    console.log('[FirebaseContext] Loading data...');
    
    try {
      // ── STEP 1: Try appSnapshot (1 READ instead of 100+) ──────────────
      const cachedSnapshot = getFromStorage<AppSnapshot>('appSnapshot');
      
      if (cachedSnapshot?.leaderboard?.length) {
        console.log('[FirebaseContext] Using appSnapshot cache');
        
        const p = cachedSnapshot.leaderboard;
        const t = cachedSnapshot.activeTournaments || [];
        
        // Update state and caches
        setPlayers(p);
        setTournaments(t);
        saveToStorage('players', p);
        if (t.length) saveToStorage('tournaments', t);
        
        // Update memory cache
        _memoryCache.players = p;
        _memoryCache.tournaments = t;
        _memoryCache.fetchedAt = Date.now();
        
        // Fetch leaders separately (small collection, ~5 reads)
        const leadersSnap = await getDocs(query(collection(db, 'leaders'), limit(10)));
        const l = leadersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
        setLeaders(l);
        saveToStorage('leaders', l);
        _memoryCache.leaders = l;
        trackRead(l.length);
        
        setIsLoading(false);
        return;
      }
      
      // ── STEP 2: Fallback to Firestore if no cache ────────────────────────
      console.log('[FirebaseContext] No cache, fetching from Firestore');
      
      const [playersSnap, leadersSnap, tournamentsSnap] = await Promise.all([
        getDocs(query(collection(db, 'players'), limit(100))),
        getDocs(query(collection(db, 'leaders'), limit(10))),
        getDocs(query(collection(db, 'tournaments'), limit(20))),
      ]);
      
      const p = playersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
      const l = leadersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
      const t = tournamentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament));
      
      // Track reads
      trackRead(p.length + l.length + t.length);
      
      // Update state
      setPlayers(p);
      setLeaders(l);
      setTournaments(t);
      
      // Save to caches
      saveToStorage('players', p);
      saveToStorage('leaders', l);
      saveToStorage('tournaments', t);
      
      // Update memory cache
      _memoryCache.players = p;
      _memoryCache.leaders = l;
      _memoryCache.tournaments = t;
      _memoryCache.fetchedAt = Date.now();
      
      // Write appSnapshot for next time (fire-and-forget)
      writeAppSnapshot(p, t).catch(() => {});
      
      setIsLoading(false);
    } catch (error) {
      console.error('[FirebaseContext] Load failed:', error);
      setIsLoading(false);
    }
  }, [isCacheFresh]);
  
  // ─── LOAD MATCHES (separate, on demand) ─────────────────────────────────
  
  const loadMatches = useCallback(async (limitCount = 50) => {
    // Check cache first
    const cached = getFromStorage<MatchRecord[]>('matches');
    if (cached?.length) {
      setMatches(cached);
      return;
    }
    
    try {
      const snap = await getDocs(
        query(collection(db, 'matches'), limit(limitCount))
      );
      const m = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
      
      trackRead(m.length);
      setMatches(m);
      saveToStorage('matches', m);
      _memoryCache.matches = m;
    } catch (error) {
      console.warn('[FirebaseContext] Failed to load matches:', error);
    }
  }, []);
  
  // ─── REFRESH FUNCTION ──────────────────────────────────────────────────
  
  const refreshData = useCallback(async () => {
    // Clear memory cache
    _memoryCache.fetchedAt = 0;
    _memoryCache.players = null;
    _memoryCache.leaders = null;
    _memoryCache.matches = null;
    _memoryCache.tournaments = null;
    
    // Clear storage cache
    clearCache();
    
    // Reload
    await loadData(true);
    await loadMatches();
  }, [loadData, loadMatches]);
  
  // ─── INITIAL LOAD ───────────────────────────────────────────────────────
  
  useEffect(() => {
    loadData();
    loadMatches();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // ─── COMPUTED VALUES ────────────────────────────────────────────────────
  
  const rankedPlayers = useMemo(() => sortRankedPlayers(players), [players]);
  
  // ─── CONTEXT VALUE ────────────────────────────────────────────────────
  
  const value = useMemo(() => ({
    user,
    players,
    rankedPlayers,
    leaders,
    matches,
    tournaments,
    isLoading,
    refreshData,
  }), [user, players, rankedPlayers, leaders, matches, tournaments, isLoading, refreshData]);
  
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useFirebase(): FirebaseContextType {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside FirebaseProvider');
  }
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE APP SNAPSHOT (called by admin after data changes)
// ─────────────────────────────────────────────────────────────────────────────

async function writeAppSnapshot(players: Player[], tournaments: Tournament[]): Promise<void> {
  try {
    const snapshot: AppSnapshot = {
      leaderboard: sortRankedPlayers(players).slice(0, 50),
      activeTournaments: tournaments.filter(t => t.status === 'active').slice(0, 5),
      playerCount: players.length,
      matchCount: 0, // Could track this
      updatedAt: Date.now(),
    };
    
    await getDoc(doc(db, 'settings', 'appSnapshot')).then(async (snap) => {
      // Only write if document doesn't exist or is old
      if (!snap.exists() || (snap.data()?.updatedAt || 0) < Date.now() - 60000) {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'appSnapshot'), snapshot);
        console.log('[FirebaseContext] appSnapshot written');
      }
    });
  } catch (error) {
    console.warn('[FirebaseContext] Failed to write appSnapshot:', error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INVALIDATE CACHE (call after admin writes)
// ─────────────────────────────────────────────────────────────────────────────

export function invalidateCache(): void {
  _memoryCache.fetchedAt = 0;
  _memoryCache.players = null;
  _memoryCache.leaders = null;
  _memoryCache.matches = null;
  _memoryCache.tournaments = null;
  clearCache();
}

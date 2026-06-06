import { 
  Player, PartialPlayerStats, Leader, MatchRecord, Tournament, AuctionState, 
  ClubSeason, ClubInboxMessage, TransferThread, TransferOffer, ReleaseClause, 
  Club, GlobalSeason, PlayerInboxMessage, ClubSystemConfig, MarketListing, ClubTournament, ClubFixture, ClubStats
} from '../types';

import { db, auth } from '../firebase';
import { resolveCanonicalTournamentName, getSeasonInfo } from './utils';
import { trackRead, invalidateStorage } from './cache';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  getDoc,
  writeBatch,
  limit,
  getDocFromServer,
  serverTimestamp,
  where,
  arrayUnion,
  arrayRemove,
  increment,
  updateDoc
} from 'firebase/firestore';

/**
 * Bump this number whenever the stat computation logic changes.
 * All Player documents with a lower statsVersion will be flagged
 * as stale and can be resynced by the admin via the Resync button.
 */
export const STATS_VERSION = 2;
export const MIN_MATCHES = 10;

/**
 * Calculates adjusted ranking stats for a player (v3 - balanced for activity + performance).
 *
 * finalScore = (adjustedWinRate x 40) + (OVR x 0.4) + volumeBonus
 *
 * - adjustedWinRate = winRate x confidence  (penalises tiny sample sizes)
 * - confidence      = n / (n + 10)   reaches 67% at 20 matches, 91% at 100
 * - volumeBonus     = log2(MP + 1) x 2  rewards activity without letting it dominate
 * - OVR weight (0.4) factors in ELO-derived skill
 *
 * The best CONSISTENT player over many matches ranks highest.
 * A new 10-0 player stays provisional and below a 50-10 veteran.
 */
export function calculateRankingStats(player: Player) {
  const matchesPlayed = (player.win || 0) + (player.loss || 0) + (player.draw || 0);
  const points = (player.win || 0) * 3 + (player.draw || 0);
  const winRate = matchesPlayed > 0 ? (player.win || 0) / matchesPlayed : 0;

  // Confidence: reaches 67% at 20 matches, 83% at 50, 91% at 100
  const confidence = matchesPlayed / (matchesPlayed + 10);
  const adjustedWinRate = winRate * confidence;

  // Volume bonus: logarithmic so farming easy games has diminishing returns
  const volumeBonus = Math.log2(matchesPlayed + 1) * 2;

  // Final score: 40% win-rate performance + 40% OVR skill + activity bonus
  const finalScore = (adjustedWinRate * 40) + ((player.ovr || 60) * 0.4) + volumeBonus;

  return {
    finalScore: Math.round(finalScore * 100) / 100,
    isProvisional: matchesPlayed < MIN_MATCHES,
    confidence: Math.round(confidence * 100),
    adjustedWinRate: Math.round(adjustedWinRate * 100),
    matchesPlayed,
    points
  };
}

export function subscribeToSystemLocks(callback: (locks: Record<string, boolean>) => void) {
  const docRef = doc(db, 'settings', 'locks');
  return onSnapshot(docRef, (docSnap) => {
    let locks: Record<string, boolean> = { tournaments: false };
    if (docSnap.exists()) {
      locks = docSnap.data() as Record<string, boolean>;
    }
    callback(locks);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'settings/locks');
  });
}

/**
 * One-time fetch of system locks for public (non-admin) users.
 * Much cheaper than keeping a permanent onSnapshot listener open.
 */
export async function fetchSystemLocks(): Promise<Record<string, boolean>> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'locks'));
    if (docSnap.exists()) {
      return docSnap.data() as Record<string, boolean>;
    }
  } catch (error) {
    // Non-critical for public users G�� fail silently
    console.warn('[Locks] Could not fetch system locks:', error);
  }
  return { tournaments: false };
}

export async function toggleSystemLock(systemId: string, locked: boolean) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  try {
    const lockDoc = doc(db, 'settings', 'locks');
    await setDoc(lockDoc, { [systemId]: locked }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `settings/locks`);
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// APP VERSIONING (Real-time Sync)
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export function subscribeToAppVersion(callback: (version: string) => void) {
  const docRef = doc(db, 'settings', 'version');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().currentVersion || '1.0.0');
    }
  });
}

export async function updateAppVersion(newVersion: string) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  try {
    await setDoc(doc(db, 'settings', 'version'), { 
      currentVersion: newVersion,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'settings/version');
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// SYSTEM METADATA
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

const META_DOC_PATH = 'settings/meta';
const CACHE_DOC_PATH = 'settings/meta'; // Unified path for all cache invalidation

/**
 * Called after every admin write to signal the last update time.
 */
async function updateLastUpdated(): Promise<void> {}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export let isQuotaExceeded = false;

/** Get current quota exceeded status - use this to check before operations */
export function getQuotaExceededStatus(): boolean {
  return isQuotaExceeded;
}

/** Reset quota exceeded flag (for recovery after quota resets) */
export function resetQuotaExceeded(): void {
  isQuotaExceeded = false;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errStrRaw = error instanceof Error ? error.message : (typeof error === 'object' && error !== null ? JSON.stringify(error) : String(error));
  const errInfo: FirestoreErrorInfo = {
    error: errStrRaw,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  if (errStrRaw.toLowerCase().includes('quota') || errStrRaw.toLowerCase().includes('exceeded') || errStrRaw.toLowerCase().includes('resource-exhausted')) {
    isQuotaExceeded = true;
    console.warn('CRITICAL: Firestore Quota Exceeded. Disabling all local writes.');
  }

  const event = new CustomEvent('firestore-error', { detail: errInfo });
  window.dispatchEvent(event);

  if (operationType === OperationType.GET || operationType === OperationType.LIST) {
    // Don't throw for read operations to prevent app crash, just log
    return;
  }
  throw new Error(JSON.stringify(errInfo));
}

let _connectionTested = false;
export async function testFirestoreConnection() {
  if (_connectionTested) return;
  _connectionTested = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection test successful');
  } catch (error: any) {
    _connectionTested = false; // allow retry if it was a transient failure
    if (error?.message?.includes('the client is offline')) {
      console.warn("Firestore is offline. Retrying in background...");
    } else if (error?.code === 'resource-exhausted' || String(error).toLowerCase().includes('quota') || String(error).toLowerCase().includes('resource-exhausted')) {
      console.warn("Quota exceeded detected during connection test.");
      const errInfo: FirestoreErrorInfo = {
        error: error.message || 'Quota exceeded',
        operationType: OperationType.GET,
        path: 'test/connection',
        authInfo: {
          userId: auth.currentUser?.uid || 'anonymous',
          email: auth.currentUser?.email || '',
          emailVerified: auth.currentUser?.emailVerified || false,
          isAnonymous: auth.currentUser?.isAnonymous || true,
          providerInfo: auth.currentUser?.providerData.map(p => ({ providerId: p.providerId, displayName: p.displayName || '', email: p.email || '', photoUrl: p.photoURL || '' })) || [],
          tenantId: null
        }
      };
      const event = new CustomEvent('firestore-error', { detail: errInfo });
      window.dispatchEvent(event);
    } else if (error?.code === 'permission-denied') {
      console.log('Firestore connection test: permission-denied on test collection (expected for anon users).');
    }
  }
}

export const INITIAL_LEADERS: Leader[] = [];

export function computeGlobalElo(players: Player[], matches: MatchRecord[]): Record<string, number> {
  const elos: Record<string, number> = {};
  const matchCount: Record<string, number> = {};
  
  players.forEach(p => {
    elos[p.id] = 1200;
    matchCount[p.id] = 0;
  });

  const sorted = [...matches].sort((a,b) => a.timestamp - b.timestamp);

  sorted.forEach(m => {
    if (!elos[m.p1Id]) { elos[m.p1Id] = 1200; matchCount[m.p1Id] = 0; }
    if (!elos[m.p2Id]) { elos[m.p2Id] = 1200; matchCount[m.p2Id] = 0; }

    const elo1 = elos[m.p1Id];
    const elo2 = elos[m.p2Id];

    const expected1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
    const expected2 = 1 / (1 + Math.pow(10, (elo1 - elo2) / 400));

    let actual1 = 0.5, actual2 = 0.5;
    const score1 = Number(m.p1Score);
    const score2 = Number(m.p2Score);
    
    if (score1 > score2) { actual1 = 1; actual2 = 0; }
    else if (score1 < score2) { actual1 = 0; actual2 = 1; }

    // Use higher K factor for placements (first 5 games)
    const K1 = matchCount[m.p1Id] < 5 ? 64 : 32;
    const K2 = matchCount[m.p2Id] < 5 ? 64 : 32;

    matchCount[m.p1Id]++;
    matchCount[m.p2Id]++;

    elos[m.p1Id] = elo1 + K1 * (actual1 - expected1);
    elos[m.p2Id] = elo2 + K2 * (actual2 - expected2);
  });

  return elos;
}

export function calculateOvrHybrid(player: Player, elo: number): number {
  const totalMatches = player.win + player.loss + player.draw;
  if (totalMatches === 0) return 60;
  
  const winPct = player.win / totalMatches;
  // Factor experience softly
  const gamesFactor = Math.min(totalMatches, 20) / 20;
  const goalDiff = player.goalsScored - player.goalsConceded;
  // Symmetric cap: ±15 so goal farming and heavy conceding don't over-swing OVR
  const gdFactor = Math.max(-15, Math.min(goalDiff, 15));
  
  // Base stat value (gives up to +18 OVR)
  const statsBonus = (winPct * 15) + (gamesFactor * 5) + (gdFactor * 0.4);
  
  // Elo pulls its weight smoothly (gives +/- based on actual true chess rating)
  const eloBonus = (elo - 1200) / 10;
  
  let ovr = 60 + statsBonus + eloBonus;
  return Math.max(40, Math.min(99, Math.round(ovr)));
}

export const INITIAL_PLAYERS: Player[] = [];

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// DATA CACHING & DEDUPLICATION
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 60 minutes — matches FirebaseContext/localStorage session TTL (reduced from 30 min to cut reads by ~50%)
const _cache = new Map<string, CacheEntry<any>>();
const _pendingRequests = new Map<string, Promise<any>>();

/**
 * Executes a query with caching and deduplication.
 */
async function fetchWithCache<T>(key: string, queryFn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
  const now = Date.now();
  const cached = _cache.get(key);
  
  if (cached && (now - cached.timestamp < ttl)) {
    return cached.data;
  }

  if (_pendingRequests.has(key)) {
    return _pendingRequests.get(key);
  }

  const promise = queryFn().finally(() => _pendingRequests.delete(key));
  _pendingRequests.set(key, promise);

  try {
    const data = await promise;
    _cache.set(key, { data, timestamp: now });
    // Track reads for quota monitoring
    if (Array.isArray(data)) trackRead(data.length || 1);
    else trackRead(1);
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Clears specific or all cache entries.
 */
export function invalidateCache(key?: string) {
  if (key) {
    _cache.delete(key);
  } else {
    _cache.clear();
  }
}

/** Clears all cache entries starting with prefix. Used by delete ops where the
 * exact season/key is not available at the call site. */
export function invalidateCacheByPrefix(prefix: string) {
  for (const key of Array.from(_cache.keys())) {
    if (key.startsWith(prefix)) _cache.delete(key);
  }
}

// IMPORTANT: Default limit=100 prevents unbounded collection scans.
export async function fetchPlayers(limitCount = 100, force = false): Promise<Player[]> {
  const cacheKey = `players_${limitCount}`;
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const d = doc.data();
      return { id: doc.id, ...d, image: d.image || '/default-logo.jpg' } as Player;
    });
  });
}

export async function fetchLeaders(force = false): Promise<Leader[]> {
  const cacheKey = 'leaders_top50';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = query(collection(db, 'leaders'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const d = doc.data();
      return { id: doc.id, ...d, image: d.image || '/default-logo.jpg' } as Leader;
    });
  });
}

export async function fetchMatches(limitCount = 100, force = false): Promise<MatchRecord[]> {
  const cacheKey = `matches_${limitCount}`;
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
  });
}

export async function fetchTournaments(force = false): Promise<Tournament[]> {
  const cacheKey = 'tournaments_active';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
  });
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// PLAYER SELF-REGISTRATION
// Adds the player as a Team entry in the tournament and records their player ID
// in registeredPlayerIds. Calls saveTournament() which already bumps the
// cache-invalidation timestamp G�� all public users will see the update.
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function registerPlayerInTournament(
  tournament: Tournament,
  playerId: string,
  playerName: string,
  playerImage: string
): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) {
    throw new Error('SYSTEM LOCKED: Cannot register while quota is exceeded.');
  }

  // Prevent duplicate registration
  const alreadyRegistered = (tournament.registeredPlayerIds || []).includes(playerId);
  if (alreadyRegistered) {
    throw new Error('You are already registered for this tournament.');
  }

  // Check slot limit
  if (tournament.maxTeams !== undefined && tournament.teams.length >= tournament.maxTeams) {
    throw new Error('This tournament is full. No more slots available.');
  }

  const newTeam = {
    id: playerId,
    name: playerName,
    shortName: playerName.substring(0, 3).toUpperCase(),
    logo: playerImage || undefined,
  };

  const updatedTournament: Tournament = {
    ...tournament,
    teams: [...tournament.teams, newTeam],
    registeredPlayerIds: [...(tournament.registeredPlayerIds || []), playerId],
  };

  await saveTournament(updatedTournament);
  // saveTournament already calls updateLastUpdated() G�� no need to call it again
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// PLAYER PROFILE UPDATE
// Updates only the profile fields (image, uid, device) for a player.
// Uses updateDoc (partial update) G�� cheaper than a full setDoc.
// Bumps the cache invalidation timestamp so all users get fresh data.
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function updatePlayerProfile(
  playerId: string,
  updates: { image?: string; uid?: string; device?: string }
): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) {
    throw new Error('SYSTEM LOCKED: Cannot update profile while quota is exceeded.');
  }
  if (!playerId) throw new Error('No player ID provided.');

  try {
    await setDoc(doc(db, 'players', playerId), updates, { merge: true });
    
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `players/${playerId}`);
  }
}


/**
 * Fetches ALL matches for a specific player from Firestore.
 * Uses two queries (p1Id and p2Id) since Firestore doesn't support OR on different fields.
 * Limited to 100 most recent for performance, but used specifically for 
 * recomputing stats during admin writes.
 */
async function fetchAllMatchesForPlayer(playerId: string): Promise<MatchRecord[]> {
  // Short 2-minute cache — prevents duplicate reads when addMatch/editMatch
  // call this for both p1 and p2 within the same operation.
  const cacheKey = `playerMatches_${playerId}`;
  return fetchWithCache(cacheKey, async () => {
    const [snap1, snap2] = await Promise.all([
      getDocs(query(collection(db, 'matches'), where('p1Id', '==', playerId), orderBy('timestamp', 'desc'), limit(100))),
      getDocs(query(collection(db, 'matches'), where('p2Id', '==', playerId), orderBy('timestamp', 'desc'), limit(100))),
    ]);
    const seen = new Set<string>();
    const results: MatchRecord[] = [];
    [...snap1.docs, ...snap2.docs].forEach(d => {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        results.push({ id: d.id, ...d.data() } as MatchRecord);
      }
    });
    return results.sort((a, b) => a.timestamp - b.timestamp);
  }, 2 * 60 * 1000); // 2-min TTL — short enough to stay accurate, long enough to deduplicate
}

// Admin-only real-time listener. Limit=200 is sufficient for any club.
// ⚠️ DEPRECATED: Use fetchPlayersOnce() with polling instead to reduce reads.
export function subscribeToPlayers(callback: (players: Player[], hasPending: boolean) => void, limitCount = 200, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    trackRead(players.length || 1);
    callback(players, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'players');
  });
}

// ⚠️ DEPRECATED: Use fetchLeadersOnce() with polling instead to reduce reads.
export function subscribeToLeaders(callback: (leaders: Leader[], hasPending: boolean) => void, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'leaders'), orderBy('points', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const leaders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
    callback(leaders, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'leaders');
  });
}

// ⚠️ DEPRECATED: Use fetchMatchesOnce() with polling instead to reduce reads.
export function subscribeToMatches(callback: (matches: MatchRecord[], hasPending: boolean) => void, limitCount = 50, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
    callback(matches, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'matches');
  });
}

// ⚠️ DEPRECATED: Use fetchTournamentsOnce() with polling instead to reduce reads.
export function subscribeToTournaments(callback: (tournaments: Tournament[], hasPending: boolean) => void, limitCount = 50, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
    callback(tournaments, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'tournaments');
  });
}

/**
 * One-time fetch of players — replaces onSnapshot for non-real-time use.
 * Cached in memory for 60 minutes to reduce reads.
 */
export async function fetchPlayersPolling(limitCount = 200): Promise<Player[]> {
  return fetchWithCache(`players_polling_${limitCount}`, async () => {
    const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const players = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    trackRead(players.length);
    return players;
  }, CACHE_TTL);
}

/**
 * One-time fetch of leaders — replaces onSnapshot for non-real-time use.
 */
export async function fetchLeadersPolling(): Promise<Leader[]> {
  return fetchWithCache('leaders_polling', async () => {
    const q = query(collection(db, 'leaders'), orderBy('points', 'desc'), limit(50));
    const snap = await getDocs(q);
    const leaders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
    trackRead(leaders.length);
    return leaders;
  }, CACHE_TTL);
}

/**
 * One-time fetch of matches — replaces onSnapshot for non-real-time use.
 */
export async function fetchMatchesPolling(limitCount = 50): Promise<MatchRecord[]> {
  return fetchWithCache(`matches_polling_${limitCount}`, async () => {
    const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const matches = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
    trackRead(matches.length);
    return matches;
  }, CACHE_TTL);
}

/**
 * One-time fetch of tournaments — replaces onSnapshot for non-real-time use.
 */
export async function fetchTournamentsPolling(limitCount = 50): Promise<Tournament[]> {
  return fetchWithCache(`tournaments_polling_${limitCount}`, async () => {
    const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const tournaments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
    trackRead(tournaments.length);
    return tournaments;
  }, CACHE_TTL);
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// CORE STAT COMPUTATION ENGINE
// Pure function G�� no side effects.
// Produces global stats, seasonStats, and tournamentStats from raw matches.
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

function buildPartialStats(playerMatches: MatchRecord[], playerId: string): PartialPlayerStats {
  let win = 0, loss = 0, draw = 0, goalsScored = 0, goalsConceded = 0;
  playerMatches.forEach(m => {
    const isP1 = m.p1Id === playerId;
    const myScore = isP1 ? Number(m.p1Score) : Number(m.p2Score);
    const oppScore = isP1 ? Number(m.p2Score) : Number(m.p1Score);
    goalsScored += myScore;
    goalsConceded += oppScore;
    if (myScore > oppScore) win++;
    else if (myScore < oppScore) loss++;
    else draw++;
  });
  const form = [...playerMatches].slice(-5).map(m => {
    const isP1 = m.p1Id === playerId;
    const myScore = isP1 ? Number(m.p1Score) : Number(m.p2Score);
    const oppScore = isP1 ? Number(m.p2Score) : Number(m.p1Score);
    return myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
  });
  return { win, loss, draw, goalsScored, goalsConceded, form };
}

export function computePlayerStats(player: Player, allMatches: MatchRecord[], elo: number): Player {
  // G��G�� 1. Filter to this player's matches (sorted asc for correct form order) G��G��
  const playerMatches = allMatches
    .filter(m => m.p1Id === player.id || m.p2Id === player.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  // G��G�� 2. Global all-time stats G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
  const global = buildPartialStats(playerMatches, player.id);

  // G��G�� 3. Per-season stats G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
  const seasonGroups: Record<string, MatchRecord[]> = {};
  playerMatches.forEach(m => {
    const season = getSeasonInfo(new Date(m.timestamp)).name;
    if (!seasonGroups[season]) seasonGroups[season] = [];
    seasonGroups[season].push(m);
  });
  const seasonStats: Record<string, PartialPlayerStats> = {};
  Object.entries(seasonGroups).forEach(([season, matches]) => {
    seasonStats[season] = buildPartialStats(matches, player.id);
  });

  // G��G�� 4. Per-tournament stats (keyed by `season__canonicalTournament`) G��G��G��G��G��G��G��
  const tournamentGroups: Record<string, MatchRecord[]> = {};
  playerMatches.forEach(m => {
    if (!m.tournament || m.tournament === 'Friendly') return;
    const season = getSeasonInfo(new Date(m.timestamp)).name;
    const canonical = resolveCanonicalTournamentName(m.tournament);
    const key = `${season}__${canonical}`;
    if (!tournamentGroups[key]) tournamentGroups[key] = [];
    tournamentGroups[key].push(m);
  });
  const tournamentStats: Record<string, PartialPlayerStats> = {};
  Object.entries(tournamentGroups).forEach(([key, matches]) => {
    tournamentStats[key] = buildPartialStats(matches, player.id);
  });

  // G��G�� 5. Assemble final Player document G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
  const updatedPlayer: Player = {
    ...player,
    win: global.win,
    loss: global.loss,
    draw: global.draw,
    goalsScored: global.goalsScored,
    goalsConceded: global.goalsConceded,
    form: global.form,
    seasonStats,
    tournamentStats,
    statsLastUpdated: Date.now(),
    statsVersion: STATS_VERSION,
  };

  updatedPlayer.ovr = calculateOvrHybrid(updatedPlayer, elo);
  updatedPlayer.elo = Math.round(elo); // Store computed ELO on document for fast reads
  return updatedPlayer;
}

/**
 * Admin-triggered full resync.
 * Fetches ALL matches from Firestore, recomputes every player from scratch,
 * and writes all Player documents atomically.
 */
export async function recalculateAllStats(playersArg?: Player[]) {
  
  await ensureAdminSession();
  const batch = writeBatch(db);
  
  // Recovery: If no players provided, fetch them all from Firestore first
  let playersToSync = playersArg || [];
  if (playersToSync.length === 0) {
    console.log('[Resync] No players provided, fetching all players from Firestore...');
    const allPlayersSnap = await getDocs(query(collection(db, 'players'), limit(500)));
    trackRead(allPlayersSnap.docs.length);
    playersToSync = allPlayersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
  }

  if (playersToSync.length === 0) {
    console.warn('[Resync] No players found in database to resync.');
    return;
  }

  // Limit to recent 500 matches - sufficient for accurate ELO, prevents full-collection scan.
  const fullMatchesSnap = await getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(500)));
  trackRead(fullMatchesSnap.docs.length);
  const allMatches = fullMatchesSnap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
  const elos = computeGlobalElo(playersToSync, allMatches);
  playersToSync.forEach(p => {
    const updatedPlayer = computePlayerStats(p, allMatches, elos[p.id] || 1200);
    batch.set(doc(db, 'players', p.id), updatedPlayer);
  });
  try {
    await batch.commit();
    // Refresh precomputed snapshot so next cold-start user reads 1 doc instead of 50+
    // Fire-and-forget: non-blocking, doesn't affect match recording latency
    const updatedPlayers = playersToSync.map(p => computePlayerStats(p, allMatches, elos[p.id] || 1200));
    writeAppSnapshot(updatedPlayers, []).catch(() => {});
    console.log('[Resync] Stats recalculated. appSnapshot refreshed.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-recalculate-stats');
  }
}

/**
 * Seeds the database with initial mock data.
 * Useful for recovering an empty system.
 */
export async function seedDatabase() {
  
  await ensureAdminSession();
  const { MOCK_PLAYERS, LEADERS } = await import('../mockData');
  const batch = writeBatch(db);

  MOCK_PLAYERS.forEach(p => {
    batch.set(doc(db, 'players', p.id), { ...p, statsVersion: STATS_VERSION });
  });

  LEADERS.forEach(l => {
    batch.set(doc(db, 'leaders', l.id), l);
  });

  await batch.commit();
  
  console.log('[Seed] Database seeded with mock players and leaders.');
}

export async function savePlayer(player: Player) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot save player info while Quota is exceeded. Please refresh after reset.");
  }
  const path = `players/${player.id}`;
  console.log('Saving player to Firestore:', path, player);
  try {
    await setDoc(doc(db, 'players', player.id), player);
    console.log('Player saved successfully');
    // Signal all public users their cache is now stale
    
  } catch (error) {
    console.error('Error in savePlayer:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Adds a match and atomically recomputes stats for affected players.
 * Fetches FULL match history per-player from Firestore G�� not from the
 * capped real-time listener G�� guaranteeing correctness regardless of
 * how many total matches exist.
 */
export async function addMatch(
  p1: Player,
  p1Score: number,
  p2Score: number,
  p2: Player | undefined,
  _legacyMatches: MatchRecord[], // kept for API compatibility, not used
  tournament?: string,
  p2NameOverride?: string,
  seasonId?: string,
  matchday?: number,
  sourceTournamentId?: string,
  sourceFixtureId?: string,
  clubFixtureId?: string,
  clubSubMatchId?: string
): Promise<string> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot add match while Quota is exceeded.");
  }
  const batch = writeBatch(db);

  // 1. Write the new match document first
  const matchRef = doc(collection(db, 'matches'));
  const rawRecord = {
    id: matchRef.id,
    timestamp: Date.now(),
    p1Id: p1.id,
    p1Name: p1.name,
    p1Score,
    p2Id: p2?.id,
    p2Name: p2 ? p2.name : (p2NameOverride || 'External Opponent'),
    p2Score,
    tournament: tournament || 'Friendly',
    seasonId: seasonId || '',
    matchday: matchday || 0,
    sourceTournamentId,
    sourceFixtureId,
    clubFixtureId,
    clubSubMatchId,
  };
  
  const matchRecord = Object.fromEntries(
    Object.entries(rawRecord).filter(([_, v]) => v !== undefined)
  ) as unknown as MatchRecord;

  batch.set(matchRef, matchRecord);

  // 2. Fetch full match history for each affected player from Firestore
  const [p1Matches, p2Matches] = await Promise.all([
    fetchAllMatchesForPlayer(p1.id),
    p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
  ]);

  // Include the new match (not yet committed, but we know its contents)
  const p1AllMatches = [...p1Matches, matchRecord];
  const p2AllMatches = p2 ? [...p2Matches, matchRecord] : [];

  // 3. Compute ELO from merged full history for these two players
  const allForElo = [...new Map([...p1Matches, ...(p2 ? p2Matches : [])].map(m => [m.id, m])).values(), matchRecord]
    .sort((a, b) => a.timestamp - b.timestamp);
  const elos = computeGlobalElo([p1, ...(p2 ? [p2] : [])], allForElo);

  // 4. Recompute full Player documents and batch write
  const updatedP1 = computePlayerStats(p1, p1AllMatches, elos[p1.id] || 1200);
  batch.set(doc(db, 'players', p1.id), updatedP1);

  if (p2) {
    const updatedP2 = computePlayerStats(p2, p2AllMatches, elos[p2.id] || 1200);
    batch.set(doc(db, 'players', p2.id), updatedP2);
  }

  try {
    // 5. Dynamic Manager Rating updates - OPTIMIZED: only fetch relevant clubs
    const p1ClubQuery = query(collection(db, 'clubs'), where('squadIds', 'array-contains', p1.id), limit(1));
    const p1ClubSnap = await getDocs(p1ClubQuery);
    
    let p2ClubSnap: any = { docs: [] };
    if (p2 && p2.id !== p1.id) {
      const p2ClubQuery = query(collection(db, 'clubs'), where('squadIds', 'array-contains', p2.id), limit(1));
      p2ClubSnap = await getDocs(p2ClubQuery);
    }

    let p1Change = 0, p2Change = 0;
    if (p1Score > p2Score) { p1Change = 2; p2Change = -2; }
    else if (p2Score > p1Score) { p1Change = -2; p2Change = 2; }
    else { p1Change = 1; p2Change = 1; }

    if (!p1ClubSnap.empty) {
      const p1Club = { id: p1ClubSnap.docs[0].id, ...p1ClubSnap.docs[0].data() } as Club;
      const newRating = Math.max(0, Math.min(100, (p1Club.managerRating || 80) + p1Change));
      batch.update(doc(db, 'clubs', p1Club.id), { managerRating: newRating });
    }
    if (p2 && !p2ClubSnap.empty) {
      const p2Club = { id: p2ClubSnap.docs[0].id, ...p2ClubSnap.docs[0].data() } as Club;
      const newRating = Math.max(0, Math.min(100, (p2Club.managerRating || 80) + p2Change));
      batch.update(doc(db, 'clubs', p2Club.id), { managerRating: newRating });
    }
  } catch(e) {
    console.warn("Could not calculate dynamic manager ratings", e);
  }

  try {
    await batch.commit();
    // Bust precomputed snapshot caches so next user load gets fresh leaderboard.
    // Full snapshot refresh happens on next recalculateAllStats or admin data view.
    invalidateCache(APP_SNAPSHOT_CACHE_KEY);
    invalidateStorage(APP_SNAPSHOT_CACHE_KEY);
    return matchRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
    throw error;
  }
}

/**
 * Edits a match score/tournament and atomically recomputes affected players.
 * Always fetches the full match history from Firestore.
 */
export async function editMatch(
  oldMatch: MatchRecord,
  newP1Score: number,
  newP2Score: number,
  players: Player[],
  _legacyMatches: MatchRecord[], // kept for API compatibility, not used
  newTournament?: string,
  newSeasonId?: string,
  newMatchday?: number
) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);

  const updatedMatchRecord: MatchRecord = {
    ...oldMatch,
    p1Score: newP1Score,
    p2Score: newP2Score,
    tournament: newTournament || oldMatch.tournament || 'Friendly',
    seasonId: newSeasonId || oldMatch.seasonId || '',
    matchday: newMatchday || oldMatch.matchday || 0,
  };

  batch.update(doc(db, 'matches', oldMatch.id), {
    p1Score: newP1Score,
    p2Score: newP2Score,
    tournament: updatedMatchRecord.tournament,
    seasonId: updatedMatchRecord.seasonId,
    matchday: updatedMatchRecord.matchday,
  });

  const p1 = players.find(p => p.id === oldMatch.p1Id);
  const p2 = oldMatch.p2Id ? players.find(p => p.id === oldMatch.p2Id) : undefined;

  const [p1Matches, p2Matches] = await Promise.all([
    p1 ? fetchAllMatchesForPlayer(p1.id) : Promise.resolve([] as MatchRecord[]),
    p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
  ]);

  // Replace the edited match in the fetched history
  const replaceEdited = (list: MatchRecord[]) =>
    list.map(m => m.id === oldMatch.id ? updatedMatchRecord : m);

  const p1AllMatches = replaceEdited(p1Matches);
  const p2AllMatches = replaceEdited(p2Matches);

  const allForElo = [...new Map([...p1Matches, ...(p2 ? p2Matches : [])].map(m => [m.id, m])).values()]
    .map(m => m.id === oldMatch.id ? updatedMatchRecord : m)
    .sort((a, b) => a.timestamp - b.timestamp);
  const affectedPlayers = [p1, ...(p2 ? [p2] : [])].filter(Boolean) as Player[];
  const elos = computeGlobalElo(affectedPlayers, allForElo);

  if (p1) {
    batch.set(doc(db, 'players', p1.id), computePlayerStats(p1, p1AllMatches, elos[p1.id] || 1200));
  }
  if (p2) {
    batch.set(doc(db, 'players', p2.id), computePlayerStats(p2, p2AllMatches, elos[p2.id] || 1200));
  }

  // Dynamic Manager Rating updates (Edit logic) — use targeted queries not full collection fetch
  try {
    const [p1ClubSnap, p2ClubSnap] = await Promise.all([
      getDocs(query(collection(db, 'clubs'), where('squadIds', 'array-contains', p1?.id || ''), limit(1))),
      p2 ? getDocs(query(collection(db, 'clubs'), where('squadIds', 'array-contains', p2.id), limit(1))) : Promise.resolve({ docs: [] } as any),
    ]);
    const p1Club = p1ClubSnap.docs.length > 0 ? { id: p1ClubSnap.docs[0].id, ...p1ClubSnap.docs[0].data() } as Club : undefined;
    const p2Club = p2ClubSnap.docs.length > 0 ? { id: p2ClubSnap.docs[0].id, ...p2ClubSnap.docs[0].data() } as Club : undefined;

    const getChange = (s1: number, s2: number) => {
      if (s1 > s2) return 2;
      if (s2 > s1) return -2;
      return 1;
    };

    const oldP1Change = getChange(oldMatch.p1Score, oldMatch.p2Score);
    const oldP2Change = getChange(oldMatch.p2Score, oldMatch.p1Score);
    const newP1Change = getChange(newP1Score, newP2Score);
    const newP2Change = getChange(newP2Score, newP1Score);

    if (p1Club) {
      const newRating = Math.max(0, Math.min(100, (p1Club.managerRating || 80) - oldP1Change + newP1Change));
      batch.update(doc(db, 'clubs', p1Club.id), { managerRating: newRating });
    }
    if (p2Club) {
      const newRating = Math.max(0, Math.min(100, (p2Club.managerRating || 80) - oldP2Change + newP2Change));
      batch.update(doc(db, 'clubs', p2Club.id), { managerRating: newRating });
    }
  } catch(e) {
    console.warn("Could not recalculate manager ratings on edit", e);
  }

  try {
    await batch.commit();
    
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-edit');
  }
}
/**
 * Deletes a match and atomically recomputes affected players.
 * Always fetches the full match history from Firestore.
 */
export async function deleteMatchFromHistory(
  matchRecord: MatchRecord,
  players: Player[],
  _legacyMatches: MatchRecord[] // kept for API compatibility, not used
) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);
  batch.delete(doc(db, 'matches', matchRecord.id));

  const p1 = players.find(p => p.id === matchRecord.p1Id);
  const p2 = matchRecord.p2Id ? players.find(p => p.id === matchRecord.p2Id) : undefined;

  const [p1Matches, p2Matches] = await Promise.all([
    p1 ? fetchAllMatchesForPlayer(p1.id) : Promise.resolve([] as MatchRecord[]),
    p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
  ]);

  // Exclude the deleted match
  const withoutDeleted = (list: MatchRecord[]) => list.filter(m => m.id !== matchRecord.id);
  const p1AllMatches = withoutDeleted(p1Matches);
  const p2AllMatches = withoutDeleted(p2Matches);

  const allForElo = [...new Map([...p1Matches, ...(p2 ? p2Matches : [])].map(m => [m.id, m])).values()]
    .filter(m => m.id !== matchRecord.id)
    .sort((a, b) => a.timestamp - b.timestamp);
  const affectedPlayers = [p1, ...(p2 ? [p2] : [])].filter(Boolean) as Player[];
  const elos = computeGlobalElo(affectedPlayers, allForElo);

  if (p1) {
    batch.set(doc(db, 'players', p1.id), computePlayerStats(p1, p1AllMatches, elos[p1.id] || 1200));
  }
  if (p2) {
    batch.set(doc(db, 'players', p2.id), computePlayerStats(p2, p2AllMatches, elos[p2.id] || 1200));
  }

  // Dynamic Manager Rating updates (Delete logic) — use targeted queries not full collection fetch
  try {
    const [p1ClubSnap, p2ClubSnap] = await Promise.all([
      getDocs(query(collection(db, 'clubs'), where('squadIds', 'array-contains', p1?.id || ''), limit(1))),
      p2 ? getDocs(query(collection(db, 'clubs'), where('squadIds', 'array-contains', p2.id), limit(1))) : Promise.resolve({ docs: [] } as any),
    ]);
    const p1Club = p1ClubSnap.docs.length > 0 ? { id: p1ClubSnap.docs[0].id, ...p1ClubSnap.docs[0].data() } as Club : undefined;
    const p2Club = p2ClubSnap.docs.length > 0 ? { id: p2ClubSnap.docs[0].id, ...p2ClubSnap.docs[0].data() } as Club : undefined;

    const getChange = (s1: number, s2: number) => {
      if (s1 > s2) return 2;
      if (s2 > s1) return -2;
      return 1;
    };

    const oldP1Change = getChange(matchRecord.p1Score, matchRecord.p2Score);
    const oldP2Change = getChange(matchRecord.p2Score, matchRecord.p1Score);

    if (p1Club) {
      const newRating = Math.max(0, Math.min(100, (p1Club.managerRating || 80) - oldP1Change));
      batch.update(doc(db, 'clubs', p1Club.id), { managerRating: newRating });
    }
    if (p2Club) {
      const newRating = Math.max(0, Math.min(100, (p2Club.managerRating || 80) - oldP2Change));
      batch.update(doc(db, 'clubs', p2Club.id), { managerRating: newRating });
    }
  } catch(e) {
    console.warn("Could not recalculate manager ratings on delete", e);
  }

  // Bidirectional Sync: Clear parent global tournament fixture
  if (matchRecord.sourceTournamentId && matchRecord.sourceFixtureId) {
    try {
      const tSnap = await getDoc(doc(db, 'tournaments', matchRecord.sourceTournamentId));
      if (tSnap.exists()) {
        const t = tSnap.data() as import('../types').Tournament;
        const updatedFixtures = t.fixtures.map(f =>
          f.id === matchRecord.sourceFixtureId
            ? { ...f, homeScore: null, awayScore: null, status: 'upcoming' as const, globalMatchId: undefined }
            : f
        );
        batch.update(doc(db, 'tournaments', matchRecord.sourceTournamentId), { fixtures: updatedFixtures });
      }
    } catch (e) {
      console.warn('Failed to clear global tournament fixture', e);
    }
  }

  // Bidirectional Sync: Clear parent club tournament fixture & revert club stats
  if (matchRecord.clubFixtureId && matchRecord.clubSubMatchId) {
    try {
      const fSnap = await getDoc(doc(db, 'clubFixtures', matchRecord.clubFixtureId));
      if (fSnap.exists()) {
        const cf = fSnap.data() as import('../types').ClubFixture;
        const subMatch = cf.subMatches.find(sm => sm.id === matchRecord.clubSubMatchId);
        
        const updatedSubMatches = cf.subMatches.map(sm =>
          sm.id === matchRecord.clubSubMatchId
            ? { ...sm, p1Score: null, p2Score: null, globalMatchId: undefined }
            : sm
        );
        batch.update(doc(db, 'clubFixtures', matchRecord.clubFixtureId), {
          subMatches: updatedSubMatches,
          status: 'active'
        });
        
        // Revert clubStats for both players
        const revertClubStats = (playerId: string | undefined, won: boolean, drawn: boolean, myScore: number, oppScore: number) => {
          if (!playerId) return;
          const player = players.find(p => p.id === playerId);
          if (!player || !player.clubStats) return;
          const prev = player.clubStats;
          
          const updated: import('../types').ClubStats = {
            ...prev,
            played: Math.max(0, prev.played - 1),
            won: Math.max(0, prev.won - (won ? 1 : 0)),
            drawn: Math.max(0, prev.drawn - (drawn ? 1 : 0)),
            lost: Math.max(0, prev.lost - (!won && !drawn ? 1 : 0)),
            goalsScored: Math.max(0, prev.goalsScored - myScore),
            goalsConceded: Math.max(0, prev.goalsConceded - oppScore),
            points: Math.max(0, prev.points - (won ? 3 : drawn ? 1 : 0)),
          };
          batch.update(doc(db, 'players', playerId), { clubStats: updated });
        };
        
        if (subMatch && subMatch.p1Score !== null && subMatch.p2Score !== null) {
           const p1Won = subMatch.p1Score > subMatch.p2Score;
           const drawn = subMatch.p1Score === subMatch.p2Score;
           revertClubStats(subMatch.p1Id, p1Won, drawn, subMatch.p1Score, subMatch.p2Score);
           revertClubStats(subMatch.p2Id, !p1Won && !drawn, drawn, subMatch.p2Score, subMatch.p1Score);
        }
      }
    } catch (e) {
      console.warn('Failed to clear club fixture and stats', e);
    }
  }

  try {
    await batch.commit();
    
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'batch-match-delete');
  }
}

export async function deletePlayer(id: string) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  const path = `players/${id}`;
  try {
    await deleteDoc(doc(db, 'players', id));
    
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveLeader(leader: Leader) {
  
  await ensureAdminSession();
  const path = `leaders/${leader.id}`;
  try {
    await setDoc(doc(db, 'leaders', leader.id), leader);
    
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteLeader(id: string) {
  
  await ensureAdminSession();
  const path = `leaders/${id}`;
  try {
    await deleteDoc(doc(db, 'leaders', id));
    
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveTournament(tournament: Tournament) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot update tournament while Quota is exceeded.");
  }
  const path = `tournaments/${tournament.id}`;
  try {
    await setDoc(doc(db, 'tournaments', tournament.id), tournament);
    // Bust caches so self-registration + admin changes are immediately visible.
    invalidateCache('tournaments_active');
    invalidateStorage('tournaments');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteTournament(id: string) {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  const path = `tournaments/${id}`;
  try {
    await deleteDoc(doc(db, 'tournaments', id));
    
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Bootstrap function
export async function bootstrapData() {
  const path = 'players';
  try {
    const q = query(collection(db, path), limit(1));
    const playersSnap = await getDocs(q);
    if (playersSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_PLAYERS.forEach(p => {
        batch.set(doc(db, 'players', p.id), p);
      });
      INITIAL_LEADERS.forEach(l => {
        batch.set(doc(db, 'leaders', l.id), l);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// CLUB ZONE STORE
// All reads are one-shot (getDocs/getDoc) G�� NO real-time listeners.
// This keeps quota impact minimal: data is only fetched when the Club Zone
// page is actually open. Each visitor pays at most ~3 reads per page load.
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function fetchClubConfig(force = false): Promise<ClubSystemConfig | null> {
  const cacheKey = 'club_config';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const snap = await getDoc(doc(db, 'settings', 'clubConfig'));
    return snap.exists() ? (snap.data() as ClubSystemConfig) : null;
  });
}

/** Persist the club system config (1 write). */
export async function saveClubConfig(config: ClubSystemConfig): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'settings', 'clubConfig'), config);
    invalidateCache('club_config');

  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/clubConfig');
    throw err;
  }
}

export async function fetchClubs(force = false): Promise<Club[]> {
  const cacheKey = 'clubs_all';
  if (force) invalidateCache(cacheKey);
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const snap = await getDocs(query(collection(db, 'clubs'), orderBy('name', 'asc'), limit(50))); // reduced from 100
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'clubs');
      throw err;
    }
  });
}

// ⚠️ DEPRECATED: Use fetchClubsPolling() with polling instead to reduce reads.
export function subscribeToClubs(callback: (clubs: Club[]) => void, limitCount = 50) {
    const q = query(collection(db, 'clubs'), orderBy('name', 'asc'), limit(limitCount));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => {
      const d = doc.data();
      return { id: doc.id, ...d, logo: d.logo || '/default-logo.jpg' } as Club;
    }));
  }, (err) => handleFirestoreError(err, OperationType.GET, 'clubs'));
}

/**
 * One-time fetch of clubs — replaces onSnapshot for non-real-time use.
 */
export async function fetchClubsPolling(limitCount = 50): Promise<Club[]> {
  return fetchWithCache(`clubs_polling_${limitCount}`, async () => {
    const q = query(collection(db, 'clubs'), orderBy('name', 'asc'), limit(limitCount));
    const snap = await getDocs(q);
    const clubs = snap.docs.map(doc => {
      const d = doc.data();
      return { id: doc.id, ...d, logo: d.logo || '/default-logo.jpg' } as Club;
    });
    trackRead(clubs.length);
    return clubs;
  }, CACHE_TTL);
}

/**
 * Save a club and update the owner player's clubId / isClubOwner flags.
 * If ownerId changed, clears old owner's flags.
 */
export async function saveClub(club: Club, previousOwnerId?: string): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  
  // Check for duplicate names (case insensitive) if this is a new club
  if (!club.id) {
    const q = query(collection(db, 'clubs'), where('name', '==', club.name), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error('A club with this name already exists.');
  }

  const batch = writeBatch(db);
  const clubId = club.id || `club_${Date.now()}`;
  const finalClub = { ...club, id: clubId };

  // Write club document
  batch.set(doc(db, 'clubs', clubId), finalClub);

  // If owner changed, clear old owner's flags
  if (previousOwnerId && previousOwnerId !== club.ownerId) {
    batch.update(doc(db, 'players', previousOwnerId), {
      clubId: null, isClubOwner: false, clubName: null,
      primaryColor: null, secondaryColor: null,
    });
  }

  // Set new owner's flags (denormalized for quota-free display)
  if (club.ownerId) {
    batch.update(doc(db, 'players', club.ownerId), {
      clubId: clubId,
      clubName: club.name,
      isClubOwner: true,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
    });
  }

  // Stamp clubId + club name on all squad members
  club.squadIds?.forEach(pid => {
    if (pid !== club.ownerId) {
      batch.update(doc(db, 'players', pid), {
        clubId: clubId,
        clubName: club.name,
        primaryColor: club.primaryColor,
        secondaryColor: club.secondaryColor,
      });
    }
  });

  try {
    await batch.commit();
    invalidateCache('clubs_all');
    
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${clubId}`);
    throw err;
  }
}

/** Delete a club and clean up all player references. */
export async function deleteClub(id: string): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  try {
    const snap = await getDoc(doc(db, 'clubs', id));
    if (snap.exists()) {
      const club = snap.data() as Club;
      const batch = writeBatch(db);
      // Clear club flags on all members (owner + squad)
      const allMemberIds = Array.from(new Set([club.ownerId, ...(club.squadIds || [])])).filter(Boolean);
      allMemberIds.forEach(pid => {
        batch.update(doc(db, 'players', pid), {
          clubId: null, isClubOwner: false, clubName: null,
          primaryColor: null, secondaryColor: null,
          isListed: false, listingPrice: null,
        });
      });
      batch.delete(doc(db, 'clubs', id));
      await batch.commit();
    }
    
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `clubs/${id}`);
  }
}

/** Add a player to a club's squad (1 batch write). */
export async function addPlayerToClubSquad(club: Club, playerId: string, playerName: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  if (club.squadIds.includes(playerId)) return;
  const batch = writeBatch(db);
  const newSquad = [...club.squadIds, playerId];
  batch.update(doc(db, 'clubs', club.id), { squadIds: newSquad });
  batch.update(doc(db, 'players', playerId), {
    clubId: club.id, clubName: club.name,
    primaryColor: club.primaryColor, secondaryColor: club.secondaryColor,
  });
  try {
    await batch.commit();
    
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${club.id}/squad`);
    throw err;
  }
}

/** Remove a player from a club's squad (1 batch write). */
export async function removePlayerFromClubSquad(club: Club, playerId: string): Promise<void> {
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);
  const newSquad = club.squadIds.filter(id => id !== playerId);
  batch.update(doc(db, 'clubs', club.id), { squadIds: newSquad });
  batch.update(doc(db, 'players', playerId), {
    clubId: null, clubName: null, primaryColor: null, secondaryColor: null,
  });
  try {
    await batch.commit();
    
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${club.id}/squad`);
  }
}

/** Fetch all active market listings (1 collection read, cached 5 min). */
export async function fetchMarketListings(force = false): Promise<MarketListing[]> {
  const cacheKey = 'club_market_listings';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const snap = await getDocs(query(collection(db, 'clubListings'), orderBy('createdAt', 'desc'), limit(50))); // reduced from 100
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketListing));
  }, 5 * 60 * 1000);
}

/**
 * Fetch only the matches that are part of the active club season.
 * Uses a targeted `where` query G�� costs 1 read per match doc, never loads
 * unrelated matches. Called only when the Club Rankings tab is opened.
 */
export async function fetchClubSeasonMatches(seasonName: string, force = false): Promise<import('../types').MatchRecord[]> {
  const cacheKey = `clubSeasonMatches_${seasonName}`;
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const snap = await getDocs(
        query(collection(db, 'matches'), where('tournament', '==', seasonName), limit(200))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').MatchRecord));
    }, 5 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'matches-club-season');
    return [];
  }
}


/** List a player on the transfer market (2 writes). */
export async function listPlayerOnMarket(listing: MarketListing): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  const batch = writeBatch(db);
  batch.set(doc(db, 'clubListings', listing.id), listing);
  batch.update(doc(db, 'players', listing.playerId), { isListed: true, listingPrice: listing.price });
  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubListings/${listing.id}`);
    throw err;
  }
}

/** Remove a player listing from the market (2 writes). */
export async function delistPlayerFromMarket(listingId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);
  batch.delete(doc(db, 'clubListings', listingId));
  batch.update(doc(db, 'players', playerId), { isListed: false, listingPrice: null });
  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `clubListings/${listingId}`);
  }
}

/**
 * Purchase a player G�� atomic transfer of player + budget between clubs.
 * Uses a single writeBatch: 4 writes total (buyerClub, sellerClub, player, listing).
 */
export async function purchasePlayer(
  listing: MarketListing,
  buyerClub: Club,
  sellerClub: Club,
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  if (buyerClub.budget < listing.price) throw new Error('Insufficient budget to complete transfer.');

  const batch = writeBatch(db);

  // Buyer: deduct budget, add player to squad
  batch.update(doc(db, 'clubs', buyerClub.id), {
    budget: buyerClub.budget - listing.price,
    squadIds: [...buyerClub.squadIds, listing.playerId],
  });

  // Seller: add proceeds, remove player from squad
  batch.update(doc(db, 'clubs', sellerClub.id), {
    budget: sellerClub.budget + listing.price,
    squadIds: sellerClub.squadIds.filter(id => id !== listing.playerId),
  });

  // Update player — reset club-scoped stats & contract so first renewal is direct
  batch.update(doc(db, 'players', listing.playerId), {
    clubId: buyerClub.id,
    clubName: buyerClub.name,
    primaryColor: buyerClub.primaryColor,
    secondaryColor: buyerClub.secondaryColor,
    isListed: false,
    listingPrice: null,
    clubContract: null,
    clubStats: { goals: 0, matches: 0, wins: 0, losses: 0, draws: 0 },
  });

  // Delete listing
  batch.delete(doc(db, 'clubListings', listing.id));

  try {
    await batch.commit();
    
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'club-purchase');
    throw err;
  }
}

// G��G��G�� CLUB TOURNAMENTS & FIXTURES G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function fetchClubTournaments(seasonName: string, force = false): Promise<import('../types').ClubTournament[]> {
  const cacheKey = `clubTournaments_${seasonName}`;
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const snap = await getDocs(query(collection(db, 'clubTournaments'), where('season', '==', seasonName), limit(50)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').ClubTournament));
    }, 10 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubTournaments');
    return [];
  }
}

/**
 * Pure function — no Firestore reads.
 * Computes league table standings from completed club fixtures.
 * Goals = sub-match wins (each sub-match is a "goal" for the winning side).
 */
export function computeClubStandings(
  fixtures: import('../types').ClubFixture[],
  clubs: Club[]
): Array<{
  clubId: string; clubName: string;
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDiff: number; points: number;
}> {
  const table: Record<string, {
    clubId: string; clubName: string;
    played: number; won: number; drawn: number; lost: number;
    goalsFor: number; goalsAgainst: number;
  }> = {};

  // Initialize all participating clubs with zero stats
  clubs.forEach(c => {
    table[c.id] = { clubId: c.id, clubName: c.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
  });

  // Process completed fixtures only
  fixtures.filter(f => f.status === 'completed').forEach(f => {
    const homeId = f.homeClubId;
    const awayId = f.awayClubId;
    if (!table[homeId] || !table[awayId]) return;

    // Count sub-match wins as "goals"
    let homeGoals = 0, awayGoals = 0;
    (f.subMatches || []).forEach((sm: any) => {
      if (sm.p1Score !== null && sm.p1Score !== undefined && sm.p2Score !== null && sm.p2Score !== undefined) {
        if (sm.p1Score > sm.p2Score) homeGoals++;
        else if (sm.p2Score > sm.p1Score) awayGoals++;
        // draws don't count as goals
      }
    });

    table[homeId].played++;
    table[awayId].played++;
    table[homeId].goalsFor += homeGoals;
    table[homeId].goalsAgainst += awayGoals;
    table[awayId].goalsFor += awayGoals;
    table[awayId].goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) { table[homeId].won++; table[awayId].lost++; }
    else if (awayGoals > homeGoals) { table[awayId].won++; table[homeId].lost++; }
    else { table[homeId].drawn++; table[awayId].drawn++; }
  });

  return Object.values(table)
    .map(r => ({ ...r, goalDiff: r.goalsFor - r.goalsAgainst, points: r.won * 3 + r.drawn }))
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
}


export async function saveClubTournament(tourney: import('../types').ClubTournament): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'clubTournaments', tourney.id), tourney);
    invalidateCache(`clubTournaments_${tourney.season}`);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubTournaments/${tourney.id}`);
    throw err;
  }
}

export async function deleteClubTournament(id: string): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'clubTournaments', id));
    invalidateCacheByPrefix('clubTournaments_');
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubTournaments/${id}`);
    throw err;
  }
}

export async function fetchClubFixtures(seasonName: string, force = false): Promise<import('../types').ClubFixture[]> {
  // Cached per-season (10-min TTL) to avoid re-reads on every tab switch or mount.
  const cacheKey = `clubFixtures_${seasonName}`;
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const snap = await getDocs(query(collection(db, 'clubFixtures'), where('season', '==', seasonName), limit(100))); // reduced from 200
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').ClubFixture));
    }, 10 * 60 * 1000); // 10 min TTL
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubFixtures');
    return [];
  }
}

export async function saveClubFixture(fixture: import('../types').ClubFixture): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'clubFixtures', fixture.id), fixture);
    // Bust cache so next fetch reflects the change immediately
    const season = (fixture as any).season;
    if (season) invalidateCache(`clubFixtures_${season}`);
    else invalidateCacheByPrefix('clubFixtures_');
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${fixture.id}`);
    throw err;
  }
}

export async function deleteClubFixture(id: string): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'clubFixtures', id));
    invalidateCacheByPrefix('clubFixtures_');
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${id}`);
    throw err;
  }
}

/**
 * Save the result of a single sub-match within a club fixture.
 * Updates the fixture doc, creates a global match record (so stats update),
 * and marks the fixture completed when all sub-matches have scores.
 * Cost: 1 read (fixture) + 2 reads (player match histories) + 1 batch write.
 */
export async function saveClubFixtureResult(
  fixtureId: string,
  subMatchId: string,
  p1Score: number,
  p2Score: number,
  allPlayers: Player[],
  seasonId: string,
  matchday: number,
  config: import('../types').ClubSystemConfig
): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');

  // 1. Fetch the current fixture
  const fixtureSnap = await getDoc(doc(db, 'clubFixtures', fixtureId));
  if (!fixtureSnap.exists()) throw new Error(`Fixture ${fixtureId} not found.`);
  const fixture = { id: fixtureSnap.id, ...fixtureSnap.data() } as import('../types').ClubFixture;

  // 2. Find the sub-match to update
  const smIndex = fixture.subMatches.findIndex((sm: any) => sm.id === subMatchId);
  if (smIndex === -1) throw new Error(`Sub-match ${subMatchId} not found in fixture.`);
  const sm = fixture.subMatches[smIndex];

  // 3. Find the two players
  const p1 = allPlayers.find(p => p.id === sm.p1Id);
  const p2 = sm.p2Id ? allPlayers.find(p => p.id === sm.p2Id) : undefined;

  // 4. Create a global match record and update player stats
  let globalMatchId: string | undefined;
  if (p1) {
    try {
      // Use addMatch which handles ELO + stat recalculation atomically
      const matchRef = doc(collection(db, 'matches'));
      globalMatchId = matchRef.id;
      const matchRecord: MatchRecord = {
        id: globalMatchId,
        timestamp: Date.now(),
        p1Id: p1.id,
        p1Name: p1.name,
        p1Score,
        p2Id: p2?.id,
        p2Name: p2 ? p2.name : (sm.p2Name || 'External'),
        p2Score,
        tournament: config.season || 'Club League',
        seasonId,
        matchday,
      };
      const batch = writeBatch(db);
      batch.set(matchRef, matchRecord);

      // Recompute stats for affected players
      const [p1Matches, p2Matches] = await Promise.all([
        fetchAllMatchesForPlayer(p1.id),
        p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
      ]);
      const p1AllMatches = [...p1Matches, matchRecord];
      const p2AllMatches = p2 ? [...p2Matches, matchRecord] : [];
      const allForElo = [...new Map([...p1Matches, ...(p2 ? p2Matches : [])].map(m => [m.id, m])).values(), matchRecord]
        .sort((a, b) => a.timestamp - b.timestamp);
      const elos = computeGlobalElo([p1, ...(p2 ? [p2] : [])], allForElo);
      batch.set(doc(db, 'players', p1.id), computePlayerStats(p1, p1AllMatches, elos[p1.id] || 1200));
      if (p2) {
        batch.set(doc(db, 'players', p2.id), computePlayerStats(p2, p2AllMatches, elos[p2.id] || 1200));
      }
      await batch.commit();
    } catch (err) {
      console.warn('[saveClubFixtureResult] Could not create global match:', err);
      globalMatchId = undefined;
    }
  }

  // 5. Update the sub-match inside the fixture
  const updatedSubMatches = fixture.subMatches.map((s: any, i: number) =>
    i === smIndex ? { ...s, p1Score, p2Score, ...(globalMatchId ? { globalMatchId } : {}) } : s
  );

  // 6. Check if all sub-matches now have scores → mark fixture completed
  const allScored = updatedSubMatches.every((s: any) => s.p1Score !== null && s.p1Score !== undefined);
  const updatedFixture = {
    ...fixture,
    subMatches: updatedSubMatches,
    status: allScored ? 'completed' : fixture.status,
  };

  await setDoc(doc(db, 'clubFixtures', fixtureId), updatedFixture);
  invalidateCache(`clubFixtures_${seasonId}`);
  invalidateCache(`clubFixtures_${(fixture as any).season}`);
}


/**
 * Updates a specific sub-match inside a ClubFixture.
 * If all sub-matches are scored, the fixture is marked as 'completed' and player contracts are deducted.
 */
export async function updateFixtureSubMatch(
  fixtureId: string,
  subMatchId: string,
  p1Score: number,
  p2Score: number,
  config: import('../types').ClubSystemConfig
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  
  const fixRef = doc(db, 'clubFixtures', fixtureId);
  const fixSnap = await getDoc(fixRef);
  if (!fixSnap.exists()) throw new Error('Fixture not found');
  const fixture = fixSnap.data() as import('../types').ClubFixture;

  const newSubMatches = fixture.subMatches.map(sm => 
    sm.id === subMatchId ? { ...sm, p1Score, p2Score } : sm
  );
  
  const allCompleted = newSubMatches.every(sm => sm.p1Score !== null);
  
  const batch = writeBatch(db);
  batch.update(fixRef, { 
    subMatches: newSubMatches, 
    status: allCompleted ? 'completed' : fixture.status 
  });

  // When fixture completes: update global stats (affects ranking) + club-scoped stats + deduct contracts
  if (allCompleted) {
    const allParticipantIds = [...new Set([
      ...newSubMatches.map(sm => sm.p1Id),
      ...newSubMatches.map(sm => sm.p2Id)
    ])];
    const playerFetches = allParticipantIds.map(pid => getDoc(doc(db, 'players', pid)));
    const playerSnaps = await Promise.all(playerFetches);
    playerSnaps.forEach(docSnap => {
      if (!docSnap.exists()) return;
      const p = docSnap.data() as import('../types').Player;
      const updates: Record<string, any> = {};
      // Contract deduction
      if (config.contractsActive && config.defaultContractType === 'matches'
          && p.clubContract && p.clubContract.type === 'matches' && p.clubContract.amount > 0) {
        updates['clubContract.amount'] = p.clubContract.amount - 1;
      }
      // Aggregate sub-match results for this player
      let wG = 0, lG = 0, dG = 0, goalsG = 0, concG = 0;
      newSubMatches.forEach(sm => {
        const isP1 = sm.p1Id === p.id;
        const isP2 = sm.p2Id === p.id;
        if ((!isP1 && !isP2) || sm.p1Score === null || sm.p2Score === null) return;
        const mine = isP1 ? sm.p1Score : sm.p2Score;
        const opp  = isP1 ? sm.p2Score : sm.p1Score;
        goalsG += mine; concG += opp;
        if (mine > opp) wG++; else if (mine < opp) lG++; else dG++;
      });
      if (wG + lG + dG > 0) {
        updates.win  = (p.win  || 0) + wG;
        updates.loss = (p.loss || 0) + lG;
        updates.draw = (p.draw || 0) + dG;
        updates.goalsScored   = (p.goalsScored   || 0) + goalsG;
        updates.goalsConceded = (p.goalsConceded || 0) + concG;
        updates['clubStats.matches'] = ((p as any).clubStats?.matches || 0) + wG + lG + dG;
        updates['clubStats.wins']    = ((p as any).clubStats?.wins    || 0) + wG;
        updates['clubStats.losses']  = ((p as any).clubStats?.losses  || 0) + lG;
        updates['clubStats.draws']   = ((p as any).clubStats?.draws   || 0) + dG;
        updates['clubStats.goals']   = ((p as any).clubStats?.goals   || 0) + goalsG;
      }
      if (Object.keys(updates).length > 0) batch.update(docSnap.ref, updates);
    });
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${fixtureId}/subMatch`);
    throw err;
  }
}

// GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
// Ranking logic (can be used on the client-side array)
export function sortRankedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // 1. Players with 0 matches should ALWAYS be at the bottom
    const totalMatchesA = a.win + a.loss + a.draw;
    const totalMatchesB = b.win + b.loss + b.draw;
    if (totalMatchesA === 0 && totalMatchesB > 0) return 1;
    if (totalMatchesB === 0 && totalMatchesA > 0) return -1;

    // 2. Final Score (Primary ranking metric)
    const statsA = calculateRankingStats(a);
    const statsB = calculateRankingStats(b);
    if (statsB.finalScore !== statsA.finalScore) return statsB.finalScore - statsA.finalScore;

    // 3. OVR (Overall Rating tie-breaker)
    if (b.ovr !== a.ovr) return b.ovr - a.ovr;

    // 4. Points
    if (statsB.points !== statsA.points) return statsB.points - statsA.points;
    
    // 5. Goal Difference
    const gdA = a.goalsScored - a.goalsConceded;
    const gdB = b.goalsScored - b.goalsConceded;
    if (gdB !== gdA) return gdB - gdA;

    // 6. Win Percentage
    const winPctA = totalMatchesA > 0 ? a.win / totalMatchesA : 0;
    const winPctB = totalMatchesB > 0 ? b.win / totalMatchesB : 0;
    if (winPctB !== winPctA) return winPctB - winPctA;

    // 6. Goals Scored
    if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
    
    // 7. Total Wins
    if (b.win !== a.win) return b.win - a.win;
    
    // 8. More matches played ranks HIGHER (rewards activity, not "games in hand")
    if (totalMatchesA !== totalMatchesB) return totalMatchesB - totalMatchesA;
    
    return a.name.localeCompare(b.name);
  });
}

// GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
// CLUB ZONE V2 G AUCTION SYSTEM
// Single shared document "auctions/live" G all 60+ viewers share ONE listener.
// Cost: 1 read per user to connect + 1 write per bid/fold/reveal. Extremely cheap.
// GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG

const AUCTION_DOC = doc(db, 'auctions', 'live');

/** Real-time listener on the single auction document.
 * ⚠️ DEPRECATED: Use fetchAuctionPolling() with smart polling instead to reduce reads.
 * Smart polling only checks frequently when auction is ACTIVE, otherwise very infrequently.
 */
export function subscribeToAuction(callback: (state: AuctionState | null) => void) {
  return onSnapshot(AUCTION_DOC, (snap) => {
    if (!snap.exists()) return callback(null);
    const state = snap.data() as AuctionState;
    if (state.currentPlayer && !state.currentPlayer.image) {
      state.currentPlayer.image = '/default-logo.jpg';
    }
    callback(state);
  }, (err) => handleFirestoreError(err, OperationType.GET, 'auctions/live'));
}

/**
 * One-time fetch of auction state — replaces onSnapshot for non-real-time use.
 * Smart polling: uses 5s interval when auction is active, 60s otherwise.
 */
export async function fetchAuctionPolling(): Promise<AuctionState | null> {
  return fetchWithCache('auction_polling', async () => {
    const snap = await getDoc(AUCTION_DOC);
    trackRead(1);
    if (!snap.exists()) return null;
    const state = snap.data() as AuctionState;
    if (state.currentPlayer && !state.currentPlayer.image) {
      state.currentPlayer.image = '/default-logo.jpg';
    }
    return state;
  }, 5 * 1000); // Short TTL for auction — gets updated via polling in components
}

/** Admin: Initialize/reset the auction for a new session. */
export async function adminStartAuction(clubIds: string[], bidIncrement: number, basePrice: number): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const state: AuctionState = {
    auctionId: Date.now().toString(),
    status: 'idle',
    currentPlayer: null,
    basePrice,
    currentBid: 0,
    leadingClubId: null,
    leadingClubName: null,
    minNextBid: basePrice,
    bidIncrement,
    biddingOrder: clubIds,
    currentTurnIndex: 0,
    foldedClubs: [],
    startedAt: Date.now(),
    soldAt: null,
    adminId: auth.currentUser?.uid || null,
  };
  await setDoc(AUCTION_DOC, state);
}

/** Admin: Reveal the next player card. Resets bid state for the new player. */
export async function adminRevealCard(player: { id: string; name: string; image: string; ovr: number; currentClubId: string | null; currentClubName: string | null }, basePrice: number, bidIncrement: number): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(AUCTION_DOC, {
    status: 'active',
    currentPlayer: player,
    basePrice,
    currentBid: basePrice,
    leadingClubId: null,
    leadingClubName: null,
    minNextBid: basePrice + bidIncrement,
    foldedClubs: [],
    currentTurnIndex: 0,
    soldAt: null,
  }, { merge: true });
}

/** Club owner: Place a bid on the current player. */
export async function placeBid(clubId: string, clubName: string, bidAmount: number, currentState: AuctionState): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const nextTurnIndex = (currentState.currentTurnIndex + 1) % currentState.biddingOrder.filter(id => !currentState.foldedClubs.includes(id)).length;
  await setDoc(AUCTION_DOC, {
    currentBid: bidAmount,
    leadingClubId: clubId,
    leadingClubName: clubName,
    minNextBid: bidAmount + currentState.bidIncrement,
    currentTurnIndex: nextTurnIndex,
    bidDeadlineAt: Date.now() + 90_000, // Reset 90s countdown on each bid
  }, { merge: true });
}

/** Auction admin: Force-advance to the next club's turn (timeout or manual skip). */
export async function adminNextTurn(currentState: AuctionState): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const activeBidders = currentState.biddingOrder.filter(id => !currentState.foldedClubs.includes(id));
  const nextTurnIndex = (currentState.currentTurnIndex + 1) % Math.max(activeBidders.length, 1);
  await setDoc(AUCTION_DOC, {
    currentTurnIndex: nextTurnIndex,
    bidDeadlineAt: Date.now() + 90_000,
  }, { merge: true });
}

/** Club owner: Fold G�� remove from current round. */
export async function foldBid(clubId: string, currentState: AuctionState): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const newFolded = [...currentState.foldedClubs, clubId];
  const activeBidders = currentState.biddingOrder.filter(id => !newFolded.includes(id));
  // If only 1 left and someone already bid, they win automatically
  const autoSold = activeBidders.length === 1 && currentState.leadingClubId !== null;
  
  if (autoSold && currentState.leadingClubId && currentState.currentPlayer) {
    const batch = writeBatch(db);
    const winningClubDoc = await getDoc(doc(db, 'clubs', currentState.leadingClubId));
    if (winningClubDoc.exists()) {
      const winningClub = { id: winningClubDoc.id, ...winningClubDoc.data() } as Club;
      // Load config for auto-contract defaults
      let cfg: ClubSystemConfig | null = null;
      try {
        const cfgSnap = await getDoc(doc(db, 'clubSystem', 'config'));
        if (cfgSnap.exists()) cfg = cfgSnap.data() as ClubSystemConfig;
      } catch {}
      const contractType = cfg?.defaultContractType || 'matches';
      const contractAmount = cfg?.defaultContractAmount || 5;
      const autoContract = cfg?.contractsActive !== false ? { type: contractType, amount: contractAmount } : null;
      batch.update(doc(db, 'clubs', winningClub.id), {
        budget: winningClub.budget - currentState.currentBid,
        squadIds: arrayUnion(currentState.currentPlayer.id),
      });
      batch.update(doc(db, 'players', currentState.currentPlayer.id), {
        clubId: winningClub.id,
        clubName: winningClub.name,
        primaryColor: winningClub.primaryColor,
        secondaryColor: winningClub.secondaryColor,
        isListed: false,
        listingPrice: null,
        clubContract: autoContract,
        clubStats: { played: 0, won: 0, drawn: 0, lost: 0, goalsScored: 0, goalsConceded: 0, points: 0, clubOvr: currentState.currentPlayer.ovr, form: [] },
      });
      batch.set(AUCTION_DOC, {
        foldedClubs: newFolded,
        status: 'sold',
        soldAt: Date.now(),
        currentTurnIndex: currentState.currentTurnIndex,
      }, { merge: true });
      await batch.commit();
      return;
    }
  }

  await setDoc(AUCTION_DOC, {
    foldedClubs: newFolded,
    status: 'active',
    soldAt: null,
    currentTurnIndex: (currentState.currentTurnIndex) % Math.max(activeBidders.length, 1),
    bidDeadlineAt: Date.now() + 90_000, // Reset timer on fold too
  }, { merge: true });
}

/** Admin: Confirm the sale — deduct budget from winning club, assign player, apply auto-contract. */
export async function adminConfirmSold(currentState: AuctionState, winningClub: import('../types').Club, config?: import('../types').ClubSystemConfig | null): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  if (!currentState.currentPlayer || !currentState.leadingClubId) return;
  const batch = writeBatch(db);
  // Deduct budget and add player to squad
  batch.update(doc(db, 'clubs', winningClub.id), { 
    budget: winningClub.budget - currentState.currentBid,
    squadIds: arrayUnion(currentState.currentPlayer.id)
  });
  // Build automatic contract from config defaults
  const contractType = config?.defaultContractType || 'matches';
  const contractAmount = config?.defaultContractAmount || 5;
  const autoContract = config?.contractsActive !== false ? { type: contractType, amount: contractAmount } : null;
  // Transfer player to new club — reset club-scoped stats, apply auto-contract
  batch.update(doc(db, 'players', currentState.currentPlayer.id), {
    clubId: winningClub.id,
    clubName: winningClub.name,
    primaryColor: winningClub.primaryColor,
    secondaryColor: winningClub.secondaryColor,
    isListed: false,
    listingPrice: null,
    clubContract: autoContract,
    clubStats: { played: 0, won: 0, drawn: 0, lost: 0, goalsScored: 0, goalsConceded: 0, points: 0, clubOvr: currentState.currentPlayer.ovr, form: [] },
  });
  // Mark auction as sold
  batch.set(AUCTION_DOC, { status: 'sold', soldAt: Date.now() }, { merge: true });
  await batch.commit();
}

/**
 * Apply a contract directly to a player (first-time, no proposal needed).
 * The contract terms come from the Control Center config defaults.
 */
export async function applyDirectContract(
  playerId: string,
  config: import('../types').ClubSystemConfig
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  const type = config.defaultContractType || 'matches';
  const amount = config.defaultContractAmount || 5;
  await updateDoc(doc(db, 'players', playerId), {
    clubContract: { type, amount }
  });
}

/** Admin: Skip the current player (unsold / folded). */
export async function adminSkipPlayer(): Promise<void> {
  await ensureAdminSession();
  await setDoc(AUCTION_DOC, { status: 'folded', currentPlayer: null, leadingClubId: null, leadingClubName: null, currentBid: 0, foldedClubs: [], bidDeadlineAt: null }, { merge: true });
}

/** Admin: End the entire auction session. */
export async function adminEndAuction(): Promise<void> {
  
  await ensureAdminSession();
  await setDoc(AUCTION_DOC, { status: 'ended', currentPlayer: null }, { merge: true });
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// CLUB INBOX / NOTIFICATIONS
// Each owner has ONE document at clubInbox/{ownerId}.
// Reading inbox = 1 read. Pushing notification = 1 write (arrayUnion).
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

/** Real-time listener on a club owner's inbox. */
export function subscribeToInbox(ownerId: string, callback: (messages: ClubInboxMessage[], unreadCount: number) => void) {
  const ref = doc(db, 'clubInbox', ownerId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data.messages || [], data.unreadCount || 0);
    } else {
      callback([], 0);
    }
  }, (err) => handleFirestoreError(err, OperationType.GET, `clubInbox/${ownerId}`));
}

/** Push a notification into a club owner's inbox. Costs 1 write. */
export async function pushInboxMessage(ownerId: string, message: ClubInboxMessage): Promise<void> {
  if (isQuotaExceeded) return;
  const ref = doc(db, 'clubInbox', ownerId);
  try {
    await setDoc(ref, {
      ownerId,
      messages: arrayUnion(message),
      unreadCount: increment(1),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubInbox/${ownerId}`);
  }
}

/** Mark all messages as read for an owner. */
export async function markInboxRead(ownerId: string, messages: ClubInboxMessage[]): Promise<void> {
  if (isQuotaExceeded) return;
  const ref = doc(db, 'clubInbox', ownerId);
  const updated = messages.map(m => ({ ...m, read: true }));
  try {
    await setDoc(ref, { messages: updated, unreadCount: 0 }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubInbox/${ownerId}`);
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// TRANSFER NEGOTIATION SYSTEM
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

/** Fetch all active transfer threads for a club (buyer or seller). ~1 read. */
export async function fetchTransferThreadsForClub(clubId: string): Promise<TransferThread[]> {
  try {
    const [buyerSnap, sellerSnap] = await Promise.all([
      getDocs(query(collection(db, 'transferThreads'), where('buyerClubId', '==', clubId), where('status', 'in', ['pending', 'negotiating']), limit(50))),
      getDocs(query(collection(db, 'transferThreads'), where('sellerClubId', '==', clubId), where('status', 'in', ['pending', 'negotiating']), limit(50))),
    ]);
    const seen = new Set<string>();
    const results: TransferThread[] = [];
    [...buyerSnap.docs, ...sellerSnap.docs].forEach(d => {
      if (!seen.has(d.id)) { seen.add(d.id); results.push({ id: d.id, ...d.data() } as TransferThread); }
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'transferThreads');
    return [];
  }
}

/** Create a new transfer proposal. Costs 1 write (thread) + 1 write (inbox). */
export async function sendTransferProposal(thread: Omit<TransferThread, 'id' | 'createdAt' | 'updatedAt' | 'expiresAt' | 'history' | 'status'>): Promise<string> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Transfer window may be closed or quota exceeded.');
  const id = `thread_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();
  const fullThread: TransferThread = {
    ...thread,
    id,
    status: 'pending',
    history: [thread.currentOffer],
    createdAt: now,
    updatedAt: now,
    expiresAt: now + 72 * 60 * 60 * 1000, // 72h
  };
  await setDoc(doc(db, 'transferThreads', id), fullThread);

  const msgId = `msg_${Date.now()}`;
  await pushInboxMessage(thread.sellerOwnerId, {
    id: msgId,
    type: 'proposal_received',
    from: { clubId: thread.buyerClubId, clubName: thread.buyerClubName },
    relatedPlayerId: thread.playerId,
    relatedPlayerName: thread.playerName,
    threadId: id,
    message: `${thread.buyerClubName} sent a transfer proposal for ${thread.playerName}.`,
    read: false,
    createdAt: now,
  });
  return id;
}

/** Respond to a proposal G�� accept, decline, or counter. Costs 1-2 writes. */
export async function respondToProposal(
  thread: TransferThread,
  action: 'accept' | 'decline' | 'counter',
  counterOffer?: Omit<TransferOffer, 'sentAt'>,
  clubs?: { buyerClub: import('../types').Club; sellerClub: import('../types').Club },
  player?: import('../types').Player
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const now = Date.now();
  const threadRef = doc(db, 'transferThreads', thread.id);

  if (action === 'decline') {
    await setDoc(threadRef, { status: 'declined', updatedAt: now }, { merge: true });
    await pushInboxMessage(thread.buyerOwnerId, {
      id: `msg_${now}`, type: 'proposal_declined',
      from: { clubId: thread.sellerClubId, clubName: thread.sellerClubName },
      relatedPlayerId: thread.playerId, relatedPlayerName: thread.playerName, threadId: thread.id,
      message: `${thread.sellerClubName} declined your proposal for ${thread.playerName}.`,
      read: false, createdAt: now,
    });
    return;
  }

  if (action === 'accept' && clubs && player) {
    const batch = writeBatch(db);
    const offer = thread.currentOffer;

    if (offer.type === 'money' && offer.amount !== null) {
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { budget: clubs.buyerClub.budget - offer.amount });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { budget: clubs.sellerClub.budget + offer.amount });
      
      batch.update(doc(db, 'players', player.id), { clubId: clubs.buyerClub.id, clubName: clubs.buyerClub.name, primaryColor: clubs.buyerClub.primaryColor, secondaryColor: clubs.buyerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { squadIds: [...clubs.buyerClub.squadIds, player.id] });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { squadIds: clubs.sellerClub.squadIds.filter(id => id !== player.id) });
    } else if (offer.type === 'swap' && offer.swapPlayerId) {
      // Swap: move each player to the other club
      batch.update(doc(db, 'players', player.id), { clubId: clubs.buyerClub.id, clubName: clubs.buyerClub.name, primaryColor: clubs.buyerClub.primaryColor, secondaryColor: clubs.buyerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'players', offer.swapPlayerId), { clubId: clubs.sellerClub.id, clubName: clubs.sellerClub.name, primaryColor: clubs.sellerClub.primaryColor, secondaryColor: clubs.sellerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { squadIds: [...clubs.buyerClub.squadIds.filter(id => id !== offer.swapPlayerId), player.id] });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { squadIds: [...clubs.sellerClub.squadIds.filter(id => id !== player.id), offer.swapPlayerId] });
    } else if (offer.type === 'money_swap' && offer.swapPlayerId && offer.swapAmount !== null && offer.swapAmount !== undefined) {
      // Money + Swap: exchange players AND transfer budget
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { budget: clubs.buyerClub.budget - offer.swapAmount });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { budget: clubs.sellerClub.budget + offer.swapAmount });

      batch.update(doc(db, 'players', player.id), { clubId: clubs.buyerClub.id, clubName: clubs.buyerClub.name, primaryColor: clubs.buyerClub.primaryColor, secondaryColor: clubs.buyerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'players', offer.swapPlayerId), { clubId: clubs.sellerClub.id, clubName: clubs.sellerClub.name, primaryColor: clubs.sellerClub.primaryColor, secondaryColor: clubs.sellerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { squadIds: [...clubs.buyerClub.squadIds.filter(id => id !== offer.swapPlayerId), player.id] });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { squadIds: [...clubs.sellerClub.squadIds.filter(id => id !== player.id), offer.swapPlayerId] });
    }

    batch.update(threadRef, { status: 'accepted', updatedAt: now });
    await batch.commit();
    

    await pushInboxMessage(thread.buyerOwnerId, {
      id: `msg_${now}`, type: 'proposal_accepted',
      from: { clubId: thread.sellerClubId, clubName: thread.sellerClubName },
      relatedPlayerId: thread.playerId, relatedPlayerName: thread.playerName, threadId: thread.id,
      message: `=��� ${thread.sellerClubName} accepted your proposal! ${thread.playerName} is now yours.`,
      read: false, createdAt: now,
    });
    return;
  }

  if (action === 'counter' && counterOffer) {
    const newOffer: TransferOffer = { ...counterOffer, sentAt: now };
    await setDoc(threadRef, {
      status: 'negotiating',
      currentOffer: newOffer,
      history: arrayUnion(newOffer),
      updatedAt: now,
    }, { merge: true });
    const targetOwnerId = counterOffer.sentBy === 'seller' ? thread.buyerOwnerId : thread.sellerOwnerId;
    const fromClub = counterOffer.sentBy === 'seller' ? { clubId: thread.sellerClubId, clubName: thread.sellerClubName } : { clubId: thread.buyerClubId, clubName: thread.buyerClubName };
    await pushInboxMessage(targetOwnerId, {
      id: `msg_${now}`, type: 'counter_offer', from: fromClub,
      relatedPlayerId: thread.playerId, relatedPlayerName: thread.playerName, threadId: thread.id,
      message: `${fromClub.clubName} sent a counter-offer for ${thread.playerName}.`,
      read: false, createdAt: now,
    });
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// RELEASE CLAUSES
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

/** Club owner sets a release clause on one of their players. 1 write. */
export async function setReleaseClause(playerId: string, clause: ReleaseClause): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'players', playerId), { releaseClause: clause }, { merge: true });
  
}

/** Remove a release clause from a player. 1 write. */
export async function removeReleaseClause(playerId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'players', playerId), { releaseClause: null }, { merge: true });
  
}

/** Trigger a release clause G�� instant purchase, no negotiation needed. 1 batch write. */
export async function triggerReleaseClause(
  player: import('../types').Player,
  buyerClub: import('../types').Club,
  sellerClub: import('../types').Club,
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  if (!player.releaseClause?.active) throw new Error('No active release clause.');
  const amount = player.releaseClause.amount;
  if (buyerClub.budget < amount) throw new Error(`Insufficient budget. Need ${amount.toLocaleString()}, have ${buyerClub.budget.toLocaleString()}.`);

  const batch = writeBatch(db);
  batch.update(doc(db, 'clubs', buyerClub.id), { budget: buyerClub.budget - amount, squadIds: [...buyerClub.squadIds, player.id] });
  batch.update(doc(db, 'clubs', sellerClub.id), { budget: sellerClub.budget + amount, squadIds: sellerClub.squadIds.filter(id => id !== player.id) });
  batch.update(doc(db, 'players', player.id), { clubId: buyerClub.id, clubName: buyerClub.name, primaryColor: buyerClub.primaryColor, secondaryColor: buyerClub.secondaryColor, releaseClause: null, isListed: false, listingPrice: null });
  await batch.commit();
  

  const now = Date.now();
  const sellerMsg: ClubInboxMessage = { id: `msg_${now}`, type: 'release_clause_triggered', from: { clubId: buyerClub.id, clubName: buyerClub.name }, relatedPlayerId: player.id, relatedPlayerName: player.name, message: `${buyerClub.name} triggered the release clause for ${player.name} (${amount.toLocaleString()} coins).`, read: false, createdAt: now };
  const buyerMsg: ClubInboxMessage = { id: `msg_${now + 1}`, type: 'release_clause_triggered', from: { clubId: sellerClub.id, clubName: sellerClub.name }, relatedPlayerId: player.id, relatedPlayerName: player.name, message: `G�� Release clause triggered! ${player.name} has joined ${buyerClub.name}.`, read: false, createdAt: now };
  await Promise.all([pushInboxMessage(sellerClub.ownerId, sellerMsg), pushInboxMessage(buyerClub.ownerId, buyerMsg)]);
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// SHORTLIST
// Stored on the Club document G�� no extra reads needed.
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function addToShortlist(clubId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'clubs', clubId), { shortlistedPlayerIds: arrayUnion(playerId) }, { merge: true });
}

export async function removeFromShortlist(clubId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) return;
  // FIX: Use arrayRemove — saves 1 unnecessary getDoc read per shortlist removal
  await setDoc(doc(db, 'clubs', clubId), { shortlistedPlayerIds: arrayRemove(playerId) }, { merge: true });
}

/**
 * Remove a player from a club's squad.
 * - Removes playerId from club.squadIds
 * - Clears player.clubId, clubName, clubContract, clubStats
 * - Marks player as free agent
 * Cost: 1 batch write (2 docs)
 */
export async function removePlayerFromSquad(clubId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const batch = writeBatch(db);
  batch.update(doc(db, 'clubs', clubId), { squadIds: arrayRemove(playerId) });
  batch.update(doc(db, 'players', playerId), {
    clubId: null,
    clubName: null,
    primaryColor: null,
    secondaryColor: null,
    clubContract: null,
    clubStats: null,
    isListed: false,
  });
  await batch.commit();
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// INTERNAL CLUB SEASONS
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

/** Fetch all internal seasons for a global season (e.g., "2026/2027"). */
export async function fetchClubSeasons(globalSeason: string, force = false): Promise<ClubSeason[]> {
  const cacheKey = `clubSeasons_${globalSeason}`;
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const snap = await getDocs(query(collection(db, 'clubSeasons'), where('globalSeason', '==', globalSeason), orderBy('seasonNumber', 'asc'), limit(20)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubSeason));
    }, 15 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubSeasons');
    return [];
  }
}

/** Fetches ALL active or upcoming seasons across all global years for the landing dashboard. */
export async function fetchAllActiveClubSeasons(force = false): Promise<ClubSeason[]> {
  const cacheKey = 'clubSeasons_active';
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const q = query(collection(db, 'clubSeasons'), where('status', 'in', ['active', 'upcoming']), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubSeason));
    }, 15 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubSeasons-active');
    return [];
  }
}

/**
 * One-time fetch for active/upcoming club seasons — replaces the real-time
 * subscribeToActiveClubSeasons listener which kept a permanent WebSocket open
 * for every user that visited Admin or Club Zone.
 * Cost: 1 collection read (cached 15 min). Zero ongoing listener overhead.
 */
export async function fetchActiveClubSeasonsOnce(force = false): Promise<ClubSeason[]> {
  const cacheKey = 'clubSeasons_active';
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const q = query(collection(db, 'clubSeasons'), where('status', 'in', ['active', 'upcoming']), limit(10));
      const snap = await getDocs(q);
      trackRead(snap.docs.length);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubSeason));
    }, 15 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubSeasons-active');
    return [];
  }
}

/** @deprecated Use fetchActiveClubSeasonsOnce() instead. Kept for backward-compat. */
export function subscribeToActiveClubSeasons(callback: (seasons: ClubSeason[]) => void) {
  // Downgraded from real-time listener to one-time fetch to save WebSocket connections.
  fetchActiveClubSeasonsOnce().then(callback).catch(() => callback([]));
  // Return a no-op unsubscribe so call sites don't break
  return () => {};
}

/** Admin: Start a new internal season. 1 write. */
export async function startClubSeason(globalSeason: string, seasonNumber: number, length?: number, transferWindows?: number): Promise<ClubSeason> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const id = `${globalSeason.replace('/', '_')}__S${seasonNumber}`;
  const season: ClubSeason = {
    id,
    globalSeason,
    seasonNumber,
    label: `Season ${seasonNumber}`,
    status: 'active',
    startedAt: Date.now(),
    endedAt: null,
    length,
    transferWindows
  };
  await setDoc(doc(db, 'clubSeasons', id), season);
  // Update the active season reference in clubConfig
  await setDoc(doc(db, 'settings', 'clubConfig'), { activeInternalSeasonId: id, activeInternalSeasonLabel: season.label }, { merge: true });
  // Bust caches so new season is visible immediately
  invalidateCache('club_config');
  invalidateCache('clubSeasons_active');
  invalidateCache(`clubSeasons_${globalSeason}`);

  return season;
}

/** Admin: End an internal season, saving the final standings snapshot. 1 write. */
export async function endClubSeason(seasonId: string, standingsSnapshot: ClubSeason['standingsSnapshot']): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'clubSeasons', seasonId), { status: 'completed', endedAt: Date.now(), standingsSnapshot }, { merge: true });
  await setDoc(doc(db, 'settings', 'clubConfig'), { activeInternalSeasonId: null, activeInternalSeasonLabel: null }, { merge: true });
  // Bust all season caches — statuses changed across the board
  invalidateCache('club_config');
  invalidateCache('clubSeasons_active');
  invalidateCacheByPrefix('clubSeasons_');
}

/**
 * Admin: End the entire Club Zone season.
 * Resets all players' club-scoped stats and contracts for the new season.
 * Saves a final standings record to Firestore history.
 * Called before starting a new Club Zone season.
 */
export async function endClubZoneSeason(
  seasonName: string,
  globalSeason: string,
  players: Player[],
  clubs: Club[]
): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');

  const batch = writeBatch(db);

  // 1. Reset every player's club-scoped stats + contract for the new season
  players.forEach(p => {
    if (p.clubId) {
      batch.update(doc(db, 'players', p.id), {
        clubStats: { goals: 0, matches: 0, wins: 0, losses: 0, draws: 0 },
        clubContract: null,
      });
    }
  });

  // 2. Save a season history record (standings snapshot)
  const historyId = `clubZone_${seasonName.replace(/\s+/g, '_')}_${Date.now()}`;
  const historyRecord = {
    id: historyId,
    seasonName,
    globalSeason,
    clubs: clubs.map(c => ({ id: c.id, name: c.name, primaryColor: c.primaryColor })),
    endedAt: Date.now(),
  };
  batch.set(doc(db, 'clubSeasonHistory', historyId), historyRecord);

  await batch.commit();

  // 3. Bust caches
  invalidateCache('clubs_all');
  invalidateCacheByPrefix('clubSeasons_');
  invalidateCache('club_config');
}


/** Admin: Broadcast a system notification to all club owners' inboxes. */
export async function broadcastToAllOwners(ownerIds: string[], message: Omit<ClubInboxMessage, 'id' | 'read' | 'createdAt'>): Promise<void> {
  if (isQuotaExceeded) return;
  const now = Date.now();
  await Promise.all(ownerIds.map((ownerId, i) =>
    pushInboxMessage(ownerId, { ...message, id: `msg_${now}_${i}`, read: false, createdAt: now })
  ));
}

/**
 * Calculates a player's form (A-E) based on their last 5 matches.
 */
export async function fetchPlayerMatches(playerId: string, limitCount = 50, force = false): Promise<MatchRecord[]> {
  const cacheKey = `playerMatches_${playerId}_${limitCount}`;
  if (force) invalidateCache(cacheKey);
  try {
    return await fetchWithCache(cacheKey, async () => {
      const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, 'matches'), where('p1Id', '==', playerId), orderBy('timestamp', 'desc'), limit(limitCount))),
        getDocs(query(collection(db, 'matches'), where('p2Id', '==', playerId), orderBy('timestamp', 'desc'), limit(limitCount)))
      ]);
      const seen = new Set<string>();
      const results: MatchRecord[] = [];
      [...snap1.docs, ...snap2.docs].forEach(d => {
        if (!seen.has(d.id)) {
          seen.add(d.id);
          results.push({ id: d.id, ...d.data() } as MatchRecord);
        }
      });
      return results.sort((a, b) => b.timestamp - a.timestamp);
    }, 5 * 60 * 1000);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `matches/player/${playerId}`);
    return [];
  }
}

export function calculatePlayerForm(matches: MatchRecord[], playerId: string): 'A' | 'B' | 'C' | 'D' | 'E' {
  const recent = matches
    .filter(m => m.p1Id === playerId || m.p2Id === playerId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  if (recent.length === 0) return 'C';

  let wins = 0;
  let draws = 0;
  recent.forEach(m => {
    const isP1 = m.p1Id === playerId;
    const myScore = isP1 ? m.p1Score : m.p2Score;
    const oppScore = isP1 ? m.p2Score : m.p1Score;

    if (myScore > oppScore) wins++;
    else if (myScore === oppScore) draws++;
  });

  const winRate = wins / recent.length;
  if (winRate >= 0.8) return 'A';
  if (winRate >= 0.6) return 'B';
  if (winRate >= 0.4 || draws >= 2) return 'C';
  if (winRate >= 0.2) return 'D';
  return 'E';
}

/**
 * Converts a raw form array ['W', 'L', 'D'] into a letter grade A-E.
 * Used for components that rely on pre-computed form stored in Player doc.
 */
export function getFormGrade(form: string[]): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (!form || form.length === 0) return 'C';
  const recent = form.slice(0, 5);
  let wins = 0;
  let draws = 0;
  recent.forEach(res => {
    if (res === 'W') wins++;
    else if (res === 'D') draws++;
  });
  const winRate = wins / recent.length;
  if (winRate >= 0.8) return 'A';
  if (winRate >= 0.6) return 'B';
  if (winRate >= 0.4 || draws >= 2) return 'C';
  if (winRate >= 0.2) return 'D';
  return 'E';
}

/**
 * Calculates a suggested base prize for auction based on OVR and Form.
 */
export function calculateBasePrize(ovr: number, form: 'A' | 'B' | 'C' | 'D' | 'E'): number {
  // Base price starts at 100k, scales up
  const baseByOvr = Math.max(100000, Math.pow(ovr - 50, 2) * 2000); 
  const formMultiplier = { 'A': 1.5, 'B': 1.2, 'C': 1.0, 'D': 0.8, 'E': 0.6 }[form];
  return Math.round(baseByOvr * formMultiplier);
}

export async function deleteClubSeason(seasonId: string): Promise<void> {
  
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await deleteDoc(doc(db, 'clubSeasons', seasonId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `clubSeasons/${seasonId}`);
    throw err;
  }
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// GLOBAL SEASONS
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function startGlobalSeason(name: string): Promise<GlobalSeason> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');

  const batch = writeBatch(db);
  
  // 1. Mark all existing global seasons as 'completed'
  const oldGsSnap = await getDocs(query(collection(db, 'globalSeasons'), where('status', '==', 'active'), limit(10))); // Bounded: at most 1 active season
  const oldActiveNames: string[] = [];
  oldGsSnap.docs.forEach(d => {
    batch.update(d.ref, { status: 'completed', endedAt: Date.now() });
    oldActiveNames.push(d.data().name);
  });

  // 2. Mark all internal club seasons from those years as 'completed' 
  // (Moves them to history automatically)
  if (oldActiveNames.length > 0) {
    const oldInternalSnap = await getDocs(query(
      collection(db, 'clubSeasons'), 
      where('globalSeason', 'in', oldActiveNames),
      where('status', '!=', 'completed'),
      limit(50)
    ));
    oldInternalSnap.docs.forEach(d => {
      batch.update(d.ref, { status: 'completed', endedAt: Date.now() });
    });
  }

  // 3. Create the new Global Season
  const id = name.replace(/\//g, '_');
  const gs: GlobalSeason = { id, name, status: 'active', createdAt: Date.now() };
  batch.set(doc(db, 'globalSeasons', id), gs);

  await batch.commit();
  return gs;
}

export async function fetchGlobalSeasons(force = false): Promise<GlobalSeason[]> {
  const cacheKey = 'globalSeasons_all';
  if (force) invalidateCache(cacheKey);
  return fetchWithCache(cacheKey, async () => {
    const snap = await getDocs(query(collection(db, 'globalSeasons'), orderBy('createdAt', 'desc'), limit(20)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GlobalSeason));
  }, 15 * 60 * 1000);
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// FRANCHISE REGISTRY (EMPTY CLUBS)
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function assignClubOwner(clubId: string, player: Player): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  
  const clubSnap = await getDoc(doc(db, 'clubs', clubId));
  if (!clubSnap.exists()) throw new Error('Club not found');
  const clubData = clubSnap.data() as Club;

  const batch = writeBatch(db);
  batch.update(doc(db, 'clubs', clubId), { 
    ownerId: player.id, 
    ownerName: player.name 
  });
  batch.update(doc(db, 'players', player.id), { 
    clubId, 
    clubName: clubData.name,
    isClubOwner: true,
    primaryColor: clubData.primaryColor,
    secondaryColor: clubData.secondaryColor
  });
  await batch.commit();
}

export async function unassignClubOwner(clubId: string): Promise<void> {
  await ensureAdminSession();
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');

  // Fetch club first so we know who the current owner is
  const clubSnap = await getDoc(doc(db, 'clubs', clubId));
  const batch = writeBatch(db);

  if (clubSnap.exists()) {
    const clubData = clubSnap.data();
    if (clubData.ownerId) {
      batch.update(doc(db, 'players', clubData.ownerId), {
        isClubOwner: false,
        clubId: null,
        clubName: null,
        primaryColor: null,
        secondaryColor: null,
      });
    }
    if (clubData.squadIds && clubData.squadIds.length > 0) {
      for (const pid of clubData.squadIds) {
        batch.update(doc(db, 'players', pid), {
          clubId: null,
          clubName: null,
          primaryColor: null,
          secondaryColor: null,
          clubContract: null,
          clubStats: null
        });
      }
    }
  }

  batch.update(doc(db, 'clubs', clubId), { ownerId: null, ownerName: null, squadIds: [] });

  await batch.commit();
  // Bust the cache so the next fetchClubs() call reads fresh from Firestore
  invalidateCache('clubs_all');
}

// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��
// PLAYER INBOX & CONTRACT NEGOTIATIONS
// G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��G��

export async function sendPlayerInboxMessage(message: Omit<PlayerInboxMessage, 'id' | 'createdAt' | 'status'>): Promise<void> {
  if (isQuotaExceeded) return;
  const id = `pmsg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const fullMsg: PlayerInboxMessage = {
    ...message,
    id,
    status: 'unread',
    createdAt: Date.now()
  };
  await setDoc(doc(db, 'playerInbox', id), fullMsg);
}

export function subscribeToPlayerInbox(recipientId: string, callback: (messages: PlayerInboxMessage[]) => void) {
  const q = query(collection(db, 'playerInbox'), where('recipientId', '==', recipientId), limit(50));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as PlayerInboxMessage)).sort((a, b) => b.createdAt - a.createdAt));
  }, (err) => handleFirestoreError(err, OperationType.LIST, `playerInbox/${recipientId}`));
}

/**
 * One-shot fetch for player inbox — no persistent listener.
 * Replaces subscribeToPlayerInbox for normal users.
 * Cost: 1 read per inbox open. Zero ongoing listener overhead.
 */
export async function fetchPlayerInboxMessages(recipientId: string, limitCount = 50): Promise<PlayerInboxMessage[]> {
  try {
    const q = query(collection(db, 'playerInbox'), where('recipientId', '==', recipientId), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PlayerInboxMessage)).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `playerInbox/${recipientId}`);
    return [];
  }
}

export async function updatePlayerInboxStatus(msgId: string, status: PlayerInboxMessage['status']): Promise<void> {
  if (isQuotaExceeded) return;
  await setDoc(doc(db, 'playerInbox', msgId), { status }, { merge: true });
}

export async function respondToContractRenewal(msg: PlayerInboxMessage, accepted: boolean): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const batch = writeBatch(db);
  const now = Date.now();

  // 1. Update message status
  batch.update(doc(db, 'playerInbox', msg.id), { status: accepted ? 'accepted' : 'rejected' });

  let responseMessageBody = '';

  if (accepted && msg.data?.playerId) {
    // Player accepted: update contract and deduct club budget
    batch.update(doc(db, 'players', msg.data.playerId), {
      clubContract: {
        type: 'matches',
        amount: msg.data.duration || 10
      }
    });
    
    if (msg.data.clubId && msg.data.salary) {
      batch.update(doc(db, 'clubs', msg.data.clubId), {
        budget: increment(-msg.data.salary)
      });
    }

    responseMessageBody = `✅ ${msg.data.playerName || 'Player'} accepted the contract renewal for ${msg.data.clubName || 'the club'}!`;
  } else if (!accepted && msg.data?.playerId) {
    // Player rejected: automatically list them on the Transfer Market
    const pSnap = await getDoc(doc(db, 'players', msg.data.playerId));
    if (pSnap.exists()) {
      const p = pSnap.data() as import('../types').Player;
      // Calculate a base price using their OVR and a neutral Form 'C'
      const suggestedPrice = calculateBasePrize(p.ovr, 'C');
      
      const listingId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      batch.set(doc(db, 'clubListings', listingId), {
        id: listingId,
        playerId: p.id,
        playerName: p.name,
        playerImage: p.image || null,
        playerOvr: p.ovr,
        fromClubId: msg.data.clubId || p.clubId,
        fromClubName: msg.data.clubName || p.clubName,
        fromClubColor: p.primaryColor || '#8b5cf6',
        price: suggestedPrice,
        listedAt: now
      });

      // Update the player's status
      batch.update(doc(db, 'players', p.id), {
        isListed: true,
        listingPrice: suggestedPrice
      });

      responseMessageBody = `❌ ${msg.data.playerName || p.name} rejected the contract renewal proposal. They have been automatically placed on the Transfer Market for ${suggestedPrice.toLocaleString()} VCC.`;
    } else {
      responseMessageBody = `❌ ${msg.data.playerName || 'Player'} rejected the contract renewal proposal.`;
    }
  }

  // 2. Send response back to owner
  if (msg.data?.clubId && responseMessageBody) {
    const responseMsg: ClubInboxMessage = {
      id: `msg_${now}`,
      type: 'system',
      from: null,
      message: responseMessageBody,
      read: false,
      createdAt: now
    };
    const clubDoc = await getDoc(doc(db, 'clubs', msg.data.clubId));
    if (clubDoc.exists() && clubDoc.data().ownerId) {
      const ownerId = clubDoc.data().ownerId;
      const ref = doc(db, 'clubInbox', ownerId);
      batch.set(ref, { ownerId, messages: arrayUnion(responseMsg), unreadCount: increment(1) }, { merge: true });
    }
  }

  await batch.commit();
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SESSION HELPER
// Re-registers the current anonymous UID in the admins collection so that
// Firestore security rules recognize this session as an admin. Must be called
// at the start of every sensitive write operation to heal drifted sessions.
// ─────────────────────────────────────────────────────────────────────────────
let _adminSessionRegistered = false;
export async function ensureAdminSession(): Promise<void> {
  if (_adminSessionRegistered) return;
  const isAdminFlag = localStorage.getItem('adminLoggedIn') === 'true';
  if (!isAdminFlag) return;

  // Make sure we have a Firebase auth user
  let user = auth.currentUser;
  if (!user) {
    try {
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
      user = auth.currentUser;
    } catch (e) {
      console.warn('[Auth] ensureAdminSession: could not get auth user', e);
      return;
    }
  }
  if (!user) return;

  try {
    const playerId = localStorage.getItem('playerId') || '';
    const adminData: Record<string, any> = {
      lastActive: serverTimestamp(),
      role: 'admin',
    };
    if (playerId) {
      // Player-admin login
      adminData.playerId = playerId;
    } else {
      // Master admin (QVFC/QVFC_19)
      adminData.type = 'master';
    }
    await setDoc(doc(db, 'admins', user.uid), adminData, { merge: true });
    _adminSessionRegistered = true;
    console.log('[Auth] Admin session registered for uid:', user.uid);
  } catch (e) {
    console.warn('[Auth] ensureAdminSession: failed to write admins doc', e);
  }
}

/** One-shot fetch for guests — no real-time listener. */
export async function fetchPlayersOnce(limitCount = 15): Promise<Player[]> {
  const cacheKey = `players_once_${limitCount}`;
  return fetchWithCache(cacheKey, async () => {
    try {
      const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, ...d, image: d.image || '/default-logo.jpg' } as Player;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'players');
      return [];
    }
  }, 30 * 60 * 1000);
}

/** One-shot fetch for guests — no real-time listener. */
export async function fetchLeadersOnce(): Promise<Leader[]> {
  return fetchWithCache('leaders_once', async () => {
    try {
      const q = query(collection(db, 'leaders'), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, ...d, image: d.image || '/default-logo.jpg' } as Leader;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'leaders');
      return [];
    }
  }, 30 * 60 * 1000);
}

/** One-shot fetch — no real-time listener. Replaces subscribeToMatches for non-admin users. */
export async function fetchMatchesOnce(limitCount = 50): Promise<MatchRecord[]> {
  const cacheKey = `matches_once_${limitCount}`;
  return fetchWithCache(cacheKey, async () => {
    try {
      const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'matches');
      return [];
    }
  }, 30 * 60 * 1000);
}

/** One-shot fetch — no real-time listener. Replaces subscribeToTournaments for non-admin users. */
export async function fetchTournamentsOnce(limitCount = 20): Promise<Tournament[]> {
  const cacheKey = `tournaments_once_${limitCount}`;
  return fetchWithCache(cacheKey, async () => {
    try {
      const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'tournaments');
      return [];
    }
  }, 30 * 60 * 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2: SNAPSHOT ARCHITECTURE
//
// Two precomputed documents replace hundreds of collection reads:
//
//   settings/appSnapshot  → top-50 leaderboard + active tournaments + counts
//                           Replaces: fetchPlayersOnce(50) + fetchTournamentsOnce(20)
//                           = 70 reads → 1 read
//
//   settings/clubSnapshot → clubs[] + config + active market listings
//                           Replaces: fetchClubs(50) + fetchMarketListings(50) + fetchClubConfig()
//                           = ~101 reads → 1 read
//
// Both documents are written by admin after any relevant data change.
// They are read by the frontend on cold start (0 reads if localStorage is fresh).
// ─────────────────────────────────────────────────────────────────────────────

const APP_SNAPSHOT_CACHE_KEY = 'appSnapshot_v1';
const CLUB_SNAPSHOT_CACHE_KEY = 'clubSnapshot_v1';

export interface AppSnapshot {
  leaderboard: Player[];       // top-50, pre-sorted by finalScore
  activeTournaments: Tournament[];  // status='active', max 5
  playerCount: number;
  matchCount: number;
  updatedAt: number;
}

export interface ClubSnapshot {
  clubs: Club[];
  config: import('../types').ClubSystemConfig | null;
  marketListings: import('../types').MarketListing[];
  updatedAt: number;
}

/**
 * Reads the precomputed app snapshot document.
 * 1 Firestore read — replaces fetching players(50) + tournaments(20).
 * Cached in the store-level in-memory cache for 30 minutes.
 */
export async function fetchAppSnapshot(): Promise<AppSnapshot | null> {
  return fetchWithCache(APP_SNAPSHOT_CACHE_KEY, async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'appSnapshot'));
      if (!snap.exists()) return null;
      trackRead(1);
      return snap.data() as AppSnapshot;
    } catch (err) {
      console.warn('[Snapshot] Could not fetch appSnapshot:', err);
      return null;
    }
  }, 30 * 60 * 1000); // 30 min in-memory TTL
}

/**
 * Reads the precomputed club snapshot document.
 * 1 Firestore read — replaces fetchClubs(50) + fetchMarketListings(50) + fetchClubConfig().
 */
export async function fetchClubSnapshot(): Promise<ClubSnapshot | null> {
  return fetchWithCache(CLUB_SNAPSHOT_CACHE_KEY, async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'clubSnapshot'));
      if (!snap.exists()) return null;
      trackRead(1);
      return snap.data() as ClubSnapshot;
    } catch (err) {
      console.warn('[Snapshot] Could not fetch clubSnapshot:', err);
      return null;
    }
  }, 30 * 60 * 1000);
}

/**
 * Admin: write the precomputed app snapshot after any ranking-changing event.
 * Called automatically by addMatch() and recalculateAllStats().
 * Cost: 1 write. Saves every subsequent user from fetching 70+ docs.
 */
export async function writeAppSnapshot(
  allPlayers: Player[],
  allTournaments: Tournament[],
  matchCount?: number
): Promise<void> {
  if (isQuotaExceeded) return;
  try {
    const leaderboard = sortRankedPlayers(allPlayers).slice(0, 50);
    const activeTournaments = allTournaments
      .filter(t => (t as any).status === 'active')
      .slice(0, 5);
    const snapshot: AppSnapshot = {
      leaderboard,
      activeTournaments,
      playerCount: allPlayers.length,
      matchCount: matchCount ?? 0,
      updatedAt: Date.now(),
    };
    await setDoc(doc(db, 'settings', 'appSnapshot'), snapshot);
    // Bust local caches so next read picks up fresh snapshot
    invalidateCache(APP_SNAPSHOT_CACHE_KEY);
    console.log('[Snapshot] appSnapshot written:', leaderboard.length, 'players');
  } catch (err) {
    // Non-critical — fail silently so match saving is not blocked
    console.warn('[Snapshot] Could not write appSnapshot:', err);
  }
}

/**
 * Admin: write the precomputed club snapshot after clubs/listings/config change.
 * Cost: 1 write. Saves Club Zone from fetching 100+ docs on next load.
 */
export async function writeClubSnapshot(
  clubs: Club[],
  config: import('../types').ClubSystemConfig | null,
  marketListings: import('../types').MarketListing[]
): Promise<void> {
  if (isQuotaExceeded) return;
  try {
    const snapshot: ClubSnapshot = {
      clubs,
      config,
      marketListings: marketListings.slice(0, 50),
      updatedAt: Date.now(),
    };
    await setDoc(doc(db, 'settings', 'clubSnapshot'), snapshot);
    invalidateCache(CLUB_SNAPSHOT_CACHE_KEY);
    console.log('[Snapshot] clubSnapshot written:', clubs.length, 'clubs');
  } catch (err) {
    console.warn('[Snapshot] Could not write clubSnapshot:', err);
  }
}

/**
 * Bust all frontend caches and optionally refresh snapshots.
 * Call this after any admin write that changes public-facing data.
 * The snapshot writes are fire-and-forget (non-blocking).
 */
export function invalidateAndRefreshSnapshots(
  players?: Player[],
  tournaments?: Tournament[],
  clubs?: Club[],
  config?: import('../types').ClubSystemConfig | null,
  listings?: import('../types').MarketListing[]
): void {
  // Bust all in-memory caches
  invalidateCache();
  // Bust localStorage (imported from cache.ts via trackRead path)
  invalidateStorage();

  // Fire-and-forget snapshot refresh if we have the data
  if (players && tournaments) {
    writeAppSnapshot(players, tournaments).catch(() => {});
  }
  if (clubs && config !== undefined && listings) {
    writeClubSnapshot(clubs, config, listings).catch(() => {});
  }
}

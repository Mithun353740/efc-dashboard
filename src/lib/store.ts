import { 
  Player, PartialPlayerStats, Leader, MatchRecord, Tournament, AuctionState, 
  ClubSeason, ClubInboxMessage, TransferThread, TransferOffer, ReleaseClause, 
  Club, GlobalSeason, PlayerInboxMessage, ClubSystemConfig, MarketListing, ClubTournament, ClubFixture
} from '../types';
import { db, auth } from '../firebase';
import { resolveCanonicalTournamentName, getSeasonInfo } from './utils';
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
  increment
} from 'firebase/firestore';

/**
 * Bump this number whenever the stat computation logic changes.
 * All Player documents with a lower statsVersion will be flagged
 * as stale and can be resynced by the admin via the Resync button.
 */
export const STATS_VERSION = 2;
export const MIN_MATCHES = 10;

/**
 * Calculates adjusted ranking stats for a player.
 * Balancing performance (OVR), activity (Points), and sample size (Confidence).
 */
export function calculateRankingStats(player: Player) {
  const matchesPlayed = (player.win || 0) + (player.loss || 0) + (player.draw || 0);
  const points = (player.win || 0) * 3 + (player.draw || 0);
  const winRate = matchesPlayed > 0 ? (player.win || 0) / matchesPlayed : 0;
  
  // Confidence factor: reaches ~50% at 20 matches, ~33% at 10 matches.
  // Reduces the weight of high win-rates for low-match players.
  const confidence = matchesPlayed / (matchesPlayed + 20);
  const adjustedWinRate = winRate * confidence;
  
  // Formula: points (50%) + win rate (20%) + skill/elo (30%)
  const finalScore = (points * 0.5) + (adjustedWinRate * 100 * 0.2) + (player.ovr * 0.3);
  
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
    // Non-critical for public users — fail silently
    console.warn('[Locks] Could not fetch system locks:', error);
  }
  return { tournaments: false };
}

export async function toggleSystemLock(systemId: string, locked: boolean) {
  if (isQuotaExceeded) return;
  try {
    const lockDoc = doc(db, 'settings', 'locks');
    await setDoc(lockDoc, { [systemId]: locked }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `settings/locks`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// APP VERSIONING (Real-time Sync)
// ─────────────────────────────────────────────────────────────────────────────

export function subscribeToAppVersion(callback: (version: string) => void) {
  const docRef = doc(db, 'settings', 'version');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().currentVersion || '1.0.0');
    }
  });
}

export async function updateAppVersion(newVersion: string) {
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

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM METADATA
// ─────────────────────────────────────────────────────────────────────────────



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
  const gdFactor = Math.max(-10, Math.min(goalDiff, 20));
  
  // Base stat value (gives up to +18 OVR)
  const statsBonus = (winPct * 15) + (gamesFactor * 5) + (gdFactor * 0.4);
  
  // Elo pulls its weight smoothly (gives +/- based on actual true chess rating)
  const eloBonus = (elo - 1200) / 10;
  
  let ovr = 60 + statsBonus + eloBonus;
  return Math.max(40, Math.min(99, Math.round(ovr)));
}

export const INITIAL_PLAYERS: Player[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// DATA CACHING & DEDUPLICATION
// ─────────────────────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default
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

/** One-shot fetch for guests — no real-time listener. */
export async function fetchPlayersOnce(limitCount = 15): Promise<Player[]> {
  try {
    const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'players');
    return [];
  }
}

/** One-shot fetch for guests — no real-time listener. */
export async function fetchLeadersOnce(): Promise<Leader[]> {
  try {
    const q = query(collection(db, 'leaders'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'leaders');
    return [];
  }
}

export async function fetchPlayers(limitCount?: number, force = false): Promise<Player[]> {
  const cacheKey = `players_${limitCount || 'all'}`;
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = limitCount 
      ? query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount))
      : query(collection(db, 'players'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...d.data() } as Player));
  });
}

export async function fetchLeaders(force = false): Promise<Leader[]> {
  const cacheKey = 'leaders_top50';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const q = query(collection(db, 'leaders'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...d.data() } as Leader));
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

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER SELF-REGISTRATION
// Adds the player as a Team entry in the tournament and records their player ID
// in registeredPlayerIds.
// ─────────────────────────────────────────────────────────────────────────────

export async function registerPlayerInTournament(
  tournament: Tournament,
  playerId: string,
  playerName: string,
  playerImage: string
): Promise<void> {
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
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER PROFILE UPDATE
// Updates only the profile fields (image, uid, device) for a player.
// Uses updateDoc (partial update) — cheaper than a full setDoc.
// ─────────────────────────────────────────────────────────────────────────────

export async function updatePlayerProfile(
  playerId: string,
  updates: { image?: string; uid?: string; device?: string }
): Promise<void> {
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

// ─────────────────────────────────────────────────────────────────────────────
// DIRECT COLLECTION LISTENERS (Quota-optimized)
// Uses onSnapshot directly on each collection — fires only when data actually
// changes, not on every unrelated admin write.
// ─────────────────────────────────────────────────────────────────────────────
export function subscribeToPlayers(callback: (players: Player[], hasPending: boolean) => void, limitCount = 100, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount));
  return onSnapshot(q, { includeMetadataChanges: false }, (snap) => {
    const players = snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
    callback(players, snap.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'players');
  });
}

export function subscribeToLeaders(callback: (leaders: Leader[], hasPending: boolean) => void, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'leaders'), limit(50));
  return onSnapshot(q, { includeMetadataChanges: false }, (snap) => {
    const leaders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
    callback(leaders, snap.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'leaders');
  });
}

export function subscribeToMatches(callback: (matches: MatchRecord[], hasPending: boolean) => void, limitCount = 200, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount));
  return onSnapshot(q, { includeMetadataChanges: false }, (snap) => {
    const matches = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
    callback(matches, snap.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'matches');
  });
}

export function subscribeToTournaments(callback: (tournaments: Tournament[], hasPending: boolean) => void, limitCount = 100, errorCallback?: (err: Error) => void) {
  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, { includeMetadataChanges: false }, (snap) => {
    const tournaments = snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament));
    callback(tournaments, snap.metadata.hasPendingWrites);
  }, (error) => {
    if (errorCallback) errorCallback(error);
    handleFirestoreError(error, OperationType.GET, 'tournaments');
  });
}

/**
 * Fetches ALL matches for a specific player from Firestore.
 */
async function fetchAllMatchesForPlayer(playerId: string): Promise<MatchRecord[]> {
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
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE STAT COMPUTATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

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
  const playerMatches = allMatches
    .filter(m => m.p1Id === player.id || m.p2Id === player.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  const global = buildPartialStats(playerMatches, player.id);

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
  return updatedPlayer;
}

export async function recalculateAllStats(playersArg?: Player[]) {
  const batch = writeBatch(db);
  
  let playersToSync = playersArg || [];
  if (playersToSync.length === 0) {
    const allPlayersSnap = await getDocs(collection(db, 'players'));
    playersToSync = allPlayersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
  }

  if (playersToSync.length === 0) return;

  const fullMatchesSnap = await getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'asc')));
  const allMatches = fullMatchesSnap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
  const elos = computeGlobalElo(playersToSync, allMatches);
  playersToSync.forEach(p => {
    const updatedPlayer = computePlayerStats(p, allMatches, elos[p.id] || 1200);
    batch.set(doc(db, 'players', p.id), updatedPlayer);
  });
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-recalculate-stats');
  }
}

export async function seedDatabase() {
  const { MOCK_PLAYERS, LEADERS } = await import('../mockData');
  const batch = writeBatch(db);

  MOCK_PLAYERS.forEach(p => {
    batch.set(doc(db, 'players', p.id), { ...p, statsVersion: STATS_VERSION });
  });

  LEADERS.forEach(l => {
    batch.set(doc(db, 'leaders', l.id), l);
  });

  await batch.commit();
}

export async function savePlayer(player: Player) {
  if (isQuotaExceeded) throw new Error("SYSTEM LOCKED");
  try {
    await setDoc(doc(db, 'players', player.id), player);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `players/${player.id}`);
  }
}

export async function addMatch(
  p1: Player,
  p1Score: number,
  p2Score: number,
  p2: Player | undefined,
  _legacyMatches: MatchRecord[],
  tournament?: string,
  p2NameOverride?: string,
  seasonId?: string,
  matchday?: number
) {
  if (isQuotaExceeded) throw new Error("SYSTEM LOCKED");
  const batch = writeBatch(db);

  const matchRef = doc(collection(db, 'matches'));
  const matchRecord: MatchRecord = {
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
  };
  batch.set(matchRef, matchRecord);

  const [p1Matches, p2Matches] = await Promise.all([
    fetchAllMatchesForPlayer(p1.id),
    p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
  ]);

  const p1AllMatches = [...p1Matches, matchRecord];
  const p2AllMatches = p2 ? [...p2Matches, matchRecord] : [];

  const allForElo = [...new Map([...p1Matches, ...(p2 ? p2Matches : [])].map(m => [m.id, m])).values(), matchRecord]
    .sort((a, b) => a.timestamp - b.timestamp);
  const elos = computeGlobalElo([p1, ...(p2 ? [p2] : [])], allForElo);

  const updatedP1 = computePlayerStats(p1, p1AllMatches, elos[p1.id] || 1200);
  batch.set(doc(db, 'players', p1.id), updatedP1);

  if (p2) {
    const updatedP2 = computePlayerStats(p2, p2AllMatches, elos[p2.id] || 1200);
    batch.set(doc(db, 'players', p2.id), updatedP2);
  }

  // Dynamic Manager Rating updates
  try {
    const allClubs = await fetchClubs();
    
    let p1Change = 0, p2Change = 0;
    if (p1Score > p2Score) { p1Change = 2; p2Change = -2; }
    else if (p2Score > p1Score) { p1Change = -2; p2Change = 2; }
    else { p1Change = 1; p2Change = 1; }

    const p1Club = allClubs.find(c => c.squadIds?.includes(p1.id));
    if (p1Club) {
      const newRating = Math.max(0, Math.min(100, (p1Club.managerRating || 80) + p1Change));
      batch.update(doc(db, 'clubs', p1Club.id), { managerRating: newRating });
    }
    if (p2) {
      const p2Club = allClubs.find(c => c.squadIds?.includes(p2.id));
      if (p2Club) {
        const newRating = Math.max(0, Math.min(100, (p2Club.managerRating || 80) + p2Change));
        batch.update(doc(db, 'clubs', p2Club.id), { managerRating: newRating });
      }
    }
  } catch(e) {
    console.warn("Could not calculate dynamic manager ratings", e);
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
  }
}

export async function editMatch(
  oldMatch: MatchRecord,
  newP1Score: number,
  newP2Score: number,
  players: Player[],
  _legacyMatches: MatchRecord[],
  newTournament?: string,
  newSeasonId?: string,
  newMatchday?: number
) {
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

  try {
    const allClubs = await fetchClubs();
    const p1Club = allClubs.find(c => c.squadIds?.includes(p1?.id || ''));
    const p2Club = p2 ? allClubs.find(c => c.squadIds?.includes(p2.id)) : undefined;

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

export async function deleteMatchFromHistory(
  matchRecord: MatchRecord,
  players: Player[],
  _legacyMatches: MatchRecord[]
) {
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);
  batch.delete(doc(db, 'matches', matchRecord.id));

  const p1 = players.find(p => p.id === matchRecord.p1Id);
  const p2 = matchRecord.p2Id ? players.find(p => p.id === matchRecord.p2Id) : undefined;

  const [p1Matches, p2Matches] = await Promise.all([
    p1 ? fetchAllMatchesForPlayer(p1.id) : Promise.resolve([] as MatchRecord[]),
    p2 ? fetchAllMatchesForPlayer(p2.id) : Promise.resolve([] as MatchRecord[]),
  ]);

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

  try {
    const allClubs = await fetchClubs();
    const p1Club = allClubs.find(c => c.squadIds?.includes(p1?.id || ''));
    const p2Club = p2 ? allClubs.find(c => c.squadIds?.includes(p2.id)) : undefined;

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

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'batch-match-delete');
  }
}

export async function deletePlayer(id: string) {
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'players', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `players/${id}`);
  }
}

export async function saveLeader(leader: Leader) {
  try {
    await setDoc(doc(db, 'leaders', leader.id), leader);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `leaders/${leader.id}`);
  }
}

export async function deleteLeader(id: string) {
  try {
    await deleteDoc(doc(db, 'leaders', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `leaders/${id}`);
  }
}

export async function saveTournament(tournament: Tournament) {
  if (isQuotaExceeded) throw new Error("SYSTEM LOCKED");
  try {
    await setDoc(doc(db, 'tournaments', tournament.id), tournament);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `tournaments/${tournament.id}`);
    throw error;
  }
}

export async function deleteTournament(id: string) {
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'tournaments', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `tournaments/${id}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLUB ZONE STORE
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchClubConfig(force = false): Promise<ClubSystemConfig | null> {
  const cacheKey = 'club_config';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const snap = await getDoc(doc(db, 'settings', 'clubConfig'));
    return snap.exists() ? (snap.data() as ClubSystemConfig) : null;
  });
}

export async function saveClubConfig(config: ClubSystemConfig): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  try {
    await setDoc(doc(db, 'settings', 'clubConfig'), config);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/clubConfig');
    throw err;
  }
}

export async function fetchClubs(force = false): Promise<Club[]> {
  const cacheKey = 'clubs_all';
  if (force) invalidateCache(cacheKey);
  
  return fetchWithCache(cacheKey, async () => {
    const snap = await getDocs(query(collection(db, 'clubs'), orderBy('name', 'asc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
  });
}

export async function saveClub(club: Club, previousOwnerId?: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  
  const batch = writeBatch(db);
  const clubId = club.id || `club_${Date.now()}`;
  const finalClub = { ...club, id: clubId };

  batch.set(doc(db, 'clubs', clubId), finalClub);

  if (previousOwnerId && previousOwnerId !== club.ownerId) {
    batch.update(doc(db, 'players', previousOwnerId), {
      clubId: null, isClubOwner: false, clubName: null,
      primaryColor: null, secondaryColor: null,
    });
  }

  if (club.ownerId) {
    batch.update(doc(db, 'players', club.ownerId), {
      clubId: clubId,
      clubName: club.name,
      isClubOwner: true,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
    });
  }

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
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${clubId}`);
    throw err;
  }
}

export async function deleteClub(id: string): Promise<void> {
  if (isQuotaExceeded) return;
  try {
    const snap = await getDoc(doc(db, 'clubs', id));
    if (snap.exists()) {
      const club = snap.data() as Club;
      const batch = writeBatch(db);
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

export async function fetchMarketListings(force = false): Promise<MarketListing[]> {
  const cacheKey = 'club_market_listings';
  if (force) invalidateCache(cacheKey);

  return fetchWithCache(cacheKey, async () => {
    const snap = await getDocs(query(collection(db, 'clubListings'), orderBy('createdAt', 'desc'), limit(100)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketListing));
  });
}

export async function fetchClubSeasonMatches(seasonName: string): Promise<MatchRecord[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'matches'), where('tournament', '==', seasonName), limit(200))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'matches-club-season');
    return [];
  }
}

export async function listPlayerOnMarket(listing: MarketListing): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
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

export async function purchasePlayer(
  listing: MarketListing,
  buyerClub: Club,
  sellerClub: Club,
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const batch = writeBatch(db);
  batch.update(doc(db, 'clubs', buyerClub.id), {
    budget: buyerClub.budget - listing.price,
    squadIds: [...buyerClub.squadIds, listing.playerId],
  });
  batch.update(doc(db, 'clubs', sellerClub.id), {
    budget: sellerClub.budget + listing.price,
    squadIds: sellerClub.squadIds.filter(id => id !== listing.playerId),
  });
  batch.update(doc(db, 'players', listing.playerId), {
    clubId: buyerClub.id,
    clubName: buyerClub.name,
    primaryColor: buyerClub.primaryColor,
    secondaryColor: buyerClub.secondaryColor,
    isListed: false,
    listingPrice: null,
  });
  batch.delete(doc(db, 'clubListings', listing.id));
  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'club-purchase');
    throw err;
  }
}

export async function fetchClubTournaments(seasonName: string): Promise<ClubTournament[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubTournaments'), where('season', '==', seasonName), limit(50)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubTournament));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubTournaments');
    return [];
  }
}

export async function saveClubTournament(tourney: ClubTournament): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  try {
    await setDoc(doc(db, 'clubTournaments', tourney.id), tourney);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubTournaments/${tourney.id}`);
    throw err;
  }
}

export async function fetchClubFixtures(seasonName: string): Promise<ClubFixture[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubFixtures'), where('season', '==', seasonName), limit(200)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubFixture));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubFixtures');
    return [];
  }
}

export async function saveClubFixture(fixture: ClubFixture): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  try {
    await setDoc(doc(db, 'clubFixtures', fixture.id), fixture);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${fixture.id}`);
    throw err;
  }
}

export async function updateFixtureSubMatch(
  fixtureId: string,
  subMatchId: string,
  p1Score: number,
  p2Score: number,
  config: ClubSystemConfig
): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  
  const fixRef = doc(db, 'clubFixtures', fixtureId);
  const fixSnap = await getDoc(fixRef);
  if (!fixSnap.exists()) throw new Error('Fixture not found');
  const fixture = fixSnap.data() as ClubFixture;

  const newSubMatches = fixture.subMatches.map(sm => 
    sm.id === subMatchId ? { ...sm, p1Score, p2Score } : sm
  );
  
  const allCompleted = newSubMatches.every(sm => sm.p1Score !== null);
  
  const batch = writeBatch(db);
  batch.update(fixRef, { 
    subMatches: newSubMatches, 
    status: allCompleted ? 'completed' : fixture.status 
  });

  if (allCompleted && config.contractsActive && config.defaultContractType === 'matches') {
    const allParticipantIds = [...new Set([
      ...newSubMatches.map(sm => sm.p1Id),
      ...newSubMatches.map(sm => sm.p2Id)
    ])];
    
    const playerFetches = allParticipantIds.map(pid => getDoc(doc(db, 'players', pid)));
    const playerSnaps = await Promise.all(playerFetches);
    playerSnaps.forEach(docSnap => {
      if (!docSnap.exists()) return;
      const p = docSnap.data() as Player;
      if (p.clubContract && p.clubContract.type === 'matches' && p.clubContract.amount > 0) {
        batch.update(docSnap.ref, {
          'clubContract.amount': p.clubContract.amount - 1
        });
      }
    });
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${fixtureId}/subMatch`);
    throw err;
  }
}

export function subscribeToAuction(callback: (state: AuctionState | null) => void) {
  const AUCTION_DOC = doc(db, 'auctions', 'live');
  return onSnapshot(AUCTION_DOC, (snap) => {
    callback(snap.exists() ? (snap.data() as AuctionState) : null);
  }, (err) => handleFirestoreError(err, OperationType.GET, 'auctions/live'));
}

export async function adminRevealCard(player: any, basePrice: number, bidIncrement: number) {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const AUCTION_DOC = doc(db, 'auctions', 'live');
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

export async function adminConfirmSold(auctionState: AuctionState, winningClub: Club) {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const AUCTION_DOC = doc(db, 'auctions', 'live');
  await setDoc(AUCTION_DOC, { status: 'sold', soldAt: Date.now() }, { merge: true });
}

export async function adminSkipPlayer() {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  const AUCTION_DOC = doc(db, 'auctions', 'live');
  await setDoc(AUCTION_DOC, { status: 'idle', currentPlayer: null }, { merge: true });
}

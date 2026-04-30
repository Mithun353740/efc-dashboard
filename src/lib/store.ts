import { Player, PartialPlayerStats, Leader, MatchRecord, Tournament, AuctionState, ClubSeason, ClubInboxMessage, TransferThread, TransferOffer, ReleaseClause } from '../types';
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

const META_DOC_PATH = 'settings/meta';

/**
 * Called after every admin write to signal the last update time.
 */
async function updateLastUpdated(): Promise<void> {
  try {
    await setDoc(doc(db, META_DOC_PATH), { lastUpdated: serverTimestamp() }, { merge: true });
  } catch (error) {
    // Non-critical — if this fails, cache just stays valid a bit longer
    console.warn('[Meta] Could not update lastUpdated timestamp:', error);
  }
}

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
      console.error("Firestore is offline. Please check your Firebase configuration.");
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

export async function fetchPlayers(limitCount?: number): Promise<Player[]> {
  const q = limitCount 
    ? query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(limitCount))
    : query(collection(db, 'players'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
}

export async function fetchLeaders(): Promise<Leader[]> {
  const q = query(collection(db, 'leaders'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
}

export async function fetchMatches(): Promise<MatchRecord[]> {
  const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER SELF-REGISTRATION
// Adds the player as a Team entry in the tournament and records their player ID
// in registeredPlayerIds. Calls saveTournament() which already bumps the
// cache-invalidation timestamp — all public users will see the update.
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
  // saveTournament already calls updateLastUpdated() — no need to call it again
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER PROFILE UPDATE
// Updates only the profile fields (image, uid, device) for a player.
// Uses updateDoc (partial update) — cheaper than a full setDoc.
// Bumps the cache invalidation timestamp so all users get fresh data.
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
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `players/${playerId}`);
  }
}


// Real-time listeners
export function subscribeToPlayers(callback: (players: Player[], hasPending: boolean) => void, limitCount = 100) {
  const path = 'players';
  let isUnsubscribed = false;
  
  const fetch = async () => {
    if (isUnsubscribed) return;
    try {
      const q = query(collection(db, path), orderBy('ovr', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
      callback(players, false);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  fetch();
  const unsubMeta = onSnapshot(doc(db, 'metadata', 'cache'), () => { fetch(); });

  return () => {
    isUnsubscribed = true;
    unsubMeta();
  };
}

export function subscribeToLeaders(callback: (leaders: Leader[], hasPending: boolean) => void) {
  const path = 'leaders';
  let isUnsubscribed = false;

  const fetch = async () => {
    if (isUnsubscribed) return;
    try {
      const q = query(collection(db, path), limit(50));
      const snapshot = await getDocs(q);
      const leaders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
      callback(leaders, false);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  fetch();
  const unsubMeta = onSnapshot(doc(db, 'metadata', 'cache'), () => { fetch(); });

  return () => {
    isUnsubscribed = true;
    unsubMeta();
  };
}

/**
 * Real-time match listener.
 * The listener is used ONLY for the admin match history view.
 * Public users never subscribe to matches — they read pre-computed stats
 * from the Player documents instead. Limit keeps the listener cheap.
 */
export function subscribeToMatches(callback: (matches: MatchRecord[], hasPending: boolean) => void) {
  const path = 'matches';
  let isUnsubscribed = false;

  const fetch = async () => {
    if (isUnsubscribed) return;
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(200));
      const snapshot = await getDocs(q);
      const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
      callback(matches, false);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  fetch();
  const unsubMeta = onSnapshot(doc(db, 'metadata', 'cache'), () => { fetch(); });

  return () => {
    isUnsubscribed = true;
    unsubMeta();
  };
}

/**
 * Fetches ALL matches for a specific player from Firestore.
 * Uses two queries (p1Id and p2Id) since Firestore doesn't support OR on different fields.
 * Called during stat computation — only the admin pays this cost on each write.
 */
async function fetchAllMatchesForPlayer(playerId: string): Promise<MatchRecord[]> {
  const [snap1, snap2] = await Promise.all([
    getDocs(query(collection(db, 'matches'), where('p1Id', '==', playerId), orderBy('timestamp', 'desc'), limit(50))),
    getDocs(query(collection(db, 'matches'), where('p2Id', '==', playerId), orderBy('timestamp', 'desc'), limit(50))),
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

export function subscribeToTournaments(callback: (tournaments: Tournament[], hasPending: boolean) => void, limitCount = 100) {
  const path = 'tournaments';
  let isUnsubscribed = false;

  const fetch = async () => {
    if (isUnsubscribed) return;
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
      callback(tournaments, false);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  fetch();
  const unsubMeta = onSnapshot(doc(db, 'metadata', 'cache'), () => { fetch(); });

  return () => {
    isUnsubscribed = true;
    unsubMeta();
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE STAT COMPUTATION ENGINE
// Pure function — no side effects.
// Produces global stats, seasonStats, and tournamentStats from raw matches.
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
  // ── 1. Filter to this player's matches (sorted asc for correct form order) ──
  const playerMatches = allMatches
    .filter(m => m.p1Id === player.id || m.p2Id === player.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  // ── 2. Global all-time stats ──────────────────────────────────────────────
  const global = buildPartialStats(playerMatches, player.id);

  // ── 3. Per-season stats ───────────────────────────────────────────────────
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

  // ── 4. Per-tournament stats (keyed by `season__canonicalTournament`) ───────
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

  // ── 5. Assemble final Player document ─────────────────────────────────────
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

/**
 * Admin-triggered full resync.
 * Fetches ALL matches from Firestore, recomputes every player from scratch,
 * and writes all Player documents atomically.
 */
export async function recalculateAllStats(players: Player[]) {
  const batch = writeBatch(db);
  const fullMatchesSnap = await getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'asc')));
  const allMatches = fullMatchesSnap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
  const elos = computeGlobalElo(players, allMatches);
  players.forEach(p => {
    const updatedPlayer = computePlayerStats(p, allMatches, elos[p.id] || 1200);
    batch.set(doc(db, 'players', p.id), updatedPlayer);
  });
  try {
    await batch.commit();
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-recalculate-stats');
  }
}

export async function savePlayer(player: Player) {
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot save player info while Quota is exceeded. Please refresh after reset.");
  }
  const path = `players/${player.id}`;
  console.log('Saving player to Firestore:', path, player);
  try {
    await setDoc(doc(db, 'players', player.id), player);
    console.log('Player saved successfully');
    // Signal all public users their cache is now stale
    await updateLastUpdated();
  } catch (error) {
    console.error('Error in savePlayer:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Adds a match and atomically recomputes stats for affected players.
 * Fetches FULL match history per-player from Firestore — not from the
 * capped real-time listener — guaranteeing correctness regardless of
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
  matchday?: number
) {
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot add match while Quota is exceeded.");
  }
  const batch = writeBatch(db);

  // 1. Write the new match document first
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

  // 5. Dynamic Manager Rating updates
  try {
    const allClubsSnap = await getDocs(collection(db, 'clubs'));
    const allClubs = allClubsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
    
    const p1Club = allClubs.find(c => c.squadIds?.includes(p1.id));
    const p2Club = p2 ? allClubs.find(c => c.squadIds?.includes(p2.id)) : undefined;

    let p1Change = 0;
    let p2Change = 0;
    if (p1Score > p2Score) { p1Change = 2; p2Change = -2; }
    else if (p2Score > p1Score) { p1Change = -2; p2Change = 2; }
    else { p1Change = 1; p2Change = 1; } // Draw gives +1 for effort

    if (p1Club) {
      const newRating = Math.max(0, Math.min(100, (p1Club.managerRating || 80) + p1Change));
      batch.update(doc(db, 'clubs', p1Club.id), { managerRating: newRating });
    }
    if (p2Club) {
      const newRating = Math.max(0, Math.min(100, (p2Club.managerRating || 80) + p2Change));
      batch.update(doc(db, 'clubs', p2Club.id), { managerRating: newRating });
    }
  } catch(e) {
    console.warn("Could not calculate dynamic manager ratings", e);
  }

  try {
    await batch.commit();
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
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

  // Dynamic Manager Rating updates (Edit logic)
  try {
    const allClubsSnap = await getDocs(collection(db, 'clubs'));
    const allClubs = allClubsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
    
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
    await updateLastUpdated();
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

  // Dynamic Manager Rating updates (Delete logic)
  try {
    const allClubsSnap = await getDocs(collection(db, 'clubs'));
    const allClubs = allClubsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
    
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
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'batch-match-delete');
  }
}

export async function deletePlayer(id: string) {
  if (isQuotaExceeded) return;
  const path = `players/${id}`;
  try {
    await deleteDoc(doc(db, 'players', id));
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveLeader(leader: Leader) {
  const path = `leaders/${leader.id}`;
  try {
    await setDoc(doc(db, 'leaders', leader.id), leader);
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteLeader(id: string) {
  const path = `leaders/${id}`;
  try {
    await deleteDoc(doc(db, 'leaders', id));
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveTournament(tournament: Tournament) {
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot update tournament while Quota is exceeded.");
  }
  const path = `tournaments/${tournament.id}`;
  try {
    await setDoc(doc(db, 'tournaments', tournament.id), tournament);
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteTournament(id: string) {
  if (isQuotaExceeded) return;
  const path = `tournaments/${id}`;
  try {
    await deleteDoc(doc(db, 'tournaments', id));
    await updateLastUpdated();
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

// ─────────────────────────────────────────────────────────────────────────────
// CLUB ZONE STORE
// All reads are one-shot (getDocs/getDoc) — NO real-time listeners.
// This keeps quota impact minimal: data is only fetched when the Club Zone
// page is actually open. Each visitor pays at most ~3 reads per page load.
// ─────────────────────────────────────────────────────────────────────────────

import { Club, ClubSystemConfig, MarketListing } from '../types';

/** Fetch the club system config (1 read). */
export async function fetchClubConfig(): Promise<ClubSystemConfig | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'clubConfig'));
    if (snap.exists()) return snap.data() as ClubSystemConfig;
  } catch (err) {
    console.warn('[Club] fetchClubConfig failed:', err);
  }
  return null;
}

/** Persist the club system config (1 write). */
export async function saveClubConfig(config: ClubSystemConfig): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'settings', 'clubConfig'), config);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/clubConfig');
    throw err;
  }
}

/** Fetch all clubs (1 read per club doc — very small collection). */
export async function fetchClubs(): Promise<Club[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubs'), limit(100)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubs');
    return [];
  }
}

/**
 * Save a club and update the owner player's clubId / isClubOwner flags.
 * If ownerId changed, clears old owner's flags.
 */
export async function saveClub(club: Club, previousOwnerId?: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  const batch = writeBatch(db);

  // Write club document
  batch.set(doc(db, 'clubs', club.id), club);

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
      clubId: club.id,
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
        clubId: club.id,
        clubName: club.name,
        primaryColor: club.primaryColor,
        secondaryColor: club.secondaryColor,
      });
    }
  });

  try {
    await batch.commit();
    await updateLastUpdated();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${club.id}`);
    throw err;
  }
}

/** Delete a club and clean up all player references. */
export async function deleteClub(id: string): Promise<void> {
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
    await updateLastUpdated();
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
    await updateLastUpdated();
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
    await updateLastUpdated();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubs/${club.id}/squad`);
  }
}

/** Fetch all active market listings (1 collection read). */
export async function fetchMarketListings(): Promise<MarketListing[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubListings'), limit(100)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketListing));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubListings');
    return [];
  }
}

/**
 * Fetch only the matches that are part of the active club season.
 * Uses a targeted `where` query — costs 1 read per match doc, never loads
 * unrelated matches. Called only when the Club Rankings tab is opened.
 */
export async function fetchClubSeasonMatches(seasonName: string): Promise<import('../types').MatchRecord[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'matches'), where('tournament', '==', seasonName), limit(200))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').MatchRecord));
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
 * Purchase a player — atomic transfer of player + budget between clubs.
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

  // Update player
  batch.update(doc(db, 'players', listing.playerId), {
    clubId: buyerClub.id,
    clubName: buyerClub.name,
    primaryColor: buyerClub.primaryColor,
    secondaryColor: buyerClub.secondaryColor,
    isListed: false,
    listingPrice: null,
  });

  // Delete listing
  batch.delete(doc(db, 'clubListings', listing.id));

  try {
    await batch.commit();
    await updateLastUpdated();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'club-purchase');
    throw err;
  }
}

// ─── CLUB TOURNAMENTS & FIXTURES ─────────────────────────────────────────────

export async function fetchClubTournaments(seasonName: string): Promise<import('../types').ClubTournament[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubTournaments'), where('season', '==', seasonName), limit(50)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').ClubTournament));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubTournaments');
    return [];
  }
}

export async function saveClubTournament(tourney: import('../types').ClubTournament): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'clubTournaments', tourney.id), tourney);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubTournaments/${tourney.id}`);
    throw err;
  }
}

export async function deleteClubTournament(id: string): Promise<void> {
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'clubTournaments', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubTournaments/${id}`);
    throw err;
  }
}

export async function fetchClubFixtures(seasonName: string): Promise<import('../types').ClubFixture[]> {
  // Filter by season to avoid reading the entire collection
  try {
    const snap = await getDocs(query(collection(db, 'clubFixtures'), where('season', '==', seasonName), limit(200)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').ClubFixture));
  } catch (err) {
    // Fallback: if no 'season' field on old documents, fetch all (graceful degradation)
    try {
      const snap = await getDocs(query(collection(db, 'clubFixtures'), limit(200)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').ClubFixture));
    } catch (err2) {
      handleFirestoreError(err2, OperationType.LIST, 'clubFixtures');
      return [];
    }
  }
}

export async function saveClubFixture(fixture: import('../types').ClubFixture): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await setDoc(doc(db, 'clubFixtures', fixture.id), fixture);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${fixture.id}`);
    throw err;
  }
}

export async function deleteClubFixture(id: string): Promise<void> {
  if (isQuotaExceeded) return;
  try {
    await deleteDoc(doc(db, 'clubFixtures', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clubFixtures/${id}`);
    throw err;
  }
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

  // If the fixture is completed, deduct matches from contracts for all participants
  if (allCompleted && config.contractsActive && config.defaultContractType === 'matches') {
    const allParticipantIds = [...new Set([
      ...newSubMatches.map(sm => sm.p1Id),
      ...newSubMatches.map(sm => sm.p2Id)
    ])];
    
    // Fetch each participant doc individually — more reads but correct.
    // Using FieldValue.increment is not possible here since we need to check if amount hits 0.
    // Each fixture has at most lineupSize*2 participants, typically 4-10 reads max.
    const playerFetches = allParticipantIds.map(pid => getDoc(doc(db, 'players', pid)));
    const playerSnaps = await Promise.all(playerFetches);
    playerSnaps.forEach(docSnap => {
      if (!docSnap.exists()) return;
      const p = docSnap.data() as import('../types').Player;
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

// ─────────────────────────────────────────────────────────────────────────────
// Ranking logic (can be used on the client-side array)
export function sortRankedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // 1. Players with 0 matches should ALWAYS be at the bottom
    const totalMatchesA = a.win + a.loss + a.draw;
    const totalMatchesB = b.win + b.loss + b.draw;
    if (totalMatchesA === 0 && totalMatchesB > 0) return 1;
    if (totalMatchesB === 0 && totalMatchesA > 0) return -1;

    // 2. OVR (Overall Rating is the true measure of skill for all-time global ranking)
    if (b.ovr !== a.ovr) return b.ovr - a.ovr;

    // 3. Win Percentage (Tie breaker for same OVR)
    const winPctA = totalMatchesA > 0 ? a.win / totalMatchesA : 0;
    const winPctB = totalMatchesB > 0 ? b.win / totalMatchesB : 0;
    if (winPctB !== winPctA) return winPctB - winPctA;

    // 4. Points
    const pointsA = a.win * 3 + a.draw;
    const pointsB = b.win * 3 + b.draw;
    if (pointsB !== pointsA) return pointsB - pointsA;
    
    // 5. Goal Difference
    const gdA = a.goalsScored - a.goalsConceded;
    const gdB = b.goalsScored - b.goalsConceded;
    if (gdB !== gdA) return gdB - gdA;

    // 6. Goals Scored
    if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
    
    // 7. Total Wins
    if (b.win !== a.win) return b.win - a.win;
    
    // 8. Matches Played (FEWER matches played ranks higher if tied - "Games in Hand")
    if (totalMatchesA !== totalMatchesB) return totalMatchesA - totalMatchesB;
    
    // 7. Alphabetical order fallback
    return a.name.localeCompare(b.name);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CLUB ZONE V2 — AUCTION SYSTEM
// Single shared document "auctions/live" — all 60+ viewers share ONE listener.
// Cost: 1 read per user to connect + 1 write per bid/fold/reveal. Extremely cheap.
// ═════════════════════════════════════════════════════════════════════════════

const AUCTION_DOC = doc(db, 'auctions', 'live');

/** Real-time listener on the single auction document. */
export function subscribeToAuction(callback: (state: AuctionState | null) => void) {
  return onSnapshot(AUCTION_DOC, (snap) => {
    callback(snap.exists() ? (snap.data() as AuctionState) : null);
  }, (err) => handleFirestoreError(err, OperationType.GET, 'auctions/live'));
}

/** Admin: Initialize/reset the auction for a new session. */
export async function adminStartAuction(clubIds: string[], bidIncrement: number, basePrice: number): Promise<void> {
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
  }, { merge: true });
}

/** Club owner: Fold — remove from current round. */
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
      const winningClub = winningClubDoc.data() as import('../types').Club;
      batch.update(doc(db, 'clubs', winningClub.id), { budget: winningClub.budget - currentState.currentBid });
      batch.update(doc(db, 'players', currentState.currentPlayer.id), {
        clubId: winningClub.id,
        clubName: winningClub.name,
        primaryColor: winningClub.primaryColor,
        secondaryColor: winningClub.secondaryColor,
        isListed: false,
        listingPrice: null,
      });
      batch.set(AUCTION_DOC, {
        foldedClubs: newFolded,
        status: 'sold',
        soldAt: Date.now(),
        currentTurnIndex: currentState.currentTurnIndex,
      }, { merge: true });
      await batch.commit();
      await updateLastUpdated();
      return;
    }
  }

  await setDoc(AUCTION_DOC, {
    foldedClubs: newFolded,
    status: 'active',
    soldAt: null,
    currentTurnIndex: (currentState.currentTurnIndex + 1) % Math.max(activeBidders.length, 1),
  }, { merge: true });
}

/** Admin: Confirm the sale — deduct budget from winning club, assign player. */
export async function adminConfirmSold(currentState: AuctionState, winningClub: import('../types').Club): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  if (!currentState.currentPlayer || !currentState.leadingClubId) return;
  const batch = writeBatch(db);
  // Deduct budget from winning club
  batch.update(doc(db, 'clubs', winningClub.id), { budget: winningClub.budget - currentState.currentBid });
  // Transfer player to new club
  batch.update(doc(db, 'players', currentState.currentPlayer.id), {
    clubId: winningClub.id,
    clubName: winningClub.name,
    primaryColor: winningClub.primaryColor,
    secondaryColor: winningClub.secondaryColor,
    isListed: false,
    listingPrice: null,
  });
  // Mark auction as sold
  batch.set(AUCTION_DOC, { status: 'sold', soldAt: Date.now() }, { merge: true });
  await batch.commit();
  await updateLastUpdated();
}

/** Admin: Skip the current player (unsold / folded). */
export async function adminSkipPlayer(): Promise<void> {
  await setDoc(AUCTION_DOC, { status: 'folded', currentPlayer: null, leadingClubId: null, leadingClubName: null, currentBid: 0, foldedClubs: [] }, { merge: true });
}

/** Admin: End the entire auction session. */
export async function adminEndAuction(): Promise<void> {
  await setDoc(AUCTION_DOC, { status: 'ended', currentPlayer: null }, { merge: true });
}

// ═════════════════════════════════════════════════════════════════════════════
// CLUB INBOX / NOTIFICATIONS
// Each owner has ONE document at clubInbox/{ownerId}.
// Reading inbox = 1 read. Pushing notification = 1 write (arrayUnion).
// ═════════════════════════════════════════════════════════════════════════════

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

// ═════════════════════════════════════════════════════════════════════════════
// TRANSFER NEGOTIATION SYSTEM
// ═════════════════════════════════════════════════════════════════════════════

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

/** Respond to a proposal — accept, decline, or counter. Costs 1-2 writes. */
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
    } else if (offer.type === 'swap' && offer.swapPlayerId) {
      // Swap: move each player to the other club
      batch.update(doc(db, 'players', player.id), { clubId: clubs.buyerClub.id, clubName: clubs.buyerClub.name, primaryColor: clubs.buyerClub.primaryColor, secondaryColor: clubs.buyerClub.secondaryColor });
      batch.update(doc(db, 'players', offer.swapPlayerId), { clubId: clubs.sellerClub.id, clubName: clubs.sellerClub.name, primaryColor: clubs.sellerClub.primaryColor, secondaryColor: clubs.sellerClub.secondaryColor });
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { squadIds: [...clubs.buyerClub.squadIds.filter(id => id !== offer.swapPlayerId), player.id] });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { squadIds: [...clubs.sellerClub.squadIds.filter(id => id !== player.id), offer.swapPlayerId] });
    }

    // Move bought player to buyer club (for money deal)
    if (offer.type === 'money') {
      batch.update(doc(db, 'players', player.id), { clubId: clubs.buyerClub.id, clubName: clubs.buyerClub.name, primaryColor: clubs.buyerClub.primaryColor, secondaryColor: clubs.buyerClub.secondaryColor, isListed: false, listingPrice: null });
      batch.update(doc(db, 'clubs', clubs.buyerClub.id), { squadIds: [...clubs.buyerClub.squadIds, player.id] });
      batch.update(doc(db, 'clubs', clubs.sellerClub.id), { squadIds: clubs.sellerClub.squadIds.filter(id => id !== player.id) });
    }

    batch.update(threadRef, { status: 'accepted', updatedAt: now });
    await batch.commit();
    await updateLastUpdated();

    await pushInboxMessage(thread.buyerOwnerId, {
      id: `msg_${now}`, type: 'proposal_accepted',
      from: { clubId: thread.sellerClubId, clubName: thread.sellerClubName },
      relatedPlayerId: thread.playerId, relatedPlayerName: thread.playerName, threadId: thread.id,
      message: `🎉 ${thread.sellerClubName} accepted your proposal! ${thread.playerName} is now yours.`,
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

// ═════════════════════════════════════════════════════════════════════════════
// RELEASE CLAUSES
// ═════════════════════════════════════════════════════════════════════════════

/** Club owner sets a release clause on one of their players. 1 write. */
export async function setReleaseClause(playerId: string, clause: ReleaseClause): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'players', playerId), { releaseClause: clause }, { merge: true });
  await updateLastUpdated();
}

/** Remove a release clause from a player. 1 write. */
export async function removeReleaseClause(playerId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'players', playerId), { releaseClause: null }, { merge: true });
  await updateLastUpdated();
}

/** Trigger a release clause — instant purchase, no negotiation needed. 1 batch write. */
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
  await updateLastUpdated();

  const now = Date.now();
  const sellerMsg: ClubInboxMessage = { id: `msg_${now}`, type: 'release_clause_triggered', from: { clubId: buyerClub.id, clubName: buyerClub.name }, relatedPlayerId: player.id, relatedPlayerName: player.name, message: `${buyerClub.name} triggered the release clause for ${player.name} (${amount.toLocaleString()} coins).`, read: false, createdAt: now };
  const buyerMsg: ClubInboxMessage = { id: `msg_${now + 1}`, type: 'release_clause_triggered', from: { clubId: sellerClub.id, clubName: sellerClub.name }, relatedPlayerId: player.id, relatedPlayerName: player.name, message: `✅ Release clause triggered! ${player.name} has joined ${buyerClub.name}.`, read: false, createdAt: now };
  await Promise.all([pushInboxMessage(sellerClub.ownerId, sellerMsg), pushInboxMessage(buyerClub.ownerId, buyerMsg)]);
}

// ═════════════════════════════════════════════════════════════════════════════
// SHORTLIST
// Stored on the Club document — no extra reads needed.
// ═════════════════════════════════════════════════════════════════════════════

export async function addToShortlist(clubId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'clubs', clubId), { shortlistedPlayerIds: arrayUnion(playerId) }, { merge: true });
}

export async function removeFromShortlist(clubId: string, playerId: string): Promise<void> {
  if (isQuotaExceeded) return;
  const clubDoc = await getDoc(doc(db, 'clubs', clubId));
  if (!clubDoc.exists()) return;
  const current: string[] = clubDoc.data().shortlistedPlayerIds || [];
  await setDoc(doc(db, 'clubs', clubId), { shortlistedPlayerIds: current.filter(id => id !== playerId) }, { merge: true });
}

// ═════════════════════════════════════════════════════════════════════════════
// INTERNAL CLUB SEASONS
// ═════════════════════════════════════════════════════════════════════════════

/** Fetch all internal seasons for a global season (e.g., "2026/2027"). */
export async function fetchClubSeasons(globalSeason: string): Promise<ClubSeason[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clubSeasons'), where('globalSeason', '==', globalSeason), orderBy('seasonNumber', 'asc'), limit(20)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubSeason));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'clubSeasons');
    return [];
  }
}

/** Admin: Start a new internal season. 1 write. */
export async function startClubSeason(globalSeason: string, seasonNumber: number): Promise<ClubSeason> {
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
  };
  await setDoc(doc(db, 'clubSeasons', id), season);
  // Update the active season reference in clubConfig
  await setDoc(doc(db, 'settings', 'clubConfig'), { activeInternalSeasonId: id, activeInternalSeasonLabel: season.label }, { merge: true });
  return season;
}

/** Admin: End an internal season, saving the final standings snapshot. 1 write. */
export async function endClubSeason(seasonId: string, standingsSnapshot: ClubSeason['standingsSnapshot']): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED');
  await setDoc(doc(db, 'clubSeasons', seasonId), { status: 'completed', endedAt: Date.now(), standingsSnapshot }, { merge: true });
  await setDoc(doc(db, 'settings', 'clubConfig'), { activeInternalSeasonId: null, activeInternalSeasonLabel: null }, { merge: true });
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
 * Calculates a suggested base prize for auction based on OVR and Form.
 */
export function calculateBasePrize(ovr: number, form: 'A' | 'B' | 'C' | 'D' | 'E'): number {
  // Base price starts at 100k, scales up
  const baseByOvr = Math.max(100000, Math.pow(ovr - 50, 2) * 2000); 
  const formMultiplier = { 'A': 1.5, 'B': 1.2, 'C': 1.0, 'D': 0.8, 'E': 0.6 }[form];
  return Math.round(baseByOvr * formMultiplier);
}

export async function deleteClubSeason(seasonId: string): Promise<void> {
  if (isQuotaExceeded) throw new Error('SYSTEM LOCKED: Quota exceeded.');
  try {
    await deleteDoc(doc(db, 'clubSeasons', seasonId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `clubSeasons/${seasonId}`);
    throw err;
  }
}

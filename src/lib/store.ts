import { Player, Leader, MatchRecord, Tournament } from '../types';
import { db, auth } from '../firebase';
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
  serverTimestamp
} from 'firebase/firestore';

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

let isQuotaExceeded = false;

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

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection test successful');
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Firestore is offline. Please check your Firebase configuration.");
    } else if (error?.code === 'resource-exhausted' || String(error).toLowerCase().includes('quota') || String(error).toLowerCase().includes('resource-exhausted')) {
      // Only fire quota error for actual quota exhaustion — NOT for permission-denied
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
      // Permission denied on the test collection is expected for anonymous users — ignore silently
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

export async function fetchPlayers(): Promise<Player[]> {
  const q = query(collection(db, 'players'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
}

export async function fetchLeaders(): Promise<Leader[]> {
  const q = query(collection(db, 'leaders'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
}

export async function fetchMatches(): Promise<MatchRecord[]> {
  const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'));
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


// Real-time listeners (for Admins)
export function subscribeToPlayers(callback: (players: Player[], hasPending: boolean) => void) {
  const path = 'players';
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    callback(players, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function subscribeToLeaders(callback: (leaders: Leader[], hasPending: boolean) => void) {
  const path = 'leaders';
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const leaders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
    callback(leaders, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function subscribeToMatches(callback: (matches: MatchRecord[], hasPending: boolean) => void) {
  const path = 'matches';
  // Sorting by timestamp descending (newest first)
  const q = query(collection(db, path), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
    callback(matches, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function subscribeToTournaments(callback: (tournaments: Tournament[], hasPending: boolean) => void) {
  const path = 'tournaments';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
    callback(tournaments, snapshot.metadata.hasPendingWrites);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Write operations
export function computePlayerStats(player: Player, allMatches: MatchRecord[], elo: number): Player {
  let win = 0, loss = 0, draw = 0, goalsScored = 0, goalsConceded = 0;
  
  const playerMatches = allMatches
    .filter(m => m.p1Id === player.id || m.p2Id === player.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  playerMatches.forEach(m => {
    const isP1 = m.p1Id === player.id;
    const myScore = isP1 ? Number(m.p1Score) : Number(m.p2Score);
    const oppScore = isP1 ? Number(m.p2Score) : Number(m.p1Score);
    
    goalsScored += myScore;
    goalsConceded += oppScore;
    
    if (myScore > oppScore) win++;
    else if (myScore < oppScore) loss++;
    else draw++;
  });

  const form = playerMatches.slice(-5).map(m => {
    const isP1 = m.p1Id === player.id;
    const myScore = isP1 ? Number(m.p1Score) : Number(m.p2Score);
    const oppScore = isP1 ? Number(m.p2Score) : Number(m.p1Score);
    return myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
  });

  const updatedPlayer: Player = {
    ...player,
    win,
    loss,
    draw,
    goalsScored,
    goalsConceded,
    form,
  };

  // Use the provided ELO for the final OVR calculation
  updatedPlayer.ovr = calculateOvrHybrid(updatedPlayer, elo);
  
  return updatedPlayer;
}

export async function recalculateAllStats(players: Player[], allMatches: MatchRecord[]) {
  const batch = writeBatch(db);
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

export async function addMatch(p1: Player, p1Score: number, p2Score: number, p2: Player | undefined, allMatches: MatchRecord[], tournament?: string, p2NameOverride?: string) {
  if (isQuotaExceeded) {
    throw new Error("SYSTEM LOCKED: Cannot add match while Quota is exceeded.");
  }
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
  };
  batch.set(matchRef, matchRecord);
  
  const updatedMatches = [...allMatches, matchRecord];
  const elos = computeGlobalElo([p1, ...(p2 ? [p2] : [])], updatedMatches);

  const updatedP1 = computePlayerStats(p1, updatedMatches, elos[p1.id] || 1200);
  batch.set(doc(db, 'players', p1.id), updatedP1);

  if (p2) {
    const updatedP2 = computePlayerStats(p2, updatedMatches, elos[p2.id] || 1200);
    batch.set(doc(db, 'players', p2.id), updatedP2);
  }

  try {
    await batch.commit();
    // Signal all public users their cache is now stale
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
  }
}

export async function editMatch(oldMatch: MatchRecord, newP1Score: number, newP2Score: number, players: Player[], allMatches: MatchRecord[], newTournament?: string) {
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);

  const updatedMatchRecord: MatchRecord = {
    ...oldMatch,
    p1Score: newP1Score,
    p2Score: newP2Score,
    tournament: newTournament || oldMatch.tournament || 'Friendly',
  };
  
  batch.update(doc(db, 'matches', oldMatch.id), {
    p1Score: newP1Score,
    p2Score: newP2Score,
    tournament: updatedMatchRecord.tournament,
  });

  const updatedMatches = allMatches.map(m => m.id === oldMatch.id ? updatedMatchRecord : m);
  const elos = computeGlobalElo(players, updatedMatches);

  const p1 = players.find(p => p.id === oldMatch.p1Id);
  if (p1) {
    const updatedP1 = computePlayerStats(p1, updatedMatches, elos[p1.id] || 1200);
    batch.set(doc(db, 'players', p1.id), updatedP1);
  }

  if (oldMatch.p2Id) {
    const p2 = players.find(p => p.id === oldMatch.p2Id);
    if (p2) {
      const updatedP2 = computePlayerStats(p2, updatedMatches, elos[p2.id] || 1200);
      batch.set(doc(db, 'players', p2.id), updatedP2);
    }
  }

  try {
    await batch.commit();
    // Signal all public users their cache is now stale
    await updateLastUpdated();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-edit');
  }
}
export async function deleteMatchFromHistory(matchRecord: MatchRecord, players: Player[], allMatches: MatchRecord[]) {
  if (isQuotaExceeded) return;
  const batch = writeBatch(db);

  batch.delete(doc(db, 'matches', matchRecord.id));

  const updatedMatches = allMatches.filter(m => m.id !== matchRecord.id);
  const elos = computeGlobalElo(players, updatedMatches);

  const p1 = players.find(p => p.id === matchRecord.p1Id);
  if (p1) {
    const updatedP1 = computePlayerStats(p1, updatedMatches, elos[p1.id] || 1200);
    batch.set(doc(db, 'players', p1.id), updatedP1);
  }

  if (matchRecord.p2Id) {
    const p2 = players.find(p => p.id === matchRecord.p2Id);
    if (p2) {
      const updatedP2 = computePlayerStats(p2, updatedMatches, elos[p2.id] || 1200);
      batch.set(doc(db, 'players', p2.id), updatedP2);
    }
  }

  try {
    await batch.commit();
    // Signal all public users their cache is now stale
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

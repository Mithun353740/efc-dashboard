import { Player, Leader, MatchRecord } from '../types';
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
  writeBatch,
  limit,
  getDocFromServer
} from 'firebase/firestore';

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
  
  if (errStrRaw.toLowerCase().includes('quota') || errStrRaw.toLowerCase().includes('exceeded')) {
    console.warn('Firestore Quota Exceeded for path:', path);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
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
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore is offline. Please check your Firebase configuration.");
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

// Real-time listeners
export function subscribeToPlayers(callback: (players: Player[]) => void) {
  const path = 'players';
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    callback(players);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function subscribeToLeaders(callback: (leaders: Leader[]) => void) {
  const path = 'leaders';
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const leaders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
    callback(leaders);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function subscribeToMatches(callback: (matches: MatchRecord[]) => void) {
  const path = 'matches';
  // Sorting by timestamp descending (newest first)
  const q = query(collection(db, path), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchRecord));
    callback(matches);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Write operations
export function computePlayerStats(player: Player, allMatches: MatchRecord[]): Player {
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

  return {
    ...player,
    win,
    loss,
    draw,
    goalsScored,
    goalsConceded,
    form,
    ovr: calculateOvrHybrid(player, 1200) // Fallback OVR
  };
}

export async function recalculateAllStats(players: Player[], allMatches: MatchRecord[]) {
  const batch = writeBatch(db);
  players.forEach(p => {
    const updatedPlayer = computePlayerStats(p, allMatches);
    batch.set(doc(db, 'players', p.id), updatedPlayer);
  });
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-recalculate-stats');
  }
}

export async function savePlayer(player: Player) {
  const path = `players/${player.id}`;
  console.log('Saving player to Firestore:', path, player);
  try {
    await setDoc(doc(db, 'players', player.id), player);
    console.log('Player saved successfully');
  } catch (error) {
    console.error('Error in savePlayer:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addMatch(p1: Player, p1Score: number, p2Score: number, p2: Player | undefined, allMatches: MatchRecord[], tournament?: string) {
  const batch = writeBatch(db);
  
  const matchRef = doc(collection(db, 'matches'));
  const matchRecord: MatchRecord = {
    id: matchRef.id,
    timestamp: Date.now(),
    p1Id: p1.id,
    p1Name: p1.name,
    p1Score,
    p2Id: p2?.id,
    p2Name: p2 ? p2.name : 'External Player',
    p2Score,
    tournament: tournament || 'Friendly',
  };
  batch.set(matchRef, matchRecord);
  
  const updatedMatches = [...allMatches, matchRecord];

  const updatedP1 = computePlayerStats(p1, updatedMatches);
  batch.set(doc(db, 'players', p1.id), updatedP1);

  if (p2) {
    const updatedP2 = computePlayerStats(p2, updatedMatches);
    batch.set(doc(db, 'players', p2.id), updatedP2);
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
  }
}

export async function editMatch(oldMatch: MatchRecord, newP1Score: number, newP2Score: number, players: Player[], allMatches: MatchRecord[], newTournament?: string) {
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

  const p1 = players.find(p => p.id === oldMatch.p1Id);
  if (p1) {
    const updatedP1 = computePlayerStats(p1, updatedMatches);
    batch.set(doc(db, 'players', p1.id), updatedP1);
  }

  if (oldMatch.p2Id) {
    const p2 = players.find(p => p.id === oldMatch.p2Id);
    if (p2) {
      const updatedP2 = computePlayerStats(p2, updatedMatches);
      batch.set(doc(db, 'players', p2.id), updatedP2);
    }
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-edit');
  }
}

export async function deleteMatchFromHistory(matchRecord: MatchRecord, players: Player[], allMatches: MatchRecord[]) {
  const batch = writeBatch(db);

  batch.delete(doc(db, 'matches', matchRecord.id));

  const updatedMatches = allMatches.filter(m => m.id !== matchRecord.id);

  const p1 = players.find(p => p.id === matchRecord.p1Id);
  if (p1) {
    const updatedP1 = computePlayerStats(p1, updatedMatches);
    batch.set(doc(db, 'players', p1.id), updatedP1);
  }

  if (matchRecord.p2Id) {
    const p2 = players.find(p => p.id === matchRecord.p2Id);
    if (p2) {
      const updatedP2 = computePlayerStats(p2, updatedMatches);
      batch.set(doc(db, 'players', p2.id), updatedP2);
    }
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'batch-match-delete');
  }
}

export async function deletePlayer(id: string) {
  const path = `players/${id}`;
  try {
    await deleteDoc(doc(db, 'players', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveLeader(leader: Leader) {
  const path = `leaders/${leader.id}`;
  try {
    await setDoc(doc(db, 'leaders', leader.id), leader);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteLeader(id: string) {
  const path = `leaders/${id}`;
  try {
    await deleteDoc(doc(db, 'leaders', id));
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

    // 2. Points (Highest first)
    const pointsA = a.win * 3 + a.draw;
    const pointsB = b.win * 3 + b.draw;
    if (pointsB !== pointsA) return pointsB - pointsA;
    
    // 3. Goal Difference (Highest first)
    const gdA = a.goalsScored - a.goalsConceded;
    const gdB = b.goalsScored - b.goalsConceded;
    if (gdB !== gdA) return gdB - gdA;

    // 4. Goals Scored (Highest first)
    if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
    
    // 5. Total Wins (Highest first)
    if (b.win !== a.win) return b.win - a.win;
    
    // 6. Matches Played (FEWER matches played ranks higher if perfectly tied on all above - "Games in Hand")
    if (totalMatchesA !== totalMatchesB) return totalMatchesA - totalMatchesB;
    
    // 7. Alphabetical order fallback
    return a.name.localeCompare(b.name);
  });
}

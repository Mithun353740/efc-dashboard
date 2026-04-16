import { Player, Leader } from '../types';
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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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

export const INITIAL_LEADERS: Leader[] = [
  {
    id: '1',
    name: 'ARTHUR THORNE',
    role: 'CLUB PRESIDENT',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    quote: 'Victory is calculated, chaos is controlled.',
    initials: 'PRES',
  },
  {
    id: '2',
    name: 'DR. ELENA VOSS',
    role: 'TACTICAL LEAD',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    quote: 'Optimizing performance through kinetic data.',
    initials: 'TAC',
  },
  {
    id: '3',
    name: 'MARCUS VANE',
    role: 'STRATEGIC DIRECTOR',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    quote: 'Building the foundation for future legends.',
    initials: 'STRAT',
  },
];

export function calculateOVR(win: number, loss: number, draw: number, goalsScored: number, goalsConceded: number): number {
  const totalMatches = win + loss + draw;
  if (totalMatches === 0) return 60;
  const winPct = win / totalMatches;
  const gamesFactor = Math.min(totalMatches, 20) / 20;
  const goalDiff = goalsScored - goalsConceded;
  const gdFactor = Math.max(-10, Math.min(goalDiff, 20));
  let ovr = 60 + (winPct * 25) + (gamesFactor * 5) + (gdFactor * 0.45);
  return Math.min(99, Math.max(40, Math.round(ovr)));
}

export const INITIAL_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'VORTEX KINETIC',
    number: '3',
    position: 'FORWARD',
    ovr: 95,
    win: 24,
    loss: 2,
    draw: 1,
    goalsScored: 45,
    goalsConceded: 12,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    form: ['W', 'W', 'W', 'D', 'W'],
    device: 'PS5',
    uid: 'VORTEX_001'
  },
  {
    id: '2',
    name: 'MARCUS STERLING',
    number: '10',
    position: 'MIDFIELDER',
    ovr: 92,
    win: 18,
    loss: 2,
    draw: 4,
    goalsScored: 22,
    goalsConceded: 10,
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=400&auto=format&fit=crop',
    form: ['W', 'D', 'W', 'W', 'L'],
    device: 'PC',
    uid: 'STERLING_X'
  }
];

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

// Write operations
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

export async function addMatch(p1: Player, p1Score: number, p2Score: number, p2?: Player) {
  const batch = writeBatch(db);
  
  const updatePlayerData = (p: Player, myScore: number, oppScore: number) => {
    const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
    const updated = { ...p };
    updated.goalsScored += myScore;
    updated.goalsConceded += oppScore;
    if (result === 'W') updated.win++;
    else if (result === 'L') updated.loss++;
    else updated.draw++;
    updated.form = [...(updated.form || []), result].slice(-5);
    updated.ovr = calculateOVR(updated.win, updated.loss, updated.draw, updated.goalsScored, updated.goalsConceded);
    return updated;
  };

  const updatedP1 = updatePlayerData(p1, p1Score, p2Score);
  batch.set(doc(db, 'players', p1.id), updatedP1);

  if (p2) {
    const updatedP2 = updatePlayerData(p2, p2Score, p1Score);
    batch.set(doc(db, 'players', p2.id), updatedP2);
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-match-update');
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
    const pointsA = a.win * 3 + a.draw;
    const pointsB = b.win * 3 + b.draw;
    if (pointsB !== pointsA) return pointsB - pointsA;
    if (b.win !== a.win) return b.win - a.win;
    const gdA = a.goalsScored - a.goalsConceded;
    const gdB = b.goalsScored - b.goalsConceded;
    if (gdB !== gdA) return gdB - gdA;
    const totalA = a.win + a.loss + a.draw || 1;
    const totalB = b.win + b.loss + b.draw || 1;
    const wrA = a.win / totalA;
    const wrB = b.win / totalB;
    if (wrB !== wrA) return wrB - wrA;
    return a.name.localeCompare(b.name);
  });
}

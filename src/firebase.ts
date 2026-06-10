import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Memory-only cache (no IndexedDB persistence)
// This prevents background reads from SDK cache sync
// Our localStorage caching handles persistence separately
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export const loginAnonymously = () => signInAnonymously(auth);

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

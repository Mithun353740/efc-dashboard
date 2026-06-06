import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Bounded persistent cache to prevent excessive reads from cache sync
// Limit: 10MB max cache size to reduce background reads
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: 10 * 1024 * 1024, // 10MB limit - reduces background sync reads
  }),
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

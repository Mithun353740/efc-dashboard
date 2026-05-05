import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Modern persistent multi-tab IndexedDB cache (replaces deprecated enableMultiTabIndexedDbPersistence).
// When quota is exceeded, the app falls back to the local on-device IndexedDB cache automatically.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
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

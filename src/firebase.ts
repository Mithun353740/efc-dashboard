import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use initializeFirestore with experimentalForceLongPolling to prevent connectivity issues in certain network environments
export const db = initializeFirestore(app, { experimentalForceLongPolling: false }, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence so when Quota is exceeded, it falls back to the local device cache
// enableMultiTabIndexedDbPersistence(db).catch((err) => {
//   if (err.code === 'failed-precondition') {
//     console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
//   } else if (err.code === 'unimplemented') {
//     console.warn("The current browser does not support all of the features required to enable persistence.");
//   }
// });

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

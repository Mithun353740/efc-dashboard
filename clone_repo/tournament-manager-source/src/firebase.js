import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  "projectId": "gen-lang-client-0833655128",
  "appId": "1:681326869225:web:cada6ac531e1ded3b1ce78",
  "apiKey": "AIzaSyAWyge6N-FseAcfTDNUN5P51j88PYQW-ms",
  "authDomain": "gen-lang-client-0833655128.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-cb688270-9194-4388-8b0d-99a18b09beb1",
  "storageBucket": "gen-lang-client-0833655128.firebasestorage.app",
  "messagingSenderId": "681326869225",
  "measurementId": ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId);

// Listen for auth state rather than forcing anonymous login
const authPromise = new Promise((resolve, reject) => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("[KickOff] Auth state resolved:", user.uid, user.isAnonymous ? "(Anonymous)" : "(Authenticated)");
      resolve(user);
    } else {
      // Only sign in anonymously if there's no parent auth state
      signInAnonymously(auth)
        .then(u => {
          console.log("[KickOff] Anonymous auth fallback success:", u.user.uid);
          resolve(u);
        })
        .catch(err => {
          console.error("Anonymous auth fallback failed:", err);
          reject(err);
        });
    }
  });
});

export { db, auth, authPromise };

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log("Fetching clubs...");
    const snap = await getDocs(collection(db, 'clubs'));
    console.log("Clubs found:", snap.size);
    
    console.log("Fetching clubConfig...");
    const configSnap = await getDoc(doc(db, 'settings', 'clubConfig'));
    console.log("Config exists:", configSnap.exists());
    
    console.log("Fetching locks...");
    const lockSnap = await getDoc(doc(db, 'settings', 'locks'));
    console.log("Locks exists:", lockSnap.exists(), lockSnap.data());
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

test();

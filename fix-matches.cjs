import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, query, where } from 'firebase/firestore';
import fs from 'fs';

const rawConfig = fs.readFileSync('./src/firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(rawConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function fixFriendlyMatches() {
  const matchesRef = collection(db, 'matches');
  const q = query(matchesRef, where('tournament', '==', 'Friendly'));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('No Friendly matches found to fix.');
    process.exit(0);
  }

  const batch = writeBatch(db);
  let count = 0;
  snapshot.forEach(document => {
    batch.update(document.ref, { tournament: 'QVFC Elite League Cup' });
    count++;
  });

  await batch.commit();
  console.log(`Updated ${count} matches from 'Friendly' to 'QVFC Elite League Cup'.`);
  process.exit(0);
}

fixFriendlyMatches();

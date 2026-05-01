/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EliteRankings from './components/EliteRankings';
import Leadership from './components/Leadership';
import Legion from './components/Legion';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Rankings from './components/Rankings';
import PlayerStats from './components/PlayerStats';
import Login from './components/Login';
import { NativeTournamentPage } from './components/tournament/NativeTournamentPage';
import AutoUpdater from './components/AutoUpdater';
import { FirebaseProvider, useFirebase } from './FirebaseContext';
import { INITIAL_PLAYERS } from './lib/store';
import ClubManager from './components/ClubManager';
import firebaseConfig from '../firebase-applet-config.json';

function Home() {
  const { rankedPlayers, dbError, isLoading } = useFirebase();

  // Safety: If we are not loading but have no players, something is wrong or empty
  if (!isLoading && rankedPlayers.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-slate-500 uppercase tracking-widest">NO DATA DETECTED</h2>
        <p className="text-sm text-slate-400 mt-2">Please visit the Control Center to sync or seed the system.</p>
      </div>
    );
  }

  const heroPlayer = rankedPlayers.length > 0 ? rankedPlayers[0] : null;

  return (
    <>
      {heroPlayer && <Hero player={heroPlayer} />}
      <EliteRankings />
      <Leadership />
      <Legion />
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { isLoading, dbError, rankedPlayers, matches, leaders } = useFirebase();

  if (isLoading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="text-brand-purple font-black animate-pulse tracking-widest">INITIALIZING VORTEX ENGINE...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark transition-colors flex flex-col">
      {dbError && (
        <div className="bg-rose-600 text-white px-4 py-2 text-[10px] font-black tracking-widest text-center uppercase z-[100] flex items-center justify-center gap-4">
          <span>⚠️ {dbError === 'QUOTA_EXCEEDED' ? 'SYSTEM LOCKED: FIRESTORE QUOTA EXCEEDED' : 'DATABASE OFFLINE: CONNECTION INTERRUPTED'}</span>
          <button onClick={() => window.location.reload()} className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-all">RETRY</button>
        </div>
      )}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/stats" element={<PlayerStats />} />
          <Route path="/tournament" element={<NativeTournamentPage forcePublic={true} />} />
          <Route path="/club" element={<ClubManager />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <AppContent />
      </Router>
    </FirebaseProvider>
  );
}



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

function Home() {
  const { rankedPlayers, dbError } = useFirebase();

  const heroPlayer = rankedPlayers.length > 0 ? rankedPlayers[0] : INITIAL_PLAYERS[0];

  return (
    <>
      <Hero player={heroPlayer} />
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
  const { isLoading, dbError } = useFirebase();

  if (isLoading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="text-brand-purple font-black animate-pulse tracking-widest">INITIALIZING VORTEX ENGINE...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark transition-colors flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/stats" element={<PlayerStats />} />
          <Route path="/tournament" element={<NativeTournamentPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AutoUpdater />
      <Router>
        <AppContent />
      </Router>
    </FirebaseProvider>
  );
}



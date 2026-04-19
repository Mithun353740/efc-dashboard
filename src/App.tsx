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
import Tournament from './components/Tournament';
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
      <div className="text-brand-green font-black animate-pulse tracking-widest">INITIALIZING VORTEX ENGINE...</div>
    </div>
  );

  if (dbError) return (
    <div className="pt-32 pb-20 px-4 md:px-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-rose-500 tracking-tighter mb-4 uppercase">SYSTEM OVERLOAD</h1>
      <p className="text-slate-500 font-bold tracking-widest uppercase mb-8 max-w-lg">The engine has reached its maximum daily processing capacity. Data sync is temporarily locked.</p>
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl max-w-md w-full">
        <p className="text-sm font-bold text-brand-dark dark:text-slate-300 mb-2">WHEN DOES THIS RESET?</p>
        <p className="text-xs text-slate-500 font-medium">The Google Firebase free tier quota resets automatically at exactly <strong>12:00 AM (Midnight) Pacific Time</strong> (approx 1:00 PM BST). All stats and players are perfectly safe and will automatically reappear at that time.</p>
      </div>
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
          <Route path="/tournament" element={<Tournament />} />
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



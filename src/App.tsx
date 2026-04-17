/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function Home() {
  const { rankedPlayers, isLoading } = useFirebase();
  
  if (isLoading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="text-brand-green font-black animate-pulse tracking-widest">INITIALIZING VORTEX ENGINE...</div>
    </div>
  );

  if (rankedPlayers.length === 0) return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
      <div className="text-brand-green font-black animate-pulse tracking-widest mb-4">SYNCING ENGINE...</div>
      <p className="text-slate-500 text-xs tracking-widest font-bold">AWAITING ROSTER DATA</p>
    </div>
  );
  
  return (
    <>
      <Hero player={rankedPlayers[0]} />
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

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
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
      </Router>
    </FirebaseProvider>
  );
}



/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { CLUB_LOGO, CLUB_NAME } from './constants';

function Home() {
  const { rankedPlayers, dbError, isLoading } = useFirebase();
  // Grace period: don't show NO DATA DETECTED for 4s after isLoading flips false
  // (the 1200ms branding timer can fire before the Firestore fetch completes)
  const [grace, setGrace] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setGrace(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!isLoading && rankedPlayers.length === 0 && grace) {
    // Still within grace window — show a subtle spinner instead of NO DATA
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-1 bg-brand-purple/40 rounded-full animate-bounce"
              style={{ height: 20 + (i % 3) * 8 + 'px', animationDelay: i * 0.1 + 's' }} />
          ))}
        </div>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Loading data...</p>
      </div>
    );
  }

  if (!isLoading && rankedPlayers.length === 0 && !grace) {
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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      setIsAuthorized(true);
      return;
    }

    const playerLoggedIn = localStorage.getItem('playerLoggedIn') === 'true';
    const playerId = localStorage.getItem('playerId');
    if (!playerLoggedIn || !playerId) {
      setIsAuthorized(false);
      return;
    }

    // Verify against LIVE database for player admins
    import('./firebase').then(({ db }) => {
      import('firebase/firestore').then(({ doc, getDoc }) => {
        getDoc(doc(db, 'players', playerId)).then(snap => {
          if (snap.exists() && snap.data().role === 'admin') {
            setIsAuthorized(true);
          } else {
            // Revoked or not an admin!
            const realRole = snap.data()?.role || 'player';
            localStorage.setItem('playerRole', realRole);
            localStorage.setItem('userType', 'player');
            window.dispatchEvent(new StorageEvent('storage', { key: 'playerRole', newValue: realRole }));
            setIsAuthorized(false);
          }
        }).catch(() => setIsAuthorized(false));
      });
    });
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verifying Authorization...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { isLoading, dbError, rankedPlayers, matches, leaders } = useFirebase();

  if (isLoading) return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-8">
      {/* Club logo with pulsing ring */}
      <div className="relative">
        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border border-brand-purple/40 shadow-2xl shadow-brand-purple/30">
          <img src={CLUB_LOGO} alt={CLUB_NAME} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -inset-2 rounded-[2rem] border border-brand-purple/30 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>

      {/* Animated frequency bars */}
      <div className="flex items-end gap-1.5">
        {[14, 22, 18, 28, 20, 16, 26, 12, 24, 18].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-brand-purple rounded-full animate-bounce"
            style={{ height: h + 'px', animationDelay: i * 0.08 + 's', animationDuration: '0.8s' }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-brand-purple font-black tracking-[0.35em] text-xs uppercase">
          INITIALIZING VORTEX ENGINE
        </p>
        <p className="text-slate-600 font-bold text-[10px] tracking-widest uppercase">
          Loading match data &amp; player rankings...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark transition-colors flex flex-col overflow-x-hidden">
      {dbError === 'QUOTA_EXCEEDED' && (
        <div className="bg-rose-600 text-white px-4 py-2 text-[10px] font-black tracking-widest text-center uppercase z-[100] flex items-center justify-center gap-4">
          <span>⚠️ SYSTEM LOCKED: FIRESTORE QUOTA EXCEEDED</span>
          <button onClick={() => window.location.reload()} className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-all">RETRY</button>
        </div>
      )}
      <AutoUpdater />
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



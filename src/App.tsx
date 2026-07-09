/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EliteRankings from './components/EliteRankings';
import Leadership from './components/Leadership';
import Legion from './components/Legion';
import Footer from './components/Footer';
import AutoUpdater from './components/AutoUpdater';
import HomeNews from './components/HomeNews';
import LiveMatchWidget from './components/LiveMatchWidget';
import StatsDashboard from './components/StatsDashboard';
import { FirebaseProvider, useFirebase } from './FirebaseContext';
import { CLUB_LOGO, CLUB_NAME } from './constants';

// ── Lazy-loaded route components ────────────────────────────────────────────
// These are NOT bundled into the initial JS payload — they only download
// when the user navigates to that route for the first time.
// AdminProduction is optimized for 50k daily read budget
const Admin       = lazy(() => import('./components/AdminProduction'));
const Rankings    = lazy(() => import('./components/Rankings'));
const PlayerStats = lazy(() => import('./components/PlayerStats'));
const Login       = lazy(() => import('./components/Login'));
const ClubManager = lazy(() => import('./components/ClubManager'));
const NativeTournamentPage = lazy(() =>
  import('./components/tournament/NativeTournamentPage').then(m => ({ default: m.NativeTournamentPage }))
);

// Lightweight spinner shown while a lazy chunk is downloading
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="flex items-end gap-1.5">
        {[14, 22, 18, 28, 20, 16, 26, 12, 24, 18].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-brand-purple rounded-full animate-bounce"
            style={{ height: h + 'px', animationDelay: i * 0.08 + 's', animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Loading…</p>
    </div>
  );
}

function Home() {
  const { rankedPlayers, appSettings } = useFirebase();
  
  // Show homepage INSTANTLY if we have cached data - no waiting!
  const heroPlayer = rankedPlayers.length > 0 ? rankedPlayers[0] : null;
  
  // Announcement banner
  const showAnnouncement = appSettings?.announcements?.enabled && appSettings?.announcements?.message;
  
  if (heroPlayer) {
    // We have data - show homepage immediately!
    return (
      <>
        {/* Announcement Banner */}
        {showAnnouncement && (
          <div className={`px-4 py-2 text-center text-xs font-black tracking-widest uppercase ${
            appSettings?.announcements?.type === 'error' ? 'bg-rose-500 text-white' :
            appSettings?.announcements?.type === 'warning' ? 'bg-amber-500 text-white' :
            appSettings?.announcements?.type === 'success' ? 'bg-emerald-500 text-white' :
            'bg-brand-purple text-white'
          }`}>
            {appSettings?.announcements?.message}
          </div>
        )}
        <Hero player={heroPlayer} />
        <LiveMatchWidget />
        <HomeNews />
        <StatsDashboard />
        <EliteRankings />
        <Leadership />
        <Legion />
      </>
    );
  }
  
  // Show basic structure without player data
  return (
    <div className="pt-16">
      {showAnnouncement && (
        <div className={`px-4 py-2 text-center text-xs font-black tracking-widest uppercase ${
          appSettings?.announcements?.type === 'error' ? 'bg-rose-500 text-white' :
          appSettings?.announcements?.type === 'warning' ? 'bg-amber-500 text-white' :
          appSettings?.announcements?.type === 'success' ? 'bg-emerald-500 text-white' :
          'bg-brand-purple text-white'
        }`}>
          {appSettings?.announcements?.message}
        </div>
      )}
      <LiveMatchWidget />
      <HomeNews />
      <StatsDashboard />
    </div>
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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/stats" element={<PlayerStats />} />
            <Route path="/tournament" element={<NativeTournamentPage forcePublic={true} />} />
            <Route path="/club" element={<ClubManager />} />
          </Routes>
        </Suspense>
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



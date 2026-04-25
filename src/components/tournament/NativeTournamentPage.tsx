import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useFirebase } from '../../FirebaseContext';
import { TournamentList } from './TournamentList';
import { TournamentSetup } from './TournamentSetup';
import { TournamentDashboard } from './TournamentDashboard';
import { Tournament } from '../../types';

type View = 'list' | 'setup' | 'dashboard';

interface NativeTournamentPageProps {
  forcePublic?: boolean;
}

export function NativeTournamentPage({ forcePublic = false }: NativeTournamentPageProps = {}) {
  const { systemLocks, tournaments } = useFirebase();
  const isAdmin = forcePublic ? false : localStorage.getItem('adminLoggedIn') === 'true';
  const isLocked = systemLocks?.tournaments && !isAdmin;

  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTournament: Tournament | undefined = tournaments.find(t => t.id === selectedId);

  const handleSelectTournament = (id: string) => {
    setSelectedId(id);
    setView('dashboard');
  };

  const handleNewTournament = () => setView('setup');

  const handleSetupComplete = (id: string) => {
    setSelectedId(id);
    setView('dashboard');
  };

  const handleBack = () => {
    setSelectedId(null);
    setView('list');
  };

  const handleDeleted = () => {
    setSelectedId(null);
    setView('list');
  };

  // System locked screen
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-4 text-white uppercase">System Locked</h2>
        <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed uppercase tracking-tight text-sm">
          The Tournaments System is currently undergoing maintenance.
          Please check back later once the system is unlocked by an administrator.
        </p>
        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm w-full">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Status</p>
          <div className="flex items-center justify-center gap-2 text-red-500">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Maintenance Mode Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'list' && (
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <TournamentList
            onSelectTournament={handleSelectTournament}
            onNewTournament={isAdmin ? handleNewTournament : undefined}
            isAdmin={isAdmin}
          />
        </motion.div>
      )}

      {view === 'setup' && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <TournamentSetup
            onComplete={handleSetupComplete}
            onCancel={handleBack}
          />
        </motion.div>
      )}

      {view === 'dashboard' && selectedTournament && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <TournamentDashboard
            tournament={selectedTournament}
            isAdmin={isAdmin}
            onBack={handleBack}
            onDeleted={handleDeleted}
          />
        </motion.div>
      )}

      {/* Fallback: if dashboard is selected but tournament not found yet (loading) */}
      {view === 'dashboard' && !selectedTournament && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#050508] flex items-center justify-center"
        >
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

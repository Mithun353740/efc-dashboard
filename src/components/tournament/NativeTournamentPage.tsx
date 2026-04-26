import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { useFirebase } from '../../FirebaseContext';
import { TournamentList } from './TournamentList';
import { TournamentSetup } from './TournamentSetup';
import { TournamentDashboard } from './TournamentDashboard';
import TournamentRanking from '../TournamentRanking';
import TournamentHistory from '../TournamentHistory';
import { Tournament } from '../../types';
import { cn } from '../../lib/utils';
import { registerPlayerInTournament } from '../../lib/store';

type View = 'list' | 'setup' | 'dashboard';

interface NativeTournamentPageProps {
  forcePublic?: boolean;
}

export function NativeTournamentPage({ forcePublic = false }: NativeTournamentPageProps = {}) {
  const { systemLocks, tournaments } = useFirebase();
  const isAdmin = forcePublic ? false : localStorage.getItem('adminLoggedIn') === 'true';
  const isLocked = systemLocks?.tournaments && !isAdmin;

  // Registration lock: defaults to locked (true) if undefined in Firestore
  const isRegistrationLocked = systemLocks?.tournamentRegistration !== false;

  const loggedInPlayerId = localStorage.getItem('playerId');
  const loggedInPlayerName = localStorage.getItem('playerName') || '';
  const loggedInPlayerImage = localStorage.getItem('playerImage') || '';

  const [view, setView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState<'live' | 'rankings' | 'history'>('live');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Registration modal state
  const [regModal, setRegModal] = useState<{ tournament: Tournament } | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

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

  // Open registration confirmation modal
  const handleRegisterClick = (tournament: Tournament, e: React.MouseEvent) => {
    e.stopPropagation();
    setRegError('');
    setRegModal({ tournament });
  };

  // Confirm registration
  const handleConfirmRegister = async () => {
    if (!regModal || !loggedInPlayerId) return;
    setRegLoading(true);
    setRegError('');
    try {
      await registerPlayerInTournament(
        regModal.tournament,
        loggedInPlayerId,
        loggedInPlayerName,
        loggedInPlayerImage
      );
      setRegModal(null);
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
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
    <div className="relative min-h-screen bg-[#050508]">
      {view === 'list' && (
        <div className="sticky top-0 z-[40] bg-[#050508]/80 backdrop-blur-md border-b border-white/5 py-4 px-4 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('live')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeTab === 'live' ? "bg-brand-purple text-brand-dark shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white")}>Live Tournaments</button>
          <button onClick={() => setActiveTab('rankings')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeTab === 'rankings' ? "bg-brand-purple text-brand-dark shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white")}>Standings</button>
          <button onClick={() => setActiveTab('history')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeTab === 'history' ? "bg-brand-purple text-brand-dark shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white")}>History</button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'list' && activeTab === 'live' && (
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
              isRegistrationLocked={isRegistrationLocked}
              loggedInPlayerId={loggedInPlayerId}
              onRegister={handleRegisterClick}
            />
          </motion.div>
        )}

        {view === 'list' && activeTab === 'rankings' && (
          <motion.div key="rankings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <TournamentRanking />
          </motion.div>
        )}

        {view === 'list' && activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <TournamentHistory onOpenTournament={handleSelectTournament} />
          </motion.div>
        )}

        {view === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
            <TournamentSetup onComplete={handleSetupComplete} onCancel={handleBack} />
          </motion.div>
        )}

        {view === 'dashboard' && selectedTournament && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <TournamentDashboard
              tournament={selectedTournament}
              isAdmin={isAdmin}
              onBack={handleBack}
              onDeleted={handleDeleted}
            />
          </motion.div>
        )}

        {view === 'dashboard' && !selectedTournament && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#050508] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Tournament Registration Confirmation Modal ─── */}
      <AnimatePresence>
        {regModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!regLoading) setRegModal(null); }}
              className="absolute inset-0 bg-[#050508]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              className="relative w-full max-w-md bg-[#0a0a12] border border-[#1e1e32] rounded-[2.5rem] p-10 shadow-3xl text-center overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 blur-[100px] -z-10" />

              {/* Close */}
              <button
                onClick={() => setRegModal(null)}
                disabled={regLoading}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Icon */}
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <AlertTriangle size={38} />
              </div>

              <h3 className="text-2xl font-black tracking-tighter uppercase text-white mb-2">
                Register for Tournament?
              </h3>
              <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-6">
                {regModal.tournament.name}
              </p>
              <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8 uppercase tracking-tight">
                You will be added to the tournament roster as a competing team.{' '}
                <span className="text-white">This cannot be undone without contacting an admin.</span>
              </p>

              {regError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest">
                  {regError}
                </div>
              )}

              {/* Slots info */}
              {regModal.tournament.maxTeams !== undefined && (
                <div className="mb-6 flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span className="text-indigo-400">{regModal.tournament.teams.length}</span>
                  <span>/</span>
                  <span>{regModal.tournament.maxTeams}</span>
                  <span>Slots Filled</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmRegister}
                  disabled={regLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 uppercase"
                >
                  {regLoading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                </button>
                <button
                  onClick={() => setRegModal(null)}
                  disabled={regLoading}
                  className="w-full py-3 bg-white/5 text-slate-400 font-black text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all uppercase"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

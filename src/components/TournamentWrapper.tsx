import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, BarChart3, ShieldAlert, History } from 'lucide-react';
import TournamentManager from './TournamentManager';
import TournamentRanking from './TournamentRanking';
import TournamentHistory from './TournamentHistory';
import { cn } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';

type View = 'manager' | 'ranking' | 'history';

interface TournamentWrapperProps {
  isEmbedded?: boolean;
}

export default function TournamentWrapper({ isEmbedded = false }: TournamentWrapperProps) {
  const { systemLocks } = useFirebase();
  const [activeView, setActiveView] = useState<View>('manager');
  const [activeTournamentId, setActiveTournamentId] = useState<string | undefined>(undefined);
  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  const isLocked = systemLocks?.tournaments && !isAdmin;

  return (
    <div className={cn("flex flex-col", !isEmbedded && "min-h-screen bg-brand-dark")}>
      {/* Sub Navigation */}
      <div className={cn(
        "bg-white/5 border-b border-white/10 px-8 flex items-center justify-center gap-4 py-3 z-40 backdrop-blur-xl",
        isEmbedded ? "sticky top-0" : "sticky top-[64px]"
      )}>
        <button
          onClick={() => { setActiveView('manager'); setActiveTournamentId(undefined); }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
            activeView === 'manager' 
              ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/25" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Trophy size={14} />
          Tournaments
        </button>
        <button
          onClick={() => setActiveView('ranking')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
            activeView === 'ranking' 
              ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/25" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <BarChart3 size={14} />
          Tournament Ranking
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
            activeView === 'history' 
              ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/25" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <History size={14} />
          History
        </button>
      </div>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
                <ShieldAlert size={48} />
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">System Locked</h2>
              <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed uppercase tracking-tight text-sm">
                The Tournaments System is currently undergoing maintenance. 
                Please check back later once the system is unlocked by an administrator.
              </p>
              <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm w-full backdrop-blur-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Status</p>
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Maintenance Mode Active</span>
                </div>
              </div>
            </motion.div>
          ) : activeView === 'manager' ? (
            <motion.div
              key="manager"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <TournamentManager isControlCenter={isAdmin} tournamentId={activeTournamentId} />
            </motion.div>
          ) : activeView === 'ranking' ? (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <TournamentRanking />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <TournamentHistory onOpenTournament={(id) => {
                setActiveTournamentId(id);
                setActiveView('manager');
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

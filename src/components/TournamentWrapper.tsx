import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, BarChart3 } from 'lucide-react';
import TournamentManager from './TournamentManager';
import TournamentRanking from './TournamentRanking';
import { cn } from '../lib/utils';

type View = 'manager' | 'ranking';

export default function TournamentWrapper() {
  const [activeView, setActiveView] = useState<View>('manager');

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Sub Navigation */}
      <div className="bg-white/5 border-b border-white/10 px-8 flex items-center justify-center gap-4 py-3 sticky top-[64px] z-40 backdrop-blur-xl">
        <button
          onClick={() => setActiveView('manager')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
            activeView === 'manager' 
              ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/25" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Trophy size={14} />
          Tournament System
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
      </div>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeView === 'manager' ? (
            <motion.div
              key="manager"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <TournamentManager />
            </motion.div>
          ) : (
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
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

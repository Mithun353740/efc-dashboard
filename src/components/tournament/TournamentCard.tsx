import React from 'react';
import { Tournament } from '../../types';
import { Trophy, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: (id: string) => void;
  isAdmin?: boolean;
}

export function TournamentCard({ tournament, onClick, isAdmin }: TournamentCardProps) {
  const fixtures = tournament.fixtures || [];
  const played = fixtures.filter(m => m.status === 'completed').length;
  const total = fixtures.length;
  const progress = total > 0 ? (played / total) * 100 : 0;

  let statusBg, statusText;
  if (tournament.archived) {
    statusText = 'Archived';
    statusBg = 'bg-[#0a0a12] text-slate-500 border-[#1e1e32]';
  } else if (played === total && total > 0) {
    statusText = 'Completed';
    statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (played > 0) {
    statusText = 'Live';
    statusBg = 'bg-blue-500/10 text-blue-400 border-blue-500/25';
  } else {
    statusText = 'Upcoming';
    statusBg = 'bg-[#0a0a12] text-slate-500 border-[#1e1e32]';
  }

  const formatLabels: Record<string, string> = {
    round_robin: 'Round Robin',
    knockout: 'Knockout',
    league: 'Full League',
    groups: 'Group + KO'
  };

  const getIcon = () => {
    switch (tournament.type) {
      case 'knockout': return <Trophy className="w-8 h-8 opacity-80" />;
      case 'groups': return <Users className="w-8 h-8 opacity-80" />;
      default: return <Shield className="w-8 h-8 opacity-80" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tournament.id)}
      className="rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-[#1e1e32] transition-colors hover:border-indigo-500/30"
      style={{ background: '#0a0a12' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex justify-between items-start">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#050508] border border-[#1e1e32] text-blue-400 overflow-hidden shadow-inner">
            {tournament.logo ? (
              <img src={tournament.logo} alt={tournament.name} className="w-full h-full object-cover" />
            ) : (
              getIcon()
            )}
          </div>
          <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusBg}`}>
            {statusText}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-200 tracking-tight mb-2 line-clamp-1">{tournament.name}</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              {formatLabels[tournament.type] || tournament.type}
            </span>
            <span>•</span>
            <span>{tournament.teams?.length || 0} Teams</span>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Progress</span>
            <span className="text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[#050508] rounded-full overflow-hidden border border-[#1e1e32]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

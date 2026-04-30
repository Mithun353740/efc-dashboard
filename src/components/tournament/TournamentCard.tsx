import React from 'react';
import { Tournament } from '../../types';
import { Trophy, Shield, Users, Lock, CalendarDays, UserCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: (id: string) => void;
  isAdmin?: boolean;
  isRegistrationLocked?: boolean;
  isRegistered?: boolean;
  isFull?: boolean;
  loggedInPlayerId?: string | null;
  onRegister?: (tournament: Tournament, e: React.MouseEvent) => void;
}

/** Format a ISO date string like "2026-05-10" into a human label */
function formatStartDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays <= 0) return label;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return label;
}

export function TournamentCard({
  tournament,
  onClick,
  isAdmin,
  isRegistrationLocked,
  isRegistered,
  isFull,
  loggedInPlayerId,
  onRegister,
}: TournamentCardProps) {
  const fixtures = tournament.fixtures || [];
  const played = fixtures.filter(m => m.status === 'completed').length;
  const total = fixtures.length;
  const progress = total > 0 ? (played / total) * 100 : 0;

  const hasStartingDate = Boolean(tournament.startingDate);
  const isUpcoming = hasStartingDate && played === 0 && total > 0;

  let statusBg: string, statusText: string;
  if (tournament.archived) {
    statusText = 'Archived';
    statusBg = 'bg-[#0a0a12] text-slate-500 border-[#1e1e32]';
  } else if (played === total && total > 0) {
    statusText = 'Completed';
    statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (played > 0) {
    statusText = 'Live';
    statusBg = 'bg-blue-500/10 text-blue-400 border-blue-500/25';
  } else if (isUpcoming) {
    statusText = `Starts ${formatStartDate(tournament.startingDate!)}`;
    statusBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else {
    statusText = 'Upcoming';
    statusBg = 'bg-[#0a0a12] text-slate-500 border-[#1e1e32]';
  }

  const formatLabels: Record<string, string> = {
    round_robin: 'Round Robin',
    knockout: 'Knockout',
    league: 'Full League',
    groups: 'Group + KO',
  };

  const getIcon = () => {
    switch (tournament.type) {
      case 'knockout': return <Trophy className="w-8 h-8 opacity-80" />;
      case 'groups': return <Users className="w-8 h-8 opacity-80" />;
      default: return <Shield className="w-8 h-8 opacity-80" />;
    }
  };

  // Determine registration button state
  const isPlayerLoggedIn = Boolean(loggedInPlayerId);
  const showRegButton = isPlayerLoggedIn && !tournament.archived;
  const regButtonLabel = isRegistered ? 'VIEW →' : isFull ? 'FULL' : 'REGISTER';
  const regButtonStyle = isRegistered
    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
    : isFull
    ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
    : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tournament.id)}
      className="rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-[#1e1e32] transition-colors hover:border-indigo-500/30"
      style={{ background: '#0a0a12' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Registration Locked Overlay Badge */}
      {isRegistrationLocked && isPlayerLoggedIn && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Lock size={9} className="text-amber-400" />
          <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Registration Locked</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        {/* Top row: Icon + Status */}
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

        {/* Name + Type */}
        <div>
          <h3 className="text-xl font-black text-slate-200 tracking-tight mb-2 line-clamp-1">{tournament.name}</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              {formatLabels[tournament.type] || tournament.type}
            </span>
            <span>•</span>
            <span>{tournament.teams?.length || 0} Teams</span>
            {tournament.maxTeams && (
              <>
                <span>•</span>
                <span className="text-slate-600">Max {tournament.maxTeams}</span>
              </>
            )}
          </div>
          {hasStartingDate && (
            <div className="flex items-center gap-1.5 mt-2">
              <CalendarDays size={10} className="text-indigo-400/70" />
              <span className="text-[9px] font-black text-indigo-400/70 uppercase tracking-widest">
                {new Date(tournament.startingDate! + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Progress</span>
            <span className="text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[#050508] rounded-full overflow-hidden border border-[#1e1e32]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>

        {/* Registration / View button row */}
        {showRegButton && (
          <div
            className="flex gap-2"
            onClick={e => e.stopPropagation()}
          >
            {isRegistrationLocked ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <Lock size={10} />
                Registration Closed
              </div>
            ) : (
              <button
                disabled={isFull && !isRegistered}
                onClick={e => {
                  if (isRegistered) { onClick(tournament.id); }
                  else if (onRegister && !isFull) { onRegister(tournament, e); }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${regButtonStyle}`}
              >
                {isRegistered ? (
                  <><CheckCircle size={11} /> {regButtonLabel}</>
                ) : isFull ? (
                  <><Users size={11} /> {regButtonLabel}</>
                ) : (
                  <><UserCheck size={11} /> {regButtonLabel}</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

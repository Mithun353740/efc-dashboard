import React from 'react';
import { Tournament } from '../../types';
import {
  Trophy, Shield, Users, Lock, CalendarDays,
  UserCheck, CheckCircle, Zap, Clock,
} from 'lucide-react';
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

function formatStartDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays <= 0) return label;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays}d`;
  return label;
}

const FORMAT_LABELS: Record<string, string> = {
  round_robin: 'Round Robin',
  knockout: 'Knockout',
  league: 'League',
  groups: 'Group + KO',
};

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

  // ── Status badge ──
  let statusBg: string, statusText: string, statusDot: string;
  if (tournament.archived) {
    statusText = 'Archived'; statusBg = 'bg-white/5 text-slate-500 border-white/5'; statusDot = 'bg-slate-600';
  } else if (played === total && total > 0) {
    statusText = 'Completed'; statusBg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'; statusDot = 'bg-emerald-400';
  } else if (played > 0) {
    statusText = 'Live'; statusBg = 'bg-blue-500/15 text-blue-400 border-blue-500/20'; statusDot = 'bg-blue-400';
  } else if (isUpcoming) {
    statusText = `Starts ${formatStartDate(tournament.startingDate!)}`; statusBg = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'; statusDot = 'bg-indigo-400';
  } else {
    statusText = 'Upcoming'; statusBg = 'bg-white/5 text-slate-400 border-white/5'; statusDot = 'bg-slate-500';
  }

  // ── Tournament type icon + accent color ──
  const getAccent = () => {
    switch (tournament.type) {
      case 'knockout': return { icon: <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'groups':   return { icon: <Users  className="w-6 h-6 sm:w-7 sm:h-7" />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
      case 'league':   return { icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7" />, color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'  };
      default:         return { icon: <Zap    className="w-6 h-6 sm:w-7 sm:h-7" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
    }
  };
  const accent = getAccent();

  // ── Registration button ──
  const isPlayerLoggedIn = Boolean(loggedInPlayerId);
  const showRegButton = isPlayerLoggedIn && !tournament.archived && !isAdmin;

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(tournament.id)}
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-[#1e1e32] bg-[#0a0a12] transition-colors hover:border-indigo-500/25 active:border-indigo-500/40 group"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Registration locked badge — top-left */}
      {isRegistrationLocked && isPlayerLoggedIn && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Lock size={8} className="text-amber-400" />
          <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Reg. Closed</span>
        </div>
      )}

      <div className="relative z-10 p-4 sm:p-5 flex flex-col gap-4">

        {/* ── Top row: icon + status ── */}
        <div className="flex items-start justify-between gap-3">
          {/* Type icon box */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border ${accent.bg} ${accent.border} ${accent.color} overflow-hidden`}>
            {tournament.logo ? (
              <img src={tournament.logo} alt={tournament.name} className="w-full h-full object-cover" />
            ) : (
              accent.icon
            )}
          </div>

          {/* Status pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot} ${played > 0 && played < total ? 'animate-pulse' : ''}`} />
            {statusText}
          </div>
        </div>

        {/* ── Name + meta ── */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-2">
            {tournament.name}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className={`flex items-center gap-1 ${accent.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {FORMAT_LABELS[tournament.type] || tournament.type}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users size={9} />
              {tournament.teams?.length || 0} Teams
            </span>
            {tournament.maxTeams && (
              <>
                <span>·</span>
                <span>Max {tournament.maxTeams}</span>
              </>
            )}
          </div>

          {/* Date */}
          {hasStartingDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays size={9} className="text-indigo-400/60" />
              <span className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest">
                {new Date(tournament.startingDate! + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock size={9} />
              <span>Progress</span>
            </div>
            <span className={total > 0 ? accent.color : 'text-slate-600'}>
              {total > 0 ? `${played}/${total}` : '—'}
            </span>
          </div>
          <div className="h-1 bg-[#050508] rounded-full overflow-hidden border border-[#1e1e32]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>

        {/* ── Registration CTA ── */}
        {showRegButton && (
          <div onClick={e => e.stopPropagation()}>
            {isRegistrationLocked ? (
              <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/4 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                <Lock size={9} />
                Registration Closed
              </div>
            ) : (
              <button
                disabled={isFull && !isRegistered}
                onClick={e => {
                  if (isRegistered) { onClick(tournament.id); }
                  else if (onRegister && !isFull) { onRegister(tournament, e); }
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  isRegistered
                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
                    : isFull
                    ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30'
                }`}
              >
                {isRegistered ? (
                  <><CheckCircle size={10} /> Registered · View</>
                ) : isFull ? (
                  <><Users size={10} /> Full</>
                ) : (
                  <><UserCheck size={10} /> Register Now</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import React from 'react';
import { useFirebase } from '../../FirebaseContext';
import { CLUB_LOGO } from '../../constants';
import { TournamentCard } from './TournamentCard';
import { Plus, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tournament } from '../../types';

interface TournamentListProps {
  onSelectTournament: (id: string) => void;
  onNewTournament?: () => void;
  isAdmin?: boolean;
  isRegistrationLocked?: boolean;
  loggedInPlayerId?: string | null;
  onRegister?: (tournament: Tournament, e: React.MouseEvent) => void;
}

export function TournamentList({
  onSelectTournament,
  onNewTournament,
  isAdmin,
  isRegistrationLocked,
  loggedInPlayerId,
  onRegister,
}: TournamentListProps) {
  const { tournaments } = useFirebase();

  const activeTournaments = tournaments.filter(t => !t.archived);
  const archivedTournaments = tournaments.filter(t => t.archived);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508]">
      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] right-0 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 -left-[10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-indigo-600/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-10 md:pt-12 md:pb-14">

          {/* Admin badge */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-blue-500/20 bg-blue-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse" />
              Command Center Active
            </motion.div>
          )}

          <div className="flex items-center justify-between gap-4">
            {/* Left: logo + title */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 sm:gap-5 min-w-0"
            >
              {/* Logo — tight on mobile */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 rounded-2xl overflow-hidden bg-[#0a0a12] border border-blue-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(59,130,246,0.4)]">
                {CLUB_LOGO ? (
                  <img src={CLUB_LOGO} alt="Tournaments" className="w-full h-full object-cover" />
                ) : (
                  <Trophy className="text-blue-400" size={22} />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 leading-none">
                  {isAdmin ? 'Your Tournaments' : 'Official Tournaments'}
                </h1>
                <p className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase text-slate-500 mt-1.5">
                  {isAdmin ? 'Manage multiple disciplines' : 'Live Competition Center'}
                </p>
              </div>
            </motion.div>

            {/* New tournament CTA */}
            {isAdmin && onNewTournament && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onNewTournament}
                className="shrink-0 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_6px_24px_rgba(59,130,246,0.35)] text-white font-black text-[10px] sm:text-xs uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Tournament</span>
                <span className="sm:hidden">New</span>
              </motion.button>
            )}
          </div>

          {/* Stats strip */}
          {activeTournaments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-4 mt-6 flex-wrap"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <Zap className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {activeTournaments.length} Active
                </span>
              </div>
              {archivedTournaments.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                  <Trophy className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {archivedTournaments.length} Archived
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ── Tournament Grid ─────────────────────────────────────────────── */}
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 pb-16">
          {activeTournaments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[2rem] p-12 sm:p-20 text-center space-y-4 border border-dashed border-[#1e1e32] bg-[#0f0f1a]/50"
            >
              <Trophy className="w-12 h-12 text-slate-700 mx-auto" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-400 tracking-tight">No Active Tournaments</h2>
              <p className="text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
                {isAdmin
                  ? "Tap 'New' to create your first competition."
                  : 'Check back later for new competitions.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {activeTournaments.map((t, i) => {
                const isRegistered = loggedInPlayerId
                  ? (t.registeredPlayerIds || []).includes(loggedInPlayerId)
                  : false;
                const isFull = t.maxTeams !== undefined && t.teams.length >= t.maxTeams;
                const matchDayStarted = t.matchDayStart
                  ? Date.now() >= new Date(t.matchDayStart).getTime()
                  : false;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <TournamentCard
                      tournament={t}
                      onClick={onSelectTournament}
                      isAdmin={isAdmin}
                      isRegistrationLocked={isRegistrationLocked || matchDayStarted}
                      isRegistered={isRegistered}
                      isFull={isFull && !isRegistered}
                      loggedInPlayerId={loggedInPlayerId}
                      onRegister={onRegister}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Archived section */}
          {archivedTournaments.length > 0 && (
            <section className="pt-12 mt-12 border-t border-[#1e1e32]">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 flex items-center gap-4">
                <span>Archived History</span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#1e1e32] to-transparent" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
                {archivedTournaments.map(t => (
                <React.Fragment key={t.id}>
                  <TournamentCard
                    tournament={t}
                    onClick={onSelectTournament}
                    isAdmin={isAdmin}
                  />
                </React.Fragment>
              ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

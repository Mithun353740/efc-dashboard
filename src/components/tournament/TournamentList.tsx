import React from 'react';
import { useFirebase } from '../../FirebaseContext';
import { TournamentCard } from './TournamentCard';
import { Plus, Trophy } from 'lucide-react';
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
    <div className="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden bg-[#050508]">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -right-[10%] w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-2/5 h-2/5 bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-3">
              {isAdmin && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e1e32] bg-[#0f0f1a] text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  Command Center Active
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400">
                {isAdmin ? 'Your Tournaments' : 'Official Tournaments'}
              </h1>
              <p className="font-bold tracking-[0.3em] uppercase text-xs text-slate-500">
                {isAdmin ? 'Manage multiple disciplines' : 'Live Competition Center'}
              </p>
            </div>
          </div>

          {isAdmin && onNewTournament && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewTournament}
              className="flex items-center gap-4 font-black px-8 py-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_8px_32px_rgba(59,130,246,0.35)] text-white group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="uppercase tracking-widest text-sm">New Tournament</span>
            </motion.button>
          )}
        </header>

        {activeTournaments.length === 0 ? (
          <div className="rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed border-[#1e1e32] bg-[#0f0f1a]/50">
            <Trophy className="w-16 h-16 text-slate-700 mx-auto" />
            <h2 className="text-2xl font-black text-slate-400 tracking-tight">No Active Tournaments</h2>
            <p className="text-slate-600 font-medium">
              {isAdmin ? "Click 'New Tournament' to create your first competition." : 'Check back later for new competitions.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTournaments.map(t => {
              const isRegistered = loggedInPlayerId
                ? (t.registeredPlayerIds || []).includes(loggedInPlayerId)
                : false;
              const isFull = t.maxTeams !== undefined && t.teams.length >= t.maxTeams;
              return (
                <React.Fragment key={t.id}>
                  <TournamentCard
                    tournament={t}
                    onClick={onSelectTournament}
                    isAdmin={isAdmin}
                    isRegistrationLocked={isRegistrationLocked}
                    isRegistered={isRegistered}
                    isFull={isFull && !isRegistered}
                    loggedInPlayerId={loggedInPlayerId}
                    onRegister={onRegister}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}

        {archivedTournaments.length > 0 && (
          <section className="pt-12 border-t border-[#1e1e32]">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8 flex items-center gap-4">
              <span>Archived History</span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#1e1e32] to-transparent" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
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
  );
}

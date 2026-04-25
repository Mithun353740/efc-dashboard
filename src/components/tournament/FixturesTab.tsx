import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tournament, Fixture, Team, Player } from '../../types';
import { saveTournament, addMatch } from '../../lib/store';
import { useFirebase } from '../../FirebaseContext';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Zap, Edit3, X, Check } from 'lucide-react';

interface FixturesTabProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onUpdate: (updated: Tournament) => void;
}

interface ScoreEntry {
  fixtureId: string;
  home: string;
  away: string;
}

export function FixturesTab({ tournament, isAdmin, onUpdate }: FixturesTabProps) {
  const { players, matches } = useFirebase();
  const fixtures = tournament.fixtures || [];
  const rounds = Array.from(new Set(fixtures.map(f => f.round))).sort((a, b) => a - b);
  const [activeRound, setActiveRound] = useState<number>(rounds[0] ?? 1);
  const [editingScore, setEditingScore] = useState<ScoreEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const getTeam = (id: string | null): Team | undefined =>
    tournament.teams?.find(t => t.id === id);

  const roundFixtures = fixtures.filter(f => f.round === activeRound);

  const handleSaveScore = async () => {
    if (!editingScore) return;
    setSaving(true);
    const home = parseInt(editingScore.home);
    const away = parseInt(editingScore.away);
    if (isNaN(home) || isNaN(away)) { setSaving(false); return; }

    const updatedFixtures = fixtures.map(f =>
      f.id === editingScore.fixtureId
        ? { ...f, homeScore: home, awayScore: away, status: 'completed' as const }
        : f
    );

    // Record match globally for stats and rankings
    const fixture = fixtures.find(f => f.id === editingScore.fixtureId);
    if (fixture && fixture.status !== 'completed') {
      const p1 = players.find(p => p.id === fixture.homeId);
      const p2 = players.find(p => p.id === fixture.awayId);
      if (p1) {
        try {
          await addMatch(p1, home, away, p2, matches, tournament.name);
        } catch (err) {
          console.error("Failed to link tournament match to global stats:", err);
        }
      }
    }

    const updated: Tournament = { ...tournament, fixtures: updatedFixtures };
    await saveTournament(updated);
    onUpdate(updated);
    setEditingScore(null);
    setSaving(false);
  };

  const handleResetScore = async (fixtureId: string) => {
    const updatedFixtures = fixtures.map(f =>
      f.id === fixtureId ? { ...f, homeScore: null, awayScore: null, status: 'upcoming' as const } : f
    );
    const updated: Tournament = { ...tournament, fixtures: updatedFixtures };
    await saveTournament(updated);
    onUpdate(updated);
  };

  const getStatusIcon = (f: Fixture) => {
    if (f.status === 'completed') return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
    if (f.status === 'live') return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    return <Clock className="w-3.5 h-3.5 text-slate-500" />;
  };

  const completedCount = roundFixtures.filter(f => f.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Round Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveRound(r => Math.max(rounds[0], r - 1))}
          disabled={activeRound === rounds[0]}
          className="w-10 h-10 rounded-xl bg-[#0a0a12] border border-[#1e1e32] flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {rounds.map(r => {
            const rFixtures = fixtures.filter(f => f.round === r);
            const rDone = rFixtures.every(f => f.status === 'completed');
            return (
              <button
                key={r}
                onClick={() => setActiveRound(r)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeRound === r
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                    : rDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-[#0a0a12] text-slate-500 border border-[#1e1e32] hover:border-slate-600'
                }`}
              >
                R{r}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveRound(r => Math.min(rounds[rounds.length - 1], r + 1))}
          disabled={activeRound === rounds[rounds.length - 1]}
          className="w-10 h-10 rounded-xl bg-[#0a0a12] border border-[#1e1e32] flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Round header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
          Round {activeRound}
        </h3>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
          {completedCount}/{roundFixtures.length} Played
        </span>
      </div>

      {/* Fixture Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {roundFixtures.length === 0 ? (
            <div className="text-center py-12 text-slate-600 font-bold">No fixtures in this round.</div>
          ) : (
            roundFixtures.map((f, i) => {
              const home = getTeam(f.homeId);
              const away = getTeam(f.awayId);
              const isEditing = editingScore?.fixtureId === f.id;
              const isDone = f.status === 'completed';

              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border transition-all ${
                    isDone ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-[#1e1e32] bg-[#0a0a12]'
                  }`}
                >
                  <div className="p-5 flex items-center gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <span className={`font-black text-sm truncate text-right ${isDone ? 'text-white' : 'text-slate-300'}`}>
                        {home?.name ?? 'TBD'}
                      </span>
                      {home?.logo ? (
                        <img src={home.logo} className="w-9 h-9 rounded-lg object-cover border border-[#1e1e32]" alt={home.name} />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                          {home?.shortName ?? '?'}
                        </div>
                      )}
                    </div>

                    {/* Score Area */}
                    <div className="flex items-center gap-2 min-w-[90px] justify-center">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number" min="0" max="99"
                            value={editingScore?.home ?? ''}
                            onChange={e => setEditingScore(prev => prev ? { ...prev, home: e.target.value } : prev)}
                            className="w-12 text-center bg-[#050508] border border-indigo-500 rounded-lg py-1.5 text-white font-black text-sm focus:outline-none"
                          />
                          <span className="text-slate-600 font-black">-</span>
                          <input
                            type="number" min="0" max="99"
                            value={editingScore?.away ?? ''}
                            onChange={e => setEditingScore(prev => prev ? { ...prev, away: e.target.value } : prev)}
                            className="w-12 text-center bg-[#050508] border border-indigo-500 rounded-lg py-1.5 text-white font-black text-sm focus:outline-none"
                          />
                        </div>
                      ) : isDone ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-white">{f.homeScore}</span>
                          <span className="text-slate-600 font-black">-</span>
                          <span className="text-2xl font-black text-white">{f.awayScore}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#050508] border border-[#1e1e32]">
                          {getStatusIcon(f)}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {f.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex items-center justify-start gap-3">
                      {away?.logo ? (
                        <img src={away.logo} className="w-9 h-9 rounded-lg object-cover border border-[#1e1e32]" alt={away.name} />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs">
                          {away?.shortName ?? '?'}
                        </div>
                      )}
                      <span className={`font-black text-sm truncate ${isDone ? 'text-white' : 'text-slate-300'}`}>
                        {away?.name ?? 'TBD'}
                      </span>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="ml-4 flex gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveScore}
                              disabled={saving}
                              className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingScore(null)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingScore({
                                fixtureId: f.id,
                                home: f.homeScore?.toString() ?? '',
                                away: f.awayScore?.toString() ?? '',
                              })}
                              className="w-8 h-8 rounded-lg bg-[#0f0f1a] border border-[#1e1e32] text-slate-400 flex items-center justify-center hover:border-indigo-500/50 hover:text-white transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {isDone && (
                              <button
                                onClick={() => handleResetScore(f.id)}
                                className="w-8 h-8 rounded-lg bg-[#0f0f1a] border border-[#1e1e32] text-slate-500 flex items-center justify-center hover:border-red-500/50 hover:text-red-400 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tournament, Fixture, Team } from '../../types';
import { saveTournament, addMatch, deleteMatchFromHistory, editMatch } from '../../lib/store';
import { useFirebase } from '../../FirebaseContext';
import {
  ChevronLeft, ChevronRight, CheckCircle, Clock, Zap, Edit3, X, Check,
  Shuffle, ListOrdered, Lock, Unlock, RefreshCw, AlertTriangle, Trash2,
} from 'lucide-react';
import { bergerRoundRobin, seededKnockout } from '../../lib/fixtureGen';
import { cn } from '../../lib/utils';

interface FixturesTabProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onUpdate: (updated: Tournament) => void;
}

interface ScoreEntry {
  fixtureId: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
}

// Fisher-Yates shuffle (returns a NEW array)
function shuffleTeams(teams: Team[]): Team[] {
  const arr = [...teams];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FixturesTab({ tournament, isAdmin, onUpdate }: FixturesTabProps) {
  const { players, matches, systemLocks } = useFirebase();
  const fixtures = tournament.fixtures || [];
  const rounds = Array.from(new Set(fixtures.map(f => f.round))).sort((a, b) => a - b);
  const [activeRound, setActiveRound] = useState<number>(rounds[0] ?? 1);
  const [editingScore, setEditingScore] = useState<ScoreEntry | null>(null);
  const [saving, setSaving] = useState(false);

  // Fixture generation state (admin only)
  const [fixtureMode, setFixtureMode] = useState<'manual' | 'random'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Admin can always generate fixtures regardless of registration lock state
  const registrationLocked = isAdmin || systemLocks?.tournamentRegistration !== false;
  const teams = tournament.teams || [];
  const hasFixtures = fixtures.length > 0;

  // ── Fixture generation ─────────────────────────────────────────────────────
  const handleGenerateFixtures = async () => {
    if (!registrationLocked) return;
    if (teams.length < 2) {
      setGenMsg({ text: 'At least 2 teams are required to generate fixtures.', ok: false });
      return;
    }
    if (hasFixtures) {
      const confirmed = window.confirm(
        '⚠️ This will REPLACE all existing fixtures. Completed scores will be lost. Continue?'
      );
      if (!confirmed) return;
    }

    setIsGenerating(true);
    setGenMsg(null);

    try {
      const orderedTeams = fixtureMode === 'random' ? shuffleTeams(teams) : [...teams];
      let generatedFixtures: Fixture[] = [];
      let generatedGroups = tournament.groups;

      if (tournament.type === 'league') {
        generatedFixtures = bergerRoundRobin(orderedTeams, 2, 'league', 0);
      } else if (tournament.type === 'round_robin') {
        generatedFixtures = bergerRoundRobin(orderedTeams, 1, 'round_robin', 0);
      } else if (tournament.type === 'knockout') {
        // Pad to next power of 2 with BYEs
        let size = 2;
        while (size < orderedTeams.length) size *= 2;
        const paddedTeams = [...orderedTeams];
        let byeCounter = 1;
        while (paddedTeams.length < size) {
          paddedTeams.push({ id: `bye-${byeCounter}`, name: `BYE ${byeCounter}`, shortName: 'BYE' } as Team);
          byeCounter++;
        }
        generatedFixtures = seededKnockout(paddedTeams, 1, 1);
      } else if (tournament.type === 'groups') {
        const { generateGroupStage } = await import('../../lib/fixtureGen');
        const result = generateGroupStage(orderedTeams, 4);
        generatedFixtures = result.fixtures;
        generatedGroups = result.groups;
      }

      const updated: Tournament = {
        ...tournament,
        fixtures: generatedFixtures,
        ...(generatedGroups ? { groups: generatedGroups } : {}),
      };
      await saveTournament(updated);
      onUpdate(updated);
      setGenMsg({ text: `✅ ${generatedFixtures.length} fixtures generated (${fixtureMode} draw).`, ok: true });

      // Navigate to first round
      const newRounds = Array.from(new Set(generatedFixtures.map(f => f.round))).sort((a, b) => a - b);
      if (newRounds.length) setActiveRound(newRounds[0]);
    } catch (err: any) {
      setGenMsg({ text: `❌ ${err.message || 'Failed to generate fixtures.'}`, ok: false });
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Score management ───────────────────────────────────────────────────────
  const getTeam = (id: string | null): Team | undefined =>
    tournament.teams?.find(t => t.id === id);

  const roundFixtures = fixtures.filter(f => f.round === activeRound);

  const handleSaveScore = async () => {
    if (!editingScore) return;
    setSaving(true);

    const homeNum = editingScore.home !== '' ? parseInt(editingScore.home) : null;
    const awayNum = editingScore.away !== '' ? parseInt(editingScore.away) : null;
    const hasValidScore = homeNum !== null && awayNum !== null && !isNaN(homeNum) && !isNaN(awayNum);

    const fixture = fixtures.find(f => f.id === editingScore.fixtureId);
    let newGlobalMatchId = fixture?.globalMatchId;

    if (fixture) {
      if (hasValidScore) {
        if (fixture.status !== 'completed' || !fixture.globalMatchId) {
          // Add new match
          const p1 = players.find(p => p.id === fixture.homeId);
          const p2 = players.find(p => p.id === fixture.awayId);
          if (p1) {
            try {
              newGlobalMatchId = await addMatch(
                p1, homeNum!, awayNum!, p2, matches, tournament.name,
                undefined, undefined, undefined,
                tournament.id, fixture.id
              );
            } catch (err) { console.error('Failed to link match:', err); }
          }
        } else {
          // Edit existing match
          const linkedMatch = matches.find(m => m.id === fixture.globalMatchId);
          if (linkedMatch) {
            try {
              await editMatch(linkedMatch, homeNum!, awayNum!, players, [], tournament.name);
            } catch (err) { console.error('Failed to edit match:', err); }
          }
        }
      } else {
        // Clearing inputs (deleting score)
        if (fixture.status === 'completed' && fixture.globalMatchId) {
          const linkedMatch = matches.find(m => m.id === fixture.globalMatchId);
          if (linkedMatch) {
            try {
              await deleteMatchFromHistory(linkedMatch, players, []);
              newGlobalMatchId = undefined;
            } catch (err) { console.error('Failed to remove match:', err); }
          }
        }
      }
    }

    const updatedFixtures = fixtures.map(f => {
      if (f.id !== editingScore.fixtureId) return f;
      return {
        ...f,
        ...(hasValidScore ? { homeScore: homeNum, awayScore: awayNum, status: 'completed' as const } : { homeScore: null, awayScore: null, status: 'upcoming' as const }),
        date: editingScore.date || null,
        time: editingScore.time || null,
        venue: editingScore.venue || null,
        updatedAt: Date.now(),
        globalMatchId: newGlobalMatchId,
      };
    });

    const updated: Tournament = { ...tournament, fixtures: updatedFixtures };
    await saveTournament(updated);
    onUpdate(updated);
    setEditingScore(null);
    setSaving(false);
  };

  const handleResetScore = async (fixtureId: string) => {
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    if (fixture.status === 'completed') {
      const confirmed = window.confirm(
        '⚠️ WARNING: This will reset the score AND remove this match result from the global stats history.\n\nPlayer rankings and form will be recalculated. This cannot be undone.\n\nAre you sure?'
      );
      if (!confirmed) return;

      // Find and delete the corresponding match record from global history using the link
      let linkedMatch = fixture.globalMatchId ? matches.find(m => m.id === fixture.globalMatchId) : undefined;
      
      // Fallback for old fixtures
      if (!linkedMatch) {
        linkedMatch = matches.find(m =>
          m.tournament === tournament.name &&
          ((m.p1Id === fixture.homeId && m.p2Id === fixture.awayId) ||
           (m.p1Id === fixture.awayId && m.p2Id === fixture.homeId)) &&
          m.p1Score === fixture.homeScore &&
          m.p2Score === fixture.awayScore
        );
      }
      if (linkedMatch) {
        try {
          await deleteMatchFromHistory(linkedMatch, players, []);
        } catch (err) {
          console.error('Failed to remove match from global history:', err);
        }
      }
    } else {
      const confirmed = window.confirm('Reset this fixture back to upcoming?');
      if (!confirmed) return;
    }

    const updatedFixtures = fixtures.map(f =>
      f.id === fixtureId ? { ...f, homeScore: null, awayScore: null, status: 'upcoming' as const, globalMatchId: undefined } : f
    );
    const updated: Tournament = { ...tournament, fixtures: updatedFixtures };
    await saveTournament(updated);
    onUpdate(updated);
  };

  const handleDeleteFixture = async (fixtureId: string) => {
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const confirmed = window.confirm(
      fixture.status === 'completed'
        ? '⚠️ WARNING: This fixture has a score. Deleting it will PERMANENTLY remove the match from player history too.\n\nAre you sure you want to completely delete this?'
        : 'Delete this fixture? This cannot be undone.'
    );
    if (!confirmed) return;

    if (fixture.status === 'completed' && fixture.globalMatchId) {
      const linkedMatch = matches.find(m => m.id === fixture.globalMatchId);
      if (linkedMatch) {
        try { await deleteMatchFromHistory(linkedMatch, players, []); } catch (e) {}
      }
    }

    const updatedFixtures = fixtures.filter(f => f.id !== fixtureId);
    const updated: Tournament = { ...tournament, fixtures: updatedFixtures };
    await saveTournament(updated);
    onUpdate(updated);
  };

  const handleSetLive = async (fixtureId: string) => {
    const updatedFixtures = fixtures.map(f =>
      f.id === fixtureId ? { ...f, status: 'live' as const } : f
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

      {/* ── Admin: Fixture Generation Panel ───────────────────────────────── */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.5rem] border border-[#1e1e32] bg-[#0a0a12] overflow-hidden"
        >
          {/* Panel header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#1e1e32] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">
                Generate Fixtures
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                {hasFixtures ? 'Regenerate draw — will replace existing fixtures' : 'Create the match draw for this tournament'}
              </p>
            </div>
            {/* Registration lock badge */}
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest',
              registrationLocked
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            )}>
              {registrationLocked
                ? <><Lock className="w-3 h-3" /> Registration Locked</>
                : <><Unlock className="w-3 h-3" /> Registration Open</>
              }
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Mode selector cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Manual Draw */}
              <button
                onClick={() => setFixtureMode('manual')}
                className={cn(
                  'relative rounded-2xl border p-4 text-left transition-all group',
                  fixtureMode === 'manual'
                    ? 'border-indigo-500/40 bg-indigo-600/10 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]'
                    : 'border-[#1e1e32] bg-[#050508] hover:border-slate-600'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors',
                  fixtureMode === 'manual' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'
                )}>
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div className="font-black text-sm text-white uppercase tracking-tight">Manual Draw</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">
                  Teams seeded in registration order
                </div>
                {fixtureMode === 'manual' && (
                  <motion.div layoutId="modeDot" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400" />
                )}
              </button>

              {/* Random Draw */}
              <button
                onClick={() => setFixtureMode('random')}
                className={cn(
                  'relative rounded-2xl border p-4 text-left transition-all group',
                  fixtureMode === 'random'
                    ? 'border-purple-500/40 bg-purple-600/10 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.25)]'
                    : 'border-[#1e1e32] bg-[#050508] hover:border-slate-600'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors',
                  fixtureMode === 'random' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'
                )}>
                  <Shuffle className="w-4 h-4" />
                </div>
                <div className="font-black text-sm text-white uppercase tracking-tight">Random Draw</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">
                  Teams randomly shuffled before seeding
                </div>
                {fixtureMode === 'random' && (
                  <motion.div layoutId="modeDot" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400" />
                )}
              </button>
            </div>

            {/* Team count pill */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span className={cn(teams.length >= 2 ? 'text-indigo-400' : 'text-red-400')}>
                {teams.length}
              </span>
              <span>teams registered</span>
              {teams.length < 2 && (
                <span className="text-red-400">· need at least 2</span>
              )}
            </div>

            {/* Registration-locked warning — only shown for non-admin when registration is open */}
            {!isAdmin && !registrationLocked && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-widest">Registration Still Open</div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">
                    Fixture generation is disabled while players can still sign up.
                    Go to <span className="text-white">Control Center → Locks</span> and toggle
                    <span className="text-amber-400"> "Lock Registration"</span> to enable the draw.
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              id="generate-fixtures-btn"
              onClick={handleGenerateFixtures}
              disabled={!registrationLocked || isGenerating || teams.length < 2}
              className={cn(
                'w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                registrationLocked && teams.length >= 2
                  ? fixtureMode === 'random'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-500/20 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
              )}
            >
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Draw...</>
              ) : fixtureMode === 'random' ? (
                <><Shuffle className="w-4 h-4" /> {hasFixtures ? 'Regenerate' : 'Generate'} Random Draw</>
              ) : (
                <><ListOrdered className="w-4 h-4" /> {hasFixtures ? 'Regenerate' : 'Generate'} Manual Draw</>
              )}
            </button>

            {/* Result message */}
            <AnimatePresence>
              {genMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    'px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest',
                    genMsg.ok
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  )}
                >
                  {genMsg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ── Round Navigation ───────────────────────────────────────────────── */}
      {fixtures.length > 0 && (
        <>
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
                        f.status === 'live' ? 'border-yellow-500/30 bg-yellow-500/5'
                        : isDone ? 'border-emerald-500/15 bg-emerald-500/5'
                        : 'border-[#1e1e32] bg-[#0a0a12]'
                      }`}
                    >
                      <div className="p-5 flex items-center gap-4">
                        {/* Home Team */}
                        <div className="flex-1 flex items-center justify-end gap-3">
                          <span className={`font-black text-sm truncate text-right ${isDone ? 'text-white' : 'text-slate-300'}`}>
                            {home?.name ?? 'TBD'}
                          </span>
                          {(() => {
                            const player = players.find(p => p.id === home?.id);
                            if (player?.image) {
                              return <img src={player.image} className="w-9 h-9 rounded-lg object-cover border border-[#1e1e32]" alt={home?.name} />;
                            }
                            return (
                              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                                {home?.shortName ?? '?'}
                              </div>
                            );
                          })()}
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
                          {(() => {
                            const player = players.find(p => p.id === away?.id);
                            if (player?.image) {
                              return <img src={player.image} className="w-9 h-9 rounded-lg object-cover border border-[#1e1e32]" alt={away?.name} />;
                            }
                            return (
                              <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs">
                                {away?.shortName ?? '?'}
                              </div>
                            );
                          })()}
                          <span className={`font-black text-sm truncate ${isDone ? 'text-white' : 'text-slate-300'}`}>
                            {away?.name ?? 'TBD'}
                          </span>
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && (
                          <div className="ml-2 flex gap-1.5 flex-shrink-0">
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
                                  title="Cancel editing"
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
                                    date: f.date ?? '',
                                    time: f.time ?? '',
                                    venue: f.venue ?? '',
                                  })}
                                  className="w-8 h-8 rounded-lg bg-[#0f0f1a] border border-[#1e1e32] text-slate-400 flex items-center justify-center hover:border-indigo-500/50 hover:text-white transition-all"
                                  title="Edit score & details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {!isDone && f.status !== 'live' && (
                                  <button
                                    onClick={() => handleSetLive(f.id)}
                                    className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center hover:bg-yellow-500/20 transition-all"
                                    title="Set as Live"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {(isDone || f.status === 'live') && (
                                  <button
                                    onClick={() => handleResetScore(f.id)}
                                    className="w-8 h-8 rounded-lg bg-[#0f0f1a] border border-[#1e1e32] text-slate-500 flex items-center justify-center hover:border-amber-500/50 hover:text-amber-400 transition-all"
                                    title="Reset score (removes from history)"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteFixture(f.id)}
                                  className="w-8 h-8 rounded-lg bg-[#0f0f1a] border border-[#1e1e32] text-slate-500 flex items-center justify-center hover:border-red-500/50 hover:text-red-400 transition-all"
                                  title="Delete fixture"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ── Date / Time / Venue editing (admin, while editing) ── */}
                      {isAdmin && isEditing && (
                        <div className="px-5 pb-4 pt-0 border-t border-[#1e1e32] space-y-2">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest pt-3">Schedule Details</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Date</label>
                              <input
                                type="date"
                                value={editingScore?.date ?? ''}
                                onChange={e => setEditingScore(prev => prev ? { ...prev, date: e.target.value } : prev)}
                                className="w-full bg-[#050508] border border-[#1e1e32] rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-indigo-500/50 text-slate-300"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Time</label>
                              <input
                                type="time"
                                value={editingScore?.time ?? ''}
                                onChange={e => setEditingScore(prev => prev ? { ...prev, time: e.target.value } : prev)}
                                className="w-full bg-[#050508] border border-[#1e1e32] rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-indigo-500/50 text-slate-300"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Venue</label>
                            <input
                              type="text"
                              placeholder="e.g. Main Pitch"
                              value={editingScore?.venue ?? ''}
                              onChange={e => setEditingScore(prev => prev ? { ...prev, venue: e.target.value } : prev)}
                              className="w-full bg-[#050508] border border-[#1e1e32] rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* ── Date / Time / Venue display (when set, not editing) ── */}
                      {!isEditing && (f.date || f.time || f.venue) && (
                        <div className="px-5 pb-3 pt-0 flex items-center gap-3 flex-wrap">
                          {f.date && (
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                              📅 {f.date}
                            </span>
                          )}
                          {f.time && (
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                              🕐 {f.time}
                            </span>
                          )}
                          {f.venue && (
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                              📍 {f.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>


                  );
                })
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Empty state — no fixtures yet and not admin */}
      {!isAdmin && fixtures.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <Clock className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="font-black uppercase tracking-widest text-sm">Fixtures not yet generated</p>
          <p className="text-[10px] font-bold mt-2">Check back once the draw has been made by an admin.</p>
        </div>
      )}
    </div>
  );
}

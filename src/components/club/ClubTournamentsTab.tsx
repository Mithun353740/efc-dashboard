import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Calendar, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Club, ClubTournament, ClubFixture, ClubSystemConfig, Player } from '../../types';
import { fetchClubTournaments, fetchClubFixtures, computeClubStandings } from '../../lib/store';

function countdownStr(deadline: number) {
  const diff = deadline - Date.now();
  if (diff <= 0) return 'EXPIRED';
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ClubTournamentsTabProps {
  myClub: Club | null;
  allClubs: Club[];
  allPlayers: Player[];
  config: ClubSystemConfig | null;
  isOwner: boolean;
  isAdmin?: boolean;
}

export default function ClubTournamentsTab({
  myClub, allClubs, allPlayers, config, isOwner, isAdmin
}: ClubTournamentsTabProps) {
  const [tournaments, setTournaments] = useState<ClubTournament[]>([]);
  const [fixtures, setFixtures] = useState<ClubFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTournament, setActiveTournament] = useState<ClubTournament | null>(null);
  const [activeView, setActiveView] = useState<'standings' | 'fixtures' | 'results'>('standings');

  // Tick every minute for countdowns
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const seasonId = config?.season || config?.activeInternalSeasonId || '';
    if (!seasonId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const [ts, fs] = await Promise.all([
          fetchClubTournaments(seasonId),
          fetchClubFixtures(seasonId),
        ]);
        const activeTourneys = ts.filter(t => t.status !== 'completed')
          .sort((a, b) => b.createdAt - a.createdAt);
        setTournaments(activeTourneys);
        setFixtures(fs);
        const first = activeTourneys.find(t => t.status === 'active') || activeTourneys[0] || null;
        setActiveTournament(first);
      } catch (e) {
        console.error('[ClubTournamentsTab]', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [config?.season, config?.activeInternalSeasonId]);

  const tournamentFixtures = useMemo(() =>
    fixtures.filter(f => f.tournamentId === activeTournament?.id),
    [fixtures, activeTournament]
  );

  const participatingClubs = useMemo(() =>
    allClubs.filter(c => activeTournament?.participatingClubIds?.includes(c.id)),
    [allClubs, activeTournament]
  );

  const standings = useMemo(() =>
    computeClubStandings(tournamentFixtures, participatingClubs),
    [tournamentFixtures, participatingClubs]
  );

  const myFixtures = useMemo(() =>
    tournamentFixtures.filter(f => f.homeClubId === myClub?.id || f.awayClubId === myClub?.id),
    [tournamentFixtures, myClub]
  );

  const completedFixtures = useMemo(() =>
    tournamentFixtures.filter(f => f.status === 'completed')
      .sort((a, b) => b.createdAt - a.createdAt),
    [tournamentFixtures]
  );

  const upcomingFixtures = useMemo(() =>
    tournamentFixtures.filter(f => f.status !== 'completed')
      .sort((a, b) => (a.matchday || 0) - (b.matchday || 0)),
    [tournamentFixtures]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader size={32} className="text-amber-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Tournaments...</p>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Trophy size={48} className="text-slate-800 mb-4" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">No Active Tournaments</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
          The admin has not created any tournaments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Selector */}
      {tournaments.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {tournaments.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTournament(t); setActiveView('standings'); }}
              className={cn(
                'px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all',
                activeTournament?.id === t.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {activeTournament && (
        <>
          {/* Tournament Header */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Trophy size={22} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight italic">
                  {activeTournament.name}
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span>{activeTournament.type?.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>{participatingClubs.length} Clubs</span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[8px] font-black uppercase',
                    activeTournament.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    activeTournament.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  )}>
                    {activeTournament.status}
                  </span>
                </p>
              </div>
            </div>
            {config?.currentMatchday && (
              <div className="text-right shrink-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Matchday</p>
                <p className="text-3xl font-black text-amber-500">{config.currentMatchday}</p>
                {config.currentMatchdayDeadline && config.currentMatchdayDeadline > Date.now() && (
                  <p className="text-[9px] font-black text-red-400 uppercase">
                    {countdownStr(config.currentMatchdayDeadline)} left
                  </p>
                )}
              </div>
            )}
          </div>

          {/* My Club Upcoming Fixture Alert */}
          {myClub && myFixtures.filter(f => f.status !== 'completed').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-violet-500/5 border border-violet-500/30 rounded-3xl p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-tight">
                  {myFixtures.filter(f => f.status !== 'completed').length} Upcoming Fixture
                  {myFixtures.filter(f => f.status !== 'completed').length !== 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-slate-400 font-bold">
                  {(() => {
                    const next = myFixtures.filter(f => f.status !== 'completed')[0];
                    if (!next) return '—';
                    const opp = next.homeClubId === myClub.id ? next.awayClubName : next.homeClubName;
                    const venue = next.homeClubId === myClub.id ? 'Home' : 'Away';
                    return `MD${next.matchday} · ${venue} vs ${opp}${next.deadline ? ` · ${countdownStr(next.deadline)} left` : ''}`;
                  })()}
                </p>
              </div>
            </motion.div>
          )}

          {/* Sub-nav */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
            {(['standings', 'fixtures', 'results'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={cn(
                  'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                  activeView === v ? 'bg-white/10 text-white shadow' : 'text-slate-500 hover:text-white'
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* ── STANDINGS ─────────────────────────────────────── */}
          {activeView === 'standings' && (
            <motion.div key="standings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                  <Trophy size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">League Table</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Pos', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((h, i) => (
                          <th key={h} className={cn(
                            'py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest',
                            i < 2 ? 'px-4 text-left' : 'px-3 text-center',
                            h === 'Pts' && 'text-amber-500'
                          )}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {standings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-slate-600 text-xs font-bold">
                            No results yet — season underway
                          </td>
                        </tr>
                      ) : standings.map((row, i) => {
                        const isMyClub = row.clubId === myClub?.id;
                        const club = allClubs.find(c => c.id === row.clubId);
                        return (
                          <tr
                            key={row.clubId}
                            className={cn('transition-colors', isMyClub ? 'bg-amber-500/5' : 'hover:bg-white/[0.02]')}
                          >
                            <td className="px-4 py-4">
                              <span className={cn(
                                'text-sm font-black',
                                i === 0 ? 'text-amber-500' :
                                i === 1 ? 'text-slate-300' :
                                i === 2 ? 'text-amber-700/80' : 'text-slate-600'
                              )}>{i + 1}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 rounded-lg shrink-0 border border-white/10"
                                  style={{ background: club?.primaryColor || '#374151' }}
                                />
                                <span className={cn(
                                  'text-xs font-black uppercase truncate',
                                  isMyClub ? 'text-amber-400' : 'text-white'
                                )}>{row.clubName}</span>
                                {isMyClub && (
                                  <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase shrink-0">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-4 text-center text-xs font-bold text-slate-400">{row.played}</td>
                            <td className="px-3 py-4 text-center text-xs font-bold text-emerald-400">{row.won}</td>
                            <td className="px-3 py-4 text-center text-xs font-bold text-slate-400">{row.drawn}</td>
                            <td className="px-3 py-4 text-center text-xs font-bold text-red-400">{row.lost}</td>
                            <td className="px-3 py-4 text-center text-xs font-bold text-slate-400">
                              {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-sm font-black text-white">{row.points}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FIXTURES (Upcoming) ────────────────────────────── */}
          {activeView === 'fixtures' && (
            <motion.div key="fixtures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {upcomingFixtures.length === 0 ? (
                <div className="text-center py-16 bg-white/3 border border-white/5 rounded-3xl">
                  <Calendar size={40} className="text-slate-800 mx-auto mb-3" />
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest">No upcoming fixtures</p>
                </div>
              ) : (
                Object.entries(
                  upcomingFixtures.reduce((groups: Record<number, ClubFixture[]>, f) => {
                    const md = f.matchday || 1;
                    if (!groups[md]) groups[md] = [];
                    groups[md].push(f);
                    return groups;
                  }, {})
                ).sort(([a], [b]) => Number(a) - Number(b)).map(([md, mdFixtures]) => (
                  <div key={md}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-black text-amber-500">{md}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Matchday {md}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {mdFixtures.map(f => {
                        const homeClub = allClubs.find(c => c.id === f.homeClubId);
                        const awayClub = allClubs.find(c => c.id === f.awayClubId);
                        const isMyMatch = f.homeClubId === myClub?.id || f.awayClubId === myClub?.id;
                        const expired = f.deadline && f.deadline < Date.now();
                        return (
                          <div
                            key={f.id}
                            className={cn(
                              'bg-white/5 border rounded-2xl p-4 transition-all',
                              isMyMatch ? 'border-violet-500/30 bg-violet-500/3' : 'border-white/10'
                            )}
                          >
                            <div className="flex items-center gap-4">
                              {/* Home */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-xl shrink-0 border border-white/10"
                                  style={{ background: homeClub?.primaryColor || '#374151' }}
                                />
                                <div className="min-w-0">
                                  <p className={cn(
                                    'text-xs font-black uppercase truncate',
                                    f.homeClubId === myClub?.id ? 'text-amber-400' : 'text-white'
                                  )}>{f.homeClubName}</p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase">Home</p>
                                </div>
                              </div>
                              {/* VS */}
                              <div className="text-center shrink-0">
                                <span className="text-[11px] font-black text-slate-600 uppercase">vs</span>
                              </div>
                              {/* Away */}
                              <div className="flex items-center gap-3 flex-1 min-w-0 flex-row-reverse">
                                <div
                                  className="w-8 h-8 rounded-xl shrink-0 border border-white/10"
                                  style={{ background: awayClub?.primaryColor || '#374151' }}
                                />
                                <div className="min-w-0 text-right">
                                  <p className={cn(
                                    'text-xs font-black uppercase truncate',
                                    f.awayClubId === myClub?.id ? 'text-amber-400' : 'text-white'
                                  )}>{f.awayClubName}</p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase">Away</p>
                                </div>
                              </div>
                            </div>
                            {/* Meta row */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'text-[9px] font-black uppercase px-2 py-0.5 rounded',
                                  f.status === 'scheduled' ? 'bg-slate-500/20 text-slate-400' :
                                  f.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                  'bg-amber-500/20 text-amber-400'
                                )}>{f.status}</span>
                                <span className="text-[9px] text-slate-600 font-bold">{f.lineupSize}v{f.lineupSize}</span>
                              </div>
                              {f.deadline && (
                                <div className="flex items-center gap-1">
                                  <Clock size={10} className={expired ? 'text-red-400' : 'text-slate-500'} />
                                  <span className={cn(
                                    'text-[9px] font-black uppercase',
                                    expired ? 'text-red-400' : 'text-amber-400'
                                  )}>
                                    {expired ? 'EXPIRED' : countdownStr(f.deadline)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ── RESULTS ────────────────────────────────────────── */}
          {activeView === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {completedFixtures.length === 0 ? (
                <div className="text-center py-16 bg-white/3 border border-white/5 rounded-3xl">
                  <CheckCircle size={40} className="text-slate-800 mx-auto mb-3" />
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest">No results yet</p>
                </div>
              ) : completedFixtures.map(f => {
                const homeGoals = f.subMatches.reduce((s, m) =>
                  s + (m.p1Score !== null && m.p2Score !== null && m.p1Score > m.p2Score ? 1 : 0), 0);
                const awayGoals = f.subMatches.reduce((s, m) =>
                  s + (m.p1Score !== null && m.p2Score !== null && m.p2Score > m.p1Score ? 1 : 0), 0);
                const homeClub = allClubs.find(c => c.id === f.homeClubId);
                const awayClub = allClubs.find(c => c.id === f.awayClubId);
                const isMyMatch = f.homeClubId === myClub?.id || f.awayClubId === myClub?.id;
                const homeWon = homeGoals > awayGoals;
                const awayWon = awayGoals > homeGoals;
                return (
                  <div
                    key={f.id}
                    className={cn(
                      'bg-white/5 border rounded-2xl p-4',
                      isMyMatch ? 'border-amber-500/20' : 'border-white/10'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl shrink-0 border border-white/10" style={{ background: homeClub?.primaryColor || '#374151' }} />
                      <span className={cn(
                        'text-xs font-black uppercase flex-1 truncate',
                        f.homeClubId === myClub?.id ? 'text-amber-400' : 'text-white'
                      )}>{f.homeClubName}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cn('text-xl font-black', homeWon ? 'text-white' : 'text-slate-500')}>{homeGoals}</span>
                        <span className="text-slate-600 font-black text-xs">—</span>
                        <span className={cn('text-xl font-black', awayWon ? 'text-white' : 'text-slate-500')}>{awayGoals}</span>
                      </div>
                      <span className={cn(
                        'text-xs font-black uppercase flex-1 truncate text-right',
                        f.awayClubId === myClub?.id ? 'text-amber-400' : 'text-white'
                      )}>{f.awayClubName}</span>
                      <div className="w-8 h-8 rounded-xl shrink-0 border border-white/10" style={{ background: awayClub?.primaryColor || '#374151' }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] text-slate-600 font-bold">MD{f.matchday}</span>
                      <span className="text-[9px] text-slate-600 font-bold">{f.subMatches.length} sub-matches</span>
                    </div>
                    {/* Sub-match breakdown */}
                    {f.subMatches.filter(s => s.p1Score !== null).length > 0 && (
                      <div className="mt-3 space-y-1 pt-3 border-t border-white/5">
                        {f.subMatches.filter(s => s.p1Score !== null && s.p2Score !== null).map(sm => {
                          const p1 = allPlayers.find(p => p.id === sm.p1Id);
                          const p2 = allPlayers.find(p => p.id === sm.p2Id);
                          return (
                            <div key={sm.id} className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-2">
                              <span className={sm.p1Score! > sm.p2Score! ? 'text-emerald-400' : ''}>
                                {p1?.name || sm.p1Name}
                              </span>
                              <span className="font-black text-slate-300">{sm.p1Score} — {sm.p2Score}</span>
                              <span className={sm.p2Score! > sm.p1Score! ? 'text-emerald-400' : ''}>
                                {p2?.name || sm.p2Name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

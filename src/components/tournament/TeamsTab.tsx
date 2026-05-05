import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tournament, Team } from '../../types';
import { useFirebase } from '../../FirebaseContext';
import { calculateFantasyPoints } from '../../lib/fantasy';
import { ChevronDown, ChevronUp, TrendingUp, Shield, Star } from 'lucide-react';

interface TeamsTabProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onUpdate: (updated: Tournament) => void;
}

interface TeamWithStats extends Team {
  played: number; won: number; drawn: number; lost: number;
  gf: number; ga: number; gd: number; pts: number; cs: number;
  form: string[];
}

function computeTeamStats(tournament: Tournament): TeamWithStats[] {
  const fixtures = (tournament.fixtures || []).filter(f => f.status === 'completed');
  const teams = tournament.teams || [];

  const statsMap: Record<string, TeamWithStats> = {};
  teams.forEach(t => {
    statsMap[t.id] = { ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0, cs: 0, form: [] };
  });

  // Sort fixtures by round for form guide
  const sorted = [...fixtures].sort((a, b) => a.round - b.round);
  sorted.forEach(f => {
    if (f.homeId === null || f.awayId === null || f.homeScore === null || f.awayScore === null) return;
    const home = statsMap[f.homeId];
    const away = statsMap[f.awayId];
    if (!home || !away) return;
    const hs = Number(f.homeScore);
    const as_ = Number(f.awayScore);

    home.played++; away.played++;
    home.gf += hs; home.ga += as_;
    away.gf += as_; away.ga += hs;
    if (as_ === 0) home.cs++;
    if (hs === 0) away.cs++;

    if (hs > as_) {
      home.won++; home.pts += 3; home.form.push('W');
      away.lost++; away.form.push('L');
    } else if (hs < as_) {
      away.won++; away.pts += 3; away.form.push('W');
      home.lost++; home.form.push('L');
    } else {
      home.drawn++; home.pts += 1; home.form.push('D');
      away.drawn++; away.pts += 1; away.form.push('D');
    }
  });

  return Object.values(statsMap).map(t => ({ ...t, gd: t.gf - t.ga }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

const formColor: Record<string, string> = {
  W: 'bg-emerald-500 text-white',
  D: 'bg-amber-500 text-black',
  L: 'bg-red-500 text-white',
};

export function TeamsTab({ tournament, isAdmin, onUpdate }: TeamsTabProps) {
  const { players } = useFirebase();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const teams = useMemo(() => computeTeamStats(tournament), [tournament]);

  const handleRemoveTeam = async (teamId: string) => {
    const team = tournament.teams.find(t => t.id === teamId);
    if (!team) return;

    const fixtureCount = (tournament.fixtures || []).filter(f => f.homeId === teamId || f.awayId === teamId).length;
    const playedCount = (tournament.fixtures || []).filter(f => (f.homeId === teamId || f.awayId === teamId) && f.status === 'completed').length;

    let msg = `Remove ${team.name} from tournament?`;
    if (playedCount > 0) {
      msg += `\n\nWARNING: This team has played ${playedCount} matches. Removing them may cause standings inconsistencies.`;
    } else if (fixtureCount > 0) {
      msg += `\n\nThis will also remove ${fixtureCount} scheduled fixtures for this team.`;
    }

    if (!window.confirm(msg)) return;

    const updatedTeams = tournament.teams.filter(t => t.id !== teamId);
    const updatedFixtures = (tournament.fixtures || []).filter(f => f.homeId !== teamId && f.awayId !== teamId);
    
    const updated: Tournament = {
      ...tournament,
      teams: updatedTeams,
      fixtures: updatedFixtures
    };

    const { saveTournament } = await import('../../lib/store');
    await saveTournament(updated);
    onUpdate(updated);
  };

  const handleAddTeam = async (player: any) => {
    if (tournament.teams.some(t => t.id === player.id)) {
      alert('Player already in tournament.');
      return;
    }

    const newTeam: Team = {
      id: player.id,
      name: player.name,
      shortName: player.name.substring(0, 3).toUpperCase(),
    };

    const updatedTeams = [...tournament.teams, newTeam];
    const updated: Tournament = {
      ...tournament,
      teams: updatedTeams
    };

    const { saveTournament } = await import('../../lib/store');
    await saveTournament(updated);
    onUpdate(updated);
    setShowAddTeam(false);
    setSearchQuery('');
  };

  const availablePlayers = players.filter(p => !tournament.teams.some(t => t.id === p.id));
  const filteredAvailable = availablePlayers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Admin Add Team Section */}
      {isAdmin && (
        <div className="bg-[#0a0a12] border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="text-sm font-black text-white uppercase tracking-tight">Manage Roster</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manually add or remove competitors</p>
             </div>
             <button 
               onClick={() => setShowAddTeam(!showAddTeam)}
               className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
             >
               {showAddTeam ? 'Close Search' : 'Add Team'}
             </button>
          </div>

          <AnimatePresence>
            {showAddTeam && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4"
              >
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search players by name..."
                  className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {filteredAvailable.map(p => (
                     <button
                       key={p.id}
                       onClick={() => handleAddTeam(p)}
                       className="p-3 rounded-xl border border-[#1e1e32] bg-[#050508] hover:border-indigo-500/50 text-center transition-all group"
                     >
                        <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden mb-2 bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600">
                              {p.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 truncate group-hover:text-white">{p.name}</div>
                     </button>
                   ))}
                   {searchQuery && filteredAvailable.length === 0 && (
                     <div className="col-span-full py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-widest">No players found</div>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-3">
      {teams.map((team, i) => {
        const isExpanded = expandedId === team.id;
        const lastFive = team.form.slice(-5);
        const winRate = team.played > 0 ? Math.round((team.won / team.played) * 100) : 0;

        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-[#1e1e32] bg-[#0a0a12] overflow-hidden"
          >
            {/* Row */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : team.id)}
              className="w-full p-5 flex items-center gap-4 text-left hover:bg-[#0f0f1a] transition-colors"
            >
              {/* Rank */}
              <span className="text-slate-600 font-black text-sm w-5 text-center flex-shrink-0">{i + 1}</span>

              {/* Avatar */}
              {(() => {
                const player = players.find(p => p.id === team.id);
                if (player?.image) {
                  return <img src={player.image} className="w-10 h-10 rounded-xl object-cover border border-[#1e1e32] flex-shrink-0" alt={team.name} />;
                }
                return (
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs flex-shrink-0">
                    {team.shortName ?? team.name.substring(0, 3).toUpperCase()}
                  </div>
                );
              })()}

              {/* Name & Form */}
              <div className="flex-1 min-w-0">
                <div className="font-black text-white text-sm truncate">{team.name}</div>
                <div className="flex gap-1 mt-1">
                  {lastFive.length === 0
                    ? <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">No matches yet</span>
                    : lastFive.map((r, idx) => (
                      <span key={idx} className={`text-[8px] font-black w-4 h-4 rounded flex items-center justify-center ${formColor[r]}`}>
                        {r}
                      </span>
                    ))
                  }
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="text-lg font-black text-white">{team.pts}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-600">PTS</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-black ${team.gd > 0 ? 'text-emerald-400' : team.gd < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {team.gd > 0 ? '+' : ''}{team.gd}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-600">GD</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-indigo-400">{team.played}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-600">MP</div>
                </div>
              </div>

              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            </button>

            {/* Expanded Detail */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#1e1e32] p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                      {[
                        { label: 'Played', value: team.played, color: 'text-white' },
                        { label: 'Won', value: team.won, color: 'text-emerald-400' },
                        { label: 'Drawn', value: team.drawn, color: 'text-amber-400' },
                        { label: 'Lost', value: team.lost, color: 'text-red-400' },
                        { label: 'GF', value: team.gf, color: 'text-blue-400' },
                        { label: 'GD', value: (team.gd > 0 ? '+' : '') + team.gd, color: team.gd >= 0 ? 'text-emerald-400' : 'text-red-400' },
                        { label: 'Clean Sheets', value: team.cs, color: 'text-purple-400' },
                      ].map(stat => (
                        <div key={stat.label} className="bg-[#050508] rounded-xl p-3 text-center border border-[#1e1e32]">
                          <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                          <div className="text-[8px] font-black uppercase tracking-widest text-slate-600 mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Win Rate Bar */}
                    <div>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Win Rate</span>
                        <span className="text-white">{winRate}%</span>
                      </div>
                      <div className="h-2 bg-[#050508] rounded-full overflow-hidden border border-[#1e1e32]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${winRate}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                        />
                      </div>
                    </div>

                      </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="pt-4 border-t border-[#1e1e32] flex justify-end">
                        <button
                          onClick={() => handleRemoveTeam(team.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                        >
                          <Shield className="w-3 h-3" /> Kick from Tournament
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

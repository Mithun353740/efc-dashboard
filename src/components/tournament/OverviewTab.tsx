import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tournament, Fixture, Team } from '../../types';
import { useFirebase } from '../../FirebaseContext';
import { Trophy, Goal, Users, ListOrdered, User, TrendingUp, Shield, Activity, Calendar } from 'lucide-react';

interface OverviewTabProps {
  tournament: Tournament;
}

export function OverviewTab({ tournament }: OverviewTabProps) {
  const { players } = useFirebase();
  const fixtures = tournament.fixtures || [];
  const teams = tournament.teams || [];
  
  const completedFixtures = fixtures.filter(f => f.status === 'completed');
  const totalGoals = completedFixtures.reduce((acc, f) => acc + (f.homeScore || 0) + (f.awayScore || 0), 0);
  
  const recentActivity = completedFixtures
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 3);
    
  const nextEngagements = fixtures
    .filter(f => f.status !== 'completed')
    .sort((a, b) => a.round - b.round || (a.matchIndex || 0) - (b.matchIndex || 0))
    .slice(0, 3);

  // Top Scorer calculation
  const scorerStats = useMemo(() => {
    const map: Record<string, { id: string; name: string; goals: number; played: number }> = {};
    teams.forEach(t => map[t.id] = { id: t.id, name: t.name, goals: 0, played: 0 });
    
    completedFixtures.forEach(f => {
      if (f.homeId && f.awayId) {
        map[f.homeId].played++;
        map[f.awayId].played++;
        map[f.homeId].goals += (f.homeScore || 0);
        map[f.awayId].goals += (f.awayScore || 0);
      }
    });
    return Object.values(map).sort((a, b) => b.goals - a.goals || a.played - b.played);
  }, [completedFixtures, teams]);

  const topScorer = scorerStats[0];
  const topScorerPlayer = players.find(p => p.id === topScorer?.id);

  // Biggest Margin of Victory
  const biggestMargin = useMemo(() => {
    return completedFixtures.reduce((prev, curr) => {
      const margin = Math.abs((curr.homeScore || 0) - (curr.awayScore || 0));
      const prevMargin = prev ? Math.abs((prev.homeScore || 0) - (prev.awayScore || 0)) : -1;
      return margin > prevMargin ? curr : prev;
    }, null as Fixture | null);
  }, [completedFixtures]);

  const getTeam = (id: string | null) => teams.find(t => t.id === id);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Matches', value: fixtures.length, icon: <ListOrdered className="w-5 h-5 text-blue-400" />, color: 'from-blue-500/20 to-transparent' },
          { label: 'Played', value: completedFixtures.length, icon: <Activity className="w-5 h-5 text-emerald-400" />, color: 'from-emerald-500/20 to-transparent' },
          { label: 'Teams', value: teams.length, icon: <Users className="w-5 h-5 text-purple-400" />, color: 'from-purple-500/20 to-transparent' },
          { label: 'Goals', value: totalGoals, icon: <Goal className="w-5 h-5 text-amber-400" />, color: 'from-amber-500/20 to-transparent' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-6 relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</div>
              <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((f, i) => {
                  const h = getTeam(f.homeId);
                  const a = getTeam(f.awayId);
                  const hPlayer = players.find(p => p.id === f.homeId);
                  const aPlayer = players.find(p => p.id === f.awayId);
                  
                  return (
                    <div key={f.id} className="bg-[#050508] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3 w-32 justify-end">
                        <span className="text-[10px] font-black text-white truncate text-right">{h?.name}</span>
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex-shrink-0">
                          {hPlayer?.image ? <img src={hPlayer.image} className="w-full h-full object-cover" /> : <User className="w-3 h-3 text-indigo-400 m-auto" />}
                        </div>
                      </div>
                      
                      <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-lg text-indigo-400 font-black text-xs shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {f.homeScore} - {f.awayScore}
                      </div>
                      
                      <div className="flex items-center gap-3 w-32">
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex-shrink-0">
                          {aPlayer?.image ? <img src={aPlayer.image} className="w-full h-full object-cover" /> : <User className="w-3 h-3 text-indigo-400 m-auto" />}
                        </div>
                        <span className="text-[10px] font-black text-white truncate">{a?.name}</span>
                      </div>
                    </div>
                  );
                })}
                {recentActivity.length === 0 && <div className="text-center py-8 text-slate-600 text-[10px] font-black uppercase">No results yet</div>}
              </div>
            </div>

            {/* Next Engagements */}
            <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Engagements</h3>
                <Calendar className="w-4 h-4 text-purple-500" />
              </div>
              <div className="space-y-4">
                {nextEngagements.map((f, i) => {
                  const h = getTeam(f.homeId);
                  const a = getTeam(f.awayId);
                  const hPlayer = players.find(p => p.id === f.homeId);
                  const aPlayer = players.find(p => p.id === f.awayId);
                  
                  return (
                    <div key={f.id} className="bg-[#050508] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3 w-32 justify-end">
                        <span className="text-[10px] font-black text-white truncate text-right">{h?.name || 'TBD'}</span>
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex-shrink-0">
                          {hPlayer?.image ? <img src={hPlayer.image} className="w-full h-full object-cover" /> : <User className="w-3 h-3 text-indigo-400 m-auto" />}
                        </div>
                      </div>
                      
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-500 font-black text-[9px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        VS
                      </div>
                      
                      <div className="flex items-center gap-3 w-32">
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex-shrink-0">
                          {aPlayer?.image ? <img src={aPlayer.image} className="w-full h-full object-cover" /> : <User className="w-3 h-3 text-indigo-400 m-auto" />}
                        </div>
                        <span className="text-[10px] font-black text-white truncate">{a?.name || 'TBD'}</span>
                      </div>
                    </div>
                  );
                })}
                {nextEngagements.length === 0 && <div className="text-center py-8 text-slate-600 text-[10px] font-black uppercase">Tournament Complete</div>}
              </div>
            </div>
          </div>

          {/* Performance Analytics (Placeholder Chart) */}
          <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Performance Analytics</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Title Race Progression</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
               {/* Mock bars/lines */}
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                 <div key={i} className="flex-1 bg-indigo-600/10 rounded-t-lg relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05 + 0.5, duration: 1 }}
                      className="absolute bottom-0 w-full bg-indigo-600/40 group-hover:bg-indigo-600 transition-all rounded-t-lg"
                    />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Top Scorer Spotlight */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-[#0a0a12] border border-indigo-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Golden Boot Race</h3>
              <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            
            {topScorer ? (
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 rounded-[2.5rem] border-4 border-indigo-500/30 overflow-hidden bg-[#050508] relative group ring-8 ring-indigo-500/5">
                    {topScorerPlayer?.image ? (
                      <img src={topScorerPlayer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-500/20"><User size={64} /></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-2 max-w-[180px] break-words">{topScorer.name}</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                       {topScorer.played} Matches Played
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 relative">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tournament Total</span>
                      <div className="text-xs font-black text-white uppercase italic">Goals Scored</div>
                    </div>
                    <span className="text-7xl font-black text-white tracking-tighter italic drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                       {topScorer.goals}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600 font-black uppercase text-xs tracking-widest">No stats available</div>
            )}
          </div>

          {/* Tournament Records */}
          <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Tournament Records</h3>
             <div className="space-y-6">
                <div>
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Biggest Margin of Victory</div>
                  {biggestMargin ? (
                    <div className="bg-[#050508] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white truncate w-20 text-right">{getTeam(biggestMargin.homeId)?.name}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-indigo-400">{biggestMargin.homeScore} - {biggestMargin.awayScore}</span>
                      </div>
                      <span className="text-[10px] font-black text-white truncate w-20">{getTeam(biggestMargin.awayId)?.name}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-600 font-bold uppercase">Awaiting results...</div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

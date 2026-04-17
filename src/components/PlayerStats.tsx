import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Trophy, Target, Zap, Filter, ChevronDown } from 'lucide-react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { Player } from '../types';
import { computePlayerStats } from '../lib/store';

export default function PlayerStats() {
  const { rankedPlayers: players, matches } = useFirebase();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const playerIdParam = searchParams.get('id');
  const [filter, setFilter] = useState('All Time');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (playerIdParam) {
      const p = players.find(player => player.id === playerIdParam);
      if (p) setSelectedPlayer(p);
    } else if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0]);
    } else if (selectedPlayer) {
      const stillExists = players.find(p => p.id === selectedPlayer.id);
      if (stillExists) setSelectedPlayer(stillExists);
    }
  }, [players, playerIdParam, selectedPlayer]);

  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    matches.forEach(m => {
      const d = new Date(m.timestamp);
      const y = d.getFullYear();
      const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
      const sY = isLateJan ? y - 1 : y;
      seasons.add(`${sY}/${sY + 1}`);
    });
    // Ensure current season
    const d = new Date();
    const y = d.getFullYear();
    const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
    const sY = isLateJan ? y - 1 : y;
    seasons.add(`${sY}/${sY + 1}`);
    return Array.from(seasons).sort().reverse();
  }, [matches]);

  const availableTournaments = ["QVFC Elite League Cup", "Vortex Champions Cup", "Vortex Domestic Cup"];

  const computedPlayer = useMemo(() => {
    if (!selectedPlayer) return null;
    if (filter === 'All Time') return selectedPlayer;

    let filteredMatches = matches;
    
    if (filter.includes('/')) {
      filteredMatches = matches.filter(m => {
        const d = new Date(m.timestamp);
        const y = d.getFullYear();
        const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
        const sY = isLateJan ? y - 1 : y;
        return `${sY}/${sY + 1}` === filter;
      });
    } else {
      filteredMatches = matches.filter(m => (m.tournament || 'Friendly') === filter);
    }

    return computePlayerStats(selectedPlayer, filteredMatches);
  }, [selectedPlayer, filter, matches]);

  const chartData = computedPlayer ? [
    { name: 'WINS', value: computedPlayer.win, color: '#22c55e' },
    { name: 'DRAWS', value: computedPlayer.draw, color: '#94a3b8' },
    { name: 'LOSSES', value: computedPlayer.loss, color: '#ef4444' },
    { name: 'GOALS', value: computedPlayer.goalsScored, color: '#38bdf8' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark flex flex-col lg:flex-row transition-colors">
      {/* Sidebar Search */}
      <div className="w-full lg:w-80 bg-white dark:bg-white/5 border-r border-slate-100 dark:border-white/10 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 dark:border-white/10">
          <h2 className="text-xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">eFOOTBALL ROSTER</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players..."
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:border-brand-green transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group",
                selectedPlayer?.id === player.id ? "bg-brand-dark dark:bg-brand-green text-white dark:text-brand-dark shadow-xl shadow-brand-dark/20" : "hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 transition-all">
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{player.name}</p>
                <p className={cn("text-[9px] font-bold uppercase", selectedPlayer?.id === player.id ? "text-slate-400 dark:text-brand-dark/60" : "text-slate-400")}>
                  #{player.number} • {player.device}
                </p>
              </div>
              <ChevronRight size={14} className={cn("transition-transform", selectedPlayer?.id === player.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedPlayer ? (
            <motion.div
              key={selectedPlayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Header Card */}
              <div className="relative bg-brand-dark dark:bg-white/5 rounded-[2.5rem] p-12 text-white border dark:border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <img src={selectedPlayer.image} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-dark dark:from-black via-brand-dark/80 dark:via-black/80 to-transparent" />
                </div>

                {/* Custom Filter Dropdown positioned top right */}
                <div className="absolute top-8 right-8 z-50">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-brand-dark border-brand-green border px-4 py-3 rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-all font-black text-xs cursor-pointer group shadow-2xl shadow-brand-dark/50"
                  >
                    <Filter size={14} className="text-brand-green group-hover:rotate-12 transition-transform" />
                    <span>{filter.includes('/') ? `${filter} Season` : filter}</span>
                    <ChevronDown size={14} className={cn("text-brand-green ml-2 transition-transform", isFilterOpen ? "rotate-180" : "")} />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-72 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] flex flex-col z-50"
                      >
                        <div className="p-2 space-y-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
                          <button 
                            onClick={() => { setFilter('All Time'); setIsFilterOpen(false); }}
                            className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", filter === 'All Time' ? "bg-brand-green text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                          >
                            All Time
                          </button>
                          
                          <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-green mt-2 bg-brand-green/5 rounded-lg border border-brand-green/10">SEASONS</div>
                          {availableSeasons.map(s => (
                            <button 
                              key={s}
                              onClick={() => { setFilter(s); setIsFilterOpen(false); }}
                              className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", filter === s ? "bg-brand-green text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                            >
                              {s} Season
                            </button>
                          ))}

                          <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-green mt-2 bg-brand-green/5 rounded-lg border border-brand-green/10">TOURNAMENTS</div>
                          {availableTournaments.map(t => (
                            <button 
                              key={t}
                              onClick={() => { setFilter(t); setIsFilterOpen(false); }}
                              className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", filter === t ? "bg-brand-green text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isFilterOpen && (
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsFilterOpen(false)} />
                )}

                <div className="relative z-10">
                  <span className="text-brand-green font-black text-[10px] tracking-[0.4em] mb-4 block">PLAYER PROFILE</span>
                  
                  <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">{computedPlayer.name}</h1>
                  <div className="flex gap-6 items-center">
                    <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JERSEY</p>
                      <p className="text-xl font-black">#{computedPlayer.number}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DEVICE</p>
                      <p className="text-xl font-black">{computedPlayer.device || 'N/A'}</p>
                    </div>
                    <div className="bg-brand-green px-6 py-2 rounded-full text-brand-dark">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">OVERALL</p>
                      <p className="text-xl font-black">{computedPlayer.ovr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
                  <h3 className="text-lg font-black text-brand-dark dark:text-white mb-8 tracking-tight">PERFORMANCE METRICS</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                        <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.1 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-6">
                  <StatCard icon={<Trophy className="text-brand-green" />} label="POINTS" value={computedPlayer.win * 3 + computedPlayer.draw} />
                  <StatCard icon={<Target className="text-brand-green" />} label="GOAL DIFF" value={computedPlayer.goalsScored - computedPlayer.goalsConceded} />
                  <StatCard icon={<Zap className="text-brand-green" />} label="WIN RATE" value={`${Math.round((computedPlayer.win / (computedPlayer.win + computedPlayer.loss + computedPlayer.draw || 1)) * 100)}%`} />
                </div>
              </div>

              {/* Form & Recent */}
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
                <h3 className="text-lg font-black text-brand-dark dark:text-white mb-6 tracking-tight">RECENT FORM</h3>
                <div className="flex gap-4">
                  {(computedPlayer.win > 0 || computedPlayer.loss > 0 || computedPlayer.draw > 0) && computedPlayer.form?.length ? computedPlayer.form.map((res, i) => (
                    <div key={i} className={cn(
                      "flex-1 py-4 rounded-2xl flex flex-col items-center justify-center border transition-all",
                      res === 'W' ? "bg-brand-green/10 border-brand-green/20 text-brand-green" :
                      res === 'L' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                      "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                    )}>
                      <span className="text-xl font-black">{res}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">MATCH {i + 1}</span>
                    </div>
                  )) : (
                    <div className="w-full py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400">NO RECENT MATCH DATA AVAILABLE</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 font-black text-2xl italic">
              SELECT A PLAYER TO VIEW ANALYTICS
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none flex items-center gap-4 transition-colors">
      <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{label}</p>
        <p className="text-2xl font-black text-brand-dark dark:text-white leading-none">{value}</p>
      </div>
    </div>
  );
}

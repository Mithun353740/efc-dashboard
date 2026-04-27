import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn, getSeasonInfo } from '../lib/utils';
import { INITIAL_PLAYERS, computePlayerStats, sortRankedPlayers } from '../lib/store';
import { Trophy, ChevronDown, Filter } from 'lucide-react';

export default function Rankings() {
  const { rankedPlayers, matches, elos } = useFirebase();
  const [selectedSeason, setSelectedSeason] = useState('All Time');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    matches.forEach(m => {
      seasons.add(getSeasonInfo(new Date(m.timestamp)).name);
    });
    // Ensure current season
    seasons.add(getSeasonInfo(new Date()).name);
    return Array.from(seasons).sort().reverse();
  }, [matches]);

  const activePlayers = useMemo(() => {
    if (rankedPlayers.length === 0) return INITIAL_PLAYERS;
    
    if (selectedSeason === 'All Time') return rankedPlayers;

    // Filter matches by season
    const seasonMatches = matches.filter(m => {
      return getSeasonInfo(new Date(m.timestamp)).name === selectedSeason;
    });

    // Compute new stats
    const seasonPlayers = rankedPlayers.map(player => {
      const stats = computePlayerStats(player, seasonMatches, elos[player.id] || 1200);
      stats.ovr = player.ovr; // Keep global OVR
      return stats;
    }).filter(p => p.win > 0 || p.loss > 0 || p.draw > 0);

    return sortRankedPlayers(seasonPlayers);
  }, [rankedPlayers, matches, selectedSeason, elos]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark py-20 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-50">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter leading-none">OFFICIAL<br />eFOOTBALL RANKINGS</h1>
            <p className="text-xs font-bold text-slate-400 tracking-[0.3em] mt-4 uppercase">GLOBAL PERFORMANCE DATA</p>
          </div>

          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-auto bg-brand-dark border-brand-purple border px-4 py-3 rounded-2xl flex items-center justify-between gap-3 hover:scale-[1.02] transition-all font-black text-xs cursor-pointer group shadow-2xl shadow-brand-dark/50 text-white"
            >
              <Filter size={14} className="text-brand-purple group-hover:rotate-12 transition-transform" />
              <span>
                {selectedSeason === 'All Time' ? 'ALL TIME RANKINGS' : `${selectedSeason} LEADERBOARD`}
              </span>
              <ChevronDown size={14} className={cn("text-brand-purple transition-transform", isFilterOpen ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 md:right-0 top-full mt-2 w-full md:w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
                >
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setSelectedSeason('All Time'); setIsFilterOpen(false); }}
                      className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", selectedSeason === 'All Time' ? "bg-brand-purple text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                    >
                      All Time Rankings
                    </button>
                    
                    <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-purple mt-2 bg-brand-purple/5 rounded-lg border border-brand-purple/10">SELECT SEASON</div>
                    {availableSeasons.map(s => (
                      <button 
                        key={s}
                        onClick={() => { setSelectedSeason(s); setIsFilterOpen(false); }}
                        className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex justify-between items-center", selectedSeason === s ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "hover:bg-white/5 text-slate-300")}
                      >
                        {s} Season
                        {selectedSeason === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />}
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
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-white/10 relative z-10">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-dark dark:bg-brand-gradient text-white border-b border-white/20">
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-6 lg:w-auto text-center lg:text-left">#</th>
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase">PLAYER</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">MP</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">W</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">D</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">L</th>
                  <th className="hidden lg:table-cell p-6 text-[10px] font-black tracking-widest uppercase text-center">GS</th>
                  <th className="hidden lg:table-cell p-6 text-[10px] font-black tracking-widest uppercase text-center">GC</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">GD</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">PTS</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-12 sm:w-16 text-center">FORM</th>
                </tr>
              </thead>
              <tbody>
                {activePlayers.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors",
                      index < 3 && "bg-brand-purple/5 dark:bg-brand-purple/10"
                    )}
                  >
                    <td className="p-2 lg:p-6 text-center lg:text-left">
                      <span className={cn(
                        "text-xs lg:text-lg font-black",
                        index === 0 ? "text-brand-purple" : index < 3 ? "text-brand-dark dark:text-white" : "text-slate-300 dark:text-slate-700"
                      )}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-2 lg:p-6">
                      <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
                        <div className="shrink-0 w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-white/10">
                          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] lg:text-sm font-black text-brand-dark dark:text-white leading-none truncate">{player.name}</p>
                          <p className="hidden sm:block text-[8px] lg:text-[9px] font-bold text-slate-400 mt-1 uppercase truncate">#{player.number} • {player.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-slate-600 dark:text-slate-400">{player.win + player.draw + player.loss}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.win}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.draw}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.loss}</td>
                    <td className="hidden lg:table-cell p-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{player.goalsScored}</td>
                    <td className="hidden lg:table-cell p-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{player.goalsConceded}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-brand-dark dark:text-white">
                      {player.goalsScored - player.goalsConceded > 0 ? '+' : ''}{player.goalsScored - player.goalsConceded}
                    </td>
                    <td className="p-1 lg:p-6 text-center">
                      <span className="bg-brand-dark dark:bg-brand-gradient dark:border dark:border-white/20 text-white text-[10px] lg:text-xs font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-full shadow-sm">
                        {player.win * 3 + player.draw}
                      </span>
                    </td>
                    <td className="p-2 lg:p-6 text-center">
                      <div className="flex gap-1 justify-center">
                        {(player.win > 0 || player.loss > 0 || player.draw > 0) && player.form?.length ? player.form.map((res, i) => (
                          <div key={i} className={cn(
                            "w-2 h-2 rounded-full",
                            res === 'W' ? 'bg-brand-gradient shadow-[0_0_10px_rgba(139,92,246,0.5)]' : res === 'L' ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'
                          )} />
                        )) : <span className="text-slate-300 dark:text-slate-700 text-[10px] font-bold">-</span>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

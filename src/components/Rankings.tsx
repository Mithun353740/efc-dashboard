import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn, getSeasonInfo } from '../lib/utils';
import { INITIAL_PLAYERS, sortRankedPlayers, calculateRankingStats } from '../lib/store';
import { Player } from '../types';
import { Trophy, ChevronDown, Filter, HelpCircle } from 'lucide-react';

export default function Rankings() {
  const { rankedPlayers, matches } = useFirebase();
  const [selectedSeason, setSelectedSeason] = useState('All Time');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Build available seasons list from the limited real-time match feed + current season
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    // Pull known seasons from player seasonStats (covers full history)
    rankedPlayers.forEach(p => {
      if (p.seasonStats) Object.keys(p.seasonStats).forEach(s => seasons.add(s));
    });
    // Also pull from recent matches feed as a fallback
    matches.forEach(m => seasons.add(getSeasonInfo(new Date(m.timestamp)).name));
    seasons.add(getSeasonInfo(new Date()).name);
    return Array.from(seasons).sort().reverse();
  }, [rankedPlayers, matches]);

  const activePlayers = useMemo(() => {
    if (rankedPlayers.length === 0) return INITIAL_PLAYERS;
    let basePlayers = rankedPlayers;

    if (selectedSeason !== 'All Time') {
      // Read from pre-computed seasonStats — zero match reads required
      basePlayers = rankedPlayers
        .map(player => {
          const s = player.seasonStats?.[selectedSeason];
          if (!s || (s.win === 0 && s.loss === 0 && s.draw === 0)) return null;
          return {
            ...player,
            win: s.win,
            loss: s.loss,
            draw: s.draw,
            goalsScored: s.goalsScored,
            goalsConceded: s.goalsConceded,
            form: s.form,
            // Keep global OVR — season OVR is not separately tracked
            ovr: player.ovr,
          } as Player;
        })
        .filter(Boolean) as Player[];
    }

    return sortRankedPlayers(basePlayers).map(p => ({
      ...p,
      rankingStats: calculateRankingStats(p)
    }));
  }, [rankedPlayers, selectedSeason]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark py-20 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-50">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter leading-none">OFFICIAL<br />eFOOTBALL RANKINGS</h1>
            <div className="flex items-center gap-2 mt-4">
              <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">BALANCED SKILL ASSESSMENT</p>
              <div className="relative">
                <HelpCircle 
                  size={14} 
                  className="text-brand-purple cursor-help" 
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-full ml-2 top-0 w-64 bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-2xl z-[100]"
                    >
                      <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-tighter">
                        Rankings are calculated using <span className="text-brand-purple">FinalScore</span>:<br/>
                        (Pts × 0.5) + (ADJ WinRate × 20) + (OVR × 0.3).<br/><br/>
                        Players with &lt; 10 matches are <span className="text-amber-500">Provisional</span> and have reduced weight for performance.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-dark dark:bg-brand-gradient text-white border-b border-white/20">
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-6 lg:w-auto text-center lg:text-left">#</th>
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase">PLAYER</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">Score</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">OVR</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">MP</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">W</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">D</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">L</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">Pts</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center">WR%</th>
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
                        <div className="shrink-0 w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-white/10 group relative">
                          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-[10px] lg:text-sm font-black text-brand-dark dark:text-white leading-none truncate">{player.name}</p>
                            {player.rankingStats.isProvisional && (
                              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 lg:px-2 py-0.5 rounded text-[6px] lg:text-[8px] font-black tracking-widest uppercase">
                                PROVISIONAL
                              </span>
                            )}
                          </div>
                          <p className="hidden sm:block text-[8px] lg:text-[9px] font-bold text-slate-400 mt-1 uppercase truncate">#{player.number} • {player.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-brand-purple italic tracking-tighter">
                      {player.rankingStats.finalScore}
                    </td>
                    <td className="p-1 lg:p-6 text-center">
                      <span className="bg-brand-gradient text-white text-[9px] lg:text-xs font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-md shadow-sm border border-white/20">
                        {player.ovr}
                      </span>
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-slate-600 dark:text-slate-400">
                      {player.rankingStats.matchesPlayed}
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">
                      {player.win}
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">
                      {player.draw}
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">
                      {player.loss}
                    </td>
                    <td className="p-1 lg:p-6 text-center">
                      <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] lg:text-xs font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-full border border-slate-200 dark:border-white/10">
                        {player.rankingStats.points}
                      </span>
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-brand-dark dark:text-white">
                      {Math.round((player.win / (player.rankingStats.matchesPlayed || 1)) * 100)}%
                    </td>
                    <td className="p-2 lg:p-6 text-center">
                      <div className="flex gap-1 justify-center">
                        {(player.win > 0 || player.loss > 0 || player.draw > 0) && player.form?.length ? player.form.slice(0, 5).map((res, i) => (
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

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
            {activePlayers.map((player, index) => (
              <div key={player.id} className={cn("p-4 flex flex-col gap-3", index < 3 && "bg-brand-purple/5")}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-lg font-black w-6 text-center", index === 0 ? "text-brand-purple" : "text-slate-300")}>
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                      <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-brand-dark dark:text-white">{player.name}</p>
                        {player.rankingStats.isProvisional && (
                          <span className="bg-amber-500 text-brand-dark px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest uppercase">
                            PROV
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">#{player.number} • {player.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-brand-purple italic">{player.rankingStats.finalScore} SCORE</p>
                    <span className="inline-block bg-brand-gradient text-white text-[9px] font-black px-2 py-0.5 rounded mt-1">
                      {player.ovr} OVR
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">MP</p>
                    <p className="text-xs font-black dark:text-white">{player.rankingStats.matchesPlayed}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-green-500">W</p>
                    <p className="text-xs font-black dark:text-white">{player.win}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-slate-400">D</p>
                    <p className="text-xs font-black dark:text-white">{player.draw}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-red-500">L</p>
                    <p className="text-xs font-black dark:text-white">{player.loss}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">PTS</p>
                    <p className="text-xs font-black dark:text-white">{player.rankingStats.points}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl text-center">
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">WR%</p>
                    <p className="text-xs font-black dark:text-white">{Math.round((player.win / (player.rankingStats.matchesPlayed || 1)) * 100)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">RECENT MATCH FORM</p>
                  <div className="flex gap-1 justify-center">
                    {(player.win > 0 || player.loss > 0 || player.draw > 0) && player.form?.length ? player.form.slice(0, 5).map((res, i) => (
                      <div key={i} className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        res === 'W' ? 'bg-brand-purple' : res === 'L' ? 'bg-red-500' : 'bg-slate-300'
                      )} />
                    )) : <span className="text-slate-300 dark:text-slate-700 text-[8px] font-black">-</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

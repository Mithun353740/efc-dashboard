import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { Player } from '../types';
import { computePlayerStats, sortRankedPlayers } from '../lib/store';
import { cn } from '../lib/utils';
import { Trophy, ChevronDown } from 'lucide-react';

const TOURNAMENTS = ["QVFC Elite League Cup", "QVFC Elite League Cup Division 2", "Vortex Champions Cup", "Vortex Domestic Cup"];

export default function Tournament() {
  const { rankedPlayers, matches } = useFirebase();
  const [selectedTournament, setSelectedTournament] = useState(TOURNAMENTS[0]);
  const [selectedSeason, setSelectedSeason] = useState('All Time');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    matches.forEach(m => {
      const d = new Date(m.timestamp);
      const y = d.getFullYear();
      const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
      const sY = isLateJan ? y - 1 : y;
      seasons.add(`${sY}/${sY + 1}`);
    });
    const d = new Date();
    const y = d.getFullYear();
    const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
    const sY = isLateJan ? y - 1 : y;
    seasons.add(`${sY}/${sY + 1}`);
    return Array.from(seasons).sort().reverse();
  }, [matches]);

  // Compute standings for the selected tournament
  const standings = useMemo(() => {
    let tournamentMatches = matches.filter(m => m.tournament === selectedTournament);
    
    if (selectedSeason !== 'All Time') {
      tournamentMatches = tournamentMatches.filter(m => {
        const d = new Date(m.timestamp);
        const y = d.getFullYear();
        const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
        const sY = isLateJan ? y - 1 : y;
        return `${sY}/${sY + 1}` === selectedSeason;
      });
    }

    // Compute stats for all players using ONLY the tournament matches
    const unsortedTournamentPlayers = rankedPlayers
      .map(player => {
        const stats = computePlayerStats(player, tournamentMatches);
        // FORCE GIT SYNC: Lock the universal All-Time OVR into the tournament stats
        stats.ovr = player.ovr;
        return stats;
      })
      .filter(p => p.win > 0 || p.loss > 0 || p.draw > 0); // Only show players who played in this tournament
      
    return sortRankedPlayers(unsortedTournamentPlayers);
  }, [rankedPlayers, matches, selectedTournament, selectedSeason]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center p-8 transition-colors">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tighter uppercase mb-2">CLUB TOURNAMENTS</h1>
            <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">OFFICIAL COMPETITION STANDINGS</p>
          </div>

          <div className="relative z-50 w-full md:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto bg-brand-dark border border-brand-purple/50 px-6 py-4 rounded-xl flex items-center justify-between md:justify-center gap-4 hover:scale-[1.02] transition-all font-black text-xs cursor-pointer group shadow-xl shadow-brand-purple/20"
            >
              <Trophy size={16} className="text-brand-purple group-hover:scale-110 transition-transform" />
              <span className="text-transparent bg-clip-text bg-brand-gradient tracking-widest">
                {selectedSeason === 'All Time' 
                  ? selectedTournament 
                  : `${selectedSeason} - ${selectedTournament}`}
              </span>
              <ChevronDown size={14} className={cn("text-brand-purple ml-1 transition-transform", isDropdownOpen ? "rotate-180" : "")} />
            </button>

            {isDropdownOpen && (
              <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsDropdownOpen(false)} />
            )}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-full md:w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 max-h-[70vh]"
                >
                  <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-purple mt-2 bg-brand-purple/5 rounded-lg border border-brand-purple/10">1. SELECT SEASON</div>
                    <button 
                      onClick={() => { setSelectedSeason('All Time'); }}
                      className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex justify-between items-center", selectedSeason === 'All Time' ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "hover:bg-white/5 text-slate-300")}
                    >
                      All Time
                      {selectedSeason === 'All Time' && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />}
                    </button>
                    {availableSeasons.map(s => (
                      <button 
                        key={s}
                        onClick={() => { setSelectedSeason(s); }}
                        className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex justify-between items-center", selectedSeason === s ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "hover:bg-white/5 text-slate-300")}
                      >
                        {s} Season
                        {selectedSeason === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />}
                      </button>
                    ))}

                    <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-purple mt-4 bg-brand-purple/5 rounded-lg border border-brand-purple/10">2. SELECT TOURNAMENT</div>
                    {TOURNAMENTS.map(t => (
                      <button 
                        key={t}
                        onClick={() => { setSelectedTournament(t); setIsDropdownOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-4 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex justify-between items-center", 
                          selectedTournament === t ? "bg-brand-gradient text-white border border-white/10 shadow-lg" : "hover:bg-white/5 text-slate-300"
                        )}
                      >
                        {t}
                        {selectedTournament === t && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-black/20 border-b border-slate-100 dark:border-white/10">
                  <th className="p-3 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center w-10 md:w-auto">POS</th>
                  <th className="p-3 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase">CLUB MEMBER</th>
                  <th className="p-1 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">P</th>
                  <th className="p-1 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">W</th>
                  <th className="p-1 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">D</th>
                  <th className="p-1 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">L</th>
                  <th className="p-1 md:p-6 text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">GD</th>
                  <th className="p-2 md:p-6 text-[8px] md:text-[10px] font-black text-slate-800 dark:text-white tracking-widest uppercase text-center bg-slate-100 dark:bg-white/5">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.length > 0 ? (
                  standings.map((player, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={player.id} 
                      className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-3 md:p-6 text-center">
                        <span className={cn(
                          "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black mx-auto",
                          index === 0 ? "bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.4)]" :
                          index === 1 ? "bg-slate-300 text-slate-700" :
                          index === 2 ? "bg-amber-600 text-amber-100" :
                          "bg-slate-100 dark:bg-white/5 text-slate-400"
                        )}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-3 md:p-6">
                        <div className="flex items-center gap-2 md:gap-4">
                          <img src={player.image} alt={player.name} className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border-2 border-transparent group-hover:border-brand-purple transition-colors" />
                          <div className="min-w-0 flex-1">
                            <p className="font-black text-[10px] md:text-sm text-brand-dark dark:text-white uppercase tracking-tight truncate">{player.name}</p>
                            <p className="hidden md:block text-[10px] font-bold text-slate-400 tracking-widest">#{player.number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-1 md:p-6 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.win + player.loss + player.draw}</td>
                      <td className="p-1 md:p-6 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.win}</td>
                      <td className="p-1 md:p-6 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.draw}</td>
                      <td className="p-1 md:p-6 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.loss}</td>
                      <td className="p-1 md:p-6 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.goalsScored - player.goalsConceded}</td>
                      <td className="p-3 md:p-6 text-center font-black text-sm md:text-lg text-brand-dark dark:text-white bg-slate-50 dark:bg-white/5">
                        {(player.win * 3) + player.draw}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                      NO MATCHES RECORDED FOR THIS TOURNAMENT YET
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

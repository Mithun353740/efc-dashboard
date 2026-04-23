import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { computePlayerStats, sortRankedPlayers } from '../lib/store';
import { cn } from '../lib/utils';
import { Trophy, ChevronDown, Calendar, Filter, History } from 'lucide-react';

export default function TournamentRanking() {
  const { rankedPlayers, matches, tournaments } = useFirebase();
  
  // 1. Determine Current Season & Available Seasons
  const getCurrentSeason = () => {
    const d = new Date();
    const y = d.getFullYear();
    const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
    const sY = isLateJan ? y - 1 : y;
    return `${sY}/${sY + 1}`;
  };

  const currentSeason = useMemo(() => getCurrentSeason(), []);
  
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    // Pull from tournaments collection
    tournaments.forEach(t => { if (t.season) seasons.add(t.season); });
    // Pull from match history as fallback/legacy
    matches.forEach(m => {
      const d = new Date(m.timestamp);
      const y = d.getFullYear();
      const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
      const sY = isLateJan ? y - 1 : y;
      seasons.add(`${sY}/${sY + 1}`);
    });
    // Ensure current is there
    seasons.add(currentSeason);
    return Array.from(seasons).sort().reverse();
  }, [matches, tournaments, currentSeason]);

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectionStep, setSelectionStep] = useState<'season' | 'tournament'>('season');

  // 2. Get Tournaments for the selected season
  const seasonTournaments = useMemo(() => {
    const names = new Set<string>();
    // Defaults for every season as requested
    names.add("QVFC ELITE LEAGUE CUP DIVISION 1");
    names.add("QVFC ELITE LEAGUE CUP DIVISION 2");

    // Add tournaments from Firestore that belong to this season
    tournaments.forEach(t => {
      if (t.season === selectedSeason) names.add(t.name);
    });

    // Fallback: matches with this tournament name in this season
    matches.forEach(m => {
      if (m.tournament && m.tournament !== 'Friendly') {
        const d = new Date(m.timestamp);
        const y = d.getFullYear();
        const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
        const sY = isLateJan ? y - 1 : y;
        if (`${sY}/${sY + 1}` === selectedSeason) {
          names.add(m.tournament);
        }
      }
    });

    return Array.from(names).sort();
  }, [tournaments, matches, selectedSeason]);

  const [selectedTournament, setSelectedTournament] = useState(seasonTournaments[0] || "QVFC ELITE LEAGUE CUP DIVISION 1");

  // Sync selected tournament when season changes
  useEffect(() => {
    if (!seasonTournaments.includes(selectedTournament)) {
      setSelectedTournament(seasonTournaments[0]);
    }
  }, [selectedSeason, seasonTournaments]);

  // 3. Compute Standings
  const standings = useMemo(() => {
    let tournamentMatches = matches.filter(m => m.tournament === selectedTournament);
    
    // Filter matches by season as well (to handle same tournament name across seasons)
    tournamentMatches = tournamentMatches.filter(m => {
      const d = new Date(m.timestamp);
      const y = d.getFullYear();
      const isLateJan = (d.getMonth() === 0 && d.getDate() <= 17);
      const sY = isLateJan ? y - 1 : y;
      return `${sY}/${sY + 1}` === selectedSeason;
    });

    const unsortedTournamentPlayers = rankedPlayers
      .map(player => {
        const stats = computePlayerStats(player, tournamentMatches);
        stats.ovr = player.ovr;
        return stats;
      })
      .filter(p => p.win > 0 || p.loss > 0 || p.draw > 0);
      
    return sortRankedPlayers(unsortedTournamentPlayers);
  }, [rankedPlayers, matches, selectedTournament, selectedSeason]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center p-4 md:p-8 transition-colors">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tighter uppercase mb-2">CLUB TOURNAMENTS</h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded text-[9px] font-black uppercase tracking-widest border border-brand-purple/20">Official Standings</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedSeason} Season</span>
            </div>
          </motion.div>

          <div className="relative z-50 w-full md:w-auto">
            <button 
              onClick={() => { setIsDropdownOpen(!isDropdownOpen); setSelectionStep('season'); }}
              className="w-full md:w-auto bg-brand-dark border border-brand-purple/50 px-6 py-4 rounded-xl flex items-center justify-between md:justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all font-black text-xs cursor-pointer group shadow-xl shadow-brand-purple/20"
            >
              <div className="flex items-center gap-3">
                <Trophy size={16} className="text-brand-purple group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[7px] text-slate-500 uppercase tracking-widest leading-none mb-1">Current Filter</p>
                  <p className="text-transparent bg-clip-text bg-brand-gradient tracking-tight text-[10px] md:text-xs">
                    {selectedSeason} • {selectedTournament}
                  </p>
                </div>
              </div>
              <ChevronDown size={14} className={cn("text-brand-purple ml-1 transition-transform", isDropdownOpen ? "rotate-180" : "")} />
            </button>

            {isDropdownOpen && (
              <div className="fixed inset-0 z-40 cursor-default bg-black/10 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-0" onClick={() => setIsDropdownOpen(false)} />
            )}
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-full md:w-96 bg-[#0a0a14] border border-white/10 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-50"
                >
                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         {selectionStep === 'season' ? '1. Select Season' : '2. Select Tournament'}
                       </span>
                       {selectionStep === 'tournament' && (
                         <button onClick={() => setSelectionStep('season')} className="text-[9px] font-black text-brand-purple uppercase hover:underline">Change Season</button>
                       )}
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
                      {selectionStep === 'season' ? (
                        <div className="grid grid-cols-1 gap-1">
                          {availableSeasons.map(s => (
                            <button 
                              key={s}
                              onClick={() => { setSelectedSeason(s); setSelectionStep('tournament'); }}
                              className={cn(
                                "flex items-center justify-between px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                selectedSeason === s ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "text-slate-400 hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Calendar size={14} className={selectedSeason === s ? "text-brand-purple" : "text-slate-600"} />
                                <span>{s} Season</span>
                              </div>
                              {selectedSeason === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-1">
                          {seasonTournaments.map(t => (
                            <button 
                              key={t}
                              onClick={() => { setSelectedTournament(t); setIsDropdownOpen(false); }}
                              className={cn(
                                "flex items-center justify-between px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                selectedTournament === t ? "bg-brand-gradient text-white shadow-lg" : "text-slate-400 hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Trophy size={14} className={selectedTournament === t ? "text-white" : "text-slate-600"} />
                                <span className="truncate max-w-[220px]">{t}</span>
                              </div>
                              {selectedTournament === t && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
                            </button>
                          ))}
                          {seasonTournaments.length === 0 && (
                            <div className="p-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">No Tournaments found for this season</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0a0a14] border border-slate-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-3xl dark:shadow-none transition-colors"
        >
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                  <th className="p-4 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center w-12 md:w-20">POS</th>
                  <th className="p-4 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase">MEMBER</th>
                  <th className="p-2 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">P</th>
                  <th className="p-2 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">W</th>
                  <th className="p-2 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">D</th>
                  <th className="p-2 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">L</th>
                  <th className="p-2 md:p-7 text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">GD</th>
                  <th className="p-4 md:p-7 text-[10px] md:text-[11px] font-black text-slate-800 dark:text-white tracking-widest uppercase text-center bg-slate-100/50 dark:bg-white/[0.03]">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.length > 0 ? (
                  standings.map((player, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={player.id} 
                      className="border-b border-slate-50 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-4 md:p-7 text-center">
                        <span className={cn(
                          "w-7 h-7 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black mx-auto transition-all group-hover:scale-110",
                          index === 0 ? "bg-yellow-400 text-yellow-900 shadow-[0_0_20px_rgba(250,204,21,0.3)]" :
                          index === 1 ? "bg-slate-300 text-slate-700" :
                          index === 2 ? "bg-amber-600 text-amber-100" :
                          "bg-slate-100 dark:bg-white/5 text-slate-400"
                        )}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4 md:p-7">
                        <div className="flex items-center gap-3 md:gap-5">
                          <div className="relative">
                            <img src={player.image} alt={player.name} className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover border-2 border-transparent group-hover:border-brand-purple transition-all" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-brand-dark rounded-lg flex items-center justify-center border border-white/10">
                              <span className="text-[7px] md:text-[8px] font-black text-brand-purple uppercase">#{player.number}</span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-black text-xs md:text-base text-brand-dark dark:text-white uppercase tracking-tight truncate group-hover:text-brand-purple transition-colors">{player.name}</p>
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                               <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">{player.ovr} OVR Rating</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-7 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.win + player.loss + player.draw}</td>
                      <td className="p-2 md:p-7 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.win}</td>
                      <td className="p-2 md:p-7 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.draw}</td>
                      <td className="p-2 md:p-7 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.loss}</td>
                      <td className="p-2 md:p-7 text-center font-bold text-slate-500 text-[10px] md:text-sm">{player.goalsScored - player.goalsConceded}</td>
                      <td className="p-4 md:p-7 text-center font-black text-sm md:text-xl text-brand-dark dark:text-white bg-slate-50 dark:bg-white/[0.03]">
                        {(player.win * 3) + player.draw}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
                             <History size={32} />
                          </div>
                          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Awaiting Match Engagement</p>
                          <p className="text-[10px] text-slate-500 font-medium">Results for {selectedTournament} will appear here</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

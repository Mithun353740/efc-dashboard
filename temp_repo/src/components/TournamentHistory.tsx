import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';
import { Trophy, ChevronDown, Calendar, History } from 'lucide-react';

interface TournamentHistoryProps {
  onOpenTournament: (tournamentId: string) => void;
}

export default function TournamentHistory({ onOpenTournament }: TournamentHistoryProps) {
  const { matches, tournaments } = useFirebase();
  
  // 1. Determine Current Season & Available Seasons
  const getSeasonInfo = (date: Date) => {
    let start = new Date(2026, 3, 17); // April 17, 2026 (Anchor)
    if (date >= start) {
      while (true) {
        let end = new Date(start);
        end.setMonth(end.getMonth() + 9);
        end.setDate(end.getDate() - 1);
        if (date <= end) {
          const sY = start.getFullYear();
          const eY = end.getFullYear();
          return {
            name: sY === eY ? `${sY} Season` : `${sY}/${eY}`,
            start, end
          };
        }
        start.setMonth(start.getMonth() + 9);
        if (start.getFullYear() > 2100) break;
      }
    } else {
      while (true) {
        let nextStart = new Date(start);
        start = new Date(start);
        start.setMonth(start.getMonth() - 9);
        let end = new Date(nextStart);
        end.setDate(end.getDate() - 1);
        if (date >= start && date <= end) {
          const sY = start.getFullYear();
          const eY = end.getFullYear();
          return {
            name: sY === eY ? `${sY} Season` : `${sY}/${eY}`,
            start, end
          };
        }
        if (start.getFullYear() < 2020) break;
      }
    }
    return { name: "Legacy", start: null, end: null };
  };

  const currentSeason = useMemo(() => getSeasonInfo(new Date()).name, []);
  
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    tournaments.forEach(t => { 
      if (t.season) {
        seasons.add(t.season); 
      } else if (t.createdAt) {
        seasons.add(getSeasonInfo(new Date(t.createdAt)).name);
      }
    });
    matches.forEach(m => {
      seasons.add(getSeasonInfo(new Date(m.timestamp)).name);
    });
    seasons.add(currentSeason);
    return Array.from(seasons).sort().reverse();
  }, [matches, tournaments, currentSeason]);

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. Get Tournaments for the selected season
  const seasonTournaments = useMemo(() => {
    const filtered = tournaments.filter(t => {
      const seasonName = t.season || (t.createdAt ? getSeasonInfo(new Date(t.createdAt)).name : currentSeason);
      return seasonName === selectedSeason;
    });
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [tournaments, selectedSeason, currentSeason]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center p-4 md:p-8 transition-colors">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tighter uppercase mb-2">TOURNAMENT HISTORY</h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded text-[9px] font-black uppercase tracking-widest border border-brand-purple/20">Archive</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedSeason} Season (Apr 17 - Jan 17)</span>
            </div>
          </motion.div>

          <div className="relative z-50 w-full md:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto bg-brand-dark border border-brand-purple/50 px-6 py-4 rounded-xl flex items-center justify-between md:justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all font-black text-xs cursor-pointer group shadow-xl shadow-brand-purple/20"
            >
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-brand-purple group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[7px] text-slate-500 uppercase tracking-widest leading-none mb-1">Current Filter</p>
                  <p className="text-transparent bg-clip-text bg-brand-gradient tracking-tight text-[10px] md:text-xs">
                    {selectedSeason} Season
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
                  className="absolute right-0 top-full mt-3 w-full md:w-80 bg-[#0a0a14] border border-white/10 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-50"
                >
                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         Select Season
                       </span>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
                      <div className="grid grid-cols-1 gap-1">
                        {availableSeasons.map(s => (
                          <button 
                            key={s}
                            onClick={() => { setSelectedSeason(s); setIsDropdownOpen(false); }}
                            className={cn(
                              "flex items-center justify-between px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                              selectedSeason === s ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "text-slate-400 hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className={selectedSeason === s ? "text-brand-purple" : "text-slate-600"} />
                              <div className="text-left">
                                <p>{s} Season</p>
                                <p className="text-[8px] text-slate-500 font-bold lowercase tracking-normal">Apr 17 - Jan 17</p>
                              </div>
                            </div>
                            {selectedSeason === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
                          </button>
                        ))}
                      </div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {seasonTournaments.length > 0 ? (
            seasonTournaments.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onOpenTournament(t.id)}
                className="group relative text-left bg-white dark:bg-[#0a0a14] border border-slate-100 dark:border-white/5 rounded-3xl p-6 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-purple/20 dark:hover:border-brand-purple/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors">
                    <Trophy size={24} />
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border",
                    t.status === 'completed' ? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10" : "bg-brand-purple/10 text-brand-purple border-brand-purple/20"
                  )}>
                    {t.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-brand-dark dark:text-white uppercase tracking-tight mb-2 group-hover:text-brand-purple transition-colors line-clamp-2">
                    {t.name}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                     <span>{t.format || 'Unknown Format'}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                     <span>{t.teams?.length || 0} Teams</span>
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                <History size={40} />
              </div>
              <h3 className="text-xl font-black text-brand-dark dark:text-white uppercase tracking-tighter mb-2">No History Found</h3>
              <p className="text-slate-500 text-sm max-w-md">No tournaments are available for the {selectedSeason} season.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Trophy, Filter, ChevronDown, Info, X, Target, Zap, Activity, Flame, Shield, Percent } from 'lucide-react';
import { useFirebase } from '../FirebaseContext';
import { cn, getSeasonInfo, resolveCanonicalTournamentName } from '../lib/utils';
import { useSearchParams } from 'react-router-dom';
import { Player } from '../types';
import { calculateRankingStats } from '../lib/store';

export default function PlayerStats() {
  const { rankedPlayers: players, matches, tournaments } = useFirebase();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const playerIdParam = searchParams.get('id');
  const [selectedSeason, setSelectedSeason] = useState('All Time');
  const [selectedTournament, setSelectedTournament] = useState('All Tournaments');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOvrModalOpen, setIsOvrModalOpen] = useState(false);
  const [isMobileStatsView, setIsMobileStatsView] = useState(false);

  useEffect(() => {
    if (playerIdParam) {
      const p = players.find(player => player.id === playerIdParam);
      if (p) { setSelectedPlayer(p); setIsMobileStatsView(true); }
    } else if (players.length > 0 && !selectedPlayer) {
      if (window.innerWidth > 1024) setSelectedPlayer(players[0]);
    } else if (selectedPlayer) {
      const stillExists = players.find(p => p.id === selectedPlayer.id);
      if (stillExists) setSelectedPlayer(stillExists);
    }
  }, [players, playerIdParam, selectedPlayer]);

  // Available seasons — pulled from pre-computed keys (full history)
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    players.forEach(p => {
      if (p.seasonStats) Object.keys(p.seasonStats).forEach(s => seasons.add(s));
    });
    // Fallback to current season if no stats yet
    seasons.add(getSeasonInfo(new Date()).name);
    return Array.from(seasons).sort().reverse();
  }, [players]);

  const availableTournaments = useMemo(() => {
    const core = ['QVFC ELITE LEAGUE CUP DIVISION 1', 'QVFC ELITE LEAGUE CUP DIVISION 2', 'VORTEX CHAMPIONS CUP', 'VORTEX DOMESTIC CUP'];
    const dynamic = tournaments.map(t => resolveCanonicalTournamentName(t.name));
    // Also pull from pre-computed keys for the selected season
    const fromStats: string[] = [];
    if (selectedSeason !== 'All Time' && selectedPlayer) {
      Object.keys(selectedPlayer.tournamentStats || {}).forEach(key => {
        const [season, ...rest] = key.split('__');
        if (season === selectedSeason && rest.length) fromStats.push(rest.join('__'));
      });
    }
    return Array.from(new Set([...core, ...dynamic, ...fromStats]));
  }, [tournaments, selectedSeason, selectedPlayer]);

  // Compute the displayed player stats — reads from pre-computed fields when available
  const computedPlayer = useMemo(() => {
    if (!selectedPlayer) return null;
    
    let baseData = selectedPlayer;

    // Tournament-specific view: read from pre-computed tournamentStats
    if (selectedSeason !== 'All Time' && selectedTournament !== 'All Tournaments') {
      const canonical = resolveCanonicalTournamentName(selectedTournament);
      const key = `${selectedSeason}__${canonical}`;
      const s = selectedPlayer.tournamentStats?.[key];
      if (s) {
        baseData = { ...selectedPlayer, ...s, ovr: selectedPlayer.ovr };
      } else {
        baseData = { ...selectedPlayer, win: 0, loss: 0, draw: 0, goalsScored: 0, goalsConceded: 0, form: [] };
      }
    }
    // Season-only view: read from pre-computed seasonStats
    else if (selectedSeason !== 'All Time') {
      const s = selectedPlayer.seasonStats?.[selectedSeason];
      if (s) {
        baseData = { ...selectedPlayer, ...s, ovr: selectedPlayer.ovr };
      } else {
        baseData = { ...selectedPlayer, win: 0, loss: 0, draw: 0, goalsScored: 0, goalsConceded: 0, form: [] };
      }
    }

    return {
      ...baseData,
      rankingStats: calculateRankingStats(baseData)
    };
  }, [selectedPlayer, selectedSeason, selectedTournament]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] dark:bg-brand-dark flex flex-col lg:flex-row transition-colors isolate">
      {/* Sidebar Search */}
      <div className={cn("w-full lg:w-80 bg-white dark:bg-white/5 border-r border-slate-100 dark:border-white/10 flex flex-col h-[calc(100vh-80px)] lg:sticky top-[80px] z-10", isMobileStatsView && selectedPlayer ? "hidden lg:flex" : "flex")}>
        <div className="p-6 border-b border-slate-100 dark:border-white/10">
          <h2 className="text-xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">eFOOTBALL ROSTER</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players..."
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:border-brand-purple transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((player) => (
            <button
              key={player.id}
              onClick={() => {
                setSelectedPlayer(player);
                setIsMobileStatsView(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group",
                selectedPlayer?.id === player.id ? "bg-brand-dark dark:bg-brand-purple text-white dark:text-brand-dark shadow-xl shadow-brand-dark/20" : "hover:bg-slate-50 dark:hover:bg-white/5"
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
      <div className={cn("flex-1 p-4 lg:p-12 overflow-y-auto lg:block w-full max-w-full", !isMobileStatsView ? "hidden lg:block" : "block")}>
        <AnimatePresence mode="wait">
          {selectedPlayer ? (
            <motion.div
              key={selectedPlayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8 lg:space-y-12"
            >
              <button 
                onClick={() => setIsMobileStatsView(false)}
                className="lg:hidden flex items-center gap-2 text-[10px] font-black text-brand-dark dark:text-white tracking-widest bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 mb-4 shadow-sm"
              >
                <ChevronRight size={14} className="rotate-180" /> BACK TO ROSTER
              </button>
              {/* Header Card */}
              <div className="relative bg-brand-dark dark:bg-white/5 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-12 text-white border dark:border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <img src={selectedPlayer.image} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-dark dark:from-black via-brand-dark/80 dark:via-black/80 to-transparent" />
                </div>

                {/* Custom Filter Dropdown positioned top right */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-50">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-brand-dark border-brand-purple border px-3 py-2 lg:px-4 lg:py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all font-black text-[10px] lg:text-xs cursor-pointer group shadow-2xl shadow-brand-dark/50"
                  >
                    <Filter size={12} className="text-brand-purple group-hover:rotate-12 transition-transform" />
                    <span className="max-w-[120px] lg:max-w-none truncate">
                      {selectedSeason === 'All Time' 
                        ? 'All Time' 
                        : selectedTournament === 'All Tournaments' 
                          ? `${selectedSeason} Season` 
                          : selectedTournament}
                    </span>
                    <ChevronDown size={14} className={cn("text-brand-purple ml-1 transition-transform", isFilterOpen ? "rotate-180" : "")} />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 lg:w-72 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col z-50"
                      >
                        <div className="p-2 space-y-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
                          <button 
                            onClick={() => { setSelectedSeason('All Time'); setSelectedTournament('All Tournaments'); setIsFilterOpen(false); }}
                            className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", selectedSeason === 'All Time' ? "bg-brand-purple text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                          >
                            All Time
                          </button>
                          
                          <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-purple mt-2 bg-brand-purple/5 rounded-lg border border-brand-purple/10">1. SELECT SEASON</div>
                          {availableSeasons.map(s => (
                            <button 
                              key={s}
                              onClick={() => { 
                                setSelectedSeason(s); 
                                setSelectedTournament('All Tournaments');
                              }}
                              className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase flex justify-between items-center", selectedSeason === s ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "hover:bg-white/5 text-slate-300")}
                            >
                              {s} Season
                              {selectedSeason === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />}
                            </button>
                          ))}

                          <AnimatePresence>
                            {selectedSeason !== 'All Time' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 py-2 text-[9px] font-black tracking-[0.2em] text-brand-purple mt-2 bg-brand-purple/5 rounded-lg border border-brand-purple/10">2. SELECT TOURNAMENT</div>
                                <button 
                                  onClick={() => { setSelectedTournament('All Tournaments'); setIsFilterOpen(false); }}
                                  className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", selectedTournament === 'All Tournaments' ? "bg-brand-purple text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                                >
                                  All Tournaments
                                </button>
                                {availableTournaments.map(t => (
                                  <button 
                                    key={t}
                                    onClick={() => { setSelectedTournament(t); setIsFilterOpen(false); }}
                                    className={cn("w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all tracking-wider uppercase", selectedTournament === t ? "bg-brand-purple text-brand-dark" : "hover:bg-white/5 text-slate-300")}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isFilterOpen && (
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsFilterOpen(false)} />
                )}

                <div className="relative z-10 pt-10 lg:pt-0">
                  <div className="flex items-center gap-4 mb-2 lg:mb-4">
                    <span className="text-brand-purple font-black text-[10px] tracking-[0.4em]">PLAYER PROFILE</span>
                    <button 
                      onClick={() => setIsOvrModalOpen(true)}
                      className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-white transition-colors bg-brand-gradient hover:scale-105 px-3 py-1 rounded-full shadow-lg shadow-brand-purple/20"
                    >
                      <Info size={10} />
                      CALCULATION GUIDE
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-none break-words pr-4">{computedPlayer.name}</h1>
                    {computedPlayer.rankingStats.isProvisional && (
                      <span className="bg-amber-500 text-brand-dark px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-lg shadow-amber-500/20">
                        PROVISIONAL
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 lg:gap-6 items-center">
                    <div className="bg-white/10 px-4 py-2 rounded-2xl lg:rounded-full backdrop-blur-md border border-white/10 shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">JERSEY</p>
                      <p className="text-lg lg:text-xl font-black leading-none">#{computedPlayer.number}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-2xl lg:rounded-full backdrop-blur-md border border-white/10 shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">DEVICE</p>
                      <p className="text-lg lg:text-xl font-black leading-none">{computedPlayer.device || 'N/A'}</p>
                    </div>
                    <div className="bg-brand-gradient px-6 py-2 rounded-2xl lg:rounded-full text-white shrink-0 shadow-lg shadow-brand-purple/20 border border-t-white/20 border-b-black/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none mb-1">FINAL SCORE</p>
                      <p className="text-lg lg:text-xl font-black leading-none italic">{computedPlayer.rankingStats.finalScore}</p>
                    </div>
                    <div className="bg-brand-dark dark:bg-white/5 border border-white/10 px-6 py-2 rounded-2xl lg:rounded-full text-white shrink-0 shadow-xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none mb-1 text-slate-400">OVR (ELO)</p>
                      <p className="text-lg lg:text-xl font-black leading-none">{computedPlayer.ovr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Activity & Outcomes */}
                <StatCard icon={<Activity className="text-brand-purple" />} label="TOTAL MATCHES" value={computedPlayer.rankingStats.matchesPlayed} />
                <StatCard icon={<Zap className="text-green-500" />} label="TOTAL WINS" value={computedPlayer.win} />
                <StatCard icon={<X className="text-red-500" />} label="TOTAL LOSSES" value={computedPlayer.loss} />
                <StatCard icon={<Activity className="text-slate-400" />} label="TOTAL DRAWS" value={computedPlayer.draw} />
                
                {/* 2. Success Rates */}
                <StatCard icon={<Zap className="text-brand-purple" />} label="WIN RATE (RAW)" value={`${Math.round((computedPlayer.win / (computedPlayer.rankingStats.matchesPlayed || 1)) * 100)}%`} />
                <StatCard icon={<Target className="text-brand-purple" />} label="ADJUSTED WINRATE" value={`${computedPlayer.rankingStats.adjustedWinRate}%`} tooltip="WinRate scaled by sample size" />
                
                {/* 3. Competitive Standing */}
                <StatCard icon={<Trophy className="text-brand-purple" />} label="TOTAL POINTS" value={computedPlayer.rankingStats.points} />
                <StatCard icon={<Percent className="text-brand-purple" />} label="CONFIDENCE INDEX" value={`${computedPlayer.rankingStats.confidence}%`} tooltip="Reaches 100% as matches increase" />
                <StatCard icon={<Zap className="text-brand-purple" />} label="CURRENT OVR" value={computedPlayer.ovr} />

                {/* 4. Goal Contribution */}
                <StatCard icon={<Flame className="text-brand-purple" />} label="GOALS SCORED" value={computedPlayer.goalsScored} />
                <StatCard icon={<Shield className="text-brand-purple" />} label="GOALS CONCEDED" value={computedPlayer.goalsConceded} />
                <StatCard icon={<Target className="text-brand-purple" />} label="GOAL DIFFERENCE" value={computedPlayer.goalsScored - computedPlayer.goalsConceded} />
              </div>

              {/* Form & Recent */}
              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 lg:p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
                <h3 className="text-lg font-black text-brand-dark dark:text-white mb-6 tracking-tight">RECENT FORM</h3>
                <div className="grid grid-cols-5 gap-2 lg:gap-4">
                  {(computedPlayer.win > 0 || computedPlayer.loss > 0 || computedPlayer.draw > 0) && computedPlayer.form?.length ? computedPlayer.form.slice(0, 5).map((res, i) => (
                    <div key={i} className={cn(
                      "py-3 lg:py-4 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center border transition-all",
                      res === 'W' ? "bg-brand-purple/10 border-brand-purple/20 text-brand-purple" :
                      res === 'L' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                      "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                    )}>
                      <span className="text-lg lg:text-xl font-black">{res}</span>
                      <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">MATCH {i + 1}</span>
                    </div>
                  )) : (
                    <div className="col-span-5 py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400">NO RECENT MATCH DATA AVAILABLE</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 font-black text-2xl italic text-center px-4">
              SELECT A PLAYER TO VIEW ANALYTICS
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Ranking System Modal */}
      <AnimatePresence>
        {isOvrModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
              onClick={() => setIsOvrModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-brand-dark dark:text-white tracking-tighter">SYSTEM TRANSPARENCY</h3>
                    <p className="text-[10px] font-bold text-brand-purple tracking-widest mt-1 uppercase">CALCULATION & RANKING GUIDE</p>
                  </div>
                  <button onClick={() => setIsOvrModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <X size={16} className="text-slate-500 dark:text-white" />
                  </button>
                </div>

                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest mb-2">1. SKILL RATING (OVR CALCULATION)</p>
                    <p className="text-[11px] leading-relaxed">
                      Your <strong className="text-brand-dark dark:text-white">OVR</strong> is a dynamic skill value calculated using an <strong className="text-white">Adjusted ELO Algorithm</strong>. 
                      Unlike total points, OVR changes based on the <strong className="text-white">Relative Strength</strong> of your opponents.
                    </p>
                    <div className="mt-3 space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <p>• <strong className="text-brand-purple">UPSIDE:</strong> Beating a highly-rated "Elite" player yields a massive OVR boost.</p>
                      <p>• <strong className="text-brand-purple">DOWNSIDE:</strong> Losing to a lower-rated player results in a sharper rating penalty.</p>
                      <p>• <strong className="text-brand-purple">EQUILIBRIUM:</strong> Draws against equally rated players result in minimal OVR movement.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10 space-y-3 text-[11px] leading-relaxed">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">2. GLOBAL RANKING (FINAL SCORE)</p>
                    <p>
                      The <strong className="text-brand-purple">Final Score</strong> is used for leaderboard placement to reward consistency and activity.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <span className="text-brand-purple font-black">•</span>
                        <span><strong className="text-white">50% ACTIVITY:</strong> Total points earned (3 for win, 1 for draw).</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-brand-purple font-black">•</span>
                        <span><strong className="text-white">30% SKILL (ELO):</strong> Your baseline OVR provides a solid foundation.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-brand-purple font-black">•</span>
                        <span><strong className="text-white">20% RELIABILITY:</strong> Adjusted win rate using a confidence factor.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">PROVISIONAL STATUS</p>
                    <p className="text-[11px]">
                      Players with <strong className="text-white">&lt; 10 matches</strong> have a "confidence penalty". This prevents short-term lucky streaks from dominating the rankings.
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest text-center">
                    FAIRNESS • TRANSPARENCY • COMPETITION
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, tooltip }: { icon: React.ReactNode; label: string; value: string | number; tooltip?: string }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl shadow-sm flex items-center gap-4 transition-all hover:scale-[1.01] relative group">
      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
        <div className="scale-75 lg:scale-100">{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase truncate">{label}</p>
        <p className="text-xl lg:text-2xl font-black text-brand-dark dark:text-white leading-none truncate">{value}</p>
      </div>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block bg-brand-dark text-white p-2 rounded-lg text-[8px] font-bold text-center border border-white/10 shadow-2xl z-20">
          {tooltip}
        </div>
      )}
    </div>
  );
}

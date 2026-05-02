import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { calculateRankingStats } from '../lib/store';

export default function EliteRankings() {
  const { rankedPlayers } = useFirebase();

  const topPlayers = useMemo(() => {
    return rankedPlayers.slice(0, 5).map(p => ({
      ...p,
      rankingStats: calculateRankingStats(p)
    }));
  }, [rankedPlayers]);

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">eFOOTBALL ELITE</h2>
          <p className="text-xs font-bold text-slate-400 tracking-widest mt-2 uppercase">BALANCED GLOBAL RANKINGS</p>
        </div>
        <Link to="/rankings" className="text-[10px] font-black tracking-widest text-brand-dark dark:text-brand-purple border-b-2 border-brand-dark dark:border-brand-purple pb-1 hover:opacity-70 transition-opacity">
          VIEW FULL LEADERBOARD
        </Link>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 pb-4 sm:pb-0">
        {topPlayers.map((player, index) => (
          <Link to={`/stats?id=${player.id}`} key={player.id} className="block group w-full shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn("relative rounded-2xl p-3 md:p-8 overflow-hidden transition-colors h-full", index === 0 ? "bg-brand-purple/10 dark:bg-brand-purple/5 border-2 border-brand-purple shadow-[0_0_30px_rgba(139,92,246,0.2)] col-span-1 sm:col-span-2 lg:col-span-1" : "bg-[#f1f5f9] dark:bg-white/5 border border-transparent")}
            >
              {index === 0 && (
                <div className="absolute top-0 right-2 md:right-8 bg-brand-gradient text-white border-l border-r border-b border-white/20 px-2 md:px-4 py-1 md:py-2 font-black text-[6px] md:text-[10px] tracking-widest uppercase rounded-b-xl shadow-lg shadow-brand-purple/20 z-20">
                  TOP PERFORMER
                </div>
              )}
              
              {player.rankingStats.isProvisional && (
                <div className="absolute top-0 left-2 md:left-8 bg-amber-500 text-brand-dark px-2 md:px-3 py-1 font-black text-[6px] md:text-[8px] tracking-widest uppercase rounded-b-lg z-20">
                  PROVISIONAL
                </div>
              )}

              {/* Background Number */}
              <span className={cn("absolute -left-2 md:-left-4 -top-2 md:-top-8 text-[4rem] sm:text-[6rem] md:text-[12rem] font-black leading-none select-none", index === 0 ? "text-brand-purple/20" : "text-slate-200/50 dark:text-white/5")}>
                0{index + 1}
              </span>

              <div className="relative z-10">
                <div className="w-full aspect-square mb-3 md:mb-6 overflow-hidden rounded-xl transition-all duration-500 group-hover:scale-105">
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-[11px] md:text-xl font-black text-brand-dark dark:text-white tracking-tight leading-tight truncate">{player.name}</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    <span className="bg-brand-dark dark:bg-white/10 text-white px-2 py-1 flex items-center justify-center rounded-md text-[9px] md:text-[10px] font-black tracking-widest leading-none">
                      #{index + 1} RANK
                    </span>
                    <span className="bg-brand-gradient text-white border border-white/20 px-2 py-1 flex items-center justify-center rounded-md text-[9px] md:text-[10px] font-black tracking-widest shadow-lg shadow-brand-purple/20 leading-none">
                      {player.ovr} OVR
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] md:text-[10px] font-black text-brand-purple tracking-widest uppercase">SCORE:</span>
                    <span className="text-[10px] md:text-xs font-black text-brand-dark dark:text-white">{player.rankingStats.finalScore}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1 md:gap-4 mt-3 md:mt-8 pt-3 md:pt-6 border-t border-slate-200 dark:border-white/10">
                  <Stat label="MP" value={player.rankingStats.matchesPlayed} />
                  <Stat label="PTS" value={player.rankingStats.points} />
                  <Stat label="WR%" value={`${Math.round((player.win / (player.rankingStats.matchesPlayed || 1)) * 100)}%`} />
                  <Stat label="CONF" value={`${player.rankingStats.confidence}%`} />
                  <Stat label="ADJ" value={`${player.rankingStats.adjustedWinRate}%`} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-brand-dark dark:text-white">{value}</p>
    </div>
  );
}

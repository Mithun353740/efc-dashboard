import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn, getSeasonInfo } from '../lib/utils';
import { Link } from 'react-router-dom';
import { INITIAL_PLAYERS, computePlayerStats, sortRankedPlayers } from '../lib/store';

export default function EliteRankings() {
  const { rankedPlayers, matches } = useFirebase();

  // Get current season matches for "Top Performers This Season"
  const currentSeasonPlayers = useMemo(() => {
    const seasonId = getSeasonInfo(new Date()).name;

    const seasonMatches = matches.filter(m => {
      return getSeasonInfo(new Date(m.timestamp)).name === seasonId;
    });

    const playersWithSeasonStats = rankedPlayers.map(p => {
      const stats = computePlayerStats(p, seasonMatches);
      stats.ovr = p.ovr; // Keep global OVR
      return stats;
    }).filter(p => p.win > 0 || p.loss > 0 || p.draw > 0);

    return sortRankedPlayers(playersWithSeasonStats);
  }, [rankedPlayers, matches]);

  const activePlayers = currentSeasonPlayers.length > 0 ? currentSeasonPlayers : rankedPlayers;
  const topPlayers = activePlayers.slice(0, 5);

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">eFOOTBALL ELITE</h2>
          <p className="text-xs font-bold text-slate-400 tracking-widest mt-2 uppercase">TOP PERFORMERS THIS SEASON</p>
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
              {/* Background Number */}
              <span className={cn("absolute -left-2 md:-left-4 -top-2 md:-top-8 text-[4rem] sm:text-[6rem] md:text-[12rem] font-black leading-none select-none", index === 0 ? "text-brand-purple/20" : "text-slate-200/50 dark:text-white/5")}>
                0{index + 1}
              </span>

              <div className="relative z-10">
                <div className="w-full aspect-square mb-3 md:mb-6 overflow-hidden rounded-xl transition-all duration-500">
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-[11px] md:text-xl font-black text-brand-dark dark:text-white tracking-tight leading-tight truncate">{player.name}</h3>
                <div className="flex items-center gap-1 md:gap-2 mt-1.5 md:mt-2 flex-wrap">
                  <span className="bg-brand-dark dark:bg-white/10 text-white px-2 py-1 md:py-1 flex items-center justify-center rounded-md text-[9px] md:text-[10px] font-black tracking-widest">
                    #{index + 1} RANK
                  </span>
                  <span className="bg-brand-gradient text-white border border-white/20 px-2 py-1 md:py-1 flex items-center justify-center rounded-md text-[9px] md:text-[10px] font-black tracking-widest shadow-lg shadow-brand-purple/20">
                    {player.ovr} OVR
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 md:gap-4 mt-3 md:mt-8 pt-3 md:pt-6 border-t border-slate-200 dark:border-white/10">
                  <Stat label="MP" value={player.win + player.loss + player.draw} />
                  <Stat label="W" value={player.win} />
                  <Stat label="L" value={player.loss} />
                  <Stat label="D" value={player.draw} />
                  <Stat label="WR%" value={`${Math.round((player.win / (player.win + player.loss + player.draw || 1)) * 100)}%`} />
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

import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function EliteRankings() {
  const { rankedPlayers } = useFirebase();
  const topPlayers = rankedPlayers.slice(0, 5);

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">eFOOTBALL ELITE</h2>
          <p className="text-xs font-bold text-slate-400 tracking-widest mt-2 uppercase">TOP PERFORMERS THIS SEASON</p>
        </div>
        <Link to="/rankings" className="text-[10px] font-black tracking-widest text-brand-dark dark:text-brand-green border-b-2 border-brand-dark dark:border-brand-green pb-1 hover:opacity-70 transition-opacity">
          VIEW FULL LEADERBOARD
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {topPlayers.map((player, index) => (
          <Link to={`/stats?id=${player.id}`} key={player.id} className="block group w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn("relative rounded-2xl p-4 md:p-8 overflow-hidden transition-colors h-full", index === 0 ? "bg-brand-green/10 dark:bg-brand-green/5 border-2 border-brand-green shadow-[0_0_30px_rgba(34,197,94,0.15)] col-span-2 lg:col-span-1" : "bg-[#f1f5f9] dark:bg-white/5 border border-transparent")}
            >
              {index === 0 && (
                <div className="absolute top-0 right-4 md:right-8 bg-brand-green text-brand-dark px-2 md:px-4 py-1.5 md:py-2 font-black text-[8px] md:text-[10px] tracking-widest uppercase rounded-b-xl shadow-lg z-20">
                  TOP PERFORMER
                </div>
              )}
              {/* Background Number */}
              <span className={cn("absolute -left-2 md:-left-4 -top-4 md:-top-8 text-[6rem] md:text-[12rem] font-black leading-none select-none", index === 0 ? "text-brand-green/20" : "text-slate-200/50 dark:text-white/5")}>
                0{index + 1}
              </span>

              <div className="relative z-10">
                <div className="w-full aspect-square mb-6 overflow-hidden rounded-xl transition-all duration-500">
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-sm md:text-xl font-black text-brand-dark dark:text-white tracking-tight leading-tight">{player.name}</h3>
                <div className="flex items-center gap-1 md:gap-2 mt-2 flex-wrap">
                  <span className="bg-brand-dark dark:bg-white/10 text-white px-1.5 md:px-2 py-0.5 md:py-1 flex items-center justify-center rounded-md text-[8px] md:text-[10px] font-black tracking-widest">
                    #{index + 1} RANK
                  </span>
                  <span className="bg-brand-green text-brand-dark px-1.5 md:px-2 py-0.5 md:py-1 flex items-center justify-center rounded-md text-[8px] md:text-[10px] font-black tracking-widest">
                    {player.ovr} OVR
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-8 pt-4 md:pt-6 border-t border-slate-200 dark:border-white/10">
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

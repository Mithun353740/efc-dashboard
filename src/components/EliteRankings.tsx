import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';

export default function EliteRankings() {
  const { rankedPlayers } = useFirebase();
  const topPlayers = rankedPlayers.slice(0, 3);

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">eFOOTBALL ELITE</h2>
          <p className="text-xs font-bold text-slate-400 tracking-widest mt-2 uppercase">TOP PERFORMERS THIS SEASON</p>
        </div>
        <a href="/rankings" className="text-[10px] font-black tracking-widest text-brand-dark dark:text-brand-green border-b-2 border-brand-dark dark:border-brand-green pb-1 hover:opacity-70 transition-opacity">
          VIEW FULL LEADERBOARD
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topPlayers.map((player, index) => (
          <a href={`/stats?id=${player.id}`} key={player.id} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn("relative rounded-2xl p-8 overflow-hidden transition-colors", index === 0 ? "bg-brand-green/10 dark:bg-brand-green/5 border-2 border-brand-green shadow-[0_0_30px_rgba(34,197,94,0.15)]" : "bg-[#f1f5f9] dark:bg-white/5 border border-transparent")}
            >
              {index === 0 && (
                <div className="absolute top-0 right-8 bg-brand-green text-brand-dark px-4 py-2 font-black text-[10px] tracking-widest uppercase rounded-b-xl shadow-lg z-20">
                  TOP PERFORMER
                </div>
              )}
              {/* Background Number */}
              <span className={cn("absolute -left-4 -top-8 text-[12rem] font-black leading-none select-none", index === 0 ? "text-brand-green/20" : "text-slate-200/50 dark:text-white/5")}>
                0{index + 1}
              </span>

              <div className="relative z-10">
                <div className="w-full aspect-square mb-6 overflow-hidden rounded-xl transition-all duration-500">
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-xl font-black text-brand-dark dark:text-white tracking-tight">{player.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
                  #{player.number} • {player.ovr} OVR
                </p>

                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                  <Stat label="W" value={player.win} />
                  <Stat label="L" value={player.loss} />
                  <Stat label="D" value={player.draw} />
                  <Stat label="WR%" value={`${Math.round((player.win / (player.win + player.loss + player.draw || 1)) * 100)}%`} />
                </div>
              </div>
            </motion.div>
          </a>
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

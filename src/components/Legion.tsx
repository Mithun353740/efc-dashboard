import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';

export default function Legion() {
  const { players } = useFirebase();

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter whitespace-nowrap">CLUB MEMBERS</h2>
        <div className="h-[2px] w-full bg-slate-200 dark:bg-white/10" />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group w-full"
          >
            <div className="bg-white dark:bg-white/5 rounded-lg md:rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/10 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/5] overflow-hidden transition-all duration-500">
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-1.5 md:p-4">
                <h3 className="text-[7px] md:text-xs font-black text-brand-dark dark:text-white tracking-tight truncate">{player.name}</h3>
                <div className="mt-1 md:mt-2 flex items-center">
                  <span className="bg-brand-gradient text-white border border-white/20 px-1 md:px-2 py-0.5 md:py-1 rounded-sm text-[6px] md:text-[11px] font-black tracking-widest leading-none">
                    {player.ovr} OVR
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-0.5 md:gap-2 mt-2 md:mt-4 pt-1.5 md:pt-3 border-t border-slate-50 dark:border-white/10">
                  <MiniStat label="W" value={player.win} />
                  <MiniStat label="L" value={player.loss} />
                  <MiniStat label="D" value={player.draw} />
                  <MiniStat label="WR%" value={`${Math.round((player.win / (player.win + player.loss + player.draw || 1)) * 100)}%`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-[5px] md:text-[7px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-0.5 md:mb-1">{label}</p>
      <p className="text-[6px] md:text-[9px] font-black text-brand-dark dark:text-white leading-none">{value}</p>
    </div>
  );
}

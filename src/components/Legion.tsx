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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group w-full"
          >
            <div className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/10 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/5] overflow-hidden transition-all duration-500">
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xs font-black text-brand-dark dark:text-white tracking-tight truncate">{player.name}</h3>
                <div className="mt-2 flex items-center">
                  <span className="bg-brand-green text-brand-dark px-2 py-1 rounded-sm text-[11px] font-black tracking-widest">
                    {player.ovr} OVR
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-50 dark:border-white/10">
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
      <p className="text-[7px] font-bold text-slate-300 dark:text-slate-500 tracking-widest mb-0.5">{label}</p>
      <p className="text-[9px] font-black text-brand-dark dark:text-white">{value}</p>
    </div>
  );
}

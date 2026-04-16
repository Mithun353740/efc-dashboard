import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';

export default function Leadership() {
  const { leaders } = useFirebase();

  return (
    <section className="py-20 bg-white dark:bg-brand-dark transition-colors">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-5xl font-black text-brand-dark dark:text-white tracking-tighter leading-[0.9] mb-6">
            eFC<br />LEADERSHIP
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            The tactical masterminds and strategic visionaries guiding Quantum Vortex eFC to global esports dominance.
          </p>

          <div className="space-y-4">
            <div className="bg-[#6b7280] dark:bg-brand-green p-6 rounded-xl text-white dark:text-brand-dark">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-white/20 dark:bg-brand-dark/20 rounded-full flex items-center justify-center text-[10px]">🏆</div>
                <span className="text-[10px] font-black tracking-widest">ELITE GOVERNANCE</span>
              </div>
              <p className="text-[9px] font-bold opacity-70 tracking-widest">STANDARD OF EXCELLENCE</p>
            </div>

            <div className="bg-[#f1f5f9] dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-black tracking-widest text-brand-dark dark:text-brand-green block mb-2">LATEST BRIEFING</span>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight">Strategy shift ahead of the winter qualifiers...</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pt-12"
            >
              <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-8 h-full flex flex-col items-center text-center transition-colors">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-brand-dark shadow-lg overflow-hidden grayscale">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>

                <div className="mt-12 mb-6">
                  <span className="text-[4rem] font-black text-slate-50/50 dark:text-white/5 absolute top-16 left-1/2 -translate-x-1/2 select-none leading-none">
                    {leader.initials}
                  </span>
                  <h3 className="text-lg font-black text-brand-dark dark:text-white relative z-10">{leader.name}</h3>
                  <p className="text-[9px] font-bold text-brand-green tracking-widest mt-1 relative z-10">{leader.role}</p>
                </div>

                <p className="text-[11px] italic text-slate-400 dark:text-slate-500 leading-relaxed mt-auto">
                  "{leader.quote}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import { cn } from '../lib/utils';
import { INITIAL_PLAYERS } from '../lib/store';

export default function Rankings() {
  const { rankedPlayers } = useFirebase();
  const activePlayers = rankedPlayers.length > 0 ? rankedPlayers : INITIAL_PLAYERS;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-brand-dark py-20 px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter leading-none">OFFICIAL<br />eFOOTBALL RANKINGS</h1>
          <p className="text-xs font-bold text-slate-400 tracking-[0.3em] mt-4 uppercase">SEASON 2026 GLOBAL PERFORMANCE DATA</p>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed lg:table-auto min-w-[500px]">
              <thead>
                <tr className="bg-brand-dark dark:bg-brand-green text-white dark:text-brand-dark">
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-8 lg:w-auto text-center lg:text-left">#</th>
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-24 sm:w-auto">PLAYER</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center w-6 lg:w-auto">W</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center w-6 lg:w-auto">D</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center w-6 lg:w-auto">L</th>
                  <th className="hidden lg:table-cell p-6 text-[10px] font-black tracking-widest uppercase text-center">GS</th>
                  <th className="hidden lg:table-cell p-6 text-[10px] font-black tracking-widest uppercase text-center">GC</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center w-8 lg:w-auto">GD</th>
                  <th className="p-1 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase text-center w-8 lg:w-auto">PTS</th>
                  <th className="p-2 lg:p-6 text-[10px] lg:text-[10px] font-black tracking-widest uppercase w-16">FORM</th>
                </tr>
              </thead>
              <tbody>
                {activePlayers.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors",
                      index < 3 && "bg-brand-green/5 dark:bg-brand-green/10"
                    )}
                  >
                    <td className="p-2 lg:p-6 text-center lg:text-left">
                      <span className={cn(
                        "text-xs lg:text-lg font-black",
                        index === 0 ? "text-brand-green" : index < 3 ? "text-brand-dark dark:text-white" : "text-slate-300 dark:text-slate-700"
                      )}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-2 lg:p-6">
                      <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
                        <div className="shrink-0 w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-white/10">
                          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] lg:text-sm font-black text-brand-dark dark:text-white leading-none truncate">{player.name}</p>
                          <p className="hidden sm:block text-[8px] lg:text-[9px] font-bold text-slate-400 mt-1 uppercase truncate">#{player.number} • {player.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.win}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.draw}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400">{player.loss}</td>
                    <td className="hidden lg:table-cell p-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{player.goalsScored}</td>
                    <td className="hidden lg:table-cell p-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{player.goalsConceded}</td>
                    <td className="p-1 lg:p-6 text-center text-[10px] lg:text-sm font-black text-brand-dark dark:text-white">
                      {player.goalsScored - player.goalsConceded > 0 ? '+' : ''}{player.goalsScored - player.goalsConceded}
                    </td>
                    <td className="p-1 lg:p-6 text-center">
                      <span className="bg-brand-dark dark:bg-brand-green text-white dark:text-brand-dark text-[10px] lg:text-xs font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-full">
                        {player.win * 3 + player.draw}
                      </span>
                    </td>
                    <td className="p-2 lg:p-6 text-center">
                      <div className="flex gap-1 justify-center">
                        {(player.win > 0 || player.loss > 0 || player.draw > 0) && player.form?.length ? player.form.map((res, i) => (
                          <div key={i} className={cn(
                            "w-2 h-2 rounded-full",
                            res === 'W' ? 'bg-brand-green' : res === 'L' ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'
                          )} />
                        )) : <span className="text-slate-300 dark:text-slate-700 text-[10px] font-bold">-</span>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

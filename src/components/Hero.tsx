import { motion } from 'motion/react';
import { Player } from '../types';
import { Link } from 'react-router-dom';

interface HeroProps {
  player: Player;
}

export default function Hero({ player }: HeroProps) {
  const nameParts = player.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <section className="relative h-[65svh] min-h-[450px] overflow-hidden bg-brand-dark dark:bg-black transition-colors pt-16 md:pt-0">
      {/* Background with blurred stadium feel */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop)' }}
      />
      
      {/* Player Image - Now visible on all devices, scaled proportionally */}
      <div className="absolute right-0 bottom-0 h-full w-[80%] md:w-1/2 rtl-flip opacity-30 md:opacity-100 z-0 pointer-events-none">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          src={player.image}
          alt={player.name}
          className="h-full w-full object-cover object-top mask-gradient"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 md:via-brand-dark/80 to-transparent dark:from-black dark:via-black/90 md:dark:via-black/80" />

      <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
        <div className="w-full md:w-[60%] z-20 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-brand-green text-brand-dark px-3 py-1 mb-6 rounded-md shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <span className="text-[10px] md:text-[12px] font-black tracking-[0.3em] uppercase">
                #1 RANK • TOP PERFORMER
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter mb-2 uppercase break-words hyphens-auto">
              {firstName}
            </h1>
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-outline text-white leading-none tracking-tighter mb-8 uppercase break-words hyphens-auto">
              {lastName}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/stats?id=${player.id}`} className="bg-brand-green hover:bg-green-500 text-brand-dark font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center">
                VIEW STATS
              </Link>
              <button className="border border-white/30 hover:border-white text-white font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:bg-white/10">
                WATCH HIGHLIGHTS
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

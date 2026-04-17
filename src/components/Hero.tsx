import { motion } from 'motion/react';
import { Player } from '../types';
import { CLUB_TAGLINE } from '../constants';
import { Link } from 'react-router-dom';

interface HeroProps {
  player: Player;
}

export default function Hero({ player }: HeroProps) {
  const nameParts = player.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <section className="relative h-[600px] overflow-hidden bg-brand-dark dark:bg-black transition-colors">
      {/* Background with blurred stadium feel */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark dark:from-black via-brand-dark/80 dark:via-black/80 to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
        <div className="w-full md:w-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black tracking-[0.3em] text-brand-green mb-4 block uppercase">
              {CLUB_TAGLINE}
            </span>
            <h1 className="text-8xl font-black text-white leading-[0.8] tracking-tighter mb-2 uppercase">
              {firstName}
            </h1>
            <h2 className="text-8xl font-black text-outline text-white leading-[0.8] tracking-tighter mb-8 uppercase">
              {lastName}
            </h2>
            
            <div className="flex gap-4">
              <Link to={`/stats?id=${player.id}`} className="bg-brand-green hover:bg-green-500 text-brand-dark font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center">
                VIEW STATS
              </Link>
              <button className="border border-white/30 hover:border-white text-white font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:bg-white/10">
                WATCH HIGHLIGHTS
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute right-0 bottom-0 h-full w-1/2 hidden md:block">
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            src={player.image}
            alt={player.name}
            className="h-full w-full object-cover object-top mask-gradient"
          />
        </div>
      </div>
    </section>
  );
}

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
    <section className="relative min-h-[85vh] md:h-[75vh] md:min-h-[600px] flex flex-col md:flex-row overflow-hidden bg-brand-dark dark:bg-black transition-colors pt-16 md:pt-0">
      {/* Background with blurred stadium feel */}
      <div 
        className="absolute inset-0 opacity-20 md:opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop)' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent md:bg-gradient-to-r md:from-brand-dark md:via-brand-dark/90 md:to-transparent dark:from-black dark:via-black/90 z-10" />

      {/* Text Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-end md:justify-center px-8 pt-12 md:pt-0 max-w-7xl mx-auto w-full order-2 md:order-1 pb-12 md:pb-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-block bg-brand-green text-brand-dark px-3 py-1 mb-4 md:mb-6 rounded-md shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-[10px] md:text-[12px] font-black tracking-[0.3em] uppercase">
              #1 RANK • TOP PERFORMER
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter mb-1 md:mb-2 uppercase break-words hyphens-auto">
            {firstName}
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white/80 md:text-white/50 md:text-outline leading-none tracking-tighter mb-6 md:mb-8 uppercase break-words hyphens-auto">
            {lastName}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to={`/stats?id=${player.id}`} className="bg-brand-green hover:bg-green-500 text-brand-dark font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center text-center">
              VIEW STATS
            </Link>
            <button className="border border-white/30 hover:border-white text-white font-black text-xs tracking-widest px-8 py-4 rounded-full transition-all hover:bg-white/10 text-center">
              WATCH HIGHLIGHTS
            </button>
          </div>
        </motion.div>
      </div>

      {/* Player Image */}
      <div className="relative z-0 h-[45vh] md:absolute md:right-0 md:bottom-0 md:h-full w-full md:w-[50%] order-1 md:order-2 flex items-end justify-center md:justify-end">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          src={player.image}
          alt={player.name}
          className="h-full w-full object-cover object-top md:object-center"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        />
      </div>
    </section>
  );
}

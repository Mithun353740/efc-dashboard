import React from 'react';
import { useLocation } from 'react-router-dom';
import { CLUB_LOGO, CLUB_NAME } from '../constants';

export default function Footer() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname === '/admin') return null;

  return (
    <footer className="bg-[#f1f5f9] dark:bg-[#0f172a] py-12 px-8 border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-brand-dark">
              <img src={CLUB_LOGO} alt={CLUB_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="font-black italic tracking-tighter text-xl text-brand-dark dark:text-white block leading-none">
                {CLUB_NAME}
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-1 block">
                Where Digital Strategy Meets Kinetic Chaos.
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Brand Kit', 'Partnerships'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold text-slate-400 hover:text-brand-dark dark:hover:text-brand-green transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5">
          <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            © 2026 QUANTUM VORTEX FC. ENGINEERED FOR KINETIC PERFORMANCE.
          </p>
        </div>
      </div>
    </footer>
  );
}

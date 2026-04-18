import React, { useState, useEffect } from 'react';
import { Bell, User, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { CLUB_LOGO, CLUB_NAME } from '../constants';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    // Default to dark mode if not explicitly set to false
    const isDarkNow = saved === null ? true : saved === 'true';
    setIsDark(isDarkNow);
    if (isDarkNow) document.documentElement.classList.add('dark');
    
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('adminLoggedIn') === 'true');
    };
    
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  if (location.pathname === '/login' || location.pathname === '/admin') return null;

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('darkMode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-brand-dark border-b border-slate-100 dark:border-white/10 sticky top-0 z-50 transition-colors">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-brand-dark dark:bg-brand-green/10">
          <img 
            src={CLUB_LOGO} 
            alt={CLUB_NAME} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if image fails
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = "w-full h-full flex items-center justify-center text-white dark:text-brand-green font-bold italic";
                fallback.innerText = "V";
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        <span className="font-black italic tracking-tighter text-2xl text-brand-dark dark:text-brand-green">
          {CLUB_NAME}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'HOME', path: '/' },
          { label: 'RANKINGS', path: '/rankings' },
          { label: 'ANALYTICS', path: '/stats' },
          { label: 'TOURNAMENT', path: '/tournament' },
          ...(isAdmin ? [{ label: 'CONTROL CENTER', path: '/admin' }] : [])
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="text-[11px] font-black tracking-widest text-slate-500 hover:text-brand-dark dark:hover:text-brand-green transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDark}
          className="p-2 text-slate-400 hover:text-brand-dark dark:hover:text-brand-green transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {isAdmin ? (
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black tracking-widest hover:bg-red-500/20 transition-all"
          >
            LOGOUT
          </button>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-brand-green text-brand-dark rounded-full text-[10px] font-black tracking-widest hover:scale-105 transition-all"
          >
            LOGIN
          </Link>
        )}

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-brand-dark dark:hover:text-brand-green transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-brand-dark border-b border-slate-100 dark:border-white/10 overflow-hidden md:hidden shadow-2xl"
          >
            <div className="flex flex-col p-4 border-t border-slate-100 dark:border-white/10">
              {[
                { label: 'HOME', path: '/' },
                { label: 'RANKINGS', path: '/rankings' },
                { label: 'ANALYTICS', path: '/stats' },
                { label: 'TOURNAMENT', path: '/tournament' },
                ...(isAdmin ? [{ label: 'CONTROL CENTER', path: '/admin' }] : [])
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="px-4 py-4 text-xs font-black tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <button 
                  onClick={handleLogout}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black tracking-widest hover:bg-red-500/20 transition-all"
                >
                  LOGOUT
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


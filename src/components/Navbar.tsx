import React, { useState, useEffect } from 'react';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { CLUB_LOGO, CLUB_NAME } from '../constants';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setIsDark(saved);
    if (saved) document.documentElement.classList.add('dark');
    
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
        <span className="font-black italic tracking-tighter text-xl text-brand-dark dark:text-white">
          {CLUB_NAME}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
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
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black tracking-widest hover:bg-red-500/20 transition-all"
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
      </div>
    </nav>
  );
}


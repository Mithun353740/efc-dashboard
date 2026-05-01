import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface PlayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerSettingsModal({ isOpen, onClose }: PlayerSettingsModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const playerId = localStorage.getItem('playerId');

  useEffect(() => {
    if (isOpen && playerId) {
      const fetchPlayerData = async () => {
        try {
          const snap = await getDoc(doc(db, 'players', playerId));
          if (snap.exists()) {
            setEmail(snap.data().email || '');
            setPassword(snap.data().password || '');
          }
        } catch (err) {
          console.error('Error fetching player data:', err);
        }
      };
      fetchPlayerData();
    }
  }, [isOpen, playerId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await updateDoc(doc(db, 'players', playerId), {
        email,
        password
      });
      setMsg({ type: 'success', text: 'Credentials updated successfully!' });
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Update failed: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-brand-dark border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-3xl p-10 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-purple/10 blur-[100px] -z-10" />

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Account Settings</h3>
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Manage your legion credentials</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                  <Mail size={12} className="text-brand-purple" />
                  GMAIL / EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                  <Lock size={12} className="text-brand-purple" />
                  PASSWORD
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                  required
                />
              </div>

              {msg.text && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl ${msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                  {msg.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{msg.text}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-gradient text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase italic"
              >
                {isLoading ? 'UPDATING...' : 'UPDATE CREDENTIALS'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

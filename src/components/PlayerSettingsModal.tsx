import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ShieldCheck, AlertCircle, Camera, Cpu, Hash, User } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updatePlayerProfile } from '../lib/store';

// Module-level cache: player profile is fetched once per session.
// Cleared when a profile update succeeds.
let _profileCache: Record<string, { image: string; uid: string; device: string; name: string; email: string; password: string }> = {};
export function clearProfileCache(playerId: string) { delete _profileCache[playerId]; }

interface PlayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const compressImage = (base64Str: string, maxSize = 1200): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = () => resolve(base64Str);
  });
};

export default function PlayerSettingsModal({ isOpen, onClose }: PlayerSettingsModalProps) {
  // Profile fields
  const [image, setImage] = useState('');
  const [uid, setUid] = useState('');
  const [device, setDevice] = useState('');
  const [playerName, setPlayerNameLocal] = useState('');

  // Credentials fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [credsMsg, setCredsMsg] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState('');

  const playerId = localStorage.getItem('playerId');

  useEffect(() => {
    if (isOpen && playerId) {
      // Use cached data if available — no Firestore read needed
      if (_profileCache[playerId]) {
        const c = _profileCache[playerId];
        setImage(c.image); setImagePreview(c.image);
        setUid(c.uid); setDevice(c.device);
        setPlayerNameLocal(c.name);
        setEmail(c.email); setPassword(c.password);
        return;
      }
      const fetchPlayerData = async () => {
        try {
          const snap = await getDoc(doc(db, 'players', playerId));
          if (snap.exists()) {
            const data = snap.data();
            const cached = {
              image: data.image || '', uid: data.uid || '',
              device: data.device || '', name: data.name || '',
              email: data.email || '', password: data.password || '',
            };
            _profileCache[playerId] = cached;
            setImage(cached.image); setImagePreview(cached.image);
            setUid(cached.uid); setDevice(cached.device);
            setPlayerNameLocal(cached.name);
            setEmail(cached.email); setPassword(cached.password);
          }
        } catch (err) {
          console.error('Error fetching player data:', err);
        }
      };
      fetchPlayerData();
    }
  }, [isOpen, playerId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: '❌ File too large (max 5MB)' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      let finalImage = reader.result as string;
      if (file.size > 600 * 1024) finalImage = await compressImage(finalImage);
      setImage(finalImage);
      setImagePreview(finalImage);
      setProfileMsg({ type: '', text: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;
    setIsLoadingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updatePlayerProfile(playerId, {
        image: image || undefined,
        uid: uid || undefined,
        device: device || undefined,
      });
      // Invalidate cache so next open gets fresh data
      clearProfileCache(playerId);
      if (playerId) {
        _profileCache[playerId] = { image, uid, device, name: playerName, email, password };
      }
      setProfileMsg({ type: 'success', text: '✅ Profile updated successfully!' });
      setTimeout(onClose, 1800);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: '❌ ' + (err.message || 'Update failed') });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleCredsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;
    setIsLoadingCreds(true);
    setCredsMsg({ type: '', text: '' });
    try {
      const { db: firebaseDb } = await import('../firebase');
      const { doc: firestoreDoc, updateDoc } = await import('firebase/firestore');
      await updateDoc(firestoreDoc(firebaseDb, 'players', playerId), { email, password });
      setCredsMsg({ type: 'success', text: '✅ Login credentials updated!' });
    } catch (err: any) {
      setCredsMsg({ type: 'error', text: '❌ ' + err.message });
    } finally {
      setIsLoadingCreds(false);
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
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            className="relative w-full max-w-lg bg-white dark:bg-brand-dark border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-purple/10 blur-[120px] -z-10 pointer-events-none" />

            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">My Account</h3>
                  <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">{playerName}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* ─── Profile Picture ─── */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-purple/30 shadow-xl shadow-brand-purple/20">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-purple/10 flex items-center justify-center">
                        <User size={36} className="text-brand-purple/40" />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 rounded-full cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all">
                    <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tap to change photo</p>
              </div>

              {/* ─── Profile Form ─── */}
              <form onSubmit={handleProfileUpdate} className="space-y-5 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                    <Camera size={11} className="text-brand-purple" /> Photo URL (or upload above)
                  </label>
                  <input
                    type="text"
                    value={image && !image.startsWith('data:') ? image : ''}
                    onChange={e => { setImage(e.target.value); setImagePreview(e.target.value); }}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                    placeholder="https://... (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                      <Hash size={11} className="text-brand-purple" /> Game UID
                    </label>
                    <input
                      type="text"
                      value={uid}
                      onChange={e => setUid(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                      placeholder="VORTEX_123"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                      <Cpu size={11} className="text-brand-purple" /> Device
                    </label>
                    <input
                      type="text"
                      value={device}
                      onChange={e => setDevice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                      placeholder="PS5 / PC"
                    />
                  </div>
                </div>

                {profileMsg.text && (
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${profileMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                    {profileMsg.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                    <p className="text-[10px] font-black uppercase tracking-widest">{profileMsg.text}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoadingProfile}
                  className="w-full py-4 bg-brand-gradient text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase italic"
                >
                  {isLoadingProfile ? 'SAVING...' : 'SAVE PROFILE'}
                </button>
              </form>

              {/* ─── Login Credentials Collapsible ─── */}
              <div className="border-t border-slate-100 dark:border-white/10 pt-6">
                <button
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="w-full flex items-center justify-between text-left mb-4 group"
                >
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-brand-purple" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Login Credentials</span>
                  </div>
                  <motion.div animate={{ rotate: showCredentials ? 180 : 0 }} className="text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showCredentials && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCredsUpdate}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                          <Mail size={11} className="text-brand-purple" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                          <Lock size={11} className="text-brand-purple" /> Password
                        </label>
                        <input
                          type="text"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                          required
                        />
                      </div>

                      {credsMsg.text && (
                        <div className={`flex items-center gap-3 p-3 rounded-2xl ${credsMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                          {credsMsg.type === 'success' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                          <p className="text-[10px] font-black uppercase tracking-widest">{credsMsg.text}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoadingCreds}
                        className="w-full py-3 bg-white/5 dark:bg-white/10 border border-white/10 text-slate-700 dark:text-slate-300 font-black text-xs tracking-widest rounded-2xl hover:bg-white/20 transition-all disabled:opacity-50 uppercase"
                      >
                        {isLoadingCreds ? 'UPDATING...' : 'UPDATE CREDENTIALS'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

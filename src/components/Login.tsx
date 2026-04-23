import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginAnonymously, loginWithGoogle } from '../firebase';

export default function Login() {
  const [loginType, setLoginType] = useState<'select' | 'admin' | 'player'>('select');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'QVFC' && pass === 'QVFC_19') {
      setIsLoading(true);
      try {
        await loginAnonymously();
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('userType', 'admin');
        navigate('/admin');
      } catch (err: any) {
        setError('Firebase authentication failed: ' + (err.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handlePlayerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Find player by email and password in Firestore
      const { db } = await import('../firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const q = query(
        collection(db, 'players'), 
        where('email', '==', user), 
        where('password', '==', pass)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const playerDoc = querySnapshot.docs[0];
        const playerData = playerDoc.data();
        localStorage.setItem('playerLoggedIn', 'true');
        localStorage.setItem('playerId', playerDoc.id);
        localStorage.setItem('playerName', playerData.name);
        localStorage.setItem('playerImage', playerData.image || '');
        localStorage.setItem('userType', 'player');
        navigate('/stats'); // Redirect to their stats or home
      } else {
        setError('Invalid player email or password');
      }
    } catch (err: any) {
      setError('Player login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user.email === 'mithun47490@gmail.com') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('userType', 'admin');
        navigate('/admin');
      } else {
        setError('Unauthorized account. Only the club owner can access the Control Center.');
      }
    } catch (err: any) {
      setError('Google Login failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (loginType === 'select') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center text-brand-dark mb-6 shadow-xl shadow-brand-purple/20">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">VORTEX<span className="text-brand-purple">ACCESS</span></h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-4">Select your entry point</p>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => setLoginType('admin')}
              className="group bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-brand-purple/50 transition-all text-left"
            >
              <Shield className="text-brand-purple mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="text-xl font-black text-white uppercase italic">Admin Access</h3>
              <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-2">Manage tournaments & club stats</p>
            </button>

            <button 
              onClick={() => setLoginType('player')}
              className="group bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/50 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Player Access</h3>
              <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-2">View your career & registrations</p>
            </button>
          </div>

          <button onClick={() => navigate('/')} className="w-full mt-8 text-[9px] font-black text-slate-500 hover:text-white tracking-widest transition-colors uppercase">
            RETURN TO PUBLIC SITE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center mb-12">
          <button 
            onClick={() => setLoginType('select')}
            className="self-start text-[9px] font-black text-slate-600 hover:text-brand-purple uppercase tracking-widest mb-6"
          >
            &larr; BACK
          </button>
          <div className={`w-16 h-16 ${loginType === 'admin' ? 'bg-brand-purple' : 'bg-emerald-500'} rounded-2xl flex items-center justify-center text-brand-dark mb-6 shadow-xl`}>
            {loginType === 'admin' ? <Shield size={32} /> : <div className="w-6 h-6 bg-brand-dark rounded-full" />}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
            {loginType === 'admin' ? 'Admin Login' : 'Player Login'}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">
            {loginType === 'admin' ? 'CONTROL CENTER AUTHENTICATION' : 'LEGION MEMBER ACCESS'}
          </p>
        </div>

        <form onSubmit={loginType === 'admin' ? handleAdminLogin : handlePlayerLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">
              {loginType === 'admin' ? 'USERNAME' : 'GMAIL ADDRESS'}
            </label>
            <input
              type={loginType === 'admin' ? 'text' : 'email'}
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
              placeholder={loginType === 'admin' ? 'Admin_19' : 'your@email.com'}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className={`w-full py-4 ${loginType === 'admin' ? 'bg-brand-purple' : 'bg-emerald-600'} text-brand-dark font-black rounded-xl disabled:opacity-50 uppercase text-xs tracking-widest`}
          >
            {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>

          {loginType === 'admin' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
                  <span className="bg-brand-dark px-4 text-slate-500">OR CONTINUE WITH</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-4 bg-brand-gradient text-white border-t border-t-white/10 border-b border-b-black/20 font-black text-xs tracking-widest rounded-xl hover:scale-105 shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Chrome size={18} />
                GOOGLE LOGIN
              </button>
            </>
          )}

          {error && <p className="text-[10px] font-bold text-red-500 text-center">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}

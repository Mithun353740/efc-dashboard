import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginAnonymously, loginWithGoogle } from '../firebase';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'Admin_19' && pass === 'Admin_19#') {
      setIsLoading(true);
      try {
        await loginAnonymously();
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin');
      } catch (err: any) {
        console.error('Login error:', err);
        if (err.code === 'auth/admin-restricted-operation') {
          setError('Username/Password login is currently disabled. Please use Google Login below to access the Control Center.');
        } else {
          setError('Firebase authentication failed: ' + (err.message || 'Unknown error'));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user.email === 'mithun47490@gmail.com') {
        localStorage.setItem('adminLoggedIn', 'true');
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

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center text-brand-dark mb-6 shadow-xl shadow-brand-purple/20">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">eFC ACCESS</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">CONTROL CENTER AUTHENTICATION</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">USERNAME</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs font-bold focus:border-brand-purple outline-none transition-all"
              placeholder="Admin_19"
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
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 uppercase"
          >
            {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>

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

          {error && <p className="text-[10px] font-bold text-red-500 text-center">{error}</p>}
        </form>

        <button onClick={() => navigate('/')} className="w-full mt-8 text-[9px] font-black text-slate-500 hover:text-white tracking-widest transition-colors uppercase">
          RETURN TO PUBLIC SITE
        </button>
      </motion.div>
    </div>
  );
}

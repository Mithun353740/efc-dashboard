import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Trophy, Users, LayoutDashboard, LogOut, X, ShieldCheck, ChevronDown, Key, Mail, Lock, History, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savePlayer, deletePlayer, addMatch, editMatch, deleteMatchFromHistory, saveLeader, deleteLeader, computeGlobalElo, calculateOvrHybrid, recalculateAllStats, toggleSystemLock } from '../lib/store';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { NativeTournamentPage } from './tournament/NativeTournamentPage';
import { Player, Leader, MatchRecord } from '../types';
import { cn } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';
import { auth, loginAnonymously, db } from '../firebase';
import { CLUB_LOGO, CLUB_NAME } from '../constants';

export default function Admin() {
  const { players, leaders, matches, tournaments, systemLocks, dbError, hasPendingWrites } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'leadership' | 'history' | 'tournaments' | 'locks' | 'credentials'>('players');
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
        // Try to re-login anonymously if localStorage says we should be logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
          loginAnonymously().catch(err => {
            console.error('Auto-login failed:', err);
            if (err.code === 'auth/admin-restricted-operation') {
              setAuthStatus('unauthenticated');
              // Silent fail for auto-login, the user will see the message on the login page
            }
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Player Form
  const DEFAULT_PLAYER: Partial<Player> = { name: '', number: '', device: 'PS5', uid: '', image: '', role: 'player' };
  
  const [newPlayer, setNewPlayer] = useState(DEFAULT_PLAYER);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerMsg, setPlayerMsg] = useState({ text: '', type: '' });
  const [playerNameSearch, setPlayerNameSearch] = useState('');
  const [playerNumberSearch, setPlayerNumberSearch] = useState('');
  
  // Leader Form
  const [newLeader, setNewLeader] = useState({ name: '', role: '', quote: '', initials: '', playerId: '', image: '' });
  const [leaderMsg, setLeaderMsg] = useState({ text: '', type: '' });
  
  // Match Form
  const [match, setMatch] = useState({ p1Id: '', p1Score: '', p2Score: '', p2Id: '', isExternal: false, tournament: 'Friendly' });
  const [matchMsg, setMatchMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchRecord | null>(null);
  const [editMatchScore1, setEditMatchScore1] = useState('');
  const [editMatchScore2, setEditMatchScore2] = useState('');
  const [editMatchTournament, setEditMatchTournament] = useState('');
  
  // Match History Filters
  const [historyFilter, setHistoryFilter] = useState('All');

  const historyMatches = useMemo(() => {
    const duration = 15 * 24 * 60 * 60 * 1000;
    const recent = matches.filter(m => Date.now() - m.timestamp <= duration);
    if (historyFilter === 'All') return recent;
    return recent.filter(m => (m.tournament || 'Friendly') === historyFilter);
  }, [matches, historyFilter]);

  const historyTournaments = useMemo(() => {
    const tNames = new Set<string>(['All', 'Friendly']);
    const duration = 15 * 24 * 60 * 60 * 1000;
    matches.forEach(m => {
      if (Date.now() - m.timestamp <= duration) {
        tNames.add(m.tournament || 'Friendly');
      }
    });
    return Array.from(tNames);
  }, [matches]);
  
  // Suggestions
  const [p1Search, setP1Search] = useState('');
  const [p2Search, setP2Search] = useState('');
  const [delSearch, setDelSearch] = useState('');
  const [leaderPlayerSearch, setLeaderPlayerSearch] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [leaderToDelete, setLeaderToDelete] = useState<string | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  const [showAdminWarning, setShowAdminWarning] = useState(false);

  const compressImage = (base64Str: string, maxWidth = 1600, maxHeight = 1600): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let currentWidth = img.width;
        let currentHeight = img.height;

        let finalWidth = currentWidth;
        let finalHeight = currentHeight;

        if (finalWidth > finalHeight) {
          if (finalWidth > maxWidth) {
            finalHeight *= maxWidth / finalWidth;
            finalWidth = maxWidth;
          }
        } else {
          if (finalHeight > maxHeight) {
            finalWidth *= maxHeight / finalHeight;
            finalHeight = maxHeight;
          }
        }

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = currentWidth;
        canvas.height = currentHeight;
        ctx?.drawImage(img, 0, 0);

        // Step-down resizing for crystal clear quality
        while (currentWidth * 0.5 > finalWidth) {
          currentWidth *= 0.5;
          currentHeight *= 0.5;
          const stepCanvas = document.createElement('canvas');
          stepCanvas.width = currentWidth;
          stepCanvas.height = currentHeight;
          const stepCtx = stepCanvas.getContext('2d');
          stepCtx?.drawImage(canvas, 0, 0, currentWidth, currentHeight);
          canvas = stepCanvas;
        }

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;
        const finalCtx = finalCanvas.getContext('2d');
        if (finalCtx) {
          finalCtx.imageSmoothingEnabled = true;
          finalCtx.imageSmoothingQuality = 'high';
        }
        finalCtx?.drawImage(canvas, 0, 0, finalWidth, finalHeight);

        // Use 0.75 compression for the perfect balance of "Crystal Clear" quality and database speed
        resolve(finalCanvas.toDataURL('image/jpeg', 0.75));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'player' | 'leader') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPlayerMsg({ text: '❌ File too large (max 5MB)', type: 'error' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        let finalImage = reader.result as string;
        
        // If the file is under 600KB, DO NOT compress it. 
        // This preserves 100% untouched, pixel-perfect original quality.
        // Base64 adds ~33% size, so 600KB raw = ~800KB base64, safely under Firestore 1MB limit.
        if (file.size > 600 * 1024) {
          finalImage = await compressImage(reader.result as string);
        }

        if (target === 'player') {
          setNewPlayer({ ...newPlayer, image: finalImage });
        } else {
          setNewLeader({ ...newLeader, image: finalImage });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authStatus !== 'authenticated') {
      setPlayerMsg({ text: '❌ Not authenticated with Firebase. Please try logging in again.', type: 'error' });
      return;
    }
    if (!newPlayer.name || !newPlayer.number) {
      setPlayerMsg({ text: '❌ Name and Number are required', type: 'error' });
      return;
    }

    if (players.some(p => p.name.toLowerCase() === newPlayer.name.toLowerCase() && p.id !== editingPlayerId)) {
      setPlayerMsg({ text: '❌ Player name already exists', type: 'error' });
      return;
    }

    if (players.some(p => p.number === newPlayer.number && p.id !== editingPlayerId)) {
      setPlayerMsg({ text: '❌ Jersey number already exists', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting player save process...');
    
    const existingPlayer = editingPlayerId ? players.find(p => p.id === editingPlayerId) : null;

    const player: Player = {
      ...existingPlayer,
      id: editingPlayerId || (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
      name: newPlayer.name.toUpperCase(),
      number: newPlayer.number,
      position: 'ANY',
      ovr: existingPlayer ? existingPlayer.ovr : 60,
      win: existingPlayer ? existingPlayer.win : 0,
      loss: existingPlayer ? existingPlayer.loss : 0,
      draw: existingPlayer ? existingPlayer.draw : 0,
      goalsScored: existingPlayer ? existingPlayer.goalsScored : 0,
      goalsConceded: existingPlayer ? existingPlayer.goalsConceded : 0,
      image: newPlayer.image || existingPlayer?.image || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=400&auto=format&fit=crop',
      form: existingPlayer ? existingPlayer.form : [],
      device: newPlayer.device,
      uid: newPlayer.uid,
      role: newPlayer.role as 'admin' | 'player'
    };

    try {
      await savePlayer(player);
      setPlayerMsg({ text: editingPlayerId ? '✅ Player updated successfully' : '✅ Player added successfully', type: 'success' });
      setNewPlayer(DEFAULT_PLAYER);
      setEditingPlayerId(null);
      setPlayerNameSearch('');
      setPlayerNumberSearch('');
    } catch (err) {
      console.error('Error saving player:', err);
      setPlayerMsg({ text: `❌ Failed to save player: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
    } finally {
      console.log('Player save process finished');
      setIsSubmitting(false);
    }
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authStatus !== 'authenticated') {
      setLeaderMsg({ text: '❌ Not authenticated with Firebase.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    const leader: Leader = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      name: newLeader.name || 'NEW LEADER',
      role: newLeader.role || 'STAFF',
      image: newLeader.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
      quote: newLeader.quote || '',
      initials: newLeader.initials || 'LDR',
      playerId: newLeader.playerId || undefined
    };

    try {
      await saveLeader(leader);
      setLeaderMsg({ text: '✅ Leader added successfully', type: 'success' });
      setNewLeader({ name: '', role: '', quote: '', initials: '', playerId: '', image: '' });
      setLeaderPlayerSearch('');
    } catch (err) {
      console.error('Error adding leader:', err);
      setLeaderMsg({ text: `❌ Failed to save leader: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLeader = async (id: string, confirmSubmit: boolean = false) => {
    if (!confirmSubmit) {
      setLeaderToDelete(id);
      return;
    }
    try {
      await deleteLeader(id);
      setLeaderMsg({ text: '✅ Leader deleted successfully', type: 'success' });
      setLeaderToDelete(null);
    } catch (err) {
      console.error('Error deleting leader:', err);
      setLeaderMsg({ text: `❌ Failed to delete leader: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
      setLeaderToDelete(null);
    }
  };

  const handleDelete = async (id: string, confirmSubmit: boolean = false) => {
    if (!confirmSubmit) {
      setPlayerToDelete(id);
      return;
    }
    try {
      await deletePlayer(id);
      setDelSearch('');
      setPlayerMsg({ text: '✅ Player deleted successfully', type: 'success' });
      setPlayerToDelete(null);
    } catch (err) {
      console.error('Error deleting player:', err);
      setPlayerMsg({ text: `❌ Failed to delete player: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
      setPlayerToDelete(null);
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authStatus !== 'authenticated') {
      setMatchMsg({ text: '❌ Not authenticated with Firebase.', type: 'error' });
      return;
    }

    // Strict validation for Player 1
    const p1 = players.find(p => p.id === match.p1Id || p.name.toLowerCase() === p1Search.trim().toLowerCase());
    if (!p1) {
      setMatchMsg({ text: '❌ Invalid Club Player (P1). Please select from the search suggestions.', type: 'error' });
      return;
    }

    // Strict validation for Player 2
    let p2: Player | undefined = undefined;
    if (!match.isExternal) {
      p2 = players.find(p => p.id === match.p2Id || p.name.toLowerCase() === p2Search.trim().toLowerCase());
      if (!p2) {
        setMatchMsg({ text: '❌ Invalid Opponent. Please select from search suggestions or toggle EXTERNAL.', type: 'error' });
        return;
      }
    }

    if (match.p1Score === '' || match.p2Score === '') {
      setMatchMsg({ text: '❌ Please enter scores for both players.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMatchMsg({ text: '', type: '' });
    try {
      await addMatch(p1, Number(match.p1Score), Number(match.p2Score), p2, matches, match.tournament, match.isExternal ? p2Search : undefined);
      setMatchMsg({ text: '✅ Match recorded', type: 'success' });
      setMatch({ p1Id: '', p1Score: '', p2Score: '', p2Id: '', isExternal: false, tournament: 'QVFC Elite League Cup Division 1' });
      setP1Search('');
      setP2Search('');
    } catch (err) {
      console.error('Error recording match:', err);
      setMatchMsg({ text: `❌ Failed to record match: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    if (editMatchScore1 === '' || editMatchScore2 === '') {
      alert("Please ensure both scores are filled to update a match.");
      return;
    }
    
    try {
      await editMatch(editingMatch, Number(editMatchScore1), Number(editMatchScore2), players, matches, editMatchTournament);
      setEditingMatch(null);
      setEditMatchScore1('');
      setEditMatchScore2('');
      setEditMatchTournament('');
    } catch (err) {
      console.error('Error editing match:', err);
      alert("Failed to save match: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteMatch = async (m: MatchRecord) => {
    try {
      await deleteMatchFromHistory(m, players, matches);
    } catch (err) {
      console.error('Error deleting match:', err);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0 rounded-full overflow-hidden bg-[#020617] border border-brand-purple/40 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.8)]">
            <img src={CLUB_LOGO} alt={CLUB_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-brand-gradient">{CLUB_NAME}</h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 tracking-widest uppercase">CONTROL CENTER</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center md:justify-end">
          {hasPendingWrites && (
            <div className="px-3 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-full text-[7px] md:text-[8px] font-black tracking-widest flex items-center gap-2 animate-pulse">
              <div className="w-1 h-1 rounded-full bg-brand-purple" />
              SYNCING...
            </div>
          )}
          {authStatus === 'unauthenticated' && (
            <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[7px] md:text-[8px] font-black tracking-widest animate-pulse">
              AUTH REQUIRED
            </div>
          )}
          {dbError === 'QUOTA_EXCEEDED' ? (
            <div className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[7px] md:text-[8px] font-black tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-rose-500" />
              QUOTA EXCEEDED
            </div>
          ) : (
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[7px] md:text-[8px] font-black tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ACTIVE
            </div>
          )}
          <button 
            onClick={async () => {
              setIsResyncing(true);
              try {
                await recalculateAllStats(players, matches);
                alert('All player stats resynced successfully based on Match History.');
              } catch(e) {
                alert('Failed to resync stats. If quota is still exceeded, this will fail.');
              }
              setIsResyncing(false);
            }} 
            disabled={isResyncing}
            className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all disabled:opacity-50"
          >
            {isResyncing ? 'SYNCING...' : 'FORCE RESYNC'}
          </button>
          <button onClick={() => navigate('/')} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all">
            HOME
          </button>
          <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/login'); }} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar snap-x">
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'players'} onClick={() => setActiveTab('players')} icon={<Users size={18} />} label="PLAYERS" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'credentials'} onClick={() => setActiveTab('credentials')} icon={<Key size={18} />} label="CREDENTIALS" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={<LayoutDashboard size={18} />} label="MATCHES" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'leadership'} onClick={() => setActiveTab('leadership')} icon={<ShieldCheck size={18} />} label="LEADERSHIP" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={18} />} label="HISTORY" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'tournaments'} onClick={() => setActiveTab('tournaments')} icon={<Trophy size={18} />} label="TOURNAMENTS" /></div>
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'locks'} onClick={() => setActiveTab('locks')} icon={<ShieldCheck size={18} />} label="LOCKS" /></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {dbError === 'QUOTA_EXCEEDED' ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-xl text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-rose-500 tracking-tighter mb-4 uppercase">CONTROL CENTER LOCKED</h2>
              <p className="text-slate-400 font-bold tracking-tight max-w-md mb-8">Firebase Free Tier Quota Exceeded. The Control Center is temporarily locked to prevent out-of-sync local updates.</p>
              <div className="bg-brand-dark border border-white/10 p-6 rounded-xl w-full max-w-md">
                <p className="text-[10px] font-black tracking-widest text-slate-300 mb-2 uppercase">System Status</p>
                <p className="text-[10px] font-bold text-slate-500">Live data fetching and dynamic updates are paused. The system will unlock automatically at midnight Pacific Time.</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'players' ? (
              <motion.div key="players" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Player */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black tracking-tight">{editingPlayerId ? 'UPDATE PLAYER INFO' : 'ADD PLAYER'}</h3>
                    {editingPlayerId && (
                      <button 
                        onClick={() => {
                          setEditingPlayerId(null);
                          setNewPlayer(DEFAULT_PLAYER);
                          setPlayerNameSearch('');
                        }}
                        className="text-[10px] font-black text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded-full"
                      >
                        CANCEL EDIT
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleAddPlayer} className="space-y-4">
                    <div className="relative">
                      <Input 
                        label="NAME" 
                        value={newPlayer.name} 
                        onChange={v => {
                          setNewPlayer({...newPlayer, name: v});
                          setPlayerNameSearch(v);
                        }} 
                        placeholder="Full Name" 
                      />
                      <AnimatePresence>
                        {playerNameSearch && !editingPlayerId && players.some(p => p.name.toLowerCase().includes(playerNameSearch.toLowerCase())) && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <div className="p-2 border-b border-white/5 bg-white/5">
                              <p className="text-[8px] font-black text-slate-500 uppercase">EXISTING PLAYERS (CLICK TO EDIT INFO)</p>
                            </div>
                            {players.filter(p => p.name.toLowerCase().includes(playerNameSearch.toLowerCase())).slice(0, 5).map(p => (
                              <button 
                                key={p.id} 
                                type="button"
                                onClick={() => {
                                  setEditingPlayerId(p.id);
                                  setNewPlayer({
                                    name: p.name,
                                    number: p.number,
                                    device: p.device,
                                    uid: p.uid,
                                    image: p.image,
                                    role: p.role || 'player'
                                  });
                                  setPlayerNameSearch(p.name);
                                }}
                                className="w-full p-3 flex items-center justify-between border-b border-white/5 hover:bg-white/5 cursor-pointer text-left last:border-0"
                              >
                                <div>
                                  <p className="text-[10px] font-black">{p.name}</p>
                                  <p className="text-[8px] font-bold text-slate-500">#{p.number}</p>
                                </div>
                                <div className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-[7px] font-black rounded uppercase">
                                  EDIT
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Input 
                          label="JERSEY #" 
                          value={newPlayer.number} 
                          onChange={v => {
                            setNewPlayer({...newPlayer, number: v});
                            setPlayerNumberSearch(v);
                          }} 
                          placeholder="00" 
                        />
                        <AnimatePresence>
                          {playerNumberSearch && players.some(p => p.number === playerNumberSearch && p.id !== editingPlayerId) && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                              <div className="p-2 border-b border-white/5 bg-white/5">
                                <p className="text-[8px] font-black text-slate-500 uppercase">NUMBER ALREADY TAKEN</p>
                              </div>
                              {players.filter(p => p.number === playerNumberSearch && p.id !== editingPlayerId).map(p => (
                                <div key={p.id} className="w-full p-3 flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] font-black">{p.name}</p>
                                    <p className="text-[8px] font-bold text-slate-500">#{p.number}</p>
                                  </div>
                                  <div className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[7px] font-black rounded uppercase">
                                    IN USE
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                        <Input label="UID (GAME ID)" value={newPlayer.uid} onChange={v => setNewPlayer({...newPlayer, uid: v})} placeholder="VORTEX_123" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="DEVICE" value={newPlayer.device} onChange={v => setNewPlayer({...newPlayer, device: v})} placeholder="PS5 / PC" />
                      <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                          ADMIN PRIVILEGES
                          <ShieldCheck size={10} className={newPlayer.role === 'admin' ? "text-brand-purple" : "text-slate-600"} />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (newPlayer.role !== 'admin') {
                              setShowAdminWarning(true);
                            } else {
                              setNewPlayer({ ...newPlayer, role: 'player' });
                            }
                          }}
                          className={cn(
                            "w-full p-4 rounded-xl text-[10px] font-black tracking-widest transition-all border uppercase",
                            newPlayer.role === 'admin' 
                              ? "bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                              : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                          )}
                        >
                          {newPlayer.role === 'admin' ? '✓ ADMIN GRANTED' : 'GRANT ADMIN'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">PICTURE (UPLOAD OR PASTE URL)</label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer bg-white/5 border border-white/10 border-dashed p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                          <span className="text-[10px] font-bold text-slate-400">
                            {newPlayer.image && newPlayer.image.startsWith('data:') ? '✅ UPLOADED' : 'UPLOAD FROM DEVICE'}
                          </span>
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'player')} className="hidden" />
                        </label>
                        <div className="flex-[2]">
                          <input 
                            type="text" 
                            value={newPlayer.image && !newPlayer.image.startsWith('data:') ? newPlayer.image : ''} 
                            onChange={e => setNewPlayer({...newPlayer, image: e.target.value})} 
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all"
                            placeholder="OR PASTE DIRECT IMAGE URL"
                          />
                        </div>
                        {newPlayer.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                            <img src={newPlayer.image} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 disabled:scale-100 uppercase"
                    >
                      {isSubmitting ? 'SAVING...' : editingPlayerId ? 'UPDATE PLAYER' : 'CREATE PLAYER'}
                    </button>
                    {playerMsg.text && <p className={cn("text-[10px] font-bold text-center mt-2", playerMsg.type === 'success' ? 'text-brand-purple' : 'text-red-500')}>{playerMsg.text}</p>}
                  </form>
                </div>

                {/* Delete Player */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-black mb-6 tracking-tight">DELETE PLAYER</h3>
                  <div className="relative">
                    <Input label="SEARCH PLAYER" value={delSearch} onChange={v => { setDelSearch(v); setPlayerToDelete(null); }} placeholder="Type name..." />
                    <AnimatePresence>
                      {delSearch && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                          {players.filter(p => p.name.toLowerCase().includes(delSearch.toLowerCase())).map(p => (
                            <button 
                              key={p.id} 
                              onClick={() => playerToDelete === p.id ? handleDelete(p.id, true) : setPlayerToDelete(p.id)} 
                              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                            >
                              <div>
                                <p className="text-xs font-black">{p.name}</p>
                                <p className="text-[9px] font-bold text-slate-500">#{p.number} • {p.position}</p>
                              </div>
                              {playerToDelete === p.id ? (
                                <button type="button" onClick={() => handleDelete(p.id, true)} disabled={isSubmitting} className="text-[10px] font-black text-white bg-red-500/80 px-3 py-1.5 rounded uppercase tracking-wider disabled:opacity-50">
                                  {isSubmitting ? 'DELETING...' : 'TAP TO CONFIRM'}
                                </button>
                              ) : (
                                <Trash2 size={14} className="text-red-500" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'matches' ? (
              <motion.div key="matches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <h3 className="text-xl font-black mb-8 tracking-tight">RECORD MATCH</h3>
                <form onSubmit={handleAddMatch} className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Player 1 */}
                    <div className="flex-1 w-full space-y-4">
                      <div className="relative">
                        <Input label="CLUB PLAYER" value={p1Search} onChange={v => { setP1Search(v); setMatch({...match, p1Id: ''}); }} placeholder="Search..." />
                        <AnimatePresence>
                          {p1Search && !match.p1Id && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                              {players.filter(p => p.name.toLowerCase().includes(p1Search.toLowerCase())).map(p => (
                                <button key={p.id} type="button" onClick={() => { setMatch({...match, p1Id: p.id}); setP1Search(p.name); }} className="w-full p-4 hover:bg-white/5 transition-colors text-left">
                                  <p className="text-xs font-black">{p.name}</p>
                                  <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <input type="number" value={match.p1Score} onChange={e => setMatch({...match, p1Score: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-4xl font-black text-center focus:border-brand-purple outline-none transition-all" placeholder="0" />
                    </div>

                    <div className="text-brand-purple font-black text-2xl italic">VS</div>

                    {/* Player 2 */}
                    <div className="flex-1 w-full space-y-4">
                      <div className="relative">
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">OPPONENT</label>
                          <button type="button" onClick={() => setMatch({...match, isExternal: !match.isExternal, p2Id: ''})} className={cn("text-[8px] font-black px-2 py-0.5 rounded border transition-all", match.isExternal ? "bg-brand-purple text-brand-dark border-brand-purple" : "border-white/20 text-white/40")}>
                            {match.isExternal ? 'EXTERNAL' : 'CLUB'}
                          </button>
                        </div>
                        {!match.isExternal ? (
                          <>
                            <input value={p2Search} onChange={e => { setP2Search(e.target.value); setMatch({...match, p2Id: ''}); }} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="Search club player..." />
                            <AnimatePresence>
                              {p2Search && !match.p2Id && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                  {players.filter(p => p.name.toLowerCase().includes(p2Search.toLowerCase()) && p.id !== match.p1Id).map(p => (
                                    <button key={p.id} type="button" onClick={() => { setMatch({...match, p2Id: p.id}); setP2Search(p.name); }} className="w-full p-4 hover:bg-white/5 transition-colors text-left">
                                      <p className="text-xs font-black">{p.name}</p>
                                      <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <input 
                            value={p2Search} 
                            onChange={e => setP2Search(e.target.value)} 
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-brand-purple outline-none transition-all" 
                            placeholder="External Opponent Name (Optional)" 
                          />
                        )}
                      </div>
                      <input type="number" value={match.p2Score} onChange={e => setMatch({...match, p2Score: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-4xl font-black text-center focus:border-brand-purple outline-none transition-all" placeholder="0" />
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">MATCH TYPE / TOURNAMENT</label>
                    <div className="relative">
                      <select 
                        value={match.tournament}
                        onChange={e => setMatch({...match, tournament: e.target.value})}
                        className={cn(
                          "w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer",
                          match.isExternal && !match.tournament ? "border-amber-500/30" : ""
                        )}
                      >
                        <option value="Friendly" className="bg-brand-dark">Friendly / Internal Match</option>
                        <option value="QVFC Elite League Cup Division 1" className="bg-brand-dark">QVFC Elite League Cup Div 1</option>
                        <option value="QVFC Elite League Cup Division 2" className="bg-brand-dark">QVFC Elite League Cup Div 2</option>
                        <option value="Vortex Champions Cup" className="bg-brand-dark">Vortex Champions Cup</option>
                        <option value="Vortex Domestic Cup" className="bg-brand-dark">Vortex Domestic Cup</option>
                        {tournaments.map(t => (
                          <option key={t.id} value={t.name} className="bg-brand-dark">{t.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-purple">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                    {match.isExternal && !match.tournament && (
                      <p className="text-[8px] font-bold text-amber-500/70 uppercase tracking-widest mt-1">Tournament selection optional for external matches</p>
                    )}
                  </div>

                  <button className="w-full py-6 glossy-btn rounded-2xl disabled:opacity-50 disabled:hover:scale-100" disabled={isSubmitting}>
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT MATCH RESULTS'}
                  </button>
                  {matchMsg.text && <p className={cn("text-[10px] font-bold text-center mt-2", matchMsg.type === 'success' ? 'text-brand-purple' : 'text-red-500')}>{matchMsg.text}</p>}
                </form>
              </motion.div>
            ) : activeTab === 'leadership' ? (
              <motion.div key="leadership" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Leader */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-black mb-6 tracking-tight">ADD LEADERSHIP</h3>
                  <form onSubmit={handleAddLeader} className="space-y-4">
                    <div className="relative">
                      <Input label="LINK TO PLAYER (OPTIONAL)" value={leaderPlayerSearch} onChange={v => { setLeaderPlayerSearch(v); setNewLeader({...newLeader, playerId: ''}) }} placeholder="Search player..." />
                      <AnimatePresence>
                        {leaderPlayerSearch && !newLeader.playerId && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            {players.filter(p => p.name.toLowerCase().includes(leaderPlayerSearch.toLowerCase())).map(p => (
                              <button key={p.id} type="button" onClick={() => { setNewLeader({...newLeader, playerId: p.id, name: p.name, image: p.image}); setLeaderPlayerSearch(p.name); }} className="w-full p-4 hover:bg-white/5 transition-colors text-left">
                                <p className="text-xs font-black">{p.name}</p>
                                <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!newLeader.playerId && (
                      <>
                        <div className="relative">
                          <Input 
                            label="NAME" 
                            value={newLeader.name} 
                            onChange={v => setNewLeader({...newLeader, name: v})} 
                            placeholder="Full Name" 
                          />
                          <AnimatePresence>
                            {newLeader.name && players.some(p => p.name.toLowerCase().includes(newLeader.name.toLowerCase())) && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <div className="p-2 border-b border-white/5 bg-white/5">
                                  <p className="text-[8px] font-black text-slate-500 uppercase">EXISTING PLAYERS (LINK INSTEAD?)</p>
                                </div>
                                {players.filter(p => p.name.toLowerCase().includes(newLeader.name.toLowerCase())).slice(0, 3).map(p => (
                                  <button 
                                    key={p.id} 
                                    type="button" 
                                    onClick={() => {
                                      setNewLeader({...newLeader, playerId: p.id, name: p.name, image: p.image});
                                      setLeaderPlayerSearch(p.name);
                                    }}
                                    className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                  >
                                    <div>
                                      <p className="text-[10px] font-black">{p.name}</p>
                                      <p className="text-[8px] font-bold text-slate-500">#{p.number}</p>
                                    </div>
                                    <div className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-[7px] font-black rounded uppercase">
                                      LINK
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">PICTURE (OPTIONAL)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer bg-white/5 border border-white/10 border-dashed p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                              <span className="text-[10px] font-bold text-slate-400">
                                {newLeader.image ? '✅ IMAGE SELECTED' : 'UPLOAD PICTURE'}
                              </span>
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'leader')} className="hidden" />
                            </label>
                            {newLeader.image && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                                <img src={newLeader.image} className="w-full h-full object-cover" alt="Preview" />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="ROLE" value={newLeader.role} onChange={v => setNewLeader({...newLeader, role: v})} placeholder="PRESIDENT, COACH, etc" />
                      <Input label="INITIALS" value={newLeader.initials} onChange={v => setNewLeader({...newLeader, initials: v})} placeholder="PRES" />
                    </div>
                    <Input label="QUOTE (OPTIONAL)" value={newLeader.quote} onChange={v => setNewLeader({...newLeader, quote: v})} placeholder="Inspirational quote..." />
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 disabled:hover:scale-100 uppercase">
                      {isSubmitting ? 'ADDING...' : 'ADD TO LEADERSHIP'}
                    </button>
                    {leaderMsg.text && <p className="text-[10px] font-bold text-brand-purple text-center mt-2">{leaderMsg.text}</p>}
                  </form>
                </div>

                {/* Current Leaders */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-black mb-6 tracking-tight">CURRENT LEADERSHIP</h3>
                  <div className="space-y-4">
                    {leaders.map(leader => (
                      <div key={leader.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                            <img src={leader.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="text-xs font-black">{leader.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">{leader.role}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => leaderToDelete === leader.id ? handleDeleteLeader(leader.id, true) : setLeaderToDelete(leader.id)} 
                          disabled={isSubmitting}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        >
                          {leaderToDelete === leader.id ? (
                            <span className="text-[10px] font-black text-white bg-red-500/80 px-3 py-1.5 rounded uppercase tracking-wider">
                              {isSubmitting ? 'DELETING...' : 'CONFIRM'}
                            </span>
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'history' ? (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h3 className="text-xl font-black tracking-tight">MATCH HISTORY (LAST 15 DAYS)</h3>
                    <div className="flex items-center gap-3">
                      <Filter size={14} className="text-slate-500" />
                      <select 
                        value={historyFilter}
                        onChange={e => setHistoryFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] font-black text-white focus:border-brand-purple outline-none transition-all"
                      >
                        {historyTournaments.map(t => (
                          <option key={t} value={t} className="bg-[#0f172a]">{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {historyMatches.length === 0 ? (
                      <p className="text-slate-400 text-sm font-bold">No matches found for the selected filter in the last 15 days.</p>
                    ) : (
                      historyMatches.map(m => (
                        <div key={m.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 font-bold tracking-widest">{new Date(m.timestamp).toLocaleString()} • {m.tournament || 'Friendly'}</span>
                            <div className="flex items-center gap-4 text-sm font-black uppercase whitespace-nowrap">
                              <span className={m.p1Score > m.p2Score ? 'text-brand-purple' : m.p1Score < m.p2Score ? 'text-red-500' : 'text-slate-300'}>{m.p1Name} <span className="text-white bg-white/10 px-2 py-0.5 rounded ml-2">{m.p1Score}</span></span>
                              <span className="text-slate-500 text-[10px]">VS</span>
                              <span className={m.p2Score > m.p1Score ? 'text-brand-purple' : m.p2Score < m.p1Score ? 'text-red-500' : 'text-slate-300'}><span className="text-white bg-white/10 px-2 py-0.5 rounded mr-2">{m.p2Score}</span> {m.p2Name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingMatch?.id === m.id ? (
                              <div className="flex flex-col md:flex-row items-center gap-2 bg-[#0f172a] p-2 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <input type="number" className="w-16 bg-white/5 border border-white/10 p-2 rounded text-center text-xs font-bold focus:border-brand-purple outline-none" value={editMatchScore1} onChange={e => setEditMatchScore1(e.target.value)} placeholder="Score 1" />
                                  <span className="text-slate-500 font-bold text-xs">-</span>
                                  <input type="number" className="w-16 bg-white/5 border border-white/10 p-2 rounded text-center text-xs font-bold focus:border-brand-purple outline-none" value={editMatchScore2} onChange={e => setEditMatchScore2(e.target.value)} placeholder="Score 2" />
                                </div>
                                <select 
                                  value={editMatchTournament}
                                  onChange={e => setEditMatchTournament(e.target.value)}
                                  className="bg-white/5 border border-white/10 p-2 rounded text-xs font-bold focus:border-brand-purple outline-none mt-2 md:mt-0 w-full md:w-auto text-center"
                                >
                                  <option value="Friendly" className="bg-brand-dark">Friendly</option>
                                  <option value="QVFC Elite League Cup Division 1" className="bg-brand-dark">QVFC Elite League Cup Div 1</option>
                                  <option value="QVFC Elite League Cup Division 2" className="bg-brand-dark">QVFC Elite League Cup Div 2</option>
                                  <option value="Vortex Champions Cup" className="bg-brand-dark">Vortex Champions Cup</option>
                                  <option value="Vortex Domestic Cup" className="bg-brand-dark">Vortex Domestic Cup</option>
                                  {tournaments.map(t => (
                                    <option key={t.id} value={t.name} className="bg-brand-dark">{t.name}</option>
                                  ))}
                                </select>
                                <div className="flex gap-2 mt-2 md:mt-0 w-full md:w-auto justify-end">
                                  <button onClick={handleEditMatchSubmit} className="glossy-btn px-3 py-2 rounded text-[10px] font-black tracking-widest transition-all uppercase">SAVE</button>
                                  <button onClick={() => setEditingMatch(null)} className="bg-white/10 text-white px-3 py-2 rounded text-[10px] font-black tracking-widest hover:bg-white/20 transition-all">CANCEL</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => { setEditingMatch(m); setEditMatchScore1(m.p1Score.toString()); setEditMatchScore2(m.p2Score.toString()); setEditMatchTournament(m.tournament || 'Friendly'); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase">
                                  EDIT
                                </button>
                                <button onClick={() => handleDeleteMatch(m)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'credentials' ? (
              <motion.div key="credentials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <CredentialsTab players={players} />
              </motion.div>
            ) : activeTab === 'tournaments' ? (
              <div
                key="tournaments"
                className="fixed inset-0 z-[100] bg-[#050508] overflow-auto"
              >
                <NativeTournamentPage forcePublic={false} />
                {/* Overlay back button to return to dashboard */}
                <button 
                  onClick={() => setActiveTab('players')}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-black/60 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest text-slate-400 hover:text-white transition-all z-[10001] shadow-2xl backdrop-blur-xl flex items-center gap-2 group"
                >
                  <LayoutDashboard size={14} className="group-hover:text-brand-primary transition-colors" />
                  EXIT TO CONTROL CENTER
                </button>
              </div>
            ) : activeTab === 'locks' ? (
              <motion.div key="locks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-black tracking-tight mb-2">SYSTEM LOCKS</h3>
                  <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Temporarily lock public access to specific systems</p>
                  <div className="space-y-4">

                    {/* Lock 1: Tournaments System */}
                    <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", systemLocks?.tournaments ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500")}>
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg tracking-tight">Tournaments System</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            Status: {systemLocks?.tournaments ? 'LOCKED — Public cannot access tournaments' : 'ACTIVE — Tournaments visible to all'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try { await toggleSystemLock('tournaments', !systemLocks?.tournaments); }
                          catch (err) { console.error(err); alert('Failed to update lock.'); }
                        }}
                        className={cn("px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap", systemLocks?.tournaments ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25" : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/25")}
                      >
                        {systemLocks?.tournaments ? 'UNLOCK SYSTEM' : 'LOCK SYSTEM'}
                      </button>
                    </div>

                    {/* Lock 2: Tournament Registration */}
                    <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", !systemLocks?.tournamentRegistration ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500")}>
                          <Users size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg tracking-tight">Tournament Registration</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            {systemLocks?.tournamentRegistration !== false
                              ? 'LOCKED — Players cannot self-register for tournaments'
                              : 'OPEN — Players can register directly from tournament cards'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const isCurrentlyLocked = systemLocks?.tournamentRegistration !== false;
                          try { await toggleSystemLock('tournamentRegistration', !isCurrentlyLocked); }
                          catch (err) { console.error(err); alert('Failed to update lock.'); }
                        }}
                        className={cn("px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap",
                          systemLocks?.tournamentRegistration !== false
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/25"
                        )}
                      >
                        {systemLocks?.tournamentRegistration !== false ? 'UNLOCK REGISTRATION' : 'LOCK REGISTRATION'}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>

    {/* Admin Warning Modal */}
    <AnimatePresence>
      {showAdminWarning && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAdminWarning(false)}
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] -z-10" />
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-4">GRANT ADMIN PRIVILEGES?</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed mb-8">
              Warning: Assigning this player as an <span className="text-red-500">Administrator</span> will grant them full access to the Control Center, including the ability to delete players, modify matches, and change system settings.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setNewPlayer({ ...newPlayer, role: 'admin' });
                  setShowAdminWarning(false);
                }}
                className="w-full py-4 bg-red-500 text-white font-black text-xs tracking-widest rounded-2xl hover:bg-red-600 transition-all uppercase italic"
              >
                YES, GRANT FULL ACCESS
              </button>
              <button 
                onClick={() => setShowAdminWarning(false)}
                className="w-full py-4 bg-white/5 text-slate-400 font-black text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all uppercase"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 p-4 rounded-xl font-black text-[10px] tracking-widest transition-all", active ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/20 border border-brand-purple/50" : "bg-white/5 text-slate-400 hover:bg-white/10")}>
      {icon}
      {label}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder={placeholder} />
    </div>
  );
}

function CredentialsTab({ players }: { players: import('../types').Player[] }) {
  const [search, setSearch] = React.useState('');
  const [selectedPlayer, setSelectedPlayer] = React.useState<import('../types').Player | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'admin' | 'player'>('player');
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRoleWarning, setShowRoleWarning] = React.useState(false);
  const [assignedPlayerIds, setAssignedPlayerIds] = React.useState<string[]>([]);

  const fetchAssignedPlayers = React.useCallback(async () => {
    try {
      const q = query(collection(db, 'players'), where('email', '!=', ''));
      const snap = await getDocs(q);
      setAssignedPlayerIds(snap.docs.map(d => d.id));
    } catch (err) {
      console.error('Error fetching assigned players:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchAssignedPlayers();
  }, [fetchAssignedPlayers]);

  const handleSelectPlayer = async (p: import('../types').Player) => {
    setSelectedPlayer(p);
    setSearch(p.name);
    setMsg({ type: '', text: '' });
    try {
      const snap = await getDoc(doc(db, 'players', p.id));
      if (snap.exists()) {
        const data = snap.data();
        setEmail(data.email || '');
        setPassword(data.password || '');
        setRole(data.role || 'player');
      }
    } catch (err) {
      console.error('Error fetching player credentials:', err);
    }
  };

  const handleSave = async () => {
    if (!selectedPlayer) return;
    setIsLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await updateDoc(doc(db, 'players', selectedPlayer.id), { email, password, role });
      setMsg({ type: 'success', text: `✅ Credentials updated for ${selectedPlayer.name}` });
      fetchAssignedPlayers();
    } catch (err: any) {
      setMsg({ type: 'error', text: '❌ Failed: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Search & Select */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h3 className="text-xl font-black tracking-tight mb-2">PLAYER CREDENTIALS</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Set login email, password & admin role</p>
        <div className="relative mb-6">
          <Input label="SEARCH PLAYER" value={search} onChange={v => { setSearch(v); setSelectedPlayer(null); }} placeholder="Type player name..." />
          <AnimatePresence>
            {search && !selectedPlayer && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6).map(p => (
                  <button key={p.id} type="button" onClick={() => handleSelectPlayer(p)} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                    <img src={p.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="text-xs font-black">{p.name}</p>
                      <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                    </div>
                    {p.role === 'admin' && <span className="ml-auto text-[8px] font-black text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded uppercase">ADMIN</span>}
                  </button>
                ))}
                {players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-xs font-bold">No players found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedPlayer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-xl mb-4">
              <img src={selectedPlayer.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div>
                <p className="text-xs font-black">{selectedPlayer.name}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">#{selectedPlayer.number}</p>
              </div>
              <span className={cn("ml-auto text-[8px] font-black px-2 py-0.5 rounded uppercase", role === 'admin' ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "bg-white/5 text-slate-500 border border-white/10")}>
                {role === 'admin' ? '⚡ ADMIN' : 'PLAYER'}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2"><Mail size={10} className="text-brand-purple" />EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="player@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2"><Lock size={10} className="text-brand-purple" />PASSWORD</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="Set login password" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2"><ShieldCheck size={10} className="text-brand-purple" />ADMIN PRIVILEGES</label>
              <button
                type="button"
                onClick={() => { if (role !== 'admin') setShowRoleWarning(true); else setRole('player'); }}
                className={cn("w-full p-4 rounded-xl text-[10px] font-black tracking-widest transition-all border uppercase", role === 'admin' ? "bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20")}
              >
                {role === 'admin' ? '✓ ADMIN ACCESS GRANTED — CLICK TO REVOKE' : 'GRANT ADMIN ACCESS'}
              </button>
            </div>

            {msg.text && (
              <div className={cn("p-4 rounded-xl text-[10px] font-black uppercase tracking-widest", msg.type === 'success' ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border border-red-500/20 text-red-500")}>
                {msg.text}
              </div>
            )}

            <button onClick={handleSave} disabled={isLoading} className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 uppercase text-xs font-black tracking-widest">
              {isLoading ? 'SAVING...' : 'SAVE CREDENTIALS'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h3 className="text-xl font-black tracking-tight mb-6">ALL PLAYERS</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {players.map(p => (
            <button key={p.id} onClick={() => handleSelectPlayer(p)} className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left border border-white/5">
              <img src={p.image} className="w-9 h-9 rounded-lg object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{p.name}</p>
                <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
              </div>
              {p.role === 'admin' && <span className="text-[7px] font-black text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded uppercase shrink-0">ADMIN</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Assigned Players Section */}
      <div className="col-span-1 md:col-span-2 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic">ASSIGNED PLAYERS</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Players with active credentials ({assignedPlayerIds.length})</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Key size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {players.filter(p => assignedPlayerIds.includes(p.id) || p.role === 'admin').map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPlayer(p)}
                className="group relative flex items-center gap-3 p-3 bg-slate-900/40 border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={p.image} className="w-8 h-8 rounded-lg object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" alt="" />
                <div className="min-w-0 flex-1 relative z-10">
                  <p className="text-[10px] font-black text-slate-200 truncate uppercase tracking-tight">{p.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                      {p.role === 'admin' ? '⚡ ADMIN' : 'Active'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {assignedPlayerIds.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No players assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Role Warning */}
      <AnimatePresence>
        {showRoleWarning && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoleWarning(false)} className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] -z-10" />
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-4">GRANT ADMIN PRIVILEGES?</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed mb-8">
                Warning: <span className="text-white font-black">{selectedPlayer?.name}</span> will get full Control Center access — including players, matches, and system settings. This cannot be undone without an admin manually revoking it.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setRole('admin'); setShowRoleWarning(false); }} className="w-full py-4 bg-red-500 text-white font-black text-xs tracking-widest rounded-2xl hover:bg-red-600 transition-all uppercase">YES, GRANT FULL ACCESS</button>
                <button onClick={() => setShowRoleWarning(false)} className="w-full py-4 bg-white/5 text-slate-400 font-black text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all uppercase">CANCEL</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

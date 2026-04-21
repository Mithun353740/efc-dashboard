import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Trophy, Users, LayoutDashboard, LogOut, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savePlayer, deletePlayer, addMatch, editMatch, deleteMatchFromHistory, saveLeader, deleteLeader, computeGlobalElo, calculateOvrHybrid, recalculateAllStats } from '../lib/store';
import { Player, Leader, MatchRecord } from '../types';
import { cn } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';
import { auth, loginAnonymously } from '../firebase';
import { CLUB_LOGO, CLUB_NAME } from '../constants';
import { History } from 'lucide-react';

export default function Admin() {
  const { players, leaders, matches, dbError } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'leadership' | 'history'>('players');
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
  const DEFAULT_PLAYER = { name: '', number: '', device: 'PS5', uid: '', image: '' };
  
  const [newPlayer, setNewPlayer] = useState(DEFAULT_PLAYER);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerMsg, setPlayerMsg] = useState({ text: '', type: '' });
  const [playerNameSearch, setPlayerNameSearch] = useState('');
  const [playerNumberSearch, setPlayerNumberSearch] = useState('');
  
  // Leader Form
  const [newLeader, setNewLeader] = useState({ name: '', role: '', quote: '', initials: '', playerId: '', image: '' });
  const [leaderMsg, setLeaderMsg] = useState({ text: '', type: '' });
  
  // Match Form
  const [match, setMatch] = useState({ p1Id: '', p1Score: '', p2Score: '', p2Id: '', isExternal: false, tournament: 'QVFC Elite League Cup' });
  const [matchMsg, setMatchMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchRecord | null>(null);
  const [editMatchScore1, setEditMatchScore1] = useState('');
  const [editMatchScore2, setEditMatchScore2] = useState('');
  const [editMatchTournament, setEditMatchTournament] = useState('');
  
  // Suggestions
  const [p1Search, setP1Search] = useState('');
  const [p2Search, setP2Search] = useState('');
  const [delSearch, setDelSearch] = useState('');
  const [leaderPlayerSearch, setLeaderPlayerSearch] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [leaderToDelete, setLeaderToDelete] = useState<string | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);

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
        if (finalCtx) finalCtx.imageSmoothingQuality = 'high';
        finalCtx?.drawImage(canvas, 0, 0, finalWidth, finalHeight);

        resolve(finalCanvas.toDataURL('image/jpeg', 0.98));
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
      uid: newPlayer.uid
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
    if (!match.p1Id || match.p1Score === '' || match.p2Score === '') {
      setMatchMsg({ text: '❌ Fill required fields', type: 'error' });
      return;
    }
    
    const p1 = players.find(p => p.id === match.p1Id);
    const p2 = match.isExternal ? undefined : players.find(p => p.id === match.p2Id);

    if (!p1) return;

    setIsSubmitting(true);
    setMatchMsg({ text: '', type: '' });
    try {
      await addMatch(p1, Number(match.p1Score), Number(match.p2Score), p2, matches, match.tournament);
      setMatchMsg({ text: '✅ Match recorded', type: 'success' });
      setMatch({ p1Id: '', p1Score: '', p2Score: '', p2Id: '', isExternal: false, tournament: 'QVFC Elite League Cup' });
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
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0 rounded-full overflow-hidden bg-brand-purple/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <img src={CLUB_LOGO} alt={CLUB_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-brand-gradient">{CLUB_NAME}</h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 tracking-widest uppercase">CONTROL CENTER</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          {authStatus === 'unauthenticated' && (
            <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black tracking-widest animate-pulse">
              AUTH REQUIRED
            </div>
          )}
          <button 
            onClick={async () => {
              setIsResyncing(true);
              try {
                await recalculateAllStats(players, matches);
                alert('All player stats resynced successfully based on Match History.');
              } catch(e) {
                alert('Failed to resync stats.');
              }
              setIsResyncing(false);
            }} 
            disabled={isResyncing || dbError === 'QUOTA_EXCEEDED'}
            className="px-6 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-full text-[10px] font-black tracking-widest transition-all disabled:opacity-50"
          >
            {isResyncing ? 'SYNCING...' : 'RESYNC STATS'}
          </button>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black tracking-widest transition-all">
            HOME
          </button>
          <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/login'); }} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-[10px] font-black tracking-widest transition-all">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <NavBtn active={activeTab === 'players'} onClick={() => setActiveTab('players')} icon={<Users size={18} />} label="PLAYERS" />
          <NavBtn active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={<LayoutDashboard size={18} />} label="MATCHES" />
          <NavBtn active={activeTab === 'leadership'} onClick={() => setActiveTab('leadership')} icon={<ShieldCheck size={18} />} label="LEADERSHIP" />
          <NavBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={18} />} label="MATCH HISTORY" />
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
                                    image: p.image
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
                    <Input label="DEVICE" value={newPlayer.device} onChange={v => setNewPlayer({...newPlayer, device: v})} placeholder="PS5 / PC" />
                    
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
                          <input disabled className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white/20" placeholder="External Opponent" />
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
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="QVFC Elite League Cup" className="bg-brand-dark">QVFC Elite League Cup</option>
                        <option value="QVFC Elite League Cup Division 2" className="bg-brand-dark">QVFC Elite League Cup Division 2</option>
                        <option value="Vortex Champions Cup" className="bg-brand-dark">Vortex Champions Cup</option>
                        <option value="Vortex Domestic Cup" className="bg-brand-dark">Vortex Domestic Cup</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-purple">
                        <ChevronDown size={16} />
                      </div>
                    </div>
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
                  <h3 className="text-xl font-black mb-6 tracking-tight">MATCH HISTORY (LAST 7 DAYS)</h3>
                  <div className="space-y-4">
                    {matches.length === 0 ? (
                      <p className="text-slate-400 text-sm font-bold">No match history available.</p>
                    ) : (
                      matches.filter(m => Date.now() - m.timestamp <= 7 * 24 * 60 * 60 * 1000).map(m => (
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
                                  <option value="QVFC Elite League Cup" className="bg-brand-dark">QVFC Elite League Cup</option>
                                  <option value="QVFC Elite League Cup Division 2" className="bg-brand-dark">QVFC Elite League Cup Division 2</option>
                                  <option value="Vortex Champions Cup" className="bg-brand-dark">Vortex Champions Cup</option>
                                  <option value="Vortex Domestic Cup" className="bg-brand-dark">Vortex Domestic Cup</option>
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
            ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
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

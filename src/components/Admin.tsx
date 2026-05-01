import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Trophy, Users, LayoutDashboard, LogOut, X, ShieldCheck, ChevronDown, Key, Mail, Lock, History, Filter, Hammer, AlertCircle, Gavel, Bell, Calendar, DollarSign, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savePlayer, deletePlayer, addMatch, editMatch, deleteMatchFromHistory, saveLeader, deleteLeader, computeGlobalElo, calculateOvrHybrid, recalculateAllStats, seedDatabase, toggleSystemLock, fetchClubs, saveClub, deleteClub, fetchClubConfig, saveClubConfig, fetchClubSeasonMatches, fetchClubTournaments, saveClubTournament, deleteClubTournament, fetchClubFixtures, saveClubFixture, deleteClubFixture, updateFixtureSubMatch, adminStartAuction, adminRevealCard, adminConfirmSold, adminSkipPlayer, adminEndAuction, subscribeToAuction, startClubSeason, endClubSeason, fetchClubSeasons, broadcastToAllOwners, deleteClubSeason } from '../lib/store';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { NativeTournamentPage } from './tournament/NativeTournamentPage';
import { Player, Leader, MatchRecord, Club, ClubSystemConfig, ClubTournament, ClubFixture, AuctionState, ClubSeason } from '../types';
import { getSeasonInfo, cn, getPlayerGrade } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';
import { auth, loginAnonymously, db } from '../firebase';
import { CLUB_LOGO, CLUB_NAME, VERSION } from '../constants';

export default function Admin() {
  const { players, leaders, matches, tournaments, systemLocks, dbError, hasPendingWrites, appVersion } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'leadership' | 'history' | 'tournaments' | 'locks' | 'credentials' | 'clubs'>('players');
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [isResyncing, setIsResyncing] = useState(false);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
      if (!isAdmin) {
        setAuthStatus('unauthenticated');
        return;
      }
      
      // Auto-sync version: If the local code version is newer than Firestore, update Firestore
      if (isAdmin) {
        import('../lib/store').then(({ ensureMetadataExists }) => ensureMetadataExists());
        if (appVersion && appVersion !== VERSION) {
          import('../lib/store').then(({ updateAppVersion }) => updateAppVersion(VERSION));
        }

        setAuthStatus('authenticated');
      }
    };
    checkAuth();
  }, [appVersion]);

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
  const [showAdminWarning, setShowAdminWarning] = useState(false);

  // ── Auction Control State ────────────────────────────────────────────────
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [auctionClubs, setAuctionClubs] = useState<Club[]>([]);
  const [auctionBasePrice, setAuctionBasePrice] = useState(500000);
  const [auctionIncrement, setAuctionIncrement] = useState(100000);
  const [auctionRevealId, setAuctionRevealId] = useState('');
  const [auctionMsg, setAuctionMsg] = useState('');
  // ── Club Season State ────────────────────────────────────────────────────
  const [clubSeasons, setClubSeasons] = useState<ClubSeason[]>([]);
  const [globalSeason, setGlobalSeason] = useState(() => getSeasonInfo(new Date()).name);
  const [seasonMsg, setSeasonMsg] = useState('');

  // Subscribe to auction doc when on auction-control tab
  useEffect(() => {
    if (activeTab !== 'auction-control') return;
    const unsub = subscribeToAuction(setAuctionState);
    return unsub;
  }, [activeTab]);

  // Load clubs + seasons when on auction-control tab
  useEffect(() => {
    if (activeTab !== 'auction-control') return;
    fetchClubs().then(setAuctionClubs);
    fetchClubSeasons(globalSeason).then(setClubSeasons);
  }, [activeTab, globalSeason]);

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
              if (!window.confirm("WARNING: This will resync ALL historical match stats. Depending on your match count, this could use a large amount of Firestore quota. Proceed?")) return;
              setIsResyncing(true);
              try {
                await recalculateAllStats(players);
                alert('Stats resynced successfully for all historical records.');
              } catch(e) {
                alert('Failed to resync stats. Quota may be exceeded.');
              }
              setIsResyncing(false);
            }} 
            disabled={isResyncing}
            className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all disabled:opacity-50"
          >
            {isResyncing ? 'SYNCING...' : 'FORCE FULL RESYNC'}
          </button>
          
          <button 
            onClick={async () => {
              const confirm1 = window.confirm("CRITICAL: This will reset the system to MOCK DATA. All current players and leaders will be overwritten. Proceed?");
              if (!confirm1) return;
              
              const confirm2 = window.prompt("To confirm this destructive recovery action, please type 'SEED' below:");
              if (confirm2 !== 'SEED') {
                alert('Confirmation failed. Seeding cancelled.');
                return;
              }

              setIsResyncing(true);
              try {
                await seedDatabase();
                alert('System seeded successfully. Refreshing page...');
                window.location.reload();
              } catch(e) {
                alert('Failed to seed system.');
              }
              setIsResyncing(false);
            }} 
            disabled={isResyncing}
            className="px-4 py-1.5 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple rounded-full text-[8px] md:text-[10px] font-black tracking-widest transition-all disabled:opacity-50"
          >
            {isResyncing ? 'SEEDING...' : 'SEED SYSTEM (RECOVERY)'}
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
            <div className="snap-center shrink-0 lg:shrink"><NavBtn active={activeTab === 'clubs'} onClick={() => setActiveTab('clubs')} icon={<Trophy size={18} />} label="CLUBS" /></div>
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
            ) : activeTab === 'auction' ? (
              <motion.div key="auction" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500"><Gavel size={20} /></div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Auction Session Control</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Start or end a live auction session</p>
                    </div>
                  </div>

                  {!auctionState || auctionState.status === 'ended' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Base Price (VCC)</label>
                        <input type="number" value={setupBasePrice} onChange={e => setSetupBasePrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Bid Increment (VCC)</label>
                        <input type="number" value={setupIncrement} onChange={e => setSetupIncrement(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50" />
                      </div>
                      <button 
                        onClick={async () => {
                          if (!clubs.length) { alert('No clubs found! Create clubs first.'); return; }
                          await import('../lib/store').then(m => m.adminStartAuction(clubs.map(c => c.id), Number(setupIncrement), Number(setupBasePrice)));
                          setSeasonMsg('Auction session started! You can now switch to the Club Zone to operate the live auction.');
                        }}
                        className="col-span-1 md:col-span-2 py-4 bg-amber-500 text-black font-black text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase flex items-center justify-center gap-2"
                      >
                        <Play size={14} /> Start Auction Session
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-amber-500 font-black uppercase text-sm mb-1">Live Auction is Active</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base: {auctionState.basePrice} / Increment: {auctionState.bidIncrement}</p>
                      </div>
                      <button 
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to end the current auction session?')) return;
                          await import('../lib/store').then(m => m.adminEndAuction());
                          setSeasonMsg('Auction session ended.');
                        }}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        End Session
                      </button>
                    </div>
                  )}
                  {seasonMsg && <p className="mt-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest">{seasonMsg}</p>}
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

                    {/* Lock 3: Club Manager */}
                    <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", systemLocks?.clubManager ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500")}>
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg tracking-tight">Club Manager</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            Status: {systemLocks?.clubManager ? 'LOCKED — Club Zone hidden from all players' : 'ACTIVE — Club Zone visible to logged-in players'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try { await toggleSystemLock('clubManager', !systemLocks?.clubManager); }
                          catch (err) { console.error(err); alert('Failed to update lock.'); }
                        }}
                        className={cn("px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap", systemLocks?.clubManager ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25" : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/25")}
                      >
                        {systemLocks?.clubManager ? 'UNLOCK CLUB ZONE' : 'LOCK CLUB ZONE'}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'clubs' ? (
              <motion.div key="clubs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <ClubsAdminTab players={players} />
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
    // Redundant - we now use the players array from context which already has emails
  }, []);

  React.useEffect(() => {
    // Redundant - we now use the players array from context which already has emails
  }, []);

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
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                        {p.email && <span className="text-[8px] font-black text-brand-purple opacity-70">• {p.email}</span>}
                      </div>
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
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-slate-500">#{p.number}</p>
                  {p.email && <p className="text-[8px] font-black text-brand-purple truncate opacity-80">{p.email}</p>}
                </div>
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
            {players.filter(p => p.email || p.role === 'admin').map(p => (
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
            {players.filter(p => p.email || p.role === 'admin').length === 0 && (
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
function ClubsAdminTab({ players }: { players: Player[] }) {
  const currentSeasonName = `QVFC Club Season ${getSeasonInfo(new Date()).name}`;
  const DEFAULT_CFG: ClubSystemConfig = { 
    season: currentSeasonName, startingBudget: 5000000, transferWindowOpen: false, 
    currentMatchday: 1, totalMatchdays: 10, matchdaySchedule: [],
    contractsActive: true, defaultContractType: 'matches', defaultContractAmount: 5 
  };
  const [clubs, setClubs] = React.useState<Club[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState({ text: '', type: '' });
  const [ownerSearch, setOwnerSearch] = React.useState('');
  const [showOwnerDrop, setShowOwnerDrop] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', shortName: '', primaryColor: '#8b5cf6', secondaryColor: '#f59e0b', ownerId: '', budget: '5000000', managerRating: '80', activeObjective: '' });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [config, setConfig] = React.useState<ClubSystemConfig>(DEFAULT_CFG);
  const [configSaving, setConfigSaving] = React.useState(false);

  // ── Match & Engine state (lazy-loaded, quota-safe) ──
  const [subTab, setSubTab] = React.useState<'clubs'|'tournaments'|'fixtures'|'matches'|'seasons'|'auction'|'config'|'history'>('clubs');

  // History state (3-layer navigation)
  const [hSeasons, setHSeasons] = React.useState<ClubSeason[]>([]);
  const [hMatches, setHMatches] = React.useState<MatchRecord[]>([]);
  const [hSelectedSeasonId, setHSelectedSeasonId] = React.useState<string | null>(null);
  const [hSelectedTournament, setHSelectedTournament] = React.useState<string | null>(null);
  const [hLoading, setHLoading] = React.useState(false);
  const [hEditingMatch, setHEditingMatch] = React.useState<MatchRecord | null>(null);
  const [hEditForm, setHEditForm] = React.useState({ p1Score: '0', p2Score: '0', tournament: '', matchday: '1' });

  // Auction Admin state
  const [auctionState, setAuctionState] = React.useState<AuctionState | null>(null);
  const [setupBasePrice, setSetupBasePrice] = React.useState('500000');
  const [setupIncrement, setSetupIncrement] = React.useState('100000');
  const [revealPlayerId, setRevealPlayerId] = React.useState('');

  React.useEffect(() => {
    const unsub = subscribeToAuction((state) => {
      setAuctionState(state);
    });
    return unsub;
  }, []);

  const groupedHistory = useMemo(() => {
    if (!hMatches.length) return {};
    const grouped: any = {};
    hMatches.forEach(m => {
      const t = m.tournament || 'UNCATEGORIZED';
      if (!grouped[t]) grouped[t] = {};
      const md = m.matchday || 1;
      if (!grouped[t][md]) grouped[t][md] = [];
      grouped[t][md].push(m);
    });
    return grouped;
  }, [hMatches]);


  const loadHistory = async () => {
    setHLoading(true);
    try {
      const ss = await fetchClubSeasons();
      setHSeasons(ss);
      if (ss.length > 0 && !hSelectedSeasonId) {
        setHSelectedSeasonId(ss[0].id);
      }
    } catch (e) { console.error(e); }
    finally { setHLoading(false); }
  };

  React.useEffect(() => {
    if (subTab === 'history') loadHistory();
  }, [subTab]);

  React.useEffect(() => {
    const loadSeasonMatches = async () => {
      if (!hSelectedSeasonId) return;
      setHLoading(true);
      try {
        const ms = await fetchClubSeasonMatches(hSelectedSeasonId);
        setHMatches(ms);
      } catch (e) { console.error(e); }
      finally { setHLoading(false); }
    };
    if (subTab === 'history') loadSeasonMatches();
  }, [hSelectedSeasonId, subTab]);

  const handleHistoryEditMatch = async () => {
    if (!hEditingMatch) return;
    setHLoading(true);
    try {
      await editMatch(hEditingMatch, Number(hEditForm.p1Score), Number(hEditForm.p2Score), players, [], hEditForm.tournament, hEditingMatch.seasonId, Number(hEditForm.matchday));
      setMsg({ text: 'Match updated and ratings recalculated!', type: 'success' });

      setHEditingMatch(null);
      loadHistory();
    } catch (e: any) { setMsg({ text: e.message, type: 'error' }); }
    finally { setHLoading(false); }
  };

  const handleHistoryDeleteMatch = async (m: MatchRecord) => {
    if (!window.confirm('Are you sure? This will undo ELO, OVR, and Club Manager Rating changes for this match.')) return;
    setHLoading(true);
    try {
      await deleteMatchFromHistory(m, players, []);
      setMsg({ text: 'Match deleted and stats reverted!', type: 'success' });
      loadHistory();
    } catch (e: any) { setMsg({ text: e.message, type: 'error' }); }
    finally { setHLoading(false); }
  };

  const handleDeleteSeason = async () => {
    if (!hSelectedSeasonId) return;
    const confirm1 = window.confirm("🚨 CRITICAL WARNING: You are about to DELETE this entire Club Season record. This action is irreversible. Are you absolutely sure?");
    if (!confirm1) return;
    const confirm2 = window.prompt("To confirm deletion, type 'DELETE' in the box below:");
    if (confirm2 !== 'DELETE') {
      setMsg({ text: '❌ Deletion cancelled. Confirmation text did not match.', type: 'error' });
      return;
    }
    setHLoading(true);
    try {
      await deleteClubSeason(hSelectedSeasonId);
      setMsg({ text: '✅ Season deleted successfully.', type: 'success' });
      setHSelectedSeasonId(null);
      await loadHistory();
    } catch (e: any) { setMsg({ text: '❌ ' + e.message, type: 'error' }); }
    finally { setHLoading(false); }
  };

  // Tournaments state
  const [tournaments, setTournaments] = React.useState<ClubTournament[]>([]);
  const [tLoaded, setTLoaded] = React.useState(false);
  const [tFormName, setTFormName] = React.useState('');
  const [editingTId, setEditingTId] = React.useState<string | null>(null);
  const [tStatusForm, setTStatusForm] = React.useState({ status: 'active', reason: '' });

  // Fixtures state
  const [fixtures, setFixtures] = React.useState<ClubFixture[]>([]);
  const [fLoaded, setFLoaded] = React.useState(false);
  const [fForm, setFForm] = React.useState({ 
    tournamentId: '', homeClubId: '', awayClubId: '', 
    matchupType: 'home_away' as 'home_away'|'random', 
    lineupSize: '4', subLimit: '2' 
  });
  const [clubMatches, setClubMatches] = React.useState<MatchRecord[]>([]);
  const [matchesLoaded, setMatchesLoaded] = React.useState(false);
  const [matchBusy, setMatchBusy] = React.useState(false);
  const [matchMsg, setMatchMsg] = React.useState({ text: '', ok: true });
  const [mForm, setMForm] = React.useState({ p1Id: '', p2Id: '', p1Score: '', p2Score: '' });
  const [p1Search, setP1Search] = React.useState('');
  const [p2Search, setP2Search] = React.useState('');
  const [showP1, setShowP1] = React.useState(false);
  const [showP2, setShowP2] = React.useState(false);
  const [editMatchId, setEditMatchId] = React.useState<string|null>(null);

  // Sub-match scoring state
  const [scoringSubMatch, setScoringSubMatch] = React.useState<{ fixtureId: string, subMatchId: string } | null>(null);
  const [smScores, setSmScores] = React.useState({ s1: '', s2: '' });
  const [editS1, setEditS1] = React.useState('');
  const [editS2, setEditS2] = React.useState('');

  const reload = async () => {
    setLoading(true);
    const [cs, cfg] = await Promise.all([fetchClubs(), fetchClubConfig()]);
    setClubs(cs);
    if (cfg) setConfig(cfg);
    setLoading(false);
  };

  React.useEffect(() => { reload(); }, []);

  const resetForm = () => {
    setForm({ name: '', shortName: '', primaryColor: '#8b5cf6', secondaryColor: '#f59e0b', ownerId: '', budget: '5000000', managerRating: '80', activeObjective: '' });
    setEditingId(null); setOwnerSearch(''); setShowOwnerDrop(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.shortName) { setMsg({ text: '❌ Name & Short Name required', type: 'error' }); return; }
    const existing = editingId ? clubs.find(c => c.id === editingId) : null;
    const club: Club = {
      id: editingId || (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)),
      name: form.name.toUpperCase(),
      shortName: form.shortName.toUpperCase().slice(0, 3),
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      ownerId: form.ownerId,
      ownerName: players.find(p => p.id === form.ownerId)?.name,
      budget: Number(form.budget) || 5000000,
      managerRating: Number(form.managerRating) || 80,
      activeObjective: form.activeObjective || null,
      squadIds: existing?.squadIds || [],
      createdAt: existing?.createdAt || Date.now(),
    };
    setLoading(true);
    try {
      await saveClub(club, existing?.ownerId);
      setMsg({ text: '✅ Club saved successfully', type: 'success' });
      resetForm();
      await reload();
    } catch (e: any) {
      setMsg({ text: '❌ ' + e.message, type: 'error' });
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this club? All player club associations will be cleared.')) return;
    await deleteClub(id);
    await reload();
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    try {
      await saveClubConfig(config);
      setMsg({ text: '✅ Config saved', type: 'success' });
    } catch (e: any) {
      setMsg({ text: '❌ ' + e.message, type: 'error' });
    } finally { setConfigSaving(false); }
  };

  // lazy-load club season matches only when MATCHES subtab is opened
  const loadMatches = React.useCallback(async () => {
    if (!config.season) return;
    const ms = await fetchClubSeasonMatches(config.season);
    setClubMatches(ms.sort((a, b) => b.timestamp - a.timestamp));
    setMatchesLoaded(true);
  }, [config.season]);

  const loadTournaments = React.useCallback(async () => {
    if (!config.season) return;
    const ts = await fetchClubTournaments(config.season);
    setTournaments(ts.sort((a, b) => b.createdAt - a.createdAt));
    setTLoaded(true);
  }, [config.season]);

  const loadFixtures = React.useCallback(async () => {
    if (!config.season) return;
    // Client side filter by season to save complex composite indexes right now
    const fs = await fetchClubFixtures(config.season);
    setFixtures(fs.sort((a, b) => b.createdAt - a.createdAt));
    setFLoaded(true);
  }, [config.season]);

  React.useEffect(() => {
    if (subTab === 'matches' && !matchesLoaded) loadMatches();
    if (subTab === 'tournaments' && !tLoaded) loadTournaments();
    if (subTab === 'fixtures' && !fLoaded) loadFixtures();
  }, [subTab, matchesLoaded, tLoaded, fLoaded, loadMatches, loadTournaments, loadFixtures]);

  const flashMatch = (text: string, ok: boolean) => {
    setMatchMsg({ text, ok });
    setTimeout(() => setMatchMsg({ text: '', ok: true }), 3500);
  };

  const resetMForm = () => {
    setMForm({ p1Id: '', p2Id: '', p1Score: '', p2Score: '' });
    setP1Search(''); setP2Search(''); setShowP1(false); setShowP2(false);
  };

  const handleAddMatch = async () => {
    const p1 = players.find(p => p.id === mForm.p1Id);
    const p2 = players.find(p => p.id === mForm.p2Id);
    if (!p1 || !mForm.p1Score || !mForm.p2Score) { flashMatch('❌ Select both players and scores', false); return; }
    setMatchBusy(true);
    try {
      await addMatch(p1, Number(mForm.p1Score), Number(mForm.p2Score), p2, [], config.season, undefined, config.season, config.currentMatchday);
      flashMatch('✅ Match added', true);
      resetMForm();
      await loadMatches();
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleEditMatch = async (m: MatchRecord) => {
    setMatchBusy(true);
    try {
      await editMatch(m, Number(editS1), Number(editS2), players, [], m.tournament, m.seasonId, m.matchday);
      setClubMatches(prev => prev.map(x => x.id === m.id ? { ...x, p1Score: Number(editS1), p2Score: Number(editS2) } : x));
      setEditMatchId(null);
      flashMatch('✅ Match updated', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleDeleteMatch = async (m: MatchRecord) => {
    if (!window.confirm('Delete this club match? Player stats will be recalculated.')) return;
    setMatchBusy(true);
    try {
      await deleteMatchFromHistory(m, players, []);
      setClubMatches(prev => prev.filter(x => x.id !== m.id));
      flashMatch('✅ Match deleted', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleAddTournament = async () => {
    if (!tFormName) return;
    setMatchBusy(true);
    try {
      const nt: ClubTournament = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        name: tFormName.toUpperCase(),
        season: config.season,
        status: 'active',
        createdAt: Date.now()
      };
      await saveClubTournament(nt);
      setTournaments([nt, ...tournaments]);
      setTFormName('');
      flashMatch('✅ Tournament created', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleDelTournament = async (id: string) => {
    if (!window.confirm('Delete this tournament?')) return;
    setMatchBusy(true);
    try {
      await deleteClubTournament(id);
      setTournaments(tournaments.filter(t => t.id !== id));
      flashMatch('✅ Deleted', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleUpdateTournamentStatus = async (id: string) => {
    const t = tournaments.find(x => x.id === id);
    if (!t) return;
    setMatchBusy(true);
    try {
      const nt = { ...t, status: tStatusForm.status as any, statusReason: tStatusForm.reason };
      await saveClubTournament(nt);
      setTournaments(tournaments.map(x => x.id === id ? nt : x));
      setEditingTId(null);
      flashMatch('✅ Tournament updated', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleAddFixture = async () => {
    const t = tournaments.find(x => x.id === fForm.tournamentId);
    const hc = clubs.find(c => c.id === fForm.homeClubId);
    const ac = clubs.find(c => c.id === fForm.awayClubId);
    if (!t || !hc || !ac || hc.id === ac.id) { flashMatch('❌ Invalid selection', false); return; }
    
    setMatchBusy(true);
    try {
      const nf: ClubFixture = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        tournamentId: t.id, tournamentName: t.name,
        homeClubId: hc.id, homeClubName: hc.name,
        awayClubId: ac.id, awayClubName: ac.name,
        matchupType: fForm.matchupType,
        lineupSize: Number(fForm.lineupSize) || 4,
        subLimit: Number(fForm.subLimit) || 2,
        status: 'scheduled',
        homeLineupIds: [], awayLineupIds: [], subMatches: [],
        createdAt: Date.now()
      };
      await saveClubFixture(nf);
      setFixtures([nf, ...fixtures]);
      flashMatch('✅ Fixture Scheduled', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleDelFixture = async (id: string) => {
    if (!window.confirm('Delete this fixture?')) return;
    setMatchBusy(true);
    try {
      await deleteClubFixture(id);
      setFixtures(fixtures.filter(f => f.id !== id));
      flashMatch('✅ Deleted', true);
    } catch (e: any) { flashMatch('❌ ' + e.message, false); }
    finally { setMatchBusy(false); }
  };

  const handleScoreSubMatch = async (f: ClubFixture, sm: import('../types').ClubFixtureSubMatch) => {
    const s1 = Number(smScores.s1);
    const s2 = Number(smScores.s2);
    if (isNaN(s1) || isNaN(s2) || smScores.s1 === '' || smScores.s2 === '') {
      flashMatch('❌ Invalid scores', false);
      return;
    }
    
    setMatchBusy(true);
    try {
      await updateFixtureSubMatch(f.id, sm.id, s1, s2, config);
      
      const p1 = players.find(p => p.id === sm.p1Id);
      const p2 = players.find(p => p.id === sm.p2Id);
      if (p1) {
        await addMatch(p1, s1, s2, p2, [], f.tournamentName || config.season, p2?.name || 'Unknown', config.season, config.currentMatchday);
      }

      const nf = { ...f };
      const nsm = nf.subMatches.find(x => x.id === sm.id);
      if (nsm) {
        nsm.p1Score = s1;
        nsm.p2Score = s2;
      }
      nf.status = nf.subMatches.every(x => x.p1Score !== null) ? 'completed' : nf.status;
      setFixtures(prev => prev.map(x => x.id === f.id ? nf : x));
      setScoringSubMatch(null);
      setSmScores({ s1: '', s2: '' });
      flashMatch('✅ Sub-Match Scored', true);
    } catch (e: any) {
      flashMatch('❌ ' + e.message, false);
    }
    finally {
      setMatchBusy(false);
    }
  };

  const p1Player = players.find(p => p.id === mForm.p1Id);
  const p2Player = players.find(p => p.id === mForm.p2Id);
  const filtP1 = players.filter(p => p.name.toLowerCase().includes(p1Search.toLowerCase())).slice(0, 6);
  const filtP2 = players.filter(p => p.name.toLowerCase().includes(p2Search.toLowerCase()) && p.id !== mForm.p1Id).slice(0, 6);

  const ownerPlayer = players.find(p => p.id === form.ownerId);
  const filteredOwners = players.filter(p => p.name.toLowerCase().includes(ownerSearch.toLowerCase())).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* SubTab Nav */}
      <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl flex-wrap">
        {(['clubs','tournaments','fixtures','matches','seasons','auction','config','history'] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={cn('flex-1 min-w-[100px] py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all',
              subTab === t ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {t === 'clubs' ? '⚽ CLUBS' : t === 'tournaments' ? '🏆 TOURNAMENTS' : t === 'fixtures' ? '📅 FIXTURES' : t === 'matches' ? '🗒️ MATCH LOG' : t === 'seasons' ? '📅 SEASONS' : t === 'auction' ? '🔨 AUCTION' : t === 'config' ? '⚙️ CONFIG' : '🕒 HISTORY'}
          </button>
        ))}
      </div>

      {subTab === 'clubs' && (
        <div className="space-y-8">
      {/* Club Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black tracking-tight">{editingId ? 'EDIT CLUB' : 'CREATE CLUB'}</h3>
          {editingId && <button onClick={resetForm} className="text-[10px] font-black text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded-full">CANCEL EDIT</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left col */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Club Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="e.g. VORTEX UNITED" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Short Code (3)</label>
                <input value={form.shortName} maxLength={3} onChange={e => setForm({...form, shortName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="VOR" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Budget (VCC)</label>
                <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Primary Color</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})} className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" />
                  <span className="text-xs font-bold text-slate-400">{form.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Secondary Color</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <input type="color" value={form.secondaryColor} onChange={e => setForm({...form, secondaryColor: e.target.value})} className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" />
                  <span className="text-xs font-bold text-slate-400">{form.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right col */}
          <div className="space-y-4">
            <div className="space-y-1 relative">
              <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Club Manager (Owner)</label>
              <input
                value={ownerSearch || ownerPlayer?.name || ''}
                onChange={e => { setOwnerSearch(e.target.value); setForm({...form, ownerId: ''}); setShowOwnerDrop(true); }}
                onFocus={() => setShowOwnerDrop(true)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all"
                placeholder="Search player..."
              />
              <AnimatePresence>
                {showOwnerDrop && ownerSearch && !form.ownerId && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {filteredOwners.map(p => (
                      <button key={p.id} type="button" onClick={() => { setForm({...form, ownerId: p.id}); setOwnerSearch(''); setShowOwnerDrop(false); }} className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black truncate">{p.name}</p>
                          <p className="text-[8px] text-slate-500">#{p.number}{p.isClubOwner ? ' · Already owns a club' : ''}</p>
                        </div>
                        {p.isClubOwner && <span className="text-[7px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded shrink-0">OWNER</span>}
                      </button>
                    ))}
                    {filteredOwners.length === 0 && <div className="p-4 text-center text-slate-500 text-xs font-bold">No players found</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Manager Rating (0-100)</label>
                <input type="number" min="0" max="100" value={form.managerRating} onChange={e => setForm({...form, managerRating: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Active Board Objective</label>
                <input type="text" value={form.activeObjective} onChange={e => setForm({...form, activeObjective: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none transition-all" placeholder="e.g. Win the next match" />
              </div>
            </div>
            {/* Preview card */}
            <div className="rounded-xl border p-4 flex items-center gap-4 transition-all" style={{ borderColor: form.primaryColor + '50', background: form.primaryColor + '12' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }}>
                {form.shortName || '??'}
              </div>
              <div>
                <p className="font-black text-white">{form.name || 'CLUB NAME'}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Manager: {ownerPlayer?.name || 'Unassigned'}</p>
                <p className="text-[9px] text-slate-400">Budget: VCC {Number(form.budget || 0).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 uppercase text-xs font-black tracking-widest">
              {loading ? 'SAVING...' : editingId ? 'UPDATE CLUB' : 'CREATE CLUB'}
            </button>
            {msg.text && <p className={cn('text-[10px] font-bold text-center', msg.type === 'success' ? 'text-brand-purple' : 'text-red-500')}>{msg.text}</p>}
          </div>
        </div>
      </div>

      {/* Club List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h3 className="text-xl font-black tracking-tight mb-6">ALL CLUBS ({clubs.length})</h3>
        {loading && clubs.length === 0 ? (
          <p className="text-slate-500 text-xs font-bold animate-pulse">Loading clubs...</p>
        ) : clubs.length === 0 ? (
          <p className="text-slate-500 text-xs font-bold">No clubs yet. Create the first one above.</p>
        ) : (
          <div className="space-y-3">
            {clubs.map(club => {
              const owner = players.find(p => p.id === club.ownerId);
              return (
                <div key={club.id} className="bg-[#0f172a] rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}>
                    {club.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate">{club.name}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Manager: {club.ownerName || owner?.name || 'None'} &bull; Squad: {club.squadIds?.length || 0} players &bull; Budget: VCC {(club.budget || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(club.id);
                        setOwnerSearch('');
                        setForm({ 
                          name: club.name, 
                          shortName: club.shortName, 
                          primaryColor: club.primaryColor, 
                          secondaryColor: club.secondaryColor, 
                          ownerId: club.ownerId, 
                          budget: String(club.budget),
                          managerRating: String(club.managerRating || 80),
                          activeObjective: club.activeObjective || ''
                        });
                        setMsg({ text: '', type: '' });
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase"
                    >EDIT</button>
                    <button onClick={() => handleDelete(club.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase">DEL</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </div>
      )}

      {/* ── TOURNAMENTS subtab ── */}
      {subTab === 'tournaments' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black tracking-tight mb-1">CREATE CLUB TOURNAMENT</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5">
              Season: <span className="text-amber-400">{config.season}</span>
            </p>
            <div className="flex gap-4">
              <input value={tFormName} onChange={e => setTFormName(e.target.value)} placeholder="e.g. VORTEX WINTER CUP"
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-amber-500 outline-none uppercase" />
              <button onClick={handleAddTournament} disabled={matchBusy || !tFormName}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all uppercase">
                {matchBusy ? 'CREATING...' : 'CREATE'}
              </button>
            </div>
            {matchMsg.text && <p className={cn('text-[10px] font-bold mt-3', matchMsg.ok ? 'text-emerald-400' : 'text-red-400')}>{matchMsg.text}</p>}
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black tracking-tight mb-6">ACTIVE TOURNAMENTS ({tournaments.length})</h3>
            {!tLoaded ? <p className="text-slate-500 text-xs font-bold animate-pulse">Loading...</p> : tournaments.length === 0 ? <p className="text-slate-500 text-xs font-bold">No club tournaments created for this season.</p> : (
              <div className="space-y-3">
                {tournaments.map(t => (
                  <div key={t.id} className="bg-[#0f172a] rounded-xl border border-white/10 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-sm text-white uppercase">{t.name}</p>
                          <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded",
                            t.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                            t.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                            t.status === 'postponed' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-500/20 text-slate-400'
                          )}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                        {t.statusReason && <p className="text-[10px] font-bold text-slate-400 mt-1 italic">"{t.statusReason}"</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => {
                          if (editingTId === t.id) setEditingTId(null);
                          else { setEditingTId(t.id); setTStatusForm({ status: t.status || 'active', reason: t.statusReason || '' }); }
                        }} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all text-[10px] font-black uppercase">
                          {editingTId === t.id ? 'CANCEL' : 'EDIT'}
                        </button>
                        <button onClick={() => handleDelTournament(t.id)} disabled={matchBusy} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all disabled:opacity-50"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {editingTId === t.id && (
                      <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3">
                        <select value={tStatusForm.status} onChange={e => setTStatusForm({...tStatusForm, status: e.target.value})} className="bg-black/50 border border-white/10 p-2 rounded text-xs font-bold focus:border-amber-500 outline-none">
                          <option value="active">ACTIVE</option>
                          <option value="paused">PAUSED</option>
                          <option value="postponed">POSTPONED</option>
                          <option value="completed">COMPLETED</option>
                        </select>
                        <input value={tStatusForm.reason} onChange={e => setTStatusForm({...tStatusForm, reason: e.target.value})} placeholder="Reason (optional)..."
                          className="flex-1 bg-black/50 border border-white/10 p-2 rounded text-xs font-bold focus:border-amber-500 outline-none" />
                        <button onClick={() => handleUpdateTournamentStatus(t.id)} disabled={matchBusy} className="px-4 py-2 bg-amber-500 text-black text-[10px] font-black rounded uppercase">Save</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FIXTURES subtab ── */}
      {subTab === 'fixtures' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black tracking-tight mb-1">SCHEDULE CLUB FIXTURE</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5">
              Season: <span className="text-amber-400">{config.season}</span>
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Tournament</label>
                <select value={fForm.tournamentId} onChange={e => setFForm({...fForm, tournamentId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
                  <option value="" className="text-black">Select Tournament...</option>
                  {tournaments.map(t => <option key={t.id} value={t.id} className="text-black">{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Home Club</label>
                  <select value={fForm.homeClubId} onChange={e => setFForm({...fForm, homeClubId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
                    <option value="" className="text-black">Select Home...</option>
                    {clubs.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Away Club</label>
                  <select value={fForm.awayClubId} onChange={e => setFForm({...fForm, awayClubId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
                    <option value="" className="text-black">Select Away...</option>
                    {clubs.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Matchup Logic</label>
                  <select value={fForm.matchupType} onChange={e => setFForm({...fForm, matchupType: e.target.value as 'home_away'|'random'})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
                    <option value="home_away" className="text-black">Home Advantage (Manual)</option>
                    <option value="random" className="text-black">Neutral (Random)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Lineup Size</label>
                  <input type="number" min="1" value={fForm.lineupSize} onChange={e => setFForm({...fForm, lineupSize: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Sub Limit</label>
                  <input type="number" min="0" value={fForm.subLimit} onChange={e => setFForm({...fForm, subLimit: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none" />
                </div>
              </div>
              <button onClick={handleAddFixture} disabled={matchBusy || !fForm.tournamentId || !fForm.homeClubId || !fForm.awayClubId}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all uppercase mt-2">
                {matchBusy ? 'SCHEDULING...' : 'SCHEDULE FIXTURE'}
              </button>
              {matchMsg.text && <p className={cn('text-[10px] font-bold mt-3 text-center', matchMsg.ok ? 'text-emerald-400' : 'text-red-400')}>{matchMsg.text}</p>}
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black tracking-tight mb-6">SCHEDULED FIXTURES ({fixtures.length})</h3>
            {!fLoaded ? <p className="text-slate-500 text-xs font-bold animate-pulse">Loading...</p> : fixtures.length === 0 ? <p className="text-slate-500 text-xs font-bold">No fixtures scheduled.</p> : (
              <div className="space-y-3">
                {fixtures.map(f => (
                  <div key={f.id} className="bg-[#0f172a] rounded-xl border border-white/10 p-4 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">{f.tournamentName}</p>
                        <div className="flex items-center gap-3 text-sm font-black text-white">
                          <span className="truncate">{f.homeClubName}</span>
                          <span className="text-slate-500 text-[10px] px-2 py-0.5 bg-white/5 rounded">VS</span>
                          <span className="truncate">{f.awayClubName}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">
                          {f.matchupType === 'home_away' ? 'HOME ADVANTAGE' : 'RANDOM'} &bull; {f.lineupSize}v{f.lineupSize} &bull; {f.subLimit} SUBS &bull; 
                          <span className={cn('ml-2', f.status === 'scheduled' ? 'text-amber-400' : f.status === 'completed' ? 'text-emerald-400' : 'text-blue-400')}>
                            {f.status.replace('_', ' ')}
                          </span>
                        </p>
                      </div>
                      <button onClick={() => handleDelFixture(f.id)} disabled={matchBusy} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all disabled:opacity-50 h-fit"><Trash2 size={14} /></button>
                    </div>

                    {/* Sub-Matches */}
                    {(f.status === 'active' || f.status === 'completed') && (
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Matchups</p>
                        {f.subMatches.map((sm, i) => (
                          <div key={sm.id} className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded-lg">
                            <span className="text-[10px] font-bold text-white flex-1 truncate text-right">{sm.p1Name}</span>
                            
                            {sm.p1Score !== null && sm.p2Score !== null ? (
                              <div className="flex items-center gap-2 px-2">
                                <span className="text-xs font-black text-amber-400 w-4 text-center">{sm.p1Score}</span>
                                <span className="text-[8px] text-slate-500">-</span>
                                <span className="text-xs font-black text-amber-400 w-4 text-center">{sm.p2Score}</span>
                              </div>
                            ) : scoringSubMatch?.subMatchId === sm.id ? (
                              <div className="flex items-center gap-1">
                                <input type="number" min="0" value={smScores.s1} onChange={e => setSmScores({...smScores, s1: e.target.value})} className="w-8 p-1 bg-black text-white text-xs font-black text-center rounded border border-white/10 outline-none focus:border-amber-500" />
                                <span className="text-[8px] text-slate-500">-</span>
                                <input type="number" min="0" value={smScores.s2} onChange={e => setSmScores({...smScores, s2: e.target.value})} className="w-8 p-1 bg-black text-white text-xs font-black text-center rounded border border-white/10 outline-none focus:border-amber-500" />
                                <button onClick={() => handleScoreSubMatch(f, sm)} disabled={matchBusy} className="ml-2 px-2 py-1 bg-amber-500 text-black text-[9px] font-black rounded uppercase">Save</button>
                                <button onClick={() => setScoringSubMatch(null)} className="px-2 py-1 bg-white/10 text-slate-400 hover:text-white text-[9px] font-black rounded uppercase">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setScoringSubMatch({ fixtureId: f.id, subMatchId: sm.id })} className="px-3 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[9px] font-black rounded uppercase">Record</button>
                            )}
                            
                            <span className="text-[10px] font-bold text-white flex-1 truncate">{sm.p2Name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MATCHES subtab ── */}
      {subTab === 'matches' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-black tracking-tight mb-1">RECORD CLUB MATCH</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5">
              Season: <span className="text-amber-400">{config.season}</span> — auto-tagged, updates global + club rankings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              {/* P1 picker */}
              <div className="space-y-1 relative">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Player 1</label>
                <input value={p1Search || p1Player?.name || ''} onFocus={() => setShowP1(true)}
                  onChange={e => { setP1Search(e.target.value); setMForm({...mForm, p1Id: ''}); setShowP1(true); }}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-amber-500 outline-none" placeholder="Search player 1..." />
                <AnimatePresence>
                  {showP1 && p1Search && !mForm.p1Id && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute z-50 w-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {filtP1.map(p => (
                        <button key={p.id} type="button" onClick={() => { setMForm({...mForm, p1Id: p.id}); setP1Search(''); setShowP1(false); }}
                          className="w-full p-3 flex items-center gap-3 hover:bg-white/5 border-b border-white/5 last:border-0 text-left">
                          <img src={p.image} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                          <div><p className="text-[10px] font-black">{p.name}</p><p className="text-[8px] text-slate-500">OVR {p.ovr}</p></div>
                        </button>
                      ))}
                      {filtP1.length === 0 && <div className="p-3 text-center text-slate-500 text-xs font-bold">Not found</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
                {p1Player && <div className="flex items-center gap-2 mt-2 p-2 bg-white/5 rounded-lg border border-white/5"><img src={p1Player.image} className="w-7 h-7 rounded-lg object-cover" alt="" /><span className="text-xs font-black text-white">{p1Player.name}</span><span className="text-[9px] text-slate-500 ml-auto">OVR {p1Player.ovr}</span></div>}
              </div>
              {/* P2 picker */}
              <div className="space-y-1 relative">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Player 2</label>
                <input value={p2Search || p2Player?.name || ''} onFocus={() => setShowP2(true)}
                  onChange={e => { setP2Search(e.target.value); setMForm({...mForm, p2Id: ''}); setShowP2(true); }}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-amber-500 outline-none" placeholder="Search player 2..." />
                <AnimatePresence>
                  {showP2 && p2Search && !mForm.p2Id && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute z-50 w-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {filtP2.map(p => (
                        <button key={p.id} type="button" onClick={() => { setMForm({...mForm, p2Id: p.id}); setP2Search(''); setShowP2(false); }}
                          className="w-full p-3 flex items-center gap-3 hover:bg-white/5 border-b border-white/5 last:border-0 text-left">
                          <img src={p.image} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                          <div><p className="text-[10px] font-black">{p.name}</p><p className="text-[8px] text-slate-500">OVR {p.ovr}</p></div>
                        </button>
                      ))}
                      {filtP2.length === 0 && <div className="p-3 text-center text-slate-500 text-xs font-bold">Not found</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
                {p2Player && <div className="flex items-center gap-2 mt-2 p-2 bg-white/5 rounded-lg border border-white/5"><img src={p2Player.image} className="w-7 h-7 rounded-lg object-cover" alt="" /><span className="text-xs font-black text-white">{p2Player.name}</span><span className="text-[9px] text-slate-500 ml-auto">OVR {p2Player.ovr}</span></div>}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <input type="number" min="0" value={mForm.p1Score} onChange={e => setMForm({...mForm, p1Score: e.target.value})}
                placeholder={p1Player ? p1Player.name.split(' ')[0] : 'P1 Score'}
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-sm font-black text-white text-center focus:border-amber-500 outline-none" />
              <span className="text-slate-500 font-black text-lg shrink-0">VS</span>
              <input type="number" min="0" value={mForm.p2Score} onChange={e => setMForm({...mForm, p2Score: e.target.value})}
                placeholder={p2Player ? p2Player.name.split(' ')[0] : 'P2 Score'}
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-sm font-black text-white text-center focus:border-amber-500 outline-none" />
            </div>
            <button onClick={handleAddMatch} disabled={matchBusy || !mForm.p1Id || !mForm.p1Score || !mForm.p2Score}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all uppercase">
              {matchBusy ? 'SAVING...' : 'RECORD MATCH'}
            </button>
            {matchMsg.text && <p className={cn('text-[10px] font-bold text-center mt-3', matchMsg.ok ? 'text-emerald-400' : 'text-red-400')}>{matchMsg.text}</p>}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight">MATCH LOG ({clubMatches.length})</h3>
              <button onClick={() => { setMatchesLoaded(false); }} disabled={matchBusy}
                className="text-[10px] font-black text-amber-400 hover:text-amber-300 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 transition-all">
                ↻ REFRESH
              </button>
            </div>
            {!matchesLoaded ? (
              <p className="text-slate-500 text-xs font-bold animate-pulse text-center py-10">Loading matches...</p>
            ) : clubMatches.length === 0 ? (
              <p className="text-slate-500 text-xs font-bold text-center py-10">No club-season matches yet. Record the first one above.</p>
            ) : (
              <div className="space-y-3">
                {clubMatches.map(m => (
                  <div key={m.id} className="bg-[#0f172a] rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                        {new Date(m.timestamp).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })} &bull; {m.tournament}
                      </span>
                      {editMatchId === m.id ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">{m.p1Name}</span>
                          <input type="number" value={editS1} onChange={e => setEditS1(e.target.value)} className="w-14 bg-white/10 border border-white/20 p-2 rounded-lg text-xs font-black text-white text-center focus:border-amber-500 outline-none" />
                          <span className="text-slate-500 font-bold">–</span>
                          <input type="number" value={editS2} onChange={e => setEditS2(e.target.value)} className="w-14 bg-white/10 border border-white/20 p-2 rounded-lg text-xs font-black text-white text-center focus:border-amber-500 outline-none" />
                          <span className="text-xs font-black text-white">{m.p2Name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-black flex-wrap">
                          <span className={m.p1Score > m.p2Score ? 'text-amber-400' : m.p1Score < m.p2Score ? 'text-red-400' : 'text-white'}>{m.p1Name}</span>
                          <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">{m.p1Score}</span>
                          <span className="text-slate-500 text-xs">–</span>
                          <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">{m.p2Score}</span>
                          <span className={m.p2Score > m.p1Score ? 'text-amber-400' : m.p2Score < m.p1Score ? 'text-red-400' : 'text-white'}>{m.p2Name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {editMatchId === m.id ? (
                        <>
                          <button onClick={() => handleEditMatch(m)} disabled={matchBusy} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] rounded-xl transition-all disabled:opacity-50 uppercase">SAVE</button>
                          <button onClick={() => setEditMatchId(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[10px] rounded-xl transition-all uppercase">CANCEL</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditMatchId(m.id); setEditS1(String(m.p1Score)); setEditS2(String(m.p2Score)); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] rounded-xl transition-all uppercase">EDIT</button>
                          <button onClick={() => handleDeleteMatch(m)} disabled={matchBusy} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all disabled:opacity-50"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ── SEASONS subtab ── */}
      {subTab === 'seasons' && (
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400"><Calendar size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Internal Club Seasons</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Season: {globalSeason}</p>
              </div>
            </div>

            {/* Season history */}
            <div className="space-y-3 mb-6">
              {clubSeasons.length === 0 && <p className="text-slate-600 text-sm font-bold text-center py-4">No internal seasons started yet for {globalSeason}.</p>}
              {clubSeasons.map(s => (
                <div key={s.id} className={`flex items-center justify-between p-4 rounded-2xl border ${s.status === 'active' ? 'bg-emerald-500/5 border-emerald-500/20' : s.status === 'completed' ? 'bg-white/3 border-white/5' : 'bg-white/3 border-white/5'}`}>
                  <div>
                    <p className="font-black text-white text-sm">{s.label} <span className="text-[10px] font-bold text-slate-500 ml-2">{globalSeason}</span></p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{s.status === 'active' ? `Started ${new Date(s.startedAt!).toLocaleDateString()}` : s.status === 'completed' ? `Ended ${new Date(s.endedAt!).toLocaleDateString()}` : 'Upcoming'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'completed' ? 'bg-white/10 text-slate-500' : 'bg-white/5 text-slate-600'}`}>{s.status}</span>
                    {s.status === 'active' && (
                      <button onClick={async () => {
                        if (!window.confirm('End this season? Final standings will be saved.')) return;
                        await endClubSeason(s.id, {});
                        await fetchClubSeasons(globalSeason).then(setClubSeasons);
                        setSeasonMsg('Season ended and standings saved.');
                      }} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[9px] font-black uppercase hover:bg-red-500/20 transition-all">End Season</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={async () => {
              const activeSeason = clubSeasons.find(s => s.status === 'active');
              if (activeSeason) { setSeasonMsg('An active season already exists. End it first.'); return; }
              const nextNum = clubSeasons.length + 1;
              if (!window.confirm(`Start Season ${nextNum} under ${globalSeason}?`)) return;
              await startClubSeason(globalSeason, nextNum);
              await fetchClubSeasons(globalSeason).then(setClubSeasons);
              // Broadcast to all club owners
              const ownerIds = clubs.map(c => c.ownerId).filter(Boolean);
              await broadcastToAllOwners(ownerIds, { type: 'system', from: null, message: `📅 Season ${nextNum} of ${globalSeason} has started! Good luck to all clubs.` });
              setSeasonMsg(`Season ${nextNum} started!`);
            }} className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              + Start New Season
            </button>
            {seasonMsg && <p className="text-center text-xs font-bold text-emerald-400 mt-3">{seasonMsg}</p>}
          </div>
        </div>
      )}

      {/* ── AUCTION subtab ── */}
      {subTab === 'auction' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black tracking-tight mb-1">LIVE AUCTION CONTROL</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manage player distribution and live bidding sessions</p>
            </div>
            {auctionState && auctionState.status !== 'ended' && (
              <button onClick={adminEndAuction} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                End Session
              </button>
            )}
          </div>

          {!auctionState || auctionState.status === 'ended' ? (
            <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
                <Gavel size={32} />
              </div>
              <h4 className="text-lg font-black text-white uppercase mb-2">No Active Session</h4>
              <p className="text-slate-400 text-xs font-bold max-w-xs mx-auto mb-8">Set the base price and bid increment to start a new auction session for all clubs.</p>
              
              <div className="max-w-sm mx-auto grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Base Price</label>
                  <input type="number" value={setupBasePrice} onChange={e => setSetupBasePrice(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold focus:border-amber-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Increment</label>
                  <input type="number" value={setupIncrement} onChange={e => setSetupIncrement(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold focus:border-amber-500 outline-none" />
                </div>
                <button 
                  onClick={async () => {
                    if (!clubs.length) { alert('No clubs found!'); return; }
                    await adminStartAuction(clubs.map(c => c.id), Number(setupIncrement), Number(setupBasePrice));
                    setMsg({ text: 'Auction session started!', type: 'success' });
                  }}
                  className="col-span-2 py-4 bg-amber-500 text-black font-black text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase"
                >
                  Start Auction Session
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Player Reveal & Controls */}
              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4">REVEAL PLAYER CARD</h4>
                  <div className="flex gap-2 mb-4">
                    <select 
                      value={revealPlayerId} 
                      onChange={e => setRevealPlayerId(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-amber-500/50"
                    >
                      <option value="">Select a Free Agent...</option>
                      {players.filter(p => !p.clubId || p.clubId === '').map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.ovr} OVR)</option>
                      ))}
                    </select>
                    <button
                      onClick={async () => {
                        if (!revealPlayerId) return;
                        const p = players.find(pl => pl.id === revealPlayerId)!;
                        await adminRevealCard({ id: p.id, name: p.name, image: p.image, ovr: p.ovr, currentClubId: p.clubId || null, currentClubName: p.clubName || null }, Number(setupBasePrice), Number(setupIncrement));
                        setRevealPlayerId('');
                      }}
                      className="px-6 bg-amber-500 text-black rounded-xl text-xs font-black uppercase hover:bg-amber-600 transition-all"
                    >
                      REVEAL
                    </button>
                  </div>
                  
                  {auctionState.currentPlayer ? (
                    <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <img src={auctionState.currentPlayer.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="text-xs font-black text-white">{auctionState.currentPlayer.name}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{auctionState.currentPlayer.ovr} OVR PLAYER</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      Waiting to reveal...
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={!auctionState.leadingClubId || auctionState.status === 'sold'}
                    onClick={async () => {
                      const winningClub = clubs.find(c => c.id === auctionState.leadingClubId);
                      if (winningClub) {
                        await adminConfirmSold(auctionState, winningClub);
                        setMsg({ text: 'Player SOLD successfully!', type: 'success' });
                      }
                    }}
                    className="py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30"
                  >
                    Confirm Sold
                  </button>
                  <button 
                    onClick={adminSkipPlayer}
                    className="py-4 bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    Skip Player
                  </button>
                </div>
              </div>

              {/* Right: Live Status */}
              <div className="space-y-6">
                <div className="p-6 bg-[#0a0a14] border border-amber-500/20 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">LIVE BID STATUS</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-5xl font-black text-white">{(auctionState.currentBid / 1000).toFixed(0)}K</span>
                    <span className="text-amber-500 font-black text-xs uppercase">Current Bid</span>
                  </div>
                  
                  {auctionState.leadingClubId ? (
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                      <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{auctionState.leadingClubName} IS LEADING</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Waiting for first bid...</p>
                  )}
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">BIDDING ORDER</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
                    {auctionState.biddingOrder.map((clubId, idx) => {
                      const club = clubs.find(c => c.id === clubId);
                      const isFolded = auctionState.foldedClubs.includes(clubId);
                      const isTurn = auctionState.biddingOrder[auctionState.currentTurnIndex % auctionState.biddingOrder.length] === clubId;
                      return (
                        <div key={clubId} className={cn("flex items-center justify-between p-3 rounded-xl border", isFolded ? "bg-white/5 border-white/5 opacity-50" : isTurn ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10")}>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-500">{idx + 1}</span>
                            <div className="w-6 h-6 rounded flex-shrink-0" style={{ background: club?.primaryColor || '#333' }} />
                            <p className="text-xs font-black text-white">{club?.name}</p>
                          </div>
                          {isFolded ? (
                            <span className="text-[10px] font-black text-red-400 uppercase">Folded</span>
                          ) : isTurn ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500 text-black rounded text-[9px] font-black uppercase">
                              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                              Bidding
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONFIG subtab ── */}
      {subTab === 'config' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h3 className="text-xl font-black tracking-tight mb-2">CLUB SYSTEM CONFIG</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Season settings, transfer window &amp; matchday schedule</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Season Name</label>
                <input value={config.season} onChange={e => setConfig({...config, season: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none" placeholder={currentSeasonName} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Starting Budget (VCC)</label>
                  <input type="number" value={config.startingBudget} onChange={e => setConfig({...config, startingBudget: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Current Matchday</label>
                  <input type="number" value={config.currentMatchday} onChange={e => setConfig({...config, currentMatchday: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Total Matchdays</label>
                <input type="number" value={config.totalMatchdays} onChange={e => setConfig({...config, totalMatchdays: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Transfer Window</label>
                <button onClick={() => setConfig({...config, transferWindowOpen: !config.transferWindowOpen})}
                  className={cn('w-full p-4 rounded-xl text-[10px] font-black tracking-widest transition-all border uppercase mb-2', config.transferWindowOpen ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20')}>
                  {config.transferWindowOpen ? '✓ TRANSFER WINDOW OPEN' : 'TRANSFER WINDOW CLOSED'}
                </button>
                <button onClick={() => setConfig({...config, deadlineDayActive: !config.deadlineDayActive})}
                  className={cn('w-full p-4 rounded-xl text-[10px] font-black tracking-widest transition-all border uppercase flex items-center justify-center gap-2', config.deadlineDayActive ? 'bg-red-500 text-black border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20')}>
                  {config.deadlineDayActive ? '🚨 DEADLINE DAY LIVE' : 'START DEADLINE DAY EVENT'}
                </button>
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Next Auction Schedule</label>
                <input value={config.auctionSchedule || ''} onChange={e => setConfig({...config, auctionSchedule: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-amber-500 outline-none" placeholder="e.g. Sunday, 8:00 PM PST" />
                <p className="text-[8px] font-bold text-slate-500 mt-1">This will be displayed in the Club Zone when no auction is active.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Contracts Economy</label>
                  <button onClick={() => setConfig({...config, contractsActive: !config.contractsActive})}
                    className={cn('text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase', config.contractsActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>
                    {config.contractsActive ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
                {config.contractsActive && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Default Type</label>
                      <select value={config.defaultContractType} onChange={e => setConfig({...config, defaultContractType: e.target.value as 'matches'|'days'})} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-lg text-xs font-bold text-white focus:border-brand-purple outline-none">
                        <option value="matches" className="text-black">Matches</option>
                        <option value="days" className="text-black">Days</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Default Amount</label>
                      <input type="number" min="1" value={config.defaultContractAmount} onChange={e => setConfig({...config, defaultContractAmount: Number(e.target.value)})} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-lg text-xs font-bold focus:border-brand-purple outline-none" />
                    </div>
                  </div>
                )}
              </div>

              {config.transferWindowOpen && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Window Close Date</label>
                  <input type="date" value={config.transferWindowCloseDate || ''} onChange={e => setConfig({...config, transferWindowCloseDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-brand-purple outline-none" />
                </div>
              )}
              <div className="p-4 bg-[#0f172a] rounded-xl border border-white/5 space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Config Summary</p>
                <p className="text-xs font-bold text-white">{config.season}</p>
                <p className="text-[10px] text-slate-400">Matchday {config.currentMatchday} / {config.totalMatchdays} &bull; Budget VCC {config.startingBudget.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">Contracts: <span className={config.contractsActive ? 'text-emerald-400' : 'text-red-400'}>{config.contractsActive ? `${config.defaultContractAmount} ${config.defaultContractType}` : 'OFF'}</span></p>
                <p className="text-[10px] text-slate-400">Transfer Window: <span className={config.transferWindowOpen ? 'text-emerald-400' : 'text-red-400'}>{config.transferWindowOpen ? 'OPEN' : 'CLOSED'}</span></p>
              </div>
              <button onClick={handleSaveConfig} disabled={configSaving} className="w-full py-4 glossy-btn rounded-xl disabled:opacity-50 uppercase text-xs font-black tracking-widest">
                {configSaving ? 'SAVING...' : 'SAVE CONFIG'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY subtab ── */}
      {subTab === 'history' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 flex-1">
              {hSeasons.map(s => (
                <button key={s.id} onClick={() => setHSelectedSeasonId(s.id)} 
                  className={cn("px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap", 
                    hSelectedSeasonId === s.id ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/25" : "bg-white/5 text-slate-500 hover:text-white"
                  )}>
                  {s.id.replace('__', ' ')}
                </button>
              ))}
            </div>
            {hSelectedSeasonId && (
              <button onClick={handleDeleteSeason} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[9px] font-black tracking-widest transition-all uppercase whitespace-nowrap">
                🗑️ DELETE SEASON
              </button>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            {hLoading ? (
               <p className="text-slate-500 text-xs font-bold animate-pulse text-center py-20 uppercase tracking-widest">Fetching club records...</p>
            ) : Object.keys(groupedHistory).length === 0 ? (
               <div className="text-center py-20">
                 <History size={48} className="text-slate-700 mx-auto mb-4" />
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No history found for this season</p>
               </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedHistory).map(([tName, matchdays]: [string, any]) => (
                  <div key={tName} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <h4 className="text-lg font-black tracking-tight uppercase italic text-amber-500">{tName}</h4>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {Object.entries(matchdays).sort((a,b) => Number(a[0]) - Number(b[0])).map(([md, matches]: [string, any]) => (
                        <div key={md} className="space-y-3">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MATCHDAY {md}</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {matches.map((m: MatchRecord) => (
                              <div key={m.id} className="bg-[#0f172a] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-all">
                                <div className="flex-1">
                                  <p className="text-[8px] font-black text-slate-600 uppercase mb-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                                  {hEditingMatch?.id === m.id ? (
                                    <div className="flex items-center gap-2">
                                      <input type="number" value={hEditForm.p1Score} onChange={e => setHEditForm({...hEditForm, p1Score: e.target.value})} className="w-12 bg-white/10 border border-white/20 p-2 rounded text-xs font-black text-white text-center" />
                                      <span className="text-slate-500 font-bold">-</span>
                                      <input type="number" value={hEditForm.p2Score} onChange={e => setHEditForm({...hEditForm, p2Score: e.target.value})} className="w-12 bg-white/10 border border-white/20 p-2 rounded text-xs font-black text-white text-center" />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-black text-white uppercase">{m.p1Name}</span>
                                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black text-amber-500">{m.p1Score}</span>
                                      <span className="text-slate-600 font-bold">-</span>
                                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black text-amber-500">{m.p2Score}</span>
                                      <span className="text-[11px] font-black text-white uppercase">{m.p2Name}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {hEditingMatch?.id === m.id ? (
                                    <>
                                      <button onClick={handleHistoryEditMatch} className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase">SAVE</button>
                                      <button onClick={() => setHEditingMatch(null)} className="px-3 py-1.5 bg-white/5 text-slate-400 text-[9px] font-black rounded-lg uppercase">X</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => { setHEditingMatch(m); setHEditForm({ p1Score: String(m.p1Score), p2Score: String(m.p2Score), tournament: m.tournament || '', matchday: String(m.matchday || 1) }); }} className="p-2 text-slate-500 hover:text-white transition-all"><Settings size={14} /></button>
                                      <button onClick={() => handleHistoryDeleteMatch(m)} className="p-2 text-red-500/50 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}


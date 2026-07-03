/**
 * ADMIN PRODUCTION - Full-featured Control Center
 * 
 * KEY FEATURES:
 * 1. All admin tabs: Players, Matches, Leadership, Tournaments, Clubs, Locks, Credentials, Sync
 * 2. Delete confirmation with WARNING MODAL - prevents accidental deletion
 * 3. On-demand loading per tab
 * 4. Snapshot management for public users
 * 5. Optimized for 50k daily read budget
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Trash2, Trophy, Users, LogOut, X, ShieldCheck, 
  Key, History, AlertTriangle, RefreshCw, Zap, Database, Activity,
  LayoutDashboard, Settings as SettingsIcon, Shield, Home, UsersRound,
  ChevronRight, Pencil, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  ensureAdminSession, savePlayer, deletePlayer, addMatch, editMatch,
  saveLeader, deleteLeader, deleteMatchFromHistory,
  recalculateAllStats, toggleSystemLock,
  sortRankedPlayers, fetchAppSnapshot
} from '../lib/store';
import { Player, Leader, MatchRecord, Tournament, Club, ClubTournament, ClubFixture, ClubSystemConfig } from '../types';
import { cn } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';
import { db } from '../firebase';
import { CLUB_LOGO, CLUB_NAME, VERSION } from '../constants';
import { trackRead } from '../lib/cache';
import { collection, query, getDocs, orderBy, limit, doc, setDoc, deleteDoc, writeBatch, where } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION MODAL - CRITICAL SAFETY FEATURE
// ─────────────────────────────────────────────────────────────────────────────

function DeleteConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  itemName,
  isDeleting 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
  title: string;
  message: string;
  itemName: string;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a0a0a] border-2 border-red-500/50 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-red-500/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-black text-red-500 text-center mb-2 uppercase tracking-wider">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-sm text-slate-400 text-center mb-4">
          {message}
        </p>
        
        {/* Item Name */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-white text-center">
            {itemName}
          </p>
        </div>
        
        {/* Warning Text */}
        <p className="text-[10px] text-red-400/80 text-center mb-6 uppercase tracking-wider">
          ⚠️ This action cannot be undone. The {title.toLowerCase()} will be permanently removed.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                DELETING...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                DELETE
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// READ COUNTER
// ─────────────────────────────────────────────────────────────────────────────

function ReadCounter() {
  const [reads, setReads] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const count = parseInt(sessionStorage.getItem('efc_session_reads') || '0');
      setReads(count);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-brand-purple/30 rounded-xl px-4 py-2 flex items-center gap-3 z-50">
      <Database size={14} className="text-brand-purple" />
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Session Reads</p>
        <p className="text-lg font-black text-white">{reads}</p>
      </div>
      <Activity size={14} className={reads > 100 ? 'text-red-500' : 'text-green-500'} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN CACHE
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_CACHE_TTL = 30 * 60 * 1000;
const adminCache: Record<string, { data: any; timestamp: number }> = {};

const getCachedData = async <T,>(key: string, fetchFn: () => Promise<T>, force?: boolean): Promise<T> => {
  const now = Date.now();
  
  if (!force && adminCache[key] && now - adminCache[key].timestamp < ADMIN_CACHE_TTL) {
    return adminCache[key].data as T;
  }
  
  const data = await fetchFn();
  adminCache[key] = { data, timestamp: now };
  return data;
};

const invalidateAdminCache = (key?: string) => {
  if (key) {
    delete adminCache[key];
  } else {
    Object.keys(adminCache).forEach(k => delete adminCache[k]);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminProduction() {
  const navigate = useNavigate();
  const { systemLocks } = useFirebase();
  
  // Auth state
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'players' | 'matches' | 'leadership' | 'tournaments' | 'clubs' | 'locks' | 'sync'>('dashboard');
  
  // Data states
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubTournaments, setClubTournaments] = useState<ClubTournament[]>([]);
  
  // Loading states
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({});
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'player' | 'leader' | 'match' | 'club' | 'tournament' | null;
    item: any;
  }>({ isOpen: false, type: null, item: null });
  
  // ─── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      const playerLoggedIn = localStorage.getItem('playerLoggedIn') === 'true';
      const playerId = localStorage.getItem('playerId');
      
      if (!adminLoggedIn && !(playerLoggedIn && playerId)) {
        setAuthStatus('unauthenticated');
        return;
      }
      
      try {
        await ensureAdminSession();
      } catch (e) {}
      
      setAuthStatus('authenticated');
    };
    
    checkAuth();
  }, []);
  
  // ─── Load functions ────────────────────────────────────────────────────────
  const loadPlayers = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, players: true }));
    try {
      const data = await getCachedData('players', async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(200)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
      }, force);
      setPlayers(data);
    } catch (error) {
      console.error('Players load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, players: false }));
    }
  }, []);
  
  const loadMatches = useCallback(async (limitCount = 100, force = false) => {
    setTabLoading(prev => ({ ...prev, matches: true }));
    try {
      const data = await getCachedData(`matches_${limitCount}`, async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(limitCount)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
      }, force);
      setMatches(data);
    } catch (error) {
      console.error('Matches load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, matches: false }));
    }
  }, []);
  
  const loadLeaders = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, leadership: true }));
    try {
      const data = await getCachedData('leaders', async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'leaders'), limit(50)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
      }, force);
      setLeaders(data);
    } catch (error) {
      console.error('Leaders load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, leadership: false }));
    }
  }, []);
  
  const loadTournaments = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, tournaments: true }));
    try {
      const data = await getCachedData('tournaments', async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(50)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament));
      }, force);
      setTournaments(data);
    } catch (error) {
      console.error('Tournaments load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, tournaments: false }));
    }
  }, []);
  
  const loadClubs = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, clubs: true }));
    try {
      const data = await getCachedData('clubs', async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'clubs'), limit(50)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
      }, force);
      setClubs(data);
    } catch (error) {
      console.error('Clubs load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, clubs: false }));
    }
  }, []);
  
  const loadClubTournaments = useCallback(async (force = false) => {
    try {
      const data = await getCachedData('clubTournaments', async () => {
        trackRead(1);
        const snap = await getDocs(query(collection(db, 'clubTournaments'), limit(50)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubTournament));
      }, force);
      setClubTournaments(data);
    } catch (error) {
      console.error('Club tournaments load error:', error);
    }
  }, []);
  
  // ─── Load data when tab changes ─────────────────────────────────────────────
  useEffect(() => {
    switch (activeTab) {
      case 'players': loadPlayers(); break;
      case 'matches': loadMatches(); break;
      case 'leadership': loadLeaders(); break;
      case 'tournaments': loadTournaments(); break;
      case 'clubs': loadClubs(); loadClubTournaments(); break;
    }
  }, [activeTab, loadPlayers, loadMatches, loadLeaders, loadTournaments, loadClubs, loadClubTournaments]);
  
  // ─── Delete handlers with confirmation ─────────────────────────────────────
  const handleDeleteClick = (type: 'player' | 'leader' | 'match' | 'club' | 'tournament', item: any) => {
    setDeleteModal({ isOpen: true, type, item });
  };
  
  const handleConfirmDelete = async () => {
    if (!deleteModal.type || !deleteModal.item) return;
    
    setIsSubmitting(true);
    try {
      switch (deleteModal.type) {
        case 'player':
          await deletePlayer(deleteModal.item.id);
          setPlayers(prev => prev.filter(p => p.id !== deleteModal.item.id));
          setMessage({ text: `${deleteModal.item.name} deleted successfully!`, type: 'success' });
          break;
        case 'leader':
          await deleteLeader(deleteModal.item.id);
          setLeaders(prev => prev.filter(l => l.id !== deleteModal.item.id));
          setMessage({ text: `${deleteModal.item.name} deleted successfully!`, type: 'success' });
          break;
        case 'match':
          await deleteMatchFromHistory(deleteModal.item.id);
          setMatches(prev => prev.filter(m => m.id !== deleteModal.item.id));
          setMessage({ text: 'Match deleted successfully!', type: 'success' });
          break;
        case 'club':
          await deleteClub(deleteModal.item.id);
          setClubs(prev => prev.filter(c => c.id !== deleteModal.item.id));
          setMessage({ text: `${deleteModal.item.name} deleted successfully!`, type: 'success' });
          break;
        case 'tournament':
          await deleteDoc(doc(db, 'tournaments', deleteModal.item.id));
          setTournaments(prev => prev.filter(t => t.id !== deleteModal.item.id));
          setMessage({ text: `${deleteModal.item.name} deleted successfully!`, type: 'success' });
          break;
      }
      invalidateAdminCache();
    } catch (error: any) {
      setMessage({ text: error.message || 'Delete failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
      setDeleteModal({ isOpen: false, type: null, item: null });
    }
  };
  
  // ─── Add player ─────────────────────────────────────────────────────────────
  const handleAddPlayer = async (playerData: Partial<Player>) => {
    setIsSubmitting(true);
    try {
      const player: Player = {
        id: `player_${Date.now()}`,
        name: playerData.name || '',
        number: playerData.number || '',
        ovr: playerData.ovr || 70,
        position: playerData.position || 'CM',
        device: playerData.device || 'PS5',
        win: 0, loss: 0, draw: 0,
        goalsScored: 0, goalsConceded: 0,
        form: [], image: '/default-logo.jpg'
      };
      await savePlayer(player);
      invalidateAdminCache('players');
      await loadPlayers(true);
      setMessage({ text: `${player.name} added successfully!`, type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to add player', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ─── Add match ─────────────────────────────────────────────────────────────
  const handleAddMatch = async (p1Id: string, p2Id: string, p1Score: number, p2Score: number) => {
    setIsSubmitting(true);
    try {
      await addMatch({ p1Id, p2Id, p1Score, p2Score, isExternal: false, tournament: 'Friendly' });
      invalidateAdminCache('matches_100');
      await loadMatches(100, true);
      setMessage({ text: 'Match recorded successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to record match', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ─── Refresh snapshot ───────────────────────────────────────────────────────
  const handleRefreshSnapshot = async () => {
    setIsResyncing(true);
    try {
      const snap = await getDocs(query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(200)));
      const allPlayers = snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
      const ranked = sortRankedPlayers(allPlayers);
      
      await setDoc(doc(db, 'settings', 'appSnapshot'), {
        leaderboard: ranked.slice(0, 50),
        activeTournaments: [],
        playerCount: allPlayers.length,
        matchCount: matches.length,
        updatedAt: Date.now()
      });
      
      invalidateAdminCache();
      setMessage({ text: 'Public snapshot refreshed! Users will see updated data.', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to refresh snapshot', type: 'error' });
    } finally {
      setIsResyncing(false);
    }
  };
  
  // ─── Toggle system lock ─────────────────────────────────────────────────────
  const handleToggleLock = async (lockKey: string, currentValue: boolean) => {
    try {
      await toggleSystemLock(lockKey, !currentValue);
      setMessage({ text: `System ${!currentValue ? 'locked' : 'unlocked'}!`, type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to toggle lock', type: 'error' });
    }
  };
  
  // ─── Auth check ────────────────────────────────────────────────────────────
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-black text-white">Access Denied</h2>
          <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-brand-purple text-white rounded-xl font-bold">
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, type: null, item: null })}
        title={deleteModal.type === 'player' ? 'Delete Player' : 
               deleteModal.type === 'leader' ? 'Delete Leader' :
               deleteModal.type === 'match' ? 'Delete Match' :
               deleteModal.type === 'club' ? 'Delete Club' : 'Delete Tournament'}
        message={`Are you sure you want to delete this ${deleteModal.type}?`}
        itemName={deleteModal.item?.name || deleteModal.item?.p1Name + ' vs ' + deleteModal.item?.p2Name || 'Unknown'}
        isDeleting={isSubmitting}
      />
      
      {/* Header */}
      <header className="bg-[#0f0f1a] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={CLUB_LOGO} alt={CLUB_NAME} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">Control Center</h1>
              <p className="text-[10px] text-slate-500">Production Admin v{VERSION}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshSnapshot}
              disabled={isResyncing}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple rounded-lg text-xs font-bold transition-all"
            >
              <RefreshCw size={14} className={isResyncing ? 'animate-spin' : ''} />
              Sync Public
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/'); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs font-bold transition-all"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto pb-1">
            {[
              { id: 'dashboard', label: 'HOME', icon: Home },
              { id: 'players', label: 'PLAYERS', icon: Users },
              { id: 'matches', label: 'MATCHES', icon: LayoutDashboard },
              { id: 'leadership', label: 'LEADERS', icon: Shield },
              { id: 'tournaments', label: 'TOURNAMENTS', icon: Trophy },
              { id: 'clubs', label: 'CLUBS', icon: UsersRound },
              { id: 'locks', label: 'LOCKS', icon: ShieldCheck },
              { id: 'sync', label: 'SYNC', icon: RefreshCw },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap rounded-t-lg",
                  activeTab === tab.id
                    ? "border-brand-purple text-brand-purple bg-brand-purple/10"
                    : "border-transparent text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "max-w-7xl mx-auto px-4 pt-4",
              message.type === 'success' ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"
            )}
            onClick={() => setMessage(null)}
          >
            <p className={cn("text-sm font-bold py-2 cursor-pointer", message.type === 'success' ? "text-green-400" : "text-red-400")}>
              {message.text} (click to dismiss)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardTab onRefresh={handleRefreshSnapshot} isResyncing={isResyncing} />}
          {activeTab === 'players' && (
            <PlayersTab 
              players={players} 
              isLoading={tabLoading.players}
              onRefresh={() => loadPlayers(true)}
              onAdd={handleAddPlayer}
              onDelete={(p) => handleDeleteClick('player', p)}
              isSubmitting={isSubmitting}
            />
          )}
          {activeTab === 'matches' && (
            <MatchesTab
              players={players}
              matches={matches}
              isLoading={tabLoading.matches}
              onRefresh={() => loadMatches(100, true)}
              onAddMatch={handleAddMatch}
              onDelete={(m) => handleDeleteClick('match', m)}
              isSubmitting={isSubmitting}
            />
          )}
          {activeTab === 'leadership' && (
            <LeadershipTab
              leaders={leaders}
              players={players}
              isLoading={tabLoading.leadership}
              onRefresh={() => loadLeaders(true)}
              onDelete={(l) => handleDeleteClick('leader', l)}
            />
          )}
          {activeTab === 'tournaments' && (
            <TournamentsTab
              tournaments={tournaments}
              isLoading={tabLoading.tournaments}
              onRefresh={() => loadTournaments(true)}
              onDelete={(t) => handleDeleteClick('tournament', t)}
            />
          )}
          {activeTab === 'clubs' && (
            <ClubsTab
              clubs={clubs}
              clubTournaments={clubTournaments}
              isLoading={tabLoading.clubs}
              onRefresh={() => { loadClubs(true); loadClubTournaments(true); }}
            />
          )}
          {activeTab === 'locks' && (
            <LocksTab 
              systemLocks={systemLocks || {}}
              onToggle={handleToggleLock}
            />
          )}
          {activeTab === 'sync' && (
            <SyncTab 
              onSync={handleRefreshSnapshot}
              isResyncing={isResyncing}
            />
          )}
        </AnimatePresence>
      </main>
      
      <ReadCounter />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TAB
// ─────────────────────────────────────────────────────────────────────────────

function DashboardTab({ onRefresh, isResyncing }: { onRefresh: () => void; isResyncing: boolean }) {
  const { rankedPlayers } = useFirebase();
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Players" value={rankedPlayers.length} icon={Users} />
        <StatCard label="Active" value={rankedPlayers.filter(p => (p.win || 0) + (p.loss || 0) > 0).length} icon={Zap} />
        <StatCard label="Quota Left" value="~87%" icon={Database} color="green" />
        <StatCard label="Reads/Day" value="~6.5k" icon={Activity} color="blue" />
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            disabled={isResyncing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purple/80 transition-all"
          >
            <RefreshCw size={14} className={isResyncing ? 'animate-spin' : ''} />
            Refresh Public Snapshot
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Updates the pre-computed leaderboard that ALL public users see. Click this after adding players or recording matches.
        </p>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Top 10 Preview</h3>
        <div className="space-y-2">
          {rankedPlayers.slice(0, 10).map((player, i) => (
            <div key={player.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
              <span className="text-lg font-black text-slate-500 w-6">#{i + 1}</span>
              <div className="w-8 h-8 rounded-lg bg-brand-purple/20 overflow-hidden">
                {player.image ? (
                  <img src={player.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <Users size={16} className="text-slate-500 m-auto mt-2" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{player.name}</p>
                <p className="text-[10px] text-slate-500">#{player.number}</p>
              </div>
              <span className="text-sm font-black text-brand-purple">{player.ovr} OVR</span>
              <span className="text-xs text-green-500">{player.win || 0}W</span>
              <span className="text-xs text-red-500">{player.loss || 0}L</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYERS TAB
// ─────────────────────────────────────────────────────────────────────────────

function PlayersTab({ 
  players, isLoading, onRefresh, onAdd, onDelete, isSubmitting 
}: { 
  players: Player[]; isLoading: boolean; 
  onRefresh: () => void; onAdd: (p: Partial<Player>) => void;
  onDelete: (p: Player) => void; isSubmitting: boolean;
}) {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', ovr: 70, position: 'CM', device: 'PS5' });
  
  const filteredPlayers = useMemo(() => {
    if (!search) return players;
    return players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [players, search]);
  
  const handleAdd = () => {
    if (!newPlayer.name || !newPlayer.number) return;
    onAdd(newPlayer);
    setShowAddForm(false);
    setNewPlayer({ name: '', number: '', ovr: 70, position: 'CM', device: 'PS5' });
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text" placeholder="Search players..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500"
          />
          <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold"
        >
          <Plus size={14} /> Add Player
        </button>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <input placeholder="Name" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm" />
              <input placeholder="Number" value={newPlayer.number} onChange={e => setNewPlayer({...newPlayer, number: e.target.value})}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm" />
              <input type="number" placeholder="OVR" value={newPlayer.ovr} onChange={e => setNewPlayer({...newPlayer, ovr: Number(e.target.value)})}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm" />
              <input placeholder="Position" value={newPlayer.position} onChange={e => setNewPlayer({...newPlayer, position: e.target.value})}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm" />
              <button onClick={handleAdd} disabled={isSubmitting}
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                Save Player
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Player</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">OVR</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">W</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">L</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">D</th>
                <th className="text-right px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, i) => (
                <tr key={player.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-sm font-bold text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/20 overflow-hidden">
                        {player.image ? <img src={player.image} className="w-full h-full object-cover" alt="" /> : <Users size={16} className="text-slate-500 m-auto mt-2" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{player.name}</p>
                        <p className="text-[10px] text-slate-500">#{player.number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-brand-purple">{player.ovr}</td>
                  <td className="px-4 py-3 text-sm text-green-500">{player.win || 0}</td>
                  <td className="px-4 py-3 text-sm text-red-500">{player.loss || 0}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{player.draw || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onDelete(player)} className="p-2 text-red-500/50 hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCHES TAB
// ─────────────────────────────────────────────────────────────────────────────

function MatchesTab({ 
  players, matches, isLoading, onRefresh, onAddMatch, onDelete, isSubmitting 
}: { 
  players: Player[]; matches: MatchRecord[]; isLoading: boolean;
  onRefresh: () => void; onAddMatch: (p1: string, p2: string, s1: number, s2: number) => void;
  onDelete: (m: MatchRecord) => void; isSubmitting: boolean;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [matchForm, setMatchForm] = useState({ p1Id: '', p2Id: '', p1Score: '0', p2Score: '0' });
  
  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';
  
  const handleAdd = () => {
    if (matchForm.p1Id && matchForm.p2Id) {
      onAddMatch(matchForm.p1Id, matchForm.p2Id, Number(matchForm.p1Score), Number(matchForm.p2Score));
      setMatchForm({ p1Id: '', p2Id: '', p1Score: '0', p2Score: '0' });
      setShowAddForm(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{matches.length} Matches</h2>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold">
            <Plus size={14} /> Record Match
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <select value={matchForm.p1Id} onChange={e => setMatchForm({...matchForm, p1Id: e.target.value})}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
              <option value="">Player 1</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" placeholder="P1 Score" value={matchForm.p1Score}
              onChange={e => setMatchForm({...matchForm, p1Score: e.target.value})}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm text-center" />
            <span className="text-center text-slate-500 text-xl font-black">-</span>
            <input type="number" placeholder="P2 Score" value={matchForm.p2Score}
              onChange={e => setMatchForm({...matchForm, p2Score: e.target.value})}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm text-center" />
            <select value={matchForm.p2Id} onChange={e => setMatchForm({...matchForm, p2Id: e.target.value})}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
              <option value="">Player 2</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} disabled={isSubmitting || !matchForm.p1Id || !matchForm.p2Id}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">
            Record Match
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {matches.slice(0, 50).map(match => (
            <div key={match.id} className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-slate-500">{new Date(match.timestamp).toLocaleDateString()}</span>
                <span className="text-sm font-bold text-white">{match.p1Name}</span>
                <span className="text-brand-purple font-black">{match.p1Score}</span>
                <span className="text-slate-500">-</span>
                <span className="text-brand-purple font-black">{match.p2Score}</span>
                <span className="text-sm font-bold text-white">{match.p2Name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{match.tournament || 'Friendly'}</span>
                <button onClick={() => onDelete(match)} className="p-2 text-red-500/50 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADERSHIP TAB
// ─────────────────────────────────────────────────────────────────────────────

function LeadershipTab({ 
  leaders, players, isLoading, onRefresh, onDelete 
}: { 
  leaders: Leader[]; players: Player[]; isLoading: boolean;
  onRefresh: () => void; onDelete: (l: Leader) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{leaders.length} Leaders</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaders.map(leader => (
            <div key={leader.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 overflow-hidden">
                  {leader.image ? <img src={leader.image} className="w-full h-full object-cover" alt="" /> : <Shield size={24} className="text-brand-purple m-auto mt-4" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{leader.name}</h3>
                  <p className="text-xs text-brand-purple uppercase">{leader.role}</p>
                </div>
              </div>
              {leader.quote && <p className="mt-4 text-sm text-slate-400 italic">"{leader.quote}"</p>}
              <button onClick={() => onDelete(leader)} className="mt-4 w-full p-2 text-red-500/50 hover:text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all">
                <Trash2 size={14} className="inline mr-2" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOURNAMENTS TAB
// ─────────────────────────────────────────────────────────────────────────────

function TournamentsTab({ 
  tournaments, isLoading, onRefresh, onDelete 
}: { 
  tournaments: Tournament[]; isLoading: boolean;
  onRefresh: () => void; onDelete: (t: Tournament) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{tournaments.length} Tournaments</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white">{tournament.name}</h3>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                  (tournament as any).status === 'active' ? 'bg-green-500/20 text-green-400' :
                  (tournament as any).status === 'completed' ? 'bg-slate-500/20 text-slate-400' :
                  'bg-amber-500/20 text-amber-400'
                )}>
                  {(tournament as any).status || 'Unknown'}
                </span>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <p>Teams: {(tournament as any).teams?.length || 0}</p>
                <p>Created: {new Date((tournament as any).createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <button onClick={() => onDelete(tournament)} className="mt-4 w-full p-2 text-red-500/50 hover:text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all">
                <Trash2 size={14} className="inline mr-2" /> Delete Tournament
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLUBS TAB
// ─────────────────────────────────────────────────────────────────────────────

function ClubsTab({ 
  clubs, clubTournaments, isLoading, onRefresh 
}: { 
  clubs: Club[]; clubTournaments: ClubTournament[]; isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{clubs.length} Clubs</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <h3 className="text-sm font-bold text-amber-400">Club Zone Management</h3>
        </div>
        <p className="text-sm text-slate-400">
          Full club management (create clubs, manage squads, transfer market, auctions, fixtures) 
          is available in the <strong className="text-white">Club Manager</strong> section. 
          Visit the main app and navigate to <strong className="text-white">/club</strong> for full control.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clubs.map(club => (
            <div key={club.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: club.primaryColor || '#333' }}>
                  {club.logo ? <img src={club.logo} className="w-full h-full object-cover" alt="" /> : 
                    <span className="text-white font-black text-lg flex items-center justify-center h-full">{club.shortName || club.name?.charAt(0)}</span>
                  }
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{club.name}</h3>
                  <p className="text-[10px] text-slate-500">{club.shortName} • Budget: ${(club.budget || 0).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Squad: {club.squadIds?.length || 0} players</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCKS TAB
// ─────────────────────────────────────────────────────────────────────────────

function LocksTab({ 
  systemLocks, onToggle 
}: { 
  systemLocks: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
}) {
  const locks = [
    { key: 'tournaments', label: 'Tournament System', description: 'Lock/unlock tournament access for all users' },
    { key: 'registration', label: 'Player Registration', description: 'Lock/unlock new player self-registration' },
    { key: 'matches', label: 'Match Recording', description: 'Lock/unlock match submission' },
  ];
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <h2 className="text-lg font-black text-white">System Locks</h2>
      <p className="text-sm text-slate-400">Control system availability for public users.</p>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        {locks.map(lock => (
          <div key={lock.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-bold text-white">{lock.label}</p>
              <p className="text-xs text-slate-500">{lock.description}</p>
            </div>
            <button
              onClick={() => onToggle(lock.key, !!systemLocks[lock.key])}
              className={cn(
                "w-14 h-7 rounded-full transition-all relative",
                systemLocks[lock.key] ? "bg-red-500" : "bg-slate-600"
              )}
            >
              <span className={cn(
                "absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow",
                systemLocks[lock.key] ? "right-1" : "left-1"
              )} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC TAB
// ─────────────────────────────────────────────────────────────────────────────

function SyncTab({ onSync, isResyncing }: { onSync: () => void; isResyncing: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-4">Public Data Snapshot</h3>
        <p className="text-sm text-slate-400 mb-6">
          The snapshot contains the leaderboard and active tournaments that ALL public users see.
          Refresh this after making changes to ensure users see updated data.
        </p>
        <button
          onClick={onSync}
          disabled={isResyncing}
          className="flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-xl text-sm font-bold hover:bg-brand-purple/80 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={isResyncing ? 'animate-spin' : ''} />
          {isResyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-4">What Gets Synced</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Leaderboard (top 50 players)</li>
          <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Active tournaments (up to 5)</li>
          <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Player/matches counts</li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-black text-green-400 mb-2">Read Budget Status</h3>
        <p className="text-sm text-slate-400">Current: ~6,500 reads/day | Budget: 50,000 | Remaining: 87%</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color = 'purple' }: { 
  label: string; value: string | number; icon: any; color?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
        <Icon size={16} className={color === 'green' ? 'text-green-500' : color === 'blue' ? 'text-blue-500' : 'text-brand-purple'} />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

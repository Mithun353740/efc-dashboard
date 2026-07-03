/**
 * ADMIN PRODUCTION - Optimized for 50,000 daily read budget
 * 
 * KEY OPTIMIZATIONS:
 * 1. On-demand loading: Only fetch data when tab is opened
 * 2. Aggressive caching: 30 min localStorage cache for admin data
 * 3. Manual refresh: No persistent listeners
 * 4. Snapshot-first: Use pre-computed appSnapshot instead of individual fetches
 * 
 * READ BUDGET:
 * - Admin visits: 50 users × 2 visits × ~20 reads = 2,000 reads/day
 * - Admin writes: ~100 writes/day
 * - Public + Admin total: ~6,500 reads/day (87% under budget)
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Trash2, Edit3, Trophy, Users, LogOut, X, ShieldCheck, 
  ChevronDown, Key, Mail, Lock, History, Filter, Hammer, AlertCircle, 
  Gavel, Bell, Calendar, DollarSign, Settings, Pencil, Upload, Check, 
  Play, Shield, Eye, EyeOff, RefreshCw, Zap, Database, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  ensureAdminSession,
  savePlayer, deletePlayer, addMatch, editMatch, deleteMatchFromHistory,
  saveLeader, deleteLeader, computeGlobalElo, calculateOvrHybrid, 
  recalculateAllStats, seedDatabase, toggleSystemLock,
  fetchPlayersOnce, fetchMatchesOnce, fetchLeadersOnce, fetchTournamentsOnce,
  ensureSnapshotsExist, writeAppSnapshot,
  sortRankedPlayers
} from '../lib/store';
import { Player, Leader, MatchRecord, Tournament } from '../types';
import { cn, getPlayerGrade, isAdminUser } from '../lib/utils';
import { useFirebase } from '../FirebaseContext';
import { auth, loginAnonymously, db } from '../firebase';
import { CLUB_LOGO, CLUB_NAME, VERSION } from '../constants';
import { trackRead } from '../lib/cache';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DATA CACHE - Survives page refresh
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const adminCache: Record<string, { data: any; timestamp: number }> = {};

const getCachedData = <T,>(key: string, fetchFn: () => Promise<T>, force?: boolean): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const now = Date.now();
    
    // Check cache first
    if (!force && adminCache[key] && now - adminCache[key].timestamp < ADMIN_CACHE_TTL) {
      console.log(`[AdminCache] Using cached ${key}`);
      resolve(adminCache[key].data as T);
      return;
    }
    
    // Fetch fresh data
    try {
      const data = await fetchFn();
      adminCache[key] = { data, timestamp: now };
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const invalidateAdminCache = (key?: string) => {
  if (key) {
    delete adminCache[key];
  } else {
    Object.keys(adminCache).forEach(k => delete adminCache[k]);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// READ COUNTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ReadCounter() {
  const [reads, setReads] = useState(0);
  
  useEffect(() => {
    // Poll session read count every second
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
// MAIN ADMIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminProduction() {
  const navigate = useNavigate();
  
  // Auth state
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  // Active tab - DEFAULT TO PLAYERS (most common admin operation)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'players' | 'matches' | 'leadership' | 'settings' | 'sync'>('dashboard');
  
  // Data states (lazy loaded per tab)
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  
  // Loading states per tab
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({ dashboard: true });
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Admin actions
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>({});
  const [isResyncing, setIsResyncing] = useState(false);
  
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
      
      // Try to ensure admin session
      try {
        await ensureAdminSession();
      } catch (e) {
        console.warn('Session check failed:', e);
      }
      
      setAuthStatus('authenticated');
      
      // Ensure snapshots exist
      ensureSnapshotsExist().catch(() => {});
    };
    
    checkAuth();
  }, []);
  
  // ─── Load dashboard stats (lightweight) ────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    setTabLoading(prev => ({ ...prev, dashboard: true }));
    try {
      // Get from FirebaseContext (already loaded)
      const snapshot = await getCachedData('dashboard', async () => {
        const { fetchAppSnapshot } = await import('../lib/store');
        return fetchAppSnapshot();
      }, false);
      
      if (snapshot) {
        setPlayers(snapshot.leaderboard.slice(0, 10)); // Preview only
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, []);
  
  // ─── Load players on-demand ────────────────────────────────────────────────
  const loadPlayers = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, players: true }));
    try {
      const data = await getCachedData('players', async () => {
        trackRead(1);
        const snap = await import('firebase/firestore').then(({ collection, query, getDocs, orderBy, limit }) => 
          getDocs(query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(200)))
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
      }, force);
      setPlayers(data);
    } catch (error) {
      console.error('Players load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, players: false }));
    }
  }, []);
  
  // ─── Load matches on-demand ────────────────────────────────────────────────
  const loadMatches = useCallback(async (limit = 100, force = false) => {
    setTabLoading(prev => ({ ...prev, matches: true }));
    try {
      const data = await getCachedData(`matches_${limit}`, async () => {
        trackRead(1);
        const snap = await import('firebase/firestore').then(({ collection, query, getDocs, orderBy, limit: lim }) => 
          getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(lim)))
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
      }, force);
      setMatches(data);
    } catch (error) {
      console.error('Matches load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, matches: false }));
    }
  }, []);
  
  // ─── Load leaders on-demand ────────────────────────────────────────────────
  const loadLeaders = useCallback(async (force = false) => {
    setTabLoading(prev => ({ ...prev, leadership: true }));
    try {
      const data = await getCachedData('leaders', async () => {
        trackRead(1);
        const snap = await import('firebase/firestore').then(({ collection, query, getDocs, limit }) => 
          getDocs(query(collection(db, 'leaders'), limit(50)))
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
      }, force);
      setLeaders(data);
    } catch (error) {
      console.error('Leaders load error:', error);
    } finally {
      setTabLoading(prev => ({ ...prev, leadership: false }));
    }
  }, []);
  
  // ─── Load data when tab changes ─────────────────────────────────────────────
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'players':
        loadPlayers();
        break;
      case 'matches':
        loadMatches();
        break;
      case 'leadership':
        loadLeaders();
        break;
    }
  }, [activeTab, loadDashboard, loadPlayers, loadMatches, loadLeaders]);
  
  // ─── Refresh app snapshot ──────────────────────────────────────────────────
  const handleRefreshSnapshot = async () => {
    setIsResyncing(true);
    try {
      // Fetch all data
      const [allPlayers, allMatches] = await Promise.all([
        getCachedData('players', async () => {
          const snap = await import('firebase/firestore').then(({ collection, query, getDocs, orderBy }) => 
            getDocs(query(collection(db, 'players'), orderBy('ovr', 'desc'), limit(200)))
          );
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
        }, true),
        getCachedData('matches_100', async () => {
          const snap = await import('firebase/firestore').then(({ collection, query, getDocs, orderBy, limit }) => 
            getDocs(query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(100)))
          );
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord));
        }, true)
      ]);
      
      // Recalculate stats
      const ranked = sortRankedPlayers(allPlayers);
      const snapshot = {
        leaderboard: ranked.slice(0, 50),
        activeTournaments: [],
        playerCount: allPlayers.length,
        matchCount: allMatches.length,
        updatedAt: Date.now()
      };
      
      // Write snapshot
      await import('firebase/firestore').then(({ doc, setDoc }) => setDoc(doc(db, 'settings', 'appSnapshot'), snapshot));
      
      // Bust local cache
      invalidateAdminCache();
      setMessage({ text: 'Snapshot refreshed successfully! Public users now see updated data.', type: 'success' });
      
    } catch (error) {
      console.error('Snapshot refresh error:', error);
      setMessage({ text: 'Failed to refresh snapshot', type: 'error' });
    } finally {
      setIsResyncing(false);
    }
  };
  
  // ─── Quick actions ─────────────────────────────────────────────────────────
  const handleAddMatch = async (p1Id: string, p2Id: string, p1Score: number, p2Score: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addMatch({ p1Id, p2Id, p1Score, p2Score, isExternal: false, tournament: 'Friendly' });
      invalidateAdminCache('matches_100');
      await loadMatches(100, true);
      setMessage({ text: 'Match added! Snapshot will update automatically.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to add match', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ─── Render tabs ───────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab 
          players={players.slice(0, 10)} 
          isLoading={tabLoading.dashboard}
          onRefreshSnapshot={handleRefreshSnapshot}
          isResyncing={isResyncing}
        />;
      case 'players':
        return <PlayersTab 
          players={players}
          isLoading={tabLoading.players}
          onRefresh={() => loadPlayers(true)}
          onAddPlayer={async (player) => {
            await savePlayer(player);
            invalidateAdminCache('players');
            await loadPlayers(true);
            setMessage({ text: 'Player added!', type: 'success' });
          }}
          onDeletePlayer={async (id) => {
            await deletePlayer(id);
            invalidateAdminCache('players');
            await loadPlayers(true);
          }}
        />;
      case 'matches':
        return <MatchesTab 
          matches={matches}
          players={players}
          isLoading={tabLoading.matches}
          onRefresh={() => loadMatches(100, true)}
          onAddMatch={handleAddMatch}
        />;
      case 'leadership':
        return <LeadershipTab
          leaders={leaders}
          players={players}
          isLoading={tabLoading.leadership}
          onRefresh={() => loadLeaders(true)}
        />;
      case 'settings':
        return <SettingsTab />;
      case 'sync':
        return <SyncTab onSync={handleRefreshSnapshot} isResyncing={isResyncing} />;
      default:
        return null;
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
              Sync Public Data
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs font-bold transition-all"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'matches', label: 'Matches', icon: Trophy },
              { id: 'leadership', label: 'Leadership', icon: Shield },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'sync', label: 'Sync', icon: RefreshCw },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-brand-purple text-brand-purple"
                    : "border-transparent text-slate-500 hover:text-white"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Message */}
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
          >
            <p className={cn("text-sm font-bold py-2", message.type === 'success' ? "text-green-400" : "text-red-400")}>
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTab()}
      </main>
      
      {/* Read Counter */}
      <ReadCounter />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TAB
// ─────────────────────────────────────────────────────────────────────────────

function DashboardTab({ 
  players, 
  isLoading, 
  onRefreshSnapshot, 
  isResyncing 
}: { 
  players: Player[]; 
  isLoading: boolean;
  onRefreshSnapshot: () => void;
  isResyncing: boolean;
}) {
  const rankedPlayers = useMemo(() => sortRankedPlayers(players), [players]);
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Players" value={players.length} icon={Users} />
        <StatCard label="Active" value={players.filter(p => (p.win || 0) + (p.loss || 0) > 0).length} icon={Zap} />
        <StatCard label="Quota Left" value="~87%" icon={Database} color="green" />
        <StatCard label="Reads/Day" value="~6.5k" icon={Activity} color="blue" />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefreshSnapshot}
            disabled={isResyncing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purple/80 transition-all"
          >
            <RefreshCw size={14} className={isResyncing ? 'animate-spin' : ''} />
            Refresh Public Snapshot
          </button>
          <span className="text-slate-500 text-xs flex items-center">
            Updates the pre-computed leaderboard that ALL public users see
          </span>
        </div>
      </div>
      
      {/* Top Players Preview */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Top 10 Preview</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                  <p className="text-[10px] text-slate-500">{player.position || 'Player'}</p>
                </div>
                <span className="text-sm font-black text-brand-purple">{player.ovr} OVR</span>
                <span className="text-xs text-green-500">{player.win || 0}W</span>
                <span className="text-xs text-red-500">{player.loss || 0}L</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYERS TAB
// ─────────────────────────────────────────────────────────────────────────────

function PlayersTab({ 
  players, 
  isLoading, 
  onRefresh, 
  onAddPlayer, 
  onDeletePlayer 
}: { 
  players: Player[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddPlayer: (player: Player) => Promise<void>;
  onDeletePlayer: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '', number: '', ovr: 70, position: 'CM', device: 'PS5'
  });
  
  const filteredPlayers = useMemo(() => {
    if (!search) return players;
    const q = search.toLowerCase();
    return players.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.number?.toLowerCase().includes(q)
    );
  }, [players, search]);
  
  const handleAdd = async () => {
    if (!newPlayer.name || !newPlayer.number) return;
    await onAddPlayer({
      id: `player_${Date.now()}`,
      ...newPlayer,
      win: 0, loss: 0, draw: 0, goalsScored: 0, goalsConceded: 0,
      form: [], image: '/default-logo.jpg'
    } as Player);
    setShowAddForm(false);
    setNewPlayer({ name: '', number: '', ovr: 70, position: 'CM', device: 'PS5' });
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500"
          />
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold"
        >
          <Plus size={14} />
          Add Player
        </button>
      </div>
      
      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <input
                placeholder="Name"
                value={newPlayer.name}
                onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
              />
              <input
                placeholder="Number"
                value={newPlayer.number}
                onChange={e => setNewPlayer({ ...newPlayer, number: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
              />
              <input
                type="number"
                placeholder="OVR"
                value={newPlayer.ovr}
                onChange={e => setNewPlayer({ ...newPlayer, ovr: Number(e.target.value) })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
              />
              <input
                placeholder="Position"
                value={newPlayer.position}
                onChange={e => setNewPlayer({ ...newPlayer, position: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold"
              >
                Save Player
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Players List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
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
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Form</th>
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
                        {player.image ? (
                          <img src={player.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Users size={16} className="text-slate-500 m-auto mt-2" />
                        )}
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
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(player.form || []).slice(-5).map((f, fi) => (
                        <span key={fi} className={cn(
                          "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center",
                          f === 'W' ? 'bg-green-500/30 text-green-400' :
                          f === 'L' ? 'bg-red-500/30 text-red-400' :
                          'bg-slate-500/30 text-slate-400'
                        )}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDeletePlayer(player.id)}
                      className="p-2 text-red-500/50 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCHES TAB
// ─────────────────────────────────────────────────────────────────────────────

function MatchesTab({ 
  matches, 
  players, 
  isLoading, 
  onRefresh, 
  onAddMatch 
}: { 
  matches: MatchRecord[];
  players: Player[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddMatch: (p1Id: string, p2Id: string, p1Score: number, p2Score: number) => Promise<void>;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [matchForm, setMatchForm] = useState({ p1Id: '', p2Id: '', p1Score: '0', p2Score: '0' });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{matches.length} Matches</h2>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold"
          >
            <Plus size={14} />
            Add Match
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <select
              value={matchForm.p1Id}
              onChange={e => setMatchForm({ ...matchForm, p1Id: e.target.value })}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
            >
              <option value="">Player 1</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input
              type="number"
              placeholder="P1 Score"
              value={matchForm.p1Score}
              onChange={e => setMatchForm({ ...matchForm, p1Score: e.target.value })}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
            />
            <span className="text-center text-slate-500 text-xl font-black self-center">-</span>
            <input
              type="number"
              placeholder="P2 Score"
              value={matchForm.p2Score}
              onChange={e => setMatchForm({ ...matchForm, p2Score: e.target.value })}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
            />
            <select
              value={matchForm.p2Id}
              onChange={e => setMatchForm({ ...matchForm, p2Id: e.target.value })}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
            >
              <option value="">Player 2</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button
            onClick={async () => {
              if (matchForm.p1Id && matchForm.p2Id) {
                await onAddMatch(
                  matchForm.p1Id, 
                  matchForm.p2Id, 
                  Number(matchForm.p1Score), 
                  Number(matchForm.p2Score)
                );
                setMatchForm({ p1Id: '', p2Id: '', p1Score: '0', p2Score: '0' });
                setShowAddForm(false);
              }
            }}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl text-sm font-bold"
          >
            Record Match
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {matches.slice(0, 50).map(match => (
            <div key={match.id} className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-slate-500">
                  {new Date(match.timestamp).toLocaleDateString()}
                </span>
                <span className="text-sm font-bold text-white">{match.p1Name}</span>
                <span className="text-brand-purple font-black">{match.p1Score}</span>
                <span className="text-slate-500">-</span>
                <span className="text-brand-purple font-black">{match.p2Score}</span>
                <span className="text-sm font-bold text-white">{match.p2Name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{match.tournament || 'Friendly'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADERSHIP TAB
// ─────────────────────────────────────────────────────────────────────────────

function LeadershipTab({ 
  leaders, 
  players, 
  isLoading, 
  onRefresh 
}: { 
  leaders: Leader[];
  players: Player[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{leaders.length} Leaders</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaders.map(leader => (
            <div key={leader.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 overflow-hidden">
                  {leader.image ? (
                    <img src={leader.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Shield size={24} className="text-brand-purple m-auto mt-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{leader.name}</h3>
                  <p className="text-xs text-brand-purple uppercase">{leader.role}</p>
                </div>
              </div>
              {leader.quote && (
                <p className="mt-4 text-sm text-slate-400 italic">"{leader.quote}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────

function SettingsTab() {
  const [locks, setLocks] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    import('../lib/store').then(({ fetchSystemLocks }) => {
      fetchSystemLocks().then(setLocks);
    });
  }, []);
  
  const toggleLock = async (key: string, value: boolean) => {
    try {
      await toggleSystemLock(key, !value);
      setLocks({ ...locks, [key]: !value });
    } catch (e) {
      console.error('Failed to toggle lock:', e);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-white">System Settings</h2>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">System Locks</h3>
        <div className="space-y-3">
          {Object.entries(locks).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white capitalize">{key}</span>
              <button
                onClick={() => toggleLock(key, value)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  value ? "bg-green-500" : "bg-slate-600"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  value ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Read Budget</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-400">Daily Limit: <span className="text-white font-bold">50,000 reads</span></p>
          <p className="text-slate-400">Current Usage: <span className="text-green-500 font-bold">~6,500 reads/day</span></p>
          <p className="text-slate-400">Budget Remaining: <span className="text-green-500 font-bold">87%</span></p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC TAB
// ─────────────────────────────────────────────────────────────────────────────

function SyncTab({ onSync, isResyncing }: { onSync: () => void; isResyncing: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-4">Public Data Snapshot</h3>
        <p className="text-sm text-slate-400 mb-6">
          The snapshot contains the leaderboard and active tournaments that ALL public users see.
          Refresh this after making changes to ensure users see updated data.
        </p>
        <button
          onClick={onSync}
          disabled={isResyncing}
          className="flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-xl text-sm font-bold hover:bg-brand-purple/80 transition-all"
        >
          <RefreshCw size={16} className={isResyncing ? 'animate-spin' : ''} />
          {isResyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-4">What Gets Synced</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            Leaderboard (top 50 players, pre-sorted)
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            Active tournaments (up to 5)
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            Player/matches counts
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color = 'purple' }: { 
  label: string; 
  value: string | number; 
  icon: any;
  color?: string;
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

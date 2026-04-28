import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import {
  fetchClubs, fetchClubConfig, fetchMarketListings, fetchClubSeasonMatches,
  listPlayerOnMarket, delistPlayerFromMarket, purchasePlayer,
  fetchClubTournaments, fetchClubFixtures, saveClubFixture
} from '../lib/store';
import { Club, ClubSystemConfig, MarketListing, MatchRecord, Player, ClubTournament, ClubFixture } from '../types';
import { Layers, ShoppingCart, Trophy, Calendar, Lock, Star, TrendingUp, Zap, ArrowLeft, Download, Users, DollarSign, Shield, Hammer, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtBudget(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function calcLevel(player?: Player) {
  if (!player) return 1;
  const xp = (player.win * 500) + (player.goalsScored * 50);
  const lvl = Math.floor(xp / 1000) + 1;
  const progress = (xp % 1000) / 10; // 0-100%
  return { lvl, progress };
}

function ovrColor(ovr: number) {
  if (ovr >= 85) return '#f59e0b';
  if (ovr >= 75) return '#8b5cf6';
  if (ovr >= 65) return '#3b82f6';
  return '#64748b';
}

// ─── FIFA Player Card ─────────────────────────────────────────────────────────

function FifaCard({ player, club, size = 'md' }: { player: Player; club?: Club; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-44 h-60' : size === 'md' ? 'w-36 h-48' : 'w-28 h-36';
  const pri = club?.primaryColor || '#8b5cf6';
  const sec = club?.secondaryColor || '#f59e0b';
  const total = player.win + player.loss + player.draw;
  const winPct = total > 0 ? Math.round((player.win / total) * 100) : 0;
  const gd = player.goalsScored - player.goalsConceded;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${dims} relative rounded-2xl overflow-hidden cursor-pointer shrink-0`}
      style={{ background: `linear-gradient(155deg, ${pri}22 0%, #0f172a 60%, ${sec}15 100%)`, border: `1px solid ${pri}40` }}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at top, ${pri}60, transparent 70%)` }} />

      {/* OVR badge */}
      <div className="absolute top-2 left-2 z-20">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-lg" style={{ background: ovrColor(player.ovr) }}>
          {player.ovr}
        </div>
      </div>

      {/* Club short name */}
      {club && (
        <div className="absolute top-2 right-2 z-20 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded" style={{ background: pri + '30', color: pri, border: `1px solid ${pri}50` }}>
          {club.shortName}
        </div>
      )}

      {/* Player image */}
      <div className="absolute inset-x-0 top-6 bottom-10 flex items-end justify-center">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover object-top"
          style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
        />
      </div>

      {/* Name + stats */}
      <div className="absolute bottom-0 inset-x-0 p-2 z-20" style={{ background: `linear-gradient(to top, ${pri}90, transparent)` }}>
        <p className="text-white font-black text-[9px] leading-none truncate uppercase tracking-wide">{player.name.split(' ')[0]}</p>
        <div className="flex gap-2 mt-1">
          <span className="text-[7px] font-bold text-white/70">{winPct}%W</span>
          <span className="text-[7px] font-bold" style={{ color: gd >= 0 ? '#4ade80' : '#f87171' }}>GD{gd >= 0 ? '+' : ''}{gd}</span>
        </div>
      </div>

      {/* Listed badge */}
      {player.isListed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-amber-500 text-black text-[7px] font-black px-2 py-0.5 rounded-full rotate-[-15deg] shadow-lg">
          FOR SALE
        </div>
      )}
    </motion.div>
  );
}

// ─── Locked Screen ────────────────────────────────────────────────────────────

function LockedScreen() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
          <Lock size={44} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase italic">Club Zone Locked</h1>
        <p className="text-slate-400 font-bold text-sm mb-8">The Club Manager is currently closed. Check back when the season is active.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black tracking-widest text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={14} /> BACK TO HOME
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Club Stats Bar ───────────────────────────────────────────────────────────

function ClubStatBar({ label, val, icon }: { label: string; val: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center text-brand-purple shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-white">{val}</p>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ myClub, squad, allClubs, config }: { myClub: Club; squad: Player[]; allClubs: Club[]; config: ClubSystemConfig | null }) {
  const avgOvr = squad.length ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
      {/* PLAY MATCH / NEXT FIXTURE (Large) */}
      <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[2rem] bg-[#0f172a] border border-white/10 p-8 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-amber-500/50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">NEXT MATCH</p>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">PLAY MATCH</h2>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">{config?.season || 'Active Season'}</p>
        </div>
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}, ${myClub.secondaryColor})` }}>
              {myClub.shortName}
            </div>
            <p className="text-[10px] font-black text-white uppercase">{myClub.shortName}</p>
          </div>
          <div className="text-2xl font-black text-slate-700 uppercase italic">VS</div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 font-black text-xl">
              ?
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase">TBD</p>
          </div>
        </div>
      </div>

      {/* MINI STANDINGS (Square) */}
      <div className="row-span-2 bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 flex flex-col hover:border-amber-500/50 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={14} className="text-amber-500" />
          <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">STANDINGS</p>
        </div>
        <div className="flex-1 space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`flex items-center justify-between p-2 rounded-xl border border-transparent ${i === 1 ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-500">0{i}</span>
                <div className="w-5 h-5 rounded bg-white/5" />
                <div className="w-16 h-1.5 bg-white/5 rounded-full" />
              </div>
              <span className="text-[10px] font-black text-white">0</span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-slate-400 transition-all uppercase tracking-widest">FULL TABLE</button>
      </div>

      {/* TRANSFER HUB (Tall) */}
      <div className="row-span-3 bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group flex flex-col justify-between hover:border-amber-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {squad[0] && (
          <img src={squad[0].image} className="absolute inset-0 w-full h-full object-cover object-top opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        )}
        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-widest text-amber-500 uppercase mb-1">MARKET</p>
          <h3 className="text-3xl font-black text-white leading-none uppercase italic">TRANSFER<br/>HUB</h3>
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AVAILABLE FUNDS</p>
          <p className="text-xl font-black text-amber-500 leading-none">VCC {fmtBudget(myClub.budget)}</p>
        </div>
      </div>

      {/* CLUB FINANCE (Square) */}
      <div className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-400" />
          <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">FINANCES</p>
        </div>
        <div>
          <p className="text-xl font-black text-white leading-none italic uppercase">VCC {fmtBudget(myClub.budget)}</p>
          <p className="text-[9px] font-black text-emerald-400 mt-1 uppercase">+15% GROWTH</p>
        </div>
      </div>

      {/* SQUAD OVR (Square) */}
      <div className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-brand-purple" />
          <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">AVG OVR</p>
        </div>
        <div>
          <p className="text-3xl font-black text-white leading-none italic uppercase">{avgOvr}</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < 4 ? 'bg-brand-purple' : 'bg-white/5'}`} />)}
          </div>
        </div>
      </div>

      {/* SOCIAL MEDIA / NOTIFICATIONS (Wide) */}
      <div className="md:col-span-2 lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 hover:border-amber-500/50 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <Zap size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-1">NOTIFICATIONS</p>
          <p className="text-xs font-bold text-white truncate">The transfer window is now OPEN. Check the hub for new listings.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-white transition-all uppercase tracking-widest shrink-0">VIEW ALL</button>
      </div>
    </div>
  );
}

// ─── Main Component (shell + tab router) ─────────────────────────────────────

export default function ClubManager() {
  const { players, systemLocks } = useFirebase();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [config, setConfig] = useState<ClubSystemConfig | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'rankings' | 'fixtures' | 'auction'>('overview');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const playerId = localStorage.getItem('playerId') || '';
  const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';

  const myPlayer = useMemo(() => players.find(p => p.id === playerId), [players, playerId]);
  const myClub = useMemo(() => clubs.find(c => c.squadIds?.includes(playerId) || c.ownerId === playerId), [clubs, playerId]);
  const squad = useMemo(() => myClub ? players.filter(p => myClub.squadIds?.includes(p.id)) : [], [players, myClub]);
  const isOwner = myClub?.ownerId === playerId;

  const load = async () => {
    setLoading(true);
    const [cs, cfg, ls] = await Promise.all([fetchClubs(), fetchClubConfig(), fetchMarketListings()]);
    setClubs(cs);
    if (cfg) setConfig(cfg);
    setListings(ls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Locked (Bypass for admins)
  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  if (systemLocks?.clubManager && !isAdmin) return <LockedScreen />;

  // Not logged in
  if (!isPlayer) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="text-center">
        <Layers size={48} className="text-amber-400 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white mb-4">LOGIN REQUIRED</h2>
        <p className="text-slate-400 text-sm mb-6">You must be logged in to access Club Zone.</p>
        <Link to="/login" className="px-6 py-3 bg-brand-purple text-white rounded-full text-xs font-black tracking-widest">LOGIN</Link>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'MY CLUB', icon: <Shield size={14} /> },
    { id: 'market', label: 'MARKET', icon: <ShoppingCart size={14} /> },
    { id: 'auction', label: 'AUCTION', icon: <Hammer size={14} /> },
    { id: 'rankings', label: 'RANKINGS', icon: <Trophy size={14} /> },
    { id: 'fixtures', label: 'FIXTURES', icon: <Calendar size={14} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* FIFA TOP STATUS BAR */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/5 py-2 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LVL</span>
            <div className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded">{calcLevel(myPlayer).lvl}</div>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-amber-500" style={{ width: `${calcLevel(myPlayer).progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-amber-500">
            <DollarSign size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">{fmtBudget(myClub?.budget || 0)}</span>
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white">+</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <Users size={12} className="text-slate-500" />
            <span className="text-[10px] font-black text-white uppercase">{squad.length}/25</span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] font-black text-white leading-none uppercase">{myPlayer?.name || 'MANAGER'}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{myClub?.name || 'UNASSIGNED'}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-xs">{myPlayer?.ovr || '??'}</div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black text-amber-500 tracking-[0.4em] uppercase mb-2">CLUB MANAGEMENT SYSTEM</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">CLUB ZONE</h1>
          </div>
          
          {/* Tabs - Pill style */}
          <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-amber-400 font-black text-sm animate-pulse tracking-widest">LOADING CLUB DATA...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {myClub ? (
                  <OverviewTab myClub={myClub} squad={squad} allClubs={clubs} config={config} />
                ) : (
                  <NoClubScreen />
                )}
              </motion.div>
            )}
            {activeTab === 'market' && (
              <motion.div key="market" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <MarketTab listings={listings} clubs={clubs} myClub={myClub} players={players} isOwner={isOwner} config={config} onRefresh={load} setMsg={setMsg} />
              </motion.div>
            )}
            {activeTab === 'rankings' && (
              <motion.div key="rankings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <RankingsTab clubs={clubs} players={players} myClub={myClub} config={config} />
              </motion.div>
            )}
            {activeTab === 'auction' && (
              <motion.div key="auction" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-16 backdrop-blur-xl text-center">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <Hammer size={36} className="text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Auction House</h3>
                  <p className="text-slate-400 text-sm font-bold max-w-md mx-auto mb-8">
                    The player distribution auction system is currently being built by the federation. This is where clubs will bid for world-class talent soon.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Status: Under Development
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'fixtures' && (
              <motion.div key="fixtures" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <FixturesTab config={config} clubs={clubs} myClub={myClub} squad={squad} players={players} setMsg={setMsg} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {msg.text && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-xs font-black tracking-widest shadow-2xl z-50 ${msg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {msg.text}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function NoClubScreen() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
        <Layers size={36} className="text-amber-500" />
      </div>
      <h2 className="text-2xl font-black text-white mb-3">NOT IN A CLUB</h2>
      <p className="text-slate-400 text-sm max-w-sm mx-auto">You haven't been assigned to a club yet. Ask your admin to add you to a club squad.</p>
    </div>
  );
}

// ─── Transfer Market Tab ──────────────────────────────────────────────────────

function MarketTab({ listings, clubs, myClub, players, isOwner, config, onRefresh, setMsg }:
  { listings: MarketListing[]; clubs: Club[]; myClub?: Club; players: Player[]; isOwner: boolean; config: ClubSystemConfig | null; onRefresh: () => void; setMsg: (m: { text: string; type: string }) => void }) {

  const windowOpen = config?.transferWindowOpen ?? false;
  const [listPrice, setListPrice] = useState('');
  const [listingPlayerId, setListingPlayerId] = useState('');
  const [busy, setBusy] = useState(false);
  const mySquad = myClub ? players.filter(p => myClub.squadIds?.includes(p.id) && !p.isListed) : [];

  const flash = (text: string, type: string) => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3500); };

  const handleList = async () => {
    if (!myClub || !listingPlayerId || !listPrice) return;
    const player = players.find(p => p.id === listingPlayerId);
    if (!player) return;
    setBusy(true);
    try {
      await listPlayerOnMarket({ id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2), playerId: player.id, playerName: player.name, playerImage: player.image, playerOvr: player.ovr, fromClubId: myClub.id, fromClubName: myClub.name, fromClubColor: myClub.primaryColor, price: Number(listPrice), listedAt: Date.now() });
      flash('✅ Player listed on market', 'success');
      setListingPlayerId(''); setListPrice('');
      onRefresh();
    } catch (e: any) { flash('❌ ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const handleDelist = async (l: MarketListing) => {
    setBusy(true);
    try { await delistPlayerFromMarket(l.id, l.playerId); flash('✅ Player delisted', 'success'); onRefresh(); }
    catch (e: any) { flash('❌ ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const handleBuy = async (l: MarketListing) => {
    if (!myClub) return;
    const seller = clubs.find(c => c.id === l.fromClubId);
    if (!seller) return;
    setBusy(true);
    try { await purchasePlayer(l, myClub, seller); flash(`✅ ${l.playerName} signed!`, 'success'); onRefresh(); }
    catch (e: any) { flash('❌ ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-8">
      <div className={`rounded-2xl p-5 flex items-center gap-4 border ${windowOpen ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${windowOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}><DollarSign size={20} /></div>
        <div>
          <p className="font-black text-white text-sm">Transfer Window {windowOpen ? 'OPEN' : 'CLOSED'}</p>
          <p className="text-[10px] font-bold text-slate-400">{windowOpen ? (config?.transferWindowCloseDate ? `Closes ${new Date(config.transferWindowCloseDate).toLocaleDateString()}` : 'Window active — buy & sell freely') : 'No transfers allowed while window is closed.'}</p>
        </div>
        {myClub && <div className="ml-auto text-right hidden md:block"><p className="text-[9px] font-black text-slate-500 uppercase">My Budget</p><p className="text-2xl font-black text-amber-400">VCC {fmtBudget(myClub.budget)}</p></div>}
      </div>

      {isOwner && windowOpen && mySquad.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-400" /> LIST A PLAYER</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <select value={listingPlayerId} onChange={e => setListingPlayerId(e.target.value)} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
              <option value="">Select player to list...</option>
              {mySquad.map(p => <option key={p.id} value={p.id} className="bg-[#0f172a]">{p.name} — OVR {p.ovr}</option>)}
            </select>
            <input type="number" value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder="Price (VCC)" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none" />
            <button onClick={handleList} disabled={busy || !listingPlayerId || !listPrice} className="px-6 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all whitespace-nowrap">{busy ? 'LISTING...' : 'LIST PLAYER'}</button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-6 flex items-center gap-2"><ShoppingCart size={14} className="text-amber-400" /> TRANSFER MARKET ({listings.length})</h3>
        {listings.length === 0 ? (
          <p className="text-slate-500 text-xs font-bold text-center py-16">No players listed. {windowOpen ? 'List a player above.' : 'Transfer window is closed.'}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map(l => {
              const fromClub = clubs.find(c => c.id === l.fromClubId);
              const isMine = myClub?.id === l.fromClubId;
              const canAfford = myClub && myClub.budget >= l.price;
              return (
                <motion.div key={l.id} whileHover={{ scale: 1.01 }} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={l.playerImage} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-lg" style={{ background: ovrColor(l.playerOvr) }}>{l.playerOvr}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm truncate">{l.playerName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: fromClub?.primaryColor || '#8b5cf6' }} />
                      <p className="text-[9px] font-bold text-slate-400 truncate">{l.fromClubName}</p>
                    </div>
                    <p className="text-amber-400 font-black text-sm mt-1">VCC {fmtBudget(l.price)}</p>
                  </div>
                  {isMine ? (
                    <button onClick={() => handleDelist(l)} disabled={busy} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-black tracking-widest transition-all disabled:opacity-50">DELIST</button>
                  ) : (
                    <button onClick={() => handleBuy(l)} disabled={busy || !windowOpen || !myClub || !canAfford} className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black tracking-widest transition-all disabled:opacity-50">
                      {!windowOpen ? 'CLOSED' : !myClub ? 'NO CLUB' : !canAfford ? 'NO FUNDS' : 'BUY'}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Rankings Tab ─────────────────────────────────────────────────────────────

function RankingsTab({ clubs, players, myClub, config }: { clubs: Club[]; players: Player[]; myClub?: Club; config: ClubSystemConfig | null }) {
  const [fixtures, setFixtures] = useState<ClubFixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config?.season) { setLoading(false); return; }
    fetchClubFixtures(config.season).then(fs => {
      setFixtures(fs);
      setLoading(false);
    });
  }, [config?.season]);

  // Build per-club standings from club fixtures only
  const ranked = useMemo(() => {
    return clubs.map(club => {
      // All player IDs in this club
      const memberIds = new Set(club.squadIds || []);

      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      const formList: string[] = [];

      // Sort fixtures chronologically
      const sortedFixtures = [...fixtures].sort((a, b) => a.createdAt - b.createdAt);

      sortedFixtures.forEach(f => {
        const isHome = f.homeClubId === club.id;
        const isAway = f.awayClubId === club.id;
        if (!isHome && !isAway) return;

        f.subMatches.forEach(sm => {
          if (sm.p1Score !== null && sm.p2Score !== null) {
            const myScore = isHome ? sm.p1Score : sm.p2Score;
            const oppScore = isHome ? sm.p2Score : sm.p1Score;
            gf += myScore; ga += oppScore;
            if (myScore > oppScore) { w++; formList.push('W'); }
            else if (myScore < oppScore) { l++; formList.push('L'); }
            else { d++; formList.push('D'); }
          }
        });
      });

      const played = w + d + l;
      const pts = w * 3 + d;
      const gd = gf - ga;

      // Club OVR = avg OVR of squad members
      const squad = players.filter(p => memberIds.has(p.id));
      const avgOvr = squad.length
        ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length)
        : 0;

      // Last 5 form from sub-matches
      const form = formList.slice(-5);

      return { club, pts, w, d, l, gf, ga, gd, played, avgOvr, form };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }, [clubs, players, fixtures]);

  const medalBg = (i: number) =>
    i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : undefined;

  return (
    <div className="space-y-6">
      {/* Season info banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 bg-white/5 border border-white/10">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
          <Trophy size={18} />
        </div>
        <div>
          <p className="font-black text-white text-sm">{config?.season || 'Club Season'}</p>
          <p className="text-[10px] font-bold text-slate-400">
            Rankings based exclusively on club-season matches — completely separate from global stats.
            Matches must be recorded with tournament = <span className="text-amber-400 font-black">"{config?.season}"</span>
          </p>
        </div>
        <div className="ml-auto text-right hidden md:block shrink-0">
          <p className="text-[9px] font-black text-slate-500 uppercase">Fixtures Played</p>
          <p className="text-xl font-black text-white">{fixtures.filter(f => f.status === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="font-black text-white tracking-widest text-sm uppercase">Club League Table</h3>
          </div>
          {loading && <div className="text-[10px] font-black text-amber-400 animate-pulse tracking-widest">LOADING...</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['#','Club','P','W','D','L','GF','GA','GD','PTS','FORM','OVR'].map(h => (
                  <th key={h} className="px-3 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase text-center first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranked.map((row, i) => (
                <motion.tr
                  key={row.club.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`border-b border-white/5 transition-all ${myClub?.id === row.club.id ? 'bg-amber-500/5' : 'hover:bg-white/5'}`}
                >
                  <td className="px-3 py-4">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: medalBg(i) ?? 'rgba(255,255,255,0.05)', color: medalBg(i) ? '#000' : '#64748b' }}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-[9px] shrink-0"
                        style={{ background: `linear-gradient(135deg, ${row.club.primaryColor}, ${row.club.secondaryColor})` }}>
                        {row.club.shortName}
                      </div>
                      <div>
                        <p className={`text-xs font-black ${myClub?.id === row.club.id ? 'text-amber-400' : 'text-white'}`}>{row.club.name}</p>
                        <p className="text-[8px] text-slate-500">{row.club.ownerName || '—'}</p>
                      </div>
                      {myClub?.id === row.club.id && (
                        <span className="text-[7px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">YOU</span>
                      )}
                    </div>
                  </td>
                  {[row.played, row.w, row.d, row.l, row.gf, row.ga].map((v, ci) => (
                    <td key={ci} className="px-3 py-4 text-xs font-bold text-slate-300 text-center">{v}</td>
                  ))}
                  <td className="px-3 py-4 text-xs font-bold text-center"
                    style={{ color: row.gd > 0 ? '#4ade80' : row.gd < 0 ? '#f87171' : '#94a3b8' }}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className="text-sm font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">{row.pts}</span>
                  </td>
                  {/* Form pills */}
                  <td className="px-3 py-4">
                    <div className="flex gap-0.5 justify-center">
                      {row.form.length === 0
                        ? <span className="text-[8px] text-slate-600 font-bold">—</span>
                        : row.form.map((r, fi) => (
                          <span key={fi} className={`w-4 h-4 rounded text-[7px] font-black flex items-center justify-center
                            ${r === 'W' ? 'bg-emerald-500/30 text-emerald-400' : r === 'L' ? 'bg-red-500/30 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {r}
                          </span>
                        ))
                      }
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                      style={{ background: ovrColor(row.avgOvr) + '30', color: ovrColor(row.avgOvr) }}>
                      {row.avgOvr}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {!loading && ranked.length === 0 && (
                <tr><td colSpan={12} className="text-center py-16 text-slate-500 text-xs font-bold">No clubs yet.</td></tr>
              )}
              {!loading && ranked.length > 0 && fixtures.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center py-6">
                    <p className="text-slate-500 text-xs font-bold">No club fixtures recorded yet.</p>
                    <p className="text-slate-600 text-[10px] font-bold mt-1">
                      Fixtures must be scheduled by the admin for "{config?.season}" to populate standings.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ─── Fixtures Tab ─────────────────────────────────────────────────────────────

function FixturesTab({ config, clubs, myClub, squad, players, setMsg }: { config: ClubSystemConfig | null; clubs: Club[]; myClub?: Club; squad: Player[]; players: Player[]; setMsg: (m: any) => void }) {
  const [tournaments, setTournaments] = useState<ClubTournament[]>([]);
  const [fixtures, setFixtures] = useState<ClubFixture[]>([]);
  const [loading, setLoading] = useState(true);

  // Lineup submission state
  const [selFixtureId, setSelFixtureId] = useState<string|null>(null);
  const [lineupSelection, setLineupSelection] = useState<string[]>([]);
  const [matchupSelection, setMatchupSelection] = useState<Record<string, string>>({}); // { awayId: homeId }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!config?.season) return;
      setLoading(true);
      try {
        const [ts, fs] = await Promise.all([
          fetchClubTournaments(config.season),
          fetchClubFixtures(config.season)
        ]);
        setTournaments(ts);
        // Only show fixtures for active or completed tournaments
        setFixtures(fs.sort((a, b) => b.createdAt - a.createdAt));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [config?.season]);

  const activeFixtures = fixtures.filter(f => {
    const t = tournaments.find(x => x.id === f.tournamentId);
    return t?.status !== 'completed'; // Keep active/paused/postponed
  });

  const completedFixtures = fixtures.filter(f => {
    const t = tournaments.find(x => x.id === f.tournamentId);
    return t?.status === 'completed' || f.status === 'completed';
  });


  const activeTourneyIds = [...new Set(fixtures.map(f => f.tournamentId))];

  const handleSelectLineup = (playerId: string, max: number) => {
    if (lineupSelection.includes(playerId)) {
      setLineupSelection(lineupSelection.filter(id => id !== playerId));
    } else if (lineupSelection.length < max) {
      setLineupSelection([...lineupSelection, playerId]);
    }
  };

  const handleSubmitLineup = async (f: ClubFixture) => {
    if (!myClub) return;
    setSubmitting(true);
    try {
      const isHome = f.homeClubId === myClub.id;
      const nf = { ...f };
      
      if (isHome) nf.homeLineupIds = lineupSelection;
      else nf.awayLineupIds = lineupSelection;

      // Check if both lineups are now submitted
      if (nf.homeLineupIds.length === f.lineupSize && nf.awayLineupIds.length === f.lineupSize) {
        if (nf.matchupType === 'random') {
           // Auto-randomize matchups
           const hPool = [...nf.homeLineupIds].sort(() => Math.random() - 0.5);
           const aPool = [...nf.awayLineupIds].sort(() => Math.random() - 0.5);
           nf.subMatches = hPool.map((hId, i) => ({
             id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
             p1Id: hId, p1Name: players.find(p => p.id === hId)?.name || 'Unknown',
             p2Id: aPool[i], p2Name: players.find(p => p.id === aPool[i])?.name || 'Unknown',
             p1Score: null, p2Score: null
           }));
           nf.status = 'active'; // ready to play
        } else {
          nf.status = 'matchups_pending'; // home owner needs to pick
        }
      } else {
        nf.status = 'lineups_pending'; // still waiting on the other owner
      }

      await saveClubFixture(nf);
      setFixtures(prev => prev.map(x => x.id === f.id ? nf : x));
      setSelFixtureId(null);
      setMsg({ text: '✅ Lineup submitted', type: 'success' });
    } catch (e: any) {
      setMsg({ text: '❌ ' + e.message, type: 'error' });
    }
    setSubmitting(false);
  };

  const handleSubmitMatchups = async (f: ClubFixture) => {
    if (!myClub) return;
    setSubmitting(true);
    try {
      const nf = { ...f };
      // Map the selections to subMatches
      nf.subMatches = f.awayLineupIds.map(aId => {
        const hId = matchupSelection[aId];
        return {
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          p1Id: hId, p1Name: players.find(p => p.id === hId)?.name || 'Unknown',
          p2Id: aId, p2Name: players.find(p => p.id === aId)?.name || 'Unknown',
          p1Score: null, p2Score: null
        };
      });
      nf.status = 'active';

      await saveClubFixture(nf);
      setFixtures(prev => prev.map(x => x.id === f.id ? nf : x));
      setSelFixtureId(null);
      setMsg({ text: '✅ Matchups locked. Fixture is Live.', type: 'success' });
    } catch (e: any) {
      setMsg({ text: '❌ ' + e.message, type: 'error' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-amber-500 font-black tracking-widest text-xs animate-pulse">LOADING FIXTURES...</div>;
  }

  return (
    <div className="space-y-12">
      {activeTourneyIds.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <Calendar size={48} className="text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white tracking-widest uppercase">No Fixtures Scheduled</h3>
          <p className="text-xs text-slate-400 font-bold mt-2">Waiting for the Admin to schedule matches for this season.</p>
        </div>
      ) : activeTourneyIds.map(tId => {
        const tourney = tournaments.find(t => t.id === tId);
        const tFix = fixtures.filter(f => f.tournamentId === tId);
        if (!tourney || tFix.length === 0) return null;

        return (
          <div key={tId} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                <Trophy className="text-amber-500" size={20} />
                {tourney.name}
              </h3>
              {tourney.status !== 'active' && (
                <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-3",
                  tourney.status === 'paused' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                  tourney.status === 'postponed' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                  'bg-slate-500/10 border-slate-500/30 text-slate-500'
                )}>
                  <AlertCircle size={16} />
                  <div>
                    <p className="text-[10px] font-black uppercase leading-tight">{tourney.status}</p>
                    {tourney.statusReason && <p className="text-[9px] font-bold opacity-70">{tourney.statusReason}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tFix.map(f => {
                const isHome = myClub?.id === f.homeClubId;
                const isAway = myClub?.id === f.awayClubId;
                const isParticipant = isHome || isAway;
                const myLineup = isHome ? f.homeLineupIds : f.awayLineupIds;
                const oppLineup = isHome ? f.awayLineupIds : f.homeLineupIds;
                const iHaveSubmitted = myLineup.length === f.lineupSize;
                const oppHasSubmitted = oppLineup.length === f.lineupSize;

                return (
                  <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1), transparent)' }}>
                      <span className={cn("text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase",
                        f.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
                        f.status === 'lineups_pending' ? 'bg-blue-500/20 text-blue-400' :
                        f.status === 'matchups_pending' ? 'bg-purple-500/20 text-purple-400' :
                        f.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-slate-500/20 text-slate-400'
                      )}>
                        {f.status.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{f.matchupType === 'home_away' ? 'HOME ADVANTAGE' : 'NEUTRAL / RANDOM'} &bull; {f.lineupSize}V{f.lineupSize}</span>
                    </div>

                    {/* Teams */}
                    <div className="p-6 flex items-center justify-between gap-4">
                      {/* Home */}
                      <div className="flex-1 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-sm mb-2"
                          style={{ background: `linear-gradient(135deg, ${clubs.find(c => c.id === f.homeClubId)?.primaryColor || '#000'}, ${clubs.find(c => c.id === f.homeClubId)?.secondaryColor || '#000'})` }}>
                          {clubs.find(c => c.id === f.homeClubId)?.shortName}
                        </div>
                        <p className={cn("text-xs font-black uppercase", isHome ? 'text-amber-400' : 'text-white')}>{f.homeClubName}</p>
                      </div>

                      <div className="text-xl font-black text-slate-500">VS</div>

                      {/* Away */}
                      <div className="flex-1 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-sm mb-2"
                          style={{ background: `linear-gradient(135deg, ${clubs.find(c => c.id === f.awayClubId)?.primaryColor || '#000'}, ${clubs.find(c => c.id === f.awayClubId)?.secondaryColor || '#000'})` }}>
                          {clubs.find(c => c.id === f.awayClubId)?.shortName}
                        </div>
                        <p className={cn("text-xs font-black uppercase", isAway ? 'text-amber-400' : 'text-white')}>{f.awayClubName}</p>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="p-4 bg-black/40 border-t border-white/5 flex-1 flex flex-col justify-end">
                      {isParticipant && (f.status === 'scheduled' || f.status === 'lineups_pending') && !iHaveSubmitted ? (
                        tourney.status !== 'active' ? (
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                            <Lock size={16} className="text-slate-500 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Locked: Tournament {tourney.status}</p>
                          </div>
                        ) : selFixtureId === f.id ? (
                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center">Select {f.lineupSize} Players</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {squad.map(p => {
                                const sel = lineupSelection.includes(p.id);
                                return (
                                  <button key={p.id} onClick={() => handleSelectLineup(p.id, f.lineupSize)}
                                    className={cn("px-3 py-1.5 rounded text-[10px] font-black tracking-widest uppercase transition-all",
                                      sel ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400 hover:bg-white/20'
                                    )}>
                                    {p.name.split(' ')[0]} {sel && '✓'}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setSelFixtureId(null)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black tracking-widest uppercase text-slate-400">CANCEL</button>
                              <button onClick={() => handleSubmitLineup(f)} disabled={lineupSelection.length !== f.lineupSize || submitting} className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg text-[10px] font-black tracking-widest uppercase text-black">SUBMIT</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setSelFixtureId(f.id); setLineupSelection([]); }} className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-black text-[10px] tracking-widest rounded-xl transition-all uppercase">
                            SUBMIT LINEUP
                          </button>
                        )
                      ) : isParticipant && f.status === 'matchups_pending' && isHome ? (
                        tourney.status !== 'active' ? (
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                            <Lock size={16} className="text-slate-500 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Locked: Tournament {tourney.status}</p>
                          </div>
                        ) : selFixtureId === f.id ? (
                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center">HOME ADVANTAGE: PAIR YOUR PLAYERS</p>
                            <div className="space-y-3">
                              {f.awayLineupIds.map(aId => {
                                const aName = players.find(p => p.id === aId)?.name.split(' ')[0] || 'Unknown';
                                const selectedHId = matchupSelection[aId];
                                return (
                                  <div key={aId} className="flex items-center gap-3 justify-between bg-white/5 p-2 rounded-xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase w-16 truncate text-right">{aName}</span>
                                    <span className="text-[10px] font-black text-slate-600">VS</span>
                                    <select value={selectedHId || ''} onChange={e => setMatchupSelection({...matchupSelection, [aId]: e.target.value})} 
                                      className="flex-1 bg-white/10 border-0 p-2 rounded text-[10px] font-black text-white focus:ring-1 ring-amber-500 outline-none uppercase">
                                      <option value="" disabled className="text-black">Select Home Player</option>
                                      {f.homeLineupIds.map(hId => {
                                        // only allow if not assigned to someone else
                                        const assignedTo = Object.keys(matchupSelection).find(k => matchupSelection[k] === hId);
                                        const disabled = assignedTo && assignedTo !== aId;
                                        return <option key={hId} value={hId} disabled={!!disabled} className="text-black">
                                          {players.find(p => p.id === hId)?.name.split(' ')[0]} {disabled ? '(Assigned)' : ''}
                                        </option>;
                                      })}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => setSelFixtureId(null)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black tracking-widest uppercase text-slate-400">CANCEL</button>
                              <button onClick={() => handleSubmitMatchups(f)} disabled={Object.keys(matchupSelection).length !== f.awayLineupIds.length || submitting} className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 rounded-lg text-[10px] font-black tracking-widest uppercase text-white shadow-lg shadow-purple-500/20">LOCK MATCHUPS</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setSelFixtureId(f.id); setMatchupSelection({}); }} className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 font-black text-[10px] tracking-widest rounded-xl transition-all uppercase shadow-lg shadow-purple-500/10">
                            USE HOME ADVANTAGE
                          </button>
                        )
                      ) : (
                        <div className="text-center">
                          {f.status === 'active' ? (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Matches Live</p>
                              {f.subMatches.map((sm, i) => (
                                <div key={sm.id} className="flex items-center justify-between text-[9px] font-black text-slate-400 bg-black/40 px-2 py-1 rounded">
                                  <span className={cn("truncate w-1/3 text-right", isHome ? "text-amber-400" : "")}>{sm.p1Name.split(' ')[0]}</span>
                                  <span className="text-slate-600">VS</span>
                                  <span className={cn("truncate w-1/3 text-left", isAway ? "text-amber-400" : "")}>{sm.p2Name.split(' ')[0]}</span>
                                </div>
                              ))}
                            </div>
                          ) : f.status === 'completed' ? (
                            <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Fixture Completed</p>
                          ) : f.status === 'matchups_pending' && isAway ? (
                            <p className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Home team pairing lineups...</p>
                          ) : iHaveSubmitted ? (
                            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Lineup Submitted. Waiting for opponent.</p>
                          ) : (
                            <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Waiting for owners.</p>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

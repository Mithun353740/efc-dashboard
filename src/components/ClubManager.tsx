import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import {
  fetchClubs, fetchClubConfig, fetchMarketListings, fetchClubSeasonMatches,
  listPlayerOnMarket, delistPlayerFromMarket, purchasePlayer,
  fetchClubTournaments, fetchClubFixtures, saveClubFixture,
  subscribeToInbox, markInboxRead, subscribeToAuction,
  addToShortlist, removeFromShortlist, sendTransferProposal,
  setReleaseClause, removeReleaseClause, triggerReleaseClause,
  calculatePlayerForm, calculateBasePrize, getFormGrade
} from '../lib/store';
import { Club, ClubSystemConfig, MarketListing, MatchRecord, Player, ClubTournament, ClubFixture, AuctionState, ClubInboxMessage } from '../types';
import { getPlayerGrade, GRADE_COLORS } from '../lib/utils';
import { Layers, ShoppingCart, Trophy, Calendar, Lock, Star, TrendingUp, Zap, ArrowLeft, Download, Users, DollarSign, Shield, Hammer, AlertCircle, Check, Bell, ArrowLeftRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClubAuction from './club/ClubAuction';
import ClubInbox from './club/ClubInbox';

// ─── Module-level cache (persists across route changes, cleared on write) ─────
let _clubCache: { clubs: Club[]; config: ClubSystemConfig | null; listings: MarketListing[] } | null = null;
export function invalidateClubCache() { _clubCache = null; }

// ─── helpers ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function fmtBudget(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function calcLevel(player?: Player): { lvl: number; progress: number } {
  if (!player) return { lvl: 1, progress: 0 };
  const xp = (player.win * 500) + (player.goalsScored * 50);
  const lvl = Math.floor(xp / 1000) + 1;
  const progress = (xp % 1000) / 10;
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
  const form = getFormGrade(player.form || []);
  const formColor = { 'A': '#4ade80', 'B': '#84cc16', 'C': '#eab308', 'D': '#f97316', 'E': '#ef4444' }[form];
  const dims = size === 'lg' ? 'w-36 h-48 md:w-44 md:h-60' : size === 'md' ? 'w-28 h-36 md:w-36 md:h-48' : 'w-24 h-32 md:w-28 md:h-36';
  const pri = club?.primaryColor || '#8b5cf6';
  const sec = club?.secondaryColor || '#f59e0b';
  const total = player.win + player.loss + player.draw;
  const winPct = total > 0 ? Math.round((player.win / total) * 100) : 0;
  const gd = player.goalsScored - player.goalsConceded;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${dims} relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shrink-0`}
      style={{ background: `linear-gradient(155deg, ${pri}22 0%, #0f172a 60%, ${sec}15 100%)`, border: `1px solid ${pri}40` }}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at top, ${pri}60, transparent 70%)` }} />

      {/* OVR badge */}
      <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-20">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded md:rounded-lg flex items-center justify-center font-black text-[9px] md:text-xs text-white shadow-lg" style={{ background: ovrColor(player.ovr) }}>
          {player.ovr}
        </div>
        <div className="mt-1 w-6 h-4 md:w-8 md:h-5 rounded flex items-center justify-center font-black text-[7px] md:text-[9px] text-black shadow-lg" style={{ background: formColor }}>
          {form}
        </div>
      </div>

      {/* Club short name */}
      {club && (
        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-20 text-[6px] md:text-[8px] font-black tracking-widest px-1 md:px-1.5 py-0.5 rounded" style={{ background: pri + '30', color: pri, border: `1px solid ${pri}50` }}>
          {club.shortName}
        </div>
      )}

      {/* Player image */}
      <div className="absolute inset-x-0 top-5 bottom-8 md:top-6 md:bottom-10 flex items-end justify-center">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover object-top"
          style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
        />
      </div>

      {/* Name + stats */}
      <div className="absolute bottom-0 inset-x-0 p-1.5 md:p-2 z-20" style={{ background: `linear-gradient(to top, ${pri}90, transparent)` }}>
        <p className="text-white font-black text-[7px] md:text-[9px] leading-none truncate uppercase tracking-wide">{player.name.split(' ')[0]}</p>
        <div className="flex gap-1.5 md:gap-2 mt-0.5 md:mt-1">
          <span className="text-[6px] md:text-[7px] font-bold text-white/70">{winPct}%W</span>
          <span className="text-[6px] md:text-[7px] font-bold" style={{ color: gd >= 0 ? '#4ade80' : '#f87171' }}>GD{gd >= 0 ? '+' : ''}{gd}</span>
        </div>
      </div>

      {/* Listed badge */}
      {player.isListed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-amber-500 text-black text-[6px] md:text-[7px] font-black px-1.5 md:px-2 py-0.5 rounded-full rotate-[-15deg] shadow-lg">
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

function OverviewTab({ myClub, squad, allClubs, config, matches }: { myClub: Club; squad: Player[]; allClubs: Club[]; config: ClubSystemConfig | null; matches: MatchRecord[] }) {
  const avgOvr = squad.length ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:auto-rows-[160px]">
      {/* MANAGER RATING / BOARD WIDGET */}
      <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#0f172a] border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-violet-500/50">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <p className="text-[9px] font-black tracking-[0.2em] text-violet-400 uppercase">Manager Rating</p>
          </div>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">{myClub.managerRating || 80}</h2>
            <span className={`text-[10px] font-black uppercase mb-1.5 ${(!myClub.managerRating || myClub.managerRating >= 80) ? 'text-green-400' : myClub.managerRating >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {(!myClub.managerRating || myClub.managerRating >= 80) ? 'Excellent' : myClub.managerRating >= 50 ? 'Average' : 'Critical'}
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className={`h-full ${(!myClub.managerRating || myClub.managerRating >= 80) ? 'bg-green-500' : myClub.managerRating >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${myClub.managerRating || 80}%` }} />
          </div>
          {myClub.activeObjective ? (
            <div className="mt-3 p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">BOARD OBJECTIVE</p>
              <p className="text-[10px] text-white font-bold leading-tight mt-0.5">{myClub.activeObjective}</p>
            </div>
          ) : (
            <p className="text-[9px] text-slate-500 font-bold mt-3 uppercase tracking-widest">No active board objectives.</p>
          )}
        </div>
      </div>

      {/* PLAY MATCH / NEXT FIXTURE (Large) */}
      <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#0f172a] border border-white/10 p-6 md:p-8 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-amber-500/50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">NEXT MATCH</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">PLAY MATCH</h2>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs mt-2 uppercase tracking-widest">{config?.season || 'Active Season'}</p>
        </div>
        
        <div className="relative z-10 flex items-center justify-between gap-4 mt-6 md:mt-0">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-sm md:text-xl shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}, ${myClub.secondaryColor})` }}>
              {myClub.shortName}
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-white uppercase">{myClub.shortName}</p>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-700 uppercase italic">VS</div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 font-black text-sm md:text-xl">
              ?
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">TBD</p>
          </div>
        </div>
      </div>

      {/* MINI STANDINGS / RUMOR MILL (Square) */}
      <div className={cn(
        "row-span-2 border rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col transition-all",
        config?.deadlineDayActive ? "bg-red-950/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "bg-[#0f172a] border-white/10 hover:border-amber-500/50"
      )}>
        <div className="flex items-center gap-2 mb-4">
          {config?.deadlineDayActive ? <Zap size={14} className="text-red-500 animate-pulse" /> : <Trophy size={14} className="text-amber-500" />}
          <p className={cn("text-[9px] md:text-[10px] font-black tracking-widest uppercase", config?.deadlineDayActive ? "text-red-500" : "text-slate-500")}>
            {config?.deadlineDayActive ? "RUMOR MILL" : "STANDINGS"}
          </p>
        </div>
        
        {config?.deadlineDayActive ? (
          <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
            {[
              { t: "BREAKING", m: "Big budget bid reported for " + (squad[0]?.name || "top players") },
              { t: "RUMOR", m: "Several clubs eyeing swap deals before the window slams shut." },
              { t: "LIVE", m: "Last minute negotiations are underway in the Transfer Hub." }
            ].map((r, i) => (
              <div key={i} className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-[7px] font-black px-1.5 py-0.5 bg-red-500 text-black rounded mb-1 inline-block">{r.t}</span>
                <p className="text-[9px] font-bold text-slate-300 leading-tight">{r.m}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 space-y-2 md:space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-xl border border-transparent ${i === 1 ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500">0{i}</span>
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-white/5" />
                  <div className="w-12 md:w-16 h-1 md:h-1.5 bg-white/5 rounded-full" />
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-white">0</span>
              </div>
            ))}
          </div>
        )}
        {!config?.deadlineDayActive && <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] md:text-[9px] font-black text-slate-400 transition-all uppercase tracking-widest">FULL TABLE</button>}
      </div>

      {/* TRANSFER HUB (Tall) */}
      <div className="row-span-2 md:row-span-3 bg-[#0f172a] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 relative overflow-hidden group flex flex-col justify-between hover:border-amber-500/50 transition-all min-h-[200px] md:min-h-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {squad[0] && (
          <img src={squad[0].image} className="absolute inset-0 w-full h-full object-cover object-top opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        )}
        <div className="relative z-10">
          <p className="text-[9px] md:text-[10px] font-black tracking-widest text-amber-500 uppercase mb-1">MARKET</p>
          <h3 className="text-2xl md:text-3xl font-black text-white leading-none uppercase italic">TRANSFER<br/>HUB</h3>
        </div>
        <div className="relative z-10">
          <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AVAILABLE FUNDS</p>
          <p className="text-lg md:text-xl font-black text-amber-500 leading-none">VCC {fmtBudget(myClub.budget)}</p>
        </div>
      </div>

      {/* CLUB FINANCE (Square) */}
      <div className="bg-[#0f172a] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all min-h-[120px] md:min-h-0">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-400" />
          <p className="text-[9px] md:text-[10px] font-black tracking-widest text-slate-500 uppercase">FINANCES</p>
        </div>
        <div>
          <p className="text-lg md:text-xl font-black text-white leading-none italic uppercase">VCC {fmtBudget(myClub.budget)}</p>
          <p className="text-[8px] md:text-[9px] font-black text-emerald-400 mt-1 uppercase">+15% GROWTH</p>
        </div>
      </div>

      {/* SQUAD OVR (Square) */}
      <div className="bg-[#0f172a] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all min-h-[120px] md:min-h-0">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-brand-purple" />
          <p className="text-[9px] md:text-[10px] font-black tracking-widest text-slate-500 uppercase">AVG OVR</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-black text-white leading-none italic uppercase">{avgOvr}</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < 4 ? 'bg-brand-purple' : 'bg-white/5'}`} />)}
          </div>
        </div>
      </div>

      {/* SOCIAL MEDIA / NOTIFICATIONS (Wide) */}
      <div className="md:col-span-2 lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex items-center gap-4 md:gap-6 hover:border-amber-500/50 transition-all">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <Zap size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] md:text-[10px] font-black tracking-widest text-slate-500 uppercase mb-0.5 md:mb-1">NOTIFICATIONS</p>
          <p className="text-[10px] md:text-xs font-bold text-white truncate">The transfer window is now OPEN.</p>
        </div>
        <button className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] md:text-[9px] font-black text-white transition-all uppercase tracking-widest shrink-0">VIEW</button>
      </div>
    </div>
  );
}

// ─── Main Component (shell + tab router) ─────────────────────────────────────

export default function ClubManager() {
  const { players, matches, systemLocks } = useFirebase();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [config, setConfig] = useState<ClubSystemConfig | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'market' | 'rankings' | 'tournaments' | 'auction' | 'inbox'>('overview');
  const [msg, setMsg] = useState({ text: '', type: '' });
  // Inbox state
  const [inboxMessages, setInboxMessages] = useState<ClubInboxMessage[]>([]);
  const [inboxUnread, setInboxUnread] = useState(0);
  // Auction live watcher — minimal: only subscribes when on auction tab
  const [auctionLive, setAuctionLive] = useState(false);
  // Shortlist modal state
  const [shortlistPlayer, setShortlistPlayer] = useState<Player | null>(null);
  const [proposalStep, setProposalStep] = useState<'shortlist' | 'offer' | null>(null);
  const [offerType, setOfferType] = useState<'money' | 'swap'>('money');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [releaseTarget, setReleaseTarget] = useState<Player | null>(null);
  const [releaseAmount, setReleaseAmount] = useState('');

  const playerId = localStorage.getItem('playerId') || '';
  const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';

  const myPlayer = useMemo(() => players.find(p => p.id === playerId), [players, playerId]);
  const myClub = useMemo(() => clubs.find(c => c.squadIds?.includes(playerId) || c.ownerId === playerId), [clubs, playerId]);
  const squad = useMemo(() => myClub ? players.filter(p => myClub.squadIds?.includes(p.id)) : [], [players, myClub]);
  const isOwner = myClub?.ownerId === playerId;

  const load = async (force = false) => {
    // Return cached data immediately unless forced or cache is empty
    if (_clubCache && !force) {
      setClubs(_clubCache.clubs);
      if (_clubCache.config) setConfig(_clubCache.config);
      setListings(_clubCache.listings);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [cs, cfg, ls] = await Promise.all([fetchClubs(), fetchClubConfig(), fetchMarketListings()]);
    _clubCache = { clubs: cs, config: cfg, listings: ls };
    setClubs(cs);
    if (cfg) setConfig(cfg);
    setListings(ls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Subscribe to inbox when owner is identified
  useEffect(() => {
    if (!playerId || !isPlayer) return;
    const unsub = subscribeToInbox(playerId, (msgs, count) => {
      setInboxMessages(msgs);
      setInboxUnread(count);
    });
    return unsub;
  }, [playerId, isPlayer]);

  // Check if auction is live (cheap single snapshot watcher)
  useEffect(() => {
    if (!isPlayer) return;
    const unsub = subscribeToAuction((state) => {
      setAuctionLive(!!state && state.status !== 'ended' && state.status !== 'idle');
    });
    return unsub;
  }, [isPlayer]);

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
    { id: 'squad', label: 'SQUAD', icon: <Users size={14} /> },
    { id: 'market', label: 'MARKET', icon: <ShoppingCart size={14} /> },
    { id: 'auction', label: auctionLive ? '🔴 AUCTION' : 'AUCTION', icon: <Hammer size={14} /> },
    { id: 'rankings', label: 'RANKINGS', icon: <Trophy size={14} /> },
    { id: 'tournaments', label: 'CUPS', icon: <Trophy size={14} /> },
    { id: 'inbox', label: 'INBOX', icon: <Bell size={14} />, badge: inboxUnread > 0 ? inboxUnread : null },
  ] as const;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500/30 pb-10">
      {/* FIFA TOP STATUS BAR - Fully Responsive */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/5 py-2 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Level Info */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">LVL</span>
            <div className="px-1.5 md:px-2 py-0.5 bg-amber-500 text-black text-[9px] md:text-[10px] font-black rounded">{calcLevel(myPlayer).lvl}</div>
            <div className="w-16 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden hidden xs:block">
              <div className="h-full bg-amber-500" style={{ width: `${calcLevel(myPlayer).progress}%` }} />
            </div>
          </div>
          {/* Budget */}
          <div className="flex items-center gap-1.5 md:gap-2 text-amber-500">
            <DollarSign size={12} className="md:w-[14px]" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">{fmtBudget(myClub?.budget || 0)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Squad Count (Hidden on mobile peek) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <Users size={12} className="text-slate-500" />
            <span className="text-[10px] font-black text-white uppercase">{squad.length}/25</span>
          </div>
          {/* User Peek */}
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white leading-none uppercase truncate max-w-[80px]">{myPlayer?.name || 'MANAGER'}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 truncate max-w-[80px]">{myClub?.name || 'UNASSIGNED'}</p>
            </div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-[10px] md:text-xs">
              {myPlayer?.overall || '??'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8 md:mb-12">
          <div className="text-center xl:text-left">
            <p className="text-[9px] md:text-[10px] font-black text-amber-500 tracking-[0.4em] uppercase mb-2">CLUB MANAGEMENT SYSTEM</p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">CLUB ZONE</h1>
          </div>
          
          {/* Tabs - Responsive Scrollable Container */}
          <div className="w-full xl:w-auto overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-full w-max mx-auto xl:mx-0">
              {tabs.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-full text-[9px] md:text-[11px] font-black tracking-widest whitespace-nowrap transition-all",
                    activeTab === t.id
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105'
                      : auctionLive && t.id === 'auction' ? 'text-red-400 hover:text-white hover:bg-white/5 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {t.icon}<span className="md:inline">{t.label}</span>
                  {t.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[8px] font-black flex items-center justify-center">{t.badge > 9 ? '9+' : t.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deadline Day Alert */}
      {config?.deadlineDayActive && (
        <div className="bg-red-600 overflow-hidden relative py-2">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-10 items-center"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-black font-black text-[10px] tracking-[0.3em] uppercase italic flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> 
                  TRANSFER DEADLINE DAY LIVE
                </span>
                <span className="text-white/40 font-black text-[10px] tracking-[0.3em] uppercase italic">THE CLOCK IS TICKING</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "max-w-6xl mx-auto px-4 md:px-8 py-10",
        config?.deadlineDayActive && "bg-gradient-to-b from-red-900/10 to-transparent"
      )}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-amber-400 font-black text-sm animate-pulse tracking-widest">LOADING CLUB DATA...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {myClub ? (
                  <OverviewTab myClub={myClub} squad={squad} allClubs={clubs} config={config} matches={matches} />
                ) : (
                  <NoClubScreen />
                )}
              </motion.div>
            )}
            {activeTab === 'market' && (
              <motion.div key="market" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <MarketTab listings={listings} clubs={clubs} myClub={myClub} players={players} isOwner={isOwner} config={config} onRefresh={() => load(true)} setMsg={setMsg} matches={matches} />
              </motion.div>
            )}
            {activeTab === 'rankings' && (
              <motion.div key="rankings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <RankingsTab clubs={clubs} players={players} myClub={myClub} config={config} />
              </motion.div>
            )}
            {activeTab === 'auction' && (
              <motion.div key="auction" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <ClubAuction myClub={myClub || null} allClubs={clubs} allPlayers={players} isAdmin={isAdmin} config={config} />
              </motion.div>
            )}
            {activeTab === 'inbox' && myClub && (
              <motion.div key="inbox" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative" style={{ minHeight: 500 }}>
                  <ClubInbox ownerId={playerId} myClub={myClub} allClubs={clubs} allPlayers={players} />
                </div>
              </motion.div>
            )}
            {activeTab === 'squad' && myClub && (
              <motion.div key="squad" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <SquadTab
                  myClub={myClub}
                  squad={squad}
                  allClubs={clubs}
                  allPlayers={players}
                  isOwner={isOwner}
                  isAdmin={isAdmin}
                  onShortlistPlayer={(p) => { setShortlistPlayer(p); setProposalStep('shortlist'); }}
                  onSetReleaseClause={(p) => { setReleaseTarget(p); setReleaseAmount(String(p.releaseClause?.amount || '')); }}
                  setMsg={setMsg}
                  matches={matches}
                />
              </motion.div>
            )}
            {activeTab === 'tournaments' && (
              <motion.div key="tournaments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <TournamentsTab config={config} clubs={clubs} myClub={myClub} squad={squad} players={players} setMsg={setMsg} />
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

        {/* ─── Send Proposal Modal ─── */}
        <AnimatePresence>
          {proposalStep && shortlistPlayer && myClub && (() => {
            const sellerClub = clubs.find(c => c.squadIds?.includes(shortlistPlayer.id));
            return (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a14] border border-white/10 rounded-3xl p-6 z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Transfer Proposal</p>
                      <h3 className="text-lg font-black text-white">{shortlistPlayer.name}</h3>
                    </div>
                    <button onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="p-2 text-slate-500 hover:text-white"><X size={18} /></button>
                  </div>

                  {/* Player mini card */}
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-5">
                    <img src={shortlistPlayer.image} className="w-14 h-14 rounded-xl object-cover" alt={shortlistPlayer.name} />
                    <div className="flex-1">
                      <p className="font-black text-white">{shortlistPlayer.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{shortlistPlayer.ovr} OVR · {sellerClub?.name || 'Unknown Club'}</p>
                      {(() => { const g = getPlayerGrade(shortlistPlayer); return <span className="text-xs font-black" style={{ color: GRADE_COLORS[g] }}>Grade {g}</span>; })()}
                    </div>
                  </div>

                  {/* Offer type toggle */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setOfferType('money')} className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${offerType === 'money' ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400'}`}>💰 Money</button>
                    <button onClick={() => setOfferType('swap')} className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${offerType === 'swap' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}><ArrowLeftRight size={12} className="inline mr-1" />Swap</button>
                  </div>

                  {offerType === 'money' && (
                    <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Offer amount in coins..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-violet-500/50 mb-3" />
                  )}
                  {offerType === 'swap' && (
                    <select value={offerAmount} onChange={e => setOfferAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50 mb-3">
                      <option value="">Select your player to offer...</option>
                      {squad.map(p => <option key={p.id} value={p.id}>{p.name} ({p.ovr} OVR)</option>)}
                    </select>
                  )}
                  <input value={offerNote} onChange={e => setOfferNote(e.target.value)} placeholder="Optional message to seller..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-violet-500/50 mb-5" />

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="py-3 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase">Cancel</button>
                    <button onClick={async () => {
                      if (!myClub || !sellerClub || !shortlistPlayer) return;
                      if (!offerAmount) { setMsg({ text: 'Enter an offer amount or select a player.', type: 'error' }); return; }
                      try {
                        const swapPlayer = offerType === 'swap' ? players.find(p => p.id === offerAmount) : null;
                        await sendTransferProposal({
                          playerId: shortlistPlayer.id, playerName: shortlistPlayer.name, playerImage: shortlistPlayer.image, playerOvr: shortlistPlayer.ovr,
                          buyerClubId: myClub.id, buyerClubName: myClub.name, buyerOwnerId: playerId,
                          sellerClubId: sellerClub.id, sellerClubName: sellerClub.name, sellerOwnerId: sellerClub.ownerId,
                          currentOffer: { type: offerType, amount: offerType === 'money' ? Number(offerAmount) : null, swapPlayerId: offerType === 'swap' ? offerAmount : null, swapPlayerName: swapPlayer?.name || null, sentBy: 'buyer', note: offerNote, sentAt: Date.now() },
                        });
                        setMsg({ text: `✅ Proposal sent to ${sellerClub.name}!`, type: 'success' });
                        setProposalStep(null); setShortlistPlayer(null); setOfferAmount(''); setOfferNote('');
                      } catch(e: any) { setMsg({ text: '❌ ' + e.message, type: 'error' }); }
                    }} className="py-3 bg-violet-500 hover:bg-violet-400 text-white rounded-2xl text-[10px] font-black uppercase transition-all">Send Proposal</button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* ─── Release Clause Modal ─── */}
        <AnimatePresence>
          {releaseTarget && myClub && (() => {
            const hasClause = !!releaseTarget.releaseClause?.active;
            return (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setReleaseTarget(null); setReleaseAmount(''); }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a14] border border-white/10 rounded-3xl p-6 z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Release Clause</p>
                      <h3 className="text-lg font-black text-white">{releaseTarget.name}</h3>
                    </div>
                    <button onClick={() => { setReleaseTarget(null); setReleaseAmount(''); }} className="p-2 text-slate-500 hover:text-white"><X size={18} /></button>
                  </div>
                  {hasClause ? (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl mb-5">
                      <p className="text-[10px] font-black text-amber-400 uppercase mb-1">Active Release Clause</p>
                      <p className="text-2xl font-black text-white">{releaseTarget.releaseClause!.amount.toLocaleString()} coins</p>
                      <p className="text-[10px] text-slate-500 mt-1">Any club can trigger this to buy {releaseTarget.name} instantly.</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400 font-bold mb-4">Set a buyout price. Any club owner can instantly purchase {releaseTarget.name} at this price without negotiation.</p>
                      <input type="number" value={releaseAmount} onChange={e => setReleaseAmount(e.target.value)} placeholder="Buyout price in coins..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50 mb-5" />
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {hasClause ? (
                      <button onClick={async () => {
                        await removeReleaseClause(releaseTarget.id);
                        setMsg({ text: 'Release clause removed.', type: 'success' });
                        setReleaseTarget(null);
                        load(true);
                      }} className="col-span-2 py-3 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase">Remove Clause</button>
                    ) : (
                      <>
                        <button onClick={() => { setReleaseTarget(null); setReleaseAmount(''); }} className="py-3 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase">Cancel</button>
                        <button onClick={async () => {
                          if (!releaseAmount) return;
                          await setReleaseClause(releaseTarget.id, { amount: Number(releaseAmount), active: true, setByClubId: myClub.id, setByClubName: myClub.name, setAt: Date.now() });
                          setMsg({ text: `✅ Release clause set at ${Number(releaseAmount).toLocaleString()} coins.`, type: 'success' });
                          setReleaseTarget(null); setReleaseAmount(''); load(true);
                        }} className="py-3 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase">Set Clause</button>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
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

// ─── Squad Tab (with Shortlist + Release Clause) ──────────────────────────────

function SquadTab({ myClub, squad, allClubs, allPlayers, isOwner, isAdmin, matches, onShortlistPlayer, onSetReleaseClause, setMsg }: {
  myClub: Club; squad: Player[]; allClubs: Club[]; allPlayers: Player[];
  isOwner: boolean; isAdmin: boolean; matches: MatchRecord[];
  onShortlistPlayer: (p: Player) => void;
  onSetReleaseClause: (p: Player) => void;
  setMsg: (m: any) => void;
}) {
  const [viewingClubId, setViewingClubId] = useState<string | null>(null);
  const shortlistIds: string[] = myClub.shortlistedPlayerIds || [];
  const viewingClub = viewingClubId ? allClubs.find(c => c.id === viewingClubId) : null;
  const viewingSquad = viewingClub ? allPlayers.filter(p => viewingClub.squadIds?.includes(p.id)) : [];

  if (viewingClub) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setViewingClubId(null)} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft size={18} /></button>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Browsing Squad</p>
            <h3 className="text-lg font-black text-white">{viewingClub.name}</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viewingSquad.map(p => {
            const grade = getPlayerGrade(p);
            const gradeColor = GRADE_COLORS[grade];
            const inShortlist = shortlistIds.includes(p.id);
            const total = p.win + p.loss + p.draw;
            return (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img src={p.image} className="w-full h-full object-cover object-top" alt={p.name} style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="px-2 py-1 rounded-lg text-[10px] font-black" style={{ background: gradeColor, color: '#000' }}>{grade}</div>
                    <div className="px-2 py-1 rounded-lg text-[10px] font-black" style={{ 
                      background: { 'A': '#4ade80', 'B': '#84cc16', 'C': '#eab308', 'D': '#f97316', 'E': '#ef4444' }[getFormGrade(p.form || [])], 
                      color: '#000' 
                    }}>
                      {getFormGrade(p.form || [])}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1 text-[10px] font-black text-white">{p.ovr} OVR</div>
                  {p.releaseClause?.active && <div className="absolute bottom-2 right-2 bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full">RC: {(p.releaseClause.amount/1000).toFixed(0)}K</div>}
                </div>
                <div className="p-4">
                  <p className="font-black text-white truncate">{p.name}</p>
                  <div className="flex gap-3 mt-2 mb-3">
                    <span className="text-[10px] font-bold text-green-400">W{p.win}</span>
                    <span className="text-[10px] font-bold text-red-400">L{p.loss}</span>
                    <span className="text-[10px] font-bold text-amber-400">D{p.draw}</span>
                    <span className="text-[10px] font-bold text-slate-500">{total}MP</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      if (inShortlist) { await removeFromShortlist(myClub.id, p.id); setMsg({ text: 'Removed from shortlist.', type: 'success' }); }
                      else { await addToShortlist(myClub.id, p.id); setMsg({ text: `${p.name} added to shortlist!`, type: 'success' }); }
                    }} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${inShortlist ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                      {inShortlist ? '★ Listed' : '☆ Shortlist'}
                    </button>
                    <button onClick={() => onShortlistPlayer(p)} className="flex-1 py-2 rounded-xl text-[9px] font-black uppercase bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 transition-all">
                      Propose
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* My Squad */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">My Squad</h3>
          <span className="text-[10px] font-black text-slate-500 uppercase">{squad.length} players</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {squad.map(p => {
            const grade = getPlayerGrade(p);
            const gradeColor = GRADE_COLORS[grade];
            const total = p.win + p.loss + p.draw;
            return (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img src={p.image} className="w-full h-full object-cover object-top" alt={p.name} style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-black" style={{ background: gradeColor, color: '#000' }}>{grade}</div>
                  <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1 text-[10px] font-black text-white">{p.ovr} OVR</div>
                  {p.releaseClause?.active && <div className="absolute bottom-2 left-2 bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full">RC Active</div>}
                </div>
                <div className="p-4">
                  <p className="font-black text-white truncate">{p.name}</p>
                  <div className="flex gap-3 mt-1 mb-3">
                    <span className="text-[10px] font-bold text-green-400">W{p.win}</span>
                    <span className="text-[10px] font-bold text-red-400">L{p.loss}</span>
                    <span className="text-[10px] font-bold text-amber-400">D{p.draw}</span>
                    <span className="text-[10px] font-bold text-slate-500">{total}MP</span>
                  </div>
                  {(isOwner || isAdmin) && (
                    <button onClick={() => onSetReleaseClause(p)} className={`w-full py-2 rounded-xl text-[9px] font-black uppercase transition-all ${p.releaseClause?.active ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                      {p.releaseClause?.active ? `RC: ${(p.releaseClause.amount/1000).toFixed(0)}K — Edit` : 'Set Release Clause'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {squad.length === 0 && <p className="col-span-full text-center text-slate-600 text-sm font-bold py-16">No squad members assigned yet.</p>}
        </div>
      </div>

      {/* Browse other clubs */}
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Browse Other Clubs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allClubs.filter(c => c.id !== myClub.id).map(c => (
            <button key={c.id} onClick={() => setViewingClubId(c.id)} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs mb-3" style={{ background: `linear-gradient(135deg, ${c.primaryColor}, ${c.secondaryColor})` }}>{c.shortName}</div>
              <p className="text-sm font-black text-white truncate">{c.name}</p>
              <p className="text-[9px] text-slate-500 font-bold mt-0.5">{allPlayers.filter(p => c.squadIds?.includes(p.id)).length} players</p>
            </button>
          ))}
        </div>
      </div>

      {/* My Shortlist */}
      {shortlistIds.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">My Shortlist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortlistIds.map(id => {
              const p = allPlayers.find(pl => pl.id === id);
              if (!p) return null;
              const grade = getPlayerGrade(p);
              const gradeColor = GRADE_COLORS[grade];
              return (
                <div key={id} className="flex items-center gap-4 p-4 bg-white/5 border border-violet-500/20 rounded-2xl">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white truncate">{p.name}</p>
                    <div className="flex gap-2 items-center mt-0.5">
                      <span className="text-[10px] font-black" style={{ color: gradeColor }}>Grade {grade}</span>
                      <span className="text-[10px] text-slate-500">{p.ovr} OVR</span>
                    </div>
                  </div>
                  <button onClick={() => onShortlistPlayer(p)} className="px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-xl text-[9px] font-black uppercase hover:bg-violet-500/20 transition-all">Propose</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transfer Market Tab ──────────────────────────────────────────────────────

function MarketTab({ listings, clubs, myClub, players, isOwner, config, onRefresh, setMsg, matches }:
  { listings: MarketListing[]; clubs: Club[]; myClub?: Club; players: Player[]; isOwner: boolean; config: ClubSystemConfig | null; onRefresh: () => void; setMsg: (m: { text: string; type: string }) => void; matches: MatchRecord[] }) {

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
    <div className="space-y-6 md:space-y-8">
      <div className={`rounded-[1.5rem] md:rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 border ${windowOpen ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${windowOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}><DollarSign size={20} /></div>
          <div>
            <p className="font-black text-white text-sm">Transfer Window {windowOpen ? 'OPEN' : 'CLOSED'}</p>
            <p className="text-[10px] font-bold text-slate-400">{windowOpen ? (config?.transferWindowCloseDate ? `Closes ${new Date(config.transferWindowCloseDate).toLocaleDateString()}` : 'Window active') : 'No transfers allowed.'}</p>
          </div>
        </div>
        {myClub && <div className="md:ml-auto text-left md:text-right border-t md:border-t-0 border-white/5 pt-3 md:pt-0"><p className="text-[9px] font-black text-slate-500 uppercase">My Budget</p><p className="text-xl md:text-2xl font-black text-amber-400">VCC {fmtBudget(myClub.budget)}</p></div>}
      </div>

      {isOwner && windowOpen && mySquad.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-2xl p-5 md:p-6">
          <h3 className="text-[10px] md:text-sm font-black tracking-widest text-slate-300 uppercase mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-400" /> LIST A PLAYER</h3>
          <div className="flex flex-col xl:flex-row gap-3 md:gap-4">
            <select value={listingPlayerId} onChange={e => setListingPlayerId(e.target.value)} className="flex-1 bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
              <option value="">Select player to list...</option>
              {mySquad.map(p => <option key={p.id} value={p.id} className="bg-[#0f172a]">{p.name} — OVR {p.ovr}</option>)}
            </select>
            <div className="flex-1 relative">
              <input type="number" value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder="Price (VCC)" className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none" />
              {listingPlayerId && (() => {
                const p = players.find(x => x.id === listingPlayerId);
                if (!p) return null;
                const suggestion = calculateBasePrize(p.ovr, getFormGrade(p.form || []));
                return (
                  <button 
                    onClick={() => setListPrice(String(suggestion))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all"
                  >
                    SUGGEST: VCC {fmtBudget(suggestion)}
                  </button>
                );
              })()}
            </div>
            <button onClick={handleList} disabled={busy || !listingPlayerId || !listPrice} className="px-6 py-3 md:py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all whitespace-nowrap">{busy ? 'LISTING...' : 'LIST PLAYER'}</button>
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
              const player = players.find(p => p.id === l.playerId);
              const form = getFormGrade(player?.form || []);
              const formColor = { 'A': '#4ade80', 'B': '#84cc16', 'C': '#eab308', 'D': '#f97316', 'E': '#ef4444' }[form];
              return (
                <motion.div key={l.id} whileHover={{ scale: 1.01 }} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={l.playerImage} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-lg" style={{ background: ovrColor(l.playerOvr) }}>{l.playerOvr}</div>
                      <div className="w-6 h-4 rounded flex items-center justify-center text-[7px] font-black text-black shadow-lg" style={{ background: formColor }}>{form}</div>
                    </div>
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

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[600px] md:min-w-0">
            <thead>
              <tr className="border-b border-white/5">
                {['#','Club','P','W','D','L','GF','GA','GD','PTS','FORM','OVR'].map(h => (
                  <th key={h} className={cn(
                    "px-2 md:px-3 py-3 text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest uppercase text-center first:text-left",
                    (h === 'GF' || h === 'GA' || h === 'OVR') ? 'hidden lg:table-cell' : '',
                    (h === 'D' || h === 'L') ? 'hidden sm:table-cell' : ''
                  )}>{h}</th>
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
                  {[row.played, row.w].map((v, ci) => (
                    <td key={ci} className="px-2 md:px-3 py-4 text-[10px] md:text-xs font-bold text-slate-300 text-center">{v}</td>
                  ))}
                  {[row.d, row.l].map((v, ci) => (
                    <td key={ci} className="hidden sm:table-cell px-2 md:px-3 py-4 text-[10px] md:text-xs font-bold text-slate-300 text-center">{v}</td>
                  ))}
                  {[row.gf, row.ga].map((v, ci) => (
                    <td key={ci} className="hidden lg:table-cell px-2 md:px-3 py-4 text-[10px] md:text-xs font-bold text-slate-300 text-center">{v}</td>
                  ))}
                  <td className="px-2 md:px-3 py-4 text-[10px] md:text-xs font-bold text-center"
                    style={{ color: row.gd > 0 ? '#4ade80' : row.gd < 0 ? '#f87171' : '#94a3b8' }}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-2 md:px-3 py-4 text-center">
                    <span className="text-xs md:text-sm font-black text-white bg-white/10 px-2 md:px-2.5 py-1 rounded-lg">{row.pts}</span>
                  </td>
                  {/* Form pills */}
                  <td className="px-2 md:px-3 py-4">
                    <div className="flex gap-0.5 justify-center">
                      {row.form.length === 0
                        ? <span className="text-[8px] text-slate-600 font-bold">—</span>
                        : row.form.map((r, fi) => (
                          <span key={fi} className={`w-3 h-3 md:w-4 md:h-4 rounded text-[6px] md:text-[7px] font-black flex items-center justify-center
                            ${r === 'W' ? 'bg-emerald-500/30 text-emerald-400' : r === 'L' ? 'bg-red-500/30 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {r}
                          </span>
                        ))
                      }
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-2 md:px-3 py-4 text-center">
                    <span className="text-[10px] md:text-xs font-black px-1.5 md:px-2 py-0.5 rounded-lg"
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


// ─── Tournaments Hub ─────────────────────────────────────────────────────────

// Module-level cache for club tournaments/fixtures keyed by season
const _tournamentsCache: Record<string, { tournaments: ClubTournament[]; fixtures: ClubFixture[] }> = {};
export function invalidateTournamentsCache() { Object.keys(_tournamentsCache).forEach(k => delete _tournamentsCache[k]); }

function TournamentsTab({ config, clubs, myClub, squad, players, setMsg }: { config: ClubSystemConfig | null; clubs: Club[]; myClub?: Club; squad: Player[]; players: Player[]; setMsg: (m: any) => void }) {
  const [tournaments, setTournaments] = useState<ClubTournament[]>([]);
  const [fixtures, setFixtures] = useState<ClubFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTId, setSelectedTId] = useState<string | null>(null);

  // Lineup submission state
  const [selFixtureId, setSelFixtureId] = useState<string|null>(null);
  const [lineupSelection, setLineupSelection] = useState<string[]>([]);
  const [matchupSelection, setMatchupSelection] = useState<Record<string, string>>({}); // { awayId: homeId }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!config?.season) return;
      // Use cache if available for this season
      const cached = _tournamentsCache[config.season];
      if (cached) {
        setTournaments(cached.tournaments);
        setFixtures(cached.fixtures);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [ts, fs] = await Promise.all([
          fetchClubTournaments(config.season),
          fetchClubFixtures(config.season)
        ]);
        const sortedFs = fs.sort((a, b) => b.createdAt - a.createdAt);
        _tournamentsCache[config.season] = { tournaments: ts, fixtures: sortedFs };
        setTournaments(ts);
        setFixtures(sortedFs);
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
      // Update local state directly (no refetch) and invalidate cache
      setFixtures(prev => {
        const updated = prev.map(x => x.id === f.id ? nf : x);
        // Update cache in-place so next mount gets fresh data
        if (config?.season && _tournamentsCache[config.season]) {
          _tournamentsCache[config.season].fixtures = updated;
        }
        return updated;
      });
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
      const nf: ClubFixture = {
        ...f,
        subMatches: f.awayLineupIds.map(aId => ({
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          p1Id: matchupSelection[aId],
          p1Name: players.find(p => p.id === matchupSelection[aId])?.name || 'Unknown',
          p2Id: aId,
          p2Name: players.find(p => p.id === aId)?.name || 'Unknown',
          p1Score: null, p2Score: null,
        })),
        status: 'active',
      };
      await saveClubFixture(nf);
      setFixtures(prev => {
        const updated = prev.map(x => x.id === f.id ? nf : x);
        if (config?.season && _tournamentsCache[config.season]) {
          _tournamentsCache[config.season].fixtures = updated;
        }
        return updated;
      });
      setSelFixtureId(null);
      setMatchupSelection({});
      setMsg({ text: '✅ Matchups locked!', type: 'success' });
    } catch (e: any) {
      setMsg({ text: '❌ ' + e.message, type: 'error' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-amber-500 font-black tracking-widest text-xs animate-pulse">LOADING TOURNAMENTS...</div>;
  }

  // 1. SELECTOR VIEW
  if (!selectedTId) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg md:text-xl font-black text-white tracking-widest uppercase italic">ACTIVE TOURNAMENTS</h3>
          <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{tournaments.length} EVENTS LIVE</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {tournaments.length === 0 ? (
            <div className="col-span-full py-16 md:py-20 text-center bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem]">
              <Trophy size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 font-black uppercase text-[10px] md:text-xs">No active tournaments this season.</p>
            </div>
          ) : tournaments.map(t => (
            <button key={t.id} onClick={() => setSelectedTId(t.id)}
              className="group relative h-56 md:h-64 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-amber-500/50">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-all" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy size={60} className="md:w-20 md:h-20 text-white/5 group-hover:text-amber-500/10 transition-all duration-700 group-hover:scale-125" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 z-20 text-left">
                <span className={cn("text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded mb-2 md:mb-3 inline-block",
                  t.status === 'active' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'
                )}>
                  {t.status}
                </span>
                <h4 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none truncate">{t.name}</h4>
                <div className="flex items-center gap-4 mt-2 md:mt-3">
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-slate-400">
                    <Calendar size={10} /> {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-amber-500">
                    <Zap size={10} /> VIEW HUB
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. DETAIL VIEW
  const tourney = tournaments.find(t => t.id === selectedTId);
  const tFix = fixtures.filter(f => f.tournamentId === selectedTId);
  if (!tourney) { setSelectedTId(null); return null; }

  return (
    <div className="space-y-8">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedTId(null)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{tourney.name}</h3>
              <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded",
                tourney.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              )}>{tourney.status}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">TOURNAMENT HUB &bull; {tFix.length} FIXTURES</p>
          </div>
        </div>

        {tourney.status !== 'active' && (
          <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-500">
            <AlertCircle size={18} />
            <div>
              <p className="text-[10px] font-black uppercase">PAUSED BY FEDERATION</p>
              {tourney.statusReason && <p className="text-[9px] font-bold opacity-70">{tourney.statusReason}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tFix.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/5 border border-white/10 rounded-[2rem]">
            <Calendar size={32} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-black uppercase text-xs">No fixtures scheduled for this tournament yet.</p>
          </div>
        ) : tFix.map(f => {
          const isHome = myClub?.id === f.homeClubId;
          const isAway = myClub?.id === f.awayClubId;
          const isParticipant = isHome || isAway;
          const myLineup = isHome ? f.homeLineupIds : f.awayLineupIds;
          const oppLineup = isHome ? f.awayLineupIds : f.homeLineupIds;
          const iHaveSubmitted = myLineup.length === f.lineupSize;
          const oppHasSubmitted = oppLineup.length === f.lineupSize;

          return (
            <div key={f.id} className="bg-[#0f172a] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col hover:border-white/20 transition-all">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <span className={cn("text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase",
                  f.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
                  f.status === 'lineups_pending' ? 'bg-blue-500/20 text-blue-400' :
                  f.status === 'matchups_pending' ? 'bg-purple-500/20 text-purple-400' :
                  f.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-slate-500/20 text-slate-400'
                )}>
                  {f.status.replace('_', ' ')}
                </span>
                <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{f.matchupType === 'home_away' ? 'HOME ADVANTAGE' : 'NEUTRAL'} &bull; {f.lineupSize}V{f.lineupSize}</span>
              </div>

              {/* Teams */}
              <div className="p-6 md:p-8 flex items-center justify-between gap-2 md:gap-4">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-sm md:text-xl mb-2 md:mb-3 shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${clubs.find(c => c.id === f.homeClubId)?.primaryColor || '#000'}, ${clubs.find(c => c.id === f.homeClubId)?.secondaryColor || '#000'})` }}>
                    {clubs.find(c => c.id === f.homeClubId)?.shortName}
                  </div>
                  <p className="text-[9px] md:text-[11px] font-black text-white uppercase truncate">{f.homeClubName}</p>
                </div>

                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <div className="text-xl md:text-3xl font-black text-white italic tracking-tighter">VS</div>
                  {f.status === 'completed' && (
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-white/5 rounded-full">
                      <span className="text-[10px] md:text-xs font-black text-white">{f.subMatches.reduce((a, m) => a + (m.p1Score || 0), 0)}</span>
                      <span className="text-slate-600">-</span>
                      <span className="text-[10px] md:text-xs font-black text-white">{f.subMatches.reduce((a, m) => a + (m.p2Score || 0), 0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-sm md:text-xl mb-2 md:mb-3 shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${clubs.find(c => c.id === f.awayClubId)?.primaryColor || '#000'}, ${clubs.find(c => c.id === f.awayClubId)?.secondaryColor || '#000'})` }}>
                    {clubs.find(c => c.id === f.awayClubId)?.shortName}
                  </div>
                  <p className="text-[9px] md:text-[11px] font-black text-white uppercase truncate">{f.awayClubName}</p>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-6 bg-black/40 border-t border-white/5 flex-1 flex flex-col justify-end">
                {isParticipant && (f.status === 'scheduled' || f.status === 'lineups_pending') && !iHaveSubmitted ? (
                  tourney.status !== 'active' ? (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                      <Lock size={18} className="text-slate-500 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament {tourney.status}</p>
                    </div>
                  ) : selFixtureId === f.id ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-center">SELECT {f.lineupSize} SQUAD MEMBERS</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {squad.map(p => {
                          const sel = lineupSelection.includes(p.id);
                          return (
                            <button key={p.id} onClick={() => handleSelectLineup(p.id, f.lineupSize)}
                              className={cn("px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border",
                                sel ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                              )}>
                              {p.name.split(' ')[0]} {sel && '✓'}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSelFixtureId(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase text-slate-400 transition-all">CANCEL</button>
                        <button onClick={() => handleSubmitLineup(f)} disabled={lineupSelection.length !== f.lineupSize || submitting} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-xl text-[10px] font-black tracking-widest uppercase text-black transition-all shadow-lg shadow-amber-500/20">SUBMIT</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setSelFixtureId(f.id); setLineupSelection([]); }} className="w-full py-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 font-black text-[10px] tracking-widest rounded-2xl transition-all uppercase">
                      PREPARE SQUAD LINEUP
                    </button>
                  )
                ) : isParticipant && f.status === 'matchups_pending' && isHome ? (
                  tourney.status !== 'active' ? (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                      <Lock size={18} className="text-slate-500 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament {tourney.status}</p>
                    </div>
                  ) : selFixtureId === f.id ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-center">HOME ADVANTAGE: PAIR MATCHUPS</p>
                      <div className="space-y-3">
                        {f.awayLineupIds.map(aId => {
                          const aName = players.find(p => p.id === aId)?.name || 'Unknown';
                          const selectedHId = matchupSelection[aId];
                          return (
                            <div key={aId} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                              <span className="text-[10px] font-black text-slate-400 uppercase w-20 truncate text-right">{aName.split(' ')[0]}</span>
                              <span className="text-[10px] font-black text-slate-600">VS</span>
                              <select value={selectedHId || ''} onChange={e => setMatchupSelection({...matchupSelection, [aId]: e.target.value})} 
                                className="flex-1 bg-white/10 border-0 p-2 rounded-xl text-[10px] font-black text-white focus:ring-1 ring-amber-500 outline-none uppercase">
                                <option value="" disabled className="text-black">Select Home Player</option>
                                {f.homeLineupIds.map(hId => {
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
                      <div className="flex gap-2">
                        <button onClick={() => setSelFixtureId(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase text-slate-400 transition-all">CANCEL</button>
                        <button onClick={() => handleSubmitMatchups(f)} disabled={Object.keys(matchupSelection).length !== f.awayLineupIds.length || submitting} className="flex-1 py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 rounded-xl text-[10px] font-black tracking-widest uppercase text-white transition-all shadow-lg shadow-purple-500/20">LOCK FIXTURE</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setSelFixtureId(f.id); setMatchupSelection({}); }} className="w-full py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-black text-[10px] tracking-widest rounded-2xl transition-all uppercase">
                      MANAGE HOME ADVANTAGE
                    </button>
                  )
                ) : (
                  <div className="text-center">
                    {f.status === 'active' ? (
                      <p className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> FIXTURE LIVE
                      </p>
                    ) : f.status === 'completed' ? (
                      <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">FIXTURE ARCHIVED</p>
                    ) : f.status === 'matchups_pending' && isAway ? (
                      <p className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Home team pairing lineups...</p>
                    ) : iHaveSubmitted ? (
                      <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Lineup Submitted. Waiting for opponent.</p>
                    ) : (
                      <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase italic">WAITING FOR OWNERS...</p>
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
}

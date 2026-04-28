import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import {
  fetchClubs, fetchClubConfig, fetchMarketListings, fetchClubSeasonMatches,
  listPlayerOnMarket, delistPlayerFromMarket, purchasePlayer,
} from '../lib/store';
import { Club, ClubSystemConfig, MarketListing, MatchRecord, Player } from '../types';
import { Layers, ShoppingCart, Trophy, Calendar, Lock, Star, TrendingUp, Zap, ArrowLeft, Download, Users, DollarSign, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtBudget(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
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
  const gd = squad.reduce((a, p) => a + p.goalsScored - p.goalsConceded, 0);
  const totalWins = squad.reduce((a, p) => a + p.win, 0);
  const avgOvr = squad.length ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length) : 0;

  return (
    <div className="space-y-8">
      {/* Club hero card */}
      <div className="relative rounded-3xl overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8"
        style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}30 0%, #0f172a 50%, ${myClub.secondaryColor}20 100%)`, border: `1px solid ${myClub.primaryColor}40` }}>
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at top-left, ${myClub.primaryColor}, transparent 60%)` }} />

        <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shrink-0 z-10"
          style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}, ${myClub.secondaryColor})` }}>
          {myClub.shortName}
        </div>

        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black tracking-widest mb-3" style={{ background: myClub.primaryColor + '20', color: myClub.primaryColor, border: `1px solid ${myClub.primaryColor}40` }}>
            <Layers size={10} /> CLUB MANAGER
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{myClub.name}</h2>
          <p className="text-slate-400 text-sm font-bold mt-1">{config?.season || 'Club Season'} &bull; {myClub.squadIds.length} Players</p>
        </div>

        <div className="z-10 ml-auto text-right hidden md:block">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Club Budget</p>
          <p className="text-3xl font-black" style={{ color: myClub.primaryColor }}>VCC {fmtBudget(myClub.budget)}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ClubStatBar label="Squad Size" val={squad.length} icon={<Users size={16} />} />
        <ClubStatBar label="Avg OVR" val={avgOvr} icon={<Star size={16} />} />
        <ClubStatBar label="Total Wins" val={totalWins} icon={<Trophy size={16} />} />
        <ClubStatBar label="Goal Diff" val={gd >= 0 ? `+${gd}` : gd} icon={<TrendingUp size={16} />} />
      </div>

      {/* Squad FIFA cards */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-6 flex items-center gap-2">
          <Shield size={16} className="text-brand-purple" /> SQUAD ({squad.length})
        </h3>
        {squad.length === 0 ? (
          <p className="text-slate-500 text-xs font-bold text-center py-12">No players in squad yet. Admin assigns players to clubs.</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-start">
            {squad.map(p => (
              <FifaCard key={p.id} player={p} club={myClub} size="md" />
            ))}
          </div>
        )}
      </div>

      {/* Form guide */}
      {squad.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-4">SQUAD FORM GUIDE</h3>
          <div className="space-y-2">
            {squad.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <img src={p.image} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                <p className="text-xs font-black text-white flex-1 truncate">{p.name}</p>
                <span className="text-[10px] font-bold text-slate-400 w-12 text-center">OVR {p.ovr}</span>
                <div className="flex gap-1">
                  {(p.form || []).slice(-5).map((r, i) => (
                    <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black ${r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : r === 'L' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'rankings' | 'fixtures'>('overview');
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

  // Locked
  if (systemLocks?.clubManager) return <LockedScreen />;

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
    { id: 'rankings', label: 'RANKINGS', icon: <Trophy size={14} /> },
    { id: 'fixtures', label: 'FIXTURES', icon: <Calendar size={14} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at top, #f59e0b30, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Layers size={28} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-400 tracking-[0.3em] uppercase mb-1">Quantum Vortex FC</p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Club Zone</h1>
            </div>
            {myClub && (
              <div className="ml-auto hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border" style={{ borderColor: myClub.primaryColor + '40', background: myClub.primaryColor + '15' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}, ${myClub.secondaryColor})` }}>{myClub.shortName}</div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">My Club</p>
                  <p className="text-xs font-black text-white">{myClub.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black tracking-widest whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
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
            {activeTab === 'fixtures' && (
              <motion.div key="fixtures" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <FixturesTab config={config} clubs={clubs} />
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
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config?.season) { setLoading(false); return; }
    fetchClubSeasonMatches(config.season).then(ms => {
      setMatches(ms);
      setLoading(false);
    });
  }, [config?.season]);

  // Build per-club standings from club-season matches only
  const ranked = useMemo(() => {
    return clubs.map(club => {
      // All player IDs in this club
      const memberIds = new Set(club.squadIds || []);

      // Filter matches where at least one participant is in this club
      const clubMatches = matches.filter(m =>
        memberIds.has(m.p1Id) || (m.p2Id && memberIds.has(m.p2Id))
      );

      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      clubMatches.forEach(m => {
        // Which side is the club on?
        const p1IsMember = memberIds.has(m.p1Id);
        const myScore  = p1IsMember ? Number(m.p1Score) : Number(m.p2Score);
        const oppScore = p1IsMember ? Number(m.p2Score) : Number(m.p1Score);
        gf += myScore; ga += oppScore;
        if (myScore > oppScore) w++;
        else if (myScore < oppScore) l++;
        else d++;
      });

      const played = w + d + l;
      const pts = w * 3 + d;
      const gd = gf - ga;

      // Club OVR = avg OVR of squad members
      const squad = players.filter(p => memberIds.has(p.id));
      const avgOvr = squad.length
        ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length)
        : 0;

      // Last 5 form from club-season matches (chronological)
      const sorted = [...clubMatches].sort((a, b) => a.timestamp - b.timestamp);
      const form = sorted.slice(-5).map(m => {
        const p1IsMember = memberIds.has(m.p1Id);
        const myScore  = p1IsMember ? Number(m.p1Score) : Number(m.p2Score);
        const oppScore = p1IsMember ? Number(m.p2Score) : Number(m.p1Score);
        return myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
      });

      return { club, pts, w, d, l, gf, ga, gd, played, avgOvr, form };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }, [clubs, players, matches]);

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
          <p className="text-[9px] font-black text-slate-500 uppercase">Club Matches</p>
          <p className="text-xl font-black text-white">{matches.length}</p>
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
              {!loading && ranked.length > 0 && matches.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center py-6">
                    <p className="text-slate-500 text-xs font-bold">No club-season matches recorded yet.</p>
                    <p className="text-slate-600 text-[10px] font-bold mt-1">
                      Record matches with tournament = "{config?.season}" to populate standings.
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

function FixturesTab({ config, clubs }: { config: ClubSystemConfig | null; clubs: Club[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [selMd, setSelMd] = useState(config?.currentMatchday || 1);
  const schedule = config?.matchdaySchedule || [];
  const slot = schedule.find(s => s.matchday === selMd);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const url = await toPng(cardRef.current, { quality: 1, pixelRatio: 3, backgroundColor: '#020617' });
      const a = document.createElement('a'); a.href = url; a.download = `QVFC-Matchday-${selMd}.png`; a.click();
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Matchday</label>
          <select value={selMd} onChange={e => setSelMd(Number(e.target.value))} className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
            {Array.from({ length: config?.totalMatchdays || 10 }, (_, i) => i + 1).map(md => (
              <option key={md} value={md} className="bg-[#0f172a]">Matchday {md}</option>
            ))}
          </select>
        </div>
        <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs tracking-widest rounded-xl disabled:opacity-50 transition-all">
          <Download size={14} />{downloading ? 'GENERATING...' : 'DOWNLOAD CARD'}
        </button>
      </div>

      {/* Matchday card */}
      <div ref={cardRef} style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 24, overflow: 'hidden', maxWidth: 700 }}>
        <div style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Quantum Vortex FC</p>
            <p style={{ color: '#000', fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', fontStyle: 'italic', marginTop: 2 }}>MATCHDAY {selMd}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{config?.season || 'Club Season'}</p>
            {slot ? (
              <p style={{ color: '#000', fontSize: 11, fontWeight: 700, marginTop: 3 }}>{new Date(slot.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} • {slot.time}</p>
            ) : (
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: 700, marginTop: 3 }}>Date TBD</p>
            )}
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {clubs.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '32px 0', fontSize: 12, fontWeight: 700 }}>No clubs registered.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: clubs.length === 1 ? '1fr' : '1fr 1fr', gap: 12 }}>
              {clubs.map(club => (
                <div key={club.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${club.primaryColor}35`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{club.shortName}</div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{club.name}</p>
                    <p style={{ color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{club.ownerName || 'Manager TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#1e293b', fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>QVFC CLUB ZONE</p>
          <p style={{ color: '#1e293b', fontSize: 9, fontWeight: 700 }}>{clubs.length} Club{clubs.length !== 1 ? 's' : ''} • MD {selMd}/{config?.totalMatchdays || '?'}</p>
        </div>
      </div>

      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        💡 Matchday date/time is set by admin in the Club System Config. PNG download at 3× resolution.
      </p>
    </div>
  );
}

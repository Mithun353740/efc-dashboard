import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../FirebaseContext';
import {
  fetchClubs, fetchClubConfig, fetchMarketListings,
  subscribeToInbox, subscribeToAuction, subscribeToPlayerInbox,
  sendTransferProposal, setReleaseClause, removeReleaseClause,
  getFormGrade, sendPlayerInboxMessage, applyDirectContract, fetchClubFixtures,
  fetchPlayerInboxMessages, purchasePlayer,
} from '../lib/store';
import { Club, ClubSystemConfig, MarketListing, MatchRecord, Player, ClubFixture, ClubInboxMessage } from '../types';
import { isAdminUser, cn, getPlayerGrade, GRADE_COLORS } from '../lib/utils';
import { Layers, ShoppingCart, Trophy, Calendar, Lock, Users, DollarSign, Shield, Hammer, Bell, X, PenTool, LayoutDashboard, Search, AlertCircle, Check, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClubAuction from './club/ClubAuction';
import ClubInbox from './club/ClubInbox';
import PlayerInbox from './club/PlayerInbox';

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

function ClubLogo({ club, size = 'md' }: { club: Club | null; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!club) return <div className="w-8 h-8 rounded bg-slate-800" />;
  const dim = { 'xs': 'w-6 h-6', 'sm': 'w-10 h-10', 'md': 'w-16 h-16', 'lg': 'w-24 h-24', 'xl': 'w-32 h-32' }[size];
  const text = { 'xs': 'text-[8px]', 'sm': 'text-[10px]', 'md': 'text-sm', 'lg': 'text-xl', 'xl': 'text-3xl' }[size];
  const rounded = size === 'xs' ? 'rounded' : size === 'sm' ? 'rounded-lg' : 'rounded-2xl';

  if (club.logo) {
    return (
      <div className={`${dim} ${rounded} overflow-hidden bg-white/5 border border-white/10 shrink-0`}>
        <img src={club.logo} alt={club.name} className="w-full h-full object-contain p-1" />
      </div>
    );
  }
  return (
    <div className={`${dim} ${rounded} flex items-center justify-center font-black text-white shrink-0 shadow-lg`} style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}>
      <span className={`${text} tracking-tighter italic uppercase`}>{club.shortName}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/5", color)}>{icon}</div>
      <div>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function OverviewTab({ myClub, squad, allClubs, config, matches, fixtures, inboxUnread, playerUnread, setActiveTab }: any) {
  const currentSeason = config?.season || '2024';
  const myResults = (matches || []).filter((m: any) => m.p1Id === myClub.ownerId || m.p2Id === myClub.ownerId);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="SQUAD SIZE" value={squad.length} icon={<Users size={14} />} color="text-brand-purple" />
            <StatCard label="MATCHES" value={myResults.length} icon={<Trophy size={14} />} color="text-amber-500" />
            <StatCard label="INBOX" value={inboxUnread + playerUnread} icon={<Bell size={14} />} color="text-blue-400" />
            <StatCard label="BUDGET" value={fmtBudget(myClub.budget || 0)} icon={<DollarSign size={14} />} color="text-emerald-500" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Match Center</p>
              <h4 className="text-lg font-black text-white italic uppercase tracking-tight">Active Season: {currentSeason}</h4>
            </div>
            <button onClick={() => setActiveTab('tournaments')} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest relative z-10">Tournaments</button>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"><Shield size={20} className="text-brand-purple" /></div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Club Profile</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase">{myClub.name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-white/5"><span className="text-[9px] font-black text-slate-500 uppercase">Manager</span><span className="text-[10px] font-black text-white">{myClub.ownerName}</span></div>
            <div className="flex justify-between py-2 border-b border-white/5"><span className="text-[9px] font-black text-slate-500 uppercase">Status</span><span className="text-[10px] font-black text-emerald-500 uppercase">Licensed</span></div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3"><Users size={16} className="text-slate-500" /> Key Personnel</h3>
          <button onClick={() => setActiveTab('squad')} className="text-[9px] font-black text-brand-purple hover:text-white uppercase">View Squad</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {squad.slice(0, 5).map((player: any) => (
            <div key={player.id} className="bg-[#0a0a14] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-purple/40 transition-all p-3">
              <div className="aspect-square rounded-xl bg-slate-900 mb-3 overflow-hidden relative">
                {player.image ? <img src={player.image} className="w-full h-full object-cover" alt="" /> : <User size={24} className="text-slate-800 m-auto mt-4" />}
                <div className="absolute top-1 right-1 px-1 py-0.5 bg-black/60 rounded text-[9px] font-black text-white">{player.ovr}</div>
              </div>
              <p className="text-[10px] font-black text-white uppercase truncate">{player.name}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase">{player.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketTab({ listings, clubs, myClub, players, isOwner, config, onRefresh, setMsg, onViewSquad }: any) {
  const [marketSubTab, setMarketSubTab] = useState<'players' | 'clubs'>('players');

  return (
    <div className="space-y-6">
      {/* Market Sub-nav */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button onClick={() => setMarketSubTab('players')} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", marketSubTab === 'players' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white')}>Listed Players</button>
        <button onClick={() => setMarketSubTab('clubs')} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", marketSubTab === 'clubs' ? 'bg-brand-purple text-white' : 'text-slate-500 hover:text-white')}>Browse Clubs</button>
      </div>

      {marketSubTab === 'players' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(listings || []).length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/3 border border-white/5 rounded-3xl">
              <Search size={48} className="mx-auto text-slate-800 mb-4" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No players currently listed</p>
            </div>
          ) : (
            listings.map((l: any) => {
              const player = players.find((p:any) => p.id === l.playerId);
              const seller = clubs.find((c:any) => c.id === l.clubId);
              if (!player) return null;
              return (
                <div key={l.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-amber-500/40 transition-all group relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden border border-white/10">
                      {player.image ? <img src={player.image} className="w-full h-full object-cover" alt="" /> : <User size={24} className="m-auto mt-4 text-slate-700" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">{player.name}</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{player.ovr} OVR · {seller?.name || 'Free Agent'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-white/5 mb-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Price</span>
                    <span className="text-xl font-black text-amber-500">{fmtBudget(l.price)}</span>
                  </div>
                  <button 
                    disabled={!isOwner || myClub?.id === l.clubId}
                    onClick={async () => {
                       try {
                         await purchasePlayer(l, myClub, seller);
                         setMsg({ text: 'Transfer Successful!', type: 'success' });
                         onRefresh();
                       } catch(e:any) { setMsg({ text: e.message, type: 'error' }); }
                    }}
                    className="w-full py-4 bg-amber-500 disabled:opacity-20 text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    Buy Player
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((c: any) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-brand-purple/40 transition-all">
              <div className="flex items-center gap-3">
                <ClubLogo club={c} size="xs" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase truncate">{c.name}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase">{c.squadIds?.length || 0} Players</p>
                </div>
              </div>
              <button onClick={() => onViewSquad(c)} className="px-4 py-2 bg-white/5 group-hover:bg-brand-purple rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">View Squad</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SquadTab({ myClub, squad, onShortlistPlayer, onRenewContract, onSetReleaseClause }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {squad.map((p: any) => (
        <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-brand-purple/40">
           <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0 overflow-hidden">
             {p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-xs font-black text-white uppercase truncate">{p.name}</p>
             <p className="text-[9px] text-slate-500 font-bold uppercase">{p.position} · {p.ovr} OVR</p>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={() => onRenewContract(p)} className="p-2 bg-white/5 rounded-lg text-amber-500 hover:bg-amber-500 hover:text-black transition-all"><PenTool size={14} /></button>
             <button onClick={() => onSetReleaseClause(p)} className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-blue-400 hover:text-black transition-all"><DollarSign size={14} /></button>
           </div>
        </div>
      ))}
    </div>
  );
}

function RankingsTab({ clubs, onViewSquad }: any) {
  const sorted = [...clubs].sort((a,b) => (b.managerRating || 0) - (a.managerRating || 0));
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pos</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Club</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Rating</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map((c, i) => (
            <tr key={c.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-xs font-black text-white">{i+1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ClubLogo club={c} size="xs" />
                  <span className="text-xs font-black text-white uppercase">{c.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-black text-amber-500 hidden md:table-cell">{c.managerRating || 0}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onViewSquad(c)} className="px-4 py-2 bg-white/5 hover:bg-brand-purple text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">View Squad</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TournamentsTab({ config }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
       <Calendar size={48} className="text-slate-700 mb-4" />
       <h3 className="text-sm font-black text-white uppercase tracking-widest">Match Center</h3>
       <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">Season {config?.season || 'Active'}</p>
    </div>
  );
}

function LockedScreen() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <Lock size={48} className="text-amber-500 mb-6" />
      <h2 className="text-2xl font-black text-white uppercase mb-2">Locked</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Club Zone is currently inactive.</p>
    </div>
  );
}

function NoClubScreen() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-white/5 rounded-3xl bg-white/3">
      <Shield size={48} className="text-slate-800 mb-6" />
      <h2 className="text-xl font-black text-white uppercase mb-4 tracking-tighter">No Club Assigned</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-xs">Contact an administrator to be assigned to a club and unlock your dashboard.</p>
    </div>
  );
}

export default function ClubManager() {
  const { players, matches, systemLocks } = useFirebase();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [config, setConfig] = useState<ClubSystemConfig | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [fixtures, setFixtures] = useState<ClubFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'market' | 'rankings' | 'tournaments' | 'auction' | 'inbox'>('overview');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [inboxUnread, setInboxUnread] = useState(0);
  const [playerUnread, setPlayerUnread] = useState(0);
  const [auctionLive, setAuctionLive] = useState(false);
  const [shortlistPlayer, setShortlistPlayer] = useState<Player | null>(null);
  const [proposalStep, setProposalStep] = useState<'shortlist' | 'offer' | 'renewal' | null>(null);
  const [offerType, setOfferType] = useState<'money' | 'swap'>('money');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerDuration, setOfferDuration] = useState('5');
  const [releaseTarget, setReleaseTarget] = useState<Player | null>(null);
  const [releaseAmount, setReleaseAmount] = useState('');
  const [viewingClub, setViewingClub] = useState<Club | null>(null);

  const playerId = localStorage.getItem('playerId') || '';
  const isPlayer = localStorage.getItem('playerLoggedIn') === 'true';
  const myPlayer = useMemo(() => players.find(p => p.id === playerId), [players, playerId]);
  const [myClub, setMyClub] = useState<Club | null>(null);

  useEffect(() => {
    if (!clubs.length || !playerId) return;
    const found = clubs.find(c => c.squadIds?.includes(playerId) || c.ownerId === playerId);
    setMyClub(found || null);
  }, [clubs, playerId]);

  const squad = useMemo(() => myClub ? players.filter(p => myClub.squadIds?.includes(p.id)) : [], [players, myClub]);
  const isOwner = myClub?.ownerId === playerId;
  const isAdmin = isAdminUser();

  const load = async (force = false) => {
    setLoading(true);
    try {
      const [cfg, ls, cs] = await Promise.all([
        fetchClubConfig(force),
        fetchMarketListings(force),
        fetchClubs(force)
      ]).catch(() => [null, [], []]) as [any, any, any];
      
      if (cfg) setConfig(cfg);
      setListings(ls);
      setClubs(cs || []);
      if (cfg?.season) {
        const fs = await fetchClubFixtures(cfg.season).catch(() => []);
        setFixtures(fs);
      }
    } catch (err) {
      console.error('[ClubManager] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Inbox: lazy-mount only when Inbox tab is active ──────────────────────
  // Replaces always-on subscription that ran from mount even when user never opened inbox.
  // Saves 2 persistent Firestore WebSocket connections per player.
  useEffect(() => {
    if (!playerId || !isPlayer || activeTab !== 'inbox') return;
    const u1 = subscribeToInbox(playerId, (_, count) => { setInboxUnread(count); });
    const u2 = subscribeToPlayerInbox(playerId, (msgs) => {
      setPlayerUnread(msgs.filter(m => m.status === 'unread').length);
    });
    return () => { u1(); u2(); };
  }, [playerId, isPlayer, activeTab]);

  // ── Inbox unread badge: lightweight poll when NOT on inbox tab ─────────────
  // Fetches inbox once on mount + every 2 minutes to show the badge dot.
  // Cost: 1 read per 2 min vs. a permanent always-on WebSocket listener.
  useEffect(() => {
    if (!playerId || !isPlayer || activeTab === 'inbox') return;
    const checkUnread = async () => {
      try {
        const msgs = await fetchPlayerInboxMessages(playerId, 20);
        setPlayerUnread(msgs.filter(m => m.status === 'unread').length);
        // Also check club inbox unread count if owner (stored on inbox doc itself — 1 read)
        if (isOwner) {
          try {
            const { db } = await import('../firebase');
            const { getDoc, doc: fsDoc } = await import('firebase/firestore');
            const snap = await getDoc(fsDoc(db, 'clubInbox', playerId));
            if (snap.exists()) setInboxUnread(snap.data().unreadCount || 0);
          } catch {}
        }
      } catch {}
    };
    checkUnread();
    const interval = setInterval(checkUnread, 2 * 60 * 1000); // Poll every 2 min for badge
    return () => clearInterval(interval);
  }, [playerId, isPlayer, activeTab, isOwner]);

  // ── Auction: real-time only when Auction tab active; poll otherwise ────────
  // Full real-time listener when tab is open (needed for live bidding).
  // Lightweight poll when tab is closed (just enough to show the 🔴 LIVE badge).
  useEffect(() => {
    if (!isPlayer) return;
    if (activeTab === 'auction') {
      // Full real-time listener while auction tab is open
      return subscribeToAuction((s) => {
        setAuctionLive(!!s && s.status !== 'ended' && s.status !== 'idle');
      });
    } else {
      // Lightweight 30-second poll for badge — no persistent WebSocket
      const checkAuction = async () => {
        try {
          const { db } = await import('../firebase');
          const { getDoc, doc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'auctions', 'live'));
          if (snap.exists()) {
            const s = snap.data();
            setAuctionLive(!!s && s.status !== 'ended' && s.status !== 'idle');
          } else {
            setAuctionLive(false);
          }
        } catch {}
      };
      checkAuction();
      const interval = setInterval(checkAuction, 120_000); // 2-min poll for badge (was 30s)
      return () => clearInterval(interval);
    }
  }, [isPlayer, activeTab]);

  useEffect(() => {
    console.log("[ClubManager] v1.4.0 Mounted — optimized subscriptions");
    document.body.setAttribute('data-club-zone-active', 'true');
  }, []);

  if (systemLocks?.clubManager && !isAdmin) return <LockedScreen />;
  if (!isPlayer) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="text-center">
        <Layers size={48} className="text-amber-500 mx-auto mb-6" />
        <h2 className="text-xl font-black text-white mb-6 uppercase">Login Required</h2>
        <Link to="/login" className="px-8 py-3 bg-brand-purple text-white rounded-full text-xs font-black tracking-widest">LOGIN</Link>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'HUB', icon: <LayoutDashboard size={14} /> },
    { id: 'squad', label: 'SQUAD', icon: <Users size={14} /> },
    { id: 'market', label: 'MARKET', icon: <ShoppingCart size={14} /> },
    { id: 'auction', label: auctionLive ? '🔴 LIVE' : 'AUCTION', icon: <Hammer size={14} /> },
    { id: 'rankings', label: 'LEAGUE', icon: <Trophy size={14} /> },
    { id: 'tournaments', label: 'MATCHES', icon: <Calendar size={14} /> },
    { id: 'inbox', label: 'INBOX', icon: <Bell size={14} />, badge: (isOwner ? inboxUnread : playerUnread) || null },
  ] as const;

  return (
    <div className="bg-[#020617] text-white selection:bg-amber-500/30 pb-20 relative">
      <div className="absolute top-0 right-0 p-1 opacity-20 text-[8px] font-black z-50">v1.3.9</div>
      
      <div className="relative md:sticky md:top-[80px] z-[50]" style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #060a14 100%)', borderBottom: `2px solid ${myClub?.primaryColor || '#8b5cf6'}40` }}>
        <div className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-white/5">
          {myClub ? <ClubLogo club={myClub} size="sm" /> : <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Shield size={16} className="text-slate-500" /></div>}
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{myClub?.name || 'No Club'}</p>
            <p className="text-xs font-black text-white uppercase tracking-tight truncate leading-none">{myPlayer?.name || 'MANAGER'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded font-black text-sm text-white" style={{ background: myClub?.primaryColor || '#8b5cf6' }}>{myPlayer?.ovr || '—'}</div>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-stretch min-w-max">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={cn('relative flex items-center gap-1.5 px-5 py-3 text-[10px] font-black tracking-widest uppercase transition-all border-b-2', activeTab === t.id ? 'text-white border-current' : 'text-slate-500 border-transparent hover:text-white')} style={activeTab === t.id ? { borderColor: myClub?.primaryColor || '#f59e0b', color: myClub?.primaryColor || '#f59e0b' } : {}}>
                {t.icon} <span>{t.label}</span> {t.badge && <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[8px] flex items-center justify-center">{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest animate-pulse">Initializing...</p>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {activeTab === 'overview' && (myClub ? <OverviewTab myClub={myClub} squad={squad} allClubs={clubs} config={config} matches={matches} fixtures={fixtures} inboxUnread={inboxUnread} playerUnread={playerUnread} setActiveTab={setActiveTab} /> : <NoClubScreen />)}
            {activeTab === 'market' && <MarketTab listings={listings} clubs={clubs} myClub={myClub} players={players} isOwner={isOwner} config={config} onRefresh={() => load(true)} setMsg={setMsg} onViewSquad={setViewingClub} />}
            {activeTab === 'rankings' && <RankingsTab clubs={clubs} players={players} myClub={myClub} config={config} onViewSquad={setViewingClub} />}
            {activeTab === 'auction' && <ClubAuction myClub={myClub || null} allClubs={clubs} allPlayers={players} isAdmin={isAdmin} loggedInPlayerId={playerId} playerName={players.find(p => p.id === playerId)?.name} config={config} />}
            {activeTab === 'inbox' && (
              <div className="bg-[#0a0a14] border border-white/10 rounded-3xl overflow-hidden min-h-[600px]">
                {isOwner && myClub ? <ClubInbox ownerId={playerId} myClub={myClub} allClubs={clubs} allPlayers={players} initialMessages={[]} initialUnread={inboxUnread} /> : (myPlayer ? <PlayerInbox player={myPlayer} allClubs={clubs} /> : <div className="p-20 text-center text-slate-500 uppercase text-[10px] font-black">No Profile</div>)}
              </div>
            )}
            {activeTab === 'squad' && myClub && <SquadTab myClub={myClub} squad={squad} onShortlistPlayer={p => { setShortlistPlayer(p); setProposalStep('shortlist'); }} onRenewContract={p => { setShortlistPlayer(p); setProposalStep('renewal'); setOfferAmount('500000'); setOfferDuration('5'); }} onSetReleaseClause={p => { setReleaseTarget(p); setReleaseAmount(String(p.releaseClause?.amount || '')); }} />}
            {activeTab === 'tournaments' && <TournamentsTab config={config} />}
          </div>
        )}
      </div>

      {msg.text && (
        <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest shadow-2xl z-[100]", msg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}>
          {msg.text}
        </div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {proposalStep === 'renewal' && shortlistPlayer && myClub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a14] border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-lg font-black text-white uppercase italic mb-6">Contract: {shortlistPlayer.name}</h3>
              <div className="space-y-4">
                <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Bonus amount..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => setProposalStep(null)} className="py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase">Cancel</button>
                  <button onClick={async () => {
                    setLoading(true);
                    try {
                      await sendPlayerInboxMessage({ recipientId: shortlistPlayer.id, senderId: playerId, type: 'contract_renewal', title: 'Contract Renewal', body: `${myClub.ownerName} offered renewal: ${offerDuration} matches · ${Number(offerAmount).toLocaleString()} VCC`, data: { clubId: myClub.id, clubName: myClub.name, salary: Number(offerAmount), duration: Number(offerDuration), playerId: shortlistPlayer.id, playerName: shortlistPlayer.name } });
                      setMsg({ text: 'Offer Sent!', type: 'success' }); setProposalStep(null);
                    } catch(e:any) { setMsg({ text: e.message, type: 'error' }); }
                    finally { setLoading(false); }
                  }} className="py-4 bg-brand-purple text-white rounded-2xl text-[10px] font-black uppercase">Send Offer</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {proposalStep === 'shortlist' && shortlistPlayer && myClub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a14] border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-lg font-black text-white uppercase italic mb-6">Propose: {shortlistPlayer.name}</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setOfferType('money')} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black", offerType==='money'?'bg-violet-500 text-white':'bg-white/5 text-slate-500')}>MONEY</button>
                  <button onClick={() => setOfferType('swap')} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black", offerType==='swap'?'bg-amber-500 text-black':'bg-white/5 text-slate-500')}>SWAP</button>
                </div>
                <input type={offerType==='money'?'number':'text'} value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder={offerType==='money'?'Amount...':'Player ID...'} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => setProposalStep(null)} className="py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase">Cancel</button>
                  <button onClick={async () => {
                    const seller = clubs.find(c => c.squadIds?.includes(shortlistPlayer.id));
                    if (!seller) return;
                    try {
                      await sendTransferProposal({ playerId: shortlistPlayer.id, playerName: shortlistPlayer.name, buyerClubId: myClub.id, buyerClubName: myClub.name, buyerOwnerId: playerId, sellerClubId: seller.id, sellerClubName: seller.name, sellerOwnerId: seller.ownerId, currentOffer: { type: offerType, amount: offerType==='money'?Number(offerAmount):null, swapPlayerId: offerType==='swap'?offerAmount:null, sentBy: 'buyer', sentAt: Date.now() } });
                      setMsg({ text: 'Proposal Sent!', type: 'success' }); setProposalStep(null);
                    } catch(e:any) { setMsg({ text: e.message, type: 'error' }); }
                  }} className="py-4 bg-violet-500 text-white rounded-2xl text-[10px] font-black uppercase">Send Proposal</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {releaseTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a14] border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-lg font-black text-white uppercase italic mb-6">Release Clause: {releaseTarget.name}</h3>
              <input type="number" value={releaseAmount} onChange={e => setReleaseAmount(e.target.value)} placeholder="Buyout..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setReleaseTarget(null)} className="py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase">Cancel</button>
                <button onClick={async () => {
                   if (!releaseAmount) return;
                   await setReleaseClause(releaseTarget.id, { amount: Number(releaseAmount), active: true, setByClubId: myClub?.id || '', setAt: Date.now() });
                   setMsg({ text: 'Set!', type: 'success' }); setReleaseTarget(null); load(true);
                }} className="py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingClub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0a0a14] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <ClubLogo club={viewingClub} size="sm" />
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{viewingClub.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Manager: {viewingClub.ownerName}</p>
                  </div>
                </div>
                <button onClick={() => setViewingClub(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.filter(p => viewingClub.squadIds?.includes(p.id)).map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0 overflow-hidden">
                         {p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-xs font-black text-white uppercase truncate">{p.name}</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase">{p.position} · {p.ovr} OVR</p>
                       </div>
                       {isOwner && viewingClub.id !== myClub?.id && (
                         <button onClick={() => { setViewingClub(null); setShortlistPlayer(p); setProposalStep('shortlist'); }} className="px-4 py-2 bg-brand-purple text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Buy</button>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

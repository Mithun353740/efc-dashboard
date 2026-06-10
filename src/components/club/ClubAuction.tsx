import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Gavel, TrendingUp, Users, DollarSign, CheckCircle, X, SkipForward, Play } from 'lucide-react';
import { AuctionState, Club, Player, ClubSystemConfig } from '../../types';
import { getPlayerGrade, GRADE_COLORS, GRADE_BASE_PRICES } from '../../lib/utils';
import {
  fetchAuctionPolling, placeBid, foldBid,
  adminRevealCard, adminConfirmSold, adminSkipPlayer, adminEndAuction, adminStartAuction, adminNextTurn,
} from '../../lib/store';

function fmtCoins(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

interface ClubAuctionProps {
  myClub: Club | null;
  allClubs: Club[];
  allPlayers: Player[];
  isAdmin: boolean;
  loggedInPlayerId?: string;
  playerName?: string;
  config: ClubSystemConfig | null;
}

export default function ClubAuction({ myClub, allClubs, allPlayers, isAdmin, loggedInPlayerId, playerName, config }: ClubAuctionProps) {
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [prevBid, setPrevBid] = useState(0);
  const [isBidding, setIsBidding] = useState(false);
  const [error, setError] = useState('');
  const [customBid, setCustomBid] = useState('');

  // Role detection
  const isDedicatedAuctionAdmin = !!(
    config?.auctionAdminId && 
    (
      String(loggedInPlayerId).trim() === String(config.auctionAdminId).trim() ||
      String(playerName).trim().toLowerCase() === String(config.auctionAdminId).trim().toLowerCase()
    )
  );
  const isOwner = !!myClub && myClub.ownerId === loggedInPlayerId;
  
  // CRITICAL: Strict Auction Admin controls
  // If an auction admin is assigned in Control Center, ONLY they can operate controls.
  // If none is assigned, fallback to master admins who DO NOT own a club.
  // An admin who owns a club is NEVER allowed to control unless explicitly assigned as Auction Admin.
  const canOperateControls = isDedicatedAuctionAdmin || (isAdmin && !isOwner && !config?.auctionAdminId);

  // Admin setup
  const [revealPlayerId, setRevealPlayerId] = useState('');

  // Confetti state
  const [showSold, setShowSold] = useState(false);
  const prevStatusRef = useRef<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Auction schedule countdown
  const [turnTimeLeft, setTurnTimeLeft] = useState<number | null>(null); // Per-turn 90s countdown
  const [nextTurnBusy, setNextTurnBusy] = useState(false);

  useEffect(() => {
    if (!config?.auctionStartTime || (auctionState?.status !== 'idle' && auctionState?.status !== 'ended')) {
      setTimeLeft(null);
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = config.auctionStartTime! - now;
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [config?.auctionStartTime, auctionState?.status]);  // Per-turn 90s countdown from Firestore bidDeadlineAt
  useEffect(() => {
    if (!auctionState?.bidDeadlineAt || auctionState.status !== 'active') {
      setTurnTimeLeft(null);
      return;
    }
    const tick = () => {
      const diff = auctionState.bidDeadlineAt! - Date.now();
      setTurnTimeLeft(Math.max(0, diff));
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [auctionState?.bidDeadlineAt, auctionState?.status]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    return `${m % 60}m ${s % 60}s`;
  };

  // Smart polling: faster when auction is active, slower when idle
  // Replaces permanent onSnapshot listener to reduce reads by ~95%
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let mounted = true;
    let lastFetchTime = 0;
    const MIN_POLL_INTERVAL = 30000; // 30 seconds minimum between fetches

    const poll = async () => {
      if (!mounted) return;
      
      // Respect minimum interval to prevent rapid fetches
      const now = Date.now();
      if (now - lastFetchTime < MIN_POLL_INTERVAL) {
        return;
      }
      lastFetchTime = now;
      
      try {
        const state = await fetchAuctionPolling();
        if (!mounted) return;
        setAuctionState(prev => {
          // Detect status change to 'sold' for animation
          if (prev?.status !== 'sold' && state?.status === 'sold') {
            setShowSold(true);
            setTimeout(() => setShowSold(false), 3500);
          }
          setPrevBid(prev?.currentBid || 0);
          return state;
        });
      } catch {
        // Non-critical — fail silently
      }
    };

    // Poll once on mount (after initial delay)
    const initialTimeout = setTimeout(poll, 5000); // Wait 5s before first poll

    // Poll every 60 seconds - auction updates are not time-critical
    intervalId = setInterval(poll, 60000);

    return () => {
      mounted = false;
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, []);

  if (!auctionState || auctionState.status === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
          <Gavel size={44} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Auction Room</h2>
        {auctionState?.status === 'ended' ? (
          <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">The auction has ended. All players have been assigned.</p>
        ) : config?.auctionSchedule ? (
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl inline-block mb-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Next Auction Scheduled For</p>
            <p className="text-xl font-black text-amber-500 uppercase">{config.auctionSchedule}</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">No auction is currently active. Check back when the Admin starts a session.</p>
        )}
      </div>
    );
  }

  const activeBidders = auctionState.biddingOrder.filter(id => !auctionState.foldedClubs.includes(id));
  const currentTurnClubId = activeBidders[auctionState.currentTurnIndex % Math.max(activeBidders.length, 1)];
  const isMyTurn = myClub?.id === currentTurnClubId;
  const iAmFolded = myClub ? auctionState.foldedClubs.includes(myClub.id) : false;
  const currentPlayerData = auctionState.currentPlayer ? allPlayers.find(p => p.id === auctionState.currentPlayer!.id) : null;
  const winningClub = auctionState.leadingClubId ? allClubs.find(c => c.id === auctionState.leadingClubId) : null;
  const unownedPlayers = allPlayers.filter(p => !p.clubId || p.clubId === '');

  return (
    <div className="relative min-h-screen bg-[#030309] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      {/* SOLD BANNER */}
      <AnimatePresence>
        {showSold && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="text-[12vw] font-black text-amber-500 uppercase italic tracking-tighter drop-shadow-[0_0_60px_rgba(245,158,11,0.8)] select-none leading-none" style={{ WebkitTextStroke: '2px #f59e0b' }}>
                SOLD!
              </div>
              {myClub?.id === auctionState.leadingClubId && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-black/80 backdrop-blur-xl px-10 py-6 rounded-3xl border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                  <p className="text-2xl font-black text-white uppercase mb-2">🎉 Congratulations!</p>
                  <p className="text-sm font-bold text-amber-400">{auctionState.currentPlayer?.name} has officially joined {myClub.name}!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADMIN ACTION BAR (sticky, never overlaps layout) ── */}
      {canOperateControls && auctionState.status !== 'idle' && (
        <div className="sticky top-0 z-30 bg-[#0a0a1a]/95 backdrop-blur border-b border-violet-500/20 px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
            {/* Reveal player */}
            <select
              value={revealPlayerId}
              onChange={e => setRevealPlayerId(e.target.value)}
              className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold outline-none"
            >
              <option value="">Select player to reveal...</option>
              {unownedPlayers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.ovr} OVR)</option>)}
            </select>
            <button
              onClick={async () => {
                if (!revealPlayerId) return;
                const p = allPlayers.find(pl => pl.id === revealPlayerId)!;
                await adminRevealCard({ id: p.id, name: p.name, image: p.image, ovr: p.ovr, currentClubId: p.clubId || null, currentClubName: p.clubName || null }, auctionState.basePrice, auctionState.bidIncrement);
                setRevealPlayerId('');
              }}
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1"
            >
              <Play size={13} /> REVEAL
            </button>
            <button
              disabled={!auctionState.leadingClubId || !winningClub}
              onClick={async () => { if (winningClub) await adminConfirmSold(auctionState, winningClub, config); }}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-30 flex items-center gap-1"
            >
              <Hammer size={13} /> SOLD
            </button>
            <button
              onClick={adminSkipPlayer}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1"
            >
              <SkipForward size={13} /> SKIP
            </button>
            {/* Next Club turn button */}
            {auctionState.status === 'active' && (
              <button
                disabled={nextTurnBusy}
                onClick={async () => {
                  const timerActive = turnTimeLeft !== null && turnTimeLeft > 0;
                  if (timerActive) {
                    const ok = window.confirm(`⚠️ The turn timer still has ${Math.ceil(turnTimeLeft! / 1000)}s left. Force advance to next club?`);
                    if (!ok) return;
                  }
                  setNextTurnBusy(true);
                  try { await adminNextTurn(auctionState); }
                  finally { setNextTurnBusy(false); }
                }}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <SkipForward size={13} /> NEXT CLUB
              </button>
            )}
            {/* End Session button */}
            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to end this auction session?")) {
                  await adminEndAuction();
                }
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1"
            >
              <X size={13} /> END SESSION
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live Auction</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Club Zone Auction</h1>
          </div>
        </div>

        {/* Main auction area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Player Card — Left */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {auctionState.status === 'idle' ? (
                <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                  <div className="w-full max-w-[280px] aspect-[3/4] rounded-[2.5rem] bg-[#0f172a] border border-white/10 flex flex-col items-center justify-center gap-6 text-slate-500 mx-auto relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-amber-500/5" />
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                      <Gavel size={32} />
                    </div>
                    <div>
                      {timeLeft && timeLeft > 0 ? (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Scheduled Auction</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{formatTime(timeLeft)}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{config?.auctionSchedule || 'Starting soon'}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">SESSION IDLE</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed px-8">The auction admin has not revealed the first player card yet.</p>
                          {config?.auctionAdminId && !canOperateControls && (isAdmin || playerName === config.auctionAdminId) && (
                            <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                              <p className="text-[8px] font-black text-red-500 uppercase leading-tight">Verification Error: Assigned ID in Control Center does not match your current login.</p>
                            </div>
                          )}
                          {canOperateControls && (
                            <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                              <p className="text-[8px] font-black text-emerald-500 uppercase">Admin Mode Active</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {timeLeft && timeLeft > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Prepare your budget. The session begins automatically.
                    </motion.p>
                  )}
                </motion.div>
              ) : auctionState.currentPlayer ? (
                <motion.div
                  key={auctionState.currentPlayer.id}
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-full max-w-[220px] mx-auto"
                >
                  {/* Grade-enhanced player card */}
                  {(() => {
                    const p = currentPlayerData;
                    const grade = p ? getPlayerGrade(p) : 'E';
                    const gradeColor = GRADE_COLORS[grade];
                    const total = p ? p.win + p.loss + p.draw : 0;
                    const recentForm = p?.form?.slice(0, 5) || [];
                    return (
                      <div
                        className="relative rounded-3xl overflow-hidden shadow-2xl"
                        style={{ background: `linear-gradient(155deg, ${gradeColor}20 0%, #0f172a 55%, ${gradeColor}10 100%)`, border: `2px solid ${gradeColor}60` }}
                      >
                        {/* Grade glow */}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${gradeColor}25, transparent 70%)` }} />

                        {/* Grade badge */}
                        <div className="absolute top-3 left-3 z-20 w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-lg font-black" style={{ background: gradeColor }}>
                          <span className="text-black text-xl leading-none">{grade}</span>
                          <span className="text-black text-[8px] leading-none uppercase">Grade</span>
                        </div>

                        {/* OVR badge */}
                        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm rounded-xl px-2 py-1.5 text-center">
                          <p className="text-white font-black text-xl leading-none">{auctionState.currentPlayer!.ovr}</p>
                          <p className="text-slate-400 text-[8px] font-black uppercase">OVR</p>
                        </div>

                        {/* Player image */}
                        <div className="h-52 overflow-hidden flex items-center justify-center bg-white/5">
                          {auctionState.currentPlayer?.image ? (
                            <img src={auctionState.currentPlayer.image} alt={auctionState.currentPlayer.name} className="w-full h-full object-cover object-top" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
                          ) : (
                            <Users size={64} className="text-white/5" />
                          )}
                        </div>

                        {/* Name + previous club */}
                        <div className="px-4 pt-3 pb-2">
                          <h3 className="font-black text-white text-lg uppercase tracking-tight leading-tight truncate">{auctionState.currentPlayer!.name}</h3>
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: gradeColor }}>{auctionState.currentPlayer!.currentClubName || 'Free Agent'}</p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-4 gap-px mx-4 mb-4 bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                          {[
                            { label: 'W', value: p?.win ?? '-', color: '#22c55e' },
                            { label: 'L', value: p?.loss ?? '-', color: '#ef4444' },
                            { label: 'D', value: p?.draw ?? '-', color: '#f59e0b' },
                            { label: 'MP', value: total || '-', color: '#94a3b8' },
                          ].map(stat => (
                            <div key={stat.label} className="bg-black/30 py-2 text-center">
                              <p className="font-black text-base leading-none" style={{ color: stat.color }}>{stat.value}</p>
                              <p className="text-[8px] text-slate-500 font-black uppercase mt-0.5">{stat.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Form indicators */}
                        {recentForm.length > 0 && (
                          <div className="px-4 pb-2 flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-slate-600 uppercase mr-1">Form:</span>
                            {recentForm.map((r, i) => (
                              <div key={i} className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black ${r === 'W' ? 'bg-green-500/20 text-green-400' : r === 'L' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{r}</div>
                            ))}
                          </div>
                        )}

                        {/* Contract status if active */}
                        {config?.contractsActive && (
                          <div className="px-4 pb-4">
                            <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-xl">
                              <CheckCircle size={12} className="text-emerald-500" />
                              <span className="text-[10px] font-black text-white uppercase">Automatic Contract:</span>
                              <span className="text-[10px] font-black text-emerald-500 uppercase">{config.defaultContractAmount} {config.defaultContractType || 'matches'}</span>
                            </div>
                          </div>
                        )}

                        {/* Sold overlay */}
                        {auctionState.status === 'sold' && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <div className="bg-amber-500 text-black font-black text-2xl px-6 py-3 rounded-2xl uppercase italic rotate-[-12deg] shadow-xl">SOLD!</div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Admin controls below card REMOVED — now in sticky top bar */}
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Current bid */}
            <div className="bg-[#0a0a14] border border-amber-500/20 rounded-3xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Bid</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={auctionState.currentBid}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-baseline gap-3"
                >
                  <span className="text-5xl font-black text-white">{fmtCoins(auctionState.currentBid)}</span>
                  <span className="text-amber-400 font-black text-sm uppercase">coins</span>
                </motion.div>
              </AnimatePresence>
              {auctionState.leadingClubId && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-5 h-5 rounded-md" style={{ background: winningClub?.primaryColor }} />
                  <p className="text-sm font-black text-amber-400">{auctionState.leadingClubName} is leading</p>
                </div>
              )}
              <p className="text-[10px] text-slate-600 mt-2 font-bold">Min next bid: {fmtCoins(auctionState.minNextBid)}</p>
            </div>

            {/* Turn indicator + countdown */}
            <div className="bg-[#0a0a14] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bidding Order</p>
                {/* Per-turn countdown */}
                {turnTimeLeft !== null && auctionState.status === 'active' && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${
                    turnTimeLeft <= 15000 ? 'bg-red-500/20 text-red-400 animate-pulse' :
                    turnTimeLeft <= 45000 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    ⏱ {Math.ceil(turnTimeLeft / 1000)}s
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {auctionState.biddingOrder.map((clubId, idx) => {
                  const club = allClubs.find(c => c.id === clubId);
                  const isFolded = auctionState.foldedClubs.includes(clubId);
                  const isCurrentTurn = clubId === currentTurnClubId && auctionState.status === 'active';
                  return (
                    <div key={clubId} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${isCurrentTurn ? 'bg-amber-500/10 border border-amber-500/30' : isFolded ? 'opacity-30' : 'bg-white/3'}`}>
                      <div className="w-6 h-6 rounded-lg shrink-0" style={{ background: club?.primaryColor || '#374151' }} />
                      <p className={`text-sm font-black flex-1 ${isCurrentTurn ? 'text-amber-400' : 'text-slate-400'}`}>{club?.name || clubId}</p>
                      {isCurrentTurn && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /><span className="text-[9px] text-amber-500 font-black uppercase">Their Turn</span></div>}
                      {isFolded && <span className="text-[9px] text-slate-600 font-black uppercase">Folded</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My bid/fold buttons */}
            {isOwner && myClub && auctionState.status === 'active' && !iAmFolded && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={`Min: ${auctionState.minNextBid}`}
                    value={customBid}
                    onChange={e => setCustomBid(e.target.value)}
                    className="flex-1 w-full min-w-[80px] bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl text-sm font-black text-white focus:border-amber-500 outline-none placeholder:text-slate-500"
                  />
                  <button
                    disabled={!isMyTurn || isBidding || (myClub.budget < Math.max(auctionState.minNextBid, Number(customBid) || 0))}
                    onClick={async () => {
                      if (!isMyTurn || !myClub) return;
                      const parsed = Number(customBid);
                      const bidAmt = (!customBid || isNaN(parsed) || parsed <= 0) 
                        ? auctionState.minNextBid 
                        : Math.max(auctionState.minNextBid, parsed);
                        
                      setIsBidding(true); setError('');
                      try { await placeBid(myClub.id, myClub.name, bidAmt, auctionState); setCustomBid(''); }
                      catch (e: any) { setError(e.message); }
                      finally { setIsBidding(false); }
                    }}
                    className="flex-[2] py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm uppercase rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    <TrendingUp size={16} className="inline mr-1 sm:mr-2" />
                    {isBidding ? '...' : (
                      <span>
                        Bid {customBid && Number(customBid) > auctionState.minNextBid 
                          ? fmtCoins(Number(customBid)) 
                          : fmtCoins(auctionState.minNextBid)}
                      </span>
                    )}
                  </button>
                </div>
                <button
                  disabled={!isMyTurn || isBidding}
                  onClick={async () => {
                    if (!isMyTurn || !myClub) return;
                    try { await foldBid(myClub.id, auctionState); }
                    finally { setIsBidding(false); }
                  }}
                  className="py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-xs sm:text-sm uppercase rounded-2xl transition-all disabled:opacity-30"
                >
                  <X size={16} className="inline mr-1 sm:mr-2" />Fold
                </button>
              </div>
            )}

            {iAmFolded && <p className="text-center text-slate-600 text-sm font-bold py-4">You have folded this round.</p>}
            {myClub && myClub.budget < auctionState.minNextBid && !iAmFolded && auctionState.status === 'active' && (
              <p className="text-center text-red-400 text-xs font-bold py-2">Insufficient budget to bid (you have {fmtCoins(myClub.budget)})</p>
            )}
            {error && <p className="text-center text-red-400 text-xs font-bold">{error}</p>}

            {/* Budget display */}
            {myClub && (
              <div className="flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={14} />
                  <span className="text-xs font-black uppercase tracking-widest">My Budget</span>
                </div>
                <span className="text-white font-black text-lg">{fmtCoins(myClub.budget)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

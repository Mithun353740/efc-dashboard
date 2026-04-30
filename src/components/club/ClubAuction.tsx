import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Gavel, TrendingUp, Users, DollarSign, CheckCircle, X, SkipForward, Play } from 'lucide-react';
import { AuctionState, Club, Player, ClubSystemConfig } from '../../types';
import { getPlayerGrade, GRADE_COLORS, GRADE_BASE_PRICES } from '../../lib/utils';
import {
  subscribeToAuction, placeBid, foldBid,
  adminRevealCard, adminConfirmSold, adminSkipPlayer, adminEndAuction, adminStartAuction,
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
  config: ClubSystemConfig | null;
}

export default function ClubAuction({ myClub, allClubs, allPlayers, isAdmin, config }: ClubAuctionProps) {
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [prevBid, setPrevBid] = useState(0);
  const [isBidding, setIsBidding] = useState(false);
  const [error, setError] = useState('');

  // Admin setup
  const [showSetup, setShowSetup] = useState(false);
  const [setupBasePrice, setSetupBasePrice] = useState('500000');
  const [setupIncrement, setSetupIncrement] = useState('100000');
  const [revealPlayerId, setRevealPlayerId] = useState('');

  // Confetti state
  const [showSold, setShowSold] = useState(false);
  const prevStatusRef = useRef<string>('');

  // Subscribe to the live auction doc — 1 read per user total
  useEffect(() => {
    const unsub = subscribeToAuction((state) => {
      setAuctionState(prev => {
        // Detect status change to 'sold' for animation
        if (prev?.status !== 'sold' && state?.status === 'sold') {
          setShowSold(true);
          setTimeout(() => setShowSold(false), 3500);
        }
        setPrevBid(prev?.currentBid || 0);
        return state;
      });
    });
    return unsub;
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live Auction</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Club Zone Auction</h1>
          </div>
          </div>
        </div>

        {/* Main auction area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Player Card — Left */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {auctionState.status === 'idle' ? (
                <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <div className="w-48 h-64 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-600 mx-auto">
                    <Gavel size={40} />
                    <p className="text-xs font-black uppercase tracking-widest">Next Player<br/>Coming Soon</p>
                  </div>
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
                        <div className="h-52 overflow-hidden">
                          <img src={auctionState.currentPlayer!.image} alt={auctionState.currentPlayer!.name} className="w-full h-full object-cover object-top" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
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
                          <div className="px-4 pb-4 flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-slate-600 uppercase mr-1">Form:</span>
                            {recentForm.map((r, i) => (
                              <div key={i} className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black ${r === 'W' ? 'bg-green-500/20 text-green-400' : r === 'L' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{r}</div>
                            ))}
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

          </div>
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

            {/* Turn indicator */}
            <div className="bg-[#0a0a14] border border-white/10 rounded-3xl p-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Bidding Order</p>
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
            {myClub && !isAdmin && auctionState.status === 'active' && !iAmFolded && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={!isMyTurn || isBidding || (myClub.budget < auctionState.minNextBid)}
                  onClick={async () => {
                    if (!isMyTurn || !myClub) return;
                    setIsBidding(true); setError('');
                    try { await placeBid(myClub.id, myClub.name, auctionState.minNextBid, auctionState); }
                    catch (e: any) { setError(e.message); }
                    finally { setIsBidding(false); }
                  }}
                  className="py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm uppercase rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                >
                  <TrendingUp size={18} className="inline mr-2" />
                  {isBidding ? 'Bidding...' : `Bid ${fmtCoins(auctionState.minNextBid)}`}
                </button>
                <button
                  disabled={!isMyTurn || isBidding}
                  onClick={async () => {
                    if (!isMyTurn || !myClub) return;
                    setIsBidding(true);
                    try { await foldBid(myClub.id, auctionState); }
                    finally { setIsBidding(false); }
                  }}
                  className="py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-sm uppercase rounded-2xl transition-all disabled:opacity-30"
                >
                  <X size={18} className="inline mr-2" />Fold
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

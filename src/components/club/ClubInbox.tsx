import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mail, MailOpen, ArrowLeftRight, DollarSign, X, Check, RefreshCw, ChevronRight, Clock } from 'lucide-react';
import { ClubInboxMessage, TransferThread, Club, Player } from '../../types';
import {
  subscribeToInbox, markInboxRead, fetchTransferThreadsForClub,
  respondToProposal,
} from '../../lib/store';

// ─── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const MSG_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  proposal_received:        { icon: <Mail size={16} />,        color: '#8b5cf6' },
  proposal_accepted:        { icon: <Check size={16} />,       color: '#22c55e' },
  proposal_declined:        { icon: <X size={16} />,           color: '#ef4444' },
  counter_offer:            { icon: <RefreshCw size={16} />,   color: '#f59e0b' },
  release_clause_triggered: { icon: <DollarSign size={16} />,  color: '#f59e0b' },
  system:                   { icon: <Bell size={16} />,         color: '#64748b' },
  default:                  { icon: <Bell size={16} />,         color: '#64748b' },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ClubInboxProps {
  ownerId: string;
  myClub: Club;
  allClubs: Club[];
  allPlayers: Player[];
  onClose?: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClubInbox({ ownerId, myClub, allClubs, allPlayers, onClose }: ClubInboxProps) {
  const [messages, setMessages] = useState<ClubInboxMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeThread, setActiveThread] = useState<TransferThread | null>(null);
  const [threads, setThreads] = useState<TransferThread[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  // For counter-offer flow
  const [counterMode, setCounterMode] = useState<'money' | 'swap' | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [swapPlayerId, setSwapPlayerId] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const markedRef = useRef(false);

  // Real-time inbox subscription
  useEffect(() => {
    const unsub = subscribeToInbox(ownerId, (msgs, count) => {
      setMessages([...msgs].sort((a, b) => b.createdAt - a.createdAt));
      setUnreadCount(count);
    });
    return unsub;
  }, [ownerId]);

  // Mark all read when inbox is opened
  useEffect(() => {
    if (messages.length > 0 && unreadCount > 0 && !markedRef.current) {
      markedRef.current = true;
      markInboxRead(ownerId, messages);
    }
  }, [messages, unreadCount, ownerId]);

  const openThread = async (msg: ClubInboxMessage) => {
    if (!msg.threadId) return;
    setIsLoadingThread(true);
    setActionError('');
    try {
      const allThreads = await fetchTransferThreadsForClub(myClub.id);
      const found = allThreads.find(t => t.id === msg.threadId);
      setThreads(allThreads);
      setActiveThread(found || null);
    } catch { setActionError('Could not load thread.'); }
    finally { setIsLoadingThread(false); }
  };

  const handleRespond = async (action: 'accept' | 'decline' | 'counter') => {
    if (!activeThread) return;
    setActionLoading(true);
    setActionError('');
    try {
      const buyerClub = allClubs.find(c => c.id === activeThread.buyerClubId);
      const sellerClub = allClubs.find(c => c.id === activeThread.sellerClubId);
      const player = allPlayers.find(p => p.id === activeThread.playerId);

      if (action === 'counter') {
        if (!counterMode) { setActionError('Select a counter offer type.'); setActionLoading(false); return; }
        await respondToProposal(activeThread, 'counter', {
          type: counterMode,
          amount: counterMode === 'money' ? Number(counterAmount) : null,
          swapPlayerId: counterMode === 'swap' ? swapPlayerId : null,
          swapPlayerName: counterMode === 'swap' ? allPlayers.find(p => p.id === swapPlayerId)?.name || null : null,
          sentBy: myClub.id === activeThread.sellerClubId ? 'seller' : 'buyer',
          note: counterNote,
        });
        setCounterMode(null); setCounterAmount(''); setSwapPlayerId(''); setCounterNote('');
      } else {
        await respondToProposal(activeThread, action, undefined,
          buyerClub && sellerClub ? { buyerClub, sellerClub } : undefined,
          player
        );
      }
      setActiveThread(null);
    } catch (e: any) {
      setActionError(e.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const mySquad = allPlayers.filter(p => myClub.squadIds.includes(p.id));
  const isSeller = activeThread ? activeThread.sellerClubId === myClub.id : false;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Bell size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Inbox</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={18} /></button>}
      </div>

      {/* Thread detail view */}
      <AnimatePresence mode="wait">
        {activeThread && (
          <motion.div key="thread" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 z-10 bg-[#070712] flex flex-col">
            <div className="flex items-center gap-3 p-5 border-b border-white/10 shrink-0">
              <button onClick={() => setActiveThread(null)} className="p-2 text-slate-400 hover:text-white transition-colors -ml-1"><X size={16} /></button>
              <div>
                <p className="text-sm font-black text-white uppercase">{activeThread.playerName}</p>
                <p className="text-[10px] font-bold text-slate-500">{activeThread.buyerClubName} → {activeThread.sellerClubName}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Player card summary */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-14 h-14 rounded-xl overflow-hidden">
                  <img src={activeThread.playerImage} alt={activeThread.playerName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-white text-base">{activeThread.playerName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{activeThread.playerOvr} OVR</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${activeThread.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : activeThread.status === 'negotiating' ? 'bg-blue-500/10 text-blue-400' : activeThread.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {activeThread.status}
                  </span>
                </div>
              </div>

              {/* Current offer */}
              <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl">
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Current Offer</p>
                {activeThread.currentOffer.type === 'money' ? (
                  <p className="text-2xl font-black text-white">💰 {activeThread.currentOffer.amount?.toLocaleString()} coins</p>
                ) : (
                  <p className="text-lg font-black text-white flex items-center gap-2"><ArrowLeftRight size={18} className="text-amber-400" /> Swap: {activeThread.currentOffer.swapPlayerName}</p>
                )}
                {activeThread.currentOffer.note && <p className="text-xs text-slate-400 mt-2 italic">"{activeThread.currentOffer.note}"</p>}
                <p className="text-[9px] text-slate-500 mt-2">Sent by: {activeThread.currentOffer.sentBy === 'buyer' ? activeThread.buyerClubName : activeThread.sellerClubName}</p>
              </div>

              {/* Offer history */}
              {activeThread.history.length > 1 && (
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">History ({activeThread.history.length} offers)</p>
                  <div className="space-y-2">
                    {[...activeThread.history].reverse().slice(0, 5).map((h, i) => (
                      <div key={i} className="p-3 bg-white/3 rounded-xl border border-white/5 text-xs text-slate-400">
                        <span className="font-bold text-white">{h.sentBy === 'buyer' ? activeThread.buyerClubName : activeThread.sellerClubName}: </span>
                        {h.type === 'money' ? `${h.amount?.toLocaleString()} coins` : `Swap: ${h.swapPlayerName}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Counter offer builder */}
              {counterMode && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Counter Offer</p>
                  <div className="flex gap-2">
                    <button onClick={() => setCounterMode('money')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${counterMode === 'money' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}>💰 Money</button>
                    <button onClick={() => setCounterMode('swap')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${counterMode === 'swap' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}><ArrowLeftRight size={12} className="inline mr-1" />Swap</button>
                  </div>
                  {counterMode === 'money' && (
                    <input type="number" value={counterAmount} onChange={e => setCounterAmount(e.target.value)} placeholder="Amount in coins" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50" />
                  )}
                  {counterMode === 'swap' && (
                    <select value={swapPlayerId} onChange={e => setSwapPlayerId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50">
                      <option value="">Select player to offer...</option>
                      {mySquad.map(p => <option key={p.id} value={p.id}>{p.name} ({p.ovr} OVR)</option>)}
                    </select>
                  )}
                  <input value={counterNote} onChange={e => setCounterNote(e.target.value)} placeholder="Optional note..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-amber-500/50" />
                </motion.div>
              )}

              {actionError && <p className="text-red-400 text-xs font-bold text-center">{actionError}</p>}
            </div>

            {/* Action buttons — only show for pending/negotiating threads */}
            {(activeThread.status === 'pending' || activeThread.status === 'negotiating') && (
              <div className="p-5 border-t border-white/10 space-y-3 shrink-0">
                {!counterMode ? (
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleRespond('accept')} disabled={actionLoading} className="py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">✓ Accept</button>
                    <button onClick={() => handleRespond('decline')} disabled={actionLoading} className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">✕ Decline</button>
                    <button onClick={() => setCounterMode('money')} disabled={actionLoading} className="py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">↺ Counter</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleRespond('counter')} disabled={actionLoading} className="py-3 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">{actionLoading ? 'Sending...' : 'Send Counter'}</button>
                    <button onClick={() => setCounterMode(null)} disabled={actionLoading} className="py-3 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 mb-4"><MailOpen size={32} /></div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-tight">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1">Transfer proposals and system notifications will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map((msg) => {
              const meta = MSG_ICON[msg.type] || MSG_ICON.default;
              return (
                <button key={msg.id} onClick={() => openThread(msg)} className={`w-full text-left p-4 flex items-start gap-4 hover:bg-white/5 transition-colors ${!msg.read ? 'bg-violet-500/5' : ''}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${meta.color}15`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-snug ${!msg.read ? 'text-white' : 'text-slate-300'} line-clamp-2`}>{msg.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-slate-600" />
                      <span className="text-[10px] text-slate-600 font-bold">{timeAgo(msg.createdAt)}</span>
                      {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />}
                    </div>
                  </div>
                  {msg.threadId && <ChevronRight size={14} className="text-slate-600 shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

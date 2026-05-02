import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mail, MailOpen, X, Check, Clock, Shield, AlertCircle } from 'lucide-react';
import { PlayerInboxMessage, Player, Club } from '../../types';
import {
  subscribeToPlayerInbox, updatePlayerInboxStatus, respondToContractRenewal, fetchClubs
} from '../../lib/store';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

interface PlayerInboxProps {
  player: Player;
  onClose?: () => void;
}

export default function PlayerInbox({ player, onClose }: PlayerInboxProps) {
  const [messages, setMessages] = useState<PlayerInboxMessage[]>([]);
  const [activeMsg, setActiveMsg] = useState<PlayerInboxMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const unsub = subscribeToPlayerInbox(player.id, (msgs) => {
      setMessages([...msgs].sort((a, b) => b.createdAt - a.createdAt));
    });
    fetchClubs().then(setClubs).catch(console.error);
    return unsub;
  }, [player.id]);

  const handleOpenMsg = async (msg: PlayerInboxMessage) => {
    setActiveMsg(msg);
    if (msg.status === 'unread') {
      try {
        await updatePlayerInboxStatus(msg.id, 'read');
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  const handleContractResponse = async (accepted: boolean) => {
    if (!activeMsg) return;
    setLoading(true);
    setError('');
    try {
      await respondToContractRenewal(activeMsg, accepted);
      setActiveMsg(null);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#070712]">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Player Portal</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {unreadCount > 0 ? `${unreadCount} new messages` : 'Inbox up to date'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Message List */}
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 mb-4">
                <MailOpen size={32} />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-tight">No messages</p>
              <p className="text-xs text-slate-600 mt-1">Contract offers and club updates will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleOpenMsg(msg)}
                  className={`w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition-all relative ${msg.status === 'unread' ? 'bg-amber-500/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${msg.type === 'contract_renewal' ? 'bg-violet-500/10 text-violet-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {msg.type === 'contract_renewal' ? <Shield size={18} /> : <Bell size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-sm font-black truncate ${msg.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>
                        {msg.title}
                      </p>
                      <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">{msg.body}</p>
                    {msg.status !== 'unread' && msg.status !== 'read' && (
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        msg.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {msg.status}
                      </span>
                    )}
                  </div>
                  {msg.status === 'unread' && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail Overlay */}
        <AnimatePresence>
          {activeMsg && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 bg-[#0a0a1a] z-20 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0 bg-[#0f172a]">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveMsg(null)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Message View</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-black text-white mb-2 leading-tight uppercase italic">{activeMsg.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(activeMsg.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] leading-relaxed text-sm text-slate-300 font-medium">
                  {activeMsg.body}
                </div>

                {activeMsg.type === 'contract_renewal' && activeMsg.data && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-violet-500/5 border border-violet-500/20 rounded-2xl text-center">
                      <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-1">Bonus Amount</p>
                      <p className="text-xl font-black text-white">{activeMsg.data.salary?.toLocaleString() || '0'} VCC</p>
                    </div>
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center">
                      <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-xl font-black text-white">{activeMsg.data.duration || '0'} Matches</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                  </div>
                )}
              </div>

              {activeMsg.type === 'contract_renewal' && activeMsg.status === 'read' && (
                <div className="p-6 border-t border-white/10 grid grid-cols-2 gap-4 shrink-0 bg-[#0f172a]">
                  <button
                    onClick={() => handleContractResponse(false)}
                    disabled={loading}
                    className="py-4 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-red-500/20"
                  >
                    Reject Offer
                  </button>
                  <button
                    onClick={() => handleContractResponse(true)}
                    disabled={loading}
                    className="py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Accept Contract'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

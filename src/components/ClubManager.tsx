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
  calculatePlayerForm, calculateBasePrize, getFormGrade,
  sendPlayerInboxMessage
} from '../lib/store';
import { Club, ClubSystemConfig, MarketListing, MatchRecord, Player, ClubTournament, ClubFixture, AuctionState, ClubInboxMessage, PlayerInboxMessage } from '../types';
import { getPlayerGrade, GRADE_COLORS, isAdminUser, cn } from '../lib/utils';
import { Layers, ShoppingCart, Trophy, Calendar, Lock, Star, TrendingUp, Zap, ArrowLeft, Download, Users, DollarSign, Shield, Hammer, AlertCircle, Check, Bell, ArrowLeftRight, X, PenTool, LayoutDashboard, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClubAuction from './club/ClubAuction';
import ClubInbox from './club/ClubInbox';
import PlayerInbox from './club/PlayerInbox';

// â”€â”€â”€ Module-level cache (persists across route changes, cleared on write) â”€â”€â”€â”€â”€
let _clubCache: { clubs: Club[]; config: ClubSystemConfig | null; listings: MarketListing[] } | null = null;
export function invalidateClubCache() { _clubCache = null; }

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Club Logo component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ClubLogo({ club, size = 'md' }: { club: Club; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
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
    <div 
      className={`${dim} ${rounded} flex items-center justify-center font-black text-white shrink-0 shadow-lg`}
      style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}
    >
      <span className={`${text} tracking-tighter italic uppercase`}>{club.shortName}</span>
    </div>
  );
}

// â”€â”€â”€ FIFA Player Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FifaCard({ player, club, size = 'md' }: { player: Player; club?: Club; size?: 'sm' | 'md' | 'lg' }) {
  const form = getFormGrade(player.form || []);
  const formColor = { 'A': '#4ade80', 'B': '#84cc16', 'C': '#eab308', 'D': '#f97316', 'E': '#ef4444' }[form];
  // More compact dimensions for mobile
  const dims = size === 'lg' ? 'w-28 h-36 md:w-36 md:h-48 lg:w-44 lg:h-60' : size === 'md' ? 'w-20 h-28 md:w-28 md:h-36 lg:w-36 lg:h-48' : 'w-16 h-24 md:w-24 md:h-32 lg:w-28 lg:h-36';
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

      {/* Club logo/short name */}
      {club && (
        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-20">
          <ClubLogo club={club} size="xs" />
        </div>
      )}

      {/* Player image */}
      <div className="absolute inset-x-0 top-5 bottom-8 md:top-6 md:bottom-10 flex items-end justify-center">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover object-top"
            style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Users size={32} className="text-white/10" />
          </div>
        )}
      </div>

      {/* Name + stats */}
      <div className="absolute bottom-0 inset-x-0 p-1.5 md:p-2 z-20" style={{ background: `linear-gradient(to top, ${pri}90, transparent)` }}>
        <p className="text-white font-black text-[7px] md:text-[9px] leading-none truncate uppercase tracking-wide">{player.name?.split(' ')?.[0] || '??'}</p>
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

// â”€â”€â”€ Locked Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Club Stats Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Stat Circle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatCircle({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  const r = 28; const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{ color }}>
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] sm:text-xs font-black text-white">{value}</p>
        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest" style={{ color }}>{label}</p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Overview Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function OverviewTab({ myClub, squad, allClubs, config, matches, inboxUnread, setActiveTab, isOwner }: { 
  myClub: Club; squad: Player[]; allClubs: Club[]; config: ClubSystemConfig | null; matches: MatchRecord[];
  inboxUnread: number;
  setActiveTab: (t: 'overview' | 'squad' | 'market' | 'auction' | 'rankings' | 'tournaments' | 'inbox' | 'player_inbox') => void;
  isOwner: boolean;
}) {
    const avgOvr = squad.length ? Math.round(squad.reduce((a, p) => a + p.ovr, 0) / squad.length) : 0;
  
  // Filter for Club Zone matches (matches played in current season)
  const clubMatches = matches.filter(m => m.seasonId === config?.season).sort((a,b) => a.timestamp - b.timestamp);
  const myClubMatches = clubMatches.filter(m => m.p1Id === myClub.ownerId || m.p2Id === myClub.ownerId);
  const recentMatches = myClubMatches.slice(-5).reverse();
  
  // Calculate Form (W/D/L)
  const formRecord = recentMatches.map(m => {
    const isHome = m.p1Id === myClub.ownerId;
    const myScore = isHome ? m.p1Score : m.p2Score;
    const oppScore = isHome ? m.p2Score : m.p1Score;
    if (myScore > oppScore) return 'W';
    if (myScore < oppScore) return 'L';
    return 'D';
  });
  
  // Calculate Fitness
  // Start at 100%. Each recent match played drops fitness by 3-5%, recovered by 1-2% per match missed.
  let calculatedFitness = 100;
  myClubMatches.slice(-10).forEach(m => {
     calculatedFitness -= 4; 
  });
  // Simulate recovery (simple heuristic: if less than 10 matches, you are fit)
  calculatedFitness = Math.max(60, Math.min(100, 100 - (myClubMatches.length * 2) + Math.round(avgOvr * 0.1)));

  // Calculate Sharpness
  // Base is OVR. Boosted by wins and goals.
  let calculatedSharpness = Math.round(avgOvr * 0.85);
  let goalBonus = 0;
  recentMatches.forEach(m => {
    const isHome = m.p1Id === myClub.ownerId;
    goalBonus += isHome ? m.p1Score : m.p2Score;
  });
  calculatedSharpness = Math.min(100, calculatedSharpness + goalBonus + (formRecord.filter(x => x === 'W').length * 2));

  const fitness = calculatedFitness;
  const sharpness = calculatedSharpness;
  const morale = formRecord[0] === 'W' ? 95 : formRecord[0] === 'L' ? 45 : (squad.length >= 5 ? 82 : 55);

  const topScorers = [...squad].sort((a, b) => (b.goalsScored || 0) - (a.goalsScored || 0)).slice(0, 3);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* â”€â”€ ROW 1: Training Day Hero + Notifications â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">

        {/* Training Day Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10"
          style={{ background: 'linear-gradient(135deg, #1a2744 0%, #0f1729 50%, #0a0f1e 100%)' }}
        >
          {/* Yellow accent strip top */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${myClub.primaryColor}, ${myClub.secondaryColor})` }} />
          
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                  {todayStr}
                </p>
                <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">TRAINING DAY</h3>
              </div>
              <div className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest"
                style={{ background: myClub.primaryColor + '30', color: myClub.primaryColor, border: `1px solid ${myClub.primaryColor}40` }}>
                ACTIVE
              </div>
            </div>

            {/* Stat Circles Row */}
            <div className="flex items-center justify-around py-4 sm:py-6">
              <StatCircle label="FITNESS" value={fitness} color="#4ade80" icon={<Zap size={16} />} />
              <StatCircle label="SHARPNESS" value={sharpness} color="#f59e0b" icon={<Star size={16} />} />
              <StatCircle label="MORALE" value={morale} color="#8b5cf6" icon={<TrendingUp size={16} />} />
            </div>

            {/* Recent form */}
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mr-1">FORM</p>
              {recentMatches.length === 0 ? (
                <p className="text-[9px] text-slate-600 font-bold italic">No matches yet</p>
              ) : recentMatches.map((m, i) => {
                const win = (m.p1Id === myClub.ownerId && m.p1Score > m.p2Score) || (m.p2Id === myClub.ownerId && m.p2Score > m.p1Score);
                const draw = m.p1Score === m.p2Score;
                return (
                  <div key={i} className={cn('w-6 h-6 rounded flex items-center justify-center text-[9px] font-black',
                    win ? 'bg-emerald-500 text-black' : draw ? 'bg-amber-500 text-black' : 'bg-red-500/80 text-white')}>
                    {win ? 'W' : draw ? 'D' : 'L'}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right column: Notifications + Development stacked */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            onClick={() => setActiveTab('inbox')}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 cursor-pointer group transition-all hover:border-brand-purple/40"
            style={{ background: 'linear-gradient(135deg, #12142a, #0a0c1a)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 group-hover:scale-110 transition-transform">
                <Bell size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">NOTIFICATIONS</p>
                <p className="text-sm sm:text-base font-black text-white truncate">
                  {inboxUnread > 0 ? `${inboxUnread} NEW` : 'ALL CLEAR'}
                </p>
                <p className="text-[9px] font-bold text-slate-400 italic truncate">
                  {inboxUnread > 0 ? 'You have unread messages' : 'No pending communications'}
                </p>
              </div>
              {inboxUnread > 0 && (
                <div className="shrink-0 w-6 h-6 rounded-full bg-brand-purple text-white text-[10px] font-black flex items-center justify-center">
                  {inboxUnread > 9 ? '9+' : inboxUnread}
                </div>
              )}
            </div>
          </motion.div>

          {/* Development */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={() => setActiveTab('squad')}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 cursor-pointer group transition-all hover:border-amber-500/40"
            style={{ background: 'linear-gradient(135deg, #141a12, #0a0f0a)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">DEVELOPMENT</p>
                <p className="text-sm sm:text-base font-black text-white">SQUAD HUB</p>
                <p className="text-[9px] font-bold text-slate-400 italic truncate">Help players grow to their full potential</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* â”€â”€ ROW 2: Top Scorers + Weekly Schedule + Budget â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Top Scorers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6"
          style={{ background: 'linear-gradient(135deg, #1a1412, #0f0a08)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Trophy size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">TOP SCORERS</p>
              <p className="text-[9px] text-slate-600 font-bold italic">View current goal scorers stats</p>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {topScorers.length === 0 ? (
              <p className="text-[10px] text-slate-600 font-bold italic text-center py-4">No stats yet</p>
            ) : topScorers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={cn('w-4 text-[10px] font-black shrink-0', i === 0 ? 'text-amber-500' : 'text-slate-500')}>{i + 1}</span>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                  {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <Users size={12} className="text-white/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white uppercase truncate">{p.name}</p>
                  <p className="text-[8px] text-slate-500 font-bold">OVR {p.ovr}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-amber-500">{p.goalsScored || 0}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase">goals</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => setActiveTab('tournaments')}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 cursor-pointer group transition-all hover:border-amber-500/30"
          style={{ background: 'linear-gradient(135deg, #14121a, #0a0812)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">WEEKLY</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">SCHEDULE</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-[9px] font-black text-white uppercase">Current Season</p>
                  <p className="text-[8px] text-slate-500 font-bold italic truncate">{config?.season || 'Season 1'}</p>
                </div>
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[8px] font-black uppercase">ACTIVE</div>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-[9px] font-black text-white uppercase">Match Day</p>
                  <p className="text-[8px] text-slate-500 font-bold italic">View fixtures & results</p>
                </div>
                <ArrowLeft size={12} className="text-brand-purple rotate-180" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget / Transfers */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            onClick={() => setActiveTab('market')}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 cursor-pointer group transition-all"
            style={{ background: `linear-gradient(135deg, ${myClub.primaryColor}22, ${myClub.secondaryColor}15)`, border: `1px solid ${myClub.primaryColor}30` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-[60px] opacity-20"
              style={{ background: myClub.primaryColor }} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: myClub.primaryColor + '30', color: myClub.primaryColor }}>
                  <DollarSign size={16} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">TRANSFER HUB</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: myClub.primaryColor }}>BUDGET</p>
                <p className="text-2xl sm:text-3xl font-black text-white italic leading-none">{fmtBudget(myClub.budget || 0)}</p>
                <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase">VCC Available</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest" style={{ color: myClub.primaryColor }}>
                Open Market <ArrowLeft size={10} className="rotate-180" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* â”€â”€ ROW 3: Club Standings â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6"
        style={{ background: 'linear-gradient(135deg, #0f1118, #080b14)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white">STANDINGS</p>
          </div>
          <button onClick={() => setActiveTab('rankings')} className="text-[9px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
            Full Table â†’
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {allClubs.sort((a, b) => (b.managerRating || 0) - (a.managerRating || 0)).slice(0, 6).map((c, i) => (
            <div key={c.id} className={cn('flex items-center gap-3 p-2.5 rounded-xl border transition-all',
              c.id === myClub.id ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/3 hover:bg-white/5')}>
              <span className={cn('text-[10px] font-black w-4 shrink-0', i === 0 ? 'text-amber-500' : 'text-slate-500')}>{i + 1}</span>
              <ClubLogo club={c} size="xs" />
              <p className="text-[10px] font-black text-white uppercase truncate flex-1">{c.name}</p>
              <span className="text-[10px] font-black shrink-0" style={{ color: i === 0 ? '#f59e0b' : '#64748b' }}>{c.managerRating || 80}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}


// â”€â”€â”€ Main Component (shell + tab router) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


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
  // Auction live watcher â€” minimal: only subscribes when on auction tab
  const [auctionLive, setAuctionLive] = useState(false);
  // Shortlist modal state
  const [shortlistPlayer, setShortlistPlayer] = useState<Player | null>(null);
  const [proposalStep, setProposalStep] = useState<'shortlist' | 'offer' | 'renewal' | null>(null);
  const [offerType, setOfferType] = useState<'money' | 'swap'>('money');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerDuration, setOfferDuration] = useState('5');
  const [offerNote, setOfferNote] = useState('');
  const [releaseTarget, setReleaseTarget] = useState<Player | null>(null);
  const [releaseAmount, setReleaseAmount] = useState('');

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

  const load = async (force = false) => {
    setLoading(true);
    try {
      const [cfg, ls, cs] = await Promise.all([
        fetchClubConfig(force),
        fetchMarketListings(force),
        fetchClubs(force)
      ]);
      
      if (cfg) setConfig(cfg);
      setListings(ls);
      setClubs(cs || []);
      
      if (_clubCache) {
        _clubCache.config = cfg;
        _clubCache.listings = ls;
        _clubCache.clubs = cs || [];
      }
    } catch (err) {
      console.error('[ClubManager] Critical load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time clubs subscription
  useEffect(() => {
    // One-time load — fetchClubs uses module-level cache so subsequent
    // navigations cost 0 Firestore reads (no persistent listener needed).
    load();
  }, []);


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
  const isAdmin = isAdminUser();
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

  const tabs = useMemo(() => [
    { id: 'overview', label: 'HUB', icon: <LayoutDashboard size={14} /> },
    { id: 'squad', label: 'SQUAD', icon: <Users size={14} /> },
    { id: 'market', label: 'TRANSFERS', icon: <ShoppingCart size={14} /> },
    { id: 'auction', label: auctionLive ? 'ðŸ”´ LIVE AUCTION' : 'AUCTION', icon: <Hammer size={14} /> },
    { id: 'rankings', label: 'STANDINGS', icon: <Trophy size={14} /> },
    { id: 'tournaments', label: 'MATCH DAY', icon: <Calendar size={14} /> },
    { id: 'inbox', label: isOwner ? 'CLUB OFFICE' : 'MY INBOX', icon: <Bell size={14} />, badge: inboxUnread > 0 ? inboxUnread : null },
  ] as const, [isOwner, auctionLive, inboxUnread]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500/30 pb-10">

      {/* â”€â”€ FIFA MANAGER STYLE HEADER â”€â”€ */}
      <div className="sticky top-[60px] md:top-[80px] z-[50]"
        style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #060a14 100%)', borderBottom: `2px solid ${myClub?.primaryColor || '#8b5cf6'}40` }}>

        {/* Top strip: club logo + manager info + rating */}
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 border-b border-white/5">
          {/* Club Logo */}
          {myClub ? (
            <ClubLogo club={myClub} size="sm" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield size={16} className="text-slate-500" />
            </div>
          )}

          {/* Manager + Club Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {myPlayer?.image && <img src={myPlayer.image} className="w-5 h-5 rounded-full object-cover border border-white/20" alt="Manager" />}
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight truncate leading-none">
                {myPlayer?.name || 'MANAGER'}
              </p>
            </div>
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">
              {myClub?.name || 'No Club Assigned'}
            </p>
          </div>

          {/* OVR Rating Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded font-black text-sm sm:text-base text-white leading-none"
              style={{ background: myClub?.primaryColor || '#8b5cf6' }}>
              {myPlayer?.ovr || 'â€”'}
            </div>
            {/* Budget pill */}
            {(isOwner || isAdmin) && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <DollarSign size={10} className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-400">{fmtBudget(myClub?.budget || 0)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Nav */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-stretch min-w-max">
            {tabs.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all border-b-2',
                  activeTab === t.id
                    ? 'text-white border-current'
                    : auctionLive && t.id === 'auction'
                      ? 'text-red-400 border-transparent hover:border-red-400/40 animate-pulse'
                      : 'text-slate-500 border-transparent hover:text-white hover:border-white/20'
                )}
                style={activeTab === t.id ? { borderColor: myClub?.primaryColor || '#f59e0b', color: myClub?.primaryColor || '#f59e0b' } : {}}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[8px] font-black flex items-center justify-center">
                    {t.badge > 9 ? '9+' : t.badge}
                  </span>
                )}
              </button>
            ))}
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
          <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <div className="text-amber-500 font-black text-xs md:text-sm animate-pulse tracking-[0.3em] uppercase">Initializing Club Systems...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {myClub ? (
                  <OverviewTab 
                    myClub={myClub} 
                    squad={squad} 
                    allClubs={clubs} 
                    config={config} 
                    matches={matches} 
                    inboxUnread={inboxUnread}
                    setActiveTab={setActiveTab}
                    isOwner={isOwner}
                  />
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
                <ClubAuction myClub={myClub || null} allClubs={clubs} allPlayers={players} isAdmin={isAdmin} loggedInPlayerId={playerId} config={config} />
              </motion.div>
            )}
            {activeTab === 'inbox' && (
              <motion.div key="inbox" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative" style={{ minHeight: 600 }}>
                  <div className="flex flex-col h-full bg-[#0a0a14]">
                    {/* Owner's Club Inbox */}
                    {isOwner && myClub ? (
                      <div className="flex flex-col h-[600px] w-full">
                        <div className="p-6 bg-brand-purple/10 border-b border-brand-purple/20">
                          <h3 className="text-xs font-black text-brand-purple uppercase tracking-[0.3em] flex items-center gap-3">
                            <Shield size={16} /> OWNER INBOX: {myClub.name}
                          </h3>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <ClubInbox 
                            ownerId={playerId} 
                            myClub={myClub} 
                            allClubs={clubs} 
                            allPlayers={players} 
                            initialMessages={inboxMessages}
                            initialUnread={inboxUnread}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Personal Player Inbox - Only if not an owner */
                      <div className="flex flex-col h-[600px] w-full">
                        <div className="p-6 bg-amber-500/10 border-b border-amber-500/20">
                          <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <PenTool size={16} /> PLAYER PORTAL: {myPlayer?.name}
                          </h3>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          {myPlayer ? (
                            <PlayerInbox player={myPlayer} allClubs={clubs} />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                              <Search size={48} className="mb-4 opacity-20" />
                              <p className="text-xs font-black uppercase tracking-widest">No player profile linked</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                  onRenewContract={(p) => { setShortlistPlayer(p); setProposalStep('renewal'); setOfferAmount('500000'); setOfferDuration('5'); }}
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

        {/* â”€â”€â”€ Contract Renewal Modal â”€â”€â”€ */}
        <AnimatePresence>
          {proposalStep === 'renewal' && shortlistPlayer && myClub && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a14] border border-white/10 rounded-3xl p-8 z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em]">Contract Management</p>
                    <h3 className="text-xl font-black text-white italic truncate uppercase">Renew {shortlistPlayer.name}</h3>
                  </div>
                  <button onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bonus Amount (VCC)</label>
                    <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-brand-purple" placeholder="e.g. 500,000" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration (Matches)</label>
                    <select value={offerDuration} onChange={e => setOfferDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-brand-purple">
                      <option value="1">1 Match</option>
                      <option value="3">3 Matches</option>
                      <option value="5">5 Matches</option>
                      <option value="10">10 Matches</option>
                      <option value="25">FULL SEASON (25)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button onClick={() => { setProposalStep(null); setShortlistPlayer(null); }} className="py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button onClick={async () => {
                    if (!offerAmount || !offerDuration) return;
                    setLoading(true);
                    try {
                      await sendPlayerInboxMessage({
                        recipientId: shortlistPlayer.id,
                        senderId: playerId,
                        type: 'contract_renewal',
                        title: 'New Contract Offer Received',
                        body: `Your club owner, ${myClub.ownerName}, has offered you a new contract renewal for ${offerDuration} matches with a ${Number(offerAmount).toLocaleString()} VCC bonus.`,
                        data: { clubId: myClub.id, clubName: myClub.name, salary: Number(offerAmount), duration: Number(offerDuration) }
                      });
                      setMsg({ text: 'âœ… Renewal offer sent!', type: 'success' });
                      setProposalStep(null); setShortlistPlayer(null);
                    } catch(e: any) { setMsg({ text: 'âŒ ' + e.message, type: 'error' }); }
                    finally { setLoading(false); }
                  }} className="py-4 bg-brand-purple text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-purple/20 transition-all">Send Offer</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-5 text-center justify-center">
                    {shortlistPlayer.image ? (
                      <img src={shortlistPlayer.image} className="w-14 h-14 rounded-xl object-cover" alt={shortlistPlayer.name} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
                        <Users size={20} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-black text-white">{shortlistPlayer.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{shortlistPlayer.ovr} OVR Â· {sellerClub?.name || 'Unknown Club'}</p>
                      {(() => { const g = getPlayerGrade(shortlistPlayer); return <span className="text-xs font-black" style={{ color: GRADE_COLORS[g] }}>Grade {g}</span>; })()}
                    </div>
                  </div>

                  {/* Offer type toggle */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setOfferType('money')} className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${offerType === 'money' ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400'}`}>ðŸ’° Money</button>
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
                        setMsg({ text: `âœ… Proposal sent to ${sellerClub.name}!`, type: 'success' });
                        setProposalStep(null); setShortlistPlayer(null); setOfferAmount(''); setOfferNote('');
                      } catch(e: any) { setMsg({ text: 'âŒ ' + e.message, type: 'error' }); }
                    }} className="py-3 bg-violet-500 hover:bg-violet-400 text-white rounded-2xl text-[10px] font-black uppercase transition-all">Send Proposal</button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* â”€â”€â”€ Release Clause Modal â”€â”€â”€ */}
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
                          setMsg({ text: `âœ… Release clause set at ${Number(releaseAmount).toLocaleString()} coins.`, type: 'success' });
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
    <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 p-8 md:p-12 text-center shadow-2xl min-h-[400px] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-amber-500/10" />
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="w-20 h-20 bg-brand-purple/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-brand-purple/20 shadow-xl group hover:scale-110 transition-transform">
          <Layers size={36} className="text-brand-purple" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tighter italic uppercase">Club Hub Offline</h2>
        <p className="text-slate-400 font-bold text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
          You are not currently assigned to a club. Contact your league admin or refresh to see if your assignment has been updated.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all border border-white/5">Back to Home</Link>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">Refresh Status</button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Squad Tab (with Shortlist + Release Clause) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SquadTab({ myClub, squad, allClubs, allPlayers, isOwner, isAdmin, matches, onShortlistPlayer, onRenewContract, onSetReleaseClause, setMsg }: {
  myClub: Club; squad: Player[]; allClubs: Club[]; allPlayers: Player[];
  isOwner: boolean; isAdmin: boolean; matches: MatchRecord[];
  onShortlistPlayer: (p: Player) => void;
  onRenewContract: (p: Player) => void;
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
                <div className="relative h-40 overflow-hidden flex items-center justify-center bg-white/5">
                  {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover object-top" alt={p.name} style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
                  ) : (
                    <Users size={48} className="text-white/5" />
                  )}
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
                      {inShortlist ? 'â˜… Listed' : 'â˜† Shortlist'}
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
            const matchesLeft = p.clubContract?.amount || 0;

            return (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group relative">
                <div className="relative h-40 overflow-hidden flex items-center justify-center bg-white/5">
                  {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover object-top" alt={p.name} style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
                  ) : (
                    <Users size={48} className="text-white/5" />
                  )}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <div className="px-2 py-1 rounded-lg text-[10px] font-black" style={{ background: gradeColor, color: '#000' }}>{grade}</div>
                    <div className={cn("px-2 py-1 shadow-lg rounded-lg text-[9px] font-black uppercase tracking-widest", (matchesLeft > 2) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500 border border-red-500/30')}>
                      {matchesLeft} MATCHES LEFT
                    </div>
                  </div>
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
                  <div className="flex gap-2">
                    {isOwner && (
                      <>
                        <button onClick={() => onRenewContract(p)} className="flex-1 py-2.5 bg-brand-purple text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-purple/10 hover:bg-brand-purple/80 transition-all">
                          RENEW
                        </button>
                        <button onClick={() => onSetReleaseClause(p)} className={cn("px-3 py-2.5 rounded-xl transition-all border", p.releaseClause?.active ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white')}>
                          <Zap size={14} />
                        </button>
                      </>
                    )}
                  </div>
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
                  {p.image ? (
                    <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Users size={16} className="text-white/20" />
                    </div>
                  )}
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

// â”€â”€â”€ Transfer Market Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      flash('âœ… Player listed on market', 'success');
      setListingPlayerId(''); setListPrice('');
      onRefresh();
    } catch (e: any) { flash('âŒ ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const handleDelist = async (l: MarketListing) => {
    setBusy(true);
    try { await delistPlayerFromMarket(l.id, l.playerId); flash('âœ… Player delisted', 'success'); onRefresh(); }
    catch (e: any) { flash('âŒ ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const handleBuy = async (l: MarketListing) => {
    if (!myClub) return;
    const seller = clubs.find(c => c.id === l.fromClubId);
    if (!seller) return;
    setBusy(true);
    try { await purchasePlayer(l, myClub, seller); flash(`âœ… ${l.playerName} signed!`, 'success'); onRefresh(); }
    catch (e: any) { flash('âŒ ' + e.message, 'error'); }
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
        {isOwner && myClub && <div className="md:ml-auto text-left md:text-right border-t md:border-t-0 border-white/5 pt-3 md:pt-0"><p className="text-[9px] font-black text-slate-500 uppercase">My Budget</p><p className="text-xl md:text-2xl font-black text-amber-400">VCC {fmtBudget(myClub.budget)}</p></div>}
      </div>

      {isOwner && windowOpen && mySquad.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-2xl p-5 md:p-6">
          <h3 className="text-[10px] md:text-sm font-black tracking-widest text-slate-300 uppercase mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-400" /> LIST A PLAYER</h3>
          <div className="flex flex-col xl:flex-row gap-3 md:gap-4">
            <select value={listingPlayerId} onChange={e => setListingPlayerId(e.target.value)} className="flex-1 bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl text-xs font-bold text-white focus:border-amber-500 outline-none">
              <option value="">Select player to list...</option>
              {mySquad.map(p => <option key={p.id} value={p.id} className="bg-[#0f172a]">{p.name} â€” OVR {p.ovr}</option>)}
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
                  <div className="relative shrink-0 w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center">
                    {l.playerImage ? (
                      <img src={l.playerImage} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    ) : (
                      <Users size={20} className="text-white/20" />
                    )}
                    <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-lg" style={{ background: ovrColor(l.playerOvr) }}>{l.playerOvr}</div>
                      <div className="w-6 h-4 rounded flex items-center justify-center text-[7px] font-black text-black shadow-lg" style={{ background: formColor }}>{form}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm truncate">{l.playerName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {fromClub && <ClubLogo club={fromClub} size="xs" />}
                      <p className="text-[9px] font-bold text-slate-400 truncate">{l.fromClubName}</p>
                    </div>
                    <p className="text-amber-400 font-black text-sm mt-1">VCC {fmtBudget(l.price)}</p>
                  </div>
                  {isOwner && (isMine ? (
                    <button onClick={() => handleDelist(l)} disabled={busy} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-black tracking-widest transition-all disabled:opacity-50">DELIST</button>
                  ) : (
                    <button onClick={() => handleBuy(l)} disabled={busy || !windowOpen || !myClub || !canAfford} className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black tracking-widest transition-all disabled:opacity-50">
                      {!windowOpen ? 'CLOSED' : !myClub ? 'NO CLUB' : !canAfford ? 'NO FUNDS' : 'BUY'}
                    </button>
                  ))}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Rankings Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
            Rankings based exclusively on club-season matches â€” completely separate from global stats.
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
                      <ClubLogo club={row.club} size="sm" />
                      <div>
                        <p className={`text-xs font-black ${myClub?.id === row.club.id ? 'text-amber-400' : 'text-white'}`}>{row.club.name}</p>
                        <p className="text-[8px] text-slate-500">{row.club.ownerName || 'â€”'}</p>
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
                        ? <span className="text-[8px] text-slate-600 font-bold">â€”</span>
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


// â”€â”€â”€ Tournaments Hub â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      if (!config?.season) {
        setLoading(false);
        return;
      }
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
      setMsg({ text: 'âœ… Lineup submitted', type: 'success' });
    } catch (e: any) {
      setMsg({ text: 'âŒ ' + e.message, type: 'error' });
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
      setMsg({ text: 'âœ… Matchups locked!', type: 'success' });
    } catch (e: any) {
      setMsg({ text: 'âŒ ' + e.message, type: 'error' });
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

  // MY MATCHDAY â€” personalized to my club only
  const myMatchday = myClub ? tFix.filter(f => f.homeClubId === myClub.id || f.awayClubId === myClub.id) : tFix;

  // Compute standings from completed fixtures
  const standingsMap: Record<string, { clubId: string; cname: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }> = {};
  const ensureRow = (id: string, name: string) => { if (!standingsMap[id]) standingsMap[id] = { clubId: id, cname: name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }; };
  tFix.forEach(f => { ensureRow(f.homeClubId, f.homeClubName); ensureRow(f.awayClubId, f.awayClubName); });
  tFix.filter(f => f.status === 'completed').forEach(f => {
    const hg = f.subMatches.reduce((s, m) => s + (m.p1Score || 0), 0);
    const ag = f.subMatches.reduce((s, m) => s + (m.p2Score || 0), 0);
    standingsMap[f.homeClubId].p++; standingsMap[f.awayClubId].p++;
    standingsMap[f.homeClubId].gf += hg; standingsMap[f.homeClubId].ga += ag;
    standingsMap[f.awayClubId].gf += ag; standingsMap[f.awayClubId].ga += hg;
    if (hg > ag) { standingsMap[f.homeClubId].w++; standingsMap[f.homeClubId].pts += 3; standingsMap[f.awayClubId].l++; }
    else if (ag > hg) { standingsMap[f.awayClubId].w++; standingsMap[f.awayClubId].pts += 3; standingsMap[f.homeClubId].l++; }
    else { standingsMap[f.homeClubId].d++; standingsMap[f.homeClubId].pts++; standingsMap[f.awayClubId].d++; standingsMap[f.awayClubId].pts++; }
  });
  const standings = Object.values(standingsMap).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

  const [tDetailTab, setTDetailTab] = useState<'matchday' | 'table' | 'all'>('matchday');

  // Inline fixture card (uses outer state setters)
  const renderFixtureCard = (f: ClubFixture) => {
    const isMeHome = myClub?.id === f.homeClubId;
    const isMeAway = myClub?.id === f.awayClubId;
    const isParticipant = isMeHome || isMeAway;
    const myLu = isMeHome ? f.homeLineupIds : f.awayLineupIds;
    const submitted = myLu.length === f.lineupSize;
    const hc = clubs.find(c => c.id === f.homeClubId);
    const ac = clubs.find(c => c.id === f.awayClubId);
    const hg = f.subMatches.reduce((s, m) => s + (m.p1Score || 0), 0);
    const ag = f.subMatches.reduce((s, m) => s + (m.p2Score || 0), 0);
    return (
      <div key={f.id} className={cn('bg-[#0f172a] border rounded-[1.5rem] overflow-hidden transition-all', isParticipant ? 'border-amber-500/30' : 'border-white/10 hover:border-white/20')}>
        {/* Status bar */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <span className={cn('text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase',
            f.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
            f.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
            f.status === 'completed' ? 'bg-slate-500/20 text-slate-400' : 'bg-blue-500/20 text-blue-400'
          )}>{f.status.replace('_', ' ')}</span>
          <span className="text-[8px] font-black text-slate-600 uppercase">MD{f.matchday} Â· {f.lineupSize}v{f.lineupSize}</span>
        </div>
        {/* Teams */}
        <div className="px-4 py-5 flex items-center gap-3">
          <div className="flex-1 flex flex-col items-center gap-2">
            {hc?.logo ? <img src={hc.logo} className="w-12 h-12 object-contain" alt="" /> : <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs text-white" style={{ background: `linear-gradient(135deg,${hc?.primaryColor||'#333'},${hc?.secondaryColor||'#111'})` }}>{hc?.shortName}</div>}
            <p className="text-[9px] font-black text-white uppercase text-center truncate w-full">{f.homeClubName}</p>
          </div>
          <div className="flex flex-col items-center shrink-0 px-2">
            {f.status === 'completed'
              ? <span className="text-xl font-black text-white">{hg} <span className="text-slate-600">-</span> {ag}</span>
              : <span className="text-sm font-black text-slate-600 italic">VS</span>}
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            {ac?.logo ? <img src={ac.logo} className="w-12 h-12 object-contain" alt="" /> : <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs text-white" style={{ background: `linear-gradient(135deg,${ac?.primaryColor||'#333'},${ac?.secondaryColor||'#111'})` }}>{ac?.shortName}</div>}
            <p className="text-[9px] font-black text-white uppercase text-center truncate w-full">{f.awayClubName}</p>
          </div>
        </div>
        {/* Action area for participants */}
        {isParticipant && f.status !== 'completed' && tourney?.status === 'active' && (
          <div className="px-4 pb-4">
            {(f.status === 'scheduled' || f.status === 'lineups_pending') && !submitted ? (
              selFixtureId === f.id ? (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-amber-500 uppercase text-center">SELECT {f.lineupSize} PLAYERS</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {squad.map(p => { const sel = lineupSelection.includes(p.id); return <button key={p.id} onClick={() => handleSelectLineup(p.id, f.lineupSize)} className={cn('px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase border', sel ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10')}>{p.name?.split(' ')?.[0]} {sel && 'âœ“'}</button>; })}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setSelFixtureId(null)} className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-slate-400">CANCEL</button>
                    <button onClick={() => handleSubmitLineup(f)} disabled={lineupSelection.length !== f.lineupSize || submitting} className="flex-1 py-2 bg-amber-500 disabled:opacity-50 rounded-xl text-[9px] font-black uppercase text-black">SUBMIT</button>
                  </div>
                </div>
              ) : <button onClick={() => { setSelFixtureId(f.id); setLineupSelection([]); }} className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 font-black text-[9px] rounded-xl uppercase tracking-widest">PREPARE LINEUP</button>
            ) : f.status === 'matchups_pending' && isMeHome ? (
              selFixtureId === f.id ? (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-purple-400 uppercase text-center">HOME ADVANTAGE â€” PAIR MATCHUPS</p>
                  {f.awayLineupIds.map(aId => { const an = players.find(p => p.id === aId)?.name?.split(' ')?.[0] || '??'; return <div key={aId} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl"><span className="text-[8px] font-black text-slate-400 w-14 text-right truncate">{an}</span><span className="text-[7px] text-slate-600 shrink-0">VS</span><select value={matchupSelection[aId]||''} onChange={e => setMatchupSelection({...matchupSelection,[aId]:e.target.value})} className="flex-1 bg-white/10 p-1.5 rounded-lg text-[8px] font-black text-white outline-none"><option value="">Pick...</option>{f.homeLineupIds.map(hId => { const taken = Object.keys(matchupSelection).find(k => matchupSelection[k]===hId&&k!==aId); const hp = players.find(x => x.id===hId); return <option key={hId} value={hId} disabled={!!taken}>{hp?.name?.split(' ')?.[0]} {taken?'(taken)':''}</option>; })}</select></div>; })}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setSelFixtureId(null)} className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-slate-400">CANCEL</button>
                    <button onClick={() => handleSubmitMatchups(f)} disabled={Object.keys(matchupSelection).length!==f.awayLineupIds.length||submitting} className="flex-1 py-2 bg-purple-500 disabled:opacity-50 rounded-xl text-[9px] font-black uppercase text-white">LOCK</button>
                  </div>
                </div>
              ) : <button onClick={() => { setSelFixtureId(f.id); setMatchupSelection({}); }} className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-black text-[9px] rounded-xl uppercase tracking-widest">MANAGE HOME ADVANTAGE</button>
            ) : <p className="text-center text-[8px] font-black text-slate-600 uppercase">{submitted ? 'Lineup submitted â€” awaiting opponent' : f.status==='matchups_pending'&&isMeAway ? 'Home team pairing...' : 'Waiting...'}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Tournament Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 p-5 md:p-7">
          <button onClick={() => setSelectedTId(null)} className="flex items-center gap-2 text-[9px] font-black text-slate-500 hover:text-amber-400 uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={12} /> ALL TOURNAMENTS
          </button>
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-none truncate">{tourney.name}</h3>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{tFix.length} FIXTURES Â· {standings.length} CLUBS</p>
            </div>
            <span className={cn('text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0', tourney.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>{tourney.status}</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
        {([
          { id: 'matchday' as const, label: myClub ? 'MY MATCHDAY' : 'MATCHDAY' },
          { id: 'table' as const, label: 'TABLE' },
          { id: 'all' as const, label: 'ALL FIXTURES' },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setTDetailTab(tab.id)}
            className={cn('flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', tDetailTab === tab.id ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* MY MATCHDAY */}
      {tDetailTab === 'matchday' && (
        myMatchday.length === 0
          ? <div className="py-16 text-center bg-white/5 border border-white/10 rounded-[1.5rem]"><Calendar size={32} className="text-slate-600 mx-auto mb-3" /><p className="text-slate-500 font-black uppercase text-xs">{myClub ? `${myClub.name} has no fixtures in this tournament yet` : 'No fixtures'}</p></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{myMatchday.map(f => renderFixtureCard(f))}</div>
      )}

      {/* TABLE */}
      {tDetailTab === 'table' && (
        <div className="bg-[#0f172a] border border-white/10 rounded-[1.5rem] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
            <Trophy size={13} className="text-amber-500" />
            <p className="text-[9px] font-black text-white uppercase tracking-widest">LEAGUE STANDINGS</p>
          </div>
          {standings.length === 0
            ? <div className="py-12 text-center text-slate-600 font-black uppercase text-xs">No completed fixtures yet â€” table will populate as results come in</div>
            : <div className="overflow-x-auto">
                <table className="w-full text-[8px] font-black uppercase">
                  <thead><tr className="text-slate-600 border-b border-white/5">
                    <th className="text-left px-3 py-2 w-6">#</th>
                    <th className="text-left px-3 py-2">Club</th>
                    <th className="px-2 py-2 text-center">P</th>
                    <th className="px-2 py-2 text-center">W</th>
                    <th className="px-2 py-2 text-center">D</th>
                    <th className="px-2 py-2 text-center">L</th>
                    <th className="px-2 py-2 text-center">GD</th>
                    <th className="px-2 py-2 text-center text-amber-500">PTS</th>
                  </tr></thead>
                  <tbody>
                    {standings.map((row, i) => {
                      const rc = clubs.find(c => c.id === row.clubId);
                      const isMe = myClub?.id === row.clubId;
                      return (
                        <tr key={row.clubId} className={cn('border-b border-white/5 transition-colors', isMe ? 'bg-amber-500/5' : 'hover:bg-white/[0.02]')}>
                          <td className={cn('px-3 py-3 font-black', i === 0 ? 'text-amber-500' : 'text-slate-600')}>{i + 1}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {rc?.logo ? <img src={rc.logo} className="w-5 h-5 object-contain rounded" alt="" /> : <div className="w-5 h-5 rounded flex items-center justify-center text-[6px] font-black text-white" style={{ background: rc?.primaryColor || '#333' }}>{rc?.shortName?.slice(0, 2)}</div>}
                              <span className={isMe ? 'text-amber-400' : 'text-white'}>{row.cname}</span>
                              {isMe && <span className="text-[6px] bg-amber-500/20 text-amber-500 px-1 rounded">YOU</span>}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-center text-slate-400">{row.p}</td>
                          <td className="px-2 py-3 text-center text-emerald-400">{row.w}</td>
                          <td className="px-2 py-3 text-center text-amber-400">{row.d}</td>
                          <td className="px-2 py-3 text-center text-red-400">{row.l}</td>
                          <td className={cn('px-2 py-3 text-center', (row.gf - row.ga) >= 0 ? 'text-emerald-400' : 'text-red-400')}>{row.gf - row.ga >= 0 ? '+' : ''}{row.gf - row.ga}</td>
                          <td className="px-2 py-3 text-center text-amber-500 text-xs">{row.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* ALL FIXTURES */}
      {tDetailTab === 'all' && (
        tFix.length === 0
          ? <div className="py-16 text-center bg-white/5 border border-white/10 rounded-[1.5rem]"><Calendar size={32} className="text-slate-600 mx-auto mb-3" /><p className="text-slate-500 font-black uppercase text-xs">No fixtures scheduled yet</p></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{tFix.map(f => renderFixtureCard(f))}</div>
      )}
    </div>
  );
}

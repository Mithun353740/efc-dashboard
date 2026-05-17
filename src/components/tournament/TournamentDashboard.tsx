import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tournament, Team, Fixture } from '../../types';
import { saveTournament } from '../../lib/store';
import { FixturesTab } from './FixturesTab';
import { StandingsTab } from './StandingsTab';
import { TeamsTab } from './TeamsTab';
import { BracketView } from './BracketView';
import { StatsTab } from './StatsTab';
import { OverviewTab } from './OverviewTab';
import { FantasyStandings } from './FantasyStandings';
import { MatchDayCountdown } from './MatchDayCountdown';
import TournamentHistory from '../TournamentHistory';
import { 
  Trophy, BarChart2, ListOrdered, Settings, ArrowLeft, Archive, 
  Trash2, Users, GitBranch, Goal, LayoutDashboard, History, 
  ChevronRight, ShieldCheck, Star, X, CalendarDays, MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TournamentDashboardProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onBack: () => void;
  onDeleted: () => void;
}

type Tab = 'dashboard' | 'fixtures' | 'standings' | 'fantasy' | 'scorers' | 'teams' | 'bracket' | 'history' | 'settings';

export function TournamentDashboard({ tournament: initialTournament, isAdmin, onBack, onDeleted }: TournamentDashboardProps) {
  const [tournament, setTournament] = useState<Tournament>(initialTournament);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [editStartDate, setEditStartDate] = useState(initialTournament.startingDate || '');
  const [editMaxTeams, setEditMaxTeams] = useState(initialTournament.maxTeams ? String(initialTournament.maxTeams) : '');
  const [editMatchDayStart, setEditMatchDayStart] = useState(initialTournament.matchDayStart || '');
  const [editMatchDayEnd, setEditMatchDayEnd] = useState(initialTournament.matchDayEnd || '');
  const [editName, setEditName] = useState(initialTournament.name);
  const [editLogo, setEditLogo] = useState(initialTournament.logo || '');
  const [dateSaveMsg, setDateSaveMsg] = useState('');

  const handleUpdate = (updated: Tournament) => setTournament(updated);

  const handleArchive = async () => {
    setIsSaving(true);
    const updated: Tournament = { ...tournament, archived: !tournament.archived };
    await saveTournament(updated);
    setTournament(updated);
    setIsSaving(false);
  };

  const handleSaveDateSettings = async () => {
    setIsSaving(true);
    setDateSaveMsg('');
    const updated: any = { ...tournament, name: editName };
    if (editLogo) updated.logo = editLogo; else delete updated.logo;
    if (editStartDate) updated.startingDate = editStartDate; else delete updated.startingDate;
    
    if (editMaxTeams && !isNaN(Number(editMaxTeams)) && Number(editMaxTeams) > 1) {
      updated.maxTeams = Number(editMaxTeams);
    } else {
      delete updated.maxTeams;
    }
    
    if (editMatchDayStart) updated.matchDayStart = editMatchDayStart; else delete updated.matchDayStart;
    if (editMatchDayEnd) updated.matchDayEnd = editMatchDayEnd; else delete updated.matchDayEnd;

    
    try {
      await saveTournament(updated);
      setTournament(updated);
      setDateSaveMsg('✅ Saved');
      setTimeout(() => setDateSaveMsg(''), 2500);
    } catch (e: any) {
      console.error('Error saving tournament:', e);
      setDateSaveMsg('❌ ' + (e.message || 'Save failed'));
      setTimeout(() => setDateSaveMsg(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const isKnockout = tournament.type === 'knockout' || tournament.type === 'groups';

  const menuItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'fixtures', label: 'Fixtures', icon: <ListOrdered size={18} /> },
    { id: 'standings', label: 'Standings', icon: <BarChart2 size={18} /> },
    { id: 'fantasy', label: 'Fantasy Standings', icon: <Star size={18} /> },
    { id: 'scorers', label: 'Top Scorers', icon: <Goal size={18} /> },
    { id: 'teams', label: 'Teams', icon: <Users size={18} /> },
    ...(isKnockout ? [{ id: 'bracket' as Tab, label: 'Bracket', icon: <GitBranch size={18} /> }] : []),
    { id: 'history', label: 'League History', icon: <History size={18} /> },
    ...(isAdmin ? [{ id: 'settings' as Tab, label: 'Account Settings', icon: <Settings size={18} /> }] : []),
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050508] text-white">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#1e1e32] sticky top-0 bg-[#0a0a12] z-[60]">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Trophy size={13} />
            </div>
            <div>
              <div className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none">Tournament</div>
              <div className="font-black text-[11px] uppercase tracking-tight text-white truncate max-w-[180px] leading-tight mt-0.5">{tournament.name}</div>
            </div>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setActiveTab('settings'); setShowMoreMenu(false); }}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}
          >
            <Settings size={17} />
          </button>
        )}
      </div>

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex lg:relative lg:w-72 border-r border-[#1e1e32] bg-[#0a0a12] flex-col h-screen lg:h-screen lg:sticky lg:top-0 z-50">
        {/* Logo Section */}
        <div className="p-8 border-b border-[#1e1e32] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tighter uppercase leading-none">KickOff</h1>
              <p className="text-[8px] font-black tracking-widest text-slate-500 uppercase mt-1">Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest mb-6"
          >
            <ArrowLeft size={16} /> All Tournaments
          </button>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                activeTab === item.id 
                  ? "bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn("transition-colors", activeTab === item.id ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400")}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {activeTab === item.id && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </button>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-[#1e1e32]">
          <div className="bg-[#050508] border border-[#1e1e32] rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
               <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
               </div>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-4 flex items-center justify-between px-2">
               <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Admin Access</div>
               <ShieldCheck size={14} className="text-indigo-400" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Navbar — desktop only (mobile uses top bar + bottom tab nav) */}
        <header className="hidden lg:flex h-24 border-b border-[#1e1e32] bg-[#050508]/50 backdrop-blur-xl items-center justify-between px-10 sticky top-0 z-[40]">
          <div className="flex items-center gap-4">
            {/* Countdown — only shown on Dashboard tab */}
            {activeTab === 'dashboard' && (
              <MatchDayCountdown tournament={tournament} />
            )}
            <div className="flex flex-col">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] opacity-60">
                Tournaments <span className="mx-2 text-slate-700">/</span> {tournament.name}
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('scorers', 'Top Scorers').toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Quick Nav in Header from Screenshot */}
             <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-xl p-1 flex">
                {['dashboard', 'fixtures', 'standings', 'scorers'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as Tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto no-scrollbar pb-24 lg:pb-10">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
                {activeTab === 'dashboard' && <OverviewTab tournament={tournament} />}
                {activeTab === 'fixtures' && <FixturesTab tournament={tournament} isAdmin={isAdmin} onUpdate={handleUpdate} />}
                {activeTab === 'standings' && <StandingsTab tournament={tournament} />}
                {activeTab === 'fantasy' && <FantasyStandings tournament={tournament} />}
                {activeTab === 'teams' && <TeamsTab tournament={tournament} isAdmin={isAdmin} onUpdate={handleUpdate} />}
                {activeTab === 'scorers' && <StatsTab tournament={tournament} />}
                {activeTab === 'bracket' && <BracketView tournament={tournament} />}
                {activeTab === 'history' && <TournamentHistory onOpenTournament={(id) => {
                  if(id !== tournament.id) {
                    onBack(); // Just return to list for now or we could implement jumping
                  }
                }} />}
                
                {activeTab === 'settings' && isAdmin && (
                  <div className="max-w-2xl space-y-8">
                     <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-8 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">System Online</h3>
                          <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Tournament Engine Fully Operational</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                          <Trophy className="text-white" size={24} />
                        </div>
                     </div>

                     {/* Starting Date, Match Day Window & Max Teams */}
                     <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8 space-y-6">
                       <div className="flex items-center gap-3 mb-2">
                         <CalendarDays size={18} className="text-indigo-400" />
                         <h4 className="font-black text-white uppercase tracking-tighter">Basic Settings</h4>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tournament Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logo URL (Optional)</label>
                            <input
                              type="text"
                              value={editLogo}
                              onChange={e => setEditLogo(e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all"
                            />
                          </div>
                       </div>

                       <div className="flex items-center gap-3 mb-2 pt-4">
                         <ShieldCheck size={18} className="text-indigo-400" />
                         <h4 className="font-black text-white uppercase tracking-tighter">Registration Settings</h4>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Starting Date</label>
                           <input
                             type="date"
                             value={editStartDate}
                             onChange={e => setEditStartDate(e.target.value)}
                             className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all [color-scheme:dark]"
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Max Registration Slots</label>
                           <input
                             type="number"
                             value={editMaxTeams}
                             onChange={e => setEditMaxTeams(e.target.value)}
                             min="2" max="64"
                             placeholder="No limit"
                             className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all"
                           />
                         </div>
                       </div>

                       {/* Match Day Window */}
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                           Match Day Window
                         </label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Starts</label>
                             <input
                               type="datetime-local"
                               value={editMatchDayStart}
                               onChange={e => setEditMatchDayStart(e.target.value)}
                               className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-amber-500 focus:outline-none transition-all [color-scheme:dark]"
                             />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Ends</label>
                             <input
                               type="datetime-local"
                               value={editMatchDayEnd}
                               onChange={e => setEditMatchDayEnd(e.target.value)}
                               className="w-full bg-[#050508] border border-[#1e1e32] rounded-xl px-4 py-3 text-white font-bold focus:border-amber-500 focus:outline-none transition-all [color-scheme:dark]"
                             />
                           </div>
                         </div>
                         <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                           Registration closes permanently once match day starts.
                         </p>
                       </div>

                       <div className="flex items-center gap-4">
                         <button
                           onClick={handleSaveDateSettings}
                           disabled={isSaving}
                           className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                         >
                           {isSaving ? 'Saving...' : 'Save Settings'}
                         </button>
                         {dateSaveMsg && <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{dateSaveMsg}</span>}
                       </div>
                     </div>

                     <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center justify-between p-6 bg-[#050508] border border-[#1e1e32] rounded-2xl">
                           <div>
                              <div className="font-black text-white uppercase tracking-tight mb-1">Archive Tournament</div>
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Move to history and disable edits</div>
                           </div>
                           <button onClick={handleArchive} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                              {tournament.archived ? 'Restore' : 'Archive'}
                           </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                           <div>
                              <div className="font-black text-red-400 uppercase tracking-tight mb-1">Delete Tournament</div>
                              <div className="text-[10px] font-black text-red-500/50 uppercase tracking-widest text-opacity-50">Permanently erase all records</div>
                           </div>
                           <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all">
                              Delete
                           </button>
                        </div>
                     </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* ── Mobile Bottom Tab Bar ──────────────────────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[80] bg-[#0a0a12]/95 backdrop-blur-xl border-t border-[#1e1e32] flex items-stretch h-16 safe-area-bottom">
          {([
            { id: 'dashboard', label: 'Home',    icon: <LayoutDashboard size={20} /> },
            { id: 'fixtures',  label: 'Matches', icon: <CalendarDays size={20} /> },
            { id: 'standings', label: 'Stats',   icon: <BarChart2 size={20} /> },
            { id: 'teams',     label: 'Squads',  icon: <Users size={20} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowMoreMenu(false); }}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all relative',
                activeTab === tab.id && !showMoreMenu
                  ? 'text-indigo-400'
                  : 'text-slate-600 hover:text-slate-400'
              )}
            >
              {activeTab === tab.id && !showMoreMenu && (
                <motion.div layoutId="mobileTabIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-indigo-500" />
              )}
              {tab.icon}
              {tab.label}
            </button>
          ))}
          {/* MORE */}
          <button
            onClick={() => setShowMoreMenu(v => !v)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all relative',
              showMoreMenu ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'
            )}
          >
            {showMoreMenu && (
              <motion.div layoutId="mobileTabIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-indigo-500" />
            )}
            <MoreHorizontal size={20} />
            More
          </button>
        </nav>

        {/* ── More Bottom Sheet ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showMoreMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowMoreMenu(false)}
                className="lg:hidden fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="lg:hidden fixed bottom-16 left-0 right-0 z-[76] bg-[#0a0a12] border-t border-[#1e1e32] rounded-t-3xl p-4 pb-2"
              >
                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'scorers',  label: 'Scorers',  icon: <Goal size={22} /> },
                    { id: 'fantasy',  label: 'Fantasy',  icon: <Star size={22} /> },
                    ...(isKnockout ? [{ id: 'bracket' as Tab, label: 'Bracket', icon: <GitBranch size={22} /> }] : []),
                    { id: 'history',  label: 'History',  icon: <History size={22} /> },
                    ...(isAdmin ? [{ id: 'settings' as Tab, label: 'Settings', icon: <Settings size={22} /> }] : []),
                  ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setShowMoreMenu(false); }}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest',
                        activeTab === item.id
                          ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400'
                          : 'bg-white/3 border-[#1e1e32] text-slate-500 hover:text-white hover:border-slate-600'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a12] border border-red-500/30 rounded-[2.5rem] p-10 max-w-md w-full relative z-10 text-center"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
                   <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Confirm Deletion</h3>
                <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8 uppercase tracking-tight">
                  This action cannot be undone. All match history and standings for this tournament will be permanently lost.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Cancel</button>
                  <button 
                    onClick={async () => {
                      const { deleteTournament } = await import('../../lib/store');
                      await deleteTournament(tournament.id);
                      onDeleted();
                    }}
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all"
                  >
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

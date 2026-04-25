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
import TournamentHistory from '../TournamentHistory';
import { 
  Trophy, BarChart2, ListOrdered, Settings, ArrowLeft, Archive, 
  Trash2, Users, GitBranch, Goal, LayoutDashboard, History, 
  ChevronRight, LogOut, ShieldCheck, Star
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TournamentDashboardProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onBack: () => void;
  onDeleted: () => void;
}

type Tab = 'dashboard' | 'fixtures' | 'standings' | 'scorers' | 'teams' | 'bracket' | 'history' | 'settings';

export function TournamentDashboard({ tournament: initialTournament, isAdmin, onBack, onDeleted }: TournamentDashboardProps) {
  const [tournament, setTournament] = useState<Tournament>(initialTournament);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (updated: Tournament) => setTournament(updated);

  const handleArchive = async () => {
    setIsSaving(true);
    const updated: Tournament = { ...tournament, archived: !tournament.archived };
    await saveTournament(updated);
    setTournament(updated);
    setIsSaving(false);
  };

  const isKnockout = tournament.type === 'knockout' || tournament.type === 'groups';

  const menuItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'fixtures', label: 'Fixtures', icon: <ListOrdered size={18} /> },
    { id: 'standings', label: 'Standings', icon: <BarChart2 size={18} /> },
    { id: 'scorers', label: 'Top Scorers', icon: <Goal size={18} /> },
    { id: 'teams', label: 'Teams', icon: <Users size={18} /> },
    ...(isKnockout ? [{ id: 'bracket' as Tab, label: 'Bracket', icon: <GitBranch size={18} /> }] : []),
    { id: 'history', label: 'League History', icon: <History size={18} /> },
    ...(isAdmin ? [{ id: 'settings' as Tab, label: 'Account Settings', icon: <Settings size={18} /> }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-[#050508] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#1e1e32] bg-[#0a0a12] flex flex-col sticky top-0 h-screen z-50">
        {/* Logo Section */}
        <div className="p-8 border-b border-[#1e1e32]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tighter uppercase leading-none">KickOff</h1>
              <p className="text-[8px] font-black tracking-widest text-slate-500 uppercase mt-1">Tournament Manager</p>
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
        {/* Navbar */}
        <header className="h-24 border-b border-[#1e1e32] bg-[#050508]/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-[40]">
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] opacity-60">
                Tournaments <span className="mx-2 text-slate-700">/</span> {tournament.name}
             </div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter ml-4">
               {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('scorers', 'Top Scorers').toUpperCase()}
             </h2>
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
        <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
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
                {activeTab === 'teams' && <TeamsTab tournament={tournament} />}
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

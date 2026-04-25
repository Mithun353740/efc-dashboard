import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tournament } from '../../types';
import { saveTournament } from '../../lib/store';
import { FixturesTab } from './FixturesTab';
import { StandingsTab } from './StandingsTab';
import { TeamsTab } from './TeamsTab';
import { BracketView } from './BracketView';
import { StatsTab } from './StatsTab';
import { Trophy, BarChart2, ListOrdered, Settings, ArrowLeft, Archive, Trash2, Users, GitBranch, Goal } from 'lucide-react';

interface TournamentDashboardProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onBack: () => void;
  onDeleted: () => void;
}

type Tab = 'overview' | 'fixtures' | 'standings' | 'teams' | 'bracket' | 'settings' | 'stats';

export function TournamentDashboard({ tournament: initialTournament, isAdmin, onBack, onDeleted }: TournamentDashboardProps) {
  const [tournament, setTournament] = useState<Tournament>(initialTournament);
  const [activeTab, setActiveTab] = useState<Tab>('fixtures');
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

  const fixtures = tournament.fixtures || [];
  const teams = tournament.teams || [];
  const played = fixtures.filter(f => f.status === 'completed').length;
  const total = fixtures.length;
  const progress = total > 0 ? Math.round((played / total) * 100) : 0;

  const isKnockout = tournament.type === 'knockout' || tournament.type === 'groups';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'fixtures', label: 'Fixtures', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'standings', label: 'Standings', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'stats', label: 'Top Scorers', icon: <Goal className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    ...(isKnockout ? [{ id: 'bracket' as Tab, label: 'Bracket', icon: <GitBranch className="w-4 h-4" /> }] : []),
    ...(isAdmin ? [{ id: 'settings' as Tab, label: 'Settings', icon: <Settings className="w-4 h-4" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050508]/95 backdrop-blur-xl border-b border-[#1e1e32]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#0a0a12] border border-[#1e1e32] text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 flex-1 min-w-0">
            {tournament.logo ? (
              <img src={tournament.logo} className="w-12 h-12 rounded-xl object-cover border border-[#1e1e32]" alt={tournament.name} />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-black text-white text-lg tracking-tight truncate">{tournament.name}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {tournament.type?.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">•</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {teams.length} Teams
                </span>
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-white">{progress}%</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{played}/{total} Played</div>
            </div>
            <div className="w-12 h-12 relative flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#1e1e32" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke="url(#progressGrad)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#0a0a12]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'fixtures' && (
              <FixturesTab tournament={tournament} isAdmin={isAdmin} onUpdate={handleUpdate} />
            )}
            {activeTab === 'standings' && (
              <StandingsTab tournament={tournament} />
            )}
            {activeTab === 'teams' && (
              <TeamsTab tournament={tournament} />
            )}
            {activeTab === 'bracket' && (
              <BracketView tournament={tournament} />
            )}
            {activeTab === 'stats' && (
              <StatsTab tournament={tournament} />
            )}
            {activeTab === 'settings' && isAdmin && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Tournament Management</h2>

                <div className="rounded-3xl border border-[#1e1e32] bg-[#0a0a12] divide-y divide-[#1e1e32]">
                  {/* Archive */}
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <div className="font-black text-white mb-1">{tournament.archived ? 'Unarchive' : 'Archive'} Tournament</div>
                      <div className="text-xs text-slate-500">
                        {tournament.archived ? 'Restore this tournament to active status.' : 'Move to archive. Data is preserved.'}
                      </div>
                    </div>
                    <button
                      onClick={handleArchive}
                      disabled={isSaving}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        tournament.archived
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      <Archive className="w-4 h-4" />
                      {tournament.archived ? 'Restore' : 'Archive'}
                    </button>
                  </div>

                  {/* Delete */}
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <div className="font-black text-red-400 mb-1">Delete Tournament</div>
                      <div className="text-xs text-slate-500">Permanently remove all data. This cannot be undone.</div>
                    </div>
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-xl border border-[#1e1e32] text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all">
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            const { deleteTournament } = await import('../../lib/store');
                            await deleteTournament(tournament.id);
                            onDeleted();
                          }}
                          className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/30 transition-all"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

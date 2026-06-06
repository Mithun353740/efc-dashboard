import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Edit3, Users, Calendar, Settings, 
  ChevronRight, ChevronLeft, Shuffle, UserPlus, AlertCircle,
  Check, X, Save, Loader2, GripVertical, SaveAll, Zap,
  Crown, Swords, BarChart3, Eye, EyeOff, Layers, Grid3X3,
  ArrowRight, RotateCcw, Target, Trophy as TrophyIcon
} from 'lucide-react';
import { useFirebase } from '../../FirebaseContext';
import { Tournament, Group, Fixture, TournamentFormat } from '../../types/tournament';
import { cn } from '../../lib/utils';
import { 
  saveTournament, 
  deleteTournament, 
  registerPlayerInTournament,
  isQuotaExceeded,
} from '../../lib/store';
import { ensureAdminSession } from '../../lib/store';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Generate ID
// ─────────────────────────────────────────────────────────────────────────────
const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);

// ─────────────────────────────────────────────────────────────────────────────
// Group Management Component
// ─────────────────────────────────────────────────────────────────────────────
interface GroupManagerProps {
  tournament: Tournament;
  onUpdate: (tournament: Tournament) => void;
  players: { id: string; name: string }[];
}

function GroupManager({ tournament, onUpdate, players }: GroupManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [mode, setMode] = useState<'manual' | 'random'>('manual');
  const [groupsPerTeam, setGroupsPerTeam] = useState(2); // For random: how many groups to create

  const registeredPlayers = useMemo(() => {
    return (tournament.registeredPlayerIds || [])
      .map(id => players.find(p => p.id === id))
      .filter(Boolean) as { id: string; name: string }[];
  }, [tournament.registeredPlayerIds, players]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedTeams.length < 2) return;
    
    const newGroup: Group = {
      id: (tournament.groups?.length || 0) + 1,
      name: newGroupName.trim(),
      teamIds: [...selectedTeams],
    };

    const updated = {
      ...tournament,
      groups: [...(tournament.groups || []), newGroup],
    };
    onUpdate(updated);
    setNewGroupName('');
    setSelectedTeams([]);
    setShowCreate(false);
  };

  const handleRandomGroups = () => {
    if (!registeredPlayers.length) return;
    
    const teams = [...registeredPlayers];
    const numGroups = Math.min(groupsPerTeam, Math.floor(teams.length / 2) || 1);
    const teamsPerGroup = Math.floor(teams.length / numGroups);
    
    // Shuffle teams
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    
    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      const groupTeams = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
      if (groupTeams.length >= 2) {
        newGroups.push({
          id: i + 1,
          name: `Group ${String.fromCharCode(65 + i)}`,
          teamIds: groupTeams.map(t => t.id),
        });
      }
    }

    const updated = {
      ...tournament,
      groups: newGroups,
    };
    onUpdate(updated);
    setShowCreate(false);
  };

  const handleDeleteGroup = (groupId: number) => {
    const updated = {
      ...tournament,
      groups: (tournament.groups || []).filter(g => g.id !== groupId),
    };
    onUpdate(updated);
  };

  const handleRemoveTeamFromGroup = (groupId: number, teamId: string) => {
    const updated = {
      ...tournament,
      groups: (tournament.groups || []).map(g => {
        if (g.id === groupId) {
          return { ...g, teamIds: g.teamIds.filter(id => id !== teamId) };
        }
        return g;
      }).filter(g => g.teamIds.length >= 2), // Remove groups with less than 2 teams
    };
    onUpdate(updated);
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Layers size={20} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="font-black text-lg">Group Management</h3>
            <p className="text-xs text-slate-500">Create and manage tournament groups</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-xl font-black text-xs flex items-center gap-2"
        >
          <Plus size={14} /> CREATE GROUPS
        </button>
      </div>

      {/* Existing Groups */}
      {(!tournament.groups || tournament.groups.length === 0) ? (
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No groups created yet</p>
          <p className="text-xs text-slate-600 mt-1">Groups must be created before generating fixtures</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournament.groups.map(group => {
            const groupTeams = group.teamIds
              .map(id => players.find(p => p.id === id))
              .filter(Boolean);
            
            return (
              <div key={group.id} className="bg-[#0f172a] rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-black text-lg">{group.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{group.teamIds.length} teams</span>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-1 hover:bg-rose-500/20 rounded text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {groupTeams.map(team => team && (
                    <div key={team.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-sm font-bold">{team.name}</span>
                      <button
                        onClick={() => handleRemoveTeamFromGroup(group.id, team.id)}
                        className="text-slate-500 hover:text-rose-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Groups Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto"
            >
              <h3 className="font-black text-xl mb-4">Create Groups</h3>
              
              {/* Mode Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('manual')}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2",
                    mode === 'manual' ? "bg-brand-primary text-white" : "bg-white/5 text-slate-400"
                  )}
                >
                  <Edit3 size={14} /> Manual
                </button>
                <button
                  onClick={() => setMode('random')}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2",
                    mode === 'random' ? "bg-brand-primary text-white" : "bg-white/5 text-slate-400"
                  )}
                >
                  <Shuffle size={14} /> Random
                </button>
              </div>

              {mode === 'manual' ? (
                <>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    placeholder="Group Name (e.g., Group A)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 text-white placeholder-slate-500"
                  />
                  
                  <p className="text-xs text-slate-500 mb-2">Select teams (minimum 2):</p>
                  <div className="space-y-2 max-h-60 overflow-auto mb-4">
                    {registeredPlayers.map(player => (
                      <div
                        key={player.id}
                        onClick={() => toggleTeamSelection(player.id)}
                        className={cn(
                          "flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition-all",
                          selectedTeams.includes(player.id)
                            ? "bg-brand-primary/20 border border-brand-primary"
                            : "bg-white/5 border border-white/10 hover:border-white/20"
                        )}
                      >
                        <span className="font-bold">{player.name}</span>
                        {selectedTeams.includes(player.id) && <Check size={16} className="text-brand-primary" />}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim() || selectedTeams.length < 2}
                    className="w-full py-3 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Create Group
                  </button>
                </>
              ) : (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Randomly distribute all {registeredPlayers.length} registered players into groups.
                  </p>
                  
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-2 block">Number of Groups</label>
                    <input
                      type="number"
                      min={1}
                      max={Math.floor(registeredPlayers.length / 2)}
                      value={groupsPerTeam}
                      onChange={e => setGroupsPerTeam(Math.max(1, Math.min(Math.floor(registeredPlayers.length / 2), parseInt(e.target.value) || 1)))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    />
                  </div>

                  <button
                    onClick={handleRandomGroups}
                    disabled={registeredPlayers.length < 4}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl flex items-center justify-center gap-2"
                  >
                    <Shuffle size={16} /> Generate Random Groups
                  </button>
                  
                  {registeredPlayers.length < 4 && (
                    <p className="text-xs text-amber-500 mt-2 text-center">
                      Minimum 4 players required for random grouping
                    </p>
                  )}
                </>
              )}

              <button
                onClick={() => setShowCreate(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixture Generator Component
// ─────────────────────────────────────────────────────────────────────────────
interface FixtureGeneratorProps {
  tournament: Tournament;
  onUpdate: (tournament: Tournament) => void;
  players: { id: string; name: string }[];
}

function FixtureGenerator({ tournament, onUpdate, players }: FixtureGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState<'groups' | 'knockout'>('groups');

  const hasGroups = tournament.groups && tournament.groups.length > 0;
  const hasGroupFixtures = tournament.fixtures.some(f => f.stage === 'groups');
  const hasKnockoutFixtures = tournament.fixtures.some(f => f.stage === 'knockout');

  // Generate group stage fixtures (round-robin within each group)
  const generateGroupFixtures = () => {
    if (!tournament.groups) return;
    
    const newFixtures: Fixture[] = [];
    
    tournament.groups.forEach(group => {
      const teams = group.teamIds;
      const roundMatches: { home: string; away: string }[] = [];
      
      // Round-robin: each team plays every other team twice (home & away)
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          roundMatches.push({ home: teams[i], away: teams[j] });
        }
      }

      // Split into rounds
      const matchesPerRound = Math.ceil(roundMatches.length / Math.ceil(Math.log2(teams.length)));
      let matchIndex = 0;
      
      for (let round = 1; round <= Math.ceil(roundMatches.length / matchesPerRound); round++) {
        const roundMatchesList = roundMatches.slice(matchIndex, matchIndex + matchesPerRound);
        matchIndex += matchesPerRound;

        roundMatchesList.forEach((match, idx) => {
          newFixtures.push({
            id: generateId(),
            homeId: match.home,
            awayId: match.away,
            homeScore: null,
            awayScore: null,
            status: 'upcoming',
            round,
            stage: 'groups',
            groupId: group.id,
            matchIndex: idx,
          });
        });
      }
    });

    const updated: Tournament = {
      ...tournament,
      fixtures: [...tournament.fixtures.filter(f => f.stage !== 'groups'), ...newFixtures],
      phase: 'groups',
    };
    onUpdate(updated);
  };

  // Generate knockout fixtures (from group winners)
  const generateKnockoutFixtures = () => {
    if (!tournament.groups) return;
    
    const newFixtures: Fixture[] = [];
    const groupWinners = tournament.groups.map(g => g.teamIds[0]); // First team in each group as winner
    
    // Simple knockout: 2 teams = 1 final, 4 teams = semi + final, etc.
    const numTeams = groupWinners.length;
    
    if (numTeams === 2) {
      // Final
      newFixtures.push({
        id: generateId(),
        homeId: groupWinners[0],
        awayId: groupWinners[1],
        homeScore: null,
        awayScore: null,
        status: 'upcoming',
        round: 1,
        stage: 'knockout',
        matchIndex: 0,
      });
    } else if (numTeams >= 4) {
      // Semi-finals
      newFixtures.push({
        id: generateId(),
        homeId: groupWinners[0],
        awayId: groupWinners[1],
        homeScore: null,
        awayScore: null,
        status: 'upcoming',
        round: 2,
        stage: 'knockout',
        matchIndex: 0,
      });
      newFixtures.push({
        id: generateId(),
        homeId: groupWinners[2],
        awayId: groupWinners[3],
        homeScore: null,
        awayScore: null,
        status: 'upcoming',
        round: 2,
        stage: 'knockout',
        matchIndex: 1,
      });
      // Final
      newFixtures.push({
        id: generateId(),
        homeId: null,
        awayId: null,
        homeScore: null,
        awayScore: null,
        status: 'upcoming',
        round: 1,
        stage: 'knockout',
        matchIndex: 0,
      });
    }

    const updated: Tournament = {
      ...tournament,
      fixtures: [...tournament.fixtures.filter(f => f.stage !== 'knockout'), ...newFixtures],
      phase: 'knockout',
    };
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Grid3X3 size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-black text-lg">Fixture Generator</h3>
            <p className="text-xs text-slate-500">Generate match fixtures for tournament</p>
          </div>
        </div>
      </div>

      {/* Status */}
      {!hasGroups ? (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-amber-500" size={20} />
          <div>
            <p className="font-bold text-amber-500">Groups Required</p>
            <p className="text-xs text-amber-500/70">Create groups before generating fixtures</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Group Fixtures */}
          <div className={cn(
            "bg-[#0f172a] rounded-xl border p-4",
            hasGroupFixtures ? "border-emerald-500/30" : "border-white/10"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-emerald-500" />
                <span className="font-black">Group Stage</span>
              </div>
              {hasGroupFixtures && <Check size={16} className="text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {hasGroupFixtures 
                ? `${tournament.fixtures.filter(f => f.stage === 'groups').length} matches generated`
                : 'Round-robin format within each group'
              }
            </p>
            <button
              onClick={generateGroupFixtures}
              disabled={hasGroupFixtures || isQuotaExceeded}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl flex items-center justify-center gap-2"
            >
              {hasGroupFixtures ? <Check size={14} /> : <Zap size={14} />}
              {hasGroupFixtures ? 'GENERATED' : 'GENERATE GROUP FIXTURES'}
            </button>
          </div>

          {/* Knockout Fixtures */}
          <div className={cn(
            "bg-[#0f172a] rounded-xl border p-4",
            hasKnockoutFixtures ? "border-amber-500/30" : "border-white/10"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrophyIcon size={16} className="text-amber-500" />
                <span className="font-black">Knockout Stage</span>
              </div>
              {hasKnockoutFixtures && <Check size={16} className="text-amber-500" />}
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {hasKnockoutFixtures 
                ? `${tournament.fixtures.filter(f => f.stage === 'knockout').length} matches generated`
                : 'Semi-finals & Final from group winners'
              }
            </p>
            <button
              onClick={generateKnockoutFixtures}
              disabled={hasKnockoutFixtures || isQuotaExceeded}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl flex items-center justify-center gap-2"
            >
              {hasKnockoutFixtures ? <Check size={14} /> : <Zap size={14} />}
              {hasKnockoutFixtures ? 'GENERATED' : 'GENERATE KNOCKOUT FIXTURES'}
            </button>
          </div>
        </div>
      )}

      {/* Existing Fixtures Summary */}
      {tournament.fixtures.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="font-bold text-sm mb-3">Generated Fixtures</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Group: {tournament.fixtures.filter(f => f.stage === 'groups').length} matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Knockout: {tournament.fixtures.filter(f => f.stage === 'knockout').length} matches</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Match Manager Component
// ─────────────────────────────────────────────────────────────────────────────
interface MatchManagerProps {
  tournament: Tournament;
  onUpdate: (tournament: Tournament) => void;
  players: { id: string; name: string }[];
}

function MatchManager({ tournament, onUpdate, players }: MatchManagerProps) {
  const [editingMatch, setEditingMatch] = useState<Fixture | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const getPlayerName = (id: string | null) => {
    if (!id) return 'TBD';
    return players.find(p => p.id === id)?.name || 'Unknown';
  };

  const updateMatchScore = (match: Fixture, home: number, away: number) => {
    const updated = {
      ...tournament,
      fixtures: tournament.fixtures.map(f => 
        f.id === match.id 
          ? { ...f, homeScore: home, awayScore: away, status: 'completed' as const, updatedAt: Date.now() }
          : f
      ),
    };
    onUpdate(updated);
    setEditingMatch(null);
  };

  const groupFixtures = tournament.fixtures.filter(f => f.stage === 'groups');
  const knockoutFixtures = tournament.fixtures.filter(f => f.stage === 'knockout');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Swords size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="font-black text-lg">Match Manager</h3>
            <p className="text-xs text-slate-500">Record match results and update scores</p>
          </div>
        </div>
      </div>

      {/* No Fixtures Message */}
      {tournament.fixtures.length === 0 && (
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No fixtures generated</p>
          <p className="text-xs text-slate-600 mt-1">Generate fixtures in the Fixture Generator section first</p>
        </div>
      )}

      {/* Group Stage Matches */}
      {groupFixtures.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-emerald-500 flex items-center gap-2">
            <Layers size={14} /> GROUP STAGE ({groupFixtures.length} matches)
          </h4>
          <div className="grid gap-2">
            {groupFixtures.map(match => (
              <div key={match.id}>
                <MatchCard 
                  match={match} 
                  getPlayerName={getPlayerName}
                  onEdit={() => {
                    setEditingMatch(match);
                    setHomeScore(match.homeScore?.toString() || '');
                    setAwayScore(match.awayScore?.toString() || '');
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knockout Stage Matches */}
      {knockoutFixtures.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="font-bold text-sm text-amber-500 flex items-center gap-2">
            <TrophyIcon size={14} /> KNOCKOUT STAGE ({knockoutFixtures.length} matches)
          </h4>
          <div className="grid gap-2">
            {knockoutFixtures.map(match => (
              <div key={match.id}>
                <MatchCard 
                  match={match} 
                  getPlayerName={getPlayerName}
                  onEdit={() => {
                    setEditingMatch(match);
                    setHomeScore(match.homeScore?.toString() || '');
                    setAwayScore(match.awayScore?.toString() || '');
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Score Modal */}
      <AnimatePresence>
        {editingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingMatch(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-black text-lg mb-4">Record Result</h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">{getPlayerName(editingMatch.homeId)}</p>
                  <input
                    type="number"
                    min={0}
                    value={homeScore}
                    onChange={e => setHomeScore(e.target.value)}
                    className="w-20 h-16 bg-white/10 border border-white/20 rounded-xl text-center text-2xl font-black"
                    placeholder="0"
                  />
                </div>
                <span className="text-2xl font-black text-slate-600">-</span>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">{getPlayerName(editingMatch.awayId)}</p>
                  <input
                    type="number"
                    min={0}
                    value={awayScore}
                    onChange={e => setAwayScore(e.target.value)}
                    className="w-20 h-16 bg-white/10 border border-white/20 rounded-xl text-center text-2xl font-black"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingMatch(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateMatchScore(editingMatch, parseInt(homeScore) || 0, parseInt(awayScore) || 0)}
                  className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/80 text-white font-black rounded-xl"
                >
                  Save Result
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Match Card Component
interface MatchCardProps {
  match: Fixture;
  getPlayerName: (id: string | null) => string;
  onEdit: () => void;
}

function MatchCard({ match, getPlayerName, onEdit }: MatchCardProps) {
  return (
    <div className="bg-[#0f172a] rounded-xl border border-white/10 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-2 h-2 rounded-full",
          match.status === 'completed' ? "bg-emerald-500" : "bg-amber-500"
        )} />
        <div>
          <p className="font-bold text-sm">
            {getPlayerName(match.homeId)} <span className="text-slate-500 mx-2">vs</span> {getPlayerName(match.awayId)}
          </p>
          {match.groupId && (
            <p className="text-xs text-slate-500">Group {String.fromCharCode(64 + match.groupId)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {match.status === 'completed' ? (
          <span className="font-black text-lg">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : (
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-lg text-xs font-bold"
          >
            Record
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Admin Tournament Manager Component
// ─────────────────────────────────────────────────────────────────────────────
interface AdminTournamentManagerProps {
  forcePublic?: boolean;
  adminOverride?: boolean;
  onBack: () => void;
}

export function AdminTournamentManager({ forcePublic = false, adminOverride = false, onBack }: AdminTournamentManagerProps) {
  const { tournaments, players, systemLocks } = useFirebase();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'groups' | 'fixtures' | 'matches' | 'settings'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Create/Edit Tournament State
  const [newTournament, setNewTournament] = useState({
    name: '',
    type: 'groups+knockout' as TournamentFormat,
    maxTeams: 16,
    registrationDeadline: '',
    startingDate: '',
  });

  const handleCreateTournament = async () => {
    if (!newTournament.name.trim()) return;
    
    setSaving(true);
    try {
      await ensureAdminSession();
      
      const tournament: Tournament = {
        id: generateId(),
        name: newTournament.name.trim(),
        type: newTournament.type,
        archived: false,
        teams: [],
        fixtures: [],
        groups: [],
        phase: 'registration',
        registeredPlayerIds: [],
        maxTeams: newTournament.maxTeams,
        registrationDeadline: newTournament.registrationDeadline || undefined,
        startingDate: newTournament.startingDate || undefined,
        createdAt: Date.now(),
      };

      await saveTournament(tournament);
      setSelectedTournament(tournament);
      setShowCreateModal(false);
      setNewTournament({ name: '', type: 'groups+knockout', maxTeams: 16, registrationDeadline: '', startingDate: '' });
    } catch (err) {
      console.error('Failed to create tournament:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTournament = async (updated: Tournament) => {
    setSaving(true);
    setSyncMsg('Saving...');
    try {
      await ensureAdminSession();
      await saveTournament(updated);
      setSelectedTournament(updated);
      setSyncMsg('Saved ✓');
      setTimeout(() => setSyncMsg(''), 2000);
    } catch (err) {
      console.error('Failed to update tournament:', err);
      setSyncMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('Delete this tournament? This cannot be undone.')) return;
    
    try {
      await ensureAdminSession();
      await deleteTournament(id);
      setSelectedTournament(null);
    } catch (err) {
      console.error('Failed to delete tournament:', err);
    }
  };

  const selectedPlayers = useMemo(() => 
    players.map(p => ({ id: p.id, name: p.name })),
    [players]
  );

  // List View
  if (!selectedTournament) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Back to Control Center
          </button>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Trophy size={32} className="text-brand-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Tournament Management</h1>
                <p className="text-slate-500 text-sm">Create, manage, and organize all tournaments</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 text-white font-black rounded-xl flex items-center gap-2"
            >
              <Plus size={18} /> NEW TOURNAMENT
            </button>
          </div>

          {/* Tournament List */}
          <div className="space-y-4">
            {tournaments.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No tournaments yet</p>
                <p className="text-slate-600 text-sm mt-2">Create your first tournament to get started</p>
              </div>
            ) : (
              tournaments.map(t => (
                <div
                  key={t.id}
                  className="bg-[#0f172a] rounded-xl border border-white/10 p-6 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => setSelectedTournament(t)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <Trophy size={24} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{t.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-white/10 rounded-lg">{t.type}</span>
                        <span>{t.registeredPlayerIds?.length || 0} registered</span>
                        <span>{t.groups?.length || 0} groups</span>
                        <span>{t.fixtures.length} fixtures</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      t.phase === 'registration' ? 'bg-blue-500/20 text-blue-500' :
                      t.phase === 'groups' ? 'bg-emerald-500/20 text-emerald-500' :
                      t.phase === 'knockout' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-slate-500/20 text-slate-500'
                    )}>
                      {t.phase || 'registration'}
                    </span>
                    <ChevronRight size={20} className="text-slate-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Tournament Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
              >
                <h3 className="font-black text-xl mb-6">Create New Tournament</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block">Tournament Name</label>
                    <input
                      type="text"
                      value={newTournament.name}
                      onChange={e => setNewTournament({ ...newTournament, name: e.target.value })}
                      placeholder="e.g., QVFC Elite League"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-2 block">Format</label>
                    <select
                      value={newTournament.type}
                      onChange={e => setNewTournament({ ...newTournament, type: e.target.value as TournamentFormat })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    >
                      <option value="groups+knockout">Groups + Knockout</option>
                      <option value="league">League</option>
                      <option value="knockout">Knockout</option>
                      <option value="groups">Groups Only</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block">Max Teams</label>
                      <input
                        type="number"
                        value={newTournament.maxTeams}
                        onChange={e => setNewTournament({ ...newTournament, maxTeams: parseInt(e.target.value) || 16 })}
                        min={2}
                        max={64}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block">Registration Deadline</label>
                      <input
                        type="date"
                        value={newTournament.registrationDeadline}
                        onChange={e => setNewTournament({ ...newTournament, registrationDeadline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-2 block">Starting Date</label>
                    <input
                      type="date"
                      value={newTournament.startingDate}
                      onChange={e => setNewTournament({ ...newTournament, startingDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTournament}
                    disabled={!newTournament.name.trim() || saving}
                    className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 text-white font-black rounded-xl flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    Create Tournament
                  </button>
                </div>

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl text-slate-400"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Tournament Detail View
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedTournament(null)}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black">{selectedTournament.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="px-2 py-1 bg-white/10 rounded-lg">{selectedTournament.type}</span>
                <span>{selectedTournament.registeredPlayerIds?.length || 0} registered</span>
                {syncMsg && <span className="text-emerald-500">{syncMsg}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDeleteTournament(selectedTournament.id)}
              className="p-3 hover:bg-rose-500/20 rounded-xl text-rose-500"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'groups', label: 'Groups', icon: Layers },
            { id: 'fixtures', label: 'Fixtures', icon: Grid3X3 },
            { id: 'matches', label: 'Matches', icon: Swords },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all",
                activeSection === tab.id
                  ? "bg-brand-primary text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-brand-primary">{selectedTournament.registeredPlayerIds?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Registered</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-emerald-500">{selectedTournament.groups?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Groups</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-amber-500">{selectedTournament.fixtures.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Fixtures</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-purple-500">
                    {selectedTournament.fixtures.filter(f => f.status === 'completed').length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Completed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GroupManager 
                  tournament={selectedTournament} 
                  onUpdate={handleUpdateTournament}
                  players={selectedPlayers}
                />
                <FixtureGenerator 
                  tournament={selectedTournament} 
                  onUpdate={handleUpdateTournament}
                  players={selectedPlayers}
                />
              </div>
            </div>
          )}

          {activeSection === 'groups' && (
            <GroupManager 
              tournament={selectedTournament} 
              onUpdate={handleUpdateTournament}
              players={selectedPlayers}
            />
          )}

          {activeSection === 'fixtures' && (
            <FixtureGenerator 
              tournament={selectedTournament} 
              onUpdate={handleUpdateTournament}
              players={selectedPlayers}
            />
          )}

          {activeSection === 'matches' && (
            <MatchManager 
              tournament={selectedTournament} 
              onUpdate={handleUpdateTournament}
              players={selectedPlayers}
            />
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h3 className="font-black text-lg">Tournament Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Tournament Name</label>
                  <input
                    type="text"
                    value={selectedTournament.name}
                    onChange={e => setSelectedTournament({ ...selectedTournament, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Format</label>
                  <select
                    value={selectedTournament.type}
                    onChange={e => setSelectedTournament({ ...selectedTournament, type: e.target.value as TournamentFormat })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="groups+knockout">Groups + Knockout</option>
                    <option value="league">League</option>
                    <option value="knockout">Knockout</option>
                    <option value="groups">Groups Only</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateTournament(selectedTournament)}
                    disabled={saving}
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 text-white font-black rounded-xl flex items-center gap-2"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTournamentManager;
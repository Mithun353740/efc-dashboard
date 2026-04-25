import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tournament, Team } from '../../types';
import { saveTournament } from '../../lib/store';
import { useFirebase } from '../../FirebaseContext';
import { Star, Save, Shield, User } from 'lucide-react';

interface FantasyTabProps {
  tournament: Tournament;
  isAdmin?: boolean;
  onUpdate: (updated: Tournament) => void;
}

export function FantasyTab({ tournament, isAdmin, onUpdate }: FantasyTabProps) {
  const { players } = useFirebase();
  const [points, setPoints] = useState<Record<string, string>>(
    tournament.teams.reduce((acc, team) => ({
      ...acc,
      [team.id]: team.fantasyPoints?.toString() || '0'
    }), {})
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      const updatedTeams = tournament.teams.map(team => ({
        ...team,
        fantasyPoints: parseInt(points[team.id] || '0')
      }));
      const updated = { ...tournament, teams: updatedTeams };
      await saveTournament(updated);
      onUpdate(updated);
      alert('Fantasy points updated successfully!');
    } catch (error) {
      console.error('Failed to save fantasy points:', error);
      alert('Failed to save points.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            FANTASY RANKINGS
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Tournament Exclusive Points</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'SAVING...' : 'SAVE POINTS'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournament.teams
          .sort((a, b) => (b.fantasyPoints || 0) - (a.fantasyPoints || 0))
          .map((team, idx) => {
            const player = players.find(p => p.id === team.id);
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0a0a12] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#050508] border border-[#1e1e32] flex items-center justify-center text-xs font-black text-slate-500">
                    #{idx + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex items-center justify-center">
                    {player?.image ? (
                      <img src={player.image} className="w-full h-full object-cover" alt={team.name} />
                    ) : (
                      <User className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-tight">{team.name}</h3>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tournament Competitor</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAdmin ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={points[team.id]}
                        onChange={(e) => setPoints(prev => ({ ...prev, [team.id]: e.target.value }))}
                        className="w-20 bg-[#050508] border border-[#1e1e32] rounded-xl px-3 py-2 text-white font-black text-center focus:border-indigo-500 outline-none transition-all"
                      />
                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">PTS</span>
                    </div>
                  ) : (
                    <div className="px-6 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <span className="text-xl font-black text-yellow-400">{team.fantasyPoints || 0}</span>
                      <span className="text-[8px] font-black text-yellow-500/50 uppercase ml-1.5">PTS</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}

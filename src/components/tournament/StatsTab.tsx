import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tournament, Team } from '../../types';
import { useFirebase } from '../../FirebaseContext';
import { Trophy, Shield, Goal, User } from 'lucide-react';

interface StatsTabProps {
  tournament: Tournament;
}

interface PlayerStats {
  id: string;
  name: string;
  goals: number;
  conceded: number;
  cleanSheets: number;
  played: number;
}

export function StatsTab({ tournament }: StatsTabProps) {
  const { players } = useFirebase();
  
  const stats = useMemo(() => {
    const map: Record<string, PlayerStats> = {};
    tournament.teams.forEach(t => {
      map[t.id] = { id: t.id, name: t.name, goals: 0, conceded: 0, cleanSheets: 0, played: 0 };
    });

    (tournament.fixtures || []).forEach(f => {
      if (f.status !== 'completed' || f.homeId === null || f.awayId === null || f.homeScore === null || f.awayScore === null) return;
      
      const home = map[f.homeId];
      const away = map[f.awayId];
      if (!home || !away) return;

      home.played++;
      away.played++;
      home.goals += f.homeScore;
      home.conceded += f.awayScore;
      away.goals += f.awayScore;
      away.conceded += f.homeScore;

      if (f.awayScore === 0) home.cleanSheets++;
      if (f.homeScore === 0) away.cleanSheets++;
    });

    return Object.values(map);
  }, [tournament]);

  const topScorers = [...stats].sort((a, b) => b.goals - a.goals || a.played - b.played).slice(0, 5);
  const bestDefense = [...stats].sort((a, b) => a.conceded - b.conceded || b.played - a.played).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Top Scorers */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Golden Boot</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Goal Scorers</p>
          </div>
        </div>

        <div className="space-y-3">
          {topScorers.map((s, i) => {
            const player = players.find(p => p.id === s.id);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a12] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-black text-xs w-4">{i + 1}</span>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex items-center justify-center">
                    {player?.image ? (
                      <img src={player.image} className="w-full h-full object-cover" alt={s.name} />
                    ) : (
                      <User className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{s.name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{s.played} Matches Played</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">{s.goals}</div>
                  <div className="text-[9px] font-black text-yellow-500 uppercase">Goals</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Best Defense */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Golden Glove</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Defensive Excellence</p>
          </div>
        </div>

        <div className="space-y-3">
          {bestDefense.map((s, i) => {
            const player = players.find(p => p.id === s.id);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a12] border border-[#1e1e32] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-black text-xs w-4">{i + 1}</span>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#1e1e32] bg-indigo-500/10 flex items-center justify-center">
                    {player?.image ? (
                      <img src={player.image} className="w-full h-full object-cover" alt={s.name} />
                    ) : (
                      <User className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{s.name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{s.cleanSheets} Clean Sheets</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">{s.conceded}</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase">Against</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

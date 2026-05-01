import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tournament, Team, Fixture } from '../../types';
import { useFirebase } from '../../FirebaseContext';
import { calculateFantasyPoints } from '../../lib/fantasy';
import { Star, Medal, User, Goal, Trophy } from 'lucide-react';

interface FantasyStandingsProps {
  tournament: Tournament;
}

interface FantasyRow {
  team: Team;
  points: number;
  goals: number;
  wins: number;
  draws: number;
  cleanSheets: number;
  played: number;
}

export function FantasyStandings({ tournament }: FantasyStandingsProps) {
  const { players } = useFirebase();
  
  const standings = useMemo(() => {
    const teams = tournament.teams || [];
    const fixtures = (tournament.fixtures || []).filter(f => f.status === 'completed');
    
    return teams.map(team => {
      const teamFixtures = fixtures.filter(f => f.homeId === team.id || f.awayId === team.id);
      let goals = 0;
      let wins = 0;
      let draws = 0;
      let cleanSheets = 0;

      teamFixtures.forEach(f => {
        const isHome = f.homeId === team.id;
        const myScore = isHome ? (f.homeScore || 0) : (f.awayScore || 0);
        const oppScore = isHome ? (f.awayScore || 0) : (f.homeScore || 0);

        goals += myScore;
        if (myScore > oppScore) wins++;
        else if (myScore === oppScore) draws++;
        if (oppScore === 0) cleanSheets++;
      });

      return {
        team,
        points: calculateFantasyPoints(team.id, tournament),
        goals,
        wins,
        draws,
        cleanSheets,
        played: teamFixtures.length
      };
    }).sort((a, b) => b.points - a.points || b.goals - a.goals);
  }, [tournament]);

  const getMedal = (i: number) => {
    if (i === 0) return <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 border border-yellow-500/30"><Trophy size={16} /></div>;
    if (i === 1) return <div className="w-8 h-8 rounded-lg bg-slate-400/20 flex items-center justify-center text-slate-400 border border-slate-400/30"><Medal size={16} /></div>;
    if (i === 2) return <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-600 border border-amber-600/30"><Medal size={16} /></div>;
    return <span className="text-slate-600 font-black text-xs w-8 text-center">{i + 1}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-[#0a0a12] border border-indigo-500/20 rounded-[2rem] p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Fantasy Power Rankings</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calculated based on Goals, Wins, Draws, and Defense</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
           <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Goal Points</div>
              <div className="text-xs font-black text-white">+4 <span className="text-[10px] text-slate-600">Per Goal</span></div>
           </div>
           <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Victory Points</div>
              <div className="text-xs font-black text-white">+5 <span className="text-[10px] text-slate-600">Per Win</span></div>
           </div>
           <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Defensive Bonus</div>
              <div className="text-xs font-black text-white">+6 <span className="text-[10px] text-slate-600">Per CS</span></div>
           </div>
           <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Draw Points</div>
              <div className="text-xs font-black text-white">+2 <span className="text-[10px] text-slate-600">Per Draw</span></div>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-[3rem_1fr_auto] items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 px-6 gap-6">
          <span>Rank</span>
          <span>Player / Manager</span>
          <div className="flex gap-8 text-right w-[340px] justify-end pr-4">
            <span className="w-10">MP</span>
            <span className="w-10">Goals</span>
            <span className="w-10">Wins</span>
            <span className="w-10">CS</span>
            <span className="w-16 text-yellow-500">Fantasy</span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {standings.map((row, i) => {
            const player = players.find(p => p.id === row.team.id);
            return (
              <motion.div
                key={row.team.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[3rem_1fr_auto] items-center px-6 py-5 rounded-[1.5rem] border border-[#1e1e32] bg-[#0a0a12] group hover:border-indigo-500/30 transition-all gap-6"
              >
                <div className="flex justify-center">{getMedal(i)}</div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#1e1e32] bg-indigo-500/10 relative group">
                    {player?.image ? (
                      <img src={player.image} className="w-full h-full object-cover" alt={row.team.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-500/20"><User size={24} /></div>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-white uppercase tracking-tight">{row.team.name}</div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{row.played} Matches Calculated</div>
                  </div>
                </div>

                <div className="flex gap-8 text-right font-black text-sm w-[340px] justify-end pr-4 items-center">
                  <span className="w-10 text-slate-400">{row.played}</span>
                  <span className="w-10 text-slate-300">{row.goals}</span>
                  <span className="w-10 text-emerald-500">{row.wins}</span>
                  <span className="w-10 text-blue-400">{row.cleanSheets}</span>
                  <div className="w-16">
                     <span className="text-xl text-yellow-500 italic tracking-tighter">{row.points}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tournament, Team, Fixture } from '../../types';
import { useFirebase } from '../../FirebaseContext';
import { calculateFantasyPoints } from '../../lib/fantasy';
import { Medal, Shield, Goal, Star } from 'lucide-react';

interface StandingsTabProps {
  tournament: Tournament;
}

type StandingsFilter = 'overall' | 'home' | 'away' | 'cleansheets';

interface TeamRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  cs: number;
  homeWon: number; homeDraw: number; homeLost: number; homeGF: number; homeGA: number; homePts: number;
  awayWon: number; awayDraw: number; awayLost: number; awayGF: number; awayGA: number; awayPts: number;
}

function computeStandings(tournament: Tournament): TeamRow[] {
  const fixtures = (tournament.fixtures || []).filter(f => f.status === 'completed');
  const teams = tournament.teams || [];

  const rows: Record<string, TeamRow> = {};
  teams.forEach(t => {
    rows[t.id] = {
      team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0, cs: 0,
      homeWon: 0, homeDraw: 0, homeLost: 0, homeGF: 0, homeGA: 0, homePts: 0,
      awayWon: 0, awayDraw: 0, awayLost: 0, awayGF: 0, awayGA: 0, awayPts: 0,
    };
  });

  fixtures.forEach(f => {
    if (f.homeId === null || f.awayId === null || f.homeScore === null || f.awayScore === null) return;
    const home = rows[f.homeId];
    const away = rows[f.awayId];
    if (!home || !away) return;

    const hs = Number(f.homeScore);
    const as_ = Number(f.awayScore);

    home.played++; away.played++;
    home.gf += hs; home.ga += as_; home.homeGF += hs; home.homeGA += as_;
    away.gf += as_; away.ga += hs; away.awayGF += as_; away.awayGA += hs;

    // Clean sheets
    if (as_ === 0) { home.cs++; }
    if (hs === 0) { away.cs++; }

    if (hs > as_) {
      home.won++; home.pts += 3; home.homeWon++; home.homePts += 3;
      away.lost++; away.awayLost++;
    } else if (hs < as_) {
      away.won++; away.pts += 3; away.awayWon++; away.awayPts += 3;
      home.lost++; home.homeLost++;
    } else {
      home.drawn++; home.pts += 1; home.homeDraw++; home.homePts += 1;
      away.drawn++; away.pts += 1; away.awayDraw++; away.awayPts += 1;
    }
  });

  Object.values(rows).forEach(r => {
    r.gd = r.gf - r.ga;
  });

  return Object.values(rows).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}

const filterTabs: { id: StandingsFilter; label: string }[] = [
  { id: 'overall', label: 'Overall' },
  { id: 'home', label: 'Home' },
  { id: 'away', label: 'Away' },
  { id: 'cleansheets', label: 'Clean Sheets' },
];

export function StandingsTab({ tournament }: StandingsTabProps) {
  const { players } = useFirebase();
  const [filter, setFilter] = useState<StandingsFilter>('overall');
  const standings = useMemo(() => computeStandings(tournament), [tournament]);

  const getMedal = (i: number) => {
    if (i === 0) return <Medal className="w-4 h-4 text-yellow-400" />;
    if (i === 1) return <Medal className="w-4 h-4 text-slate-400" />;
    if (i === 2) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-slate-500 font-black text-xs w-4 text-center">{i + 1}</span>;
  };

  const getSortedRows = () => {
    if (filter === 'cleansheets') {
      return [...standings].sort((a, b) => b.cs - a.cs);
    }
    if (filter === 'home') {
      return [...standings].sort((a, b) => {
        if (b.homePts !== a.homePts) return b.homePts - a.homePts;
        return (b.homeGF - b.homeGA) - (a.homeGF - a.homeGA);
      });
    }
    if (filter === 'away') {
      return [...standings].sort((a, b) => {
        if (b.awayPts !== a.awayPts) return b.awayPts - a.awayPts;
        return (b.awayGF - b.awayGA) - (a.awayGF - a.awayGA);
      });
    }
    return standings;
  };

  const sortedRows = getSortedRows();

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-[#0a0a12] rounded-2xl border border-[#1e1e32]">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === tab.id
                ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[2rem_1fr_auto] items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 px-4 gap-4">
        <span>#</span>
        <span>Club</span>
        <div className="flex gap-6 text-right">
          {filter === 'cleansheets' ? (
            <span className="w-8">CS</span>
          ) : filter === 'home' ? (
            <><span className="w-6">W</span><span className="w-6">D</span><span className="w-6">L</span><span className="w-10">GF:GA</span><span className="w-8">PTS</span></>
          ) : filter === 'away' ? (
            <><span className="w-6">W</span><span className="w-6">D</span><span className="w-6">L</span><span className="w-10">GF:GA</span><span className="w-8">PTS</span></>
          ) : (
            <><span className="w-6">P</span><span className="w-6">W</span><span className="w-6">D</span><span className="w-6">L</span><span className="w-10">GD</span><span className="w-8">PTS</span></>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {sortedRows.map((row, i) => {
          const isTopThree = i < 3;
          return (
            <motion.div
              key={row.team.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`grid grid-cols-[2rem_1fr_auto] items-center px-4 py-4 rounded-2xl border gap-4 transition-all ${
                isTopThree
                  ? 'border-indigo-500/20 bg-indigo-500/5'
                  : 'border-[#1e1e32] bg-[#0a0a12]'
              }`}
            >
              {/* Position */}
              <div className="flex items-center justify-center">
                {getMedal(i)}
              </div>

              {/* Team */}
              <div className="flex items-center gap-3 min-w-0">
                {(() => {
                  const player = players.find(p => p.id === row.team.id);
                  if (player?.image) {
                    return <img src={player.image} className="w-9 h-9 rounded-xl object-cover border border-[#1e1e32] flex-shrink-0" alt={row.team.name} />;
                  }
                  return (
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs flex-shrink-0">
                      {row.team.shortName ?? row.team.name.substring(0, 3).toUpperCase()}
                    </div>
                  );
                })()}
                <span className="font-black text-sm text-white truncate">{row.team.name}</span>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-right font-black text-sm">
                {filter === 'cleansheets' ? (
                  <span className="w-8 text-emerald-400">{row.cs}</span>
                ) : filter === 'home' ? (
                  <>
                    <span className="w-6 text-slate-300">{row.homeWon}</span>
                    <span className="w-6 text-slate-400">{row.homeDraw}</span>
                    <span className="w-6 text-slate-500">{row.homeLost}</span>
                    <span className="w-10 text-slate-400">{row.homeGF}:{row.homeGA}</span>
                    <span className="w-8 text-indigo-400">{row.homePts}</span>
                  </>
                ) : filter === 'away' ? (
                  <>
                    <span className="w-6 text-slate-300">{row.awayWon}</span>
                    <span className="w-6 text-slate-400">{row.awayDraw}</span>
                    <span className="w-6 text-slate-500">{row.awayLost}</span>
                    <span className="w-10 text-slate-400">{row.awayGF}:{row.awayGA}</span>
                    <span className="w-8 text-indigo-400">{row.awayPts}</span>
                  </>
                ) : (
                  <>
                    <span className="w-6 text-slate-400">{row.played}</span>
                    <span className="w-6 text-slate-300">{row.won}</span>
                    <span className="w-6 text-slate-400">{row.drawn}</span>
                    <span className="w-6 text-slate-500">{row.lost}</span>
                    <span className={`w-10 ${row.gd > 0 ? 'text-emerald-400' : row.gd < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                      {row.gd > 0 ? '+' : ''}{row.gd}
                    </span>
                    <span className="w-8 text-indigo-400">{row.pts}</span>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

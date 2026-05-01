import React, { useMemo } from 'react';
import { Tournament, Fixture, Team } from '../../types';
import { useFirebase } from '../../FirebaseContext';

interface BracketViewProps {
  tournament: Tournament;
}

interface BracketMatch {
  fixture: Fixture;
  home: Team | null;
  away: Team | null;
  winner: Team | null;
}

interface Round {
  label: string;
  matches: BracketMatch[];
}

const ROUND_LABELS = ['R1', 'R2', 'QF', 'SF', 'F', '3rd Place'];
const ROUND_LABELS_FULL = ['Round 1', 'Round 2', 'Quarter Finals', 'Semi Finals', 'Final'];

function getRoundLabel(roundIndex: number, totalRounds: number): string {
  const reverseIndex = totalRounds - 1 - roundIndex;
  if (reverseIndex === 0) return 'Final';
  if (reverseIndex === 1) return 'Semi Finals';
  if (reverseIndex === 2) return 'Quarter Finals';
  if (reverseIndex === 3) return 'Round 2';
  return `Round ${roundIndex + 1}`;
}

export function BracketView({ tournament }: BracketViewProps) {
  const { players } = useFirebase();
  const teams = tournament.teams || [];
  const fixtures = (tournament.fixtures || []).filter(f => f.stage === 'knockout');

  const getTeam = (id: string | null): Team | null =>
    id ? (teams.find(t => t.id === id) ?? null) : null;

  // Group fixtures by round
  const rounds = useMemo((): Round[] => {
    const byRound: Record<number, Fixture[]> = {};
    fixtures.forEach(f => {
      if (!byRound[f.round]) byRound[f.round] = [];
      byRound[f.round].push(f);
    });

    const sortedRoundNums = Object.keys(byRound).map(Number).sort((a, b) => a - b);
    const totalRounds = sortedRoundNums.length;

    return sortedRoundNums.map((roundNum, i) => ({
      label: getRoundLabel(i, totalRounds),
      matches: byRound[roundNum]
        .sort((a, b) => (a.matchIndex ?? 0) - (b.matchIndex ?? 0))
        .map(f => {
          const home = getTeam(f.homeId);
          const away = getTeam(f.awayId);
          let winner: Team | null = null;
          if (f.status === 'completed' && f.homeScore !== null && f.awayScore !== null) {
            winner = f.homeScore > f.awayScore ? home : f.awayScore > f.homeScore ? away : null;
          }
          return { fixture: f, home, away, winner };
        }),
    }));
  }, [fixtures, teams]);

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-20 text-slate-600">
        <div className="text-4xl mb-4">🏆</div>
        <p className="font-black text-lg text-slate-500">No knockout fixtures yet</p>
        <p className="text-sm text-slate-600 mt-2">Bracket will appear once knockout stage begins</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-6">
      <div className="inline-flex gap-0 min-w-max">
        {rounds.map((round, roundIdx) => {
          const isLast = roundIdx === rounds.length - 1;
          const totalMatchesInRound = round.matches.length;

          return (
            <div key={roundIdx} className="flex flex-col">
              {/* Round Label */}
              <div className="px-4 py-2 mb-4 text-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${
                  isLast ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-[#0a0a12] text-slate-500 border border-[#1e1e32]'
                }`}>
                  {round.label}
                </span>
              </div>

              {/* Matches Column */}
              <div className="flex flex-col justify-around flex-1 gap-0" style={{ minHeight: `${Math.max(totalMatchesInRound, 1) * 120}px` }}>
                {round.matches.map((match, matchIdx) => (
                  <div key={match.fixture.id} className="flex items-center" style={{ flex: 1 }}>
                    {/* Match Card */}
                    <div className="mx-3 my-2 w-52 rounded-xl border border-[#1e1e32] bg-[#0a0a12] overflow-hidden flex-shrink-0">
                      {/* Home Team */}
                      <MatchSlot
                        team={match.home}
                        score={match.fixture.homeScore}
                        isWinner={match.winner?.id === match.home?.id}
                        isCompleted={match.fixture.status === 'completed'}
                        position="home"
                        players={players}
                      />
                      <div className="h-px bg-[#1e1e32]" />
                      {/* Away Team */}
                      <MatchSlot
                        team={match.away}
                        score={match.fixture.awayScore}
                        isWinner={match.winner?.id === match.away?.id}
                        isCompleted={match.fixture.status === 'completed'}
                        position="away"
                        players={players}
                      />
                    </div>

                    {/* Connector Line (not on last round) */}
                    {!isLast && (
                      <div className="flex items-center" style={{ width: '12px' }}>
                        <div className="w-3 h-px bg-[#1e1e32]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MatchSlotProps {
  team: Team | null;
  score: number | null;
  isWinner: boolean;
  isCompleted: boolean;
  position: 'home' | 'away';
  players: any[];
}

function MatchSlot({ team, score, isWinner, isCompleted, players }: MatchSlotProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 transition-colors ${
      isWinner ? 'bg-emerald-500/10' : ''
    }`}>
      {(() => {
        const player = players.find(p => p.id === team?.id);
        if (player?.image) {
          return <img src={player.image} className="w-6 h-6 rounded object-cover flex-shrink-0" alt={team?.name} />;
        }
        return (
          <div className={`w-6 h-6 rounded flex items-center justify-center text-[8px] font-black flex-shrink-0 ${
            team ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#1e1e32] text-slate-600'
          }`}>
            {team ? (team.shortName ?? team.name.substring(0, 3).toUpperCase()) : '?'}
          </div>
        );
      })()}
      <span className={`flex-1 font-black text-xs truncate ${
        isWinner ? 'text-emerald-400' : team ? 'text-slate-300' : 'text-slate-600'
      }`}>
        {team?.name ?? 'TBD'}
      </span>
      {isCompleted && score !== null && (
        <span className={`font-black text-sm flex-shrink-0 min-w-[1.25rem] text-center ${
          isWinner ? 'text-white' : 'text-slate-500'
        }`}>
          {score}
        </span>
      )}
    </div>
  );
}

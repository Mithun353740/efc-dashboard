import { Tournament, Team, Fixture } from '../types';

export function calculateFantasyPoints(teamId: string, tournament: Tournament): number {
  const fixtures = (tournament.fixtures || []).filter(f => f.status === 'completed');
  let points = 0;

  fixtures.forEach(f => {
    const isHome = f.homeId === teamId;
    const isAway = f.awayId === teamId;
    
    if (!isHome && !isAway) return;

    const myScore = isHome ? (f.homeScore || 0) : (f.awayScore || 0);
    const opponentScore = isHome ? (f.awayScore || 0) : (f.homeScore || 0);

    // Goals Scored: +4 per goal
    points += myScore * 4;

    // Win/Draw: +5 for win, +2 for draw
    if (myScore > opponentScore) {
      points += 5;
    } else if (myScore === opponentScore) {
      points += 2;
    }

    // Clean Sheet: +6
    if (opponentScore === 0) {
      points += 6;
    }
  });

  return points;
}

/**
 * A subset of player stats used for season/tournament breakdowns.
 * Stored directly on the Player document — no match reads needed by the frontend.
 */
export interface PartialPlayerStats {
  win: number;
  loss: number;
  draw: number;
  goalsScored: number;
  goalsConceded: number;
  form: string[]; // last 5 results ['W','L','D',...]
}

export interface Player {
  id: string;
  name: string;
  number: string;
  position?: string;
  ovr: number;
  win: number;
  loss: number;
  draw: number;
  goalsScored: number;
  goalsConceded: number;
  image: string;
  form: string[];
  device?: string;
  uid?: string;
  role?: 'admin' | 'player';

  /**
   * Pre-computed per-season stats.
   * Key: season name e.g. "2026 Season"
   */
  seasonStats?: Record<string, PartialPlayerStats>;

  /**
   * Pre-computed per-tournament stats (scoped to a season).
   * Key: `${seasonName}__${canonicalTournamentName}` e.g. "2026 Season__QVFC ELITE LEAGUE CUP DIVISION 1"
   */
  tournamentStats?: Record<string, PartialPlayerStats>;

  /**
   * Unix ms timestamp of last stat computation. Used for cache validation.
   */
  statsLastUpdated?: number;

  /**
   * Monotonic integer. Bump STATS_VERSION in store.ts to force global recompute on logic change.
   */
  statsVersion?: number;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  initials: string;
  playerId?: string;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  p1Id: string;
  p1Name: string;
  p1Score: number;
  p2Id?: string;
  p2Name: string;
  p2Score: number;
  tournament?: string;
}

export type { Tournament, Fixture, Team, TournamentFormat } from './types/tournament';

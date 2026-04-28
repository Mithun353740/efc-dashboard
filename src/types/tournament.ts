export type TournamentFormat = 'league' | 'knockout' | 'groups' | 'round_robin';
export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  cs: number; // clean sheets
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  form?: string[];
  home?: TeamStats;
  away?: TeamStats;
  overall?: TeamStats;
}

export interface Fixture {
  id: string;
  homeId: string | null;
  awayId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  round: number;
  stage?: string;
  leg?: number;
  matchIndex?: number;
  updatedAt?: number;
  date?: string | null;
  time?: string | null;
  venue?: string | null;
  groupId?: number;
  pinned?: boolean;
}

export interface Group {
  id: number;
  name: string;
  teamIds: string[];
}

export interface TournamentScheduling {
  matchDays?: string[];
  startTime?: string;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentFormat;
  archived: boolean;
  logo?: string;
  season?: string;
  currentStage?: string;
  teams: Team[];
  fixtures: Fixture[];
  groups?: Group[];
  scheduling?: TournamentScheduling;
  createdAt?: number;
  /** ISO date string e.g. "2026-05-10" — shows as Upcoming badge on cards */
  startingDate?: string;
  /** Player IDs who have self-registered for this tournament */
  registeredPlayerIds?: string[];
  /** Max teams allowed via self-registration (undefined = no limit) */
  maxTeams?: number;
  /**
   * ISO datetime-local string e.g. "2026-05-10T18:00"
   * Match day window starts — register button hides, countdown switches to "ends in".
   */
  matchDayStart?: string;
  /**
   * ISO datetime-local string e.g. "2026-05-10T22:00"
   * Match day window ends — countdown shows "Match Day Over".
   */
  matchDayEnd?: string;
}

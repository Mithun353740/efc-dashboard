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
  fantasyPoints?: number;
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
}

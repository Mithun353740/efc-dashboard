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

  // ── Club Zone fields (optional — only set when club system is active) ─────
  clubId?: string;
  clubName?: string;       // denormalized club name for display
  isClubOwner?: boolean;   // true if this player manages a club
  isListed?: boolean;      // true if currently on the transfer market
  listingPrice?: number;   // asking price on market
  marketValue?: number;    // admin-set estimated value
  primaryColor?: string;   // club primary colour (hex)
  secondaryColor?: string; // club secondary colour (hex)
  clubStats?: ClubStats;   // isolated club-season stats (never affects global OVR)
  clubContract?: {
    type: 'matches' | 'days';
    amount: number; // matches remaining OR expiration timestamp (ms)
  };

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

// ─── CLUB ZONE TYPES ──────────────────────────────────────────────────────────

/** Isolated per-club-season stats. Never written to the global OVR calculation. */
export interface ClubStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  clubOvr: number;  // computed separately from global OVR
  form: string[];   // last 5: ['W','L','D',...]
}

/** A QVFC Club entity managed by one of the club owners. */
export interface Club {
  id: string;
  name: string;
  shortName: string;    // 3-letter code e.g. "QVC"
  logo?: string;        // base64 or URL (high quality)
  primaryColor: string;   // hex e.g. "#8b5cf6"
  secondaryColor: string; // hex e.g. "#f59e0b"
  ownerId: string;        // Player ID of the club manager
  ownerName?: string;     // denormalized for display
  budget: number;         // virtual currency (e.g. 50_000_000)
  squadIds: string[];     // Player IDs in this club's squad
  createdAt: number;
}

/** One slot in the matchday schedule. */
export interface MatchdaySlot {
  matchday: number;
  date: string;  // "YYYY-MM-DD"
  time: string;  // "HH:MM"
}

export interface ClubTournament {
  id: string;
  name: string;      // e.g. "Vortex Winter Cup"
  season: string;    // e.g. "QVFC Club Season 2026/2027"
  status: 'active' | 'paused' | 'postponed' | 'completed';
  statusReason?: string;
  createdAt: number;
}

export interface ClubFixtureSubMatch {
  id: string;        // sub-match ID
  p1Id: string;      // Home player ID
  p1Name: string;
  p2Id: string;      // Away player ID
  p2Name: string;
  p1Score: number | null;
  p2Score: number | null;
}

export interface ClubFixture {
  id: string;
  tournamentId: string;
  tournamentName: string;
  homeClubId: string;
  awayClubId: string;
  homeClubName: string;
  awayClubName: string;
  matchupType: 'home_away' | 'random';
  lineupSize: number; // e.g., 4 (meaning 4v4)
  subLimit: number;   // e.g., 2
  status: 'scheduled' | 'lineups_pending' | 'matchups_pending' | 'active' | 'completed';
  homeLineupIds: string[]; // players selected by Home owner
  awayLineupIds: string[]; // players selected by Away owner
  subMatches: ClubFixtureSubMatch[]; // the actual 1v1 pairings
  createdAt: number;
}

/** Club system global configuration (stored as settings/clubConfig). */
export interface ClubSystemConfig {
  season: string;                  // e.g. "QVFC Club Season 2026"
  startingBudget: number;          // default budget for new clubs
  transferWindowOpen: boolean;
  transferWindowCloseDate?: string; // ISO date string
  currentMatchday: number;
  totalMatchdays: number;
  matchdaySchedule: MatchdaySlot[];
  linkedTournamentId?: string;      // optional link to a tournament
  contractsActive: boolean;         // global toggle for contract economy
  defaultContractType: 'matches' | 'days';
  defaultContractAmount: number;    // matches or days
}

/** A player listing on the transfer market. */
export interface MarketListing {
  id: string;
  playerId: string;
  playerName: string;
  playerImage: string;
  playerOvr: number;
  fromClubId: string;
  fromClubName: string;
  fromClubColor: string;
  price: number;
  listedAt: number;
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

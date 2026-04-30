import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─────────────────────────────────────────────────────────────────────────────
// TOURNAMENT NAME NORMALISATION
// Maps historical / legacy tournament names to their single canonical form.
// All stat keys in seasonStats / tournamentStats use the canonical name so
// data written at different points in time is always merged correctly.
// ─────────────────────────────────────────────────────────────────────────────

const LEGACY_NAME_MAP: Record<string, string> = {
  'qvfc elite league cup': 'QVFC ELITE LEAGUE CUP DIVISION 1',
  'qvfc elite league cup div 1': 'QVFC ELITE LEAGUE CUP DIVISION 1',
  'qvfc elite league cup division 1': 'QVFC ELITE LEAGUE CUP DIVISION 1',
  'qvfc elite league cup div 2': 'QVFC ELITE LEAGUE CUP DIVISION 2',
  'qvfc elite league cup division 2': 'QVFC ELITE LEAGUE CUP DIVISION 2',
  'vortex champions cup': 'VORTEX CHAMPIONS CUP',
  'vortex domestic cup': 'VORTEX DOMESTIC CUP',
};

/**
 * Returns the canonical (normalised, upper-cased) name for a tournament.
 * Uses the legacy map so old match records are folded into the correct bucket.
 */
export function resolveCanonicalTournamentName(name: string): string {
  const lower = name.trim().toLowerCase();
  return LEGACY_NAME_MAP[lower] ?? name.trim().toUpperCase();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeasonInfo(date: Date) {
  let start = new Date(2026, 3, 17, 0, 0, 0, 0); // April 17, 2026 (Anchor)
  if (date >= start) {
    while (true) {
      let end = new Date(start);
      end.setMonth(end.getMonth() + 9);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      if (date <= end) {
        const sY = start.getFullYear();
        const eY = end.getFullYear();
        return { name: sY === eY ? `${sY} Season` : `${sY}/${eY}`, start, end };
      }
      start.setMonth(start.getMonth() + 9);
      if (start.getFullYear() > 2100) break;
    }
  } else {
    while (true) {
      let nextStart = new Date(start);
      start = new Date(start);
      start.setMonth(start.getMonth() - 9);
      let end = new Date(nextStart);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      if (date >= start && date <= end) {
        const sY = start.getFullYear();
        const eY = end.getFullYear();
        return { name: sY === eY ? `${sY} Season` : `${sY}/${eY}`, start, end };
      }
      if (start.getFullYear() < 2020) break;
    }
  }
  return { name: "Legacy", start: null, end: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER FORM GRADE (used in Auction + Player Cards)
// Grade is calculated from: win rate (60%), OVR (20%), goal difference (20%)
// Requires minimum 5 matches — ungraded players return 'E'
// ─────────────────────────────────────────────────────────────────────────────

export type PlayerGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export const GRADE_COLORS: Record<PlayerGrade, string> = {
  S: '#f59e0b',  // gold
  A: '#8b5cf6',  // violet
  B: '#3b82f6',  // blue
  C: '#22c55e',  // green
  D: '#94a3b8',  // slate
  E: '#475569',  // dark slate
};

export const GRADE_BASE_PRICES: Record<PlayerGrade, number> = {
  S: 2_000_000,
  A: 1_500_000,
  B: 1_000_000,
  C:   750_000,
  D:   500_000,
  E:   300_000,
};

export function getPlayerGrade(player: { win: number; loss: number; draw: number; ovr: number; goalsScored: number; goalsConceded: number }): PlayerGrade {
  const total = player.win + player.loss + player.draw;
  if (total < 5) return 'E'; // Not enough matches to grade

  const winRate = player.win / total; // 0–1
  const ovrNorm = Math.min(player.ovr, 99) / 99; // 0–1
  const gd = player.goalsScored - player.goalsConceded;
  const gdNorm = Math.max(0, Math.min(1, (gd + 50) / 100)); // normalize GD to 0–1 scale

  // Weighted score: 60% win rate, 20% OVR, 20% goal diff
  const score = (winRate * 0.60) + (ovrNorm * 0.20) + (gdNorm * 0.20);

  if (score >= 0.80) return 'S';
  if (score >= 0.65) return 'A';
  if (score >= 0.50) return 'B';
  if (score >= 0.35) return 'C';
  if (score >= 0.20) return 'D';
  return 'E';
}

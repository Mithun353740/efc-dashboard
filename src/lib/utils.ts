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

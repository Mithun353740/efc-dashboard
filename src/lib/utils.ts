import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

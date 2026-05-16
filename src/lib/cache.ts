/**
 * Persistent localStorage cache layer.
 * Survives page refreshes (unlike the in-memory TTL cache in store.ts).
 * TTL: 10 minutes. On expiry the entry is evicted and Firestore is queried once.
 *
 * Keys are versioned — changing CACHE_VERSION below auto-busts all stale entries.
 */

const CACHE_VERSION = 'v2';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface PersistedEntry<T> {
  data: T;
  savedAt: number;
  version: string;
}

/** Write data to localStorage under a versioned key. Fails silently in private mode / full storage. */
export function persistToStorage<T>(key: string, data: T): void {
  try {
    const entry: PersistedEntry<T> = {
      data,
      savedAt: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(`efc_${key}_${CACHE_VERSION}`, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/** Read and validate a cached entry. Returns null on miss, expiry, or version mismatch. */
export function hydrateFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`efc_${key}_${CACHE_VERSION}`);
    if (!raw) return null;
    const entry: PersistedEntry<T> = JSON.parse(raw);
    if (!entry || entry.version !== CACHE_VERSION) return null;
    if (Date.now() - entry.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(`efc_${key}_${CACHE_VERSION}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Evict one key (or all efc_ keys when called with no argument). */
export function invalidateStorage(key?: string): void {
  try {
    if (key) {
      localStorage.removeItem(`efc_${key}_${CACHE_VERSION}`);
    } else {
      Object.keys(localStorage)
        .filter(k => k.startsWith('efc_'))
        .forEach(k => localStorage.removeItem(k));
    }
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Session-level Firestore read counter — exposed for admin monitoring
// ─────────────────────────────────────────────────────────────────────────────

let _sessionReadCount = 0;

/** Call this every time a Firestore getDocs/getDoc fires (count = number of docs returned). */
export function trackRead(count = 1): void {
  _sessionReadCount += count;
  if (_sessionReadCount > 0 && _sessionReadCount % 100 === 0) {
    console.warn(
      `[Firestore] ⚠️ Session read count hit ${_sessionReadCount}. ` +
      `Review recent queries for unbounded fetches.`
    );
  }
}

export function getSessionReadCount(): number {
  return _sessionReadCount;
}

export function resetSessionReadCount(): void {
  _sessionReadCount = 0;
}

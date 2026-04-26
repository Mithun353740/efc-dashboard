import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Player, Leader, MatchRecord, Tournament } from './types';
import {
  subscribeToPlayers,
  subscribeToLeaders,
  subscribeToMatches,
  subscribeToTournaments,
  subscribeToSystemLocks,
  fetchSystemLocks,
  fetchLastUpdated,
  sortRankedPlayers,
  testFirestoreConnection,
  computeGlobalElo,
  calculateOvrHybrid,
  addMatch,
  fetchPlayers,
  fetchLeaders,
  fetchMatches,
  fetchTournaments
} from './lib/store';

// ─────────────────────────────────────────────────────────────────────────────
// Cache keys & helpers
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_KEYS = {
  players:     'vortex_players_cache',
  leaders:     'vortex_leaders_cache',
  matches:     'vortex_matches_cache',
  tournaments: 'vortex_tournaments_cache',
  // Stores the server's lastUpdated timestamp that was current when we last fetched
  serverTs:    'vortex_cache_server_ts',
};

/** How often (ms) public users check the ONE timestamp document. */
const PUBLIC_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

function readCache<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeCache(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* storage full */ }
}

function readCachedServerTs(): number {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.serverTs);
    return raw ? Number(raw) : 0;
  } catch { return 0; }
}

function writeCachedServerTs(ts: number) {
  try { localStorage.setItem(CACHE_KEYS.serverTs, String(ts)); } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────────────────────────
interface FirebaseContextType {
  players: Player[];
  rankedPlayers: Player[];
  leaders: Leader[];
  matches: MatchRecord[];
  tournaments: Tournament[];
  systemLocks: Record<string, boolean>;
  isLoading: boolean;
  dbError: string | null;
  hasPendingWrites: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [systemLocks, setSystemLocks] = useState<Record<string, boolean>>({});
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isMinLoadTimePassed, setIsMinLoadTimePassed] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Minimum delay for branding aesthetics
    const minLoadTimer = setTimeout(() => {
      if (mounted) setIsMinLoadTimePassed(true);
    }, 2500);

    // ─────────────────────────────────────────────────────────────────────────
    // Error handler — triggered by store.ts when Firestore errors occur
    // ─────────────────────────────────────────────────────────────────────────
    const errorHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!mounted || !customEvent.detail?.error) return;

      const errStr = String(customEvent.detail.error).toLowerCase();

      // Load from cache ONLY if we currently have no data in memory
      if (players.length === 0) {
        const cachedP = readCache<Player>(CACHE_KEYS.players);
        if (cachedP.length > 0) setPlayers(cachedP);
      }
      if (leaders.length === 0) {
        const cachedL = readCache<Leader>(CACHE_KEYS.leaders);
        if (cachedL.length > 0) setLeaders(cachedL);
      }
      if (matches.length === 0) {
        const cachedM = readCache<MatchRecord>(CACHE_KEYS.matches);
        if (cachedM.length > 0) setMatches(cachedM);
      }
      if (tournaments.length === 0) {
        const cachedT = readCache<Tournament>(CACHE_KEYS.tournaments);
        if (cachedT.length > 0) setTournaments(cachedT);
      }

      setIsLoadingPlayers(false);
      setIsLoadingLeaders(false);
      setIsLoadingMatches(false);

      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || errStr.includes('exceeded')) {
        setDbError('QUOTA_EXCEEDED');
      } else {
        setDbError('DATABASE_ERROR');
      }
    };
    window.addEventListener('firestore-error', errorHandler);

    // ─────────────────────────────────────────────────────────────────────────
    // Ensure anonymous auth for guests
    // ─────────────────────────────────────────────────────────────────────────
    import('./firebase').then(({ loginAnonymously, auth }) => {
      if (!auth.currentUser) {
        loginAnonymously().catch(err => console.warn('[Firebase] Anonymous login failed:', err));
      }
    });

    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    let unsubPlayers: () => void = () => {};
    let unsubLeaders: () => void = () => {};
    let unsubMatches: () => void = () => {};
    let unsubTournaments: () => void = () => {};

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN PATH: Full real-time subscriptions — unchanged
    // ─────────────────────────────────────────────────────────────────────────
    if (isAdmin) {
      // Probe server health once for admins
      testFirestoreConnection();

      unsubPlayers = subscribeToPlayers((data, pending) => {
        if (!mounted) return;
        setPlayers(data);
        setHasPendingWrites(pending);
        writeCache(CACHE_KEYS.players, data);
        setIsLoadingPlayers(false);
      });

      unsubLeaders = subscribeToLeaders((data, pending) => {
        if (!mounted) return;
        setLeaders(data);
        setHasPendingWrites(pending);
        writeCache(CACHE_KEYS.leaders, data);
        setIsLoadingLeaders(false);
      });

      unsubMatches = subscribeToMatches((data, pending) => {
        if (!mounted) return;
        setMatches(data);
        setHasPendingWrites(pending);
        writeCache(CACHE_KEYS.matches, data);
        setIsLoadingMatches(false);
      });

      unsubTournaments = subscribeToTournaments((data, pending) => {
        if (!mounted) return;
        setTournaments(data);
        setHasPendingWrites(pending);
        writeCache(CACHE_KEYS.tournaments, data);
      });

      // Admin still gets real-time locks listener
      const unsubLocks = subscribeToSystemLocks((locks) => {
        if (mounted) setSystemLocks(locks);
      });
      // Merge into cleanup
      const origUnsub = unsubPlayers;
      unsubPlayers = () => { origUnsub(); unsubLocks(); };

    } else {
      // ───────────────────────────────────────────────────────────────────────
      // PUBLIC USER PATH: Smart cache-first with 10-minute timestamp check
      //
      // HOW IT WORKS:
      //   1. Load whatever is in localStorage immediately (instant display)
      //   2. Check ONE tiny Firestore document (settings/meta) to get the
      //      server's lastUpdated timestamp — costs exactly 1 read
      //   3. Compare to the cached timestamp:
      //      - SAME  → data is still fresh → show cache, done (0 more reads)
      //      - NEWER → admin changed something → fetch all collections
      //   4. Repeat step 2-3 every 10 minutes & when tab regains focus
      //
      // STALE CACHE FIX:
      //   When the site loads from cache due to quota error, we store the
      //   last-known server timestamp. When quota resets, the next check
      //   will find a newer server timestamp and pull the fresh data.
      // ───────────────────────────────────────────────────────────────────────

      // Step 1: Serve cache immediately for instant rendering
      const cachedPlayers = readCache<Player>(CACHE_KEYS.players);
      const cachedLeaders = readCache<Leader>(CACHE_KEYS.leaders);
      const cachedMatches = readCache<MatchRecord>(CACHE_KEYS.matches);
      const cachedTournaments = readCache<Tournament>(CACHE_KEYS.tournaments);

      if (cachedPlayers.length > 0) setPlayers(cachedPlayers);
      if (cachedLeaders.length > 0) setLeaders(cachedLeaders);
      if (cachedMatches.length > 0) setMatches(cachedMatches);
      if (cachedTournaments.length > 0) setTournaments(cachedTournaments);

      const hasAnyCache = cachedPlayers.length > 0;

      // Fetch locks once (not a permanent listener)
      fetchSystemLocks().then(locks => {
        if (mounted) setSystemLocks(locks);
      });

      // Step 2 & 3: The core smart-fetch function
      const smartFetch = async (forceFullFetch = false) => {
        try {
          const serverTs = await fetchLastUpdated(); // 1 read
          const cachedTs = readCachedServerTs();

          const isStale = forceFullFetch || serverTs === 0 || serverTs > cachedTs;

          if (!isStale) {
            // Cache is fresh — nothing to do
            console.log('[SmartFetch] Cache is fresh (server ts unchanged). Serving from cache.');
            // Still mark loading as done if we haven't yet
            if (mounted) {
              setIsLoadingPlayers(false);
              setIsLoadingLeaders(false);
              setIsLoadingMatches(false);
            }
            return;
          }

          // Data has changed — fetch everything fresh
          console.log('[SmartFetch] Server timestamp is newer. Fetching fresh data...');
          const [p, l, m, t] = await Promise.all([
            fetchPlayers(),
            fetchLeaders(),
            fetchMatches(),
            fetchTournaments(),
          ]);

          if (!mounted) return;

          setPlayers(p);
          setLeaders(l);
          setMatches(m);
          setTournaments(t);
          setIsLoadingPlayers(false);
          setIsLoadingLeaders(false);
          setIsLoadingMatches(false);
          setDbError(null); // Clear any previous quota error now that we have fresh data

          // Persist fresh data to cache
          writeCache(CACHE_KEYS.players, p);
          writeCache(CACHE_KEYS.leaders, l);
          writeCache(CACHE_KEYS.matches, m);
          writeCache(CACHE_KEYS.tournaments, t);
          // Record the server timestamp we just synced to
          writeCachedServerTs(serverTs);

        } catch (err) {
          console.warn('[SmartFetch] Failed:', err);
          // If we already loaded from cache above, just mark loading done
          if (mounted) {
            setIsLoadingPlayers(false);
            setIsLoadingLeaders(false);
            setIsLoadingMatches(false);
          }
        }
      };

      // If we have no cache at all, do a full fetch immediately without checking timestamp
      smartFetch(!hasAnyCache);

      // Re-check timestamp every 10 minutes
      const intervalId = setInterval(() => smartFetch(), PUBLIC_CHECK_INTERVAL);

      // Re-check when user switches back to this tab (phone users especially)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && mounted) {
          smartFetch();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup
      unsubPlayers = () => {
        clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Fallback: don't hang forever if Firestore takes too long
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoadingPlayers(false);
        setIsLoadingLeaders(false);
        setIsLoadingMatches(false);
      }
    }, 6000);

    // ─────────────────────────────────────────────────────────────────────────
    // TOURNAMENT INTEGRATION: Handle messages from the embedded Tournament System
    // ─────────────────────────────────────────────────────────────────────────
    const handleTournamentMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      const { type, match } = event.data;

      // 1. Respond to player data requests
      if (type === 'REQUEST_PLAYERS' && event.source) {
        (event.source as Window).postMessage({
          type: 'PLAYERS_LIST',
          players: playersRef.current
        }, { targetOrigin: '*' });
      }

      // 2. Handle automated match recording
      if (type === 'MATCH_COMPLETED' && match) {
        const { p1Id, p1Score, p2Id, p2Score, tournament } = match;
        const player1 = playersRef.current.find(p => p.id === p1Id);
        const player2 = playersRef.current.find(p => p.id === p2Id);

        if (player1) {
          console.log('[Dashboard] Auto-recording tournament match:', match);
          addMatch(player1, p1Score, p2Score, player2, matchesRef.current, tournament)
            .catch(err => console.error('[Dashboard] Match recording failed:', err));
        }
      }
    };

    window.addEventListener('message', handleTournamentMessage);

    return () => {
      mounted = false;
      window.removeEventListener('firestore-error', errorHandler);
      window.removeEventListener('message', handleTournamentMessage);
      unsubPlayers();
      unsubLeaders();
      unsubMatches();
      unsubTournaments();
      clearTimeout(timeout);
      clearTimeout(minLoadTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync refs for the message handler
  const playersRef = useRef(players);
  const matchesRef = useRef(matches);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { matchesRef.current = matches; }, [matches]);

  const elos = React.useMemo(() => computeGlobalElo(players, matches), [players, matches]);
  const enrichedPlayers = players.map(p => ({
    ...p,
    ovr: calculateOvrHybrid(p, elos[p.id])
  }));

  const enrichedLeaders = leaders.map(l => {
    if (l.playerId) {
      const p = enrichedPlayers.find(player => player.id === l.playerId);
      if (p) return { ...l, name: p.name, image: p.image };
    }
    return l;
  });

  const isLoading = isLoadingPlayers || isLoadingLeaders || isLoadingMatches || !isMinLoadTimePassed;

  const value = {
    players: enrichedPlayers,
    rankedPlayers: sortRankedPlayers(enrichedPlayers),
    leaders: enrichedLeaders,
    matches,
    tournaments,
    systemLocks,
    isLoading,
    dbError,
    hasPendingWrites
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

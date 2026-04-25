/**
 * KickOff Fixture Generation Engine v2.0
 * - Auto: Berger circle round-robin; seeded bracket knockout; no team twice per matchday
 * - Semi-Auto: User pins specific matchups; algorithm fills remaining slots
 * - Full Manual: User builds every fixture round by round
 */

// ─── UNIQUE ID HELPER ─────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── BERGER CIRCLE ROUND-ROBIN ────────────────────────────────────────────────
// Guarantees every team plays exactly once per matchday (round).
// With odd teams, one team gets a BYE per round (skipped from fixture list).
export function bergerRoundRobin(teams, legs = 1, stage = 'league', roundOffset = 0) {
  const list = [...teams];
  const hasBye = list.length % 2 !== 0;
  if (hasBye) list.push({ id: '__bye__', name: 'BYE' });

  const n = list.length;
  const rounds = n - 1;
  const perRound = n / 2;
  const fixtures = [];

  for (let leg = 0; leg < legs; leg++) {
    const isReturnLeg = leg % 2 === 1;
    const wheel = [list[0], ...list.slice(1)]; // pin index 0, rotate rest

    for (let r = 0; r < rounds; r++) {
      const matchday = r + 1 + roundOffset + leg * rounds;
      // Build pairs for this round
      const pairs = [];
      for (let i = 0; i < perRound; i++) {
        const home = wheel[i];
        const away = wheel[n - 1 - i];
        if (home.id === '__bye__' || away.id === '__bye__') continue;
        pairs.push(isReturnLeg
          ? { homeId: away.id, awayId: home.id }
          : { homeId: home.id, awayId: away.id }
        );
      }
      pairs.forEach(p => {
        fixtures.push({
          id: `fix-${uid()}`,
          homeId: p.homeId,
          awayId: p.awayId,
          homeScore: null, awayScore: null,
          status: 'upcoming',
          round: matchday,
          stage,
          date: null, venue: null, time: null
        });
      });
      // Rotate: keep index 0 fixed, rotate index 1..n-1
      wheel.splice(1, 0, wheel.pop());
    }
  }
  return fixtures;
}

// ─── SEEDED KNOCKOUT BRACKET ──────────────────────────────────────────────────
// Seeds top half vs bottom half. BYE teams auto-advance.
// Guarantees at most 1 match per team per round.
export function seededKnockout(teams, startRound = 1, legs = 1) {
  // Pad to next power of 2
  let bracketSize = 1;
  while (bracketSize < teams.length) bracketSize *= 2;

  const seeded = [...teams];
  // Seed: 1 vs last, 2 vs second-last, etc.
  const slots = new Array(bracketSize).fill(null);
  // Standard seeding positions for a bracket
  const seedOrder = buildSeedOrder(bracketSize);
  seeded.forEach((team, i) => { if (seedOrder[i] !== undefined) slots[seedOrder[i]] = team; });

  const fixtures = [];

  // Round 1
  const r1Matches = bracketSize / 2;
  for (let i = 0; i < r1Matches; i++) {
    const home = slots[i * 2];
    const away = slots[i * 2 + 1];
    if (!home && !away) continue;

    if (home && away) {
      for (let l = 0; l < legs; l++) {
        fixtures.push({
          id: `ko-r${startRound}-m${i}-l${l}-${uid()}`,
          homeId: l === 0 ? home.id : away.id,
          awayId: l === 0 ? away.id : home.id,
          homeScore: null, awayScore: null,
          status: 'upcoming',
          round: startRound + l,
          matchIndex: i, stage: 'knockout', leg: l + 1,
          date: null, venue: null, time: null
        });
      }
    }
    // BYE: auto-place the non-null team into next round (handled in pre-gen below)
  }

  // Pre-generate subsequent empty rounds
  let currentSize = r1Matches;
  let r = startRound + legs;
  while (currentSize > 1) {
    currentSize /= 2;
    for (let i = 0; i < currentSize; i++) {
      for (let l = 0; l < legs; l++) {
        fixtures.push({
          id: `ko-r${r}-m${i}-l${l}-${uid()}`,
          homeId: null, awayId: null,
          homeScore: null, awayScore: null,
          status: 'upcoming',
          round: r + l, matchIndex: i, stage: 'knockout', leg: l + 1,
          date: null, venue: null, time: null
        });
      }
    }
    r += legs;
  }

  // BYE pass: advance bye teams into next round
  const r2 = startRound + legs;
  for (let i = 0; i < r1Matches; i++) {
    const home = slots[i * 2], away = slots[i * 2 + 1];
    if (!home || !away) {
      const winner = home || away;
      if (!winner) continue;
      const nextIdx = Math.floor(i / 2);
      const pos = i % 2 === 0 ? 'homeId' : 'awayId';
      const m = fixtures.find(f => f.round === r2 && f.matchIndex === nextIdx && f.leg === 1);
      if (m) m[pos] = winner.id;
    }
  }

  return fixtures;
}

// Standard bracket seeding order (1 vs 16, 8 vs 9, etc.)
function buildSeedOrder(size) {
  if (size === 1) return [0];
  const half = buildSeedOrder(size / 2);
  const result = new Array(size);
  half.forEach((seed, i) => {
    result[i * 2] = seed;
    result[i * 2 + 1] = size - 1 - seed;
  });
  return result;
}

// ─── GROUP STAGE ──────────────────────────────────────────────────────────────
export function generateGroupStage(teams, groupSize = 4) {
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const numGroups = Math.ceil(shuffled.length / groupSize);
  const groups = [];
  const fixtures = [];

  for (let g = 0; g < numGroups; g++) {
    const gTeams = shuffled.slice(g * groupSize, (g + 1) * groupSize);
    groups.push({ id: g, name: String.fromCharCode(65 + g), teamIds: gTeams.map(t => t.id) });
    const gFixtures = bergerRoundRobin(gTeams, 1, 'groups', 0);
    gFixtures.forEach(f => { f.groupId = g; fixtures.push(f); });
  }

  return { groups, fixtures };
}

// ─── SEMI-AUTO: Fill remaining slots in a matchday ───────────────────────────
// Given pinned matches per round, fill the rest using Berger-like rotation
// ensuring no team appears twice on the same matchday.
export function semiAutoFill(teams, pinnedByRound, totalRounds, legs = 1, stage = 'league') {
  // First generate a full auto schedule
  const autoFixtures = bergerRoundRobin(teams, legs, stage, 0);

  const result = [];

  for (let r = 1; r <= totalRounds; r++) {
    const pinned = (pinnedByRound[r] || []).filter(p => p.homeId && p.awayId);
    const usedTeams = new Set(pinned.flatMap(p => [p.homeId, p.awayId]));

    // From auto fixtures for this round, take those whose teams aren't used
    const autoForRound = autoFixtures
      .filter(f => f.round === r && !usedTeams.has(f.homeId) && !usedTeams.has(f.awayId));

    // Add pinned first
    pinned.forEach(p => {
      result.push({
        id: `fix-${uid()}`,
        homeId: p.homeId, awayId: p.awayId,
        homeScore: null, awayScore: null,
        status: 'upcoming', round: r, stage,
        date: p.date || null, venue: p.venue || null, time: p.time || null,
        pinned: true
      });
    });

    // Add auto-filled
    autoForRound.forEach(f => { f.round = r; result.push(f); });
  }

  return result;
}

// ─── VALIDATE: No team plays twice on same matchday ───────────────────────────
export function validateFixtures(fixtures) {
  const errors = [];
  const byRound = {};
  fixtures.forEach(f => {
    if (!byRound[f.round]) byRound[f.round] = [];
    byRound[f.round].push(f);
  });

  Object.entries(byRound).forEach(([round, matches]) => {
    const seen = new Set();
    matches.forEach(m => {
      if (m.homeId && seen.has(m.homeId)) errors.push(`Round ${round}: team ${m.homeId} plays twice`);
      if (m.awayId && seen.has(m.awayId)) errors.push(`Round ${round}: team ${m.awayId} plays twice`);
      if (m.homeId) seen.add(m.homeId);
      if (m.awayId) seen.add(m.awayId);
    });
  });

  return errors; // empty = valid
}

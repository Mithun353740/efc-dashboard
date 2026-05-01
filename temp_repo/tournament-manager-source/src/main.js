console.log('[KickOff] main.js is initializing...');
import { db, authPromise } from './firebase.js';
import {
  collection, doc, setDoc, getDoc, getDocs, onSnapshot,
  updateDoc, deleteDoc, addDoc, serverTimestamp,
  query, where, orderBy
} from "firebase/firestore";
import {
  bergerRoundRobin, seededKnockout,
  generateGroupStage, semiAutoFill, validateFixtures
} from './fixtureGen.js';
function showPlayerSelectionModal(callback) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300';
  modal.innerHTML = `
    <div class="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-3xl flex flex-col p-10 space-y-8">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">Link Club Player</h3>
        <button id="close-selection" class="p-4 bg-slate-950 rounded-2xl text-slate-500">${ICONS.reset}</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[60vh] pr-4 custom-scrollbar">
        ${state.dashboardPlayers.length === 0 ? '<p class="col-span-2 text-center text-slate-500 py-10">No club players synced. Ensure dashboard is open.</p>' : state.dashboardPlayers.map(p => `
          <button class="player-select-btn p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 transition-all text-left group" data-player-id="${p.id}">
            <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover border border-slate-800" />
            <div>
              <p class="font-black text-slate-200 text-sm group-hover:text-indigo-400">${p.name}</p>
              <p class="text-[9px] font-black text-slate-600 uppercase">#${p.number} • OVR ${p.ovr}</p>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelectorAll('.player-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      callback(btn.dataset.playerId);
      modal.remove();
    });
  });
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
  const closeBtn = document.getElementById('close-selection');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
}


window.onerror = function(message, source, lineno, colno, error) {
  alert('GLOBAL ERROR: ' + message + '\nLine: ' + lineno);
};
window.addEventListener('unhandledrejection', function(event) {
  alert('PROMISE REJECTION: ' + event.reason);
});


console.log('KickOff + Firebase Initialized');

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}

const SESSION_KEY = 'kickoff_session_v2';
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (Date.now() - s.loginTime > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY); return null;
    }
    return s;
  } catch { return null; }
}

async function logActivity(action) {
  if (!state.user) return;
  try {
    await addDoc(collection(db, 'activityLog'), {
      action, performedBy: state.user.username,
      role: state.user.role, timestamp: serverTimestamp()
    });
  } catch(e) { console.warn('Activity log failed:', e); }
}

// --- PWA Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('[PWA] Service Worker Registered');
      
      // Check for updates on a regular interval
      setInterval(() => { reg.update(); }, 1000 * 60 * 60); // Hourly
    }).catch(err => {
      console.error('[PWA] Registration Failed:', err);
    });
  });

  // Reload the page when a new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('[PWA] New controller detected, refreshing page...');
    window.location.reload();
  });
}

// --- Icons ---
const ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  more: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  fixtures: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  standings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h5"/></svg>`,
  teams: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  bracket: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 15 6 18 9"/><path d="M6 21 9 18 6 15"/><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M15 6h6"/><path d="M15 18h6"/></svg>`,
  reset: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  league: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/></svg>`,
  knockout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M21 6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3"/></svg>`,
  group: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7M5 12h14"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  boot: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h2l3-4h1a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 12V8"/><path d="M8 12V8"/></svg>`,
  medal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  archive: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  sword: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  fire: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/><path d="M9 13.71V11"/><path d="M15 13.71V11"/><path d="M12 8V5"/><path d="M12 3V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>`
};

const DATA_VERSION = "1.0";
const STORAGE_KEY = 'kickoff_tournaments_v1';
const BACKUP_KEY = 'kickoff_tournaments_backup';

function migrateData(data) {
  if (!data || typeof data !== 'object') return { version: DATA_VERSION, tournaments: [] };
  
  // If it's the old structure (just an array)
  if (Array.isArray(data)) {
    return {
      version: DATA_VERSION,
      tournaments: data.map(t => ({
        ...t,
        archived: t.archived || false,
        teams: t.teams.map(team => ({ ...team, form: team.form || [] }))
      }))
    };
  }

  // If it has version but needs updates
  if (data.version !== DATA_VERSION) {
    data.tournaments = data.tournaments.map(t => ({
      ...t,
      archived: t.archived || false,
      teams: t.teams.map(team => ({ ...team, form: team.form || [] }))
    }));
    data.version = DATA_VERSION;
  }

  return data;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('kickoff_tournaments');
    const parsed = raw ? JSON.parse(raw) : { version: DATA_VERSION, tournaments: [] };
    return migrateData(parsed);
  } catch (e) {
    console.error("Data corruption detected on load:", e);
    // Attempt load from backup
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) return migrateData(JSON.parse(backup));
    } catch (be) {
      console.error("Backup also corrupted:", be);
    }
    return { version: DATA_VERSION, tournaments: [] };
  }
}

const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true';
const urlTournamentId = urlParams.get('tournamentId');
console.log('[KickOff] URL Params:', window.location.search, 'isAdmin:', isAdmin, 'urlTournamentId:', urlTournamentId);

const state = {
  tournaments: [],
  tournament: null,
  user: { username: 'ADMIN', role: 'superadmin', loggedIn: true, loginTime: Date.now() },
  view: 'home',
  theme: localStorage.getItem('kickoff_theme') || 'dark',
  mobileStandingsMode: localStorage.getItem('mobile_standings_mode') || 'compact',
  activeRound: 1,
  activeBottomSheet: null,
  isMobile: window.innerWidth < 768,
  onboarding: { step: 0, selectedFormat: null },
  standingsFilter: 'overall', // 'overall', 'home', 'away', 'cleansheets'
  timelineRound: null, // null means latest
  loginError: null,
  isLoading: false,
  isAdmin: isAdmin,
  dashboardPlayers: []
};

// Helper to notify parent dashboard
function notifyParent(type, data = {}) {
  if (window.parent !== window) {
    window.parent.postMessage({ type, ...data }, '*');
  }
}

// Handle message from parent (Dashboard)
window.addEventListener('message', (event) => {
  console.log('[TournamentSystem] Received message:', event.data);
  if (event.data.type === 'PLAYERS_LIST') {
    state.dashboardPlayers = event.data.players;
    // If we are currently in a team detail view, we might want to re-render
    if (state.view === 'standings' && state.activeBottomSheet) {
       // Refresh UI to show newly loaded players
       render();
    }
  }
});

// Request players from parent on load
if (window.parent !== window) {
  window.parent.postMessage({ type: 'REQUEST_PLAYERS' }, '*');
}

window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  if (isMobile !== state.isMobile) {
    state.isMobile = isMobile;
    render();
  }
});

let pendingSave = null;
async function saveState(isBackup = false) {
  try {
    // Always sync current tournament into list
    if (state.tournament) {
      const idx = state.tournaments.findIndex(t => t.id === state.tournament.id);
      if (idx !== -1) state.tournaments[idx] = state.tournament;
      else state.tournaments.push(state.tournament);
    }
    const json = JSON.stringify({ version: DATA_VERSION, tournaments: state.tournaments });
    localStorage.setItem(STORAGE_KEY, json);
    localStorage.setItem('kickoff_theme', state.theme);
    if (isBackup) localStorage.setItem(BACKUP_KEY, json);

    // Debounced Firestore write (prevents quota exhaustion on rapid clicks)
    if (!state.tournament || !state.user) return;
    if (pendingSave) clearTimeout(pendingSave);
    pendingSave = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'tournaments', state.tournament.id), {
          ...state.tournament,
          updatedAt: serverTimestamp(),
          updatedBy: state.user?.username || 'system'
        });
        console.log('[Firestore] Synced:', state.tournament.name);
      } catch(fe) {
        if (fe.code === 'resource-exhausted') {
          console.warn('[Firestore] Quota exhausted — retry soon');
        } else {
          console.error('[Firestore] Sync error:', fe);
        }
      }
    }, 1500);
  } catch(e) { console.error('Save failed:', e); }
}

async function syncTournaments() {
  if (!state.user) return;
  
  // Wait for the secure connection (anonymous auth) before querying
  try {
    await authPromise;
  } catch (e) {
    console.error('Cannot sync: Auth failed', e);
    return;
  }

  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'));
  
  return new Promise((resolve, reject) => {
    let first = true;
    onSnapshot(q, (snap) => {
      state.tournaments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: DATA_VERSION, tournaments: state.tournaments }));
      if (state.tournament) {
        const updated = state.tournaments.find(t => t.id === state.tournament.id);
        if (updated) state.tournament = updated;
      }
      if (first) {
        first = false;
        resolve();
      } else {
        render();
      }
    }, (err) => {
      console.error('Sync failed:', err);
      if (first) reject(err);
    });
  });
}

async function deleteTournamentFromFirestore(id) {
  try { await deleteDoc(doc(db, 'tournaments', id)); } catch(e) { console.error('Delete failed:', e); }
}

async function checkAdminExists() {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'superadmin'));
    const snap = await getDocs(q);
    if (snap.empty) {
      const hashed = await hashPassword('admin123');
      await setDoc(doc(db, 'users', 'admin'), {
        username: 'admin', password: hashed, role: 'superadmin',
        isActive: true, createdAt: serverTimestamp(), loginAttempts: 0
      });
    }
  } catch(e) { console.warn('Admin check failed:', e); }
}

function applyTheme() {
  document.documentElement.classList.toggle('light-mode', state.theme === 'light');
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  // QV: always dark deep black
  document.body.style.background = '#050508';
  document.body.style.color = '#f1f5f9';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  render();
}

// --- CORE RENDERING ---
let _initialSyncDone = false;

async function render() {
  console.log('[KickOff] Render called. View:', state.view);
  try {
  const root = document.getElementById('root');
  if (!root) {
    console.error('[KickOff] Root element not found!');
    return;
  }
  applyTheme();

  // Show login if no session
  if (!state.user) {
    root.innerHTML = `
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:#475569;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">Initializing Security Protocols...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    try {
      await checkAdminExists();
    } catch (e) {
      console.warn('[KickOff] Admin check failed, proceeding to login anyway:', e);
    }
    renderLogin(root);
    return;
  }

  // First load: show spinner, sync from Firestore, then re-render
  if (!_initialSyncDone) {
    root.innerHTML = `
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem">
        <img src="/logo.png" style="width:72px;height:72px;border-radius:16px;box-shadow:0 0 40px rgba(59,130,246,0.5),0 0 80px rgba(124,58,237,0.2);animation:pulse 2s infinite">
        <div style="text-align:center">
          <h3 style="font-size:1.1rem;font-weight:900;color:#f1f5f9;text-transform:uppercase;letter-spacing:0.05em">Connecting to Firestore</h3>
          <p style="font-size:0.65rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.2em;margin-top:0.25rem">Loading tournament data...</p>
        </div>
        <div style="width:200px;height:3px;background:#0f0f1a;border-radius:99px;overflow:hidden">
          <div style="height:100%;background:linear-gradient(90deg,#3b82f6,#7c3aed);animation:slide 1.5s ease-in-out infinite"></div>
        </div>
      </div>
      <style>
        @keyframes slide { 0%{width:0%;margin-left:0} 50%{width:100%;margin-left:0} 100%{width:0%;margin-left:100%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 40px rgba(59,130,246,0.5)} 50%{box-shadow:0 0 60px rgba(124,58,237,0.6)} }
      </style>
    `;
    _initialSyncDone = true;
    await syncTournaments();
    
    if (urlTournamentId) {
      const found = state.tournaments.find(t => t.id === urlTournamentId);
      if (found) {
        state.tournament = found;
        state.view = 'dashboard';
        notifyParent('TOURNAMENT_OPENED', { id: found.id });
      }
    }
    
    render();
    return;
  }

  if (state.onboarding.step > 0) {
    renderOnboarding(root);
  } else if (!state.tournament) {
    renderTournamentList(root);
  } else if (state.tournament.status === 'setup_teams' || state.tournament.status === 'onboarding_summary') {
    renderAppContainer(root);
  } else {
    renderApp(root);
  }
  } catch (e) {
    alert('RENDER ERROR: ' + e.message + '\n' + e.stack);
    console.error(e);
  }
}

// ---- LOGIN SCREEN ----
async function handleLogin(username, password) {
  state.loginError = null;
  const btn = document.getElementById('login-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }
  try {
    const userDoc = doc(db, 'users', username);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      state.loginError = 'Invalid username or password.';
      render(); return;
    }
    const userData = snap.data();
    if (userData.lockedUntil && userData.lockedUntil.toDate() > new Date()) {
      const mins = Math.ceil((userData.lockedUntil.toDate() - new Date()) / 60000);
      state.loginError = `Account locked. Try again in ${mins} minute(s).`;
      render(); return;
    }
    if (!userData.isActive) {
      state.loginError = 'Account deactivated. Contact administrator.';
      render(); return;
    }
    const hashed = await hashPassword(password);
    if (userData.password === hashed) {
      await updateDoc(userDoc, { loginAttempts: 0, lockedUntil: null, lastLogin: serverTimestamp() });
      const session = { username: userData.username, role: userData.role, loggedIn: true, loginTime: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      state.user = session;
      await logActivity('User logged in');
      render();
    } else {
      const newAttempts = (userData.loginAttempts || 0) + 1;
      const update = { loginAttempts: newAttempts };
      if (newAttempts >= 5) {
        update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        state.loginError = 'Too many failed attempts. Locked for 15 minutes.';
      } else {
        state.loginError = 'Invalid username or password.';
      }
      await updateDoc(userDoc, update);
      render();
    }
  } catch(e) {
    console.error(e);
    state.loginError = 'Authentication error. Check your connection.';
    render();
  }
}

function renderLogin(root) {
  root.innerHTML = `
    <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;padding:1.5rem;position:relative;overflow:hidden">
      <!-- BG orbs -->
      <div style="position:absolute;top:-10%;right:-10%;width:40%;height:40%;background:radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-10%;left:-5%;width:35%;height:35%;background:radial-gradient(circle,rgba(124,58,237,0.09),transparent 70%);pointer-events:none"></div>

      <div style="width:100%;max-width:400px;z-index:1">
        <!-- Card -->
        <div style="background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:2.5rem;box-shadow:0 40px 80px rgba(0,0,0,0.7)">
          <!-- Logo + Title -->
          <div style="text-align:center;margin-bottom:2rem">
            <img src="/logo.png" alt="KickOff" style="width:80px;height:80px;border-radius:1.25rem;object-fit:cover;box-shadow:0 0 30px rgba(59,130,246,0.5),0 0 60px rgba(124,58,237,0.2);margin:0 auto 1.25rem">
            <h1 style="font-size:1.5rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;text-transform:uppercase">KickOff</h1>
            <p style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.3em;margin-top:0.25rem">Tournament Manager</p>
          </div>

          <form id="login-form" style="display:flex;flex-direction:column;gap:1rem">
            <div>
              <label style="display:block;font-size:0.6rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:0.5rem">Username</label>
              <input id="login-username" type="text" required placeholder="Enter username" autocomplete="username"
                style="width:100%;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.875rem;padding:0.875rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label style="display:block;font-size:0.6rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:0.5rem">Password</label>
              <div style="position:relative">
                <input id="login-password" type="password" required placeholder="Enter password" autocomplete="current-password"
                  style="width:100%;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.875rem;padding:0.875rem 1rem;padding-right:3rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                  onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
                <button type="button" id="toggle-pw" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#475569;cursor:pointer;font-size:1rem">👁️</button>
              </div>
            </div>
            ${state.loginError ? `<p style="font-size:0.75rem;font-weight:700;color:#f87171;text-align:center;padding:0.5rem 0">${state.loginError}</p>` : ''}
            <button id="login-btn" type="submit" style="width:100%;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;padding:1rem;border-radius:0.875rem;border:none;cursor:pointer;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;box-shadow:0 8px 24px rgba(59,130,246,0.3),0 0 40px rgba(124,58,237,0.15);margin-top:0.5rem">
              Sign In &rarr;
            </button>
          </form>
        </div>
        <p style="text-align:center;margin-top:1.5rem;font-size:0.6rem;font-weight:900;color:#1e1e32;text-transform:uppercase;letter-spacing:0.3em">Secured with Firebase &bull; v2.1</p>
      </div>
    </div>
  `;

  document.getElementById('toggle-pw').addEventListener('click', () => {
    const pw = document.getElementById('login-password');
    pw.type = pw.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin(
      document.getElementById('login-username').value.trim(),
      document.getElementById('login-password').value
    );
  });
}

function renderTournamentList(root) {
  const activeTournaments = state.tournaments.filter(t => !t.archived);
  const archivedTournaments = state.tournaments.filter(t => t.archived);

  // QV LOGO SVG inline
  const QV_LOGO = `<svg viewBox="0 0 48 48" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="qvg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs><path d="M24 4L6 12V28c0 8 8 14 18 16 10-2 18-8 18-16V12Z" fill="url(#qvg)" opacity="0.9"/><path d="M24 4L6 12V28c0 8 8 14 18 16 10-2 18-8 18-16V12Z" fill="none" stroke="rgba(139,92,246,0.6)" stroke-width="1"/><circle cx="24" cy="22" r="6" fill="none" stroke="white" stroke-width="1.5" opacity="0.8"/><path d="M14 16 Q24 10 34 16" stroke="rgba(96,165,250,0.7)" stroke-width="1.5" fill="none"/><path d="M14 28 Q24 34 34 28" stroke="rgba(167,139,250,0.7)" stroke-width="1.5" fill="none"/></svg>`;

  if (state.isMobile) {
    root.innerHTML = `
      <div class="min-h-screen p-5 pb-24 safe-area-pb" style="background:#050508">
        <header class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="KickOff Logo" style="width:44px;height:44px;border-radius:12px;object-fit:cover;box-shadow:0 0 20px rgba(59,130,246,0.5),0 0 40px rgba(124,58,237,0.2)">
            <div>
              <h1 class="text-xl font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</h1>
              <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${state.isAdmin ? 'Control Center' : 'Official Hub'}</p>
            </div>
          </div>
          <button id="theme-toggle" class="p-3 rounded-xl border transition-all" style="background:#0f0f1a;border-color:#1e1e32;color:#94a3b8">
            ${ICONS.sun}
          </button>
        </header>

        <section class="space-y-6">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#475569">Active (${activeTournaments.length})</h2>
            <div class="space-y-4">
              ${activeTournaments.length === 0 ? `
                <div class="rounded-2xl p-10 text-center border" style="background:#0f0f1a;border-color:#1e1e32;color:#334155;font-style:italic;font-size:0.75rem">
                  No tournaments yet — create your first one below
                </div>
              ` : activeTournaments.map(t => renderMobileTournamentCard(t)).join('')}
            </div>
          </div>

          ${archivedTournaments.length > 0 ? `
            <div class="pt-6">
              <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#334155">Archived</h2>
              <div class="space-y-3 opacity-50">
                ${archivedTournaments.map(t => renderMobileTournamentCard(t)).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        ${state.isAdmin ? `
        <button id="new-tournament-btn" class="fixed bottom-8 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 active:scale-90 transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 10px 40px rgba(59,130,246,0.45),0 0 60px rgba(124,58,237,0.2)">
          ${ICONS.plus}
        </button>
        ` : ''}
      </div>
    `;
  } else {
    root.innerHTML = `
      <div class="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden" style="background:#050508">
        <!-- QV Background Orbs -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute" style="top:-15%;right:-10%;width:50%;height:50%;background:radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)"></div>
          <div class="absolute" style="bottom:-10%;left:-5%;width:40%;height:40%;background:radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)"></div>
          <div class="absolute inset-0" style="background:radial-gradient(ellipse at 50% 0%,rgba(59,130,246,0.04) 0%,transparent 60%)"></div>
        </div>

        <div class="max-w-7xl mx-auto space-y-16 relative z-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div class="flex items-center gap-6">
               <img src="/logo.png" alt="KickOff" style="width:80px;height:80px;border-radius:20px;object-fit:cover;box-shadow:0 0 30px rgba(59,130,246,0.5),0 0 80px rgba(124,58,237,0.2),0 20px 40px rgba(0,0,0,0.4)">
               <div class="space-y-3">
                 ${state.isAdmin ? `
                 <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
                   <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.8)"></span>
                   Command Center Active
                 </div>
                 ` : ''}
                 <h1 class="text-5xl font-black tracking-tighter" style="background:linear-gradient(135deg,#f1f5f9 30%,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${state.isAdmin ? 'Your Tournaments' : 'Official Tournaments'}</h1>
                 <p class="font-bold tracking-[0.3em] uppercase text-xs" style="color:#475569">${state.isAdmin ? 'Manage multiple disciplines' : 'Live Competition Center'}</p>
               </div>
             </div>
             <div class="flex items-center gap-4">
               ${state.isAdmin ? `
               <button id="new-tournament-btn" class="flex items-center gap-4 font-black px-10 py-5 rounded-2xl transition-all group" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 8px 32px rgba(59,130,246,0.35),0 0 60px rgba(124,58,237,0.15);color:white">
                 <span class="group-hover:rotate-90 transition-transform duration-300">${ICONS.plus}</span>
                 <span class="uppercase tracking-widest text-sm">New Tournament</span>
               </button>
               ` : ''}
             </div>
          </div>

          ${activeTournaments.length === 0 ? `
            <div class="rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed" style="background:rgba(15,15,26,0.5);border-color:#1e1e32">
              <div class="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto" style="background:#0a0a12;border:1px solid #1e1e32;color:#334155">
                ${ICONS.trophy}
              </div>
              <div class="space-y-3">
                <h3 class="text-2xl font-black" style="color:#475569">No active tournaments</h3>
                <p class="text-sm font-medium" style="color:#334155">${state.isAdmin ? 'Create your first tournament to get started.' : 'Waiting for the next season to begin...'}</p>
              </div>
              ${state.isAdmin ? `
              <button id="new-tournament-btn-empty" class="px-10 py-4 rounded-2xl font-black text-sm transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 8px 32px rgba(59,130,246,0.3)">Create Tournament</button>
              ` : ''}
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${activeTournaments.map(t => renderTournamentCard(t)).join('')}
            </div>
          `}

          ${archivedTournaments.length > 0 ? `
            <div class="pt-20 space-y-8" style="border-top:1px solid #0f0f1a">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-black uppercase tracking-widest" style="color:#334155">Archived</h2>
                <div class="flex-1" style="height:1px;background:#0f0f1a"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                ${archivedTournaments.map(t => renderTournamentCard(t)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Common listeners
  const newBtn = document.getElementById('new-tournament-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      if (state.tournaments.length >= 10) {
        alert('Maximum 10 tournaments reached. Delete old ones to create new.');
        return;
      }
      state.onboarding.step = 1;
      render();
    });
  }
  const emptyBtn = document.getElementById('new-tournament-btn-empty');
  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => { state.onboarding.step = 1; render(); });
  }
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  root.querySelectorAll('.open-tournament').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      state.tournament = state.tournaments.find(t => t.id === id);
      state.view = 'dashboard';
      notifyParent('TOURNAMENT_OPENED', { id });
      render();
    });
  });

  root.querySelectorAll('.next-season-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleNextSeason(btn.dataset.id);
      });
    });

    root.querySelectorAll('.view-champion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      state.tournament = state.tournaments.find(tr => tr.id === id);
      state.view = 'champion';
      notifyParent('TOURNAMENT_OPENED', { id });
      render();
    });
  });

  root.querySelectorAll('.archive-tournament').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const t = state.tournaments.find(tr => tr.id === id);
      if (t) {
        t.archived = !t.archived;
        saveState();
        render();
      }
    });
  });

  root.querySelectorAll('.delete-tournament').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      showDeleteConfirmation(id);
    });
  });

  root.querySelectorAll('.duplicate-tournament').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const original = state.tournaments.find(t => t.id === id);
      if (state.tournaments.length >= 10) {
        alert('Maximum 10 tournaments reached.');
        return;
      }
      const clone = JSON.parse(JSON.stringify(original));
      clone.id = `t-${Date.now()}`;
      clone.archived = false; // Never duplicate as archived
      
      let cloneName = `${original.name} (Copy)`;
      let counter = 1;
      while (state.tournaments.some(t => t.name.toLowerCase() === cloneName.toLowerCase())) {
        cloneName = `${original.name} (Copy ${++counter})`;
      }
      clone.name = cloneName;

      clone.fixtures = original.fixtures.map(f => ({
        ...f,
        homeScore: null,
        awayScore: null,
        status: 'upcoming'
      }));
      clone.status = 'active';
      state.tournaments.push(clone);
      saveState();
      render();
    });
  });
}

function showDeleteConfirmation(id) {
  const t = state.tournaments.find(tr => tr.id === id);
  if (!t) return;

  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,0.9);backdrop-filter:blur(16px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `
    <div style="background:#0f0f1a;width:100%;max-width:420px;border-radius:2rem;padding:3rem;border:1px solid #1e1e32;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,0.8)">
      <div style="width:5rem;height:5rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:1.5rem;display:flex;align-items:center;justify-content:center;color:#f87171;margin:0 auto 1.5rem">
        ${ICONS.trash}
      </div>
      <h3 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;margin-bottom:1rem;letter-spacing:-0.02em">Delete Tournament?</h3>
      <p style="color:#64748b;font-size:0.875rem;line-height:1.6;margin-bottom:2rem">
        Are you sure you want to delete <strong style="color:#f1f5f9">${t.name}</strong>?
        All teams, fixtures, and results will be permanently erased.
      </p>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        <button id="confirm-delete" style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:white;font-weight:900;padding:1rem;border-radius:1rem;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;font-size:0.7rem;box-shadow:0 4px 20px rgba(220,38,38,0.3)">Delete Permanently</button>
        <button id="cancel-delete" style="background:#0a0a12;color:#475569;font-weight:900;padding:1rem;border-radius:1rem;border:1px solid #1e1e32;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;font-size:0.7rem">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('confirm-delete').addEventListener('click', async () => {
    const trName = t.name;
    state.tournaments = state.tournaments.filter(tr => tr.id !== id);
    try {
      await deleteTournamentFromFirestore(id);
      await logActivity(`Deleted tournament: ${trName}`);
    } catch(e) { console.error('Firestore delete failed:', e); }
    saveState();
    modal.remove();
    if (state.tournament?.id === id) { state.tournament = null; state.view = 'home'; }
    render();
    showToast(`${trName} deleted`);
  });

  document.getElementById('cancel-delete').addEventListener('click', () => {
    modal.remove();
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));border:1px solid rgba(96,165,250,0.3);color:#93c5fd;font-weight:900;padding:0.875rem 2rem;border-radius:1rem;box-shadow:0 8px 32px rgba(59,130,246,0.2),0 0 60px rgba(124,58,237,0.1);z-index:200;pointer-events:none;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;backdrop-filter:blur(12px);animation:float-up 0.3s ease forwards';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function renderMobileTournamentCard(t) {
  const played = t.fixtures.filter(m => m.status === 'completed').length;
  const total = t.fixtures.length;
  const progress = total > 0 ? (played / total) * 100 : 0;
  const typeIcon = ICONS[t.type === 'groups' ? 'group' : (t.type === 'knockout' ? 'knockout' : 'league')];
  const nextDate = getNextMatchdayDate(t);
  const dateStr = nextDate ? nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : null;
  
  return `
    <div data-id="${t.id}" class="open-tournament rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all" style="background:#0f0f1a;border:1px solid #1e1e32">
       <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style="background:#050508;border:1px solid #1e1e32;color:#60a5fa">
         ${t.logo ? `<img src="${t.logo}" class="w-full h-full object-cover">` : typeIcon}
       </div>
       <div class="flex-1 min-w-0">
         <div class="flex items-center justify-between">
           <h3 class="font-black tracking-tight uppercase truncate" style="color:#f1f5f9">${t.name}</h3>
           ${dateStr ? `<span class="text-[8px] font-black px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest ml-2">${dateStr}</span>` : ''}
         </div>
         <div class="flex items-center gap-2 mt-1">
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#60a5fa">${t.type.replace('_',' ')}</span>
           <span style="color:#1e293b;font-size:9px">•</span>
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${Math.round(progress)}%</span>
         </div>
         <div class="mt-2 rounded-full overflow-hidden" style="height:2px;background:#0a0a12">
           <div class="h-full" style="width:${progress}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 6px rgba(59,130,246,0.5)"></div>
         </div>
       </div>
       <span style="color:#1e293b">›</span>
    </div>
  `;
}

function getNextMatchdayDate(t) {
  if (!t.scheduling || !t.scheduling.matchDays || t.scheduling.matchDays.length === 0) return null;
  const dayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
  const targetDays = t.scheduling.matchDays.map(d => dayMap[d]);
  
  const now = new Date();
  now.setHours(0,0,0,0);
  
  for (let i = 0; i < 14; i++) {
    let d = new Date(now);
    d.setDate(now.getDate() + i);
    if (targetDays.includes(d.getDay())) {
      // If it's today, it only "resets" at 11:59pm, so we keep it as next date
      return d;
    }
  }
  return null;
}

function renderTournamentCard(t) {
  const played = t.fixtures.filter(m => m.status === 'completed').length;
  const total = t.fixtures.length;
  const progress = total > 0 ? (played / total) * 100 : 0;

  let statusBg, statusText;
  const now = Date.now();
  const isFuture = t.startDate && new Date(t.startDate).getTime() > now;

  if (t.archived) {
    statusText = 'Archived'; statusBg = 'background:#0a0a12;color:#475569;border-color:#1e1e32';
  } else if (isFuture) {
    statusText = 'Upcoming'; statusBg = 'background:rgba(245,158,11,0.1);color:#f59e0b;border-color:rgba(245,158,11,0.25)';
  } else if (played === total && total > 0) {
    statusText = 'Completed'; statusBg = 'background:rgba(16,185,129,0.08);color:#34d399;border-color:rgba(16,185,129,0.2)';
  } else if (played > 0) {
    statusText = 'Live'; statusBg = 'background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25)';
  } else {
    statusText = 'Setup'; statusBg = 'background:#0a0a12;color:#475569;border-color:#1e1e32';
  }

  const formatLabels = { round_robin:'Round Robin', knockout:'Knockout', league:'Full League', groups:'Group+KO' };
  const typeIcon = ICONS[t.type === 'groups' ? 'group' : (t.type === 'knockout' ? 'knockout' : 'league')];

  return `
    <div class="rounded-[2rem] p-8 flex flex-col justify-between h-[420px] transition-all group relative overflow-hidden" style="background:#0f0f1a;border:1px solid #1e1e32;box-shadow:0 20px 60px rgba(0,0,0,0.5)" onmouseover="this.style.borderColor='rgba(59,130,246,0.25)'" onmouseout="this.style.borderColor='#1e1e32'">
      ${t.archived ? '<div class="absolute inset-0 pointer-events-none" style="background:rgba(5,5,8,0.3)"></div>' : ''}
      <!-- gradient progress bar bottom -->
      <div class="absolute inset-x-0 bottom-0 overflow-hidden" style="height:2px;background:#0a0a12">
        <div class="h-full transition-all duration-1000" style="width:${progress}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>
      </div>
      <!-- Subtle orb glow on hover -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="background:radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)"></div>

      <div class="space-y-5 relative z-10">
        <div class="flex items-center justify-between">
           <div class="flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest" style="${statusBg}">
             ${statusText}
           </div>
           ${state.isAdmin ? `
            <div class="flex gap-2">
              <button data-id="${t.id}" class="archive-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="${t.archived ? 'Restore' : 'Archive'}" onmouseover="this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${ICONS.archive}</button>
              <button data-id="${t.id}" class="duplicate-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Duplicate" onmouseover="this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${ICONS.copy}</button>
              <button data-id="${t.id}" class="delete-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Delete" onmouseover="this.style.color='#f87171';this.style.borderColor='rgba(239,68,68,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${ICONS.trash}</button>
            </div>
            ` : ''}
        </div>
        <div class="flex items-center gap-4">
          ${t.logo ? `<img src="${t.logo}" class="w-14 h-14 rounded-xl object-contain p-1 border" style="background:#0a0a12;border-color:#1e1e32">` : `
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background:#0a0a12;border:1px solid #1e1e32;color:#60a5fa">${typeIcon}</div>
          `}
          <div>
            <h3 class="text-xl font-black tracking-tight mb-1 line-clamp-1 transition-all" style="color:#f1f5f9">${t.name}</h3>
            <p class="text-[10px] font-black uppercase tracking-widest" style="color:#475569">${formatLabels[t.type]||t.type} &bull; ${t.teams.length} Teams &bull; S${t.season || 1}</p>
            ${(() => {
              const nd = getNextMatchdayDate(t);
              if (!nd) return '';
              return `<p class="mt-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
                Next Matchday: ${nd.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
              </p>`;
            })()}
          </div>
        </div>
      </div>
      
      <div class="space-y-4 relative z-10">
        <div class="flex items-center justify-between">
           <div>
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Progress</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${Math.round(progress)}%</p>
           </div>
           <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Matches</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${played}/${total}</p>
           </div>
        </div>
        <button data-id="${t.id}" class="open-tournament w-full font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
          ${t.archived ? 'View Archive &rarr;' : 'Open Tournament &rarr;'}
        </button>
        ${played === total && total > 0 ? `
          <div class="flex gap-2">
            <button data-id="${t.id}" class="view-champion-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 4px 20px rgba(59,130,246,0.3)">
               Champions
            </button>
            <button data-id="${t.id}" class="next-season-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
               Next Season &rarr;
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderOnboarding(root) {
  if (state.onboarding.step === 1) renderFormatSelect(root);
  else if (state.onboarding.step === 2) renderConfigSetup(root);
}


function renderFormatSelect(root) {
  const formats = [
    { 
      id: 'round_robin', 
      name: 'Round Robin', 
      icon: ICONS.league, 
      desc: 'Small local competition. Every team plays everyone once.', 
      color: 'text-indigo-400',
    },
    { 
      id: 'knockout', 
      name: 'Knockout', 
      icon: ICONS.knockout, 
      desc: 'High stakes drama. Win or go home sudden-death.', 
      color: 'text-red-400',
    },
    { 
      id: 'groups', 
      name: 'Group + KO', 
      icon: ICONS.group, 
      desc: 'World Cup format. Group stage followed by brackets.', 
      color: 'text-emerald-400',
    },
    { 
      id: 'league', 
      name: 'Full League', 
      icon: ICONS.league, 
      desc: 'Double round robin. The ultimate consistency test.', 
      color: 'text-yellow-400',
    }
  ];

  if (state.isMobile) {
    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 p-6 flex flex-col">
        <header class="mb-10 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Phase 1/2</div>
          <h1 class="text-3xl font-black text-slate-100 tracking-tighter uppercase">Select Format</h1>
        </header>

        <div class="space-y-4 flex-1">
          ${formats.map(f => `
            <button data-format="${f.id}" class="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left active:bg-slate-800 flex items-center gap-5 transition-all">
              <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center ${f.color} flex-shrink-0 shadow-inner">
                ${f.icon}
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black text-slate-100 tracking-tight uppercase">${f.name}</h3>
                <p class="text-xs text-slate-500 leading-tight">${f.desc}</p>
              </div>
            </button>
          `).join('')}
        </div>
        
        <button id="cancel-onboarding" class="mt-8 w-full py-5 text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em]">Abort Mission</button>
      </div>
    `;
    document.getElementById('cancel-onboarding').addEventListener('click', () => { state.onboarding.step = 0; render(); });
  } else {
    root.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden">
        <button id="cancel-onboarding-desktop" class="absolute top-8 left-8 md:top-10 md:left-10 text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] flex items-center gap-2 group z-50">
          <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
          <span>Cancel</span>
        </button>
        <!-- Animated Background Accents -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full"></div>
        </div>

        <div class="max-w-6xl w-full space-y-16 relative z-10">
          <div class="text-center space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
              Construction Phase
            </div>
            <h1 class="text-6xl font-black text-slate-100 tracking-tighter sm:text-7xl uppercase">Select Format</h1>
            <p class="text-slate-500 font-medium tracking-[0.3em] uppercase text-xs">Architect your competition</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${formats.map(f => `
              <button data-format="${f.id}" class="format-card bg-slate-900 border border-slate-800 p-8 rounded-[3rem] text-left hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group flex flex-col justify-between h-[420px] shadow-3xl relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all duration-500"></div>
                
                <div class="space-y-8 relative z-10">
                  <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center ${f.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                    ${f.icon}
                  </div>
                  <div class="space-y-3">
                    <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${f.name}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed font-medium">${f.desc}</p>
                  </div>
                </div>

                <div class="pt-6 mt-auto relative z-10">
                   <div class="flex items-center justify-between mb-4">
                      <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Efficiency</span>
                      <span class="text-[10px] font-mono text-slate-700 group-hover:text-slate-400 transition-colors">v1.2.0</span>
                   </div>
                   <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                      <div class="h-full bg-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                   </div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  const cancelDesktop = document.getElementById('cancel-onboarding-desktop');
  if (cancelDesktop) {
    cancelDesktop.addEventListener('click', () => { state.onboarding.step = 0; render(); });
  }

  root.querySelectorAll('[data-format]').forEach(card => {
    card.addEventListener('click', () => {
      state.onboarding.selectedFormat = card.dataset.format;
      state.onboarding.step = 2;
      render();
    });
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function renderConfigSetup(root) {
  const formatId = state.onboarding.selectedFormat;
  const isKnockout = formatId === 'knockout';
  const isGroups = formatId === 'groups';
  const isLeague = formatId === 'league';

  root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-5 md:p-10 overflow-hidden">
      <!-- Animated Background Accents -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div class="w-full max-w-xl bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-8 md:p-12 border border-slate-800 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button id="back-btn" class="absolute top-8 left-8 md:top-10 md:left-10 text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] flex items-center gap-2 group">
          <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
          <span>Back</span>
        </button>
        
        <div class="mt-10 md:mt-12 text-center mb-10 md:mb-12">
           <div id="logo-preview-container" class="w-20 h-20 md:w-24 md:h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto mb-6 border border-slate-800 shadow-inner relative overflow-hidden group">
             <div id="logo-placeholder">${ICONS[formatId === 'groups' ? 'group' : (formatId === 'knockout' ? 'knockout' : 'league')]}</div>
             <img id="logo-preview" class="absolute inset-0 w-full h-full object-contain hidden" style="background: transparent;">
             <label for="logo-upload" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">${ICONS.plus}</span>
             </label>
             <input type="file" id="logo-upload" class="hidden" accept="image/*">
           </div>
           <h1 class="text-3xl md:text-4xl font-black text-slate-100 tracking-tighter mb-2 uppercase">Provision Specs</h1>
           <p class="text-slate-500 text-[9px] font-black tracking-[0.3em] uppercase">${formatId.replace('_', ' ')} Engine</p>
        </div>
        
        <form id="config-form" class="space-y-6 md:space-y-8">
          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Atmospheric Title</label>
            <input type="text" name="name" required class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-100 placeholder:text-slate-800 shadow-inner" placeholder="E.g. Champions League 2026">
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Genesis Date</label>
            <input type="date" name="startDate" required class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner">
          </div>

          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Squad Volume</label>
              <input type="number" name="teamCount" id="teamCountInput" value="8" min="2" max="64" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black font-mono shadow-inner">
            </div>
            
            ${isGroups ? `
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Density (Sq/G)</label>
                <select name="groupSize" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                  <option value="3">3 Squads</option>
                  <option value="4" selected>4 Squads</option>
                  <option value="5">5 Squads</option>
                </select>
              </div>
            ` : `
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Match Intensity</label>
                <select name="legs" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                  <option value="1">Single Leg</option>
                  <option value="2" ${isLeague ? 'selected' : ''}>Home & Away</option>
                </select>
              </div>
            `}
          </div>

          ${isLeague ? `
            <div class="grid grid-cols-3 gap-3">
               <div class="space-y-1">
                <label class="text-[8px] font-black text-emerald-500 uppercase tracking-widest pl-2">Europe</label>
                <input type="number" name="continentalSpots" value="4" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
               <div class="space-y-1">
                <label class="text-[8px] font-black text-indigo-500 uppercase tracking-widest pl-2">Promo</label>
                <input type="number" name="promoSpots" value="0" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
              <div class="space-y-1">
                <label class="text-[8px] font-black text-red-500 uppercase tracking-widest pl-2">Releg.</label>
                <input type="number" name="relegationSpots" value="3" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-red-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
            </div>
          ` : ''}

          <div class="space-y-6 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50 shadow-inner">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-indigo-600/10 rounded-xl text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
              </div>
              <span class="text-[10px] font-black text-slate-100 uppercase tracking-[0.2em]">Matchday Scheduling</span>
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Days per Matchday</label>
              <select name="daysPerMatchday" id="daysPerMatchday" class="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                ${[1,2,3,4,5,6,7].map(n => `<option value="${n}" ${n===1?'selected':''}>${n} Day${n>1?'s':''}</option>`).join('')}
              </select>
            </div>

            <div class="space-y-3">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Operational Days</label>
              <div class="grid grid-cols-4 sm:grid-cols-7 gap-2" id="matchdays-selector">
                ${['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map(day => `
                  <div class="relative">
                    <input type="checkbox" name="matchDays" value="${day}" id="day-${day}" class="peer hidden" ${day==='Fri'||day==='Sat'?'checked':''}>
                    <label for="day-${day}" class="flex items-center justify-center py-3 rounded-xl border border-slate-800 bg-slate-950 text-[10px] font-black text-slate-600 uppercase tracking-tighter cursor-pointer transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                      ${day}
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div id="est-matches" class="bg-slate-950 p-5 rounded-2xl md:rounded-[2rem] border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400">
                ${ICONS.fixtures}
              </div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Schedule Capacity</span>
            </div>
            <span id="matchCountLabel" class="text-slate-100 font-black font-mono text-lg tracking-tighter italic">-- Matches</span>
          </div>

          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-indigo-900/40 text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 group active:scale-95">
            <span>Provision Unit</span>
            <span class="group-hover:translate-x-2 transition-transform">${ICONS.star}</span>
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    state.onboarding.step = 1;
    render();
  });

  const form = document.getElementById('config-form');
  const matchCountLabel = document.getElementById('matchCountLabel');
  const teamCountInput = document.getElementById('teamCountInput');

  const updateEstimate = () => {
    const N = parseInt(teamCountInput.value) || 0;
    const format = formatId;
    let count = 0;
    if (format === 'round_robin' || format === 'league') {
        const l = parseInt(form.elements.legs?.value || (format === 'league' ? 2 : 1));
        count = (N * (N - 1) / 2) * l;
    } else if (format === 'knockout') {
        const l = parseInt(form.elements.legs.value);
        count = (N - 1) * l;
    } else if (format === 'groups') {
        const gs = parseInt(form.elements.groupSize.value);
        const groups = Math.ceil(N / gs);
        const mPerGrp = gs * (gs - 1) / 2;
        count = (groups * mPerGrp) + ((groups * 2) - 1);
    }
    matchCountLabel.innerText = `${Math.floor(count)} Matches`;
  };

  form.addEventListener('input', updateEstimate);
  updateEstimate();

  let logoBase64 = null;
  document.getElementById('logo-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Maximum size 2MB allowed.");
        return;
      }
      logoBase64 = await fileToBase64(file);
      const preview = document.getElementById('logo-preview');
      const placeholder = document.getElementById('logo-placeholder');
      preview.src = logoBase64;
      preview.classList.remove('hidden');
      placeholder.classList.add('hidden');
    }
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    state.onboarding.step = 1;
    render();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    initTournament({
      name: data.get('name'),
      startDate: data.get('startDate'),
      type: formatId,
      logo: logoBase64,
      teamCount: parseInt(data.get('teamCount')),
      legs: parseInt(data.get('legs') || (formatId === 'league' ? 2 : 1)),
      groupSize: parseInt(data.get('groupSize') || 0),
      promoSpots: parseInt(data.get('promoSpots') || 0),
      relegationSpots: parseInt(data.get('relegationSpots') || 0),
      continentalSpots: parseInt(data.get('continentalSpots') || 0),
      scheduling: {
        daysPerMatchday: parseInt(data.get('daysPerMatchday')),
        matchDays: Array.from(e.target.querySelectorAll('input[name="matchDays"]:checked')).map(cb => cb.value)
      }
    });
  });
}

function getSeasonInfo(date) {
  const d = new Date(date);
  let start = new Date(2026, 3, 17); // April 17, 2026 (Anchor)
  if (d >= start) {
    while (true) {
      let end = new Date(start);
      end.setMonth(end.getMonth() + 9);
      end.setDate(end.getDate() - 1);
      if (d <= end) {
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
      if (d >= start && d <= end) {
        const sY = start.getFullYear();
        const eY = end.getFullYear();
        return { name: sY === eY ? `${sY} Season` : `${sY}/${eY}`, start, end };
      }
      if (start.getFullYear() < 2020) break;
    }
  }
  return { name: "Legacy", start: null, end: null };
}

function getCurrentSeason() {
  return getSeasonInfo(new Date()).name;
}

async function initTournament(config) {
  const season = getCurrentSeason();
  
  // Check for duplicates in current season
  const existing = state.tournaments.find(t => 
    t.name.toLowerCase() === config.name.toLowerCase() && 
    (t.season === season || !t.season)
  );
  
  if (existing) {
    alert(`A tournament named "${config.name}" already exists in the ${season} season.`);
    return;
  }

  const tournamentId = `t-${Date.now()}`;
  const newTournament = {
    id: tournamentId,
    ...config,
    season: season,
    teams: Array.from({ length: config.teamCount }, (_, i) => ({ id: i, name: `Team ${i + 1}`, players: [] })),
    fixtures: [],
    standings: [],
    groups: [],
    currentStage: config.type === 'groups' ? 'groups' : config.type,
    status: 'setup_teams',
    startDate: config.startDate || null,
    createdAt: Date.now()
  };

  state.tournament = newTournament;
  state.onboarding.step = 0; 

  // Sync to Firestore for Dashboard Visibility
  try {
    await setDoc(doc(db, 'tournaments', tournamentId), {
      id: tournamentId,
      name: config.name,
      season: season,
      createdAt: Date.now()
    });
    console.log('[KickOff] Tournament synced to Firestore ranking system');
  } catch(e) {
    console.error('[KickOff] Firestore sync failed:', e);
  }

  saveState();
  render();
}

function renderAppContainer(root) {
  root.innerHTML = `
    <div class="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <main class="flex-1 p-6 md:p-10 lg:p-16 overflow-auto">
        <div id="view-container"></div>
      </main>
    </div>
  `;
  const container = document.getElementById('view-container');
  if (state.tournament.status === 'setup_teams') renderTeamSetup(container);
  else if (state.tournament.status === 'onboarding_summary') renderOnboardingSummary(container);
}

function renderTeamSetup(container) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6', '#3b82f6'];
  container.innerHTML = `
     <div class="max-w-5xl mx-auto space-y-12">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-6">
          <button id="back-to-config-btn" style="position:relative; z-index:9999;" onclick="console.log('Raw click fired!')" class="hidden md:flex text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] items-center gap-2 group cursor-pointer">
            <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
            <span>Back</span>
          </button>
          <div class="space-y-1">
            <div class="flex items-center gap-4">
              <button id="back-to-config-btn-mobile" class="md:hidden text-slate-600 hover:text-indigo-400 transition-all text-xl font-black">&larr;</button>
              <h3 class="text-2xl md:text-4xl font-black tracking-tight">Roster Registry</h3>
            </div>
            <p class="text-slate-500 font-medium tracking-widest uppercase text-[10px] md:text-xs">Assign identities and warpaint to your competitors</p>
          </div>
        </div>
        <button id="generate-fixtures-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-indigo-900/40 flex items-center gap-4 group">
          <span>Generate Fixtures</span>
          <span class="group-hover:translate-x-1 transition-transform border-l border-white/20 pl-4 ml-4">${ICONS.fixtures}</span>
        </button>
      </div>
      
      <div id="team-inputs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        ${state.tournament.teams.map((t, idx) => `
          <div class="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-all flex items-center gap-4 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-700 relative overflow-hidden">
               <input type="color" data-color-id="${t.id}" value="${colors[idx % colors.length]}" class="absolute inset-0 w-full h-full border-none p-0 cursor-pointer opacity-0">
               <div id="team-img-container-${t.id}" class="absolute inset-0 ${t.image ? '' : 'hidden'}">
                 <img src="${t.image || ''}" class="w-full h-full object-cover">
               </div>
               <div style="background-color: ${colors[idx % colors.length]}" class="w-6 h-6 rounded-full shadow-inner team-color-dot" data-dot-id="${t.id}"></div>
            </div>
            <div class="flex-1">
               <label class="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Squad Name</label>
               <input type="text" data-team-id="${t.id}" value="${t.name}" list="club-players" class="team-name-input w-full bg-transparent border-none focus:ring-0 text-lg font-black text-slate-100 placeholder:text-slate-800" placeholder="Type name for suggestions...">
            </div>
          </div>
        `).join('')}
      </div>

      <datalist id="club-players">
        ${state.dashboardPlayers.map(p => `<option value="${p.name}">${p.ovr} OVR • #${p.number}</option>`).join('')}
      </datalist>
    </div>
  `;

  // Dynamic Image Auto-Fill Listener
  document.querySelectorAll('.team-name-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      const player = state.dashboardPlayers.find(p => p.name.toLowerCase() === name.toLowerCase());
      const teamId = parseInt(e.target.dataset.teamId);
      const team = state.tournament.teams.find(tm => tm.id === teamId);
      const imgContainer = document.getElementById(`team-img-container-${teamId}`);
      
      if (player) {
        team.playerId = player.id;
        team.image = player.image;
        if (imgContainer) {
          imgContainer.querySelector('img').src = player.image;
          imgContainer.classList.remove('hidden');
        }
      } else {
        team.playerId = null;
        team.image = null;
        if (imgContainer) imgContainer.classList.add('hidden');
      }
    });
  });

  document.querySelectorAll('input[type="color"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = e.target.dataset.colorId;
      const dot = document.querySelector(`.team-color-dot[data-dot-id="${id}"]`);
      if (dot) dot.style.backgroundColor = e.target.value;
    });
  });

  const goBack = () => {
    console.log("Back button clicked!");
    if (!state.tournament) return; // Prevent double-clicks from crashing
    try {
      // Safe filter
      state.tournaments = state.tournaments.filter(t => t && t.id !== state.tournament.id);
      state.tournament = null;
      state.onboarding.step = 2;
      saveState();
      render();
    } catch(e) {
      console.error(e);
      alert("Error going back: " + e.message);
    }
  };
  const btnD = document.getElementById('back-to-config-btn');
  if (btnD) btnD.addEventListener('click', goBack);
  const btnM = document.getElementById('back-to-config-btn-mobile');
  if (btnM) btnM.addEventListener('click', goBack);

  document.getElementById('generate-fixtures-btn').addEventListener('click', () => {
    // Save team names & colors first
    document.querySelectorAll('.team-name-input').forEach(input => {
      const id = parseInt(input.dataset.teamId);
      const colorInput = document.querySelector(`input[data-color-id="${id}"]`);
      state.tournament.teams[id].name = input.value || `Team ${id + 1}`;
      state.tournament.teams[id].color = colorInput ? colorInput.value : '#6366f1';
    });
    saveState();
    openFixtureWizard();
  });
}

function renderOnboardingSummary(container) {
  const { fixtures } = state.tournament;
  const matchdays = Math.max(...fixtures.map(f => f.round), 0);
  
  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center -mt-20">
      <div class="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-3xl p-12 border border-slate-800 text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
          ${ICONS.trophy}
        </div>
        <h2 class="text-3xl font-black text-slate-100 mb-4 tracking-tighter">Season Manifested</h2>
        <p class="text-slate-400 mb-10 text-sm font-medium">The schedule engine has successfully mapped the competition path.</p>
        <div class="grid grid-cols-2 gap-4 mb-10">
          <div class="bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Matches</p>
             <p class="text-2xl font-black text-slate-100 font-mono">${fixtures.length}</p>
          </div>
          <div class="bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Rounds</p>
             <p class="text-2xl font-black text-slate-100 font-mono">${matchdays}</p>
          </div>
        </div>
        <button id="begin-ops-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/20">
          Begin Operations &rarr;
        </button>
      </div>
    </div>
  `;

  document.getElementById('begin-ops-btn').addEventListener('click', () => {
    state.tournament.status = 'active';
    saveState();
    render();
  });
}

function generateInitialFixtures(mode = 'auto', pinnedByRound = {}) {
  const { type, teams, legs = 1, groupSize = 4 } = state.tournament;
  if (type === 'round_robin' || type === 'league') {
    if (mode === 'semi') {
      const n = teams.length % 2 === 0 ? teams.length : teams.length + 1;
      state.tournament.fixtures = semiAutoFill(teams, pinnedByRound, (n - 1) * legs, legs, type);
    } else {
      state.tournament.fixtures = bergerRoundRobin(teams, legs, type);
    }
  } else if (type === 'knockout') {
    state.tournament.fixtures = seededKnockout(teams, 1, legs);
  } else if (type === 'groups') {
    const { groups, fixtures } = generateGroupStage(teams, groupSize);
    state.tournament.groups = groups;
    state.tournament.fixtures = fixtures;
  }
  const errs = validateFixtures(state.tournament.fixtures);
  if (errs.length) console.warn('[FixtureEngine]', errs);
}

function generateLeagueFixtures(teams, roundOffset = 0, legs = 1) {
  const n = teams.length;
  const teamList = [...teams];
  if (n % 2 !== 0) teamList.push({ id: -1, name: 'BYE' });
  const numTeams = teamList.length;
  const roundsPerLeg = numTeams - 1;
  const matchesPerRound = numTeams / 2;
  const allFixtures = [];

  for (let leg = 0; leg < legs; leg++) {
    const legOffset = leg * roundsPerLeg;
    for (let r = 0; r < roundsPerLeg; r++) {
      for (let m = 0; m < matchesPerRound; m++) {
        const h = teamList[m], a = teamList[numTeams - 1 - m];
        if (h.id !== -1 && a.id !== -1) {
          const isSecond = leg % 2 === 1;
          allFixtures.push({
            id: `match-${leg}-${r}-${m}-${Math.random().toString(36).substr(2, 5)}`,
            homeId: isSecond ? a.id : h.id, awayId: isSecond ? h.id : a.id,
            homeScore: null, awayScore: null, status: 'upcoming',
            round: r + 1 + roundOffset + legOffset,
            stage: state.tournament.type === 'league' ? 'league' : 'round_robin', date: null
          });
        }
      }
      teamList.splice(1, 0, teamList.pop());
    }
  }
  return allFixtures;
}

function generateKnockoutFixtures(teams, startingRound = 1, legs = 1) {
  let p = 1; while (p < teams.length) p *= 2;
  const bracketSize = p, fixtures = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5);

  const populateSlot = (round, matchIdx, legIdx, hId, aId) => ({
    id: `ko-r${round}-m${matchIdx}-l${legIdx}`,
    homeId: hId, awayId: hId === null ? null : aId,
    homeScore: null, awayScore: null, status: 'upcoming',
    round: round + legIdx, matchIndex: matchIdx, stage: 'knockout', leg: legIdx + 1
  });

  // Calculate BYEs and First Round
  for (let i = 0; i < bracketSize / 2; i++) {
    const home = shuffled[i * 2] || null;
    const away = shuffled[i * 2 + 1] || null;
    if (home && away) {
       for (let l = 0; l < legs; l++) fixtures.push(populateSlot(startingRound, i, l, l === 0 ? home.id : away.id, l === 0 ? away.id : home.id));
    } else if (home || away) {
        // BYE advancement: Skip round 1 for this team, put them in round 2 immediately
        // Round 2 slots are handled in the pre-generation loop below.
    }
  }

  // Pre-generate subsequent rounds
  let currentRoundSize = bracketSize / 2;
  let r = startingRound + legs;
  while (currentRoundSize > 1) {
    currentRoundSize /= 2;
    for (let i = 0; i < currentRoundSize; i++) {
       // Check if any team got a BYE and should be here
       // This is complex for a simple generator, so we'll handle BYE advancement in a second pass:
       for (let l = 0; l < legs; l++) fixtures.push(populateSlot(r, i, l, null, null));
    }
    r += legs;
  }

  // Second pass: Handle BYEs
  if (bracketSize > teams.length) {
    const nextRound = startingRound + legs;
    for (let i = 0; i < bracketSize / 2; i++) {
       const home = shuffled[i * 2] || null;
       const away = shuffled[i * 2 + 1] || null;
       if (!home || !away) {
         const winner = home || away;
         const nextMatchIdx = Math.floor(i / 2);
         const pos = (i % 2 === 0) ? 'homeId' : 'awayId';
         const match = fixtures.find(f => f.round === nextRound && f.matchIndex === nextMatchIdx);
         if (match) match[pos] = winner.id;
       }
    }
  }

  return fixtures;
}

function generateGroupStageFixtures(teams, size) {
  const groupSize = size || 4, numGroups = Math.ceil(teams.length / groupSize), groups = [], fixtures = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  for (let g = 0; g < numGroups; g++) {
    const gTeams = shuffled.slice(g * groupSize, (g + 1) * groupSize);
    groups.push({ id: g, name: String.fromCharCode(65 + g), teamIds: gTeams.map(t => t.id) });
    generateLeagueFixtures(gTeams, 0, 1).forEach(f => {
      f.groupId = g; f.stage = 'groups'; fixtures.push(f);
    });
  }
  state.tournament.groups = groups;
  return fixtures;
}

// ─── 3-MODE FIXTURE WIZARD ────────────────────────────────────────────────────
function openFixtureWizard() {
  const overlay = document.createElement('div');
  overlay.id = 'fixture-wizard';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto';

  const { type, teams, legs = 1 } = state.tournament;
  const isKnockout = type === 'knockout';
  const isGroups   = type === 'groups';
  const isLeague   = !isKnockout && !isGroups;

  overlay.innerHTML = `
    <div style="width:100%;max-width:620px;background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:${state.isMobile ? '1.25rem' : '2.5rem'};box-shadow:0 40px 80px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
      <div style="margin-bottom:2rem">
        <div style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.25em;margin-bottom:0.4rem">Fixture Engine v2</div>
        <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;margin:0">Choose Generation Mode</h2>
        <p style="font-size:0.75rem;color:#475569;margin-top:0.5rem">${teams.length} teams · ${type.replace('_',' ')}${isLeague ? ` · ${legs} leg${legs>1?'s':''}` : ''}</p>
      </div>
      <div id="mode-tabs" style="display:grid;grid-template-columns:${state.isMobile ? '1fr' : (isKnockout||isGroups?'1fr 1fr':'repeat(3,1fr)')};gap:0.75rem;margin-bottom:1.5rem">
        <button class="wiz-mode" data-mode="auto" style="padding:1rem;border-radius:1rem;border:2px solid #3b82f6;background:rgba(59,130,246,0.1);cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">⚡</div>
          <div style="font-size:0.7rem;font-weight:900;color:#60a5fa;text-transform:uppercase;letter-spacing:0.1em">Auto</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Full algorithm</div>
        </button>
        ${isLeague ? `<button class="wiz-mode" data-mode="semi" style="padding:1rem;border-radius:1rem;border:2px solid #1e1e32;background:#0a0a12;cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">🎛️</div>
          <div style="font-size:0.7rem;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Semi-Auto</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Pin key matches</div>
        </button>` : ''}
        <button class="wiz-mode" data-mode="manual" style="padding:1rem;border-radius:1rem;border:2px solid #1e1e32;background:#0a0a12;cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">✍️</div>
          <div style="font-size:0.7rem;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Full Manual</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Every fixture</div>
        </button>
      </div>
      <div id="wiz-panel" style="min-height:140px"></div>
      <div style="display:flex;gap:0.75rem;margin-top:1.5rem">
        <button id="wiz-cancel" style="flex:1;padding:0.875rem;border-radius:0.875rem;border:1px solid #1e1e32;background:#0a0a12;color:#475569;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer">Cancel</button>
        <button id="wiz-confirm" style="flex:2;padding:0.875rem;border-radius:0.875rem;border:none;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,0.3)">Generate Fixtures →</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let currentMode = 'auto';
  const pinnedByRound = {};
  let manualFixtures = [];

  function setMode(mode) {
    currentMode = mode;
    overlay.querySelectorAll('.wiz-mode').forEach(b => {
      const active = b.dataset.mode === mode;
      b.style.border = active ? '2px solid #3b82f6' : '2px solid #1e1e32';
      b.style.background = active ? 'rgba(59,130,246,0.1)' : '#0a0a12';
      const label = b.querySelector('div:nth-child(2)');
      if (label) label.style.color = active ? '#60a5fa' : '#94a3b8';
    });
    renderPanel(mode);
  }

  function renderPanel(mode) {
    const panel = document.getElementById('wiz-panel');
    if (mode === 'auto') {
      const desc = isLeague
        ? `<strong style="color:#60a5fa">Berger Circle</strong> round-robin — every team plays exactly once per matchday. Home/away alternates each leg. Odd teams get a fair BYE rotation.`
        : isKnockout
        ? `<strong style="color:#60a5fa">Seeded bracket</strong> — teams placed 1–${teams.length} in optimal positions. BYE teams auto-advance. Subsequent rounds pre-generated as empty slots.`
        : `<strong style="color:#60a5fa">Randomised group draw</strong> then Berger round-robin within each group.`;
      panel.innerHTML = `
        <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:1.25rem">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.7;margin:0">${desc}</p>
          <div style="margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:0.65rem;color:#60a5fa;font-weight:900">
            ✓ No team plays twice on the same matchday &nbsp;|&nbsp; ✓ Validated before saving
          </div>
        </div>`;
    } else if (mode === 'semi') {
      const n = teams.length % 2 === 0 ? teams.length : teams.length + 1;
      const totalRounds = (n - 1) * legs;
      const show = Math.min(totalRounds, 8);
      const teamOpts = teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
      const maxMatches = Math.floor(teams.length / 2);
      let rows = '';
      for (let r = 1; r <= show; r++) {
        let matchRows = '';
        for (let m = 0; m < maxMatches; m++) {
          matchRows += `
            <div style="display:grid;grid-template-columns:1fr 0.4rem 1fr;gap:0.5rem;align-items:center;margin-top:0.4rem">
              <select data-round="${r}" data-match="${m}" data-side="home" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Home</option>${teamOpts}
              </select>
              <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
              <select data-round="${r}" data-match="${m}" data-side="away" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Away</option>${teamOpts}
              </select>
            </div>`;
        }
        rows += `<div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem;margin-bottom:0.5rem">
          <span style="font-size:0.6rem;font-weight:900;color:#334155;white-space:nowrap;display:block;margin-bottom:0.2rem">MD ${r}</span>
          ${matchRows}
        </div>`;
      }
      panel.innerHTML = `
        <p style="font-size:0.72rem;color:#475569;margin:0 0 0.75rem">Optionally pin matches per matchday (Max ${maxMatches}). Leave blank to let the algorithm decide.</p>
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:300px;overflow-y:auto">${rows}</div>
        <p style="font-size:0.6rem;color:#334155;margin-top:0.5rem">Showing ${show} of ${totalRounds} matchdays. Algorithm fills all unpinned slots automatically.</p>`;
      panel.querySelectorAll('.sp').forEach(sel => {
        sel.addEventListener('change', () => {
          const r = parseInt(sel.dataset.round);
          const m = parseInt(sel.dataset.match);
          if (!pinnedByRound[r]) pinnedByRound[r] = [];
          if (!pinnedByRound[r][m]) pinnedByRound[r][m] = {};
          pinnedByRound[r][m][sel.dataset.side === 'home' ? 'homeId' : 'awayId'] = sel.value ? parseInt(sel.value) : null;
        });
      });
    } else {
      renderManualPanel(panel);
    }
  }

  function renderManualPanel(panel) {
    const teamOpts = teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    panel.innerHTML = `
      <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:0.875rem;margin-bottom:0.625rem">
        <div style="display:grid;grid-template-columns:1fr 0.3fr 1fr 52px 36px;gap:0.4rem;align-items:center">
          <select id="m-home" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Home</option>${teamOpts}</select>
          <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
          <select id="m-away" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Away</option>${teamOpts}</select>
          <input id="m-round" type="number" min="1" placeholder="MD" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none;text-align:center;width:100%">
          <button id="m-add" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);border:none;color:white;font-weight:900;font-size:1rem;border-radius:0.5rem;cursor:pointer;height:100%;width:100%">＋</button>
        </div>
        <p id="m-err" style="font-size:0.65rem;color:#f87171;margin-top:0.4rem;display:none"></p>
      </div>
      <div style="font-size:0.65rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">${manualFixtures.length} fixture${manualFixtures.length!==1?'s':''} added</div>
      <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:0.35rem">
        ${manualFixtures.length === 0
          ? '<p style="font-size:0.72rem;color:#334155;text-align:center;padding:1rem 0">No fixtures yet — add some above.</p>'
          : manualFixtures.map((f,i) => {
              const h = teams.find(t=>t.id===f.homeId)?.name || '?';
              const a = teams.find(t=>t.id===f.awayId)?.name || '?';
              return `<div style="display:flex;align-items:center;justify-content:space-between;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.625rem;padding:0.45rem 0.75rem">
                <span style="font-size:0.75rem;color:#94a3b8"><strong style="color:#60a5fa">MD${f.round}</strong>  ${h} <span style="color:#334155">vs</span> ${a}</span>
                <button data-del="${i}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:0.9rem;padding:0 0.25rem">✕</button>
              </div>`;
            }).join('')
        }
      </div>`;

    document.getElementById('m-add').addEventListener('click', () => {
      const homeId = parseInt(document.getElementById('m-home').value);
      const awayId = parseInt(document.getElementById('m-away').value);
      const round  = parseInt(document.getElementById('m-round').value);
      const err = document.getElementById('m-err');
      err.style.display = 'none';
      if (!homeId || !awayId) { err.textContent='Select both teams.'; err.style.display='block'; return; }
      if (homeId===awayId)    { err.textContent='Home and away must differ.'; err.style.display='block'; return; }
      if (!round||round<1)    { err.textContent='Enter a valid matchday (≥1).'; err.style.display='block'; return; }
      const md = manualFixtures.filter(f=>f.round===round);
      if (md.some(f=>f.homeId===homeId||f.awayId===homeId||f.homeId===awayId||f.awayId===awayId)) {
        err.textContent='A team already plays on this matchday!'; err.style.display='block'; return;
      }
      manualFixtures.push({
        id:`man-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        homeId, awayId, round,
        homeScore:null, awayScore:null, status:'upcoming',
        stage: isKnockout?'knockout':type, date:null, venue:null
      });
      renderManualPanel(panel);
    });

    panel.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => { manualFixtures.splice(parseInt(btn.dataset.del),1); renderManualPanel(panel); });
    });
  }

  overlay.querySelectorAll('.wiz-mode').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  renderPanel('auto');

  document.getElementById('wiz-confirm').addEventListener('click', () => {
    if (currentMode === 'manual') {
      if (manualFixtures.length === 0) { showToast('Add at least one fixture first.'); return; }
      state.tournament.fixtures = manualFixtures;
    } else {
      generateInitialFixtures(currentMode, pinnedByRound);
    }
    state.tournament.status = 'onboarding_summary';
    saveState();
    overlay.remove();
    render();
  });
  document.getElementById('wiz-cancel').addEventListener('click', () => overlay.remove());
}

function renderMobileTopBar() {
  return `
    <header class="backdrop-blur-xl border-b p-3 sticky top-0 z-50 flex items-center justify-between no-print" style="background:rgba(10,10,18,0.92);border-color:#1e1e32">
      <div class="flex items-center gap-2.5 overflow-hidden" ${state.isAdmin ? 'id="mobile-switcher-btn"' : ''}>
        <img src="/logo.png" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(59,130,246,0.4),0 0 24px rgba(124,58,237,0.15);flex-shrink:0">
        <div class="overflow-hidden">
          <div class="text-[8px] font-black uppercase tracking-widest" style="color:#475569">Tournament</div>
          <h2 class="text-sm font-black truncate tracking-tighter uppercase" style="color:#f1f5f9">${state.tournament.name}</h2>
        </div>
        ${state.isAdmin ? `<span class="ml-1" style="color:#334155">${ICONS.menu}</span>` : ''}
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle-mobile" class="p-2 rounded-xl border transition-all active:scale-95" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
          ${state.theme === 'dark' ? ICONS.sun : ICONS.moon}
        </button>
      </div>
    </header>
  `;
}

function renderBottomNav() {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: ICONS.home },
    { id: 'fixtures', label: 'Matches', icon: ICONS.fixtures },
    { id: 'standings', label: 'Stats', icon: ICONS.standings },
    { id: 'teams', label: 'Squads', icon: ICONS.teams },
    { id: 'more', label: 'More', icon: ICONS.more }
  ];

  return `
    <nav class="fixed bottom-0 inset-x-0 grid grid-cols-5 safe-area-pb z-50 no-print" style="background:rgba(10,10,18,0.95);border-top:1px solid #1e1e32;backdrop-filter:blur(20px);box-shadow:0 -10px 40px rgba(0,0,0,0.6)">
       ${tabs.map(tab => {
         const active = state.view === tab.id || (tab.id === 'more' && ['scorers', 'bracket', 'awards', 'summary'].includes(state.view));
         return `
           <button data-nav="${tab.id}" class="flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90" style="color:${active ? '#60a5fa' : '#475569'}">
             <span class="w-5 h-5">${tab.icon}</span>
             <span class="text-[8px] font-black uppercase tracking-widest" style="opacity:${active ? 1 : 0.5}">${tab.label}</span>
             ${active ? `<span class="absolute bottom-0 w-8 h-0.5 rounded-full" style="background:linear-gradient(90deg,#3b82f6,#7c3aed)"></span>` : ''}
           </button>
         `;
       }).join('')}
    </nav>
  `;
}

function toggleBottomSheet(payload, isCustom = false) {
  const container = document.getElementById('bottom-sheet-container');
  const type = isCustom ? 'custom' : payload;
  
  if (state.activeBottomSheet === type && !isCustom) {
    state.activeBottomSheet = null;
    container.innerHTML = '';
    return;
  }

  state.activeBottomSheet = type;
  let content = '';

  if (isCustom) {
    content = payload;
  } else if (type === 'more') {
    content = `
      <div class="space-y-3 p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">More Options</h4>
          <span class="text-slate-700 font-mono text-[9px] uppercase">v2.1</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button data-view-mobile="scorers" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${ICONS.boot}</span>
             <span class="text-xs font-black uppercase tracking-tight">Top Scorers</span>
          </button>
          <button data-view-mobile="bracket" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${ICONS.bracket}</span>
             <span class="text-xs font-black uppercase tracking-tight">Knockout Stage</span>
          </button>
          <button data-view-mobile="history" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${ICONS.certificate}</span>
             <span class="text-xs font-black uppercase tracking-tight">League History</span>
          </button>
          ${state.isAdmin ? `
          <button data-view-mobile="summary" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${ICONS.trophy}</span>
             <span class="text-xs font-black uppercase tracking-tight">Tournament Report</span>
          </button>
          <button data-view-mobile="awards" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${ICONS.medal}</span>
             <span class="text-xs font-black uppercase tracking-tight">Special Awards</span>
          </button>
          <button data-view-mobile="settings" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800 col-span-2">
             <span class="p-3 rounded-xl" style="background:rgba(59,130,246,0.1);color:#60a5fa">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
             </span>
             <span class="text-xs font-black uppercase tracking-tight">Account Settings &amp; Credentials</span>
          </button>
          ` : ''}
        </div>
        </div>
      </div>
    `;
  } else if (type === 'switcher') {
    content = `
      <div class="space-y-6 p-8">
        <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Tournament Registry</h4>
        <div class="space-y-3 max-h-[50vh] overflow-auto">
          ${state.tournaments.map(t => `
            <button data-switch="${t.id}" class="w-full p-6 bg-slate-950 border ${state.tournament?.id === t.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800'} rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98]">
               <div class="flex flex-col items-start">
                 <span class="font-black text-sm uppercase tracking-tighter ${state.tournament?.id === t.id ? 'text-indigo-400' : 'text-slate-100'}">${t.name}</span>
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${t.type} &bull; ${t.teams.length} Teams</span>
               </div>
               ${state.tournament?.id === t.id ? '<span class="text-indigo-500 text-xs">●</span>' : ''}
            </button>
          `).join('')}
        </div>
        <button id="exit-tournament" class="w-full p-6 bg-slate-800 rounded-[2rem] text-slate-300 font-black uppercase text-[10px] tracking-widest border border-slate-700 shadow-xl">
           EXIT TO COMMAND CENTER &rarr;
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div id="bs-backdrop" class="fixed inset-0 z-[90]" style="background:rgba(5,5,8,0.85);backdrop-filter:blur(12px)"></div>
    <div id="bs-body" class="fixed inset-x-0 bottom-0 rounded-t-[3rem] z-[100] pb-10 safe-area-pb max-h-[90vh] overflow-auto" style="background:#0f0f1a;border-top:1px solid #2a2a48;box-shadow:0 -40px 80px rgba(0,0,0,0.8)">
       <div class="w-12 h-1 rounded-full mx-auto mt-6 mb-4" style="background:#1e1e32"></div>
       ${content}
    </div>
  `;

  document.getElementById('bs-backdrop').addEventListener('click', () => {
    state.activeBottomSheet = null;
    container.innerHTML = '';
  });
  
  if (type === 'more') {
    document.querySelectorAll('[data-view-mobile]').forEach(btn => btn.addEventListener('click', () => {
      state.view = btn.dataset.viewMobile;
      state.activeBottomSheet = null;
      container.innerHTML = '';
      render();
    }));
    document.getElementById('logout-btn').addEventListener('click', () => {
      if (confirm('Sign out of KickOff?')) {
        localStorage.removeItem(SESSION_KEY);
        state.user = null;
        state.tournament = null;
        state.tournaments = [];
        _initialSyncDone = false;
        state.activeBottomSheet = null;
        container.innerHTML = '';
        render();
      }
    });
  } else if (type === 'switcher') {
    document.querySelectorAll('[data-switch]').forEach(btn => btn.addEventListener('click', () => {
      state.tournament = state.tournaments.find(t => t.id === btn.dataset.switch);
      state.view = 'dashboard';
      state.activeBottomSheet = null;
      container.innerHTML = '';
      render();
    }));
    document.getElementById('exit-tournament').addEventListener('click', () => {
       state.tournament = null;
       state.view = 'home';
       state.activeBottomSheet = null;
       container.innerHTML = '';
       notifyParent('TOURNAMENT_CLOSED');
       render();
    });
  }
}

function renderApp(root) {
  const archived = state.tournament.archived;
  
  if (state.isMobile) {
    root.innerHTML = `
      <div class="flex flex-col min-h-screen" style="background:#050508;color:#f1f5f9">
        ${renderMobileTopBar()}
        <main id="main-content" class="flex-1 p-5 pb-32 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div id="view-container"></div>
        </main>
        ${renderBottomNav()}
        <div id="bottom-sheet-container"></div>
      </div>
    `;
  } else {
    root.innerHTML = `
      <div class="flex flex-col md:flex-row min-h-screen" style="background:#050508;color:#f1f5f9">
        <aside class="w-full md:w-64 flex flex-col z-20 sticky top-0 md:h-screen" style="background:#0a0a12;border-right:1px solid #1e1e32">
          <!-- Logo -->
          <div class="flex items-center gap-3 p-5 mb-6" style="border-bottom:1px solid #1e1e32">
            <img src="/logo.png" alt="KickOff" style="width:40px;height:40px;border-radius:10px;object-fit:cover;box-shadow:0 0 16px rgba(59,130,246,0.4),0 0 32px rgba(124,58,237,0.15)">
            <div>
              <div class="text-base font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</div>
              <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Tournaments</div>
            </div>
          </div>

          <nav class="flex-1 px-4 space-y-1">
            ${state.isAdmin ? `
            <button id="back-to-home" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm mb-4" style="color:#475569" onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'">
              <span class="w-4 h-4">${ICONS.arrowLeft}</span>
              <span>All Tournaments</span>
            </button>
            <div class="mb-4" style="height:1px;background:#1e1e32"></div>
            ` : ''}
            ${renderNavLink('dashboard', 'Dashboard', ICONS.dashboard)}
            ${renderNavLink('fixtures', 'Fixtures', ICONS.fixtures)}
            ${renderNavLink('standings', 'Standings', ICONS.standings)}
            ${renderNavLink('scorers', 'Top Scorers', ICONS.boot)}
            ${renderNavLink('teams', 'Teams', ICONS.teams)}
            ${(state.isAdmin && (state.tournament.type === 'knockout' || state.tournament.type === 'groups')) ? renderNavLink('bracket', 'Bracket', ICONS.bracket) : ''}
            ${renderNavLink('history', 'League History', ICONS.certificate)}
            ${state.isAdmin ? renderNavLink('player-creds', 'Player Credentials', ICONS.teams) : ''}
            ${state.isAdmin ? `
            <div style="height:1px;background:#1e1e32;margin:0.5rem 0"></div>
            ${renderNavLink('settings', 'Account Settings', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>')}
            ` : ''}
          </nav>

          ${state.isAdmin ? `
          <div class="p-4 mx-4 mb-6 rounded-xl" style="background:#0f0f1a;border:1px solid #1e1e32">
            <p class="text-[8px] font-black uppercase tracking-widest mb-2" style="color:#334155">Status</p>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full ${archived ? '' : 'pulse-dot'}" style="background:${archived ? '#475569' : '#3b82f6'};box-shadow:${archived ? 'none' : '0 0 6px rgba(59,130,246,0.7)'}"></div>
              <span class="text-[10px] font-black uppercase tracking-widest" style="color:${archived ? '#475569' : '#60a5fa'}">${archived ? 'Archived' : 'Active'}</span>
            </div>
          </div>
          <div class="px-4 mb-2">
            <button id="new-btn-sidebar" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all" style="background:rgba(59,130,246,0.08);color:#60a5fa;border:1px solid rgba(59,130,246,0.15)" onmouseover="this.style.background='linear-gradient(135deg,#3b82f6,#7c3aed)';this.style.color='white';this.style.borderColor='transparent'" onmouseout="this.style.background='rgba(59,130,246,0.08)';this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.15)'">
               <span class="w-4 h-4">${ICONS.plus}</span>
               <span>New Tournament</span>
            </button>
          </div>
          <div class="px-4 pb-4">
            <div class="flex items-center justify-between px-3 py-2.5 rounded-xl" style="background:#0a0a12;border:1px solid #1e1e32">
              <div>
                <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Operational Registry</div>
                <div class="text-xs font-black uppercase" style="color:#60a5fa">${state.tournament.name}</div>
              </div>
            </div>
          </div>
          ` : ''}
        </aside>
        <main id="main-content" class="flex-1 p-6 md:p-10 overflow-auto">
          <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style="color:#334155">
                  <span>Tournaments</span>
                  <span style="color:#1e1e32">/</span>
                  <span style="color:#60a5fa">${state.tournament.name}</span>
                  ${archived ? '<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase" style="background:#0f0f1a;color:#475569;border:1px solid #1e1e32">READ ONLY</span>' : ''}
                </div>
                <h2 class="text-3xl font-black tracking-tight capitalize" style="color:#f1f5f9">${state.view}</h2>
             </div>
             <nav class="flex gap-1 p-1 rounded-xl border no-print" style="background:#0a0a12;border-color:#1e1e32">
                ${['dashboard', 'fixtures', 'standings', 'scorers'].map(v => `
                  <button data-view="${v}" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" style="${state.view === v ? 'background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 2px 12px rgba(59,130,246,0.3)' : 'color:#475569'}" ${state.view !== v ? `onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'"` : ''}>
                    ${v === 'scorers' ? 'Scorers' : v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                `).join('')}
             </nav>
          </header>
          <div id="view-container"></div>
        </main>
      </div>
    `;
  }

  setupAppListeners();
  renderCurrentView();
}

function setupAppListeners() {
  if (state.isMobile) {
    document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => {
      const navId = btn.dataset.nav;
      if (navId === 'more') {
        toggleBottomSheet('more');
      } else {
        state.view = navId;
        render();
      }
    }));

    const exitToRegistryBtn = document.getElementById('exit-to-registry');
    if (exitToRegistryBtn) exitToRegistryBtn.addEventListener('click', () => {
      state.tournament = null;
      state.view = 'home';
      notifyParent('TOURNAMENT_CLOSED');
      render();
    });

    const switcherBtn = document.getElementById('mobile-switcher-btn');
    if (switcherBtn) switcherBtn.addEventListener('click', () => toggleBottomSheet('switcher'));

    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
  } else {
    document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); }));
    
    const backBtn = document.getElementById('back-to-home');
    if (backBtn) backBtn.addEventListener('click', () => {
      state.tournament = null;
      state.view = 'home';
      notifyParent('TOURNAMENT_CLOSED');
      render();
    });

    const newBtnSidebar = document.getElementById('new-btn-sidebar');
    if (newBtnSidebar) newBtnSidebar.addEventListener('click', () => {
      if (state.tournaments.length >= 10) {
        alert('Maximum 10 tournaments reached.');
        return;
      }
      state.tournament = null;
      state.onboarding.step = 1;
      render();
    });

    const logoutBtnSidebar = document.getElementById('logout-btn-sidebar');
    if (logoutBtnSidebar) logoutBtnSidebar.addEventListener('click', () => {
      if (confirm('Sign out of KickOff?')) {
        localStorage.removeItem(SESSION_KEY);
        state.user = null;
        state.tournament = null;
        state.tournaments = [];
        _initialSyncDone = false;
        render();
      }
    });
  }
}

function renderNavLink(id, label, icon) {
  const active = state.view === id;
  const activeStyle = 'background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));color:#60a5fa;border:1px solid rgba(59,130,246,0.2)';
  const inactiveStyle = 'color:#475569;border:1px solid transparent';
  return `<button data-view="${id}" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm" style="${active ? activeStyle : inactiveStyle}" ${!active ? `onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'"` : ''}><span class="w-4 h-4 flex-shrink-0">${icon}</span><span>${label}</span></button>`;
}

function renderCurrentView() {
  const container = document.getElementById('view-container');
  switch (state.view) {
    case 'dashboard': renderDashboard(container); break;
    case 'fixtures': renderFixtures(container); break;
    case 'standings': renderStandingsView(container); break;
    case 'scorers': renderTopScorers(container); break;
    case 'teams': renderTeamsView(container); break;
    case 'bracket': renderBracket(container); break;
    case 'h2h': renderHeadToHeadView(container); break;
    case 'summary': renderTournamentSummary(container); break;
    case 'history': renderHistoryView(container); break;
    case 'player-creds': renderPlayerCredentialsView(container); break;
    case 'champion': renderChampionScreen(container); break;
    case 'awards': renderAwardsScreen(container); break;
    case 'settings': renderSettings(container); break;
  }
}

// ---- SETTINGS / CHANGE CREDENTIALS ----
function renderSettings(container) {
  const settingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.17 13.57M4.93 19.07a10 10 0 0 1 1.17-13.57M4.93 4.93A10 10 0 0 1 18.5 3.5"/><path d="m21 21-6.5-6.5"/></svg>`;
  const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  container.innerHTML = `
    <div class="max-w-lg mx-auto space-y-8 pb-24 md:pb-8">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-black tracking-tight" style="color:#f1f5f9">Account Settings</h2>
        <p class="text-xs font-bold mt-1 uppercase tracking-widest" style="color:#475569">Manage your admin credentials</p>
      </div>

      <!-- Current User Info -->
      <div class="rounded-2xl p-5 flex items-center gap-4" style="background:#0f0f1a;border:1px solid #1e1e32">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#3b82f6,#7c3aed)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest mb-0.5" style="color:#334155">Signed in as</p>
          <p class="font-black text-base uppercase" style="color:#60a5fa">${state.user?.username}</p>
          <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${state.user?.role || 'admin'}</p>
        </div>
      </div>

      <!-- Change Username -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#60a5fa">${userIcon}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Change Username</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <form id="change-username-form" class="space-y-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">New Username</label>
              <input id="new-username" type="text" placeholder="Enter new username" autocomplete="off"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Current Password (to confirm)</label>
              <input id="confirm-pw-for-username" type="password" placeholder="Enter current password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <p id="username-msg" class="text-xs font-bold" style="color:#f87171;display:none"></p>
            <button type="submit" style="background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));color:#60a5fa;border:1px solid rgba(59,130,246,0.25);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
              onmouseover="this.style.background='linear-gradient(135deg,#3b82f6,#7c3aed)';this.style.color='white';this.style.borderColor='transparent'"
              onmouseout="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.25)'">
              Update Username
            </button>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#a78bfa">${lockIcon}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Change Password</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <form id="change-password-form" class="space-y-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Current Password</label>
              <input id="current-password" type="password" placeholder="Enter current password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">New Password</label>
              <input id="new-password" type="password" placeholder="At least 6 characters"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Confirm New Password</label>
              <input id="confirm-new-password" type="password" placeholder="Repeat new password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <p id="password-msg" class="text-xs font-bold" style="color:#f87171;display:none"></p>
            <button type="submit" style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15));color:#a78bfa;border:1px solid rgba(124,58,237,0.25);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
              onmouseover="this.style.background='linear-gradient(135deg,#7c3aed,#3b82f6)';this.style.color='white';this.style.borderColor='transparent'"
              onmouseout="this.style.background='linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15))';this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.25)'">
              Update Password
            </button>
          </form>
        </div>
      </div>

      <!-- Scheduling Settings (Admin Only) -->
      ${state.isAdmin ? `
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#60a5fa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg></span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Matchday Scheduling</span>
        </div>
        <div class="p-5 space-y-6" style="background:#0a0a12">
          <form id="update-scheduling-form" class="space-y-6">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-3" style="color:#475569">Days per Matchday</label>
              <select name="daysPerMatchday" class="w-full bg:#050508 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold outline-none" style="background:#050508">
                ${[1,2,3,4,5,6,7].map(n => `<option value="${n}" ${t.scheduling?.daysPerMatchday === n ? 'selected' : ''}>${n} Day${n>1?'s':''}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-3" style="color:#475569">Operational Days</label>
              <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                ${['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map(day => {
                  const checked = t.scheduling?.matchDays?.includes(day);
                  return `
                  <div class="relative">
                    <input type="checkbox" name="matchDays" value="${day}" id="set-day-${day}" class="peer hidden" ${checked ? 'checked' : ''}>
                    <label for="set-day-${day}" class="flex items-center justify-center py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-[9px] font-black text-slate-600 uppercase cursor-pointer transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-transparent">
                      ${day}
                    </label>
                  </div>`;
                }).join('')}
              </div>
            </div>
            <button type="submit" class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Save Schedule</button>
          </form>
        </div>
      </div>
      ` : ''}

      ${state.isAdmin ? `
      <!-- Danger Zone -->
      <div class="rounded-2xl overflow-hidden mt-12" style="border:1px solid rgba(239,68,68,0.2)">
        <div class="px-5 py-4 flex items-center gap-3" style="background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.2)">
          <span style="color:#f87171">${ICONS.trash}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#f87171">Danger Zone</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <p class="text-xs font-bold mb-4 text-slate-400">Permanently delete this tournament and all its data. This action cannot be undone.</p>
          <button id="delete-tournament-btn-settings" style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.3);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
            onmouseover="this.style.background='#ef4444';this.style.color='white'"
            onmouseout="this.style.background='rgba(239,68,68,0.1)';this.style.color='#f87171'">
            Delete Tournament
          </button>
        </div>
      </div>
      ` : ''}
    </div>
  `;

  // Listeners for Settings
  if (state.isAdmin) {
    document.getElementById('update-scheduling-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      t.scheduling = {
        daysPerMatchday: parseInt(data.get('daysPerMatchday')),
        matchDays: Array.from(e.target.querySelectorAll('input[name="matchDays"]:checked')).map(cb => cb.value)
      };
      saveState();
      showToast('Schedule updated');
      render();
    });
  }



// ---- PLAYER CREDENTIALS ----
async function renderPlayerCredentialsView(container) {
  const players = state.dashboardPlayers || [];
  
  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
      <div>
        <h2 class="text-3xl font-black tracking-tight" style="color:#f1f5f9">Player Credentials</h2>
        <p class="text-xs font-bold mt-1 uppercase tracking-widest" style="color:#475569">Assign login details to your squad</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${players.map(p => `
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] transition-all hover:bg-slate-900/50">
            <div class="flex items-center gap-5 mb-6">
              <img src="${p.image}" class="w-14 h-14 rounded-2xl object-cover border border-slate-800">
              <div class="flex-1 min-w-0">
                <p class="font-black text-slate-100 uppercase truncate text-lg">${p.name}</p>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">${p.team || 'Unattached'}</p>
              </div>
              <button data-player-id="${p.id}" class="edit-player-cred-btn p-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl transition-all shadow-lg active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Email</span>
                <span class="text-xs font-bold text-slate-300">${p.email || '—'}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Password</span>
                <span class="text-xs font-bold text-slate-300">${p.password || '—'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.edit-player-cred-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const p = players.find(player => player.id === btn.dataset.playerId);
      if (p) showPlayerCredEditor(p);
    });
  });
}

function showPlayerCredEditor(player) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300';
  modal.innerHTML = `
    <div class="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 shadow-3xl p-10 animate-in zoom-in duration-300">
      <div class="flex items-center gap-4 mb-10">
        <img src="${player.image}" class="w-14 h-14 rounded-2xl object-cover border border-slate-800">
        <div>
          <h3 class="text-xl font-black text-slate-100 uppercase">${player.name}</h3>
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assign Credentials</p>
        </div>
      </div>

      <form id="player-cred-form" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[9px] font-black tracking-widest text-slate-500 uppercase">GMAIL / EMAIL</label>
          <input type="email" name="email" value="${player.email || ''}" required 
            class="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-indigo-500 transition-all">
        </div>
        <div class="space-y-2">
          <label class="text-[9px] font-black tracking-widest text-slate-500 uppercase">PASSWORD</label>
          <input type="text" name="password" value="${player.password || ''}" required 
            class="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-indigo-500 transition-all">
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" id="cancel-cred" class="flex-1 py-4 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl">Cancel</button>
          <button type="submit" class="flex-1 py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20">Save Access</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  
  modal.querySelector('#cancel-cred').onclick = () => modal.remove();
  modal.querySelector('#player-cred-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const updates = {
      email: data.get('email'),
      password: data.get('password')
    };

    try {
      const pIndex = state.dashboardPlayers.findIndex(pl => pl.id === player.id);
      if (pIndex !== -1) {
        state.dashboardPlayers[pIndex] = { ...state.dashboardPlayers[pIndex], ...updates };
        await updateDoc(doc(db, 'players', player.id), updates);
        showToast(`Credentials updated for ${player.name}`);
        modal.remove();
        renderCurrentView();
      }
    } catch (err) {
      console.error(err);
      alert('Error updating credentials.');
    }
  };
}

  // --- Change Username handler ---
  document.getElementById('change-username-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('username-msg');
    const newUsername = document.getElementById('new-username').value.trim();
    const confirmPw = document.getElementById('confirm-pw-for-username').value;
    msg.style.display = 'none';

    if (!newUsername || newUsername.length < 3) {
      msg.textContent = 'Username must be at least 3 characters.'; msg.style.display = 'block'; return;
    }
    if (newUsername === state.user.username) {
      msg.textContent = 'New username is the same as current.'; msg.style.display = 'block'; return;
    }

    try {
      const oldDoc = doc(db, 'users', state.user.username);
      const snap = await getDoc(oldDoc);
      if (!snap.exists()) { msg.textContent = 'User not found.'; msg.style.display = 'block'; return; }
      const userData = snap.data();
      const hashed = await hashPassword(confirmPw);
      if (userData.password !== hashed) {
        msg.textContent = 'Incorrect current password.'; msg.style.color = '#f87171'; msg.style.display = 'block'; return;
      }
      // Check new username not taken
      const newSnap = await getDoc(doc(db, 'users', newUsername));
      if (newSnap.exists()) {
        msg.textContent = 'That username is already taken.'; msg.style.color = '#f87171'; msg.style.display = 'block'; return;
      }
      // Create new doc, delete old
      await setDoc(doc(db, 'users', newUsername), { ...userData, username: newUsername });
      await deleteDoc(oldDoc);
      // Update session
      const session = { ...state.user, username: newUsername, loginTime: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      state.user = session;
      await logActivity(`Username changed to: ${newUsername}`);
      showToast('Username updated successfully!');
      msg.style.color = '#34d399'; msg.textContent = '✓ Username updated. You are now signed in as ' + newUsername;
      msg.style.display = 'block';
      document.getElementById('new-username').value = '';
      document.getElementById('confirm-pw-for-username').value = '';
      // Re-render sidebar to show new username
      render();
    } catch(err) {
      console.error(err);
      msg.textContent = 'Error: ' + (err.message || 'Update failed.'); msg.style.color = '#f87171'; msg.style.display = 'block';
    }
  });

  // --- Change Password handler ---
  document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('password-msg');
    const currentPw = document.getElementById('current-password').value;
    const newPw = document.getElementById('new-password').value;
    const confirmNewPw = document.getElementById('confirm-new-password').value;
    msg.style.display = 'none';

    if (newPw.length < 6) {
      msg.textContent = 'New password must be at least 6 characters.'; msg.style.color = '#f87171'; msg.style.display = 'block'; return;
    }
    if (newPw !== confirmNewPw) {
      msg.textContent = 'New passwords do not match.'; msg.style.color = '#f87171'; msg.style.display = 'block'; return;
    }

    try {
      const userDoc = doc(db, 'users', state.user.username);
      const snap = await getDoc(userDoc);
      if (!snap.exists()) { msg.textContent = 'User not found.'; msg.style.display = 'block'; return; }
      const userData = snap.data();
      const currentHashed = await hashPassword(currentPw);
      if (userData.password !== currentHashed) {
        msg.textContent = 'Current password is incorrect.'; msg.style.color = '#f87171'; msg.style.display = 'block'; return;
      }
      const newHashed = await hashPassword(newPw);
      await updateDoc(userDoc, { password: newHashed, loginAttempts: 0 });
      await logActivity('Password changed');
      showToast('Password updated successfully!');
      msg.style.color = '#34d399'; msg.textContent = '✓ Password changed. Keep it safe!';
      msg.style.display = 'block';
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-new-password').value = '';
    } catch(err) {
      console.error(err);
      msg.textContent = 'Error: ' + (err.message || 'Update failed.'); msg.style.color = '#f87171'; msg.style.display = 'block';
    }
  });

  const deleteBtn = document.getElementById('delete-tournament-btn-settings');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showDeleteConfirmation(state.tournament.id);
    });
  }
}

function renderStandingsView(container) {
  const isGroups = state.tournament.type === 'groups';
  
  const totalRounds = Math.max(...state.tournament.fixtures.map(f => f.round), 1);
  if (state.timelineRound === null) state.timelineRound = totalRounds;

  const timelineUI = `
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 no-print">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matchday Timeline</h4>
          <p class="text-xl font-black text-indigo-400 font-mono">MD ${state.timelineRound} / ${totalRounds}</p>
        </div>
        <div class="flex-1 flex items-center gap-4">
          <input type="range" id="timeline-slider" min="1" max="${totalRounds}" value="${state.timelineRound}" 
            class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
          <div class="flex gap-2">
            <button id="timeline-prev" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&larr;</button>
            <button id="timeline-next" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&rarr;</button>
          </div>
        </div>
        <button id="timeline-reset" class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Latest</button>
      </div>
    </div>
  `;

  if (state.isMobile) {
    container.innerHTML = `
      <div class="space-y-6">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Engine Output</h3>
          <div class="flex items-center gap-2 no-print">
            <button id="export-pdf-btn-mobile" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-2 rounded-lg active:scale-95 transition-all">PDF</button>
            <div class="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button id="view-mode-compact" class="p-2.5 rounded-lg ${state.mobileStandingsMode === 'compact' ? 'bg-slate-800 text-indigo-400' : 'text-slate-600'} transition-all active:scale-90">
                ${ICONS.league}
              </button>
              <button id="view-mode-cards" class="p-2.5 rounded-lg ${state.mobileStandingsMode === 'cards' ? 'bg-slate-800 text-indigo-400' : 'text-slate-600'} transition-all active:scale-90">
                ${ICONS.group}
              </button>
            </div>
          </div>
        </header>

        ${timelineUI}

        <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print overflow-x-auto no-scrollbar mb-4">
          ${['overall', 'home', 'away', 'cleansheets'].map(f => `
            <button data-filter="${f}" class="flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.standingsFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}">
              ${f === 'cleansheets' ? 'Clean' : f}
            </button>
          `).join('')}
        </div>

        <div id="standings-content" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${renderStandingsTable(false, null, state.timelineRound)}
        </div>
      </div>
    `;

    const pdfBtn = container.querySelector('#export-pdf-btn-mobile');
    if (pdfBtn) pdfBtn.addEventListener('click', exportStandingsAsPDF);

    container.querySelector('#view-mode-compact').addEventListener('click', () => {
      state.mobileStandingsMode = 'compact';
      localStorage.setItem('mobile_standings_mode', 'compact');
      renderStandingsView(container);
    });
    container.querySelector('#view-mode-cards').addEventListener('click', () => {
      state.mobileStandingsMode = 'cards';
      localStorage.setItem('mobile_standings_mode', 'cards');
      renderStandingsView(container);
    });
  } else {
    const exportControls = `
      <div class="flex flex-wrap gap-4 no-print justify-end transition-all">
        <button id="print-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">🖨️</span> Print
        </button>
        <button id="export-img-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📷</span> Image
        </button>
        <button id="export-pdf-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> PDF
        </button>
      </div>
    `;

    const printHeader = `
      <div class="print-header">
        <h1>${state.tournament.name}</h1>
        <p>Tournament Standings • ${state.standingsFilter.toUpperCase()} View • Matchday ${state.timelineRound} • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    const filterTabs = `
      <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print self-start">
        ${['overall', 'home', 'away', 'cleansheets'].map(f => `
          <button data-filter="${f}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.standingsFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}" style="${state.standingsFilter === f ? 'box-shadow:0 4px 12px rgba(79,70,229,0.3)' : ''}">
            ${f === 'cleansheets' ? 'Clean Sheets' : f}
          </button>
        `).join('')}
      </div>
    `;

    if (isGroups) {
      container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${filterTabs}
           ${exportControls}
        </div>
        ${timelineUI}
        ${printHeader}
        <div id="standings-content" class="grid grid-cols-1 xl:grid-cols-2 gap-12">
          ${state.tournament.groups.map(g => `
            <div class="space-y-6">
              <h4 class="text-xl font-black text-slate-100 flex items-center gap-4">
                <span class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm tracking-tighter">${g.name}</span>
                Group ${g.name}
              </h4>
              ${renderStandingsTable(false, g.id, state.timelineRound)}
            </div>
          `).join('')}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${filterTabs}
           ${exportControls}
        </div>
        ${timelineUI}
        ${printHeader}
        <div id="standings-content">
          ${renderStandingsTable(false, null, state.timelineRound)}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;
    }

    const printBtn = container.querySelector('#print-btn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    const imgBtn = container.querySelector('#export-img-btn');
    if (imgBtn) imgBtn.addEventListener('click', exportStandingsAsImage);
    const pdfBtn = container.querySelector('#export-pdf-btn');
    if (pdfBtn) pdfBtn.addEventListener('click', exportStandingsAsPDF);
  }

  // Listeners
  const slider = document.getElementById('timeline-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      state.timelineRound = parseInt(e.target.value);
      renderStandingsView(container);
    });
  }

  const prevBtn = document.getElementById('timeline-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (state.timelineRound > 1) {
      state.timelineRound--;
      renderStandingsView(container);
    }
  });

  const nextBtn = document.getElementById('timeline-next');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (state.timelineRound < totalRounds) {
      state.timelineRound++;
      renderStandingsView(container);
    }
  });

  const resetBtn = document.getElementById('timeline-reset');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    state.timelineRound = totalRounds;
    renderStandingsView(container);
  });

  container.querySelectorAll('[data-filter]').forEach(btn => {
     btn.addEventListener('click', () => {
       state.standingsFilter = btn.dataset.filter;
       renderStandingsView(container);
     });
  });

  container.querySelectorAll('.team-detail-btn').forEach(btn => {
     btn.addEventListener('click', () => renderTeamDetail(btn.dataset.teamId));
  });
}

function renderTopScorers(container) {
  const scorers = calculateTopScorers();
  
  if (state.isMobile) {
    container.innerHTML = `
      <div class="space-y-4 animate-in fade-in duration-500 pb-20">
        <div>
          <h3 class="text-3xl font-black tracking-tight text-slate-100">Top Scorers</h3>
          <p class="text-slate-500 font-medium tracking-widest uppercase text-xs mt-1">Full Leaderboard & Fantasy Performance</p>
        </div>
        ${scorers.map((s, idx) => {
          const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : null));
          const bgColor = idx < 3 ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-slate-900 border-slate-800';
          
          return `
            <div class="${bgColor} border rounded-[2rem] p-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-all">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-xs font-black text-slate-700 border border-slate-800">
                    ${s.name.substring(0,2).toUpperCase()}
                  </div>
                  ${medal ? `<span class="absolute -top-1 -right-1 text-base animate-bounce">${medal}</span>` : ''}
                </div>
                <div>
                  <h4 class="font-black text-slate-100 uppercase tracking-tight text-sm">${s.name}</h4>
                  <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest team-detail-btn cursor-pointer" data-team-id="${s.teamId}">View Stats</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-black text-slate-100 italic tracking-tighter leading-none">${s.fantasyPoints}</div>
                <div class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Fantasy Pts</div>
                <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${s.goals} Goals • ${s.matchesCount} Matches</div>
              </div>
            </div>
          `;
        }).join('')}
        ${scorers.length === 0 ? '<div class="text-center py-20 text-slate-700 italic uppercase tracking-[0.2em] font-black text-xs">No records detected</div>' : ''}
      </div>
    `;
  } else {
    const top3 = scorers.slice(0, 3);
    const rest = scorers.slice(3);
    const medals = [
      { label: '🥇', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500' },
      { label: '🥈', bg: 'bg-slate-300/10', border: 'border-slate-300/20', text: 'text-slate-300' },
      { label: '🥉', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500' }
    ];

    container.innerHTML = `
      <div class="space-y-16 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${top3.map((s, idx) => {
            const m = medals[idx];
            return `
              <div class="${m.bg} ${m.border} border rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                 <div class="absolute top-6 right-8 text-4xl">${m.label}</div>
                 <div class="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-slate-800 border border-slate-800">
                   ${s.name.substring(0,2).toUpperCase()}
                 </div>
                 <div class="space-y-2">
                   <h3 class="text-2xl font-black text-slate-100">${s.name}</h3>
                   <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-indigo-400 team-detail-btn" data-team-id="${s.teamId}">Team Profile</p>
                 </div>
                 <div class="grid grid-cols-2 w-full gap-4 pt-4 border-t border-slate-800/30">
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Fantasy Points</p>
                     <p class="text-3xl font-black ${m.text} font-mono">${s.fantasyPoints}</p>
                   </div>
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Goals / Matches</p>
                     <p class="text-xl font-black text-slate-100 font-mono">${s.goals} / ${s.matchesCount}</p>
                   </div>
                 </div>
              </div>
            `;
          }).join('')}
          ${top3.length === 0 ? '<div class="md:col-span-3 text-center py-20 text-slate-700 italic">No goal records detected in the current deployment.</div>' : ''}
        </div>

        ${rest.length > 0 ? `
          <div class="bg-slate-900 rounded-[3rem] border border-slate-800 p-10 shadow-3xl">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
                  <th class="pb-6 pl-4">Rank</th>
                  <th class="pb-6">Team Name</th>
                  <th class="pb-6 text-center">Form Summary</th>
                  <th class="pb-6 text-right pr-6">Fantasy Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${rest.map((s, idx) => `
                  <tr class="group">
                    <td class="py-6 pl-4 font-mono font-black text-slate-600">${idx + 4}</td>
                    <td class="py-6 font-black text-slate-200">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-700">${s.name.substring(0,2).toUpperCase()}</div>
                        ${s.name}
                      </div>
                    </td>
                    <td class="py-6 text-center font-mono text-slate-500">${s.goals} G / ${s.matchesCount} M</td>
                    <td class="py-6 text-right pr-6 font-black text-2xl text-indigo-400 font-mono tracking-tighter">${s.fantasyPoints}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    `;
  }
  container.querySelectorAll('.team-detail-btn').forEach(btn => {
     btn.addEventListener('click', () => renderTeamDetail(btn.dataset.teamId));
  });
}

function renderDashboard(container) {
  const fixtures = state.tournament.fixtures;
  const recent = fixtures.filter(m => m.status === 'completed').slice(-3).reverse();
  const upcoming = fixtures.filter(m => m.status === 'upcoming').slice(0, 3);
  const groupsDone = state.tournament.type === 'groups' && state.tournament.currentStage === 'groups' && fixtures.filter(m => m.stage === 'groups' && m.status !== 'completed').length === 0;
  
  const scorers = calculateTopScorers();
  const topScorer = scorers[0] || null;

  if (state.isMobile) {
    container.innerHTML = `
      <div class="space-y-8 pb-32 animate-in fade-in duration-700">
        <!-- Hero Section -->
        <div class="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${ICONS.trophy}</div>
          <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 italic">Tournament Active</p>
          <h3 class="text-white font-black text-2xl leading-none tracking-tighter uppercase mb-6">${state.tournament.name}</h3>
          <button data-view="fixtures" class="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
            ${ICONS.league} ${state.isAdmin ? 'Manage Schedule' : 'View Fixtures'}
          </button>
        </div>

        <!-- Mini Stats -->
        <div class="grid grid-cols-2 gap-4">
          ${renderMobileStatCard('Matches', fixtures.length, 'text-indigo-400')}
          ${renderMobileStatCard('Played', fixtures.filter(m => m.status === 'completed').length, 'text-emerald-400')}
          ${renderMobileStatCard('Goals', fixtures.reduce((acc, m) => acc + (m.homeScore || 0) + (m.awayScore || 0), 0), 'text-slate-400')}
        </div>

        ${groupsDone ? `<div class="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-lg font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white w-full py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>` : ''}

        <!-- Recent Activity -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
            <button data-view="fixtures" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">View All</button>
          </div>
          <div class="space-y-3">
            ${recent.length ? recent.map(m => renderCompactMatch(m)).join('') : '<div class="p-10 border border-slate-800 rounded-[2rem] text-center text-slate-600 italic text-xs uppercase font-black">No recent matches</div>'}
          </div>
        </section>

        <!-- Top Scoring Team Snapshot -->
        ${topScorer ? `
          <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between" data-view="scorers">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-sm font-black text-indigo-400 border border-slate-800 shadow-inner overflow-hidden">
                 ${topScorer.image ? `<img src="${topScorer.image}" class="w-full h-full object-cover">` : topScorer.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h4 class="font-black text-slate-100 uppercase tracking-tight text-xs">Top Scorer</h4>
                <p class="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">${topScorer.name}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black text-indigo-400 font-mono italic">${topScorer.goals}</span>
              <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">GLS</span>
            </div>
          </div>
        ` : ''}



        <!-- Form Progression Chart (Top 5 Teams) -->
        <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
           <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Title Race Momentum</h3>
           <div class="h-48 w-full"><canvas id="formChartMobileDashboard"></canvas></div>
        </section>

        <!-- Simplified Standings Snapshot -->
        <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 overflow-hidden">
           <div class="flex items-center justify-between mb-6">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classification Snapshot</h3>
              <button data-view="standings" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Full List &rarr;</button>
           </div>
           ${renderStandingsTable(true)}
        </section>

        <!-- Biggest Win Snapshot -->
        ${(() => {
          const bw = getBiggestWin();
          if (!bw) return '';
          const h = state.tournament.teams.find(t => t.id === bw.homeId);
          const a = state.tournament.teams.find(t => t.id === bw.awayId);
          if (!h || !a) return '';
          return `
            <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Record: Biggest Win</h3>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 flex items-center justify-end gap-2">
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${h.name}</p>
                  ${h.image ? `<img src="${h.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">` : ''}
                </div>
                <div class="px-5 py-2 bg-indigo-600 rounded-xl font-black font-mono text-white shadow-lg shadow-indigo-900/40 whitespace-nowrap">
                  ${bw.homeScore} - ${bw.awayScore}
                </div>
                <div class="flex-1 flex items-center gap-2">
                  ${a.image ? `<img src="${a.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">` : ''}
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${a.name}</p>
                </div>
              </div>
            </div>
          `;
        })()}
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          ${renderStatCard('Matches', fixtures.length, 'text-indigo-400')}
          ${renderStatCard('Played', fixtures.filter(m => m.status === 'completed').length, 'text-emerald-400')}
          ${renderStatCard('Teams', state.tournament.teams.length, 'text-slate-400')}
          ${renderStatCard('Goals', fixtures.reduce((acc, m) => acc + (m.homeScore || 0) + (m.awayScore || 0), 0), 'text-yellow-400')}
        </div>
        
        <div class="lg:col-span-4 bg-indigo-600 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${ICONS.trophy}</div>
          <h3 class="text-white font-black text-xl leading-tight">System Online</h3>
          <button data-view="fixtures" class="bg-white text-indigo-600 font-black py-4 rounded-2xl mt-6 uppercase text-[10px] tracking-widest relative z-10 hover:bg-slate-100 transition-colors">Manage Schedule</button>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-8 space-y-8">
          ${groupsDone ? `<div class="bg-indigo-600/10 p-10 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-2xl font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>` : ''}
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Recent Activity</h3>
              <div class="space-y-4">${recent.length ? recent.map(m => renderCompactMatch(m)).join('') : '<p class="text-slate-600 italic">No matches detected.</p>'}</div>
            </section>
            
            <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Next Engagements</h3>
              <div class="space-y-4">${upcoming.length ? upcoming.map(m => renderCompactMatch(m)).join('') : '<p class="text-slate-600 italic">Season complete.</p>'}</div>
            </section>
          </div>
  
          <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800">
             <div class="flex items-center justify-between mb-8">
               <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Analytics</h3>
               <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-[9px] font-black text-slate-600 uppercase">Title Race Progression</span>
                  </div>
               </div>
             </div>
             <div class="h-64 w-full">
               <canvas id="formChartDesktopDashboard"></canvas>
             </div>
          </section>

          <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 overflow-visible">
             <div class="flex items-center justify-between mb-8">
                <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistical Rank</h3>
                <button data-view="standings" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Full Standings &rarr;</button>
             </div>
             ${renderStandingsTable(true)}
          </section>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-4 space-y-8">
          ${topScorer ? `
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-3xl">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top Scorer</span>
                <span class="text-2xl">🥇</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-center text-2xl font-black text-indigo-400 shadow-inner overflow-hidden">
                  ${topScorer.image ? `<img src="${topScorer.image}" class="w-full h-full object-cover">` : topScorer.name.substring(0,2).toUpperCase()}
                </div>
                <div class="space-y-1">
                  <h4 class="text-2xl font-black text-slate-100 tracking-tighter uppercase">${topScorer.name}</h4>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${topScorer.matchesCount} Matches Played</p>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                  <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Scored</p>
                  <p class="text-4xl font-black text-indigo-400 font-mono italic">${topScorer.goals}</p>
                </div>
              </div>
              <button data-view="scorers" class="w-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest">Full Stats Registry</button>
            </div>
          ` : `
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-center space-y-4">
              <div class="text-slate-800 mx-auto">${ICONS.boot}</div>
              <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest">Competitive data pending</p>
            </div>
          `}
  
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Records</h4>
            <div class="space-y-4">
              ${(() => {
                const bw = getBiggestWin();
                if (!bw) return '<p class="text-xs text-slate-600 italic">No records established.</p>';
                const h = state.tournament.teams.find(t => t.id === bw.homeId);
                const a = state.tournament.teams.find(t => t.id === bw.awayId);
                if (!h || !a) return '';
                return `
                  <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Biggest Margin of Victory</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        ${h.image ? `<img src="${h.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">` : ''}
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${h.name}</span>
                      </div>
                      <span class="font-black font-mono text-indigo-400 mx-3">${bw.homeScore} - ${bw.awayScore}</span>
                      <div class="flex items-center justify-end gap-2 text-right">
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${a.name}</span>
                        ${a.image ? `<img src="${a.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">` : ''}
                      </div>
                    </div>
                  </div>
                `;
              })()}
            </div>
          </div>
          

          
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming Discipline</h4>
            <div class="space-y-4">
              ${state.tournament.teams.slice(0, 4).map(t => `
                 <div class="flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 p-2 rounded-xl transition-all team-detail-btn" data-team-id="${t.id}">
                   <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600">${t.name.substring(0,2).toUpperCase()}</div>
                     <span class="font-bold text-slate-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-32">${t.name}</span>
                   </div>
                   <div class="text-xs font-black text-indigo-400/50 group-hover:text-indigo-400">DETAIL</div>
                 </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if(document.getElementById('adv-ko')) document.getElementById('adv-ko').addEventListener('click', advanceGroupToKnockout);
  container.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); }));
  container.querySelectorAll('.team-detail-btn').forEach(btn => {
     btn.addEventListener('click', () => renderTeamDetail(btn.dataset.teamId));
  });

  setTimeout(() => {
    try {
      if (typeof Chart === 'undefined') {
        console.warn('[KickOff] Chart.js not loaded yet.');
        return;
      }
      if (state.isMobile) {
        initDashboardFormChart('formChartMobileDashboard');
      } else {
        initDashboardFormChart('formChartDesktopDashboard');
      }
    } catch (e) {
      console.error('[KickOff] Dashboard Charts Error:', e);
    }
  }, 100);
}



function initDashboardFormChart(canvasId) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const standings = calculateStandings().slice(0, 5); // Top 5 teams
  const allRounds = Array.from(new Set(state.tournament.fixtures.map(m => m.round))).sort((a,b) => a-b);
  const completedRounds = Array.from(new Set(state.tournament.fixtures.filter(m => m.status === 'completed').map(m => m.round))).sort((a,b) => a-b);

  const datasets = standings.map((team, idx) => {
    let points = 0;
    const progression = [0];
    const teamFixtures = state.tournament.fixtures.filter(m => m.status === 'completed' && (m.homeId === team.id || m.awayId === team.id));
    
    allRounds.forEach(r => {
      const m = teamFixtures.find(match => match.round === r);
      if (m) {
        const isHome = m.homeId === team.id;
        if (m.homeScore === m.awayScore) points += 1;
        else if (isHome && m.homeScore > m.awayScore) points += 3;
        else if (!isHome && m.awayScore > m.homeScore) points += 3;
      }
      progression.push(points);
    });

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    return {
      label: team.name,
      data: progression,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length] + '10',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.4,
      fill: idx === 0 // only fill the leader
    };
  });

  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0', ...allRounds.map(r => `${r}`)],
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { 
        legend: { 
          display: !state.isMobile, 
          position: 'bottom', 
          labels: { 
            color: '#475569', 
            font: { size: 9, weight: '700' },
            usePointStyle: true,
            boxWidth: 6
          } 
        },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 12,
          cornerRadius: 12,
          titleFont: { family: 'Inter', size: 10, weight: '900' },
          bodyFont: { family: 'Inter', size: 11, weight: 'bold' }
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, 
          ticks: { color: '#475569', font: { size: 9, weight: '700' } } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: '#475569', font: { size: 9, weight: '700' } } 
        }
      }
    }
  });
}

function renderStatCard(label, val, color) {
  const colorMap = { 'text-indigo-400':'#60a5fa', 'text-emerald-400':'#34d399', 'text-slate-400':'#94a3b8', 'text-yellow-400':'#facc15' };
  const c = colorMap[color] || '#60a5fa';
  return `<div class="rounded-2xl p-6" style="background:#0f0f1a;border:1px solid #1e1e32"><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#475569">${label}</p><p class="text-3xl font-black font-mono" style="color:${c}">${val}</p></div>`;
}

function renderMobileStatCard(label, val, color) {
  const colorMap = { 'text-indigo-400':'#60a5fa', 'text-emerald-400':'#34d399' };
  const c = colorMap[color] || '#60a5fa';
  return `<div class="p-5 rounded-2xl text-center" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)"><p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#475569">${label}</p><p class="text-2xl font-black font-mono leading-none" style="color:${c}">${val}</p></div>`;
}

function renderCompactMatch(m) {
  const h = state.tournament.teams.find(t => t.id === m.homeId) || { name: '?' };
  const a = state.tournament.teams.find(t => t.id === m.awayId) || { name: '?' };
  const score = m.status === 'upcoming' ? 'VS' : `${m.homeScore}–${m.awayScore}`;
  const hImg = h.image ? `<img src="${h.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">` : '';
  const aImg = a.image ? `<img src="${a.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">` : '';
  return `<div class="p-4 rounded-xl flex items-center justify-between transition-all" style="background:#0a0a12;border:1px solid #1e1e32">
    <div class="flex-1 flex items-center justify-end gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${h.id}">
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${h.name}</span>
      ${hImg}
    </div>
    <div class="mx-4 px-4 py-1.5 rounded-lg font-black font-mono text-sm" style="background:#0f0f1a;color:#60a5fa;border:1px solid #1e1e32">${score}</div>
    <div class="flex-1 flex items-center gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${a.id}">
      ${aImg}
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${a.name}</span>
    </div>
  </div>`;
}

function renderFixtures(container) {
  const fix = state.tournament.fixtures;
  const isLeague = state.tournament.type === 'league' || state.tournament.type === 'groups';
  const rounds = Array.from(new Set(fix.map(m => m.round))).sort((a,b) => a-b);
  
  if (state.isMobile) {
    if (!rounds.includes(state.activeRound)) state.activeRound = rounds[0] || 1;
    
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between no-print mb-2">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Management</h3>
          <button id="export-fixtures-btn" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Export PDF</button>
        </div>

        <!-- Horizontal Round Tabs -->
        <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth snap-x">
          ${rounds.map(r => `
            <button data-round="${r}" class="flex-shrink-0 snap-start px-6 py-3 rounded-2xl border ${state.activeRound === r ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'} transition-all active:scale-95">
              <span class="text-[10px] font-black uppercase tracking-widest">${isLeague ? 'MW' : 'RD'} ${r}</span>
            </button>
          `).join('')}
        </div>

        <div id="fixtures-content" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${(() => {
             const bw = getBiggestWin();
             return fix.filter(m => m.round === state.activeRound).map(m => renderMatchCard(m, bw && bw.id === m.id)).join('');
           })()}
           ${fix.length === 0 ? '<p class="text-center py-20 text-slate-700 italic">No fixtures generated yet.</p>' : ''}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-round]').forEach(btn => btn.addEventListener('click', () => {
      state.activeRound = parseInt(btn.dataset.round);
      renderFixtures(container);
    }));
  } else {
    container.innerHTML = `
      <div class="flex justify-end mb-8 no-print">
        <button id="export-fixtures-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> Export Fixtures PDF
        </button>
      </div>
      <div id="fixtures-content" class="space-y-16">
        ${(() => {
          const bw = getBiggestWin();
          return rounds.map(r => `
            <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="flex items-center gap-4">
                 <div class="h-8 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                 <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">${(state.tournament.type === 'league' || (state.tournament.type === 'groups' && state.tournament.currentStage === 'groups')) ? 'Matchweek' : 'Round'} ${r}</h5>
                 <div class="flex-1 h-px bg-slate-800/50"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${fix.filter(m => m.round === r).map(m => renderMatchCard(m, bw && bw.id === m.id)).join('')}
              </div>
            </div>
          `).join('');
        })()}
      </div>
    `;
  }

  const exportBtn = container.querySelector('#export-fixtures-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportFixturesAsPDF);

  container.querySelectorAll('.score-input').forEach(i => i.addEventListener('change', e => { 
    updateScore(e.target.closest('[data-match-id]').dataset.matchId, e.target.dataset.type, e.target.value); 
  }));
  container.querySelectorAll('.status-toggle').forEach(b => b.addEventListener('click', e => toggleMatchStatus(e.currentTarget.closest('[data-match-id]').dataset.matchId)));
}

function renderMatchCard(m, isBiggestWin = false) {
  const h = state.tournament.teams.find(t => t.id === m.homeId) || { name: 'TBD' }, a = state.tournament.teams.find(t => t.id === m.awayId) || { name: 'TBD' };
  const done = m.status === 'completed';
  const archived = state.tournament.archived;
  const isMobile = state.isMobile;
  
  const borderClass = isBiggestWin ? 'border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50' : 'border-slate-800 shadow-xl';

  return `
    <div data-match-id="${m.id}" class="${isMobile ? 'bg-slate-900 rounded-[2.5rem] p-8' : 'bg-slate-900 rounded-[2rem] p-6'} border ${borderClass} transition-all flex flex-col justify-between h-full group ${archived ? 'grayscale-[0.5] opacity-90' : ''}">
       <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}"></span>
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${m.status}</span>
            ${isBiggestWin ? `<span class="text-[8px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 ml-2">Record Win</span>` : ''}
          </div>
          ${archived ? '' : `
            <button class="status-toggle p-3 md:p-2 bg-slate-950 md:bg-transparent border border-slate-800 md:border-none rounded-xl text-slate-700 hover:text-indigo-400 transition-all active:scale-90">
              ${ICONS.fixtures}
            </button>
          `}
       </div>
       <div class="${isMobile ? 'space-y-6' : 'space-y-4'}">
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${isMobile ? 'text-base' : 'text-sm'} truncate uppercase tracking-tighter">${h.name}</span>
            <input type="number" data-type="home" value="${m.homeScore ?? ''}" placeholder="-" ${archived ? 'disabled' : ''} class="score-input ${isMobile ? 'w-14 h-12 text-lg' : 'w-12 h-10 text-sm'} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${isMobile ? 'text-base' : 'text-sm'} truncate uppercase tracking-tighter">${a.name}</span>
            <input type="number" data-type="away" value="${m.awayScore ?? ''}" placeholder="-" ${archived ? 'disabled' : ''} class="score-input ${isMobile ? 'w-14 h-12 text-lg' : 'w-12 h-10 text-sm'} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
       </div>
       
       <div class="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <input type="date" value="${m.date || ''}" class="match-date-input bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none hover:text-indigo-400 transition-colors" ${archived ? 'disabled' : ''}>
       </div>
    </div>
  `;
}



function updateScore(mId, type, val, tournamentName = null) {
  let tournament = state.tournament;
  if (tournamentName) {
    tournament = state.tournaments.find(t => t.name === tournamentName) || state.tournament;
  }
  
  const m = tournament.fixtures.find(fx => fx.id === mId);
  if (m) { 
    m[`${type}Score`] = val === '' ? null : parseInt(val); 
    saveState(true); 
  }
}

function toggleMatchStatus(mId, tournamentName = null) {
  let tournament = state.tournament;
  if (tournamentName) {
    tournament = state.tournaments.find(t => t.name === tournamentName) || state.tournament;
  }

  const m = tournament.fixtures.find(fx => fx.id === mId);
  if (!m || m.homeScore === null || m.awayScore === null) {
      alert("Results must be entered before marking as complete.");
      return;
  }
  m.status = m.status === 'completed' ? 'upcoming' : 'completed';
  
  if (m.stage === 'knockout' && m.status === 'completed') {
    // Note: advanceWinner needs to be updated too if we want to support global knockout updates
    advanceWinner(m);
  }
  
  // Dashboard Integration: Report Match
  if (m.status === 'completed' && window.parent !== window) {
    const tHome = tournament.teams.find(t => t.id === m.homeId);
    const tAway = tournament.teams.find(t => t.id === m.awayId);
    window.parent.postMessage({
      type: 'MATCH_COMPLETED',
      match: {
        p1Id: tHome?.playerId || null,
        p1Score: m.homeScore,
        p2Id: tAway?.playerId || null,
        p2Score: m.awayScore,
        tournament: tournament.name
      }
    }, '*');
  }

  saveState(true);
  if (m.status === 'completed') checkTournamentCompletion();
  render();
}

function advanceWinner(match) {
  const winnerId = (match.homeScore > match.awayScore) ? match.homeId : match.awayId;
  const nr = match.round + (state.tournament.legs || 1), mi = Math.floor(match.matchIndex / 2), pos = (match.matchIndex % 2 === 0) ? 'homeId' : 'awayId';
  const next = state.tournament.fixtures.find(m => m.round === nr && m.matchIndex === mi && m.stage === 'knockout');
  if (next) { next[pos] = winnerId; saveState(); }
}

function advanceGroupToKnockout() {
  const qualifiers = [];
  state.tournament.groups.forEach((g, idx) => { 
    const s = calculateStandings(g.id); 
    qualifiers.push({ 
      groupId: idx, 
      rank: 1, 
      team: state.tournament.teams.find(t => t.id === s[0].id) 
    });
    qualifiers.push({ 
      groupId: idx, 
      rank: 2, 
      team: state.tournament.teams.find(t => t.id === s[1].id) 
    });
  });

  // Correct Pairing: G1_1 vs G2_2, G2_1 vs G1_2, etc.
  const pairedQualifiers = [];
  for (let i = 0; i < qualifiers.length; i += 4) {
    if (qualifiers[i] && qualifiers[i+3]) {
      pairedQualifiers.push(qualifiers[i].team, qualifiers[i+3].team);
    }
    if (qualifiers[i+1] && qualifiers[i+2]) {
      pairedQualifiers.push(qualifiers[i+2].team, qualifiers[i+1].team);
    }
  }

  const kofix = generateKnockoutFixtures(pairedQualifiers, Math.max(...state.tournament.fixtures.map(f => f.round)) + 1, state.tournament.legs || 1);
  state.tournament.fixtures.push(...kofix);
  state.tournament.currentStage = 'knockout';
  state.view = 'bracket'; saveState(); render();
}

function calculateTeamForm(teamId) {
  const matches = state.tournament.fixtures.filter(m => 
    m.status === 'completed' && (m.homeId === teamId || m.awayId === teamId)
  ).sort((a, b) => a.round - b.round);
  
  return matches.slice(-5).map(m => {
    const isHome = m.homeId === teamId;
    const teamScore = isHome ? m.homeScore : m.awayScore;
    const oppScore = isHome ? m.awayScore : m.homeScore;
    if (teamScore > oppScore) return 'W';
    if (teamScore < oppScore) return 'L';
    return 'D';
  });
}

function calculateTopScorers() {
  const teamsMap = {};
  const standings = calculateStandings();
  
  // Initialize map with all teams
  state.tournament.teams.forEach(t => {
    const s = standings.find(stand => stand.id === t.id) || { w: 0, d: 0, cs: 0 };
    teamsMap[t.id] = {
      name: t.name,
      teamId: t.id,
      teamName: t.name,
      image: t.image || null,
      goals: 0,
      assists: 0,
      matchesPlayed: new Set(),
      fantasyPoints: (s.w * 5) + (s.d * 2) + (s.cs * 6)
    };
  });

  // Aggregate goals from match scores
  state.tournament.fixtures.forEach(m => {
    if (m.status === 'completed') {
      if (teamsMap[m.homeId]) {
        teamsMap[m.homeId].goals += (m.homeScore || 0);
        teamsMap[m.homeId].matchesPlayed.add(m.id);
        teamsMap[m.homeId].fantasyPoints += (m.homeScore || 0) * 4;
      }
      if (teamsMap[m.awayId]) {
        teamsMap[m.awayId].goals += (m.awayScore || 0);
        teamsMap[m.awayId].matchesPlayed.add(m.id);
        teamsMap[m.awayId].fantasyPoints += (m.awayScore || 0) * 4;
      }
    }
  });

  return Object.values(teamsMap)
    .map(t => {
      const matchesCount = t.matchesPlayed.size;
      return { ...t, matchesCount };
    })
    .sort((a, b) => b.fantasyPoints - a.fantasyPoints || b.goals - a.goals);
}

function renderStandingsTable(isSnapshot, groupId = null, upToRound = 999) {
  let data = calculateStandings(groupId, upToRound);
  const filter = state.standingsFilter || 'overall';

  if (filter === 'home') {
    data.sort((a, b) => b.home.pts - a.home.pts || (b.home.gf - b.home.ga) - (a.home.gf - a.home.ga) || b.home.gf - a.home.gf);
  } else if (filter === 'away') {
    data.sort((a, b) => b.away.pts - a.away.pts || (b.away.gf - b.away.ga) - (a.away.gf - a.away.ga) || b.away.gf - a.away.gf);
  } else if (filter === 'cleansheets') {
    data.sort((a, b) => b.cs - a.cs || a.ga - b.ga || b.pts - a.pts);
  }

  const isL = (state.tournament.type === 'league' || state.tournament.type === 'round_robin') && groupId === null;
  const pc = state.tournament.promoSpots || 0;
  const rc = state.tournament.relegationSpots || 0;
  const cc = state.tournament.continentalSpots || 0;

  if (state.isMobile) {
    if (state.mobileStandingsMode === 'compact') {
      let mobileHeaders = `
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Pos</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Team</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">P</th>
      `;
      if (filter === 'cleansheets') {
        mobileHeaders += `<th class="p-4 font-black text-emerald-400 uppercase tracking-widest text-center">CS</th>`;
      } else {
        mobileHeaders += `
          <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
          <th class="p-4 font-black text-indigo-400 uppercase tracking-widest text-center">Pts</th>
        `;
      }

      return `
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left font-mono text-[11px] border-separate border-spacing-0">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-800">
                  ${mobileHeaders}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${data.map((t, i) => {
                  const isEurope = isL && i < cc;
                  const rel = isL && i >= (data.length - rc);
                  const prom = isL && i >= cc && i < (cc + pc);
                  let rankClass = 'text-slate-600';
                  if (isEurope) rankClass = 'text-emerald-400';
                  else if (prom) rankClass = 'text-indigo-400';
                  else if (rel) rankClass = 'text-red-500/60';

                  const stats = filter === 'home' ? t.home : (filter === 'away' ? t.away : t);
                  const gd = stats.gf - stats.ga;

                  return `
                    <tr class="active:bg-slate-800 transition-all team-detail-btn cursor-pointer" data-team-id="${t.id}">
                      <td class="p-4"><span class="font-black ${rankClass}">${(i + 1).toString().padStart(2, '0')}</span></td>
                      <td class="p-4 font-black text-slate-200 uppercase truncate max-w-[120px]">${t.name}</td>
                      <td class="p-4 text-center font-bold text-slate-400">${stats.p}</td>
                      ${filter === 'cleansheets' ? `
                        <td class="p-4 text-center font-black text-emerald-400 italic">${stats.cs}</td>
                      ` : `
                        <td class="p-4 text-center font-bold ${gd >= 0 ? 'text-emerald-500/70' : 'text-red-500/70'}">${gd > 0 ? '+' : ''}${gd}</td>
                        <td class="p-4 text-center font-black text-indigo-400 text-sm italic">${stats.pts}</td>
                      `}
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="space-y-4">
          ${data.map((t, idx) => {
            const form = calculateTeamForm(t.id);
            const isEurope = isL && idx < cc;
            const rel = isL && idx >= (data.length - rc);
            const prom = isL && idx >= cc && idx < (cc + pc);
            let borderClass = 'border-slate-800';
            if (isEurope) borderClass = 'border-emerald-500/30 bg-emerald-500/5';
            else if (prom) borderClass = 'border-indigo-500/30 bg-indigo-500/5';
            else if (rel) borderClass = 'border-red-500/30 bg-red-500/5';

            const stats = filter === 'home' ? t.home : (filter === 'away' ? t.away : t);

            return `
              <div class="team-detail-btn bg-slate-900 border ${borderClass} rounded-[2rem] p-6 flex items-center justify-between shadow-xl active:scale-95 transition-all" data-team-id="${t.id}">
                <div class="flex items-center gap-5">
                  <span class="text-3xl font-black text-slate-800 italic leading-none">${idx + 1}</span>
                  <div>
                    <h4 class="font-black text-slate-100 uppercase tracking-tight text-lg">${t.name}</h4>
                    <div class="flex gap-1.5 mt-2">
                      ${form.map(res => {
                        const color = res === 'W' ? 'bg-emerald-500' : (res === 'D' ? 'bg-slate-600' : 'bg-red-500');
                        return `<span class="w-1.5 h-1.5 rounded-full ${color}"></span>`;
                      }).join('')}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-black ${filter === 'cleansheets' ? 'text-emerald-400' : 'text-indigo-400'} leading-none italic tracking-tighter">${filter === 'cleansheets' ? stats.cs : stats.pts}</div>
                  <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">${filter === 'cleansheets' ? 'Clean Sheets' : 'Classification Pts'}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  let headers = '';
  if (filter === 'cleansheets') {
    headers = `
      <th class="pb-2 pl-4">Pos</th>
      <th class="pb-2">Squad Operative</th>
      <th class="pb-2 text-center">Played</th>
      <th class="pb-2 text-center">GA</th>
      <th class="pb-2 text-center text-emerald-400">Clean Sheets</th>
      <th class="pb-2 text-center">Ratio</th>
    `;
  } else {
    headers = `
      <th class="pb-2 pl-4">Pos</th>
      <th class="pb-2">Squad Operative</th>
      <th class="pb-2 text-center">P</th>
      <th class="pb-2 text-center">W</th>
      <th class="pb-2 text-center">D</th>
      <th class="pb-2 text-center">L</th>
      <th class="pb-2 text-center">GF</th>
      <th class="pb-2 text-center">GA</th>
      <th class="pb-2 text-center">GD</th>
      <th class="pb-2 text-center font-black text-indigo-400">Pts</th>
      <th class="pb-2 text-center">Form</th>
    `;
  }

  return `
    <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 ${isSnapshot ? 'overflow-visible' : 'overflow-x-auto'} shadow-2xl relative">
      <table class="w-full text-left text-xs border-separate border-spacing-y-3 min-w-[800px] lg:min-w-0">
        <thead>
          <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
            ${headers}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/20">
          ${data.map((t, i) => {
            const isEurope = isL && i < cc;
            const prom = isL && i >= cc && i < (cc + pc);
            const rel = isL && i >= (data.length - rc);
            
            let statusColor = '';
            if (isEurope) statusColor = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
            else if (prom) statusColor = 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]';
            else if (rel) statusColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]';

            const stats = filter === 'home' ? t.home : (filter === 'away' ? t.away : t);
            const gd = stats.gf - stats.ga;
            const gdPrefix = gd > 0 ? '+' : '';
            const gdColor = gd > 0 ? 'text-emerald-400' : (gd < 0 ? 'text-red-400' : 'text-slate-600');
            const form = calculateTeamForm(t.id);

            let rowHtml = '';
            if (filter === 'cleansheets') {
              const ratio = stats.p > 0 ? (stats.cs / stats.p).toFixed(2) : '0.00';
              rowHtml = `
                <td class="py-4 text-center font-mono text-slate-500">${stats.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.ga}</td>
                <td class="py-4 text-center"><span class="font-black font-mono text-emerald-400 italic text-sm">${stats.cs}</span></td>
                <td class="py-4 text-center text-slate-500 font-mono">${ratio}</td>
              `;
            } else {
              rowHtml = `
                <td class="py-4 text-center font-mono text-slate-500 font-bold">${stats.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.w}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.d}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.l}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.gf}</td>
                <td class="py-4 text-center font-mono text-slate-500">${stats.ga}</td>
                <td class="py-4 text-center font-mono font-black ${gdColor}">${gdPrefix}${gd}</td>
                <td class="py-4 text-center font-black text-slate-100 text-base tracking-tighter shadow-indigo-500/10">${stats.pts}</td>
              `;
            }

            return `<tr class="bg-slate-950/40 group relative transition-all cursor-default scale-100 hover:scale-[1.01]">
              <td class="py-4 pl-4 rounded-l-3xl relative overflow-hidden">
                ${statusColor ? `<div class="absolute inset-y-2 left-0 w-1.5 ${statusColor} rounded-r-full"></div>` : ''}
                <span class="font-mono font-black ${isEurope ? 'text-emerald-400' : (prom ? 'text-indigo-400' : (rel ? 'text-red-500/60' : 'text-slate-600'))}">
                    ${(i+1).toString().padStart(2,'0')}
                </span>
              </td>
              <td class="py-4 font-black text-slate-200 truncate max-w-[150px] transition-colors group-hover:text-white cursor-pointer hover:underline team-detail-btn" data-team-id="${t.id}">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600 group-hover:border-indigo-500/30">
                    ${t.name.substring(0,2).toUpperCase()}
                  </div>
                  ${t.name}
                </div>
              </td>
              ${rowHtml}
              <td class="py-4 pr-6 rounded-r-3xl">
                ${filter === 'overall' ? `
                <div class="flex items-center justify-center gap-1">
                  ${form.map(res => {
                    const color = res === 'W' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : (res === 'L' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30');
                    return `<span data-result="${res}" class="w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-black ${color} form-badge-print"><span class="form-badge-bg">${res}</span></span>`;
                  }).join('')}
                  ${form.length === 0 ? '<span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">-</span>' : ''}
                </div>
                ` : ''}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showEditModal(title, defaultValue, onSave) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200';
  modal.innerHTML = `
    <div class="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-2xl p-6 relative">
      <h3 class="text-lg font-black text-slate-100 uppercase tracking-tighter mb-4">${title}</h3>
      <input type="text" id="edit-modal-input" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6" value="${defaultValue || ''}" autocomplete="off">
      <div class="flex gap-3">
        <button id="edit-modal-cancel" class="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
        <button id="edit-modal-save" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30">Save Data</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const input = modal.querySelector('#edit-modal-input');
  input.focus();
  input.setSelectionRange(0, input.value.length);

  const close = () => modal.remove();

  modal.querySelector('#edit-modal-cancel').addEventListener('click', close);
  modal.querySelector('#edit-modal-save').addEventListener('click', () => {
    onSave(input.value);
    close();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onSave(input.value);
      close();
    }
    if (e.key === 'Escape') close();
  });
}

function renderTeamDetail(teamId) {

    const setupGlobalMatchListeners = (parent) => {
      parent.querySelectorAll('.global-score-input').forEach(i => i.addEventListener('change', e => {
        const row = e.target.closest('[data-match-id]');
        updateScore(row.dataset.matchId, e.target.dataset.type, e.target.value, row.dataset.tournament);
      }));
      parent.querySelectorAll('.global-status-toggle').forEach(b => b.addEventListener('click', e => {
        const row = e.target.closest('[data-match-id]');
        toggleMatchStatus(row.dataset.matchId, row.dataset.tournament);
        renderTeamDetail(teamId); // Refresh modal
      }));
    };

  const t = state.tournament.teams.find(tm => tm.id === parseInt(teamId));
  if (!t) return;
  const standings = calculateStandings().find(s => s.id === t.id) || { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, home: {}, away: {}, cs: 0 };
  const form = calculateTeamForm(t.id);
  
  // Global Match History (Across all tournaments)
  const allMatches = [];
  state.tournaments.forEach(tourney => {
    // Find this team in the other tournament (by name or playerId)
    const otherTeam = tourney.teams.find(tm => tm.name === t.name || (t.playerId && tm.playerId === t.playerId));
    if (otherTeam) {
      tourney.fixtures.filter(m => m.status === 'completed' && (m.homeId === otherTeam.id || m.awayId === otherTeam.id)).forEach(m => {
        allMatches.push({ ...m, tournamentName: tourney.name, teamInMatch: otherTeam });
      });
    }
  });
  
  const matches = allMatches.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (state.isMobile) {
    const content = `
      <div class="p-6 space-y-10 selection:bg-indigo-500/30">
        <header class="flex items-center gap-4">
           <button id="mobile-team-back-btn" class="md:hidden text-slate-600 hover:text-indigo-400 transition-all text-2xl font-black shrink-0">&larr;</button>
           <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-400">
             ${t.name.substring(0,2).toUpperCase()}
           </div>
           <div>
             <div class="flex items-center gap-2">
               <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${t.name}</h3>
               <button class="edit-team-name-btn text-slate-500 hover:text-indigo-400 p-1 active:scale-95 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-1.5 mt-1">
               ${form.map(res => {
                  const color = res === 'W' ? 'bg-emerald-500' : (res === 'L' ? 'bg-red-500' : 'bg-slate-700');
                  return `<span class="w-2 h-2 rounded-full ${color}"></span>`;
               }).join('')}
               <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Recent Form</span>
             </div>
           </div>
        </header>

        <div class="grid grid-cols-5 gap-2">
           ${renderMobileStatBox('P', standings.p)}
           ${renderMobileStatBox('W', standings.w)}
           ${renderMobileStatBox('D', standings.d)}
           ${renderMobileStatBox('L', standings.l)}
           ${renderMobileStatBox('FP', calculateTopScorers().find(s => s.teamId === t.id)?.fantasyPoints || 0)}
           ${renderMobileStatBox('GD', standings.gd)}
        </div>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Home vs Away</h4>
           <div class="grid grid-cols-2 gap-4">
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Home</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${standings.home.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${standings.home.gf} GF</span>
               </div>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">Away</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${standings.away.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${standings.away.gf} GF</span>
               </div>
             </div>
           </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Form Evolution</h4>
           <div class="h-40 w-full mb-8"><canvas id="formChartMobile"></canvas></div>
        </section>

        <section class="space-y-6">
           <div class="flex items-center justify-between">
             <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Squad Roster</h4>
             ${state.isAdmin ? `<button id="link-player-btn-mobile" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">Link Club Player</button>` : ''}
           </div>
           <div id="roster-container-mobile" class="space-y-3">
             ${t.playerId ? (() => {
               const lp = state.dashboardPlayers.find(p => p.id === t.playerId);
               return lp ? `
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src="${lp.image}" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="text-xs font-black text-slate-200 uppercase">${lp.name}</p>
                        <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest">#${lp.number} • ${lp.device}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-black text-indigo-400 font-mono">${lp.ovr}</p>
                      <p class="text-[7px] font-black text-slate-600 uppercase tracking-tighter">Rating</p>
                    </div>
                 </div>
               ` : '<p class="text-slate-700 italic text-center py-6 text-xs">Linked player not found in sync</p>';
             })() : '<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No club player linked</p>'}
           </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Match History</h4>
           <div class="space-y-3">
               ${matches.map(m => {
                 const isHome = m.homeId === m.teamInMatch.id;
                 const oppId = isHome ? m.awayId : m.homeId; 
                 const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                 const opp = tourney.teams.find(tm => tm.id === oppId) || { name: 'Unknown' };
                 const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                 const drew = m.homeScore === m.awayScore;
                 const done = m.status === 'completed';

                 return `
                   <div data-match-id="${m.id}" data-tournament="${m.tournamentName}" class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="flex flex-col items-center gap-1">
                           <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] ${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                             ${won ? 'W' : (drew ? 'D' : 'L')}
                           </div>
                           ${state.isAdmin ? `<button class="global-status-toggle p-1 text-slate-600 hover:text-indigo-400 transition-colors text-xs">${done ? '✅' : '⏳'}</button>` : ''}
                        </div>
                        <div>
                          <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">${opp.name}</div>
                          <div class="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${m.tournamentName}</div>
                        </div>
                      </div>
                      <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                        ${state.isAdmin ? `
                          <input type="number" data-type="${isHome ? 'home' : 'away'}" value="${isHome ? (m.homeScore ?? '') : (m.awayScore ?? '')}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-indigo-400 outline-none">
                          <span class="text-slate-700">-</span>
                          <input type="number" data-type="${isHome ? 'away' : 'home'}" value="${isHome ? (m.awayScore ?? '') : (m.homeScore ?? '')}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500 outline-none">
                        ` : `
                          <span>${m.homeScore}</span>
                          <span class="text-slate-700">-</span>
                          <span>${m.awayScore}</span>
                        `}
                      </div>
                   </div>
                 `;
               }).join('')}
             ${matches.length === 0 ? '<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No data recorded</p>' : ''}
           </div>
        </section>
      </div>
    `;
    toggleBottomSheet(content, true);
    setTimeout(() => initTeamFormChart(t.id, 'formChartMobile'), 100);
    setupGlobalMatchListeners(document.getElementById('bottom-sheet-container'));
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'team-detail-modal';
  modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300';
  modal.innerHTML = `
    <div class="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-slate-800 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-10 duration-500">
      <header class="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div class="flex items-center gap-8">
           <div class="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-indigo-400">
             ${t.name.substring(0,2).toUpperCase()}
           </div>
           <div class="space-y-2">
             <div class="flex items-center gap-3">
               <h3 class="text-4xl font-black text-slate-100 tracking-tighter">${t.name}</h3>
               <button class="edit-team-name-btn bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-xl transition-colors active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-4">
               <div class="flex gap-1">
                 ${form.map(res => {
                    const color = res === 'W' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : (res === 'L' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30');
                    return `<span class="w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-black ${color}">${res}</span>`;
                 }).join('')}
               </div>
               <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Recent Performance</span>
             </div>
           </div>
        </div>
        <button id="close-modal" class="p-4 bg-slate-950 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all">${ICONS.reset}</button>
      </header>
      
      <div class="flex-1 overflow-auto p-10 space-y-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
           ${renderStatBox('Played', standings.p)}
           ${renderStatBox('Wins', standings.w)}
           ${renderStatBox('Draws', standings.d)}
           ${renderStatBox('Losses', standings.l)}
           ${renderStatBox('Fantasy Pts', calculateTopScorers().find(s => s.teamId === t.id)?.fantasyPoints || 0)}
           ${renderStatBox('GD', (standings.gd > 0 ? '+' : '') + standings.gd)}
        </div>

        <section class="space-y-8">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Performance: Home vs Away</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Home Base</span>
                <span class="text-xs font-black text-slate-600">${standings.home.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${standings.home.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${standings.home.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${standings.home.cs}</p></div>
              </div>
            </div>
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Away Frontier</span>
                <span class="text-xs font-black text-slate-600">${standings.away.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${standings.away.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${standings.away.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${standings.away.cs}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Form Evolution</h4>
           <div class="h-64 w-full mb-10"><canvas id="formChartDesktop"></canvas></div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Historical Archive</h4>
           <div class="space-y-3">
               ${matches.map(m => {
                 const isHome = m.homeId === m.teamInMatch.id;
                 const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                 const opp = tourney.teams.find(tm => tm.id === (isHome ? m.awayId : m.homeId)) || { name: 'Unknown' };
                 const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                 const drew = m.homeScore === m.awayScore;
                 const status = won ? 'W' : (drew ? 'D' : 'L');
                 const done = m.status === 'completed';

                 return `
                   <div data-match-id="${m.id}" data-tournament="${m.tournamentName}" class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                      <div class="flex items-center gap-6">
                        <div class="text-[10px] font-mono text-slate-700">${m.date || 'TBD'}</div>
                        <div>
                          <div class="font-black text-slate-200">${opp.name}</div>
                          <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">${m.tournamentName}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-8">
                         <div class="font-black font-mono text-xl text-slate-100 flex items-center gap-3">
                           ${state.isAdmin ? `
                             <input type="number" data-type="${isHome ? 'home' : 'away'}" value="${isHome ? (m.homeScore ?? '') : (m.awayScore ?? '')}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none">
                             <span class="text-slate-700">-</span>
                             <input type="number" data-type="${isHome ? 'away' : 'home'}" value="${isHome ? (m.awayScore ?? '') : (m.homeScore ?? '')}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-slate-500 outline-none">
                           ` : `
                             <span>${m.homeScore}</span>
                             <span class="text-slate-700">-</span>
                             <span>${m.awayScore}</span>
                           `}
                         </div>
                         <div class="flex flex-col items-center gap-1">
                            <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm ${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                              ${status}
                            </div>
                            ${state.isAdmin ? `<button class="global-status-toggle text-[10px] hover:text-indigo-400 transition-colors uppercase font-black tracking-widest mt-1">${done ? 'Undo' : 'Complete'}</button>` : ''}
                         </div>
                      </div>
                   </div>
                 `;
               }).join('')}
             ${matches.length === 0 ? '<p class="text-slate-600 italic text-center py-10">No matches recorded for this deployment.</p>' : ''}
           </div>
        </section>
      </div>
    </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
  document.getElementById('close-modal').addEventListener('click', () => modal.remove());
  setTimeout(() => initTeamFormChart(t.id, state.isMobile ? 'formChartMobile' : 'formChartDesktop'), 100);
  setupGlobalMatchListeners(document.getElementById('team-detail-modal'));


  // Roster binding (Mobile + Desktop)
  const rosterContainer = state.isMobile ? document.getElementById('bottom-sheet') : modal;
  if (!t.players) t.players = [];

  const attachRosterListeners = (root) => {
    root.querySelector('.edit-team-name-btn')?.addEventListener('click', () => {
      const newName = prompt("Enter new squad name:", t.name);
      if (newName && newName.trim()) {
        t.name = newName.trim();
        saveState();
        render(); // Update main UI behind modal
        if (!state.isMobile) modal.remove();
        renderTeamDetail(teamId);
      }
    });

    root.querySelector('.add-player-btn')?.remove(); // Remove legacy player add btn

    root.querySelector('#link-player-btn')?.addEventListener('click', () => {
      showPlayerSelectionModal((pId) => {
        t.playerId = pId;
        saveState();
        if (!state.isMobile) modal.remove();
        renderTeamDetail(teamId);
      });
    });

    root.querySelector('#link-player-btn-mobile')?.addEventListener('click', () => {
      showPlayerSelectionModal((pId) => {
        t.playerId = pId;
        saveState();
        renderTeamDetail(teamId);
      });
    });

    const mobileTeamBackBtn = root.querySelector('#mobile-team-back-btn');
    if (mobileTeamBackBtn) {
      mobileTeamBackBtn.addEventListener('click', () => {
        state.view = 'standings';
        render();
      });
    }

    root.querySelectorAll('.edit-player-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        showEditModal("Edit player name:", t.players[idx], (newName) => {
          if (newName && newName.trim()) {
            t.players[idx] = newName.trim();
            saveState();
            if(!state.isMobile && modal) modal.remove();
            renderTeamDetail(teamId);
          }
        });
      });
    });

    root.querySelectorAll('.del-player-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Remove this player?")) {
          const idx = parseInt(btn.dataset.idx);
          t.players.splice(idx, 1);
          saveState();
          if(!state.isMobile) modal.remove();
          renderTeamDetail(teamId);
        }
      });
    });
  };

  if (!state.isMobile) attachRosterListeners(modal);
  else setTimeout(() => attachRosterListeners(rosterContainer), 50); // wait for bottom sheet
}

function renderStatBox(label, val) {
  return `<div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1"><p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${label}</p><p class="text-2xl font-black text-slate-100 font-mono">${val}</p></div>`;
}

function renderMobileStatBox(label, val) {
  return `<div class="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-center space-y-0.5"><p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">${label}</p><p class="text-sm font-black text-slate-100 font-mono leading-none">${val}</p></div>`;
}

function getTournamentStandings(t) {
  const s = t.teams.map(tm => ({ id: tm.id, name: tm.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
  t.fixtures.filter(m => m.status === 'completed' && (m.stage === 'groups' || m.stage === 'league' || m.stage === 'round_robin' || !m.stage)).forEach(m => {
    const h = s.find(tm => tm.id === m.homeId), a = s.find(tm => tm.id === m.awayId);
    if(h && a) { 
      h.p++; a.p++; h.gf += m.homeScore; h.ga += m.awayScore; a.gf += m.awayScore; a.ga += m.homeScore; 
      if(m.homeScore > m.awayScore) { h.w++; h.pts+=3; a.l++; } 
      else if(m.homeScore < m.awayScore) { a.w++; a.pts+=3; h.l++; } 
      else { h.d++; a.d++; h.pts++; a.pts++; } 
    }
  });
  s.forEach(tm => tm.gd = tm.gf - tm.ga);
  return s.sort((a,b) => b.pts - a.pts || b.gd - a.gd);
}

function calculateStandings(groupId = null, upToRound = 999) {
  let scope = state.tournament.teams;
  if (groupId !== null) {
    const group = state.tournament.groups.find(g => g.id === groupId) || state.tournament.groups[groupId];
    if (group && group.teamIds) {
      scope = state.tournament.teams.filter(t => group.teamIds.includes(t.id));
    }
  }
  const s = scope.map(t => ({ 
    id: t.id, name: t.name, 
    p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    home: { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, cs: 0 },
    away: { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, cs: 0 },
    cs: 0 
  }));
  const fixtures = state.tournament.fixtures;

  fixtures.filter(m => m.status === 'completed' && m.round <= upToRound && (groupId === null || m.groupId === groupId) && (m.stage === 'groups' || m.stage === 'league' || m.stage === 'round_robin' || !m.stage)).forEach(m => {
    const h = s.find(tm => tm.id === m.homeId), a = s.find(tm => tm.id === m.awayId);
    if(h && a) { 
      h.p++; a.p++; h.gf += m.homeScore; h.ga += m.awayScore; a.gf += m.awayScore; a.ga += m.homeScore; 
      
      h.home.p++; h.home.gf += m.homeScore; h.home.ga += m.awayScore;
      a.away.p++; a.away.gf += m.awayScore; a.away.ga += m.homeScore;

      if (m.awayScore === 0) { h.cs++; h.home.cs++; }
      if (m.homeScore === 0) { a.cs++; a.away.cs++; }

      if(m.homeScore > m.awayScore) { 
        h.w++; h.pts+=3; a.l++; 
        h.home.w++; h.home.pts+=3; a.away.l++;
      } 
      else if(m.homeScore < m.awayScore) { 
        a.w++; a.pts+=3; h.l++; 
        a.away.w++; a.away.pts+=3; h.home.l++;
      } 
      else { 
        h.d++; a.d++; h.pts++; a.pts++; 
        h.home.d++; h.home.pts++; a.away.d++; a.away.pts++;
      } 
    }
  });
  s.forEach(tm => tm.gd = tm.gf - tm.ga);
  
  return s.sort((a,b) => {
    // 1. Points
    if (b.pts !== a.pts) return b.pts - a.pts;
    // 2. GD
    if (b.gd !== a.gd) return b.gd - a.gd;
    // 3. GS
    if (b.gf !== a.gf) return b.gf - a.gf;
    // 4. Head-to-Head (Simple 2-team implementation)
    const h2h = fixtures.filter(m => m.status === 'completed' && ((m.homeId === a.id && m.awayId === b.id) || (m.homeId === b.id && m.awayId === a.id)));
    if (h2h.length > 0) {
       let aH2HPts = 0, bH2HPts = 0;
       h2h.forEach(m => {
         if (m.homeId === a.id) {
           if (m.homeScore > m.awayScore) aH2HPts += 3; else if (m.homeScore < m.awayScore) bH2HPts += 3; else { aH2HPts++; bH2HPts++; }
         } else {
           if (m.homeScore > m.awayScore) bH2HPts += 3; else if (m.homeScore < m.awayScore) aH2HPts += 3; else { bH2HPts++; aH2HPts++; }
         }
       });
       if (bH2HPts !== aH2HPts) return bH2HPts - aH2HPts;
    }
    // 5. Alphabetical
    return a.name.localeCompare(b.name);
  });
}

function calculateWinningStreak(teamId) {
  const form = calculateTeamForm(teamId);
  let streak = 0;
  for (let i = form.length - 1; i >= 0; i--) {
    if (form[i] === 'W') streak++;
    else break;
  }
  return streak;
}

function getTournamentAwards() {
  const standings = calculateStandings();
  if (standings.length === 0) return { bestAttack: null, bestDefence: null, biggestWin: null };
  const bestAttack = [...standings].sort((a,b) => b.gf - a.gf || a.p - b.p)[0];
  const bestDefence = [...standings].sort((a,b) => a.ga - b.ga || a.p - b.p)[0];
  const biggestWin = getBiggestWin();
  return { bestAttack, bestDefence, biggestWin };
}

function getBiggestWin() {
  const completed = state.tournament.fixtures.filter(f => f.status === 'completed');
  if (completed.length === 0) return null;
  return [...completed].sort((a, b) => {
    const diffA = Math.abs(a.homeScore - a.awayScore);
    const diffB = Math.abs(b.homeScore - b.awayScore);
    if (diffB !== diffA) return diffB - diffA;
    return (b.homeScore + b.awayScore) - (a.homeScore + a.awayScore);
  })[0];
}

function calculateH2H(idA, idB) {
  const pairs = state.tournament.fixtures.filter(m => 
    m.status === 'completed' && 
    ((m.homeId === idA && m.awayId === idB) || (m.homeId === idB && m.awayId === idA))
  ).sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));

  let aWins = 0, bWins = 0, draws = 0, aGoals = 0, bGoals = 0;
  const history = pairs.map(m => {
    const isAHome = m.homeId === idA;
    const aS = isAHome ? m.homeScore : m.awayScore;
    const bS = isAHome ? m.awayScore : m.homeScore;
    aGoals += aS; bGoals += bS;
    let result = 'D';
    if (aS > bS) { aWins++; result = 'W'; }
    else if (bS > aS) { bWins++; result = 'L'; }
    else draws++;
    return { ...m, aScore: aS, bScore: bS, result };
  });

  return { aWins, bWins, draws, aGoals, bGoals, history };
}

function renderHeadToHeadView(container) {
  const teams = state.tournament.teams;
  let idA = teams[0]?.id, idB = teams[1]?.id;

  const updateUI = () => {
    if (idA === undefined || idB === undefined) return;
    const stats = calculateH2H(idA, idB);
    const teamA = teams.find(t => t.id === idA);
    const teamB = teams.find(t => t.id === idB);

    const h2hContent = document.getElementById('h2h-analysis');
    h2hContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-50"></div>
            <div class="relative z-10 flex items-center justify-between gap-8">
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${teamA.color || '#4f46e5'}">
                  ${teamA.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${teamA.name}</h3>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/40 font-black italic text-xl">VS</div>
              </div>
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${teamB.color || '#10b981'}">
                  ${teamB.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${teamB.name}</h3>
              </div>
            </div>

            <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 border-t border-slate-800/50">
               <div class="space-y-6">
                 <div class="grid grid-cols-3 gap-6">
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-emerald-400 font-mono">${stats.aWins}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Draws</p>
                      <p class="text-3xl font-black text-slate-400 font-mono">${stats.draws}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-indigo-400 font-mono">${stats.bWins}</p>
                    </div>
                 </div>
                 <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 text-center">Conflict Outcome Distribution</p>
                    <div class="h-48 flex justify-center"><canvas id="h2hChart"></canvas></div>
                 </div>
               </div>
               <div class="space-y-6">
                  <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${teamA.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${stats.aGoals}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${teamB.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${stats.bGoals}</p>
                    </div>
                  </div>
                  <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 h-64">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Strategic Momentum Comparison</p>
                    <div class="h-48 w-full"><canvas id="h2hProgressionChart"></canvas></div>
                  </div>
               </div>
            </div>
          </div>

          <div class="space-y-6">
            <h4 class="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">Conflict Logs</h4>
            <div class="space-y-3">
              ${stats.history.map(m => `
                <div class="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-all">
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-500 font-mono">RD ${m.round}</span>
                    <span class="text-sm font-bold text-slate-300">${new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <p class="text-xs font-black text-slate-200">${teamA.name}</p>
                    </div>
                    <div class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-black font-mono text-indigo-400">
                      ${m.aScore} - ${m.bScore}
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-black text-slate-200">${teamB.name}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
              ${stats.history.length === 0 ? '<div class="p-12 text-center text-slate-600 italic">No historical data between these squadrons.</div>' : ''}
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-6">
             <h3 class="text-lg font-black text-slate-100 tracking-tight">Aggregated Logistics</h3>
             <div class="space-y-4">
                <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                   <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Total Combined Goals</p>
                   <p class="text-2xl font-black text-indigo-400 font-mono">${stats.aGoals + stats.bGoals}</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${teamA.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${stats.aGoals}</p>
                  </div>
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${teamB.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${stats.bGoals}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl">
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Primary Squadron</label>
           <select id="team-a-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${teams.map(t => `<option value="${t.id}" ${t.id === idA ? 'selected' : ''}>${t.name}</option>`).join('')}
           </select>
        </div>
        <div class="flex items-center justify-center p-4">
           <span class="text-2xl opacity-20">⚔️</span>
        </div>
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Secondary Squadron</label>
           <select id="team-b-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${teams.map(t => `<option value="${t.id}" ${t.id === idB ? 'selected' : ''}>${t.name}</option>`).join('')}
           </select>
        </div>
      </div>

      <div id="h2h-analysis"></div>
    </div>
  `;

  document.getElementById('team-a-select').addEventListener('change', (e) => { 
    idA = parseInt(e.target.value); 
    updateUI(); 
    setTimeout(() => {
      initH2HChart(calculateH2H(idA, idB));
      initH2HComparisonChart(idA, idB);
    }, 100); 
  });
  document.getElementById('team-b-select').addEventListener('change', (e) => { 
    idB = parseInt(e.target.value); 
    updateUI(); 
    setTimeout(() => {
      initH2HChart(calculateH2H(idA, idB));
      initH2HComparisonChart(idA, idB);
    }, 100); 
  });
  
  updateUI();
  setTimeout(() => {
    initH2HChart(calculateH2H(idA, idB));
    initH2HComparisonChart(idA, idB);
  }, 100);
}

function renderTeamsView(container) {
  if (state.isMobile) {
    container.innerHTML = `
      <div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tight">Factions</h3>
            <p class="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Technical Logs Active</p>
          </div>
          <button id="h2h-view-btn" class="bg-indigo-600 active:scale-95 text-white font-black p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center">
            ⚔️
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          ${state.tournament.teams.map(t => `
            <div class="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col items-center text-center group active:scale-95 transition-all cursor-pointer relative overflow-hidden team-detail-btn" data-team-id="${t.id}">
              <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl mb-4 flex items-center justify-center relative shadow-inner overflow-hidden">
                 <div class="w-full h-full" style="background-color: ${t.color || '#4f46e5'}"></div>
                 <span class="absolute text-lg font-black text-white/20">${t.name.substring(0,2).toUpperCase()}</span>
              </div>
              <h4 class="text-[10px] font-black text-slate-100 uppercase tracking-widest break-all line-clamp-1">${t.name}</h4>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="flex items-center justify-between">
           <div class="space-y-1">
             <h3 class="text-4xl font-black text-slate-100 uppercase tracking-tighter">Faction Registry</h3>
             <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Historical and technical logs for all squads</p>
           </div>
           <button id="h2h-view-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-5 rounded-3xl transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3 group">
             <span class="group-hover:rotate-12 transition-transform">⚔️</span>
             <span class="text-xs uppercase tracking-[0.2em]">Head to Head Analysis</span>
           </button>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          ${state.tournament.teams.map(t => `
            <div class="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden team-detail-btn" data-team-id="${t.id}">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2rem] mb-6 flex items-center justify-center relative shadow-inner overflow-hidden">
                 <div class="w-full h-full" style="background-color: ${t.color || '#4f46e5'}"></div>
                 <span class="absolute text-2xl font-black text-white/20">${t.name.substring(0,2).toUpperCase()}</span>
              </div>
              <h4 class="text-xl font-black text-slate-100 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">${t.name}</h4>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  document.getElementById('h2h-view-btn').addEventListener('click', () => {
    state.view = 'h2h';
    render();
  });

  container.querySelectorAll('.team-detail-btn').forEach(btn => {
     btn.addEventListener('click', () => renderTeamDetail(btn.dataset.teamId));
  });
}

function triggerConfetti(color = '#4f46e5') {
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: [color, '#ffffff', '#fbbf24'] });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: [color, '#ffffff', '#fbbf24'] });
  }, 250);
}

function checkTournamentCompletion() {
  const played = state.tournament.fixtures.filter(m => m.status === 'completed').length;
  const total = state.tournament.fixtures.length;
  if (played === total && total > 0 && state.tournament.status !== 'completed') {
    state.tournament.status = 'completed';
    saveState();
    state.view = 'champion';
    render();
    setTimeout(() => triggerConfetti(state.tournament.teams[0]?.color), 500);
  }
}
function renderBracket(container) {
  const kofix = state.tournament.fixtures.filter(m => m.stage === 'knockout');
  if (!kofix.length) { 
    container.innerHTML = '<div class="h-96 flex flex-col items-center justify-center text-slate-600 italic font-black uppercase tracking-widest gap-4"><span class="text-4xl opacity-20">📂</span>Knockout phase has not started yet.</div>'; 
    return; 
  }
  const rds = Array.from(new Set(kofix.map(m => m.round))).sort((a,b) => a-b);
  
  if (state.isMobile) {
    container.innerHTML = `
      <div class="space-y-8 animate-in fade-in duration-500 pb-20">
        <div class="flex overflow-x-auto gap-3 no-scrollbar px-2 snap-x">
          ${rds.map(r => `
            <button class="round-tab shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all snap-center ${state.activeRound === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}" data-round="${r}">
              Round ${r}
            </button>
          `).join('')}
        </div>

        <div id="bracket-matches" class="space-y-6">
           ${kofix.filter(m => m.round === state.activeRound && (m.leg === 1 || !m.leg)).map(m => renderBracketMatch(m)).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.round-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeRound = parseInt(btn.dataset.round);
        renderBracket(container);
      });
    });
  } else {
    container.innerHTML = `<div class="flex gap-20 overflow-x-auto pb-10 no-scrollbar select-none">${rds.map(r => `<div class="flex flex-col justify-around gap-12 min-w-[280px]">
      <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Round ${r}</h5>
      ${kofix.filter(m => m.round === r && (m.leg === 1 || !m.leg)).map(m => renderBracketMatch(m)).join('')}
    </div>`).join('')}</div>`;
  }
}

function renderBracketMatch(m) {
  const h = state.tournament.teams.find(t => t.id === m.homeId) || { name: '?' }, 
        a = state.tournament.teams.find(t => t.id === m.awayId) || { name: '?' };
  
  if (state.isMobile) {
    return `
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl flex flex-col gap-4 active:scale-[0.98] transition-all">
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${h.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${h.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${m.homeScore ?? '-'}</span>
         </div>
         <div class="h-px bg-slate-800/30"></div>
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${a.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${a.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${m.awayScore ?? '-'}</span>
         </div>
      </div>
    `;
  }

  return `<div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${h.name}</span><span class="font-mono text-xs font-black text-indigo-400">${m.homeScore ?? '-'}</span></div><div class="h-px bg-slate-800/50"></div><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${a.name}</span><span class="font-mono text-xs font-black text-indigo-400">${m.awayScore ?? '-'}</span></div></div>`;
}

// EXPORT FUNCTIONS
async function exportStandingsAsImage() {
  const element = document.getElementById('standings-content');
  if (!element) return;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'bg-slate-950 p-12 text-slate-100 font-sans';
  wrapper.style.width = '1200px';
  wrapper.innerHTML = `
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter">${state.tournament.name}</h1>
      <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">League Standings</p>
    </div>
    ${element.innerHTML}
    <div class="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
      Exported on ${new Date().toLocaleDateString()} • Tournament Management Engine
    </div>
  `;
  document.body.appendChild(wrapper);
  
  try {
    const canvas = await html2canvas(wrapper, {
      backgroundColor: '#020617',
      scale: 2,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    link.download = `${state.tournament.name.replace(/\s+/g, '_')}_Standings.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Snapshot failed:', err);
  } finally {
    document.body.removeChild(wrapper);
  }
}

async function exportStandingsAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tArr = state.tournament.name.replace(/\s+/g, '_');
  
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text(state.tournament.name, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const formatLabel = state.tournament.type.charAt(0).toUpperCase() + state.tournament.type.slice(1);
  doc.text(`${formatLabel} Status Report`, 14, 28);

  const standings = calculateStandings();
  const tableData = standings.map((t, i) => {
    const form = calculateTeamForm(t.id).join(' ');
    const gdPrefix = t.gd > 0 ? '+' : '';
    return [
      i + 1,
      t.name,
      t.p,
      t.w,
      t.d,
      t.l,
      t.gf,
      t.ga,
      `${gdPrefix}${t.gd}`,
      t.pts,
      form
    ];
  });

  doc.autoTable({
    head: [['Pos', 'Team', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form']],
    body: tableData,
    startY: 35,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center' },
      1: { fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' },
      7: { halign: 'center' },
      8: { halign: 'center' },
      9: { halign: 'center', fontStyle: 'bold' },
      10: { halign: 'center' }
    }
  });

  const scorers = calculateTopScorers();
  if (scorers.length > 0) {
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Top Scorer Registry', 14, finalY);
    
    const scorersData = scorers.slice(0, 10).map((s, idx) => [
      idx + 1,
      s.name,
      s.teamName,
      s.matchesCount,
      s.assists,
      s.goals
    ]);

    doc.autoTable({
      head: [['Rank', 'Player', 'Squad', 'MP', 'Assists', 'Goals']],
      body: scorersData,
      startY: finalY + 5,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${new Date().toLocaleString()} • KickOff Tournament Manager`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`${tArr}_Standings.pdf`);
}

async function exportFixturesAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tArr = state.tournament.name.replace(/\s+/g, '_');
  const fix = state.tournament.fixtures;

  // Quantum Vortex Theme Colors
  const bg = [5, 5, 8];
  const cardBg = [15, 15, 26];
  const primary = [59, 130, 246]; // Electric Blue
  const secondary = [124, 58, 237]; // Purple
  const textWhite = [241, 245, 249];
  const textMuted = [148, 163, 184];
  const borderCol = [30, 30, 50];

  // Fill background
  const drawBackground = () => {
    doc.setFillColor(...bg);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  };
  drawBackground();

  // Header Banner
  doc.setFillColor(...cardBg);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  // Header Accent Line
  doc.setFillColor(...primary);
  doc.rect(0, 40, doc.internal.pageSize.width / 2, 2, 'F');
  doc.setFillColor(...secondary);
  doc.rect(doc.internal.pageSize.width / 2, 40, doc.internal.pageSize.width / 2, 2, 'F');

  // Title
  doc.setTextColor(...textWhite);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(state.tournament.name.toUpperCase(), 14, 25);
  
  // Subtitle
  doc.setTextColor(...primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("OFFICIAL FIXTURE SCHEDULE", 14, 34);

  const rounds = Array.from(new Set(fix.map(m => m.round))).sort((a,b) => a-b);
  let currentY = 55;

  rounds.forEach(r => {
    const roundMatches = fix.filter(m => m.round === r);
    const tableData = roundMatches.map(m => {
      const h = state.tournament.teams.find(t => t.id === m.homeId) || { name: '?' };
      const a = state.tournament.teams.find(t => t.id === m.awayId) || { name: '?' };
      const score = m.status === 'completed' ? `${m.homeScore} - ${m.awayScore}` : 'vs';
      
      return [
        m.date ? new Date(m.date).toLocaleDateString() : 'TBD',
        h.name.toUpperCase(),
        score,
        a.name.toUpperCase(),
        m.status === 'completed' ? 'FT' : (m.status === 'live' ? 'LIVE' : '')
      ];
    });

    const isLeague = state.tournament.type === 'league' || state.tournament.type === 'round_robin';
    const roundLabel = isLeague ? `MATCHWEEK ${r}` : `ROUND ${r}`;

    if (currentY > 260) {
      doc.addPage();
      drawBackground();
      currentY = 20;
    }

    // Round Header
    doc.setFillColor(...cardBg);
    doc.roundedRect(14, currentY, doc.internal.pageSize.width - 28, 12, 2, 2, 'F');
    doc.setTextColor(...textWhite);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(roundLabel, 20, currentY + 8);
    
    doc.autoTable({
      body: tableData,
      startY: currentY + 14,
      theme: 'grid',
      styles: { 
        fillColor: bg, 
        textColor: textWhite, 
        lineColor: borderCol,
        lineWidth: 0.1,
        fontSize: 10, 
        cellPadding: 5,
        font: 'helvetica'
      },
      alternateRowStyles: {
        fillColor: [10, 10, 16]
      },
      columnStyles: {
        0: { halign: 'center', textColor: textMuted, cellWidth: 35, fontStyle: 'bold' },
        1: { halign: 'right', fontStyle: 'bold', cellWidth: 55, textColor: textWhite },
        2: { halign: 'center', fontStyle: 'bold', cellWidth: 20, textColor: primary },
        3: { halign: 'left', fontStyle: 'bold', cellWidth: 55, textColor: textWhite },
        4: { halign: 'center', textColor: secondary, fontStyle: 'bold' }
      },
      didDrawPage: function (data) {
        // Handle page breaks
        if(data.pageNumber > 1 && data.cursor.y === data.settings.margin.top) {
           drawBackground();
        }
      }
    });

    currentY = doc.lastAutoTable.finalY + 15;
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...textMuted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const footerText = `Generated by Quantum Vortex Engine • ${new Date().toLocaleDateString()} • Page ${i} of ${pageCount}`;
    doc.text(footerText, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  doc.save(`${tArr}_Fixtures.pdf`);
}

function renderChampionScreen(container) {
  const standings = calculateStandings();
  const winner = standings[0];
  const color = winner?.color || '#fbbf24';

  container.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-1000">
      <div class="max-w-4xl w-full text-center space-y-12">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
          <div class="relative p-12 bg-slate-900 border-4 border-indigo-500/30 rounded-[4rem] shadow-2xl">
            <div class="text-9xl mb-8 animate-bounce">${ICONS.trophy}</div>
            <h1 class="text-2xl font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">CHAMPION</h1>
            <h2 class="text-7xl font-black text-white uppercase tracking-tighter shadow-indigo-500/20" style="color: ${color}">${winner ? winner.name : 'Unknown'}</h2>
          </div>
        </div>

        <div class="space-y-6">
           <h3 class="text-xl font-bold text-slate-400 capitalize">${state.tournament.name}</h3>
            <div class="flex items-center justify-center gap-6">
              <button id="view-standings-final" class="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl border border-slate-800 transition-all uppercase text-[10px] tracking-widest">Full Standings</button>
              <button id="summary-report-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase text-[10px] tracking-widest">Tournament Summary</button>
              <button id="next-season-champion" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase text-[10px] tracking-widest">Start Season ${ (state.tournament.season || 1) + 1 }</button>
              <button id="celebrate-btn" class="bg-slate-950 text-slate-400 px-6 py-4 rounded-xl font-bold border border-slate-800 uppercase text-[10px] tracking-[0.2em]">Celebrate Again 🎉</button>
            </div>
        </div>

        <button id="close-champion" class="text-slate-600 hover:text-slate-100 font-bold uppercase text-[9px] tracking-widest transition-colors mt-20">Skip Recognition Screen &rarr;</button>
      </div>
    </div>
  `;

  document.getElementById('view-standings-final').addEventListener('click', () => { state.view = 'standings'; render(); });
  document.getElementById('summary-report-btn').addEventListener('click', () => { state.view = 'summary'; render(); });
  document.getElementById('celebrate-btn').addEventListener('click', () => triggerConfetti(color));
  document.getElementById('close-champion').addEventListener('click', () => { state.view = 'dashboard'; render(); });
  
  const nextSeasonBtn = document.getElementById('next-season-champion');
  if (nextSeasonBtn) {
    nextSeasonBtn.addEventListener('click', () => handleNextSeason(state.tournament.id));
  }
}

function handleNextSeason(tId) {
  const oldT = state.tournaments.find(t => t.id === tId);
  if (!oldT) return;

  const newTeams = oldT.teams.map(team => ({ ...team, players: [...(team.players || [])] }));

  const newTournament = {
    ...oldT,
    id: `t-${Date.now()}`,
    season: (oldT.season || 1) + 1,
    leagueId: oldT.leagueId || oldT.id,
    teams: newTeams,
    fixtures: [],
    groups: [],
    status: 'setup_teams',
    currentStage: oldT.type === 'groups' ? 'groups' : null,
    createdAt: new Date().toISOString()
  };
  
  state.tournaments.push(newTournament);
  state.tournament = newTournament;
  state.onboarding.step = 0;
  state.view = 'dashboard';
  saveState();
  render();
}

function renderTournamentSummary(container) {
  const standings = calculateStandings();
  const winner = standings[0];
  const runnerUp = standings[1];
  const third = standings[2];
  const awards = getTournamentAwards();
  const scorers = calculateTopScorers();
  const topScorer = scorers[0];

  const fixtures = state.tournament.fixtures;
  const totalGoals = fixtures.reduce((acc, m) => acc + (m.homeScore || 0) + (m.awayScore || 0), 0);
  const avgGoals = (totalGoals / fixtures.length || 0).toFixed(1);

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-12">
        <div class="space-y-4">
          <h1 class="text-5xl font-black text-slate-100 uppercase tracking-tighter">Mission Summary</h1>
          <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">${state.tournament.name} • Final Logistics Report</p>
        </div>
        <button id="export-summary-pdf" class="bg-slate-900 border border-slate-800 text-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:border-indigo-500/50 transition-all flex items-center gap-3">
          ${ICONS.certificate} Export Official Report (PDF)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
             <div class="absolute top-0 right-0 p-8 text-indigo-500/10 scale-150 transform rotate-12">${ICONS.trophy}</div>
             <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Podium Recognition</h4>
             <div class="space-y-8 relative z-10">
                <div class="flex items-end gap-6 h-64">
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[70%]">
                         <span class="text-3xl">🥈</span>
                         <span class="text-xs font-black text-slate-400 uppercase text-center">${runnerUp?.name || '---'}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-10 rounded-b-xl flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">Runner Up</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-indigo-600/10 rounded-t-3xl border-t border-x border-indigo-500/30 flex flex-col items-center justify-center p-6 space-y-4 h-full relative">
                         <div class="absolute -top-4 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl">1</div>
                         <span class="text-5xl animate-bounce">🏆</span>
                         <span class="text-lg font-black text-white uppercase text-center">${winner?.name || '---'}</span>
                      </div>
                      <div class="w-full bg-indigo-600 h-14 rounded-b-xl flex items-center justify-center text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-900/40">Champion</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[50%]">
                         <span class="text-2xl">🥉</span>
                         <span class="text-[10px] font-black text-slate-500 uppercase text-center">${third?.name || '---'}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-8 rounded-b-lg flex items-center justify-center text-[9px] font-black text-slate-600 uppercase">3rd Place</div>
                   </div>
                </div>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-8">
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Logged</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${totalGoals}</h5>
                <p class="text-[10px] font-bold text-indigo-400 italic font-mono">${avgGoals} Per Engagement</p>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Match Count</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${fixtures.length}</h5>
                <p class="text-[10px] font-bold text-slate-500 italic font-mono">100% Success Rate</p>
             </div>
           </div>
        </div>

        <div class="space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8">
              <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Special Awards</h4>
              <div class="space-y-8">
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl">${ICONS.boot}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Golden Boot</p>
                       <p class="font-black text-slate-100 capitalize">${topScorer?.name || 'N/A'}</p>
                       <p class="text-[10px] font-black text-amber-500 font-mono uppercase tracking-widest">${topScorer?.goals || 0} Goals</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-red-400/10 text-red-500 rounded-2xl">${ICONS.sword}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Attack</p>
                       <p class="font-black text-slate-100 capitalize">${awards.bestAttack?.name || 'N/A'}</p>
                       <p class="text-[10px] font-black text-red-400 font-mono uppercase tracking-widest">${awards.bestAttack?.gf || 0} Goals Scored</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-blue-400/10 text-blue-500 rounded-2xl">${ICONS.shield}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Defence</p>
                       <p class="font-black text-slate-100 capitalize">${awards.bestDefence?.name || 'N/A'}</p>
                       <p class="text-[10px] font-black text-blue-400 font-mono uppercase tracking-widest">${awards.bestDefence?.ga || 0} Conceded</p>
                    </div>
                 </div>
              </div>
           </div>
           <button id="view-manual-awards" class="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-100 py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all">Select Bonus Awards &rarr;</button>
        </div>
      </div>
      <div class="pt-20 text-center">
         <button id="next-season-summary" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-emerald-900/40 uppercase tracking-widest text-sm">Deploy Season ${(state.tournament.season || 1) + 1} &rarr;</button>
      </div>
    </div>
  `;

  document.getElementById('export-summary-pdf').addEventListener('click', exportSummaryAsPDF);
  document.getElementById('view-manual-awards').addEventListener('click', () => { state.view = 'awards'; render(); });
  
  const nextBtn = document.getElementById('next-season-summary');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => handleNextSeason(state.tournament.id));
  }
}

function renderHistoryView(container) {
  const leagueId = state.tournament.leagueId || state.tournament.id;
  const seasons = state.tournaments
    .filter(t => t.leagueId === leagueId || t.id === leagueId)
    .sort((a, b) => (a.season || 1) - (b.season || 1));

  container.innerHTML = `
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-10">
        <div>
          <h2 class="text-4xl font-black text-slate-100 uppercase tracking-tighter">Hall of Immortals</h2>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Chronological Registry of League Dominance</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Total Seasons</span>
              <span class="text-xl font-black text-indigo-400 font-mono">${seasons.length}</span>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        ${seasons.map(s => {
          // Temporarily switch state to calculate standings for this season
          const originalTournament = state.tournament;
          state.tournament = s;
          const standings = calculateStandings();
          const winner = standings[0];
          const runnerUp = standings[1];
          const played = s.fixtures.filter(f => f.status === 'completed').length;
          const total = s.fixtures.length;
          const isCurrent = originalTournament.id === s.id;
          
          state.tournament = originalTournament; // Restore

          return `
            <div class="bg-slate-900 border ${isCurrent ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-slate-800'} rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-slate-900/80">
               <div class="flex items-center gap-8 flex-1">
                   <div class="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center border border-slate-800 p-2 text-center">
                     <span class="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Season</span>
                     <span class="text-[10px] font-black text-slate-100 font-mono leading-tight">${s.season || getSeasonInfo(new Date(s.createdAt)).name}</span>
                  </div>
                  <div>
                     <h3 class="text-xl font-black text-slate-100 uppercase tracking-tight mb-2">${s.name}</h3>
                     <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">${s.type.replace('_',' ')}</span>
                        <span class="text-slate-800 text-xs">•</span>
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${played}/${total} Matches Played</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-12">
                  <div class="text-center">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Champion</p>
                     <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">${winner ? '🏆' : '---'}</span>
                        <span class="font-black text-white uppercase text-xs tracking-tight truncate max-w-[120px]">${winner?.name || 'In Progress'}</span>
                     </div>
                  </div>
                  <div class="text-center opacity-60">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Runner Up</p>
                     <div class="flex flex-col items-center">
                        <span class="text-xl mb-1">${runnerUp ? '🥈' : '---'}</span>
                        <span class="font-bold text-slate-400 uppercase text-[10px] tracking-tight truncate max-w-[120px]">${runnerUp?.name || '---'}</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-3">
                  <button data-goto="${s.id}" class="px-6 py-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-100 uppercase tracking-widest transition-all">
                     Inspect Registry
                  </button>
                  ${isCurrent ? `
                    <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active</div>
                  ` : ''}
               </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.goto;
      state.tournament = state.tournaments.find(t => t.id === id);
      state.view = 'dashboard';
      render();
    });
  });
}

function renderAwardsScreen(container) {
  state.tournament.manualAwards = state.tournament.manualAwards || {};
  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div class="text-center space-y-4">
         <h2 class="text-5xl font-black text-white uppercase tracking-tighter">Honorable Recognition</h2>
         <p class="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Select and honor the top operatives and teams manually</p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${renderManualAwardInput('Team of Tournament', 'player-ot')}
          ${renderManualAwardInput('Fair Play Award', 'fair-play')}
          ${renderManualAwardInput('Best Manager', 'best-manager')}
          ${renderManualAwardInput('Goal of the Mission', 'goal-om')}
       </div>

       <div class="pt-20 text-center">
         <button id="back-to-summary" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Consolidate Summary Registry</button>
       </div>
    </div>
  `;
  container.querySelectorAll('.award-input').forEach(input => {
    input.addEventListener('input', (e) => {
      state.tournament.manualAwards[e.target.dataset.key] = e.target.value;
      saveState();
    });
  });
  document.getElementById('back-to-summary').addEventListener('click', () => { state.view = 'summary'; render(); });
}

function renderManualAwardInput(label, key) {
  return `
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
       <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${label}</h4>
       <input type="text" placeholder="Team Name..." class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all award-input" data-key="${key}" value="${state.tournament.manualAwards[key] || ''}">
    </div>
  `;
}

function exportSummaryAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(28); doc.text("OFFICIAL TOURNAMENT SUMMARY", 14, 25);
  doc.setFontSize(14); doc.text(state.tournament.name, 14, 35);
  
  const standings = calculateStandings();
  const data = standings.map((t, i) => [i+1, t.name, t.p, t.w, t.d, t.l, t.gf, t.ga, t.pts]);
  
  doc.autoTable({
    startY: 50,
    head: [['Pos', 'Squad', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'Pts']],
    body: data,
    theme: 'grid'
  });
  
  doc.save(`${state.tournament.name}_Final_Report.pdf`);
}

try {
  console.log('[KickOff] Script execution reaching bottom. Triggering initial render.');
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      console.log('[KickOff] DOMContentLoaded triggered.');
      render();
    });
  } else {
    render();
  }
} catch (e) {
  alert('CRITICAL STARTUP ERROR: ' + e.message);
  console.error(e);
}

function initH2HChart(stats) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('h2hChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Cleanup old chart
  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Squad A Wins', 'Stalemate', 'Squad B Wins'],
      datasets: [{
        data: [stats.aWins, stats.draws, stats.bWins],
        backgroundColor: ['#10b981', '#475569', '#6366f1'],
        hoverBackgroundColor: ['#34d399', '#64748b', '#818cf8'],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: { 
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 12,
          cornerRadius: 12,
          titleFont: { family: 'Inter', size: 10, weight: '900' },
          bodyFont: { family: 'Inter', size: 12, weight: 'bold' }
        }
      }
    }
  });
}

function initH2HComparisonChart(idA, idB) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('h2hProgressionChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const teamA = state.tournament.teams.find(t => t.id === idA);
  const teamB = state.tournament.teams.find(t => t.id === idB);
  const allRounds = Array.from(new Set(state.tournament.fixtures.map(m => m.round))).sort((a,b) => a-b);

  const getProgression = (teamId) => {
    let pts = 0;
    const prog = [0];
    const fixes = state.tournament.fixtures.filter(m => m.status === 'completed' && (m.homeId === teamId || m.awayId === teamId));
    allRounds.forEach(r => {
      const m = fixes.find(match => match.round === r);
      if (m) {
        const isHome = m.homeId === teamId;
        if (m.homeScore === m.awayScore) pts += 1;
        else if (isHome && m.homeScore > m.awayScore) pts += 3;
        else if (!isHome && m.awayScore > m.homeScore) pts += 3;
      }
      prog.push(pts);
    });
    return prog;
  };

  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0', ...allRounds.map(r => `${r}`)],
      datasets: [
        {
          label: teamA.name,
          data: getProgression(idA),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 2
        },
        {
          label: teamB.name,
          data: getProgression(idB),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          display: true, 
          position: 'top',
          labels: { color: '#475569', font: { size: 9, weight: 'bold' }, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 12,
          cornerRadius: 12
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#475569', font: { size: 9 } }
        },
        x: { 
          grid: { display: false },
          ticks: { color: '#475569', font: { size: 9 } }
        }
      }
    }
  });
}

function initTeamFormChart(teamId, canvasId) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const fixtures = state.tournament.fixtures.filter(m => m.status === 'completed' && (m.homeId === teamId || m.awayId === teamId));
  const rounds = Array.from(new Set(state.tournament.fixtures.map(m => m.round))).sort((a,b) => a-b);
  
  let points = 0;
  const progression = [0];
  rounds.forEach(r => {
    const m = fixtures.find(match => match.round === r);
    if (m) {
      const isHome = m.homeId === teamId;
      if (m.homeScore === m.awayScore) points += 1;
      else if (isHome && m.homeScore > m.awayScore) points += 3;
      else if (!isHome && m.awayScore > m.homeScore) points += 3;
    }
    progression.push(points);
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Start', ...rounds.map(r => `RD ${r}`)],
      datasets: [{
        label: 'Points',
        data: progression,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#475569' } },
        x: { grid: { display: false }, ticks: { color: '#475569' } }
      }
    }
  });
}

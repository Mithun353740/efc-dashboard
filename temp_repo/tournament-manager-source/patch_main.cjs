
const fs = require('fs');
const path = 'src/main.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const newMobileMatches = `               \${matches.map(m => {
                 const isHome = m.homeId === m.teamInMatch.id;
                 const oppId = isHome ? m.awayId : m.homeId; 
                 const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                 const opp = tourney.teams.find(tm => tm.id === oppId) || { name: 'Unknown' };
                 const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                 const drew = m.homeScore === m.awayScore;
                 const done = m.status === 'completed';

                 return \`
                   <div data-match-id="\${m.id}" data-tournament="\${m.tournamentName}" class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="flex flex-col items-center gap-1">
                           <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] \${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                             \${won ? 'W' : (drew ? 'D' : 'L')}
                           </div>
                           \${state.isAdmin ? \`<button class="global-status-toggle p-1 text-slate-600 hover:text-indigo-400 transition-colors text-xs">\${done ? '✅' : '⏳'}</button>\` : ''}
                        </div>
                        <div>
                          <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">\${opp.name}</div>
                          <div class="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5">\${m.tournamentName}</div>
                        </div>
                      </div>
                      <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                        \${state.isAdmin ? \`
                          <input type="number" data-type="\${isHome ? 'home' : 'away'}" value="\${isHome ? (m.homeScore ?? '') : (m.awayScore ?? '')}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-indigo-400 outline-none">
                          <span class="text-slate-700">-</span>
                          <input type="number" data-type="\${isHome ? 'away' : 'home'}" value="\${isHome ? (m.awayScore ?? '') : (m.homeScore ?? '')}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500 outline-none">
                        \` : \`
                          <span>\${m.homeScore}</span>
                          <span class="text-slate-700">-</span>
                          <span>\${m.awayScore}</span>
                        \`}
                      </div>
                   </div>
                 \`;
               }).join('')}`;

const newDesktopMatches = `               \${matches.map(m => {
                 const isHome = m.homeId === m.teamInMatch.id;
                 const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                 const opp = tourney.teams.find(tm => tm.id === (isHome ? m.awayId : m.homeId)) || { name: 'Unknown' };
                 const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                 const drew = m.homeScore === m.awayScore;
                 const status = won ? 'W' : (drew ? 'D' : 'L');
                 const done = m.status === 'completed';

                 return \`
                   <div data-match-id="\${m.id}" data-tournament="\${m.tournamentName}" class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                      <div class="flex items-center gap-6">
                        <div class="text-[10px] font-mono text-slate-700">\${m.date || 'TBD'}</div>
                        <div>
                          <div class="font-black text-slate-200">\${opp.name}</div>
                          <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">\${m.tournamentName}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-8">
                         <div class="font-black font-mono text-xl text-slate-100 flex items-center gap-3">
                           \${state.isAdmin ? \`
                             <input type="number" data-type="\${isHome ? 'home' : 'away'}" value="\${isHome ? (m.homeScore ?? '') : (m.awayScore ?? '')}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none">
                             <span class="text-slate-700">-</span>
                             <input type="number" data-type="\${isHome ? 'away' : 'home'}" value="\${isHome ? (m.awayScore ?? '') : (m.homeScore ?? '')}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-slate-500 outline-none">
                           \` : \`
                             <span>\${m.homeScore}</span>
                             <span class="text-slate-700">-</span>
                             <span>\${m.awayScore}</span>
                           \`}
                         </div>
                         <div class="flex flex-col items-center gap-1">
                            <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm \${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                              \${status}
                            </div>
                            \${state.isAdmin ? \`<button class="global-status-toggle text-[10px] hover:text-indigo-400 transition-colors uppercase font-black tracking-widest mt-1">\${done ? 'Undo' : 'Complete'}</button>\` : ''}
                         </div>
                      </div>
                   </div>
                 \`;
               }).join('')}`;

const setupFunction = `
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
`;

// Replace mobile block (starts at 3774)
// We need to be careful with line numbers.
let mobileStart = lines.findIndex((l, i) => i > 3700 && l.includes('${matches.map(m => {'));
let mobileEnd = lines.findIndex((l, i) => i > mobileStart && l.includes("}).join('')}"));
// If there's a duplicate, it will be the next one.
if (lines[mobileEnd+1].includes("}).join('')}")) {
    lines.splice(mobileStart, (mobileEnd - mobileStart) + 2, newMobileMatches);
} else {
    lines.splice(mobileStart, (mobileEnd - mobileStart) + 1, newMobileMatches);
}

// Replace desktop block
let desktopHeader = lines.findIndex(l => l.includes('Historical Archive'));
let desktopStart = lines.findIndex((l, i) => i > desktopHeader && l.includes('${matches.map(m => {'));
let desktopEnd = lines.findIndex((l, i) => i > desktopStart && l.includes("}).join('')}"));
lines.splice(desktopStart, (desktopEnd - desktopStart) + 1, newDesktopMatches);

// Inject listeners
let mobileChartPos = lines.findIndex(l => l.includes("initTeamFormChart(t.id, 'formChartMobile')"));
lines.splice(mobileChartPos + 1, 0, `    setupGlobalMatchListeners(document.getElementById('bottom-sheet-container'));`);

let desktopChartPos = lines.findIndex(l => l.includes("initTeamFormChart(t.id, state.isMobile ? 'formChartMobile' : 'formChartDesktop')"));
lines.splice(desktopChartPos + 1, 0, `  setupGlobalMatchListeners(document.getElementById('team-detail-modal'));`);

// Inject the function definition at the end of renderTeamDetail or before usage
let renderStart = lines.findIndex(l => l.includes('function renderTeamDetail(teamId) {'));
lines.splice(renderStart + 1, 0, setupFunction);

fs.writeFileSync(path, lines.join('\n'));
console.log('Main.js updated with global match editing');

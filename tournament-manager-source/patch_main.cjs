
const fs = require('fs');
const path = 'src/main.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const newMobileMatches = `              \${matches.map(m => {
                const isHome = m.homeId === m.teamInMatch.id;
                const oppId = isHome ? m.awayId : m.homeId; 
                const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                const opp = tourney.teams.find(tm => tm.id === oppId) || { name: 'Unknown' };
                const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                const drew = m.homeScore === m.awayScore;
                return \`
                  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                     <div class="flex items-center gap-4">
                       <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] \${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                         \${won ? 'W' : (drew ? 'D' : 'L')}
                       </div>
                       <div>
                         <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">\${opp.name}</div>
                         <div class="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5">\${m.tournamentName}</div>
                       </div>
                     </div>
                     <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                       <span>\${m.homeScore}</span>
                       <span class="text-slate-700">-</span>
                       <span>\${m.awayScore}</span>
                     </div>
                  </div>
                \`;
              }).join('')}`;

const newDesktopMatches = `              \${matches.map(m => {
                const isHome = m.homeId === m.teamInMatch.id;
                const tourney = state.tournaments.find(tour => tour.name === m.tournamentName) || state.tournament;
                const opp = tourney.teams.find(tm => tm.id === (isHome ? m.awayId : m.homeId)) || { name: 'Unknown' };
                const won = isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore);
                const drew = m.homeScore === m.awayScore;
                const status = won ? 'W' : (drew ? 'D' : 'L');
                const color = won ? 'text-emerald-400' : (drew ? 'text-yellow-500/70' : 'text-red-400');
                return \`
                  <div class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                     <div class="flex items-center gap-6">
                       <div class="text-[10px] font-mono text-slate-700">\${m.date || 'TBD'}</div>
                       <div>
                         <div class="font-black text-slate-200">\${opp.name}</div>
                         <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">\${m.tournamentName}</div>
                       </div>
                     </div>
                     <div class="flex items-center gap-8">
                        <div class="font-black font-mono text-xl text-slate-100">\${m.homeScore} - \${m.awayScore}</div>
                        <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm \${won ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (drew ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70' : 'bg-red-500/10 border-red-500/20 text-red-500')}">
                          \${status}
                        </div>
                     </div>
                  </div>
                \`;
              }).join('')}`;

const newSeasonLabel = `                   <div class="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center border border-slate-800 p-2 text-center">
                     <span class="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Season</span>
                     <span class="text-[10px] font-black text-slate-100 font-mono leading-tight">\${s.season || getSeasonInfo(new Date(s.createdAt)).name}</span>
                  </div>`;

// Apply from bottom to top
lines.splice(4944, 4, newSeasonLabel);
lines.splice(3865, 22, newDesktopMatches);
lines.splice(3759, 20, newMobileMatches);

fs.writeFileSync(path, lines.join('\n'));
console.log('Main.js patched successfully');

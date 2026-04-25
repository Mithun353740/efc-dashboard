
const fs = require('fs');
const path = 'src/main.js';
let content = fs.readFileSync(path, 'utf8');

const updatedView = `
// ---- PLAYER CREDENTIALS ----
async function renderPlayerCredentialsView(container) {
  const players = state.dashboardPlayers || [];
  
  container.innerHTML = \`
    <div class="max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
      <div>
        <h2 class="text-3xl font-black tracking-tight" style="color:#f1f5f9">Player Credentials</h2>
        <p class="text-xs font-bold mt-1 uppercase tracking-widest" style="color:#475569">Assign login details to your squad</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        \${players.map(p => \`
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] transition-all hover:bg-slate-900/50">
            <div class="flex items-center gap-5 mb-6">
              <img src="\${p.image}" class="w-14 h-14 rounded-2xl object-cover border border-slate-800">
              <div class="flex-1 min-w-0">
                <p class="font-black text-slate-100 uppercase truncate text-lg">\${p.name}</p>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">\${p.team || 'Unattached'}</p>
              </div>
              <button data-player-id="\${p.id}" class="edit-player-cred-btn p-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl transition-all shadow-lg active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Email</span>
                <span class="text-xs font-bold text-slate-300">\${p.email || '—'}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Password</span>
                <span class="text-xs font-bold text-slate-300">\${p.password || '—'}</span>
              </div>
            </div>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;

  container.querySelectorAll('.edit-player-cred-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const p = players.find(player => player.id === btn.dataset.playerId);
      if (p) showPlayerCredEditor(p);
    });
  });
}
`;

// Find and replace the old view implementation
let lines = content.split('\n');
let start = lines.findIndex(l => l.includes('// ---- PLAYER CREDENTIALS ----'));
let end = lines.findIndex(l => l.includes('function showPlayerCredEditor(player) {'));

if (start !== -1 && end !== -1) {
    lines.splice(start, end - start, updatedView);
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Player credentials view updated with show/edit logic');
} else {
    console.error('Could not find Player Credentials block');
}

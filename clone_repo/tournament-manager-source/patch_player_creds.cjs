
const fs = require('fs');
const path = 'src/main.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const newPlayerCredsView = `
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
          <div data-player-id="\${p.id}" class="player-cred-card bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all group">
            <div class="flex items-center gap-4">
              <img src="\${p.image}" class="w-12 h-12 rounded-xl object-cover border border-slate-800">
              <div class="flex-1">
                <p class="font-black text-slate-200 uppercase">\${p.name}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">\${p.email ? 'Email Set' : 'No Email'}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-800"></span>
                  <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">\${p.password ? 'Password Set' : 'No Password'}</span>
                </div>
              </div>
              <div class="text-slate-700 group-hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;

  container.querySelectorAll('.player-cred-card').forEach(card => {
    card.addEventListener('click', () => {
      const p = players.find(player => player.id === card.dataset.playerId);
      if (p) showPlayerCredEditor(p);
    });
  });
}

function showPlayerCredEditor(player) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300';
  modal.innerHTML = \`
    <div class="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 shadow-3xl p-10 animate-in zoom-in duration-300">
      <div class="flex items-center gap-4 mb-10">
        <img src="\${player.image}" class="w-14 h-14 rounded-2xl object-cover border border-slate-800">
        <div>
          <h3 class="text-xl font-black text-slate-100 uppercase">\${player.name}</h3>
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assign Credentials</p>
        </div>
      </div>

      <form id="player-cred-form" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[9px] font-black tracking-widest text-slate-500 uppercase">GMAIL / EMAIL</label>
          <input type="email" name="email" value="\${player.email || ''}" required 
            class="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-indigo-500 transition-all">
        </div>
        <div class="space-y-2">
          <label class="text-[9px] font-black tracking-widest text-slate-500 uppercase">PASSWORD</label>
          <input type="text" name="password" value="\${player.password || ''}" required 
            class="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-indigo-500 transition-all">
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" id="cancel-cred" class="flex-1 py-4 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl">Cancel</button>
          <button type="submit" class="flex-1 py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20">Save Access</button>
        </div>
      </form>
    </div>
  \`;

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
        showToast(\`Credentials updated for \${player.name}\`);
        modal.remove();
        renderCurrentView();
      }
    } catch (err) {
      console.error(err);
      alert('Error updating credentials.');
    }
  };
}
`;

// Inject before settings handler
let injectPos = lines.findIndex(l => l.includes('// --- Change Username handler ---'));
lines.splice(injectPos, 0, newPlayerCredsView);

fs.writeFileSync(path, lines.join('\n'));
console.log('Player credentials view injected');

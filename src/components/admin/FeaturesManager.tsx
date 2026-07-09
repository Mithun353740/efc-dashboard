import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, Radio, TrendingUp, Award, Settings, Plus, Edit2, Trash2, 
  X, Save, RefreshCw, Pin, Eye, Clock, Trophy
} from 'lucide-react';
import { 
  fetchNews, createNewsArticle, updateNewsArticle, deleteNewsArticle,
  fetchLiveMatches, createLiveMatch, updateLiveMatch, endLiveMatch,
  fetchGlobalStats, computeAndSaveGlobalStats,
  fetchAchievements, createAchievement, updateAchievement, deleteAchievement, initializeDefaultAchievements,
  fetchAppSettings, updateAppSettings,
  fetchPlayersOnce
} from '../../lib/store';
import { NewsArticle, LiveMatch, Achievement, AppSettings, Player } from '../../types';
import { cn } from '../../lib/utils';

type Tab = 'news' | 'matches' | 'stats' | 'achievements' | 'settings';

const TABS = [
  { id: 'news' as Tab, label: 'News', icon: Newspaper },
  { id: 'matches' as Tab, label: 'Live Matches', icon: Radio },
  { id: 'stats' as Tab, label: 'Statistics', icon: TrendingUp },
  { id: 'achievements' as Tab, label: 'Achievements', icon: Award },
  { id: 'settings' as Tab, label: 'Settings', icon: Settings },
];

export default function FeaturesManager() {
  const [activeTab, setActiveTab] = useState<Tab>('news');
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2',
              activeTab === tab.id 
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'matches' && <LiveMatchManager />}
          {activeTab === 'stats' && <StatsManager />}
          {activeTab === 'achievements' && <AchievementsManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// NEWS MANAGER
function NewsManager() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const articles = await fetchNews(50);
      setNews(articles);
    } catch (e) {
      console.error('Error loading news:', e);
    } finally { setLoading(false); }
  };

  const handleSave = async (data: { title: string; excerpt: string; content: string; category: string; image?: string }) => {
    if (!data.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!data.excerpt.trim()) {
      setError('Excerpt is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      if (editing?.id) {
        await updateNewsArticle(editing.id, data);
      } else {
        await createNewsArticle({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category as NewsArticle['category'],
          image: data.image,
          authorId: 'admin',
          authorName: 'Admin',
          featured: false,
          publishedAt: Date.now(),
          active: true,
          pinned: false,
        });
      }
      setSuccess(true);
      setShowForm(false);
      setEditing(null);
      loadNews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      console.error('Error saving article:', e);
      setError(e?.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this article?')) {
      await deleteNewsArticle(id);
      loadNews();
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
          Article saved successfully!
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white">News Articles</h3>
        <button onClick={() => { setEditing(null); setShowForm(true); setError(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-black">
          <Plus size={14} /> New Article
        </button>
      </div>

      {showForm && (
        <NewsForm 
          article={editing} 
          onSave={handleSave} 
          onClose={() => { setShowForm(false); setEditing(null); setError(null); }}
          saving={saving}
        />
      )}

      {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : (
        <div className="space-y-4">
          {news.map(article => (
            <div key={article.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-4">
                {article.image && <img src={article.image} alt="" className="w-20 h-20 rounded-lg object-cover" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black text-white bg-brand-purple/50">{article.category}</span>
                    {article.featured && <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-black">Featured</span>}
                    {article.pinned && <Pin size={10} className="text-amber-500" />}
                  </div>
                  <h4 className="font-black text-white">{article.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{article.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(article); setShowForm(true); setError(null); }} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(article.id)} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {news.length === 0 && <p className="text-center text-slate-400 py-8">No news articles yet. Click "New Article" to create one!</p>}
        </div>
      )}
    </div>
  );
}

function NewsForm({ article, onSave, onClose, saving }: { 
  article: NewsArticle | null; 
  onSave: (data: { title: string; excerpt: string; content: string; category: string; image?: string }) => void; 
  onClose: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState({
    title: article?.title || '', 
    excerpt: article?.excerpt || '', 
    content: article?.content || '',
    category: article?.category || 'general', 
    image: article?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between">
          <h3 className="text-lg font-black text-white">{article?.id ? 'Edit' : 'New'} Article</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Title *</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" 
                placeholder="Enter article title..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Excerpt *</label>
              <input 
                type="text" 
                value={form.excerpt} 
                onChange={e => setForm({...form, excerpt: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" 
                placeholder="Short preview text..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Content</label>
              <textarea 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})}
                rows={6} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" 
                placeholder="Full article content..."
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              >
                <option value="match_report">Match Report</option>
                <option value="transfer">Transfer</option>
                <option value="announcement">Announcement</option>
                <option value="award">Award</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Image URL</label>
              <input 
                type="url" 
                value={form.image} 
                onChange={e => setForm({...form, image: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" 
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="p-6 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-brand-purple text-white rounded-xl font-black disabled:opacity-50"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// LIVE MATCH MANAGER
function LiveMatchManager() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => { setLoading(true); try { setMatches(await fetchLiveMatches()); } finally { setLoading(false); } };

  const handleSave = async (data: Omit<LiveMatch, 'id' | 'createdAt'>) => { await createLiveMatch(data); setShowForm(false); loadMatches(); };
  const handleEnd = async (id: string) => { if (confirm('End this match?')) { await endLiveMatch(id); loadMatches(); } };
  const startMatch = async (id: string) => { await updateLiveMatch(id, { status: 'live', startedAt: Date.now() }); loadMatches(); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white">Live Matches</h3>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-black"><Plus size={14} /> Schedule</button>
      </div>

      {showForm && <LiveMatchForm onSave={handleSave} onClose={() => setShowForm(false)} />}

      {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : (
        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.id} className={cn('rounded-xl p-4 border', match.status === 'live' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/10')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('font-black text-sm', match.status === 'live' ? 'text-rose-500' : 'text-slate-400')}>
                  {match.status === 'live' ? '● LIVE' : match.status.toUpperCase()}
                </span>
                <div className="flex gap-2">
                  {match.status === 'upcoming' && <button onClick={() => startMatch(match.id)} className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-lg text-xs font-black">Start</button>}
                  {match.status === 'live' && <button onClick={() => handleEnd(match.id)} className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-lg text-xs font-black">End</button>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-white flex-1 text-right">{match.p1Name}</span>
                <span className="text-2xl font-black text-white">{match.p1Score} - {match.p2Score}</span>
                <span className="font-black text-white flex-1">{match.p2Name}</span>
              </div>
            </div>
          ))}
          {matches.length === 0 && <p className="text-center text-slate-400 py-8">No matches</p>}
        </div>
      )}
    </div>
  );
}

function LiveMatchForm({ onSave, onClose }: { onSave: (data: Omit<LiveMatch, 'id' | 'createdAt'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ p1Name: '', p2Name: '', p1Score: 0, p2Score: 0, status: 'upcoming' as LiveMatch['status'], scheduledAt: Date.now() + 3600000, isHighlight: false, active: true, p1Id: '', p2Id: '' });
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-brand-dark rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-white/10 flex justify-between"><h3 className="text-lg font-black text-white">Schedule Match</h3><button onClick={onClose}><X size={20} /></button></div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Player 1</label><input value={form.p1Name} onChange={e => setForm({...form, p1Name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
            <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Player 2</label><input value={form.p2Name} onChange={e => setForm({...form, p2Name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400">Cancel</button>
          <button onClick={() => onSave(form as any)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl"><Save size={14} /> Schedule</button>
        </div>
      </div>
    </div>
  );
}

// STATISTICS MANAGER
function StatsManager() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => { setLoading(true); try { const [s, p] = await Promise.all([fetchGlobalStats(), fetchPlayersOnce(100)]); setStats(s); setPlayers(p); } finally { setLoading(false); } };
  const computeStats = async () => { setComputing(true); try { await computeAndSaveGlobalStats(players); loadStats(); } finally { setComputing(false); } };

  if (loading) return <div className="text-center py-8 text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-white">Global Statistics</h3>
          <p className="text-xs text-slate-400 mt-1">Pre-computed for minimal reads</p>
        </div>
        <button onClick={computeStats} disabled={computing} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-black disabled:opacity-50">
          <RefreshCw size={14} className={computing ? 'animate-spin' : ''} />{computing ? 'Computing...' : 'Recompute'}
        </button>
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-3xl font-black text-white">{stats.totalPlayers}</p><p className="text-xs text-slate-400">Players</p></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-3xl font-black text-white">{stats.totalMatches}</p><p className="text-xs text-slate-400">Matches</p></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-3xl font-black text-white">{stats.totalGoals}</p><p className="text-xs text-slate-400">Goals</p></div>
        </div>
      )}
    </div>
  );
}

// ACHIEVEMENTS MANAGER
function AchievementsManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadAchievements(); }, []);
  const loadAchievements = async () => { setLoading(true); try { setAchievements(await fetchAchievements()); } finally { setLoading(false); } };
  const handleSave = async (data: Omit<Achievement, 'id' | 'createdAt'>) => { await createAchievement(data); setShowForm(false); loadAchievements(); };
  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await deleteAchievement(id); loadAchievements(); } };
  const initDefaults = async () => { if (confirm('Init defaults?')) { await initializeDefaultAchievements(); loadAchievements(); } };

  const rarityColors: Record<string, string> = { common: 'border-slate-400', rare: 'border-blue-400', epic: 'border-purple-400', legendary: 'border-amber-400' };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white">Achievements</h3>
        <div className="flex gap-2">
          <button onClick={initDefaults} className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-xs font-black">Init Defaults</button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-black"><Plus size={14} /> New</button>
        </div>
      </div>
      {showForm && <AchievementForm onSave={handleSave} onClose={() => setShowForm(false)} />}
      {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div key={ach.id} className={cn('bg-white/5 rounded-xl p-4 border-2', rarityColors[ach.rarity])}>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400">{ach.rarity}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(ach.id)} className="p-1 text-slate-400 hover:text-rose-500"><Trash2 size={12} /></button>
                </div>
              </div>
              <h4 className="font-black text-white">{ach.name}</h4>
              <p className="text-xs text-slate-400 mb-2">{ach.description}</p>
              <span className="text-sm font-black text-white">Target: {ach.requirement}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementForm({ onSave, onClose }: { onSave: (data: Omit<Achievement, 'id' | 'createdAt'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', icon: 'Trophy', category: 'wins' as Achievement['category'], requirement: 10, rarity: 'common' as Achievement['rarity'], active: true });
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-brand-dark rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-white/10 flex justify-between"><h3 className="text-lg font-black text-white">New Achievement</h3><button onClick={onClose}><X size={20} /></button></div>
        <div className="p-6 space-y-4">
          <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as Achievement['category']})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                <option value="wins">Wins</option><option value="goals">Goals</option><option value="tournament">Tournament</option><option value="special">Special</option><option value="streak">Streak</option>
              </select></div>
            <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Rarity</label>
              <select value={form.rarity} onChange={e => setForm({...form, rarity: e.target.value as Achievement['rarity']})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                <option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>
              </select></div>
          </div>
          <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Requirement</label><input type="number" value={form.requirement} onChange={e => setForm({...form, requirement: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400">Cancel</button>
          <button onClick={() => onSave(form as any)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl"><Save size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
}

// SETTINGS MANAGER
function SettingsManager() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSettings(); }, []);
  
  const loadSettings = async () => { 
    setLoading(true); 
    try { 
      const data = await fetchAppSettings(); 
      setSettings(data); 
    } catch (e) {
      console.error('Error loading settings:', e);
      setError('Failed to load settings');
    } finally { setLoading(false); } 
  };
  
  const handleSave = async (updates: Partial<AppSettings>) => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const newSettings = { ...settings, ...updates };
      await updateAppSettings(updates);
      setSettings(newSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      console.error('Error saving settings:', e);
      setError(e?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-400">Loading...</div>;

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
          Settings saved successfully!
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white">App Settings</h3>
        <button onClick={() => handleSave(settings!)} disabled={saving || !settings} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-black disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {settings && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="font-black text-white mb-4">Announcement Banner</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Enabled</span>
                <button onClick={() => handleSave({ announcements: { ...settings.announcements, enabled: !settings.announcements.enabled } })}
                  className={cn('w-12 h-6 rounded-full transition-all relative', settings.announcements.enabled ? 'bg-brand-purple' : 'bg-white/20')}>
                  <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', settings.announcements.enabled ? 'left-7' : 'left-1')} />
                </button>
              </div>
              <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Message</label>
                <input value={settings.announcements.message} onChange={e => setSettings({ ...settings, announcements: { ...settings.announcements, message: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Enter announcement..." /></div>
              <div><label className="block text-xs font-black text-slate-400 uppercase mb-2">Type</label>
                <select value={settings.announcements.type} onChange={e => setSettings({ ...settings, announcements: { ...settings.announcements, type: e.target.value as AppSettings['announcements']['type'] } })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                  <option value="info">Info (Purple)</option><option value="success">Success (Green)</option><option value="warning">Warning (Amber)</option><option value="error">Error (Red)</option>
                </select></div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div><h4 className="font-black text-white">Maintenance Mode</h4><p className="text-xs text-slate-400 mt-1">Block all users except admin</p></div>
              <button onClick={() => handleSave({ maintenanceMode: !settings.maintenanceMode })}
                className={cn('w-12 h-6 rounded-full transition-all relative', settings.maintenanceMode ? 'bg-rose-500' : 'bg-white/20')}>
                <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', settings.maintenanceMode ? 'left-7' : 'left-1')} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

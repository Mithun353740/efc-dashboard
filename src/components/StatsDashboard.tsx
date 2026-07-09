import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Award, Users, Trophy, Flame } from 'lucide-react';
import { fetchGlobalStats } from '../lib/store';
import { GlobalStats } from '../types';
import { cn } from '../lib/utils';

const RARITY_COLORS = {
  common: 'text-slate-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

export default function StatsDashboard() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const globalStats = await fetchGlobalStats();
      setStats(globalStats);
    } catch (e) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!stats) return null;

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white tracking-tighter">CLUB STATISTICS</h2>
          <p className="text-xs font-bold text-slate-400 tracking-widest mt-1 uppercase">Real-time performance metrics</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          icon={<Users size={20} />}
          label="Total Players"
          value={stats.totalPlayers}
          color="bg-brand-purple/10 text-brand-purple"
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Total Matches"
          value={stats.totalMatches}
          color="bg-amber-500/10 text-amber-500"
        />
        <StatCard
          icon={<Target size={20} />}
          label="Total Goals"
          value={stats.totalGoals}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          icon={<Award size={20} />}
          label="Top Win Rate"
          value={`${stats.topWinRates[0]?.winRate || 0}%`}
          color="bg-blue-500/10 text-blue-500"
          sub={stats.topWinRates[0]?.playerName}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Target size={20} className="text-emerald-500" />
            <h3 className="text-lg font-black text-brand-dark dark:text-white">TOP SCORERS</h3>
          </div>
          
          <div className="space-y-4">
            {stats.topScorers.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-black text-sm',
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-slate-400 text-white' :
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-slate-100 dark:bg-white/10 text-slate-500'
                )}>
                  {index + 1}
                </span>
                
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                  {player.playerImage ? (
                    <img src={player.playerImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">?</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-brand-dark dark:text-white truncate">{player.playerName}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-emerald-500">{player.goals}</span>
                  <span className="text-xs text-slate-400">goals</span>
                </div>
              </motion.div>
            ))}
            
            {stats.topScorers.length === 0 && (
              <p className="text-center text-slate-400 py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Top Win Rates */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Flame size={20} className="text-amber-500" />
            <h3 className="text-lg font-black text-brand-dark dark:text-white">BEST WIN RATES</h3>
            <span className="text-xs text-slate-400">(min 10 matches)</span>
          </div>
          
          <div className="space-y-4">
            {stats.topWinRates.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-black text-sm',
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-slate-400 text-white' :
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-slate-100 dark:bg-white/10 text-slate-500'
                )}>
                  {index + 1}
                </span>
                
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                  {player.playerImage ? (
                    <img src={player.playerImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">?</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-brand-dark dark:text-white truncate">{player.playerName}</p>
                  <p className="text-xs text-slate-400">{player.matches} matches</p>
                </div>
                
                <div className="relative w-20 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${player.winRate}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  />
                </div>
                <span className="text-lg font-black text-amber-500 w-12 text-right">{player.winRate}%</span>
              </motion.div>
            ))}
            
            {stats.topWinRates.length === 0 && (
              <p className="text-center text-slate-400 py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Activity (if available) */}
      {stats.weeklyActivity && stats.weeklyActivity.length > 0 && (
        <div className="mt-8 bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/10">
          <h3 className="text-lg font-black text-brand-dark dark:text-white mb-6">WEEKLY ACTIVITY</h3>
          <div className="flex items-end gap-2 h-32">
            {stats.weeklyActivity.map((day, index) => {
              const maxCount = Math.max(...stats.weeklyActivity.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-brand-purple to-brand-purple/50 rounded-t-lg min-h-[4px]"
                  />
                  <span className="text-xs text-slate-400">{formatDayName(day.date)}</span>
                  <span className="text-xs font-black text-brand-dark dark:text-white">{day.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ icon, label, value, color, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
        {icon}
      </div>
      <p className="text-2xl font-black text-brand-dark dark:text-white">{value}</p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1 truncate">{sub}</p>}
    </motion.div>
  );
}

function formatDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
}

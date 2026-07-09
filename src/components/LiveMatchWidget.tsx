import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radio, Clock, Trophy } from 'lucide-react';
import { fetchLiveMatches } from '../lib/store';
import { LiveMatch } from '../types';
import { cn } from '../lib/utils';

export default function LiveMatchWidget() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
    // Refresh every 30 seconds if there are live matches
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMatches = async () => {
    try {
      const liveMatches = await fetchLiveMatches();
      setMatches(liveMatches.filter(m => m.status === 'live' || m.status === 'upcoming'));
    } catch (e) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (matches.length === 0) return null;

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  return (
    <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Live Matches Banner */}
      {liveMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-rose-500/20 to-rose-600/10 border border-rose-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Radio size={20} className="text-rose-500" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
              </div>
              <span className="text-rose-500 font-black text-sm tracking-widest uppercase">Live Now</span>
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-xs font-black">
                {liveMatches.length}
              </span>
            </div>

            <div className="space-y-4">
              {liveMatches.map(match => (
                <div key={match.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Player 1 */}
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-black text-white">{match.p1Name}</span>
                        {match.p1Image && (
                          <img src={match.p1Image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-3xl font-black text-white min-w-[2rem] text-center',
                        match.p1Score > match.p2Score && 'text-green-400'
                      )}>
                        {match.p1Score}
                      </span>
                      <span className="text-white/40 text-xl font-black">-</span>
                      <span className={cn(
                        'text-3xl font-black text-white min-w-[2rem] text-center',
                        match.p2Score > match.p1Score && 'text-green-400'
                      )}>
                        {match.p2Score}
                      </span>
                    </div>

                    {/* Player 2 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-3">
                        {match.p2Image && (
                          <img src={match.p2Image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <span className="font-black text-white">{match.p2Name}</span>
                      </div>
                    </div>
                  </div>
                  {match.tournamentName && (
                    <div className="text-center mt-2">
                      <span className="text-xs text-white/60 flex items-center justify-center gap-1">
                        <Trophy size={10} /> {match.tournamentName}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock size={18} className="text-brand-purple" />
            <span className="text-sm font-black text-brand-dark dark:text-white tracking-widest uppercase">Upcoming</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.slice(0, 3).map(match => (
              <div key={match.id} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {match.p1Image && (
                      <img src={match.p1Image} alt="" className="w-8 h-8 rounded-full object-cover opacity-60" />
                    )}
                    <span className="font-bold text-sm text-slate-500">{match.p1Name}</span>
                  </div>
                  <span className="text-slate-400 text-xs font-black">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-500">{match.p2Name}</span>
                    {match.p2Image && (
                      <img src={match.p2Image} alt="" className="w-8 h-8 rounded-full object-cover opacity-60" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-brand-purple font-black">
                    {formatMatchTime(match.scheduledAt)}
                  </span>
                  {match.tournamentName && (
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{match.tournamentName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

function formatMatchTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = timestamp - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMs < 0) return 'Starting soon';
  if (diffMins < 60) return `In ${diffMins}m`;
  if (diffHours < 24) return `In ${diffHours}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

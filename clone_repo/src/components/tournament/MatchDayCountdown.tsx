import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, CheckCircle } from 'lucide-react';
import { Tournament } from '../../types';

interface MatchDayCountdownProps {
  tournament: Tournament;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

type Phase = 'before' | 'during' | 'over' | 'none';

export function MatchDayCountdown({ tournament }: MatchDayCountdownProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { matchDayStart, matchDayEnd } = tournament;

  if (!matchDayStart) return null;

  const startMs = new Date(matchDayStart).getTime();
  const endMs = matchDayEnd ? new Date(matchDayEnd).getTime() : null;

  let phase: Phase = 'none';
  if (now < startMs) phase = 'before';
  else if (endMs && now < endMs) phase = 'during';
  else if (endMs && now >= endMs) phase = 'over';
  else if (!endMs && now >= startMs) phase = 'during'; // no end set, assume ongoing

  if (phase === 'none') return null;

  const timeLeft =
    phase === 'before'
      ? formatDuration(startMs - now)
      : phase === 'during' && endMs
      ? formatDuration(endMs - now)
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest select-none
          ${phase === 'before'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : phase === 'during'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-white/5 border-white/10 text-slate-500'
          }`}
      >
        {phase === 'before' && (
          <>
            <Clock size={14} className="shrink-0 animate-pulse" />
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] opacity-70">MATCH DAY STARTS IN</span>
              <span className="text-sm font-black tabular-nums tracking-widest">{timeLeft}</span>
            </div>
          </>
        )}

        {phase === 'during' && (
          <>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] opacity-70">
                {endMs ? 'MATCH DAY ENDS IN' : 'MATCH DAY LIVE'}
              </span>
              {timeLeft && (
                <span className="text-sm font-black tabular-nums tracking-widest">{timeLeft}</span>
              )}
            </div>
            <Zap size={12} className="shrink-0 text-emerald-400" />
          </>
        )}

        {phase === 'over' && (
          <>
            <CheckCircle size={14} className="shrink-0" />
            <span>Match Day Over</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

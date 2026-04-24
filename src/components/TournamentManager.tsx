import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface TournamentManagerProps {
  isControlCenter?: boolean;
}

export default function TournamentManager({ isControlCenter = false }: TournamentManagerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TOURNAMENT_OPENED') {
        setIsFullscreen(true);
      } else if (event.data.type === 'TOURNAMENT_CLOSED') {
        // Only auto-minimize if not in control center or specifically requested
        // For now, let's just listen
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={cn(
      "w-full bg-[#050508] transition-all duration-500 ease-in-out overflow-hidden relative",
      isFullscreen 
        ? "fixed inset-0 z-[9999] h-screen w-screen" 
        : "h-[calc(100vh-64px)] rounded-[2rem]"
    )}>
      {/* Fullscreen Controls */}
      <div className="absolute top-4 right-4 z-[10000] flex gap-2">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        {isFullscreen && (
          <button 
            onClick={() => setIsFullscreen(false)}
            className="p-3 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-xl text-red-500 hover:bg-red-500/30 transition-all"
            title="Close Fullscreen"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <iframe 
        src={`/tournament-system/index.html?admin=${isControlCenter}`} 
        className="w-full h-full border-none"
        title="Tournament Manager"
        allow="clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}

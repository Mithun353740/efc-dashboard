import React from 'react';

interface TournamentManagerProps {
  isControlCenter?: boolean;
}

export default function TournamentManager({ isControlCenter = false }: TournamentManagerProps) {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#050508] overflow-hidden relative">
      <iframe 
        src={`/tournament-system/index.html?admin=${isControlCenter}`} 
        className="w-full h-full border-none"
        title="Tournament Manager"
        allow="clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}

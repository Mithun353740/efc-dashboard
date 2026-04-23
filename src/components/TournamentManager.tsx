import React from 'react';

export default function TournamentManager() {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#050508] overflow-hidden relative">
      <iframe 
        src="/tournament-system/index.html" 
        className="w-full h-full border-none"
        title="Tournament Manager"
        allow="clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}

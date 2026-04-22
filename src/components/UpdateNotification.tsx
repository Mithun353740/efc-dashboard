import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdateNotification() {
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 60 seconds while app is open
      if (r) {
        setInterval(() => { r.update(); }, 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('Service Worker registration failed:', error);
    },
  });

  if (!needRefresh || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        color: 'white',
        borderRadius: '999px',
        boxShadow: '0 8px 32px rgba(139,92,246,0.45)',
        fontSize: '0.75rem',
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
      <span>New update available!</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          borderRadius: '999px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
      >
        Update Now
      </button>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '0.1rem',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Dismiss update"
      >
        <X size={14} />
      </button>
    </div>
  );
}

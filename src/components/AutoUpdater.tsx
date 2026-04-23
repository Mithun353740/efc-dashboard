import { useEffect } from 'react';

export default function AutoUpdater() {
  useEffect(() => {
    // Get the current version registered in this tab's session
    let localSessionVersion = sessionStorage.getItem('qv-app-version');

    const checkForUpdates = async () => {
      try {
        // Appending a random timestamp prevents the browser from caching this exact fetch request
        const res = await fetch(`/api/version-ping?cb=${Date.now()}`, {
          cache: 'no-store'
        });
        
        const data = await res.json();
        const liveServerVersion = data.current_version;

        if (!localSessionVersion) {
          // First time this session, just record the server's version
          sessionStorage.setItem('qv-app-version', liveServerVersion);
          localSessionVersion = liveServerVersion;
        } else if (localSessionVersion !== liveServerVersion) {
          // The server restarted (code was updated), but our session has the old code!
          // Force a hard window reload from the server using true to bypass cache
          console.warn("CRITICAL: Code update detected! Auto-refreshing client...");
          sessionStorage.setItem('qv-app-version', liveServerVersion);
          
          // Use multiple strategies to force the browser to forget the past
          window.location.href = window.location.pathname + '?updated=true&t=' + Date.now();
        }
      } catch (err) {
        // Silently ignore ping errors (like if the user is offline or server temporarily unreachable)
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Check again every time the user minimizes the app and opens it back up
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    
    // Check every time the window regains focus
    const handleFocus = () => {
      checkForUpdates();
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    // Also poll every 5 minutes (300,000ms) as a final fallback
    // This goes to the local Express server, NOT Firebase, so it costs 0 database reads.
    const interval = setInterval(checkForUpdates, 300000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // This component is strictly logical and renders exactly nothing
  return null;
}

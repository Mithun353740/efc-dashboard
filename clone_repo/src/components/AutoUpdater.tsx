import { useEffect } from 'react';

export default function AutoUpdater() {
  useEffect(() => {
    // Get the current version registered in this tab's session
    let localSessionVersion = sessionStorage.getItem('qv-app-version');

    const checkForUpdates = async () => {
      try {
        // Fetch the static version file. Static files update immediately on refresh/deploy.
        const res = await fetch(`/version.txt?cb=${Date.now()}`, {
          cache: 'no-store'
        });
        
        if (!res.ok) return;
        const liveServerVersion = (await res.text()).trim();

        if (!localSessionVersion) {
          sessionStorage.setItem('qv-app-version', liveServerVersion);
          localSessionVersion = liveServerVersion;
        } else if (localSessionVersion !== liveServerVersion) {
          console.warn("UPDATE DETECTED: Code was updated on Git! Refreshing...");
          sessionStorage.setItem('qv-app-version', liveServerVersion);
          
          // Force hard reload
          window.location.reload();
        }
      } catch (err) {
        // Silently ignore errors
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

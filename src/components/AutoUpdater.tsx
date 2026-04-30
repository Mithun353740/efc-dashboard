import { useEffect, useState } from 'react';
import { useFirebase } from '../FirebaseContext';

export default function AutoUpdater() {
  const { appVersion } = useFirebase();
  const [localVersion, setLocalVersion] = useState(() => sessionStorage.getItem('qv-app-version'));

  useEffect(() => {
    if (!appVersion) return;

    if (!localVersion) {
      sessionStorage.setItem('qv-app-version', appVersion);
      setLocalVersion(appVersion);
      return;
    }

    if (localVersion !== appVersion) {
      console.warn("REAL-TIME UPDATE DETECTED: New version pushed by Admin!");
      sessionStorage.setItem('qv-app-version', appVersion);
      
      // FOR MOBILE: Force cache-busting reload
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = `${cleanUrl}?v=${appVersion}`;
    }
  }, [appVersion, localVersion]);

  return null;
}

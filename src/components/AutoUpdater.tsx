import { useEffect, useState } from 'react';
import { useFirebase } from '../FirebaseContext';
import { VERSION } from '../constants';

export default function AutoUpdater() {
  const { appVersion } = useFirebase();
  const [initialVersion, setInitialVersion] = useState<string | null>(null);

  useEffect(() => {
    // 1. Wait for a valid version from the DB
    if (!appVersion || appVersion === '1.0.0') return;

    // 2. Capture the first version we see during this session
    if (!initialVersion) {
      setInitialVersion(appVersion);
      return;
    }

    // 3. Only reload if the version CHANGES while we are on the page
    // and if the DB version is different from our hardcoded runtime VERSION.
    if (appVersion !== initialVersion && appVersion !== VERSION) {
      console.warn("REAL-TIME UPDATE DETECTED: New version pushed by Admin!");
      
      // FOR MOBILE: Force cache-busting reload
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = `${cleanUrl}?v=${appVersion}`;
    }
  }, [appVersion, initialVersion]);

  return null;
}

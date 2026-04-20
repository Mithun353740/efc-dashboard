import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // If we're on iOS, show a custom instruction popup since Apple blocks the automatic prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS && !isInstalled) {
      alert(" To install on iPhone/iPad:\n1. Tap the 'Share' button at the bottom of Safari (square with up arrow)\n2. Scroll down and tap 'Add to Home Screen'");
      return;
    }

    if (!deferredPrompt) {
      alert("Installation is currently unavailable. This usually happens if you are opening this via an in-app browser (like inside Instagram or WhatsApp). Please tap the 3 dots at the top right and select 'Open in Chrome' or 'Open in Safari', then tap the install button again!");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  if (isInstalled) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className={`flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full hover:bg-brand-green text-[10px] font-black uppercase tracking-widest transition-all`}
    >
      <Download size={14} />
      <span>Install App</span>
    </button>
  );
}

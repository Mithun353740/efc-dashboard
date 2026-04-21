import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quantumvortex.app',
  appName: 'Quantum Vortex FC',
  webDir: 'dist',
  server: {
    // Live Vercel URL wrapper
    url: 'https://quantumvortexfc.vercel.app',
    cleartext: true
  }
};

export default config;

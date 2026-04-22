import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['logo.svg', 'logo.jpg', 'logo-192x192.png', 'logo-512x512.png'],
        manifest: {
          name: 'Quantum Vortex FC',
          short_name: 'QVFC',
          description: 'Official Quantum Vortex FC Dashboard — Rankings, Stats & Tournaments',
          theme_color: '#8b5cf6',
          background_color: '#0a0a14',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/logo-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/logo-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // Cache strategy: network-first for pages (always get latest)
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api/],
          runtimeCaching: [
            {
              // Firebase & API calls — always network-first so data is always fresh
              urlPattern: /^https:\/\/(firestore|firebase|googleapis)\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firebase-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
                networkTimeoutSeconds: 10,
              },
            },
            {
              // Google Fonts
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              // Images & static assets
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
        devOptions: {
          enabled: false, // Keep SW off in dev mode
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

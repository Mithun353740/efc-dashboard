import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
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
    build: {
      // Firebase + React apps bundle large — suppress the pre-existing warning.
      chunkSizeWarningLimit: 2000,
      // Enable minification and tree-shaking optimizations
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
        },
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Generate sourcemaps only in development
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Firebase SDK — rarely changes, cache-friendly
            'vendor-firebase': [
              'firebase/app',
              'firebase/auth',
              'firebase/firestore',
            ],
            // React core — never changes between deploys
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Animation library — large but stable
            'vendor-motion': ['motion/react'],
          },
        },
      },
    },
  };
});

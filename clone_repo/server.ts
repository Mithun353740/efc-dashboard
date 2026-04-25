import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Generate a distinct server hash once on boot
  // Every time the code is updated and the server restarts, this hash will change
  const SERVER_BOOT_HASH = Date.now().toString(36) + Math.random().toString(36).substring(2);

  // Disable ETag to completely prevent 304 Not Modified browser caching for HTML routes
  app.set('etag', false);

  // Expose an auto-update ping endpoint to forcibly sync client caches
  app.get('/api/version-ping', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json({ current_version: SERVER_BOOT_HASH });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from 'dist' in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // NEVER cache the index.html file so dynamic React/Vite builds always fetch the newest JS chunks
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));
    app.get('*', (req, res) => {
      // Catch-all SPA routing: also never cache index.html
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Handle SPA routing for dev if vite middleware misses it
  app.get('*', (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
       // Vite handles this usually, but just in case
       req.url = '/';
       return next();
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

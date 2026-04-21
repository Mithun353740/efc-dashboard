const CACHE_NAME = 'qvfc-cache-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Safely cache root without throwing if other assets fail
      return cache.add('/');
    }).catch(err => console.log('SW install error:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Minimal fetch listener is required for PWA installability in Chrome
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        if (event.request.mode === 'navigate') {
          const rootResponse = await cache.match('/');
          if (rootResponse) return rootResponse;
        }
      } catch (e) {
        // Ignored
      }
      
      // Fallback response to guarantee Chrome PWA validating a valid Response object
      return new Response('Offline', { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});

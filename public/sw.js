const CACHE_NAME = 'qvfc-cache-v1';

// Install event: skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: claim clients so they get handled right away
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: Network-first approach (good for always changing data like Firebase)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Ignore Firebase WebSocket requests
  if (event.request.url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      // If offline, try to return from cache
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fallback for navigation requests to return index.html
      if (event.request.mode === 'navigate') {
        const indexResponse = await cache.match('/index.html');
        return indexResponse || fetch('/index.html');
      }
    })
  );

  // Background caching
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request).then((response) => {
        // Cache only successful internal/CORS capable requests
        if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
          cache.put(event.request, response.clone());
        }
      }).catch(() => { /* ignore fetch errors safely */ });
    })
  );
});

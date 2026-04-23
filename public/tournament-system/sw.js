const CACHE_NAME = 'kickoff-v' + Date.now(); // Dynamic name to force update
const ASSETS_TO_CACHE = [
  '/tournament-system/',
  '/tournament-system/index.html',
  '/tournament-system/manifest.json',
  '/tournament-system/logo.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Immediately activate new SW
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of all clients immediately
      // Cleanup old caches
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  // Network First strategy for all requests
  // This ensures users always get the latest version if they are online
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If we got a valid response, clone it and update the cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

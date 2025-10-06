const CACHE_NAME = 'gdi-perpetual-engine-v1';
const urlsToCache = [
  '/perpetual-engine.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
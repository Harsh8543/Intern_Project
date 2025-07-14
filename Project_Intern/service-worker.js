self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('cb‑static').then(cache =>
      cache.match(event.request).then(res => res || fetch(event.request))
    )
  );
});

self.registration.periodicSync?.register('location-sync', { minInterval: 3600 * 1000 });
self.addEventListener('periodicsync', event => {
  if (event.tag === 'location-sync') {
    event.waitUntil(
      Promise.resolve()
    );
  }
});

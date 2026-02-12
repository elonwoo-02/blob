self.addEventListener('install', (event) => {
  const cacheName = 'pwa-cache-v2';
  event.waitUntil(
    caches.open(cacheName).then((cache) =>
      cache.addAll([
        '/',
        '/manifest.webmanifest',
        '/icon_favicon32x32.png',
        '/favicon.svg',
        '/icons/icon.svg'
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = 'pwa-cache-v2';
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== keep).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

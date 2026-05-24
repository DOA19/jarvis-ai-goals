self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('jarvis-v1').then((cache) => cache.addAll(['/', '/manifest.json'])));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

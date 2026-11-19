const CACHE = 'ora-v5';
const FILES = ['./', './index.html', './style.css?v=5', './app.js?v=5', './prayers.js?v=5', './bible.js?v=5', './altar.webp',
  './manifest.webmanifest', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('ora-') && key !== CACHE).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.open(CACHE).then((cache) => cache.match(request)).then((response) => response || fetch(request)));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const app = clients.find((client) => client.url.startsWith(self.registration.scope));
    return app ? app.focus() : self.clients.openWindow(self.registration.scope);
  }));
});

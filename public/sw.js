const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `qr-generator-${CACHE_VERSION}`;
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  { url: '/assets/favicon.ico', revision: null },
  { url: '/assets/android-chrome-192x192.png', revision: null },
  { url: '/assets/android-chrome-512x512.png', revision: null }
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/apple-touch-icon.png',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/styles.css',
  '/src/main.jsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(key => key.startsWith('qr-generator-'))
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
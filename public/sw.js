const CACHE_NAME = 'qr-gen-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/favicon.ico',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/App.css'
];

self.addEventListener('fetch', (event) => {
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Only handle supported schemes
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Handle map tiles
  if (event.request.url.includes('cartodb-basemaps')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request)
          .then(response => {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          })
        )
    );
    return;
  }

  // Default strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) return response;
            
            // Only cache http(s) requests
            if (response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});
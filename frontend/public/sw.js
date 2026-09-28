// ShadowGuard AI Service Worker v2.0
const CACHE_NAME = 'shadowguard-v2';
const STATIC_CACHE = 'shadowguard-static-v2';
const DYNAMIC_CACHE = 'shadowguard-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.warn('SW: Static cache failed:', err);
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For API requests, try network then show offline fallback
    if (url.hostname !== location.hostname) {
      event.respondWith(
        fetch(event.request).catch(() => {
          return new Response(
            JSON.stringify({ error: 'Offline', message: 'No internet connection. Please try again.' }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          );
        })
      );
    }
    return;
  }

  // HTML pages: network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => {
        // Return offline fallback for images
        if (event.request.destination === 'image') {
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#F1F5F9"/></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
      });
    })
  );
});

// Background sync for pending scans
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-scan') {
    event.waitUntil(processPendingScans());
  }
});

async function processPendingScans() {
  // Process any queued scans when back online
  console.log('SW: Processing pending scans...');
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'ShadowGuard AI';
  const options = {
    body: data.body || 'New threat detected',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});

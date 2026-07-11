// ============================================================
// InfoDoc PWA Service Worker — Versión Estable
// Versión: v4 — Carga rápida optimizada
// ============================================================
const CACHE_VERSION = 'infodoc-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE];

// Assets críticos para arranque rápido desde ícono
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/Bzulia.webp',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => console.error('Error pre-caching:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key.startsWith('infodoc-') && !ALL_CACHES.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. APIs siempre directo a red
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Navegación (HTML): Cache First si ya hay caché → arranque INSTANTÁNEO
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Caché disponible → servir INMEDIATAMENTE y actualizar en background
          fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(STATIC_CACHE).then(cache => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Sin caché → red con timeout reducido a 800ms
        return new Promise((resolve) => {
          let resolved = false;

          fetch(request).then(response => {
            if (!resolved && response && response.status === 200) {
              resolved = true;
              const copy = response.clone();
              caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
              resolve(response);
            }
          }).catch(() => {});

          // 800ms de espera máxima antes de mostrar offline
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              caches.match('/offline.html').then(offline => {
                resolve(offline || new Response('Sin conexión', { status: 503 }));
              });
            }
          }, 800);
        });
      })
    );
    return;
  }

  // 3. Imágenes y Assets Estáticos (JS/CSS): Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2?|css|js)$/)
  ) {
    const targetCache = request.destination === 'image' ? IMAGE_CACHE : STATIC_CACHE;

    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(targetCache).then(cache => cache.put(request, cacheCopy));
          }
          return networkResponse;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }
});
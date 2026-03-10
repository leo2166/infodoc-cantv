// ============================================================
// InfoDoc PWA Service Worker — Versión Estable
// Versión: v3
// ============================================================
const CACHE_VERSION = 'infodoc-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE];

// Assets básicos para funcionamiento sin conexión
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
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
    return; // El navegador decide
  }

  // 2. Navegación (HTML de páginas): Network First con Timeout corto (2s)
  // Esto arregla el cuelgue en el logo. Si la red es lenta, carga el caché.
  if (request.mode === 'navigate') {
    event.respondWith(
      new Promise((resolve) => {
        let isResolved = false;

        // Intentar red
        const networkFetch = fetch(request).then(response => {
          if (!isResolved && response && response.status === 200) {
            isResolved = true;
            // Guardar copia fresca
            const cacheCopy = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, cacheCopy));
            resolve(response);
          }
        }).catch(() => {
          // Fallo de red, no hacer nada aquí, el timeout o el caché responderá
        });

        // Timeout: Si en 1.5s no hay red, intenta servir CACHE (velocidad en Android)
        setTimeout(() => {
          if (!isResolved) {
            caches.match(request).then(cachedResponse => {
              if (cachedResponse) {
                isResolved = true;
                resolve(cachedResponse);
              }
            });
          }
        }, 1500); // 1.5 segundos máximo de espera en el logo en Android

        // Si red falla rápido, servir caché
        networkFetch.catch(() => {
          if (!isResolved) {
            caches.match(request).then(cachedResponse => {
              isResolved = true;
              resolve(cachedResponse || caches.match('/offline.html'));
            });
          }
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
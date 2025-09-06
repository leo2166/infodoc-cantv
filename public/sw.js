const CACHE_NAME = `infodoc-cache-${new Date().toISOString()}`;
const PRECACHE_URLS = [
  '/',
  '/offline.html' // Una página para mostrar cuando no hay conexión
];

// En la instalación, pre-cacheamos los recursos esenciales.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting()) // Activa el nuevo SW inmediatamente
  );
});

// En la activación, limpiamos las cachés viejas.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_NAME !== cacheName && cacheName.startsWith('infodoc-cache')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Escuchamos mensajes del cliente (la app).
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estrategia de Fetch: Network First, luego Cache, con fallback a offline.
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la respuesta es buena, la cacheamos y la devolvemos
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
          return response;
        })
        .catch(() => {
          // Si falla el fetch, intentamos servir desde la caché
          return caches.match(event.request)
            .then(response => response || caches.match('/offline.html'));
        })
    );
  } else {
    // Para otros recursos (CSS, JS, imágenes), usamos Cache First
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
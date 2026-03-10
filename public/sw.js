// ============================================================
// InfoDoc PWA Service Worker — Estrategia Híbrida
// Versión: v2  ← cambiar aquí en cada deploy importante
// ============================================================
const CACHE_VERSION = 'infodoc-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE];

// Assets del "App Shell" que se pre-cachean en la instalación
const PRECACHE_URLS = [
  '/',
  '/offline.html',
];

// ── INSTALL: pre-cachear el shell ────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar cachés viejos ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('infodoc-') && !ALL_CACHES.includes(key))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── MENSAJES ─────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── FETCH: estrategia híbrida ─────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. APIs — siempre red (chat IA, tasa BCV, etc.)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Imágenes — Cache First con expiración de 24h
  if (request.destination === 'image') {
    event.respondWith(cacheFirstWithExpiry(request, IMAGE_CACHE, 86400));
    return;
  }

  // 3. Navegación (páginas HTML) — Stale-While-Revalidate
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // 4. Assets estáticos (JS, CSS, fuentes) — Cache First
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// ── HELPERS ───────────────────────────────────────────────────

/**
 * Stale-While-Revalidate:
 * Sirve desde caché inmediatamente (si hay), y actualiza en segundo plano.
 * Resultado: apertura instantánea + contenido siempre fresco en la siguiente visita.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || await networkFetch || caches.match('/offline.html');
}

/**
 * Cache First:
 * Sirve desde caché. Si no está, descarga de red y lo guarda.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match('/offline.html');
  }
}

/**
 * Cache First con expiración (en segundos):
 * Guarda timestamp en los headers. Si expiró, busca en red.
 */
async function cacheFirstWithExpiry(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const cachedDate = cached.headers.get('sw-cache-date');
    if (cachedDate) {
      const age = (Date.now() - new Date(cachedDate).getTime()) / 1000;
      if (age < maxAgeSeconds) return cached;
    } else {
      return cached; // Sin fecha = honor indefinido (assets legacy)
    }
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      // Clonar e inyectar header de fecha
      const headers = new Headers(response.headers);
      headers.set('sw-cache-date', new Date().toUTCString());
      const stamped = new Response(await response.blob(), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      cache.put(request, stamped);
      return stamped;
    }
    return response;
  } catch {
    return cached || new Response('', { status: 408 });
  }
}
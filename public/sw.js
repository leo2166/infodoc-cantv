const CACHE_NAME = "infodoc-v1"
const urlsToCache = ["/", "/informacion", "/noticias", "/chat-ia", "/manifest.json"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver desde cache si está disponible, sino hacer fetch
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

const CACHE_NAME = "lens-cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",

  "./js/app.js",
  "./js/state.js",
  "./js/constants.js",
  "./js/data.js",
  "./js/profile.js",
  "./js/mathUtils.js",
  "./js/scoringFilms.js",
  "./js/sessions.js",
  "./js/scoringSessions.js",
  "./js/selection.js",
  "./js/ui.js",
  "./js/youtubeUtils.js",

  "./data/films_enriched.json",

  "./icons/icon-48.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
const CACHE_NAME = "pwa-cache-v5";
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon_favicon32x32.png",
  "/favicon.svg",
  "/icons/icon-192.webp",
  "/icons/icon-512.webp",
];

const putInCache = async (request, response) => {
  if (!response || response.status !== 200) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isPageRequest =
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html");
  const isNetworkFirstAsset =
    url.pathname.startsWith("/_astro/") ||
    /\.(?:css|js|mjs)$/.test(url.pathname);

  if (isPageRequest || isNetworkFirstAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(request, response.clone());
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || (isPageRequest ? caches.match("/") : undefined)),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        putInCache(request, response.clone());
        return response;
      });
    }),
  );
});

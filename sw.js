const CACHE_NAME = "el-griton-loteria-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./cards.js",
  "./app.js",
  "./manifest.json",
  "./cartas/0.PNG",
  ...Array.from({ length: 54 }, (_, i) => `./cartas/${i + 1}.jpg`)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para archivos de código (HTML/CSS/JS), Cache-first para imágenes de las cartas
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.pathname.includes("/cartas/")) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkResp) => {
        const clone = networkResp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return networkResp;
      })
      .catch(() => caches.match(req))
  );
});

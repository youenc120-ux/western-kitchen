/* 離線快取：第一次打開後，沒有網路也能看食譜。更新內容時把版本號加 1。 */
const CACHE = "western-kitchen-v4";
const FILES = ["./","index.html","css/style.css","manifest.webmanifest",
  "js/data-food-1.js","js/data-food-2.js","js/data-food-3.js","js/data-food-4.js","js/data-plating.js","js/data-photos.js","js/data-drinks.js","js/data-learn.js","js/art.js","js/app.js",
  "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
/* cache:"reload" 略過瀏覽器的 HTTP 快取，新版本才不會存到舊檔案 */
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache:"reload"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && (new URL(e.request.url).origin === location.origin || e.request.url.includes("fonts.g"))) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match("index.html"))));
});

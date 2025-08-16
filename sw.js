
const CACHE = "toddler-play-ultimate-dl-v2";
const ASSETS = [
  "./","./index.html","./styles.css","./js/common.js",
  "./pages/abc.html","./pages/abc-fun.html","./pages/numbers.html",
  "./pages/sensory.html","./pages/music.html","./pages/words.html","./pages/shapes.html","./pages/calm.html","./pages/parents.html",
  "./pages/pop.html","./pages/fireflies.html","./pages/rainbow.html","./pages/drum.html","./pages/xylophone.html",
  "./pages/animals.html","./pages/vehicles.html","./pages/fruits.html",
  "./pages/shape-pop.html","./pages/big-shapes.html","./pages/colors.html","./pages/stars.html","./pages/lullaby.html"
];
self.addEventListener("install", e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); });
self.addEventListener("activate", e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener("fetch", e=>{ if(e.request.method!=="GET") return; e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request))); });

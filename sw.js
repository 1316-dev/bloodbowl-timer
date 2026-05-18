const CACHE = 'bb-timer-v3';
const FILES = [
  'index.html',
  'css/styles.css',
  'css/switch.css',
  'js/controller.js',
  'js/model.js',
  'js/view.js',
  'img/favicon192.png',
  'img/favicon512.png',
  'img/favicon.png',
  'img/confrontation_desktop.png',
  'img/confrontation_mobile.png',
  'img/terrain.png',
  'img/Turn-Yellow-600x450.jpg',
  'fonts/barlow-v13-latin-regular.woff2',
  'fonts/barlow-v13-latin-500.woff2',
  'fonts/barlow-condensed-v13-latin-700.woff2',
  'fonts/barlow-condensed-v13-latin-800.woff2',
  'fonts/barlow-condensed-v13-latin-600.woff2',
  'fonts/barlow-condensed-v13-latin-regular.woff2'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(FILES))
            .then(() => self.skipWaiting()) 
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        // Nettoie les anciens caches
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
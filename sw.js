const CACHE = 'bb-timer-v3';
const FILES = [
  '/bloodbowl-timer/index.html',
  '/bloodbowl-timer/css/styles.css',
  '/bloodbowl-timer/css/switch.css',
  '/bloodbowl-timer/js/controller.js',
  '/bloodbowl-timer/js/model.js',
  '/bloodbowl-timer/js/view.js',
  '/bloodbowl-timer/img/favicon192.png',
  '/bloodbowl-timer/img/favicon512.png',
  '/bloodbowl-timer/img/favicon.png',
  '/bloodbowl-timer/img/confrontation_desktop.png',
  '/bloodbowl-timer/img/confrontation_mobile.png',
  '/bloodbowl-timer/img/terrain.png',
  '/bloodbowl-timer/img/Turn-Yellow-600x450.jpg',
    '/bloodbowl-timer/fonts/barlow-v13-latin-regular.woff2',
    '/bloodbowl-timer/fonts/barlow-v13-latin-500.woff2',
    '/bloodbowl-timer/fonts/barlow-condensed-v13-latin-700.woff2',
    '/bloodbowl-timer/fonts/barlow-condensed-v13-latin-800.woff2',
    '/bloodbowl-timer/fonts/barlow-condensed-v13-latin-600.woff2',
    '/bloodbowl-timer/fonts/barlow-condensed-v13-latin-regular.woff2'

];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES))
      .then(() => console.log('SW installé avec succès'))
      .catch(err => {
        console.error('SW installation échouée :', err); 
        throw err;
      })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
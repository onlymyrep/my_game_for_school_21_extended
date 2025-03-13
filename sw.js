const CACHE_NAME = 'emoji-puzzle-v1';
const ASSETS = [
    '/',
    'index.html',
    'bg.mp3',
    'icon-192x192.png',
    'icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

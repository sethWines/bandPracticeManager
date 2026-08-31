// Band Practice Manager - Service Worker (INACTIVE)
// This app is designed to run by opening HTML files directly (file://).
// Service workers cannot register on file:// URLs, so this file is kept
// for optional future HTTP hosting only. No pages register this worker.

const CACHE_NAME = 'band-manager-inactive';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
    );
});

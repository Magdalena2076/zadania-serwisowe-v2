const CACHE_NAME = 'zadania-serwisowe-v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalacja Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FILES);
            })
    );
});

// Aktywacja Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Obsługa żądań
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Zwróć z cache jeśli istnieje
                if (response) {
                    return response;
                }
                // W przeciwnym razie pobierz z sieci
                return fetch(event.request)
                    .then((response) => {
                        // Sprawdź czy odpowiedź jest poprawna
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Sklonuj odpowiedź
                        const responseToCache = response.clone();
                        // Zapisz w cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('converter-static-v1')
        .then((cache) => {
            cache.addAll([
                '/',
                'css/main.css',
                'js/main.js',
                'https://rawgit.com/jakearchibald/idb/master/lib/idb.js'
            ]);
        })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
        })
    )
})
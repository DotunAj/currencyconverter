const cacheName = 'converter-static-v3';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            cache.addAll([
                './',
                './css/main.css',
                './js/main.js',
                'https://rawgit.com/jakearchibald/idb/master/lib/idb.js',
                'https://free.currencyconverterapi.com/api/v5/currencies'
            ]);
        })
    )
})

//TODO: Implement sw update functionality

self.addEventListener('activate', (event) => {
    //Delete old cache
    event.waitUntil(
        caches.keys().then((cachesNames) => {
            Promise.all(
                cachesNames
                    .filter((cachesName) => {
                        if(!cachesName.startsWith('converter-') || cachesName !== cacheName) return true;
                    })
                    .map((cachesName) => {
                        caches.delete(cachesName)
                    })
            )
        })
    );
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
        })
    )
})

self.addEventListener('message', (event) => {
    if(event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
})

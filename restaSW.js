if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/restaSW.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

var Cache_name = 'resta-sw-1';
var Cached_items = [
                  './',
                  '/index.html',
                  '/restaurant.html',
                  '/js/dbhelper.js',
                  '/js/main.js',
                  '/js/restaurant_info.js',
                  '/css/styles.css',
                  '/data/restaurants.json',
                  '/img/'
                  ]


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(Cache_name)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(Cached_items);
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) { 
          return response; 
        }
        return fetch(event.request);
      }
    )
  );
});
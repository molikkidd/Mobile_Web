

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/restaSW.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', registration.err);
    });
};

var Cache_name = 'resta-sw-1';
var Cached_items = [
                  './',
                  '/dist/index.html',
                  '/dist/restaurant.html',
                  '/iDbLib.js',
                  '/dist/js/dbhelper.js',
                  '/dist/js/main.js',
                  '/dist/js/restaurant_info.js',
                  '/dist/css',
                  '/img/rest-list',
                  '/restaSW.js'
                  ];


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
      caches.match(event.request.url).then(response => {
        return response || fetch(event.request.url)
        }).catch(error => {
        console.log(Response.error);
      })
    );
  })



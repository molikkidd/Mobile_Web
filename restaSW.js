

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
var newCache = 'resta-sw-2';
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


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(Cache_name)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(Cached_items);
      })
  );
});


self.addEventListener('fetch', (event) => {
  



  let port = `http://localhost:$1337/restaurants`;
  let portTwo = `http://localhost:1337/reviews`;

  let reqUrl = new URL(event.request.url);

if(event.request.method === "POST"){
         var newObj = {};

               event.request.formData().then(formData => {

                for(var pair of formData.entries()) {
                  var key = pair[0];
                  var value =  pair[1];
                  newObj[key] = value;
                }

              })
      }


   if (reqUrl === port && portTwo){
    return caches.match(reqUrl);
   }

    event.respondWith( 
        caches.match(event.request, {ignoreSeach:true}).then(response => {
          if (response) {
            return response
          }
             return fetch(event.request).then(ca =>{
            caches.open('resta-sw-1').then(cache => {
              cache.put(event.request, ca);
            });
            return ca.clone();
           }).catch(error => {
            return caches.match(reqUrl);
          console.log(Response.error);
        })
      })
    );  
});

// self.addEventListener('fetch', function(event) {
//       if(event.request.method === "POST"){
//          var newObj = {};

//                event.request.formData().then(formData => {

//                 for(var pair of formData.entries()) {
//                   var key = pair[0];
//                   var value =  pair[1];
//                   newObj[key] = value;
//                 }

//               })
//       }
// })


self.addEventListener('activate', event => {
  // delete any caches that aren't in newCaches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!newCache.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('new cache handling get request!');
    }).catch(error => {
      console.log(error);
    })
  );
});




/**
 * Common database helper functions.
 */



// Restaurant URLS
const Database_Url = `http://localhost:1337/`;
const favor_Url = `http://localhost:1337/restaurants/?is_favorite=true`;
const restById_Url = `http://localhost:1337/restaurants/<restaurant_id>`;

// Review URLS
const revs_Url = 'http://localhost:1337/reviews/';
const revById_Url = `http://localhost:1337/reviews/?restaurant_id=<restaurant_id>`;
const restRev_ById = `http://localhost:1337/reviews/<review_id>`;

const dbPromise = idb.open('restaDB', 21, upgradeDb => {
            switch (upgradeDb.oldVersion) {
              case 0:
              upgradeDb.createObjectStore('restaurants', {
                keyPath: 'id'
                  });
                
              case 1: 
              const reviews = upgradeDb.createObjectStore('reviews', {
                keyPath: 'id'
              });

              reviews.createIndex('restaurant_id', 'restaurant_id', {
                autoIncrement: true
              });

            }
          });

class DBHelper {


  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return Database_Url;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    fetch(DBHelper.DATABASE_URL+'restaurants').then(response => {
         return response.json().then(restaurants => { 
          dbPromise.then(db => {
            const tx = db.transaction('restaurants', 'readwrite'); 
            const restaStore = tx.objectStore('restaurants');

            // loop thru each restaurant and add to the cache
            restaurants.forEach(restaurant => { 
            restaStore.put(restaurant);
            return tx.complete;
            });
            // display all data from the cache
            callback(null, restaurants);
            return restaStore.getAll();
        }).catch( error => { // Oops!. Got an error from server.
            // return all restaurants when its 
            callback(error, restaurants);
            console.log(error);
        }); 

    })
  });
};

static fetchReviewsById(id, callback) {

    fetch(DBHelper.DATABASE_URL+`reviews/`).then(response => { 
         return response.json().then(reviews => { 

          // store reviews in the reviews Store
          dbPromise.then(db => { 
            const tx = db.transaction('reviews', 'readwrite'); 
            const revStore = tx.objectStore('reviews');

            // loop thru each restaurant and add to the cache
            if (Array.isArray(reviews)){
            reviews.forEach(review => { 
            revStore.put(review);
            return tx.complete;
            });

           return revStore.getAll();

          }


          // console.log(reviews);
            // display all data from the cache
           
        }).then(revObj =>{
           console.log(revObj);

          dbPromise.then(db => { 
          const tx = db.transaction('reviews', 'readonly').objectStore('reviews'); 
          const revIndex = tx.index('restaurant_id');

          revIndex.openCursor().onsuccess = event => {
            let cursor = event.target.result;


            revObj.map(revId =>{
               return revIndex.getAll('restaurant_id');
            })

            if (cursor === restaurant_id) {
              cursor.continue();  
              
            }

            return revIndex.getAll();
              
          }

                              
        });
        

        }).catch( error => { // Oops!. Got an error from server.

          // return reviews by restaurantId index 

            callback(error, reviews);

            console.log(error);
        }); 

      })
    });
}


  /**
   * Fetch a restaurant by its ID.
   */
static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      // open idb and get restaurants by ID then add them



      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);

        if (restaurant) { 
        // Got the restaurant  
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }



  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph){
        return `/img/${restaurant.photograph}`
    } 
        return `/img/${restaurant.id}`;
  }
  
  

  /**
   * Map marker for a restaurant.
   */

  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker (
      [restaurant.latlng.lat, restaurant.latlng.lng],
        {
          title: restaurant.name,
          alt: restaurant.name,
          url: DBHelper.urlForRestaurant(restaurant)
        }
      )
      marker.addTo(newMap);
    return marker;
  }

// update the favorite status 
static updFavStatus(restaurantId, newFav) {
  console.log('changed the status', newFav);

  fetch(`http://localhost:1337/restaurants/${restaurantId}?is_favorite=${newFav}`, {method: 'PUT'}).then(()=>{
    console.log('a change was made');

    dbPromise.then(db => {
      const tx = db.transaction('restaurants', 'readwrite'); 
      const restaStore = tx.objectStore('restaurants');

      restaStore.get(restaurantId).then(restaurant => {
        restaurant.new_Fav = newFav;
        restaStore.put(restaurant);
      });
    })
  })
}





  // static fetchReviewsbyId(id) {
  //   return fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`, {method:'GET'}).then(
  //     response => {response.json()}).then(reviews => { debugger;
  //       this.dbPromise().then(db => {
  //         if(!db) return;

  //         let tx = db.transaction('reviews', 'readwrite');
  //         let restaStore = tx.objectStore('reviews');

  //         if(Array.isArray(reviews)){
  //           reviews.forEach( review => {
  //             store.put(review);
  //           });
  //         } else {
  //           store.put(reviews);
  //         }
  //       })
  //     })
  // }



}




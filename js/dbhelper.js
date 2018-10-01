/**
 * Common database helper functions.
 */



// Restaurant URLS
const Database_Url = `http://localhost:1337/`;
const restById_Url = `http://localhost:1337/restaurants/<restaurant_id>`;
const favor_Url = `http://localhost:1337/restaurants/?is_favorite=true`;

// Review URLS
const revs_Url = 'http://localhost:1337/reviews/';
const restRev_ById = `http://localhost:1337/reviews/<review_id>`;
const revById_Url = `http://localhost:1337/reviews/?restaurant_id=`;

const dbPromise = idb.open('restaDB', 23, upgradeDb => {
            switch (upgradeDb.oldVersion) {
              case 0:
              upgradeDb.createObjectStore('restaurants', {
                keyPath: 'id'
                  });
                
              case 1: 
              const reviews = upgradeDb.createObjectStore('reviews', {
                keyPath: 'id',
                autoIncrement: true
              });

              reviews.createIndex('restaurant', 'restaurant_id');
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
            console.log(restaStore.getAll())
            return restaStore.getAll();
        }).catch( error => { // Oops!. Got an error from server.
            // return all restaurants when its 
            callback(error, restaurants);
            console.log(error);
        }); 

    })
  });
};


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
              console.log(restaurant);

        if (restaurant) { 
        // Got the restaurant
                                        
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });

    // also fetch the reviews by ID
    fetch(revById_Url + id).then(response => { 
         return response.json().then(reviews => { 
          console.log('fetched the reviews from the url:', reviews);
                        console.log('and this was the url id:', id);

          // store reviews in the reviews Store
          dbPromise.then(db => { 
            const tx = db.transaction('reviews', 'readwrite'); 
            const revStore = tx.objectStore('reviews');

              // loop thru each review and add to the cache
              if (Array.isArray(reviews)) {
                reviews.map(review => { 
                revStore.put(review); 
                return tx.complete;
                });
              }
          });
        }).catch(error => {
          console.log(error);
           });
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




static fetchReviewsById(id) {
  console.log('this is the fetch reviews function:', id);
        return dbPromise.then(db => { 
              const tx = db.transaction('reviews', 'readwrite').objectStore('reviews'); 
              const revIndex = tx.index('restaurant');

              if (!id) {
                return;
              } else {
                console.log('what is returned to fillReviewsHTML:', revIndex.getAll(id))
                return revIndex.getAll(id);
              }
        })
}

// add new review to the page
static addNewReview(review) {
    console.log('this is what is sent to the addReview:', review);


  fetch('http://localhost:1337/reviews/', {
        method: 'POST', 
        mode:'cors',
        headers: new Headers ({'Content-Type': 'application/json; charset=utf-8'}),
        body: JSON.stringify(review)
  }).then((response) => {

    console.log(response, 'after being sent to the server');

      dbPromise.then(db => { 
            const tx = db.transaction('reviews', 'readwrite')
            const revStore = tx.objectStore('reviews');

              // loop thru each review and add to the cache            
                revStore.put(review);
                return tx.complete;
    })
  })

}
 

static offLineReview(review) {
    localStorage.setItem('review', JSON.stringify(review));

  window.addEventListener('online', event =>{
        alertify.success('CONNECTION RESTORED');
        DBHelper.addNewReview(review);
        localStorage.removeItem('review');
  });
}


// update the favorite status 
static updFavStatus(id, newFav) {
    console.log('changed the status', newFav);

    fetch(`http://localhost:1337/restaurants/` + id + `?is_favorite=` + newFav, {method: 'PUT'}).then(()=>{
      console.log('restaurant: ' + id + ' is_favorite was changed to ' + newFav);

      dbPromise.then(db => {
        const tx = db.transaction('restaurants', 'readwrite'); 
        const restaStore = tx.objectStore('restaurants');

        restaStore.get(id).then(restaurant => {
            newFav = restaurant.is_favorite;
            restaStore.put(restaurant);   
        });

      });

    })
}


}




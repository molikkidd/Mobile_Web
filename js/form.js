import class DBHelper from 'dbhelper.js';

class form {
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
}
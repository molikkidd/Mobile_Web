let restaurants,
  neighborhoods,
  cuisines,
var DBHelper = `http://localhost:1337/restaurants`;
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
});
/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      // aria labels
      select.setAttribute('role', 'listbox')
      select.setAttribute('aria-label','neighborhoods')
      select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      // aria labels
      select.setAttribute('role', 'listbox')
      select.setAttribute('aria-label','cuisines')
      select.append(option);
  });
}

// Initialize MapBox Map
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYWZyb3NhbSIsImEiOiJjamljazg3Y2kwMXY4M3FwOXljdms5azhvIn0.8g4QAAuWOMBL1Lp_I2uDuw',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}


/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
    // create picture element 
  const picture = document.createElement('picture');
     picture.setAttribute('class', 'resta-pic'); 
    
  const img = DBHelper.imageUrlForRestaurant(restaurant);
  const imgurlsm = img + "sm_2x.jpg";
  const imgurl1x = img + "md_1x.jpg";
  const imgurl2x = img + "lg_2x.jpg"; 
    
// create source element 
  let source; 

  source = document.createElement('source');
  // add media width and srcsets to to source element 
    source.media = '(min-width: 710px)';
    source.srcset = `${imgurl1x}`;
    // add source to picture element
    picture.append(source); 

 source = document.createElement('source');
  // add media width and srcsets to to source element 
    source.media = '(min-width: 1020px)';
    source.srcset = `${imgurl2x}`;
    // add source to picture element
    picture.append(source);

  // create image element within picture element as default image
  const image = document.createElement('img');
    image.className = 'restaurant-img lazyload';
    image.src = `${imgurlsm}`;
    image.setAttribute('data-src', `${imgurlsm}`);
    image.alt = restaurant.name;
    picture.append(image);
    // add picture element to li 
    li.append(picture);
 

  const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    li.append(name);

  const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

  const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);
// ========================================
// changed the a tag to a button
  const more = document.createElement('button');
    more.innerHTML = 'View Details';
    // added onclick function for button tag
    more.onclick = function () {
      const url = DBHelper.urlForRestaurant(restaurant);
      window.location = url;
    };
// ===================================
// added aria label
    more.setAttribute('aria-label', restaurant.name);
    li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
 addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
  });
} 



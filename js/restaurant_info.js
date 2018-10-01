let restaurant;
var newMap;

document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();

});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
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
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });   
}


/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => { 
      console.log(id);
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
// =========================================================
// added media queries for images and widths
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // added alt text 
  image.alt = restaurant.photext;
  const imgurlbase = DBHelper.imageUrlForRestaurant(restaurant, "rest-list");
  const imgurlsm = imgurlbase + "sm_2x.jpg";
  const imgurl1x = imgurlbase + "md_1x.jpg";
  const imgurl2x = imgurlbase + "lg_2x.jpg";
    image.src = imgurlsm;
    // set media queries for min widths
    image.srcset = `${imgurl1x} 400w, ${imgurl2x} 700w`;
    image.alt = restaurant.photext;

   
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews

DBHelper.fetchReviewsById(self.restaurant.id).then(res => {
    self.reviews = res;
    fillReviewsHTML();
  });

                 
}
    
    
/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
let restaurant = self.restaurant;

const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
  }
// Favorite button
const newFavourite = document.createElement('button');
  let icon = document.createElement('i');
    icon.className = 'fas fa-trophy';
    newFavourite.append(icon);

// Upon clicking the sumbit button
  newFavourite.onclick = () => {
    var newFav = restaurant.is_favorite;
    if (newFav) {
        newFav = 'true';
        alertify.success('A new Favorite');
    } else {
        newFav = 'false';
        alertify.warning('Removed Favorite');

    }
      console.log(newFav);
    applyNewClass(newFavourite, newFav);
    DBHelper.updFavStatus(restaurant.id, newFav);
    restaurant.is_favorite = !restaurant.is_favorite;
  };
    
    applyNewClass(newFavourite, restaurant.is_favorite);
  hours.append(newFavourite);
}

applyNewClass = (el, newFav) =>{

  console.log(el, newFav);

    if(newFav !== 'true') {
      el.classList.remove('fav_yes');
      el.classList.add('fav_no');
      el.setAttribute('aria-label', 'Not Favorited');
    } else {
      el.classList.remove('fav_no');
      el.classList.add('fav_yes');
      el.setAttribute('aria-label', 'Favorited');
    } 
     
}

addReview = () => {

  event.preventDefault();
  
  // Grab the values from the submit form
  let restId = getParameterByName('id');
  let name = document.getElementById('reviewer-name').value;
  let rating = document.getElementById('rating').value;
  let comments = document.getElementById('new-comment').value;

// Store values in an Array
  const review = [
  name, rating, comments, restId
  ];
// Create a template/JSON object to display 
  const displayNewReview = {

    restaurant_id: parseInt(review[3]),
    name: review[0],
    createdAt: new Date(),
    rating: parseInt(review[1]),
    comments: review[2],
    updatedAt: Date.now()
  }

  document.addEventListener('onLoad', (event)=>{
    console.log(event.type);

});
// if offline store the review in the db
  if (!navigator.onLine) {
  // add review to local storage then send to server after
    DBHelper.offLineReview(displayNewReview);
    createReviewHTML(displayNewReview);
    document.getElementById('rev-form')
    .reset( 
      alertify.error('OFFLINE = Review added to DB')
    );

  } else {
  // when online do the same thing
    DBHelper.addNewReview(displayNewReview);
    createReviewHTML(displayNewReview);
    document.getElementById('rev-form')
    .reset(  
      alertify.success('New review was added')
    ); 
  }
 
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
console.log(self.reviews);
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  let newDate = new Date(review.createdAt).toString();
  date.innerHTML = newDate;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  // breadcrumb.setAttribute('aria-label', restaurant.name)
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



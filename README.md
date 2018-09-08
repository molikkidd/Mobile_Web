# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_


Three Stage Course Material Project - Restaurant Reviews
Local Development API Server
Usage
Get Restaurants
curl "http://localhost:1337/restaurants"
Get Restaurants by id
curl "http://localhost:1337/restaurants/{3}"
Architecture
Local server

Node.js
Sails.js
Contributors
Brandy Lee Camacho - Technical Project Manager
David Harris - Web Services Lead
Omar Albeik - Frontend engineer
Getting Started
Development local API Server
Location of server = /server Server depends on node.js LTS Version: v6.11.2 , npm, and sails.js Please make sure you have these installed before proceeding forward.

Great, you are ready to proceed forward; awesome!

Let's start with running commands in your terminal, known as command line interface (CLI)

Install project dependancies
# npm i
Install Sails.js globally
# npm i sails -g
Start the server
# node server
You should now have access to your API server environment
debug: Environment : development debug: Port : 1337

Endpoints
GET Endpoints
Get all restaurants
http://localhost:1337/restaurants/
Get favorite restaurants
http://localhost:1337/restaurants/?is_favorite=true
Get a restaurant by id
http://localhost:1337/restaurants/<restaurant_id>
Get all reviews for a restaurant
http://localhost:1337/reviews/?restaurant_id=<restaurant_id>
Get all restaurant reviews
http://localhost:1337/reviews/
Get a restaurant review by id
http://localhost:1337/reviews/<review_id>
Get all reviews for a restaurant
http://localhost:1337/reviews/?restaurant_id=<restaurant_id>
POST Endpoints
Create a new restaurant review
http://localhost:1337/reviews/
Parameters
{
    "restaurant_id": <restaurant_id>,
    "name": <reviewer_name>,
    "rating": <rating>,
    "comments": <comment_text>
}
PUT Endpoints
Favorite a restaurant
http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true
Unfavorite a restaurant
http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=false
Update a restaurant review
http://localhost:1337/reviews/<review_id>
Parameters
{
    "name": <reviewer_name>,
    "rating": <rating>,
    "comments": <comment_text>
}
DELETE Endpoints
Delete a restaurant review
http://localhost:1337/reviews/<review_id>
If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our Waffle Dashboard. Even better you can submit a Pull Request with a fix :)

SUMMARY
Lighthouse ratings
Performance: >90

Progressive Web App: >90

Accessibility: >90

Best Practices: >90

warning!
To test it. Be careful on the caches etc. Clear everything first. Test it ( reload the page ) with the site down. Run the http-server ( Do Not run the gulp for the Audits test ). Now you are ready for the Audits ( Lighthouse tests).

Steps to run correctly.
1st Run node server ( check for the sails ).

2nd Run the http-server -p 8000 ( if you want just run gulp ).

cert.pem and key.pem are for https.
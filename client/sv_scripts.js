function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
  // The maximum is inclusive and the minimum is inclusive
}

function formToObject(htmlFormElement) {
  const formItem = new FormData(htmlFormElement).entries();
  const formArray = Array.from(formItem);
  const formObject = formArray.reduce((collection, item, index) => {
    if (!collection[item[0]]) {
      collection[item[0]] = item[1];
    }
    return collection;
  }, {});
  console.log(formObject);
  return formObject;
}

function restoArrayMake(dataArray) {
  // console.log('fired datahandler');
  // console.table(dataArray); // this is called "dot notation"
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });
  return listItems;
}

function makeRestaurantRating(restaurant_id, rating_id ) {
  let result = '';
  result += '[';
  result += '<input';
  result += ' type="range"';
  result += ' min="1"';
  result += ' max="11"';
  result += ` value="${rating_id}"`;
  result += ' onchange="updateRestaurantRatingAndDisplay(';
  result +=`this,${restaurant_id}, this.value)"`;
  result += '>';
  result += ']';
  result += ` ${(rating_id-1)/2} / 5 stars`;
  return result;
}
async function updateRestaurantRatingAndDisplay(target,
                                                restaurant_id, 
                                                rating_id) {
console.log('target =');
console.log(target);
let parent = target.parentNode;
let restaurantRating = makeRestaurantRating(restaurant_id, rating_id);
parent.innerHTML = restaurantRating;
  // eslint-disable-next-line no-use-before-define
  updateRestaurantRating(restaurant_id, rating_id);
  console.log(target.parentNode);
}

// eslint-disable-next-line camelcase
async function updateRestaurantRating(restaurant_id, rating_id) {
  // find the restaurant's current name and description
  // so we can keep those the same
  // and only update the rating_id for this restaurant
  // eslint-disable-next-line camelcase
 
  // eslint-disable-next-line no-use-before-define
  
  // eslint-disable-next-line camelcase
  const results = await fetch(`/api/restaurants/${restaurant_id}`);
  console.log(results);
  const arrayFromJson = await results.json();
  const restaurant = arrayFromJson.data[0];
  const name = restaurant.restaurant_name;
  const {description} = restaurant;

  // eslint-disable-next-line camelcase
  const new_restaurant = {
    restaurant_name: name, 
    description: description, 
    rating_id: rating_id,
    restaurant_id: restaurant_id
  };
  await fetch('/api/restaurants', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(new_restaurant)
  });
  // console.log(b)
}
async function updateRestaurants(collection) {
  // console.log('fired HTML creator');
  // console.table(collection);
  let table = '<table>';
  // eslint-disable-next-line no-const-assign
  table += '<thead><tr><th>rating</th><th>restaurant</th></tr></thead>';
  table += '<tbody>';
  const targetList = document.querySelector('#resto-list');
 // await collection.forEach(async(item) => {
  for (const item of collection) {
    const { restaurant_name } = item;
    // eslint-disable-next-line camelcase
    const {rating_id} = item;
    const displayName = restaurant_name.toLowerCase();
    // eslint-disable-next-line camelcase
    const results = await fetch(`/api/rating/${rating_id}`); // This accesses some data from our API
    const arrayFromJson = await results.json();
    const displayRating = arrayFromJson[0].rating;
    // eslint-disable-next-line camelcase
    const { restaurant_id } = item;
    //const ratingSlider = `[<input type="range" min="1" max="11"  value="${rating_id}" onchange="updateRestaurantRatingAndDisplay(this,${restaurant_id}, this.value)">]`;
    const ratingSlider = 
      makeRestaurantRating(restaurant_id, rating_id);
    let injectThisItem = '<tr>';
    // eslint-disable-next-line no-template-curly-in-string
    injectThisItem += `<td>${ratingSlider}</td>`;
    // eslint-disable-next-line no-const-assign
    injectThisItem += `<td>${displayName}</td>`;
    injectThisItem += '</tr>';
    // eslint-disable-next-line no-const-assign
    table += injectThisItem;
  }
  // eslint-disable-next-line no-const-assign
  table += '</tbody>';
  table += '</table>';
  targetList.innerHTML = table;
}
function createHtmlList(collection) {
  // console.log('fired HTML creator');
  // console.table(collection);
  const targetList = document.querySelector('#resto-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const { name } = item;
    // eslint-disable-next-line camelcase
    const displayName = name.toLowerCase();
    const displayRating = rating_id.toLowerCase();
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  console.log('script loaded');
  const form = document.querySelector('.food-form');
  const submit = document.querySelector('#search_button');
  const addRestoButton = document.querySelector('#add_button');
  const restoName = document.querySelector('#restoname');
  const cuisine = document.querySelector('#cuisine');
  const price = document.querySelector('#price');
  const zipcode = document.querySelector('#zipcode');
  const address = document.querySelector('#address');
  const city = document.querySelector('#city');
  const state = document.querySelector('#state');
  const rating = document.querySelector('#rating');
  const retVar = 'restaurants';
  // submit.style.display = 'none';

/// start of lab 8 section (modified lab 7 code)
  restaurants = localStorage.getItem(retVar);
 
console.log(restaurants);
  //if (!localStorage.getItem(retVar)) 
  if (restaurants === null
  || restaurants === 'undefined') {
    const results = await fetch('/api/restaurants'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    restaurants = JSON.stringify(arrayFromJson)
    localStorage.setItem(retVar, restaurants);
  }

  const storedDataString = restaurants;
  const storedDataArray = JSON.parse(storedDataString);
  if (storedDataArray.length > 0) {
    // submit.style.display = 'block';

    // allows us to change the var to anything, but pre-sets as array
    let currentArray = [];
    cuisine.addEventListener('input', async (event) => {
      console.log(event.target.value);

      if (currentArray.length < 1) {
        return;
      }

      const selectResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      console.log("Reebok")
      console.log(selectResto);
      updateRestaurants(selectResto);
    });

    // TODO: filter for zipcode
    zipcode.addEventListener('input', async (event) => {
      console.log(event.target.value);
      if (currentArray.length < 1) {
        return;
      }

      const selectZip = currentArray.filter((item) => 
        // const item.name.includes(event.target.value);
        item.zip.includes(event.target.value)
      );
      console.log(selectZip);
      createHtmlList(selectZip);
    });

    // SEARCHING FOR RESTAURANTS
    submit.addEventListener('click', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      console.log('submitted');
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      currentArray = restoArrayMake(storedDataArray);
      updateRestaurants(currentArray);
    });

    // ADDING A RESTAURANT
    addRestoButton.addEventListener('click', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      console.log('adding...');
      const formObj = formToObject(form);
      const postResult = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj)
      });
      const postResultJSON = await postResult.json();
      console.log('return from Post', postResult);
      console.log('return from Post JSON', postResultJSON);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests


//Adding A 2-Column Table for Restaurant name and Ratings of Restaurants

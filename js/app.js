import { fetchData } from "./modules/fetch.js";
import { countFilters } from "./modules/filters.js";
import { observer } from "./modules/animationOnScroll.js";
import { initItems, fetchDrinksFromLocalJSON, paginate } from "./modules/itemListing.js";
import { initMapView } from "./modules/map.js";
import { initCart } from "./modules/cart.js";

document.addEventListener('DOMContentLoaded', initApp);

const drinks = new Array(0);

function initApp() {
    const page = document.documentElement.dataset.page;

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((element) => observer.observe(element));
    
    if (page === "items") {
        loadAllDrinkData();
 
        initItems(drinks);
    } else if (page === "map") {
        initMapView();
    } else if (page === "shopping-cart") {
        initCart();
    }
}
// Main function to load all drink data from different sources
async function loadAllDrinkData() {
    try {
        // Clear the drinks array first
        drinks.length = 0;
        
        // First get local drinks from our catalog 
        const localDrinks = await fetchDrinksFromLocalJSON();
        console.log('Local drinks loaded:', localDrinks.length);
        // Mark local drinks with their source
        localDrinks.forEach(drink => {
            drink.dataSource = 'local';
            drinks.push(drink);
        });
        console.log('Total drinks after local:', drinks.length);
        
        // fetch from the first API (lcbostats)
        await fetchLcboData();
        console.log('Total drinks after LCBO:', drinks.length);
        
        // fetch from the second API (brewery)
        await fetchBreweryData();
        console.log('Total drinks after Brewery:', drinks.length);
        
        // store in session and display
        sessionStorage.setItem('drinks', JSON.stringify(drinks));
        countFilters(drinks);
        
        // Display all drinks on the page
        parseAllDrinks(drinks);
        
        // Initialize pagination after all data is loaded
        paginate(drinks);
        
        console.log('Final drinks array:', drinks.map(d => d.dataSource));
    } catch (error) {
        console.error(`Error loading drink data: ${error.message}`);
    }
}
async function fetchLcboData() {
    const numOfPages = 5;
    try {
        for (let i = 1; i <= numOfPages; i++) {
            const resourceUri = `https://lcbostats.com/api/alcohol?page=${i}`;
            const data = await fetchData(resourceUri);
            console.log(`LCBO page ${i} data:`, data.data.length);
            for (let j = 0; j < data.data.length; j++) {
                data.data[j].dataSource = 'lcbo';
                drinks.push(data.data[j]);
            }
        } 
    } catch (error) {
        console.log(`An error has occurred while fetching the data. ${error.message}`);
    }
}

//fetch the information from the first api and put it in the item-detail page
export function parseLcboItem(drinks) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const itemListing = document.getElementById("item-listing");
    drinks.forEach(drink => {
        const item = createCustomElement(itemListing, 'div', '');
        const drinkImg = createCustomElement(item, 'img', '');
        drinkImg.src = drink.image_url;
        const drinkName = createCustomElement(item, 'a', drink.title);
        drinkName.setAttribute('drink-name-data', drink.id);
        drinkName.addEventListener('click', (event) => {
            //drink value of the drink-name-data attribute
            const drinkId=event.target.getAttribute('drink-name-data');
            //save it in the local storage
            const stringifiedDrinks = JSON.stringify(drinks);
            localStorage.setItem('drinks', stringifiedDrinks);
            //redirect to the item-detail.html page
            window.location.href = `item-detail.html?id=${drink.permanent_id}`;
        });
        const drinkDetail = createCustomElement(item, 'p', `${drink.subcategory} | ${drink.volume}ml | ${drink.country}`);
        const drinkPrice = createCustomElement(item, 'h1', `${USDollar.format(drink.price)}`);
        const cartButton = createCustomElement(item, 'button', 'Add to Cart');
        cartButton.setAttribute('data-drink-id', drink.permanent_id);
        cartButton.addEventListener('click', (event) => {
            const drinkId = event.target.dataset.drinkId;
            let cart = JSON.parse(sessionStorage.getItem("cart"));
            if (cart == null) {
                cart = new Array(0);
            }
            cart.push(drinkId);
            sessionStorage.setItem('cart', JSON.stringify(cart));
        });
    });
}

// Fetch from the brewery api, will not be needed to be parsed in item-detail page later
async function fetchBreweryData() {
    const numOfPages = 5;
    try {
        for (let i = 1; i <= numOfPages; i++) {
            const resourceUri = `https://api.openbrewerydb.org/v1/breweries?page=${i}`;
            const data = await fetchData(resourceUri);
            console.log(`Brewery page ${i} raw data:`, data);
            console.log(`Brewery page ${i} data length:`, data.length);
            
            // Check if data is an array
            if (Array.isArray(data)) {
                data.forEach(brewery => {
                    brewery.dataSource = 'brewery';
                    drinks.push(brewery);
                });
            } else {
                console.error(`Brewery page ${i} data is not an array:`, data);
            }
        }
        console.log('Total brewery drinks after fetching:', drinks.filter(d => d.dataSource === 'brewery').length);
    } catch (error) {
        console.log(`An error has occurred while fetching the data. ${error.message}`);
    }
}

export function parseBreweryItem(drinks) {
    const itemListing = document.getElementById("item-listing");
    drinks.forEach(drink => {
        const item = createCustomElement(itemListing, 'div', '');
        item.classList.add('brewery-item');
        const name = createCustomElement(item, 'h1', drink.name);
        name.classList.add('brewery-name');
        const type = createCustomElement(item, 'p', drink.brewery_type);
        type.classList.add('brewery-type');
        const location = createCustomElement(item, 'p', `${drink.country} | ${drink.city}`);
        location.classList.add('brewery-location');
        const location2 = createCustomElement(item, 'p', `${drink.street} | ${drink.postal_code}`);
        location2.classList.add('brewery-address');
        const phone = createCustomElement(item, 'p', `${drink.phone}`);
        phone.classList.add('brewery-phone');
        name.setAttribute('data-drink-id', drink.id);
        name.addEventListener('click', (event) => {
            const drinkId = event.target.getAttribute('data-drink-id');
            const stringifiedDrinks = JSON.stringify(drinks);
            localStorage.setItem('drinks', stringifiedDrinks);
        });
    });
}
// Parse and display all drinks based on their source and support pagination
export function parseAllDrinks(drinks) {
    const itemListing = document.getElementById("item-listing");
    // Clear existing content
    itemListing.innerHTML = '';
    
    // Process each drink
    drinks.forEach(drink => {
        if (drink.dataSource === 'brewery') {
            parseBreweryItem([drink]);
        } else if (drink.dataSource === 'lcbo' || drink.dataSource === 'local') {
            parseLcboItem([drink]);
        }
    });
}

export function createCustomElement(parent, newElementName, content) {
    const newElem = document.createElement(newElementName);
    newElem.textContent = content;
    parent.appendChild(newElem);
    return newElem;
}
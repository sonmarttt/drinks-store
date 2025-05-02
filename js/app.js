import { fetchData } from "./modules/fetch.js";
import { countFilters } from "./modules/filters.js";
import { observer } from "./modules/animationOnScroll.js";
import { initItems } from "./modules/itemListing.js";
import { initMapView } from "./modules/map.js";

document.addEventListener('DOMContentLoaded', initApp);

const drinks = new Array(0);

function initApp() {
    const page = document.documentElement.dataset.page;

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((element) => observer.observe(element));
    
    if (page === "items") {
        fetchDrinks();
        initItems();
    } else if (page === "map") {
        initMapView();
    }
}


async function fetchDrinks() {
    const numOfPages = 5;
    try {
        for (let i = 1; i <= numOfPages; i++) {
            const resourceUri = `https://lcbostats.com/api/alcohol?page=${i}`;
            const data = await fetchData(resourceUri);
            for (let j = 0; j < data.data.length; j++) {
                drinks.push(data.data[j]);
            }
        } 
        countFilters(drinks);
        parseDrinks(drinks);
        console.log(drinks);
    } catch (error) {
        console.log(`An error has occurred while fetching the data. ${error.message}`);
    }
}

export function parseDrinks(drinks) {
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
        drinkName.href = `item-detail.html?id=${drink.permanent_id}`;
        const drinkDetail = createCustomElement(item, 'p', `${drink.subcategory} | ${drink.volume}ml | ${drink.country}`);
        const drinkPrice = createCustomElement(item, 'h1', `${USDollar.format(drink.price)}`);
        const cartButton = createCustomElement(item, 'button', 'Add to Cart');
    });
}

export function createCustomElement(parent, newElementName, content) {
    const newElem = document.createElement(newElementName);
    newElem.textContent = content;
    parent.appendChild(newElem);
    return newElem;
}
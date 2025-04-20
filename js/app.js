import { fetchData } from "./modules/fetch.js";
import { search } from "./modules/search.js";
import { countFilters, showBrands, showCountries, showTypes } from "./modules/filters.js";
import { observer } from "./modules/animationOnScroll.js";

document.addEventListener('DOMContentLoaded', fetchDrinks);
document.addEventListener('DOMContentLoaded', initApp);

const drinks = new Array(0);

function initApp() {
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((element) => observer.observe(element));
    const countryBtn = document.getElementById("btn-country");
    countryBtn.addEventListener('click', showCountries);
    const brandBtn = document.getElementById("btn-brand");
    brandBtn.addEventListener('click', showBrands);
    const typeBtn = document.getElementById("btn-type");
    typeBtn.addEventListener('click', showTypes);
    const input = document.getElementById("search-bar");
    input.addEventListener('keyup', (e) => {
        if (e.key == "Enter") {
            console.log("You pressed Enter");
            search(input, drinks)
        }
    });
}


async function fetchDrinks() {
    const numOfPages = 5;
    try {
        for (let i = 1; i <= numOfPages; i++) {
            const resourceUri = `https://lcbostats.com/api/alcohol?page=${i}`;
            const data = await fetchData(resourceUri);
            for (let j = 0; j < data.length; j++) {
                drinks.push(data[j]);
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
        const drinkDetail = createCustomElement(item, 'p', `${drink.category} | ${drink.volume}ml | ${drink.country}`);
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
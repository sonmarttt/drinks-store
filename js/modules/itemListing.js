import { search } from "./search.js";
import { showBrands, showCountries, showTypes, showPriceFilter, showDegreeFilter } from "./filters.js";
import { fetchData } from "./fetch.js";
import { createCustomElement } from "../app.js";
import { parseDrinks } from "../app.js";

export let currentPage = 1;

export function initItems(drinks) {
    const countryBtn = document.getElementById("btn-country");
    countryBtn.addEventListener('click', showCountries);
    const brandBtn = document.getElementById("btn-brand");
    brandBtn.addEventListener('click', showBrands);
    const priceBtn = document.getElementById("btn-price");
    priceBtn.addEventListener('click', showPriceFilter);
    const degreeBtn = document.getElementById("btn-degree");
    degreeBtn.addEventListener('click', showDegreeFilter);
    const typeBtn = document.getElementById("btn-type");
    typeBtn.addEventListener('click', showTypes);
    const input = document.getElementById("search-bar");
    input.addEventListener('keyup', (e) => {
        if (e.key == "Enter") {
            console.log("You pressed Enter");
            search(input, drinks)
        }
    });
    fetchDrinksFromLocalJSON();
}

export function paginate(drinks) {
    // Separate drinks by source
    const localDrinks = drinks.filter(drink => drink.dataSource === 'local');
    const lcboDrinks = drinks.filter(drink => drink.dataSource === 'lcbo');
    const breweryDrinks = drinks.filter(drink => drink.dataSource === 'brewery');
    
    console.log('Drinks by source:', {
        local: localDrinks.length,
        lcbo: lcboDrinks.length,
        brewery: breweryDrinks.length
    });

    // Fixed number of pages: 1 for local + 5 for LCBO + 5 for brewery
    const numberOfPages = 11;
    const pageButtonSection = document.getElementById("pages");
    pageButtonSection.innerHTML = "";

    for (let i = 1; i <= numberOfPages; i++ ) {
        const pageButton = createCustomElement(pageButtonSection, 'button', `${i}`);
        pageButton.setAttribute('data-page-number', i);
        pageButton.addEventListener('click', (event) => {
            const pageNumber = event.target.dataset.pageNumber;
            currentPage = pageNumber;
            checkCurrentPage(numberOfPages);
            loadDrinkForPage(pageNumber, localDrinks, lcboDrinks, breweryDrinks);
        });
    }
    
    const previousButton = document.getElementById('previous-button');
    previousButton.disabled = true;
    const nextButton = document.getElementById('next-button');

    loadDrinkForPage(currentPage, localDrinks, lcboDrinks, breweryDrinks);

    previousButton.addEventListener('click', () => {
        currentPage--;
        checkCurrentPage(numberOfPages);
        loadDrinkForPage(currentPage, localDrinks, lcboDrinks, breweryDrinks);
    });
    nextButton.addEventListener('click', () => {
        currentPage++;
        checkCurrentPage(numberOfPages);
        loadDrinkForPage(currentPage, localDrinks, lcboDrinks, breweryDrinks);
    });
}

function loadDrinkForPage(currentPage, localDrinks, lcboDrinks, breweryDrinks) {
    const itemListing = document.getElementById('item-listing');
    itemListing.innerHTML = "";
    
    let drinksToShow;
    
    if (currentPage === 1) {
        // Page 1: Show all local drinks
        drinksToShow = localDrinks;
        console.log('Page 1 - Local drinks:', {
            total: drinksToShow.length,
            firstDrink: drinksToShow[0]?.title || 'No drinks'
        });
    } else if (currentPage >= 2 && currentPage <= 6) {
        // Pages 2-6: Show LCBO drinks
        const startIndex = (currentPage - 2) * 15;
        const endIndex = startIndex + 15;
        drinksToShow = lcboDrinks.slice(startIndex, endIndex);
        console.log(`Page ${currentPage} - LCBO drinks:`, {
            startIndex,
            endIndex,
            total: drinksToShow.length,
            firstDrink: drinksToShow[0]?.title || 'No drinks'
        });
    } else {
        // Pages 7-11: Show brewery drinks
        const startIndex = (currentPage - 7) * 15;
        const endIndex = startIndex + 15;
        drinksToShow = breweryDrinks.slice(startIndex, endIndex);
        console.log(`Page ${currentPage} - Brewery drinks:`, {
            startIndex,
            endIndex,
            total: drinksToShow.length,
            firstDrink: drinksToShow[0]?.name || 'No drinks'
        });
    }
    
    if (drinksToShow.length === 0) {
        console.warn(`No drinks to show for page ${currentPage}`);
        const noDrinksMessage = document.createElement('p');
        noDrinksMessage.textContent = 'No drinks available for this page';
        itemListing.appendChild(noDrinksMessage);
        return;
    }
    
    parseDrinks(drinksToShow);
}

function checkCurrentPage(numberOfPages) {
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    previousButton.disabled = false;
    nextButton.disabled = false;
    if (currentPage == 1) {
        previousButton.disabled = true;
    } else if (currentPage == numberOfPages) {
        nextButton.disabled = true;
    }
}

export async function fetchDrinksFromLocalJSON() {
    const data = await fetchData("../../data/catalog.json");
    const drinks = new Array(0);

    data.products.forEach(product => {
        const category = data.categories.find(category => category.categoryId === product.categoryId);

        const drink = {
            permanent_id: product.permanent_id,
            category: category.categoryName,
            subcategory: product.subcategory,
            title: product.title,
            description: product.description,
            brand: product.brand,
            country: product.country,
            price: product.price,
            volume: product.volume,
            alcohol_content: product.alcohol_content,
            rating: product.rating,
            review: product.review,
            out_of_stock: product.out_of_stock,
            quantityInStock: product.quantityInStock,
            image_url: product.image,
            dataSource: 'local'
        }
        drinks.push(drink);
    });
    return drinks;
}
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
    const numberOfPages = Math.ceil(drinks.length / 15);
    const pageButtonSection = document.getElementById("pages");

    pageButtonSection.innerHTML = "";
    for (let i = 1; i <= numberOfPages; i++ ) {
        const pageButton = createCustomElement(pageButtonSection, 'button', `${i}`);
        pageButton.setAttribute('data-page-number', i);
        pageButton.addEventListener('click', (event) => {
            const pageNumber = event.target.dataset.pageNumber;
            currentPage = pageNumber;
            checkCurrentPage(numberOfPages);
            loadDrinkForPage(pageNumber, drinks);
        });
    }
    
    const previousButton = document.getElementById('previous-button');
    previousButton.disabled = true;
    const nextButton = document.getElementById('next-button');

    loadDrinkForPage(currentPage, drinks);

    previousButton.addEventListener('click', () => {
        currentPage--;
        checkCurrentPage(numberOfPages);
        loadDrinkForPage(currentPage, drinks);
    });
    nextButton.addEventListener('click', () => {
        currentPage++;
        checkCurrentPage(numberOfPages);
        loadDrinkForPage(currentPage, drinks);
    });
}

function loadDrinkForPage(currentPage, drinks) {
    const itemListing = document.getElementById('item-listing');
    const drinksInThisPage = new Array(0);
    for (let i = (currentPage - 1) * 15; i < currentPage * 15; i++) {
        drinksInThisPage.push(drinks[i]);
    }
    itemListing.innerHTML = "";
    parseDrinks(drinksInThisPage);
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
            image_url: product.image
        }
        drinks.push(drink);
    });
    return drinks;
}
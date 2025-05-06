import { search } from "./search.js";
import { showBrands, showCountries, showTypes, showPriceFilter, showDegreeFilter } from "./filters.js";
import { fetchData } from "./fetch.js";

export function initItems() {
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
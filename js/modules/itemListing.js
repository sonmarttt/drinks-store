import { search } from "./search.js";
import { showBrands, showCountries, showTypes, showPriceFilter, showDegreeFilter } from "./filters.js";

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
}
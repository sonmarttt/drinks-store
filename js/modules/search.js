// A module for searching drinks from the list of drinks

import { parseDrinks } from "../app.js";

export function search(input, drinks) {
    const itemListing = document.getElementById("item-listing");
    const searchData = new Array(0);
    const search = input.value;
    drinks.forEach(drink => {
        console.log(drink);
        if (drink.title.toLowerCase().includes(search.toLowerCase()) 
        || (drink.country != null && drink.country.toLowerCase().includes(search.toLowerCase()))
        || (drink.brand != null && drink.brand.toLowerCase().includes(search.toLowerCase()))
        || (drink.category != null && drink.category.toLowerCase().includes(search.toLowerCase()))) {
            searchData.push(drink);
        }
    });
    if (searchData.length != 0) {
        itemListing.innerHTML = "";
        parseDrinks(searchData);
    } else {
        itemListing.innerHTML = "";
        parseDrinks(drinks);
    }
}
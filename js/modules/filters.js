// A module to create the country, brand and type filters

import { createCustomElement } from "../app.js";

class Country {
    constructor(name) {
        this.name = name;
        this.count = 1; 
    }
}

class Brand {
    constructor(name) {
        this.name = name;
        this.count = 1; 
    }
}

class Type {
    constructor(name) {
        this.name = name;
        this.count = 1; 
    }
}


const countries = new Array(0);
const brands = new Array(0);
const types = new Array(0);

export function countFilters(drinks) {
    for (let i = 0; i < drinks.length; i++) {
        if (countries.length == 0) {
            countries.push(new Country(`${drinks[i].country}`));
        } else {
            for (let j = 0; j < countries.length; j++) {
                if (drinks[i].country === countries[j].name) {
                    countries[j].count++;
                    break;
                } else if (j == countries.length - 1) {
                    countries.push(new Country(`${drinks[i].country}`));
                    break;
                }
            }
        }
        if (brands.length == 0) {
            brands.push(new Brand(`${drinks[i].brand}`));
        } else {
            for (let j = 0; j < brands.length; j++) {
                if (drinks[i].brand === brands[j].name) {
                    brands[j].count++;
                    break;
                } else if (j == brands.length - 1) {
                    brands.push(new Brand(`${drinks[i].brand}`));
                    break;
                }
            }
        }
        if (types.length == 0) {
            types.push(new Type(`${drinks[i].subcategory}`));
        } else {
            for (let j = 0; j < types.length; j++) {
                if (drinks[i].subcategory === types[j].name) {
                    types[j].count++;
                    break;
                } else if (j == types.length - 1) {
                    types.push(new Type(`${drinks[i].subcategory}`));
                    break;
                }
            }
        }
    }
    console.log(countries);
    console.log(brands);
    console.log(types);
}

export function showCountries() {
    const countryDiv = document.getElementById("country-filter");
    const countryBtn = document.getElementById("btn-country");
    if (countryDiv.style.display === "none") {
        countryDiv.style.display = "block";
        countryBtn.innerHTML = "Country&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
        if (countryDiv.innerHTML === "") {
            countries.forEach(country => {
                if (country.name != "null") {
                    const countryCb = createCustomElement(countryDiv, 'input', '');
                    countryCb.type = "checkbox";
                    countryCb.name = "country";
                    countryCb.value = `${country.name}`;
                    countryCb.id = `${country.name}`;
                    const countryLabel = createCustomElement(countryDiv, 'label', `${country.name} (${country.count})`);
                    countryLabel.for = `${country.name}`;
                    const lineBreak = createCustomElement(countryDiv, 'br', ''); 
                }
            });
        }
    } else {
        countryBtn.innerHTML = "Country&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        countryDiv.style.display = "none";
    }
}

export function showBrands() {
    const brandDiv = document.getElementById("brand-filter");
    const brandBtn = document.getElementById("btn-brand");
    if (brandDiv.style.display === "none") {
        brandDiv.style.display = "block";
        brandBtn.innerHTML = "Brand&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
        if (brandDiv.innerHTML === "") {
            brands.forEach(brand => {
                if (brand.name != "null" && brand.count > 1) {
                    const brandCb = createCustomElement(brandDiv, 'input', '');
                    brandCb.type = "checkbox";
                    brandCb.name = "country";
                    brandCb.value = `${brand.name}`;
                    brandCb.id = `${brand.name}`;
                    const brandLabel = createCustomElement(brandDiv, 'label', `${brand.name} (${brand.count})`);
                    brandLabel.for = `${brand.name}`;
                    const lineBreak = createCustomElement(brandDiv, 'br', ''); 
                }
            });
        }
    } else {
        brandBtn.innerHTML = "Brand&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        brandDiv.style.display = "none";
    }
}

export function showTypes() {
    const typeDiv = document.getElementById("type-filter");
    const typeBtn = document.getElementById("btn-type");
    if (typeDiv.style.display === "none") {
        typeDiv.style.display = "block";
        typeBtn.innerHTML = "Drink Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
        if (typeDiv.innerHTML === "") {
            types.forEach(type => {
                if (type.name != "null") {
                    const typeCb = createCustomElement(typeDiv, 'input', '');
                    typeCb.type = "checkbox";
                    typeCb.name = "country";
                    typeCb.value = `${type.name}`;
                    typeCb.id = `${type.name}`;
                    const typeLabel = createCustomElement(typeDiv, 'label', `${type.name} (${type.count})`);
                    typeLabel.for = `${type.name}`;
                    const lineBreak = createCustomElement(typeDiv, 'br', ''); 
                }
            });
        }
    } else {
        typeBtn.innerHTML = "Drink Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        typeDiv.style.display = "none";
    }
}
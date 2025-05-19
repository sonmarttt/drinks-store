// A module to create the country, brand and type filters

import { createCustomElement } from "../app.js";
import { paginate } from "./itemListing.js";
import { parseLcboItem, parseAllDrinks } from "../app.js";

export function getFilters() {
    const drinks = JSON.parse(sessionStorage.getItem('drinks'));
    drinks.length = 140;
    const btnApplyFilters = document.getElementById("btn-apply-filter");
    btnApplyFilters.addEventListener('click', () => {
        getPriceRange(drinks);
    });
}

function getPriceRange(drinks) {
    let filteredDrinks = new Array(0);
    const min = document.getElementById('price-control-min-input').value;
    const max = document.getElementById('price-control-max-input').value;
    drinks.forEach(drink => {
        if (drink.price >= min && drink.price <= max) {
            filteredDrinks.push(drink);
        }
    });
    getDegreeRange(filteredDrinks);
}

function getDegreeRange(drinks) {
    let filteredDrinks = new Array(0);
    const min = document.getElementById('degree-control-min-input').value;
    const max = document.getElementById('degree-control-max-input').value;
    drinks.forEach(drink => {
        if (drink.alcohol_content >= min && drink.alcohol_content <= max) {
            filteredDrinks.push(drink);
        }
    });
    getCountries(filteredDrinks);
}

function getCountries(drinks) {
    let filteredDrinks = new Array(0);
    let filteredCountries = new Array(0);
    const allCountries = document.querySelectorAll(".countryCb");
    allCountries.forEach(country => {
        if (country.checked) {
            filteredCountries.push(country.id);
        }
    });
    if (filteredCountries.length != 0) {
        drinks.forEach(drink => {
            filteredCountries.forEach(country => {
                if (drink.country != null && drink.country == country) {
                    filteredDrinks.push(drink);
                }
            });
        });
    } else {
        filteredDrinks.push(...drinks);
    }
    getBrands(filteredDrinks);
}

function getBrands(drinks) {
    let filteredDrinks = new Array(0);
    let filteredBrands = new Array(0);
    const allBrands = document.querySelectorAll(".brandCb");
    allBrands.forEach(brand => {
        if (brand.checked) {
            filteredBrands.push(brand.id);
        }
    });
    if (filteredBrands.length != 0) {
        drinks.forEach(drink => {
            filteredBrands.forEach(brand => {
                if (drink.brand != null && drink.brand == brand) {
                    filteredDrinks.push(drink);
                }
            });
        });
    } else {
        filteredDrinks.push(...drinks);
    }
    getDrinkTypes(filteredDrinks);
}

function getDrinkTypes(drinks) {
    let filteredDrinks = new Array(0);
    let filteredTypes = new Array(0);
    const allTypes = document.querySelectorAll(".typeCb");
    allTypes.forEach(type => {
        if (type.checked) {
            filteredTypes.push(type.id);
        }
    });
    if (filteredTypes.length != 0) {
        drinks.forEach(drink => {
            filteredTypes.forEach(type => {
                if (drink.subcategory != null && drink.subcategory == type) {
                    filteredDrinks.push(drink);
                }
            });
        });
    } else {
        filteredDrinks.push(...drinks);
    }
    console.log(filteredDrinks);
    const itemListing = document.getElementById('item-listing');
    const pageControl = document.getElementById('page-control');
    itemListing.innerHTML = "";
    pageControl.style.display = "none";
    if (filteredDrinks.length == 0) {
        const p = createCustomElement(itemListing, 'p', "No result found");
        p.style.color = "white";
        p.style.textAlign = "center";
    } else if (filteredDrinks.length == 140) {
        pageControl.style.display = "flex";
        const allDrinks = JSON.parse(sessionStorage.getItem('drinks'));
        parseAllDrinks(allDrinks);
        paginate(allDrinks);
    } else {
        parseLcboItem(filteredDrinks);
    }
}

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
    const priceFromSlider = document.querySelector('#min-price');
    const priceToSlider = document.querySelector('#max-price');
    const priceFromInput = document.querySelector('#price-control-min-input');
    const priceToInput = document.querySelector('#price-control-max-input');
    fillSlider(priceFromSlider, priceToSlider, '#C6C6C6', '#25daa5', priceToSlider);
    setToggleAccessible(priceToSlider);
    
    priceFromSlider.oninput = () => controlFromSlider(priceFromSlider, priceToSlider, priceFromInput);
    priceToSlider.oninput = () => controlToSlider(priceFromSlider, priceToSlider, priceToInput);
    priceFromInput.oninput = () => controlFromInput(priceFromSlider, priceFromInput, priceToInput, priceToSlider);
    priceToInput.oninput = () => controlToInput(priceToSlider, priceFromInput, priceToInput, priceToSlider);
    
    const degreeFromSlider = document.querySelector('#min-degree');
    const degreeToSlider = document.querySelector('#max-degree');
    const degreeFromInput = document.querySelector('#degree-control-min-input');
    const degreeToInput = document.querySelector('#degree-control-max-input');
    fillSlider(degreeFromSlider, degreeToSlider, '#C6C6C6', '#25daa5', degreeToSlider);
    setToggleAccessible(degreeToSlider);
    
    degreeFromSlider.oninput = () => controlFromSlider(degreeFromSlider, degreeToSlider, degreeFromInput);
    degreeToSlider.oninput = () => controlToSlider(degreeFromSlider, degreeToSlider, degreeToInput);
    degreeFromInput.oninput = () => controlFromInput(degreeFromSlider, degreeFromInput, degreeToInput, degreeToSlider);
    degreeToInput.oninput = () => controlToInput(degreeToSlider, degreeFromInput, degreeToInput, degreeToSlider);

    for (let i = 0; i < drinks.length; i++) {
        if (countries.length == 0) {
            countries.push(new Country(`${drinks[i].country}`));
        } else {
            for (let j = 0; j < countries.length; j++) {
                if (drinks[i].dataSource != "brewery" && drinks[i].country === countries[j].name) {
                    countries[j].count++;
                    break;
                } else if (drinks[i].dataSource != "brewery" && j == countries.length - 1) {
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

export function showPriceFilter() {
    const priceDiv = document.getElementById("price-filter");
    const priceBtn = document.getElementById("btn-price");
    if (priceDiv.style.display === "none") {
        priceDiv.style.display = "flex";
        priceBtn.innerHTML = "Price&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
    } else {
        priceBtn.innerHTML = "Price&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        priceDiv.style.display = "none";
    }
}

export function showDegreeFilter() {
    const degreeDiv = document.getElementById("degree-filter");
    const degreeBtn = document.getElementById("btn-degree");
    if (degreeDiv.style.display === "none") {
        degreeDiv.style.display = "flex";
        degreeBtn.innerHTML = "Degree of Alcohol&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
    } else {
        degreeBtn.innerHTML = "Degree of Alcohol&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        degreeDiv.style.display = "none";
    }
}

export function showCountries() {
    const countryDiv = document.getElementById("country-filter");
    if (countryDiv.innerHTML === "") {
        countries.forEach(country => {
            if (country.name != "null") {
                const countryCb = createCustomElement(countryDiv, 'input', '');
                countryCb.type = "checkbox";
                countryCb.name = "country";
                countryCb.value = `${country.name}`;
                countryCb.id = `${country.name}`;
                countryCb.classList.add("countryCb");
                const countryLabel = createCustomElement(countryDiv, 'label', `${country.name} (${country.count})`);
                countryLabel.for = `${country.name}`;
                const lineBreak = createCustomElement(countryDiv, 'br', ''); 
            }
        });
    }
    const countryBtn = document.getElementById("btn-country");
    if (countryDiv.style.display === "none") {
        countryDiv.style.display = "block";
        countryBtn.innerHTML = "Country&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
    } else {
        countryBtn.innerHTML = "Country&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        countryDiv.style.display = "none";
    }
}

export function showBrands() {
    const brandDiv = document.getElementById("brand-filter");
    if (brandDiv.innerHTML === "") {
        brands.forEach(brand => {
            if (brand.name != "null" && brand.count > 1) {
                const brandCb = createCustomElement(brandDiv, 'input', '');
                brandCb.type = "checkbox";
                brandCb.name = "country";
                brandCb.value = `${brand.name}`;
                brandCb.id = `${brand.name}`;
                brandCb.classList.add("brandCb");
                const brandLabel = createCustomElement(brandDiv, 'label', `${brand.name} (${brand.count})`);
                brandLabel.for = `${brand.name}`;
                const lineBreak = createCustomElement(brandDiv, 'br', ''); 
            }
        });
    }
    const brandBtn = document.getElementById("btn-brand");
    if (brandDiv.style.display === "none") {
        brandDiv.style.display = "block";
        brandBtn.innerHTML = "Brand&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
    } else {
        brandBtn.innerHTML = "Brand&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        brandDiv.style.display = "none";
    }
}

export function showTypes() {
    const typeDiv = document.getElementById("type-filter");
    if (typeDiv.innerHTML === "") {
        types.forEach(type => {
            if (type.name != "null" && type.count > 1) {
                const typeCb = createCustomElement(typeDiv, 'input', '');
                typeCb.type = "checkbox";
                typeCb.name = "country";
                typeCb.value = `${type.name}`;
                typeCb.id = `${type.name}`;
                typeCb.classList.add("typeCb");
                const typeLabel = createCustomElement(typeDiv, 'label', `${type.name} (${type.count})`);
                typeLabel.for = `${type.name}`;
                const lineBreak = createCustomElement(typeDiv, 'br', ''); 
            }
        });
    }
    const typeBtn = document.getElementById("btn-type");
    if (typeDiv.style.display === "none") {
        typeDiv.style.display = "block";
        typeBtn.innerHTML = "Drink Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-";
    } else {
        typeBtn.innerHTML = "Drink Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+";
        typeDiv.style.display = "none";
    }
}

// Slider Code

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#max-price');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}


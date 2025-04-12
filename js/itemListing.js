document.addEventListener('DOMContentLoaded', fetchDrinks);
document.addEventListener('DOMContentLoaded', initApp);

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

function initApp() {
    const countryBtn = document.getElementById("btn-country");
    countryBtn.addEventListener('click', showCountries);
    const brandBtn = document.getElementById("btn-brand");
    brandBtn.addEventListener('click', showBrands);
    const typeBtn = document.getElementById("btn-type");
    typeBtn.addEventListener('click', showTypes);
}

function showCountries() {
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

function showBrands() {
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

function showTypes() {
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

async function fetchDrinks() {
    const numOfPages = 10;
    try {
        const drinks = new Array(0);
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

function countFilters(drinks) {
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
            types.push(new Type(`${drinks[i].category}`));
        } else {
            for (let j = 0; j < types.length; j++) {
                if (drinks[i].category === types[j].name) {
                    types[j].count++;
                    break;
                } else if (j == types.length - 1) {
                    types.push(new Type(`${drinks[i].category}`));
                    break;
                }
            }
        }
    }
    console.log(countries);
    console.log(brands);
    console.log(types);
}

async function fetchData(resourceUri) {
    try {
        const response = await fetch(resourceUri);
        if (!response.ok) {
            throw new Error(`An error occurred while processing the request ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}

function parseDrinks(drinks) {
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

function createCustomElement(parent, newElementName, content) {
    const newElem = document.createElement(newElementName);
    newElem.textContent = content;
    parent.appendChild(newElem);
    return newElem;
}
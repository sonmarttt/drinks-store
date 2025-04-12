document.addEventListener('DOMContentLoaded', fetchDrinks);

function initApp() {
    
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
        parseDrinks(drinks);
        console.log(drinks);
    } catch (error) {
        console.log(`An error has occurred while fetching the data. ${error.message}`);
    }
}

async function fetchData(resourceUri) {
    try {
        const response = await fetch(resourceUri);
        if (!response.ok) {
            throw new Error(`An error occurred while processing the request ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
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
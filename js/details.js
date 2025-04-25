import { fetchData } from "./modules/fetch.js";
import { observer } from "./modules/animationOnScroll.js";

document.addEventListener('DOMContentLoaded', loadDrinkDetails);

async function loadDrinkDetails() {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("id");
    console.log("Item ID from URL:", itemId);
    if (!itemId) {
        console.error("No drink ID found in URL.");
        return;
    }

    try {
        const drink = await fetchDrinkById(itemId);
        if (!drink) {
            console.error("Drink not found.");
            return;
        }
        parseDrinksInfo(drink);
        parseDrinksDetail(drink);

        // Initialize animations 
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach((element) => observer.observe(element));

        // Add event listener to the Add to Cart button
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', () => addToCart(drink));
        }
    } catch (err) {
        console.error("Failed to load drink:", err);
    }
}

async function fetchDrinkById(id) {
    try {
        const numOfPages = 5;
        let AllDrinks = [];
        for (let i = 1; i <= numOfPages; i++) {
            const resourceUri = `https://lcbostats.com/api/alcohol?page=${i}`;
            const data = await fetchData(resourceUri);
            AllDrinks.push(...data);
        }
        const drink = AllDrinks.find(d => d.permanent_id == id);
        console.log("All drinks loaded:", AllDrinks);

        return drink;
    } catch (error) {
        console.error("Error fetching drink by ID:", error);
        throw error;
    }
}


export function parseDrinksInfo(drink) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
   
    //insert the image in its div
    const drinkImg = document.querySelector(".drink-detail-image");
    if (drinkImg) {
        drinkImg.src = drink.image_url;
    }

    //add drink info in the other div

    const name = document.querySelector(".name");
    if (name) {
        name.textContent = drink.title;
    }

    const data = document.querySelectorAll(".data");
    if (data && data.length > 0) {
        if (data[0]) data[0].textContent = `${drink.category} | ${drink.volume}ml | ${drink.alcohol_content}%`;
        if (data[1]) data[1].textContent = `${drink.country || 'N/A'}`;
        if (data[2]) data[2].textContent = `${drink.brand || 'N/A'}`;
    }


    const rating = document.querySelector(".rating");
    if (rating) {
        rating.textContent = `Rating: ${drink.rating || 'N/A'} | ${drink.reviews || '0'} reviews`;
    }

    const price = document.querySelector(".price");
    if (price) {
        price.textContent = `Price: ${USDollar.format(drink.price)}`;
    }

    const stock = document.querySelector(".stock");
    if (stock) {
        stock.textContent = `Stock: ${drink.out_of_stock|| 'Unknown'} `;
    }
}

export function parseDrinksDetail(drink) {
    const col1 = document.querySelector(".detail-column1");
    const col2 = document.querySelector(".detail-column2");

    col1.innerHTML = '';
    col2.innerHTML = '';

    createDetailElement(col1, "Name", drink.title);
    createDetailElement(col1, "Country", drink.country );
    createDetailElement(col1, "Category", drink.category );
    createDetailElement(col1, "Subcategory", drink.subcategory );
    
  
    createDetailElement(col2, "Permanent ID", drink.permanent_id );
    createDetailElement(col2, "Size", `${drink.volume}ml`);
    createDetailElement(col2, "Alcohol Content", `${drink.alcohol_content}%` );
    createDetailElement(col2, "Description", drink.description );
}


function createDetailElement(parent, label, value) {
    const detailElement = document.createElement('p');
    detailElement.className = 'details';
    detailElement.innerHTML = `${label} <br>${value}`;
    parent.appendChild(detailElement);
}
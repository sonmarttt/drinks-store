import { createCustomElement } from "../app.js";

export function initCart() {
    const drinks = JSON.parse(sessionStorage.getItem('drinks'));
    getCartItems(drinks);

    
}

function getCartItems(drinks) {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    const cartItems = new Array(0);

    drinks.forEach(drink => {
        let quantity = 0;
        cart.forEach(id => {
            if (drink.permanent_id == id) {
                drink.quantity = ++quantity;
            }
        })
        if (quantity > 0) {
            cartItems.push(drink);
        }
    });
    parseCartItems(cartItems);
    calcTotal(cartItems);
    const storeDelivery = document.getElementById('store');
    const homeDelivery = document.getElementById('home');
    storeDelivery.addEventListener('change', () => calcTotal(cartItems));
    homeDelivery.addEventListener('change', () => calcTotal(cartItems));
}

function calcTotal(cartItems) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const productSubtotalTxt = document.getElementById('product-subtotal');
    const taxesTxt = document.getElementById('taxes');
    const totalTxt = document.getElementById('total');
    const storeDelivery = document.getElementById('store');
    const homeDelivery = document.getElementById('home');

    let productSubtotal = 0;
    let taxes = 0;
    let delivery = 0;
    let total = 0;

    cartItems.forEach(item => {
        const productTotal = item.price * item.quantity;
        productSubtotal += productTotal;
    });

    if (storeDelivery.checked) {
        delivery = 4;
    } else if (homeDelivery.checked) {
        delivery = 2;
    }

    const deliveryLabel = document.getElementById('deliveryLabel');
    const storeDeliveryDiv = document.getElementById('storeDelivery');
    const homeDeliveryDiv = document.getElementById('homeDelivery');
    const br1 = document.getElementById('br1');
    const br2 = document.getElementById('br2');
    if (productSubtotal > 70) {
        deliveryLabel.style.display = "none";
        storeDeliveryDiv.style.display = "none";
        homeDeliveryDiv.style.display = "none";
        br1.style.display = "none";
        br2.style.display = "none";
        delivery = 0;
    } else {
        deliveryLabel.style.display = "flex";
        storeDeliveryDiv.style.display = "flex";
        homeDeliveryDiv.style.display = "flex";
        br1.removeAttribute("style");
        br2.removeAttribute("style");
    }

    taxes = productSubtotal * 0.1495;
    total = productSubtotal + taxes + delivery;
    productSubtotalTxt.textContent = `${USDollar.format(productSubtotal)}`;
    taxesTxt.textContent = `${USDollar.format(taxes)}`;
    totalTxt.textContent = `${USDollar.format(total)}`;
}

function parseCartItems(cartItems) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const cartDiv = document.getElementById("cart-items");
    cartItems.forEach(item => {
        const itemContainer = createCustomElement(cartDiv, 'div', '');
        itemContainer.classList.add("drink-container");
        const div1 = createCustomElement(itemContainer, 'div', '');
        div1.classList.add('div1');
        const drinkImage = createCustomElement(div1, 'img', '');
        drinkImage.src = item.image_url;
        const stock = createCustomElement(div1, 'p', `In Stock: ${item.out_of_stock ? "No" : "Yes"} `);
        const priceLabel = createCustomElement(div1, 'p', "Price:");
        const price = createCustomElement(div1, 'p', `${USDollar.format(item.price)}`);

        const div2 = createCustomElement(itemContainer, 'div', '');
        div2.classList.add('div2');

        const div21 = createCustomElement(div2, 'div', '');
        const drinkName = createCustomElement(div21, 'h1', `${item.title}`);
        drinkName.setAttribute('drink-name-data', item.id);
        drinkName.addEventListener('click', (event) => {
            //drink value of the drink-name-data attribute
            const drinkId=event.target.getAttribute('drink-name-data');
            //redirect to the item-detail.html page
            window.location.href = `item-detail.html?id=${item.permanent_id}`;
        });
        const drinkInfo = createCustomElement(div21, 'p', `${item.subcategory} | ${item.volume}ml | ${item.alcohol_content}%`);
        const drinkCountry = createCustomElement(div21, 'p', `${item.country}`);
        const drinkBrand = createCustomElement(div21, 'p', `${item.brand || "N/A"}`);

        const div22 = createCustomElement(div2, 'div', '');
        div22.classList.add('quantity-div');
        const div221 = createCustomElement(div22, 'div', '');
        const minus = createCustomElement(div221, 'p', '-');
        minus.setAttribute('data-drink-id', item.permanent_id);
        minus.addEventListener('click', (event) => {
            const drinkId = event.target.dataset.drinkId;
            const cart = JSON.parse(sessionStorage.getItem('cart'));
            let count = 0;
            let index;
            cart.forEach(item => {
                if (item == drinkId) {
                    index = count;
                }
                count++;
            });
            cart.splice(index, 1);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            cartDiv.innerHTML = "";
            const drinks = JSON.parse(sessionStorage.getItem('drinks'));
            getCartItems(drinks);
        });
        const div2211 = createCustomElement(div221, 'div', '');
        const quantityLabel = createCustomElement(div2211, 'p', 'Quantity');
        const quantity = createCustomElement(div2211, 'p', `${item.quantity}`);
        const plus = createCustomElement(div221, 'p', '+');
        plus.setAttribute('data-drink-id', item.permanent_id);
        plus.addEventListener('click', (event) => {
            const drinkId = event.target.dataset.drinkId;
            const cart = JSON.parse(sessionStorage.getItem('cart'));
            cart.push(drinkId);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            cartDiv.innerHTML = "";
            const drinks = JSON.parse(sessionStorage.getItem('drinks'));
            getCartItems(drinks);
        });
        const trash = createCustomElement(div22, 'i', '');
        trash.classList.add('bi');
        trash.classList.add('bi-trash');
        trash.setAttribute('data-drink-id', item.permanent_id);
        trash.style.color = "rgb(129, 43, 43)";
        trash.style.fontSize = "2rem";
        trash.style.cursor = "pointer";
        trash.addEventListener('mouseover', () => {
            trash.style.color = 'red';
        });
        trash.addEventListener('mouseleave', () => {
            trash.style.color = "rgb(129, 43, 43)";
        });
        trash.addEventListener('click', (event) => {
            const drinkId = event.target.dataset.drinkId;
            const cart = JSON.parse(sessionStorage.getItem('cart'));
            let count = 0
            let indexes = new Array(0);
            cart.forEach(item => {
                if (item == drinkId) {
                    indexes.push(count);
                }
                count++;
            });
            let drinkCount = 0;
            indexes.forEach(index => {
                cart.splice(index - drinkCount, 1);
                drinkCount++;
            });
            sessionStorage.setItem('cart', JSON.stringify(cart));
            cartDiv.innerHTML = "";
            const drinks = JSON.parse(sessionStorage.getItem('drinks'));
            getCartItems(drinks);
        });
    });
}
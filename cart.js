/* =========================================
THE STATIONERY SPOT
CART SYSTEM
========================================= */

/* =========================================
LOAD CART
========================================= */

let cart = [];

try {

const savedCart =
    localStorage.getItem(
        "stationerySpotCart"
    );

cart = savedCart
    ? JSON.parse(savedCart)
    : [];

if (!Array.isArray(cart)) {
    cart = [];
}

} catch (error) {

console.error(
    "Cart load error:",
    error
);

cart = [];

}

/* =========================================
SAVE CART
========================================= */

function saveCart() {

localStorage.setItem(
    "stationerySpotCart",
    JSON.stringify(cart)
);

updateCartCount();

}

/* =========================================
CART COUNT
========================================= */

function updateCartCount() {

const countElement =
    document.getElementById(
        "cartCount"
    );

if (!countElement) {
    return;
}


let totalItems = 0;


cart.forEach(item => {

    totalItems +=
        Number(item.qty) || 0;

});


countElement.innerText =
    totalItems;


if (totalItems > 0) {

    countElement.style.display =
        "flex";

} else {

    countElement.style.display =
        "flex";

}

}

/* =========================================
ADD TO CART
========================================= */

function addToCart(btn, code) {

const card =
    btn.closest(".card");

if (!card) {
    return;
}


const nameElement =
    card.querySelector(".name");

const priceElement =
    card.querySelector(".price");

const qtyElement =
    card.querySelector(".qty");


if (
    !nameElement ||
    !priceElement ||
    !qtyElement
) {
    return;
}


const name =
    nameElement.innerText.trim();


const price =
    Number(
        priceElement.innerText
            .replace(/[^0-9]/g, "")
    );


const qty =
    Number(
        qtyElement.innerText
    );


if (
    !name ||
    !Number.isFinite(price) ||
    !Number.isFinite(qty) ||
    qty < 1
) {
    return;
}


const productCode =
    code || "";


const existingItem =
    cart.find(item =>
        item.code === productCode &&
        item.name === name
    );


if (existingItem) {

    existingItem.qty += qty;

    existingItem.price =
        price;

    existingItem.total =
        price *
        existingItem.qty;

} else {

    cart.push({

        name:
            name,

        code:
            productCode,

        price:
            price,

        qty:
            qty,

        total:
            price * qty

    });

}


saveCart();


/* Reset product quantity */

qtyElement.innerText =
    "1";


/* Open cart */

openCart();


/* Refresh cart */

renderCart();

}

/* =========================================
INCREASE PRODUCT QUANTITY
========================================= */

function increase(btn) {

const qty =
    btn.parentElement
        .querySelector(".qty");


if (!qty) {
    return;
}


let value =
    Number(
        qty.innerText
    );


if (!Number.isFinite(value)) {
    value = 1;
}


qty.innerText =
    value + 1;

}

/* =========================================
DECREASE PRODUCT QUANTITY
========================================= */

function decrease(btn) {

const qty =
    btn.parentElement
        .querySelector(".qty");


if (!qty) {
    return;
}


let value =
    Number(
        qty.innerText
    );


if (!Number.isFinite(value)) {
    value = 1;
}


if (value > 1) {

    qty.innerText =
        value - 1;

}

}

/* =========================================
OPEN CART
========================================= */

function openCart() {

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );

const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );


if (!cartDrawer) {
    return;
}


renderCart();


cartDrawer.classList.add(
    "open"
);


if (cartOverlay) {

    cartOverlay.classList.add(
        "open"
    );

}


document.body.classList.add(
    "cart-open"
);

}

/* =========================================
CLOSE CART
========================================= */

function closeCart() {

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );

const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );


if (cartDrawer) {

    cartDrawer.classList.remove(
        "open"
    );

}


if (cartOverlay) {

    cartOverlay.classList.remove(
        "open"
    );

}


document.body.classList.remove(
    "cart-open"
);

}

/* =========================================
REMOVE ITEM
========================================= */

function removeFromCart(index) {

if (
    index < 0 ||
    index >= cart.length
) {
    return;
}


cart.splice(
    index,
    1
);


saveCart();

renderCart();

}

/* =========================================
CHANGE CART ITEM QUANTITY
========================================= */

function changeCartQuantity(
index,
change
) {

if (
    index < 0 ||
    index >= cart.length
) {
    return;
}


const item =
    cart[index];


let quantity =
    Number(item.qty) || 1;


quantity +=
    Number(change) || 0;


if (quantity <= 0) {

    removeFromCart(index);

    return;

}


item.qty =
    quantity;


const price =
    getItemPrice(item);


item.price =
    price;


item.total =
    price * quantity;


saveCart();

renderCart();

}

/* =========================================
GET ITEM PRICE
Also supports old cart items.
========================================= */

function getItemPrice(item) {

const savedPrice =
    Number(item.price);


if (
    Number.isFinite(
        savedPrice
    ) &&
    savedPrice > 0
) {

    return savedPrice;

}


const qty =
    Number(item.qty) || 1;


const oldTotal =
    Number(item.total);


if (
    Number.isFinite(
        oldTotal
    ) &&
    oldTotal > 0
) {

    return (
        oldTotal /
        qty
    );

}


return 0;

}

/* =========================================
CALCULATE TOTAL
========================================= */

function getCartTotal() {

let total = 0;


cart.forEach(item => {

    const price =
        getItemPrice(item);


    const qty =
        Number(item.qty) || 0;


    total +=
        price * qty;

});


return total;

}

/* =========================================
CALCULATE ITEM COUNT
========================================= */

function getCartItemCount() {

let count = 0;


cart.forEach(item => {

    count +=
        Number(item.qty) || 0;

});


return count;

}

/* =========================================
RENDER CART
========================================= */

function renderCart() {

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartEmpty =
    document.getElementById(
        "cartEmpty"
    );

const cartFooter =
    document.getElementById(
        "cartFooter"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const cartItemCount =
    document.getElementById(
        "cartItemCount"
    );


if (
    !cartItems ||
    !cartEmpty ||
    !cartFooter ||
    !cartTotal
) {
    return;
}


cartItems.innerHTML =
    "";


/* =====================================
   EMPTY CART
===================================== */

if (cart.length === 0) {

    cartEmpty.style.display =
        "flex";

    cartFooter.style.display =
        "none";

    if (cartItemCount) {

        cartItemCount.innerText =
            "0 items";

    }

    return;

}


cartEmpty.style.display =
    "none";


cartFooter.style.display =
    "block";


/* =====================================
   CART ITEMS
===================================== */

cart.forEach(
    (item, index) => {

        const price =
            getItemPrice(item);


        const qty =
            Number(item.qty) || 1;


        const itemTotal =
            price * qty;


        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-item-name">
                    ${escapeCartText(
                        item.name
                    )}
                </div>

                <div class="cart-item-code">
                    ${item.code
                        ? "Code: " +
                          escapeCartText(
                              item.code
                          )
                        : ""
                    }
                </div>

                <div class="cart-item-price">
                    Rs.${price}
                </div>

            </div>


            <div class="cart-item-actions">

                <div class="cart-quantity">

                    <button
                        type="button"
                        aria-label="Decrease quantity"
                        onclick="
                            changeCartQuantity(
                                ${index},
                                -1
                            )
                        "
                    >
                        −
                    </button>


                    <span>
                        ${qty}
                    </span>


                    <button
                        type="button"
                        aria-label="Increase quantity"
                        onclick="
                            changeCartQuantity(
                                ${index},
                                1
                            )
                        "
                    >
                        +
                    </button>

                </div>


                <strong class="cart-item-total">
                    Rs.${itemTotal}
                </strong>


                <button
                    type="button"
                    class="cart-remove"
                    aria-label="Remove item"
                    onclick="
                        removeFromCart(
                            ${index}
                        )
                    "
                >
                    ×
                </button>

            </div>

        `;


        cartItems.appendChild(
            itemElement
        );

    }
);


/* =====================================
   TOTAL
===================================== */

const total =
    getCartTotal();


cartTotal.innerText =
    "Rs." + total;


if (cartItemCount) {

    const count =
        getCartItemCount();


    cartItemCount.innerText =
        count +
        (
            count === 1
                ? " item"
                : " items"
        );

}

}

/* =========================================
CLEAR CART
========================================= */

function clearCart() {

if (
    cart.length === 0
) {
    return;
}


const confirmed =
    confirm(
        "Are you sure you want to clear your cart?"
    );


if (!confirmed) {
    return;
}


cart = [];


saveCart();

renderCart();

}

/* =========================================
WHATSAPP ORDER
========================================= */

function sendWhatsAppOrder() {

if (
    cart.length === 0
) {

    alert(
        "Your cart is empty!"
    );

    return;

}


let message =
    "🛒 *THE STATIONERY SPOT ORDER*%0A%0A";


let total = 0;


cart.forEach(
    (item, index) => {

        const price =
            getItemPrice(item);


        const qty =
            Number(item.qty) || 0;


        const itemTotal =
            price * qty;


        message +=
            `${index + 1}. ` +
            `${item.name}`;


        if (item.code) {

            message +=
                ` (${item.code})`;

        }


        message +=
            ` x ${qty}` +
            ` = Rs.${itemTotal}` +
            "%0A";


        total +=
            itemTotal;

    }
);


message +=
    "%0A💰 *TOTAL: Rs." +
    total +
    "*";


const whatsappURL =
    "https://wa.me/923271576380?text=" +
    message;


window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
);

}

/* =========================================
ESCAPE TEXT
========================================= */

function escapeCartText(value) {

return String(value || "")
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}

/* =========================================
INITIALIZE CART
========================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    updateCartCount();

    renderCart();

}

);

/* =========================================
ESC KEY CLOSE
========================================= */

document.addEventListener(
"keydown",
event => {

    if (
        event.key === "Escape"
    ) {

        closeCart();

    }

}

);
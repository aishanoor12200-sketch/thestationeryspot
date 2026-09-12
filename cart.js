/* =========================================
   SHARED CART SYSTEM
========================================= */

let cart = [];


/* =========================================
   ADD TO CART
========================================= */

function addToCart(btn, code) {

    const card = btn.closest(".card");

    if (!card) return;

    const nameElement = card.querySelector(".name");
    const priceElement = card.querySelector(".price");
    const qtyElement = card.querySelector(".qty");

    if (!nameElement || !priceElement || !qtyElement) {
        return;
    }

    const name = nameElement.innerText.trim();

    const price = Number(
        priceElement.innerText.replace(/[^0-9]/g, "")
    );

    const qty = Number(qtyElement.innerText);

    if (
        !name ||
        !Number.isFinite(price) ||
        !Number.isFinite(qty) ||
        qty < 1
    ) {
        return;
    }

    cart.push({
        name: name,
        code: code || "",
        qty: qty,
        total: price * qty
    });

    showOrderBox();

    alert("Added: " + name);
}


/* =========================================
   QUANTITY + 
========================================= */

function increase(btn) {

    const qty = btn.parentElement.querySelector(".qty");

    if (!qty) return;

    let value = Number(qty.innerText);

    if (!Number.isFinite(value)) {
        value = 1;
    }

    qty.innerText = value + 1;
}


/* =========================================
   QUANTITY -
========================================= */

function decrease(btn) {

    const qty = btn.parentElement.querySelector(".qty");

    if (!qty) return;

    let value = Number(qty.innerText);

    if (!Number.isFinite(value)) {
        value = 1;
    }

    if (value > 1) {
        qty.innerText = value - 1;
    }
}


/* =========================================
   WHATSAPP ORDER
========================================= */

function sendWhatsAppOrder() {

    if (cart.length === 0) {

        alert("Cart empty!");

        return;
    }

    let msg = "🛒 ORDER:\n\n";

    let total = 0;

    cart.forEach(item => {

        msg +=
            item.name +
            " (" +
            item.code +
            ") x " +
            item.qty +
            " = Rs." +
            item.total +
            "\n";

        total += item.total;
    });

    msg += "\nTOTAL: Rs." + total;

    const whatsappURL =
        "https://wa.me/923271576380?text=" +
        encodeURIComponent(msg);

    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================
   SHOW ORDER BUTTON
========================================= */

function showOrderBox() {

    const floatBtn =
        document.getElementById("floatingBtn");

    if (!floatBtn) return;

    floatBtn.style.display = "block";

    clearTimeout(window.orderBoxTimer);

    window.orderBoxTimer = setTimeout(() => {

        floatBtn.style.display = "none";

    }, 10000);
      }

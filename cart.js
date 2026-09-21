(() => {
    const CART_KEY = "stationerySpotCart";
    let cart = [];

    try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        cart = Array.isArray(saved) ? saved.filter(item => item && item.name) : [];
    } catch (error) {
        console.warn("Cart could not be restored:", error);
    }

    function saveCart() {
        try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
        catch (error) { console.warn("Cart could not be saved:", error); }
        updateCartCount();
    }

    function getCartItemCount() {
        return cart.reduce((total, item) => total + Math.max(0, Number(item.qty) || 0), 0);
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + Math.max(0, Number(item.price) || 0) * Math.max(0, Number(item.qty) || 0), 0);
    }

    function updateCartCount() {
        document.querySelectorAll("#cartCount").forEach(element => {
            element.textContent = String(getCartItemCount());
        });
    }

    function ensureCartMarkup() {
        if (document.getElementById("cartDrawer")) return;
        document.body.insertAdjacentHTML("beforeend", `
            <div id="cartOverlay" class="cart-overlay" aria-hidden="true"></div>
            <aside id="cartDrawer" class="cart-drawer" aria-label="Shopping cart" aria-hidden="true">
                <div class="cart-header"><div><h2>🛒 My Cart</h2><span id="cartItemCount" class="cart-item-count">0 items</span></div><button type="button" class="cart-close" aria-label="Close cart">×</button></div>
                <div id="cartEmpty" class="cart-empty"><div class="cart-empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add some cute stationery to your cart! 💕</p><button type="button" class="cart-continue">Continue Shopping</button></div>
                <div id="cartItems" class="cart-items"></div>
                <div id="cartFooter" class="cart-footer"><div class="cart-total-row"><span>Total</span><strong id="cartTotal">Rs.0</strong></div><button type="button" class="cart-whatsapp-btn">💬 Order on WhatsApp</button><button type="button" class="cart-clear-btn">Clear Cart</button></div>
            </aside>
        `);
        document.getElementById("cartOverlay").addEventListener("click", closeCart);
        document.querySelector(".cart-close").addEventListener("click", closeCart);
        document.querySelector(".cart-continue").addEventListener("click", closeCart);
        document.querySelector(".cart-whatsapp-btn").addEventListener("click", sendWhatsAppOrder);
        document.querySelector(".cart-clear-btn").addEventListener("click", clearCart);
    }

    function addToCart(button, code = "") {
        const card = button?.closest?.(".card");
        if (!card) return;
        const host = card.closest("product-card");
        const name = card.querySelector(".name")?.textContent.trim();
        const price = Number((card.querySelector(".price")?.textContent || "").replace(/[^0-9.]/g, ""));
        const qtyElement = card.querySelector(".qty");
        const qty = Math.max(1, Number(qtyElement?.textContent) || 1);
        if (!name || !Number.isFinite(price)) return;
        const productCode = String(code || host?.getAttribute("code") || "");
        const image = host?.getAttribute("image") || card.querySelector("img")?.getAttribute("src") || "";
        const existing = cart.find(item => item.code === productCode && item.image === image);
        if (existing) existing.qty = (Number(existing.qty) || 0) + qty;
        else cart.push({ name, code: productCode, image, price, qty });
        if (qtyElement) qtyElement.textContent = "1";
        saveCart();
        openCart();
    }

    function increase(button) { const element = button?.parentElement?.querySelector(".qty"); if (element) element.textContent = String((Number(element.textContent) || 1) + 1); }
    function decrease(button) { const element = button?.parentElement?.querySelector(".qty"); if (element) element.textContent = String(Math.max(1, (Number(element.textContent) || 1) - 1)); }

    function openCart() { ensureCartMarkup(); renderCart(); const drawer = document.getElementById("cartDrawer"); drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.getElementById("cartOverlay").classList.add("open"); document.body.classList.add("cart-open"); }
    function closeCart() { const drawer = document.getElementById("cartDrawer"); if (!drawer) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.getElementById("cartOverlay")?.classList.remove("open"); document.body.classList.remove("cart-open"); }
    function removeFromCart(index) { if (cart[index]) { cart.splice(index, 1); saveCart(); renderCart(); } }
    function changeCartQuantity(index, change) { if (!cart[index]) return; cart[index].qty = (Number(cart[index].qty) || 1) + Number(change || 0); if (cart[index].qty <= 0) removeFromCart(index); else { saveCart(); renderCart(); } }
    function escapeText(value) { const element = document.createElement("span"); element.textContent = value ?? ""; return element.innerHTML; }

    function renderCart() {
        ensureCartMarkup();
        const items = document.getElementById("cartItems");
        const empty = document.getElementById("cartEmpty");
        const footer = document.getElementById("cartFooter");
        const count = document.getElementById("cartItemCount");
        const total = document.getElementById("cartTotal");
        const itemCount = getCartItemCount();
        items.replaceChildren();
        empty.style.display = cart.length ? "none" : "flex";
        footer.style.display = cart.length ? "block" : "none";
        count.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
        total.textContent = `Rs.${getCartTotal()}`;
        cart.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `<div class="cart-item-info"><div class="cart-item-name">${escapeText(item.name)}</div><div class="cart-item-code">${item.code ? `Code: ${escapeText(item.code)}` : ""}</div><div class="cart-item-price">Rs.${Number(item.price) || 0}</div></div><div class="cart-item-controls"><button type="button" aria-label="Decrease quantity">−</button><span>${Number(item.qty) || 0}</span><button type="button" aria-label="Increase quantity">+</button><button type="button" aria-label="Remove ${escapeText(item.name)}">×</button></div>`;
            const buttons = row.querySelectorAll("button");
            buttons[0].addEventListener("click", () => changeCartQuantity(index, -1));
            buttons[1].addEventListener("click", () => changeCartQuantity(index, 1));
            buttons[2].addEventListener("click", () => removeFromCart(index));
            items.appendChild(row);
        });
        updateCartCount();
    }

    function clearCart() { if (cart.length && window.confirm("Are you sure you want to clear your cart?")) { cart = []; saveCart(); renderCart(); } }
    function sendWhatsAppOrder() {
        if (!cart.length) { window.alert("Your cart is empty!"); return; }
        const lines = cart.map((item, index) => `${index + 1}. ${item.name}${item.code ? ` (${item.code})` : ""} x ${item.qty} = Rs.${(Number(item.price) || 0) * (Number(item.qty) || 0)}`);
        const message = `Hello, I would like to order:\n${lines.join("\n")}\n\nTotal: Rs.${getCartTotal()}`;
        window.open(`https://wa.me/923271576380?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }

    Object.assign(window, { addToCart, increase, decrease, openCart, closeCart, removeFromCart, changeCartQuantity, clearCart, sendWhatsAppOrder, renderCart });
    document.addEventListener("DOMContentLoaded", () => { ensureCartMarkup(); renderCart(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
})();

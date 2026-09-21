let cart = [];
try {
    const saved = localStorage.getItem("stationerySpotCart");
    const parsed = saved ? JSON.parse(saved) : [];
    cart = Array.isArray(parsed) ? parsed.filter(item => item && item.name) : [];
} catch (error) {
    console.warn("Cart could not be restored:", error);
}

function saveCart() {
    try { localStorage.setItem("stationerySpotCart", JSON.stringify(cart)); } catch (error) { console.warn("Cart could not be saved:", error); }
    updateCartCount();
}
function updateCartCount() {
    const element = document.getElementById("cartCount");
    if (element) element.textContent = String(getCartItemCount());
}
function addToCart(button, code = "") {
    const card = button && button.closest ? button.closest(".card") : null;
    if (!card) return;
    const name = card.querySelector(".name")?.textContent.trim();
    const price = Number((card.querySelector(".price")?.textContent || "").replace(/[^0-9.]/g, ""));
    const qtyElement = card.querySelector(".qty");
    const qty = Number(qtyElement?.textContent) || 1;
    if (!name || !Number.isFinite(price) || price < 0 || qty < 1) return;

    const productCode = String(code || card.closest("product-card")?.getAttribute("code") || "");
    const image = card.closest("product-card")?.getAttribute("image") || "";
    const existing = cart.find(item => item.code === productCode && item.name === name && item.image === image);
    if (existing) existing.qty = (Number(existing.qty) || 0) + qty;
    else cart.push({ name, code: productCode, image, price, qty });

    if (qtyElement) qtyElement.textContent = "1";
    saveCart();
    if (typeof window.openCart === "function") window.openCart();
}
function increase(button) { const el = button?.parentElement?.querySelector(".qty"); if (el) el.textContent = String(Math.max(1, Number(el.textContent) || 1) + 1); }
function decrease(button) { const el = button?.parentElement?.querySelector(".qty"); if (el) el.textContent = String(Math.max(1, (Number(el.textContent) || 1) - 1)); }
function getItemPrice(item) { const price = Number(item.price); return Number.isFinite(price) && price >= 0 ? price : 0; }
function getCartItemCount() { return cart.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0); }
function getCartTotal() { return cart.reduce((sum, item) => sum + getItemPrice(item) * (Number(item.qty) || 0), 0); }
function openCart() { const drawer = document.getElementById("cartDrawer"); if (!drawer) return; renderCart(); drawer.classList.add("open"); document.getElementById("cartOverlay")?.classList.add("open"); document.body.classList.add("cart-open"); }
function closeCart() { document.getElementById("cartDrawer")?.classList.remove("open"); document.getElementById("cartOverlay")?.classList.remove("open"); document.body.classList.remove("cart-open"); }
function removeFromCart(index) { if (Number.isInteger(index) && index >= 0 && index < cart.length) { cart.splice(index, 1); saveCart(); renderCart(); } }
function changeCartQuantity(index, change) { const item = cart[index]; if (!item) return; item.qty = (Number(item.qty) || 1) + (Number(change) || 0); if (item.qty <= 0) return removeFromCart(index); saveCart(); renderCart(); }
function escapeCartText(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char])); }
function renderCart() {
    const items = document.getElementById("cartItems"), empty = document.getElementById("cartEmpty"), footer = document.getElementById("cartFooter"), total = document.getElementById("cartTotal"), count = document.getElementById("cartItemCount");
    if (!items || !empty || !footer || !total) return;
    items.replaceChildren();
    const isEmpty = cart.length === 0;
    empty.style.display = isEmpty ? "flex" : "none"; footer.style.display = isEmpty ? "none" : "block";
    if (count) count.textContent = `${getCartItemCount()} ${getCartItemCount() === 1 ? "item" : "items"}`;
    cart.forEach((item, index) => {
        const row = document.createElement("div"); row.className = "cart-item";
        row.innerHTML = `<div class="cart-item-info"><div class="cart-item-name">${escapeCartText(item.name)}</div><div class="cart-item-code">${item.code ? `Code: ${escapeCartText(item.code)}` : ""}</div><div class="cart-item-price">Rs.${getItemPrice(item)}</div></div><div class="cart-item-actions"><div class="cart-quantity"><button type="button" aria-label="Decrease quantity">−</button><span>${Number(item.qty) || 1}</span><button type="button" aria-label="Increase quantity">+</button></div><strong class="cart-item-total">Rs.${getItemPrice(item) * (Number(item.qty) || 0)}</strong><button type="button" class="cart-remove" aria-label="Remove item">×</button></div>`;
        const buttons = row.querySelectorAll("button"); buttons[0].addEventListener("click", () => changeCartQuantity(index, -1)); buttons[1].addEventListener("click", () => changeCartQuantity(index, 1)); buttons[2].addEventListener("click", () => removeFromCart(index)); items.appendChild(row);
    });
    total.textContent = `Rs.${getCartTotal()}`;
}
function clearCart() { if (cart.length && confirm("Are you sure you want to clear your cart?")) { cart = []; saveCart(); renderCart(); } }
function sendWhatsAppOrder() { if (!cart.length) return alert("Your cart is empty!"); const lines = cart.map((item, index) => `${index + 1}. ${item.name}${item.code ? ` (${item.code})` : ""} x ${item.qty} = Rs.${getItemPrice(item) * item.qty}`); const message = ["🛒 THE STATIONERY SPOT ORDER", "", ...lines, "", `💰 TOTAL: Rs.${getCartTotal()}`].join("\n"); window.open(`https://wa.me/923271576380?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }
Object.assign(window, { addToCart, increase, decrease, openCart, closeCart, removeFromCart, changeCartQuantity, clearCart, sendWhatsAppOrder });
document.addEventListener("DOMContentLoaded", () => { updateCartCount(); renderCart(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

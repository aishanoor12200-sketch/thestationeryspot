(() => {
  const CART_KEY = "stationerySpotCart";
  let cart = [];
  const text = value => String(value ?? "").trim();
  const itemIdentity = item => text(item.identity || [item.code, item.name, item.price, item.image].map(text).join("|"));
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart = Array.isArray(saved) ? saved.filter(item => item && text(item.name)).map(item => ({ ...item, identity: itemIdentity(item), qty: Math.max(1, Number(item.qty) || 1), price: Math.max(0, Number(item.price) || 0) })) : [];
  } catch (error) { console.warn("Cart could not be restored:", error); }
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (error) { console.warn("Cart could not be saved:", error); } updateCartCount(); }
  function count() { return cart.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0); }
  function total() { return cart.reduce((sum, item) => sum + Math.max(0, Number(item.price) || 0) * Math.max(0, Number(item.qty) || 0), 0); }
  function updateCartCount() { document.querySelectorAll("#cartCount").forEach(element => { element.textContent = String(count()); }); }
  function ensureMarkup() {
    if (document.getElementById("cartDrawer")) return;
    document.body.insertAdjacentHTML("beforeend", '<div id="cartOverlay" class="cart-overlay" aria-hidden="true"></div><aside id="cartDrawer" class="cart-drawer" aria-label="Shopping cart" aria-hidden="true"><div class="cart-header"><div><h2>🛒 My Cart</h2><span id="cartItemCount">0 items</span></div><button type="button" class="cart-close" aria-label="Close cart">×</button></div><div id="cartEmpty" class="cart-empty"><div>🛒</div><h3>Your cart is empty</h3><p>Add some cute stationery to your cart! 💕</p><button type="button" class="cart-continue">Continue Shopping</button></div><div id="cartItems" class="cart-items"></div><div id="cartFooter" class="cart-footer"><div class="cart-total-row"><span>Total</span><strong id="cartTotal">Rs.0</strong></div><button type="button" class="cart-whatsapp-btn">💬 Order on WhatsApp</button><button type="button" class="cart-clear-btn">Clear Cart</button></div></aside>');
    document.getElementById("cartOverlay").addEventListener("click", closeCart); document.querySelector(".cart-close").addEventListener("click", closeCart); document.querySelector(".cart-continue").addEventListener("click", closeCart); document.querySelector(".cart-whatsapp-btn").addEventListener("click", sendWhatsAppOrder); document.querySelector(".cart-clear-btn").addEventListener("click", clearCart);
  }
  function addToCart(button) {
    const card = button?.closest?.(".card"); if (!card) return;
    const host = card.closest("product-card"); const name = text(card.querySelector(".name")?.textContent); const price = Math.max(0, Number((card.querySelector(".price")?.textContent || "").replace(/[^0-9.]/g, "")) || 0); const quantityElement = card.querySelector(".qty"); const qty = Math.max(1, Number(quantityElement?.textContent) || 1); if (!name) return;
    const code = text(host?.getAttribute("code")); const image = text(host?.getAttribute("image")); const identity = text(host?.getAttribute("identity") || host?.dataset.identity || [code, name, price, image].join("|")); const existing = cart.find(item => itemIdentity(item) === identity);
    if (existing) existing.qty = Math.max(1, Number(existing.qty) || 0) + qty; else cart.push({ identity, name, code, image, price, qty });
    if (quantityElement) quantityElement.textContent = "1"; saveCart(); openCart();
  }
  function increase(button) { const element = button?.parentElement?.querySelector(".qty"); if (element) element.textContent = String(Math.max(1, Number(element.textContent) || 1) + 1); }
  function decrease(button) { const element = button?.parentElement?.querySelector(".qty"); if (element) element.textContent = String(Math.max(1, (Number(element.textContent) || 1) - 1)); }
  function openCart() { ensureMarkup(); renderCart(); document.getElementById("cartDrawer").classList.add("open"); document.getElementById("cartDrawer").setAttribute("aria-hidden", "false"); document.getElementById("cartOverlay").classList.add("open"); document.body.classList.add("cart-open"); }
  function closeCart() { const drawer = document.getElementById("cartDrawer"); if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); } document.getElementById("cartOverlay")?.classList.remove("open"); document.body.classList.remove("cart-open"); }
  function removeFromCart(index) { if (cart[index]) { cart.splice(index, 1); saveCart(); renderCart(); } }
  function changeCartQuantity(index, delta) { if (!cart[index]) return; cart[index].qty = (Number(cart[index].qty) || 1) + Number(delta || 0); if (cart[index].qty <= 0) return removeFromCart(index); saveCart(); renderCart(); }
  function escapeText(value) { const element = document.createElement("span"); element.textContent = value ?? ""; return element.innerHTML; }
  function renderCart() { ensureMarkup(); const items = document.getElementById("cartItems"); const empty = document.getElementById("cartEmpty"); const footer = document.getElementById("cartFooter"); const itemCount = count(); items.replaceChildren(); empty.style.display = cart.length ? "none" : "flex"; footer.style.display = cart.length ? "block" : "none"; document.getElementById("cartItemCount").textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`; document.getElementById("cartTotal").textContent = `Rs.${total()}`;
    cart.forEach((item, index) => { const row = document.createElement("div"); row.className = "cart-item"; row.innerHTML = `<div class="cart-item-info"><div class="cart-item-name">${escapeText(item.name)}</div><div class="cart-item-code">${item.code ? `Code: ${escapeText(item.code)}` : ""}</div><div class="cart-item-price">Rs.${Number(item.price) || 0}</div></div><div class="cart-item-controls"><button type="button" aria-label="Decrease quantity">−</button><span>${Number(item.qty) || 0}</span><button type="button" aria-label="Increase quantity">+</button><button type="button" aria-label="Remove item">×</button></div>`; const buttons = row.querySelectorAll("button"); buttons[0].addEventListener("click", () => changeCartQuantity(index, -1)); buttons[1].addEventListener("click", () => changeCartQuantity(index, 1)); buttons[2].addEventListener("click", () => removeFromCart(index)); items.appendChild(row); }); updateCartCount(); }
  function clearCart() { if (cart.length && window.confirm("Are you sure you want to clear your cart?")) { cart = []; saveCart(); renderCart(); } }
  function sendWhatsAppOrder() { if (!cart.length) { window.alert("Your cart is empty!"); return; } const lines = cart.map((item, index) => `${index + 1}. ${item.name}${item.code ? ` (${item.code})` : ""} x ${item.qty} = Rs.${(Number(item.price) || 0) * (Number(item.qty) || 0)}`); window.open(`https://wa.me/923271576380?text=${encodeURIComponent(`Hello, I would like to order:\n${lines.join("\n")}\n\nTotal: Rs.${total()}`)}`, "_blank", "noopener,noreferrer"); }
  Object.assign(window, { addToCart, increase, decrease, openCart, closeCart, removeFromCart, changeCartQuantity, clearCart, sendWhatsAppOrder, renderCart });
  document.addEventListener("DOMContentLoaded", () => { ensureMarkup(); renderCart(); }); document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
})();

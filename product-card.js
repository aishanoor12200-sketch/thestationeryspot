class ProductCard extends HTMLElement {
    connectedCallback() {
        const image = String(this.getAttribute("image") || "").replace(/^\/+/, "");
        const name = this.getAttribute("name") || "Product";
        const price = this.getAttribute("price") || "0";
        const code = this.getAttribute("code") || "";
        const card = document.createElement("div");
        card.className = "card";
        const imgBox = document.createElement("div");
        imgBox.className = "img-box";
        const img = document.createElement("img");
        img.src = new URL(image, document.baseURI).href;
        img.alt = name;
        img.loading = "lazy";
        img.addEventListener("error", () => { imgBox.classList.add("image-missing"); img.alt = `${name} image unavailable`; });
        img.addEventListener("click", () => {
            if (typeof window.openImage === "function") window.openImage(img.src);
            else {
                const popup = document.createElement("div"); popup.className = "popup"; popup.style.display = "flex"; popup.setAttribute("role", "dialog"); popup.innerHTML = `<img src="${img.src}" alt="${name}">`; popup.addEventListener("click", () => popup.remove()); document.body.appendChild(popup);
            }
        });
        const cartIcon = document.createElement("button");
        cartIcon.className = "floating-icon"; cartIcon.type = "button"; cartIcon.textContent = "🛒"; cartIcon.setAttribute("aria-label", `Add ${name} to cart`); cartIcon.addEventListener("click", () => window.addToCart(cartIcon, code));
        imgBox.append(img, cartIcon);
        const nameElement = document.createElement("p"); nameElement.className = "name"; nameElement.textContent = name;
        const priceElement = document.createElement("p"); priceElement.className = "price"; priceElement.textContent = `Rs.${price}`;
        const qtyBox = document.createElement("div"); qtyBox.className = "qty-box";
        const decreaseBtn = document.createElement("button"); decreaseBtn.type = "button"; decreaseBtn.textContent = "−"; decreaseBtn.setAttribute("aria-label", `Decrease ${name} quantity`); decreaseBtn.addEventListener("click", () => window.decrease(decreaseBtn));
        const qty = document.createElement("span"); qty.className = "qty"; qty.textContent = "1";
        const increaseBtn = document.createElement("button"); increaseBtn.type = "button"; increaseBtn.textContent = "+"; increaseBtn.setAttribute("aria-label", `Increase ${name} quantity`); increaseBtn.addEventListener("click", () => window.increase(increaseBtn));
        qtyBox.append(decreaseBtn, qty, increaseBtn);
        const addButton = document.createElement("button"); addButton.className = "add-btn"; addButton.type = "button"; addButton.textContent = "Add to Cart"; addButton.addEventListener("click", () => window.addToCart(addButton, code));
        card.append(imgBox, nameElement, priceElement, qtyBox, addButton); this.replaceChildren(card);
    }
}
if (!customElements.get("product-card")) customElements.define("product-card", ProductCard);

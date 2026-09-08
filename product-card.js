class ProductCard extends HTMLElement {

    connectedCallback() {

        const image = this.getAttribute("image") || "";
        const name = this.getAttribute("name") || "Product";
        const price = this.getAttribute("price") || "0";
        const code = this.getAttribute("code") || "";

        const card = document.createElement("div");
        card.className = "card";

        const imgBox = document.createElement("div");
        imgBox.className = "img-box";

        const img = document.createElement("img");
        img.src = image;
        img.alt = name;
        img.loading = "lazy";
        img.width = 150;
        img.height = 200;

        img.addEventListener("click", () => {
            openImage(img.src);
        });

        const cartIcon = document.createElement("button");
        cartIcon.className = "floating-icon";
        cartIcon.type = "button";
        cartIcon.textContent = "🛒";
        cartIcon.setAttribute("aria-label", `Add ${name} to cart`);

        cartIcon.addEventListener("click", () => {
            addToCart(cartIcon, code);
        });

        imgBox.appendChild(img);
        imgBox.appendChild(cartIcon);

        const nameElement = document.createElement("p");
        nameElement.className = "name";
        nameElement.textContent = name;

        const priceElement = document.createElement("p");
        priceElement.className = "price";
        priceElement.textContent = `Rs.${price}`;

        const qtyBox = document.createElement("div");
        qtyBox.className = "qty-box";

        const decreaseBtn = document.createElement("button");
        decreaseBtn.type = "button";
        decreaseBtn.textContent = "−";

        decreaseBtn.addEventListener("click", () => {
            decrease(decreaseBtn);
        });

        const qty = document.createElement("span");
        qty.className = "qty";
        qty.textContent = "1";

        const increaseBtn = document.createElement("button");
        increaseBtn.type = "button";
        increaseBtn.textContent = "+";

        increaseBtn.addEventListener("click", () => {
            increase(increaseBtn);
        });

        qtyBox.appendChild(decreaseBtn);
        qtyBox.appendChild(qty);
        qtyBox.appendChild(increaseBtn);

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.type = "button";
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", () => {
            addToCart(addButton, code);
        });

        card.appendChild(imgBox);
        card.appendChild(nameElement);
        card.appendChild(priceElement);
        card.appendChild(qtyBox);
        card.appendChild(addButton);

        this.replaceChildren(card);
    }
}

customElements.define("product-card", ProductCard);

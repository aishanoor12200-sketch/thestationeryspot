document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return;
    fetch(new URL("data/products.json", document.baseURI), { cache: "no-store" })
        .then(response => { if (!response.ok) throw new Error(`Products file could not be loaded: ${response.status}`); return response.json(); })
        .then(products => {
            if (!Array.isArray(products)) throw new Error("products.json must contain an array.");
            productContainer.replaceChildren();
            const categories = new Map();
            products.filter(product => product && product.available !== false && product.category && product.name && product.image).forEach(product => {
                if (!categories.has(product.category)) categories.set(product.category, []);
                categories.get(product.category).push(product);
            });
            categories.forEach((items, categoryName) => {
                const section = document.createElement("section"); section.className = "category";
                const heading = document.createElement("h2"); heading.textContent = categoryName;
                const grid = document.createElement("div"); grid.className = "products";
                items.forEach((product, index) => {
                    const card = document.createElement("product-card");
                    ["image", "name", "price", "code"].forEach(attribute => card.setAttribute(attribute, product[attribute] ?? ""));
                    if (index >= 4 && location.pathname.endsWith("index.html")) card.classList.add("extra-product");
                    grid.appendChild(card);
                });
                section.append(heading, grid);
                if (items.length > 4 && location.pathname.endsWith("index.html")) {
                    const wrapper = document.createElement("div"); wrapper.className = "view-all-wrapper";
                    const button = document.createElement("button"); button.className = "view-all-btn"; button.type = "button"; button.textContent = "View all products →"; button.setAttribute("aria-label", `View all ${categoryName} products`); button.addEventListener("click", () => { location.href = `category.html?category=${encodeURIComponent(categoryName)}`; }); wrapper.appendChild(button); section.appendChild(wrapper);
                }
                productContainer.appendChild(section);
            });
            if (!productContainer.children.length) productContainer.innerHTML = '<div class="product-error"><p>No products are currently available.</p></div>';
        })
        .catch(error => { console.error("Products load error:", error); productContainer.innerHTML = '<div class="product-error"><p>Products could not be loaded right now.</p><p>Please refresh the page or contact us on WhatsApp.</p></div>'; });
});

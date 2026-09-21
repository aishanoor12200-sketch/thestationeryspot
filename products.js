document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");

    if (!productContainer) {
        return;
    }

    // Resolve the data URL relative to the current page. This works on both
    // a custom domain and GitHub Pages project URLs.
    const productsUrl = new URL("data/products.json", document.baseURI).href;

    fetch(productsUrl, { cache: "no-store" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Products file could not be loaded: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            if (!Array.isArray(products)) {
                throw new Error("products.json must contain an array.");
            }

            productContainer.replaceChildren();
            const categories = {};

            products.forEach(product => {
                if (
                    product &&
                    product.available !== false &&
                    product.category &&
                    product.name &&
                    product.image
                ) {
                    if (!categories[product.category]) {
                        categories[product.category] = [];
                    }
                    categories[product.category].push(product);
                }
            });

            Object.entries(categories).forEach(([categoryName, items]) => {
                const section = document.createElement("section");
                section.className = "category";

                const heading = document.createElement("h2");
                heading.textContent = categoryName;

                const productsGrid = document.createElement("div");
                productsGrid.className = "products";

                items.forEach((product, index) => {
                    const card = document.createElement("product-card");
                    card.setAttribute("image", product.image);
                    card.setAttribute("name", product.name);
                    card.setAttribute("price", product.price);
                    card.setAttribute("code", product.code || "");
                    if (index >= 4) card.classList.add("extra-product");
                    productsGrid.appendChild(card);
                });

                section.append(heading, productsGrid);

                if (items.length > 4) {
                    const wrapper = document.createElement("div");
                    wrapper.className = "view-all-wrapper";

                    const button = document.createElement("button");
                    button.className = "view-all-btn";
                    button.type = "button";
                    button.innerHTML = "View All <span>→</span>";
                    button.addEventListener("click", () => {
                        window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
                    });

                    wrapper.appendChild(button);
                    section.appendChild(wrapper);
                }

                productContainer.appendChild(section);
            });

            if (!productContainer.children.length) {
                productContainer.innerHTML = '<div class="product-error"><p>No products are currently available.</p></div>';
            }
        })
        .catch(error => {
            console.error("Products load error:", error);
            productContainer.innerHTML = `
                <div class="product-error">
                    <p>Products could not be loaded right now.</p>
                    <p>Please refresh the page or contact us on WhatsApp.</p>
                </div>
            `;
        });
});

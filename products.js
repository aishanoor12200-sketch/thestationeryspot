document.addEventListener("DOMContentLoaded", () => {

    const productContainer =
        document.getElementById("productContainer");

    if (!productContainer) {
        console.error("Product container not found.");
        return;
    }

    fetch("data/products.json")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    `Products file could not be loaded: ${response.status}`
                );
            }

            return response.json();
        })

        .then(products => {

            if (!Array.isArray(products)) {
                throw new Error(
                    "products.json must contain an array."
                );
            }

            productContainer.innerHTML = "";

            const categories = {};

            products.forEach(product => {

                if (product.available === false) {
                    return;
                }

                if (
                    !product.category ||
                    !product.name ||
                    !product.image
                ) {
                    console.warn(
                        "Skipped incomplete product:",
                        product
                    );
                    return;
                }

                if (!categories[product.category]) {
                    categories[product.category] = [];
                }

                categories[product.category].push(product);
            });


            Object.entries(categories).forEach(
                ([categoryName, items]) => {

                    const section =
                        document.createElement("section");

                    section.className = "category";


                    const heading =
                        document.createElement("h2");

                    heading.textContent =
                        categoryName;


                    const productsGrid =
                        document.createElement("div");

                    productsGrid.className =
                        "products";


                    items.forEach(product => {

                        const card =
                            document.createElement("product-card");

                        card.setAttribute(
                            "image",
                            product.image
                        );

                        card.setAttribute(
                            "name",
                            product.name
                        );

                        card.setAttribute(
                            "price",
                            product.price
                        );

                        card.setAttribute(
                            "code",
                            product.code || ""
                        );

                        productsGrid.appendChild(card);

                    });


                    section.appendChild(heading);
                    section.appendChild(productsGrid);

                    productContainer.appendChild(section);
                }
            );

        })

        .catch(error => {

            console.error(
                "Products load error:",
                error
            );

            productContainer.innerHTML = `
                <div class="product-error">
                    <p>Products could not be loaded.</p>
                    <p>Please try again later.</p>
                </div>
            `;
        });

});

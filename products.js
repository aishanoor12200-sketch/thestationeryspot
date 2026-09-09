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


            /* =========================
               GROUP PRODUCTS
            ========================= */

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


            /* =========================
               CREATE CATEGORY SECTIONS
            ========================= */

            Object.entries(categories).forEach(
                ([categoryName, items]) => {


                    const section =
                        document.createElement("section");

                    section.className = "category";


                    /* =========================
                       CATEGORY HEADING
                    ========================= */

                    const heading =
                        document.createElement("h2");

                    heading.textContent =
                        categoryName;


                    /* =========================
                       PRODUCT GRID
                    ========================= */

                    const productsGrid =
                        document.createElement("div");

                    productsGrid.className =
                        "products";


                    /*
                       First 4 products are visible.
                       Remaining products stay hidden.
                    */

                    items.forEach(
                        (product, index) => {

                            const card =
                                document.createElement(
                                    "product-card"
                                );


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


                            /*
                               Hide products after first 4
                            */

                            if (index >= 4) {

                                card.classList.add(
                                    "extra-product"
                                );

                            }


                            productsGrid.appendChild(card);

                        }
                    );


                    /* =========================
                       VIEW ALL BUTTON
                    ========================= */

                    if (items.length > 4) {

                        const viewAllWrapper =
                            document.createElement("div");

                        viewAllWrapper.className =
                            "view-all-wrapper";


                        const viewAllButton =
                            document.createElement("button");

                        viewAllButton.className =
                            "view-all-btn";


                        viewAllButton.type =
                            "button";


                        viewAllButton.innerHTML =
                            `View All <span>→</span>`;


                        viewAllButton.addEventListener(
                            "click",
                            () => {

                                const extraProducts =
                                    productsGrid.querySelectorAll(
                                        ".extra-product"
                                    );


                                const isExpanded =
                                    section.classList.contains(
                                        "expanded"
                                    );


                                if (!isExpanded) {

                                    extraProducts.forEach(
                                        product => {

                                            product.style.display =
                                                "";

                                        }
                                    );


                                    section.classList.add(
                                        "expanded"
                                    );


                                    viewAllButton.innerHTML =
                                        `Show Less <span>↑</span>`;


                                } else {

                                    extraProducts.forEach(
                                        product => {

                                            product.style.display =
                                                "none";

                                        }
                                    );


                                    section.classList.remove(
                                        "expanded"
                                    );


                                    viewAllButton.innerHTML =
                                        `View All <span>→</span>`;

                                }

                            }
                        );


                        viewAllWrapper.appendChild(
                            viewAllButton
                        );


                        section.appendChild(
                            heading
                        );


                        section.appendChild(
                            productsGrid
                        );


                        section.appendChild(
                            viewAllWrapper
                        );


                        productContainer.appendChild(
                            section
                        );


                    } else {

                        /*
                           If category has 4 or fewer
                           products, no View All button.
                        */

                        section.appendChild(
                            heading
                        );


                        section.appendChild(
                            productsGrid
                        );


                        productContainer.appendChild(
                            section
                        );

                    }

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

                    <p>
                        Products could not be loaded.
                    </p>

                    <p>
                        Please try again later.
                    </p>

                </div>

            `;

        });

});

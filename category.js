document.addEventListener("DOMContentLoaded", () => {

    const categoryTitle =
        document.getElementById("categoryTitle");

    const categoryProducts =
        document.getElementById("categoryProducts");


    /* =========================
       GET CATEGORY FROM URL
    ========================= */

    const params =
        new URLSearchParams(window.location.search);

    const categoryName =
        params.get("category");


    if (!categoryName) {

        categoryTitle.textContent =
            "Category Not Found";

        return;
    }


    /* =========================
       LOAD PRODUCTS
    ========================= */

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


            /* =========================
               FILTER CATEGORY
            ========================= */

            const categoryItems =
                products.filter(product =>
                    product.available !== false &&
                    product.category === categoryName &&
                    product.name &&
                    product.image
                );


            /* =========================
               CATEGORY TITLE
            ========================= */

            categoryTitle.textContent =
                categoryName;


            /* =========================
               NO PRODUCTS
            ========================= */

            if (categoryItems.length === 0) {

                categoryProducts.innerHTML = `
                    <div class="product-error">
                        <p>No products found in this category.</p>
                    </div>
                `;

                return;
            }


            /* =========================
               CREATE ALL PRODUCTS
            ========================= */

            categoryItems.forEach(product => {

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


                categoryProducts.appendChild(card);

            });

        })


        .catch(error => {

            console.error(
                "Category products error:",
                error
            );


            categoryProducts.innerHTML = `
                <div class="product-error">
                    <p>Products could not be loaded.</p>
                    <p>Please try again later.</p>
                </div>
            `;

        });

});

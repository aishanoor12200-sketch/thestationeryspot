(() => {

    const normalize = value =>
        String(value ?? "")
            .trim()
            .toLowerCase();


    let products = null;


    function loadProducts() {

        if (products) {
            return Promise.resolve(products);
        }


        return fetch(
            new URL(
                "data/products.json",
                document.baseURI
            ),
            {
                cache: "no-store"
            }
        )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Products could not be loaded."
                );
            }

            return response.json();

        })

        .then(data => {

            products =
                Array.isArray(data)
                    ? data
                    : [];

            return products;

        });

    }


    function searchItems() {

        const input =
            document.getElementById(
                "searchInput"
            );

        const results =
            document.getElementById(
                "searchResults"
            );


        if (!input || !results) {
            return;
        }


        const term =
            normalize(input.value);


        results.replaceChildren();


        /* EMPTY SEARCH */

        if (!term) {

            results.style.display =
                "none";

            return;

        }


        /* LOAD PRODUCTS */

        if (!products) {

            results.textContent =
                "Loading products…";

            results.style.display =
                "block";


            loadProducts()

                .then(() => {

                    if (
                        term ===
                        normalize(input.value)
                    ) {

                        searchItems();

                    }

                })

                .catch(() => {

                    results.textContent =
                        "Unable to load products.";

                    results.style.display =
                        "block";

                });

            return;

        }


        /* SEARCH */

        const matches =
            products

                .filter(product => {

                    if (
                        !product ||
                        product.available === false
                    ) {
                        return false;
                    }


                    return [
                        product.name,
                        product.code,
                        product.category
                    ].some(value =>
                        normalize(value)
                            .includes(term)
                    );

                })

                .slice(0, 12);


        /* NO RESULTS */

        if (!matches.length) {

            results.textContent =
                "No product found";

            results.style.display =
                "block";

            return;

        }


        /* RESULTS */

        matches.forEach(product => {

            const item =
                document.createElement("button");


            item.type = "button";

            item.className =
                "search-result-item";


            const name =
                String(
                    product.name ||
                    "Product"
                );


            const category =
                String(
                    product.category ||
                    ""
                );


            const price =
                Number(product.price) || 0;


            item.innerHTML = `
                <strong>${name}</strong>
                <small>
                    ${category} · Rs.${price}
                </small>
            `;


            item.addEventListener(
                "click",
                () => {

                    const cards =
                        document.querySelectorAll(
                            "product-card"
                        );


                    let targetCard = null;


                    cards.forEach(card => {

                        if (targetCard) {
                            return;
                        }


                        const code =
                            card.getAttribute(
                                "code"
                            );


                        const image =
                            card.getAttribute(
                                "image"
                            );


                        if (
                            code ===
                                String(
                                    product.code || ""
                                ) &&

                            image ===
                                String(
                                    product.image || ""
                                )
                        ) {

                            targetCard =
                                card;

                        }

                    });


                    /*
                     * If product exists on
                     * homepage, reveal it.
                     */

                    if (targetCard) {

                        const categorySection =
                            targetCard.closest(
                                ".category"
                            );


                        if (
                            targetCard.classList
                                .contains(
                                    "extra-product"
                                )
                        ) {

                            targetCard.classList
                                .remove(
                                    "extra-product"
                                );


                            if (
                                categorySection
                            ) {

                                categorySection
                                    .classList
                                    .add(
                                        "expanded"
                                    );

                            }

                        }


                        results.style.display =
                            "none";


                        input.value = "";


                        setTimeout(() => {

                            targetCard.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        }, 100);


                        return;

                    }


                    /*
                     * If product is not on
                     * current page, open category.
                     */

                    const category =
                        encodeURIComponent(
                            String(
                                product.category ||
                                ""
                            )
                        );


                    window.location.href =
                        `category.html?category=${category}`;

                }
            );


            results.appendChild(item);

        });


        results.style.display =
            "block";

    }


    /* MAKE FUNCTION GLOBAL */

    window.searchItems =
        searchItems;


    /* CLOSE SEARCH WHEN
       CLICKING OUTSIDE */

    document.addEventListener(
        "click",
        event => {

            const searchBox =
                document.querySelector(
                    ".search-box"
                );


            const results =
                document.getElementById(
                    "searchResults"
                );


            if (
                searchBox &&
                results &&
                !searchBox.contains(
                    event.target
                )
            ) {

                results.style.display =
                    "none";

            }

        }
    );


})();

document.addEventListener("DOMContentLoaded", () => {

    const sidebarHTML = `
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <aside class="common-sidebar" id="commonSidebar">

            <div class="sidebar-brand">
                <div class="sidebar-brand-logo">
                    <img src="logo.jpeg" alt="The Stationery Spot">
                </div>

                <div class="sidebar-brand-text">
                    <div class="sidebar-brand-name">
                        The Stationery Spot
                    </div>
                    <div class="sidebar-brand-subtitle">
                        cute things, happy moments ♡
                    </div>
                </div>

                <button
                    class="sidebar-close"
                    id="sidebarClose"
                    type="button"
                    aria-label="Close menu"
                >
                    ×
                </button>
            </div>


            <div class="sidebar-tabs">

                <button
                    class="sidebar-tab active"
                    data-tab="menuTab"
                    type="button"
                >
                    MENU
                </button>

                <button
                    class="sidebar-tab"
                    data-tab="categoriesTab"
                    type="button"
                >
                    CATEGORIES
                </button>

            </div>


            <div class="sidebar-content">

                <!-- MENU -->
                <div
                    class="sidebar-tab-content active"
                    id="menuTab"
                >

                    <div class="sidebar-section-label">
                        EXPLORE
                    </div>

                    <a href="index.html">
                        <span class="sidebar-link-icon">⌂</span>
                        <span>Home</span>
                    </a>

                    <a href="deals.html">
                        <span class="sidebar-link-icon">♡</span>
                        <span>Deals</span>
                    </a>

                    <a href="contact.html">
                        <span class="sidebar-link-icon">✦</span>
                        <span>Contact</span>
                    </a>


                    <div class="sidebar-section-label policy-label">
                        INFORMATION
                    </div>

                    <a href="Refund policy.html">
                        <span class="sidebar-link-icon">↩</span>
                        <span>Refund Policy</span>
                    </a>

                    <a href="Shipping policy.html">
                        <span class="sidebar-link-icon">⌁</span>
                        <span>Shipping Policy</span>
                    </a>

                </div>


                <!-- CATEGORIES -->
                <div
                    class="sidebar-tab-content"
                    id="categoriesTab"
                >

                    <div class="sidebar-category-heading">
                        <span>Shop by category</span>
                        <span>♡</span>
                    </div>

                    <div id="sidebarCategories">

                        <p class="sidebar-loading">
                            Loading categories...
                        </p>

                    </div>

                </div>

            </div>


            <div class="sidebar-footer">
                <div class="sidebar-footer-line"></div>

                <div class="sidebar-footer-text">
                    Made with <span>♡</span>
                </div>

                <div class="sidebar-footer-subtext">
                    for stationery lovers
                </div>
            </div>

        </aside>
    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        sidebarHTML
    );


    const sidebar =
        document.getElementById("commonSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const closeBtn =
        document.getElementById("sidebarClose");


    /* =========================
       OPEN
    ========================= */

    window.openCommonSidebar = function () {

        if (!sidebar || !overlay) return;

        sidebar.classList.add("open");
        overlay.classList.add("open");
        document.body.classList.add("sidebar-open");

    };


    /* =========================
       CLOSE
    ========================= */

    window.closeCommonSidebar = function () {

        if (!sidebar || !overlay) return;

        sidebar.classList.remove("open");
        overlay.classList.remove("open");
        document.body.classList.remove("sidebar-open");

    };


    /* =========================
       CLOSE BUTTON
    ========================= */

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            window.closeCommonSidebar
        );

    }


    /* =========================
       OUTSIDE TAP
    ========================= */

    if (overlay) {

        overlay.addEventListener(
            "click",
            window.closeCommonSidebar
        );

    }


    /* =========================
       TABS
    ========================= */

    const tabs =
        document.querySelectorAll(".sidebar-tab");

    const tabContents =
        document.querySelectorAll(
            ".sidebar-tab-content"
        );


    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const target =
                tab.dataset.tab;

            tabs.forEach(t => {
                t.classList.remove("active");
            });

            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            tab.classList.add("active");

            const targetContent =
                document.getElementById(target);

            if (targetContent) {
                targetContent.classList.add("active");
            }

        });

    });


    /* =========================
       LOAD CATEGORIES
    ========================= */

    fetch("data/products.json")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Products JSON could not load"
                );
            }

            return response.json();

        })

        .then(products => {

            const categoryBox =
                document.getElementById(
                    "sidebarCategories"
                );

            if (!categoryBox) return;


            const categories = [
                ...new Set(

                    products

                        .filter(
                            product =>
                                product.available !== false
                        )

                        .map(
                            product =>
                                product.category
                        )

                        .filter(Boolean)

                )
            ];


            categoryBox.innerHTML = "";


            categories.forEach(category => {

                const item =
                    document.createElement("div");

                item.className =
                    "sidebar-category";


                item.innerHTML = `

                    <div class="sidebar-category-row">

                        <a
                            href="category.html?category=${encodeURIComponent(category)}"
                        >
                            <span>${category}</span>
                        </a>

                        <button
                            class="category-plus"
                            type="button"
                            aria-label="Expand ${category}"
                        >
                            <span>+</span>
                        </button>

                    </div>


                    <div class="sidebar-category-products">
                    </div>

                `;


                categoryBox.appendChild(item);


                const plusButton =
                    item.querySelector(
                        ".category-plus"
                    );


                const productList =
                    item.querySelector(
                        ".sidebar-category-products"
                    );


                plusButton.addEventListener(
                    "click",
                    () => {

                        const isOpen =
                            item.classList.contains(
                                "expanded"
                            );


                        if (isOpen) {

                            item.classList.remove(
                                "expanded"
                            );

                            plusButton.innerHTML =
                                "<span>+</span>";

                            productList.innerHTML =
                                "";

                            return;
                        }


                        item.classList.add(
                            "expanded"
                        );

                        plusButton.innerHTML =
                            "<span>−</span>";


                        const categoryProducts =
                            products.filter(
                                product =>
                                    product.available !== false &&
                                    product.category === category
                            );


                        productList.innerHTML =
                            "";


                        categoryProducts.forEach(
                            product => {

                                const productLink =
                                    document.createElement(
                                        "a"
                                    );

                                productLink.className =
                                    "sidebar-product-link";

                                productLink.href =
                                    "category.html?category=" +
                                    encodeURIComponent(
                                        category
                                    );

                                productLink.textContent =
                                    product.name ||
                                    "Product";

                                productList.appendChild(
                                    productLink
                                );

                            }
                        );

                    }
                );

            });

        })

        .catch(error => {

            console.error(
                "Sidebar categories error:",
                error
            );

            const categoryBox =
                document.getElementById(
                    "sidebarCategories"
                );

            if (categoryBox) {

                categoryBox.innerHTML = `
                    <p class="sidebar-loading">
                        Categories could not be loaded.
                    </p>
                `;

            }

        });


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                window.closeCommonSidebar();

            }

        }
    );

});

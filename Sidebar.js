document.addEventListener("DOMContentLoaded", () => {

    const sidebarHTML = `
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <aside class="common-sidebar" id="commonSidebar">

            <button class="sidebar-close" id="sidebarClose" type="button">
                ✕
            </button>

            <div class="sidebar-tabs">

                <button class="sidebar-tab active" data-tab="menuTab">
                    MENU
                </button>

                <button class="sidebar-tab" data-tab="categoriesTab">
                    CATEGORIES
                </button>

            </div>

            <div class="sidebar-content">

                <!-- MENU -->
                <div class="sidebar-tab-content active" id="menuTab">

                    <a href="index.html">Home</a>

                    <a href="deals.html">Deals</a>

                    <a href="contact.html">Contact</a>

                    <a href="Refund policy.html">
                        Refund Policy
                    </a>

                    <a href="Shipping policy.html">
                        Shipping Policy
                    </a>

                </div>


                <!-- CATEGORIES -->
                <div class="sidebar-tab-content" id="categoriesTab">

                    <div id="sidebarCategories">

                        <p class="sidebar-loading">
                            Loading categories...
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    `;


    // Add sidebar to page
    document.body.insertAdjacentHTML(
        "beforeend",
        sidebarHTML
    );


    // =========================
    // ELEMENTS
    // =========================

    const sidebar =
        document.getElementById("commonSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const closeBtn =
        document.getElementById("sidebarClose");


    // =========================
    // OPEN SIDEBAR
    // =========================

    window.openCommonSidebar = function () {

        sidebar.classList.add("open");

        overlay.classList.add("open");

        document.body.classList.add(
            "sidebar-open"
        );

    };


    // =========================
    // CLOSE SIDEBAR
    // =========================

    window.closeCommonSidebar = function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

        document.body.classList.remove(
            "sidebar-open"
        );

    };


    // Close button
    closeBtn.addEventListener(
        "click",
        closeCommonSidebar
    );


    // Outside tap
    overlay.addEventListener(
        "click",
        closeCommonSidebar
    );


    // =========================
    // TABS
    // =========================

    const tabs =
        document.querySelectorAll(
            ".sidebar-tab"
        );

    const tabContents =
        document.querySelectorAll(
            ".sidebar-tab-content"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                tabs.forEach(t => {

                    t.classList.remove(
                        "active"
                    );

                });


                tabContents.forEach(content => {

                    content.classList.remove(
                        "active"
                    );

                });


                tab.classList.add(
                    "active"
                );


                const targetContent =
                    document.getElementById(
                        target
                    );


                if (targetContent) {

                    targetContent.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    // =========================
    // LOAD CATEGORIES
    // =========================

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

                        <a href="category.html?category=${encodeURIComponent(category)}">
                            ${category}
                        </a>

                        <button
                            class="category-plus"
                            type="button"
                            aria-label="Open ${category}"
                        >
                            +
                        </button>

                    </div>

                `;


                categoryBox.appendChild(item);

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

});

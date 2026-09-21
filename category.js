document.addEventListener("DOMContentLoaded", () => {
    const title = document.getElementById("categoryTitle");
    const container = document.getElementById("categoryProducts");
    if (!title || !container) return;
    const categoryName = new URLSearchParams(location.search).get("category");
    if (!categoryName) { title.textContent = "Category Not Found"; container.innerHTML = '<div class="product-error"><p>Please choose a category from the menu.</p></div>'; return; }
    fetch(new URL("data/products.json", document.baseURI))
        .then(response => { if (!response.ok) throw new Error(`Products file could not be loaded: ${response.status}`); return response.json(); })
        .then(products => {
            const items = Array.isArray(products) ? products.filter(product => product && product.available !== false && String(product.category).toLowerCase() === categoryName.toLowerCase() && product.name && product.image) : [];
            title.textContent = categoryName;
            if (!items.length) { container.innerHTML = '<div class="product-error"><p>No products found in this category.</p></div>'; return; }
            items.forEach(product => { const card = document.createElement("product-card"); card.setAttribute("image", product.image); card.setAttribute("name", product.name); card.setAttribute("price", product.price); card.setAttribute("code", product.code || ""); container.appendChild(card); });
        })
        .catch(error => { console.error("Category products error:", error); container.innerHTML = '<div class="product-error"><p>Products could not be loaded.</p><p>Please try again later.</p></div>'; });
});

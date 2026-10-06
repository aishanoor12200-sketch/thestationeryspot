(() => {
  const normalize = value => String(value ?? "").trim().toLowerCase();
  let products = null;
  let request = 0;
  function searchItems() {
    const input = document.getElementById("searchInput"); const results = document.getElementById("searchResults"); if (!input || !results) return;
    const term = normalize(input.value); results.replaceChildren();
    if (!term) { results.style.display = "none"; return; }
    if (!products) { results.textContent = "Loading products…"; results.style.display = "block"; fetch(new URL("data/products.json", document.baseURI), { cache: "no-store" }).then(r => r.ok ? r.json() : []).then(data => { products = Array.isArray(data) ? data : []; if (term === normalize(input.value)) searchItems(); }).catch(() => { results.textContent = "Unable to load products."; results.style.display = "block"; }); return; }
    const matches = products.filter(p => p && p.available !== false && [p.name, p.code, p.category].some(value => normalize(value).includes(term))).slice(0, 12);
    if (!matches.length) { results.textContent = "No product found"; results.style.display = "block"; return; }
    matches.forEach(product => { const item = document.createElement("button"); item.type = "button"; item.className = "search-result-item"; item.textContent = `${String(product.name || "Product")} · Rs.${Number(product.price) || 0}`; item.addEventListener("click", () => { const category = encodeURIComponent(String(product.category || "")); window.location.href = `category.html?category=${category}`; }); results.appendChild(item); }); results.style.display = "block";
  }
  window.searchItems = searchItems;
})();

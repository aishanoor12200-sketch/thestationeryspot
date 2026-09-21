document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("categoryTitle");
  const container = document.getElementById("categoryProducts");
  if (!title || !container || container.dataset.loaded) return;
  container.dataset.loaded = "loading";
  const normalize = value => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const requested = new URLSearchParams(location.search).get("category");
  const wanted = normalize(requested);
  if (!wanted) { title.textContent = "Category Not Found"; container.innerHTML = '<div class="product-error"><p>Please choose a category from the menu.</p></div>'; container.dataset.loaded = "true"; return; }
  fetch(new URL("data/products.json", document.baseURI), { cache: "no-store" })
    .then(response => { if (!response.ok) throw new Error(`Products file could not be loaded: ${response.status}`); return response.json(); })
    .then(products => {
      const items = Array.isArray(products) ? products.filter(p => p && p.available !== false && normalize(p.category) === wanted && String(p.name || "").trim() && String(p.image || "").trim()) : [];
      title.textContent = String(requested).trim(); container.replaceChildren();
      if (!items.length) container.innerHTML = '<div class="product-error"><p>No products found in this category.</p></div>';
      items.forEach(p => { const card = document.createElement("product-card"); const identity = [p.code, p.name, p.price, p.image].map(value => String(value ?? "").trim()).join("|"); ["image", "name", "price", "code", "identity"].forEach(attribute => card.setAttribute(attribute, attribute === "identity" ? identity : String(p[attribute] ?? ""))); container.appendChild(card); });
      container.dataset.loaded = "true";
    })
    .catch(error => { container.dataset.loaded = "error"; console.error("Category products error:", error); container.innerHTML = '<div class="product-error"><p>Products could not be loaded.</p><p>Please try again later.</p></div>'; });
});

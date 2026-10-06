document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productContainer");
  if (!container) return;
  fetch(new URL("data/products.json", document.baseURI), { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(`Products file could not be loaded: ${r.status}`); return r.json(); })
    .then(products => {
      if (!Array.isArray(products)) throw new Error("products.json must contain an array.");
      container.replaceChildren(); const categories = new Map();
      products.filter(p => p && p.available !== false && String(p.category || "").trim() && String(p.name || "").trim() && String(p.image || "").trim())
        .forEach(p => { if (!categories.has(p.category)) categories.set(p.category, []); categories.get(p.category).push(p); });
      categories.forEach((items, categoryName) => {
        const section = document.createElement("section"); section.className = "category";
        const heading = document.createElement("h2"); heading.textContent = categoryName;
        const grid = document.createElement("div"); grid.className = "products";
        items.forEach((p, index) => { const card = document.createElement("product-card"); const identity = [p.code, p.name, p.price, p.image].map(v => String(v ?? "").trim()).join("|"); ["image","name","price","code","identity"].forEach(a => card.setAttribute(a, a === "identity" ? identity : String(p[a] ?? ""))); if (index >= 4 && location.pathname.endsWith("index.html")) card.classList.add("extra-product"); grid.appendChild(card); });
        section.append(heading, grid);
        if (items.length > 4 && location.pathname.endsWith("index.html")) { const wrap = document.createElement("div"); wrap.className = "view-all-wrapper"; const btn = document.createElement("button"); btn.className = "view-all-btn"; btn.type = "button"; btn.textContent = "View all products →"; btn.addEventListener("click", () => { section.classList.add("expanded"); wrap.remove(); }); wrap.appendChild(btn); section.appendChild(wrap); }
        container.appendChild(section);
      });
      if (!container.children.length) container.innerHTML = '<div class="product-error"><p>No products are currently available.</p></div>';
    }).catch(error => { console.error("Products load error:", error); container.innerHTML = '<div class="product-error"><p>Products could not be loaded right now.</p><p>Please refresh the page.</p></div>'; });
});

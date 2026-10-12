
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productContainer");
  if (!container) return;

  fetch(new URL("data/products.json", document.baseURI))
    .then(response => {
      if (!response.ok) throw new Error("Products load nahi huin");
      return response.json();
    })
    .then(products => {
      if (!Array.isArray(products)) {
        throw new Error("Invalid products data");
      }

      container.replaceChildren();

      const categories = new Map();

      products
        .filter(p =>
          p &&
          p.available !== false &&
          p.category &&
          p.name &&
          p.image
        )
        .forEach(p => {
          if (!categories.has(p.category)) {
            categories.set(p.category, []);
          }
          categories.get(p.category).push(p);
        });

      categories.forEach((items, categoryName) => {
        const section = document.createElement("section");
        section.className = "category";

        const heading = document.createElement("h2");
        heading.textContent = categoryName;

        const grid = document.createElement("div");
        grid.className = "products";

        items.forEach((p, index) => {
          const card = document.createElement("product-card");

          ["image", "name", "price", "code"].forEach(attr => {
            card.setAttribute(attr, p[attr] ?? "");
          });

          if (index >= 4) {
            card.classList.add("extra-product");
          }

          grid.appendChild(card);
        });

        section.append(heading, grid);

        if (items.length > 4) {
          const wrap = document.createElement("div");
          wrap.className = "view-all-wrapper";

          const button = document.createElement("button");
          button.className = "view-all-btn";
          button.type = "button";
          button.textContent = "Show More →";

          button.addEventListener("click", () => {
            const url = new URL(
              "category.html",
              document.baseURI
            );

            url.searchParams.set("category", categoryName);
            window.open(url.href, "_blank", "noopener");
          });

          wrap.appendChild(button);
          section.appendChild(wrap);
        }

        container.appendChild(section);
      });
    })
    .catch(error => {
      console.error("Products load error:", error);
      container.innerHTML =
        '<p>Products load nahi ho sakin. Page refresh karein.</p>';
    });
});

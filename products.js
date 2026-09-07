fetch("data/products.json")
  .then(response => response.json())
  .then(products => {

    if (!Array.isArray(products)) return;

    const oldContainer = document.getElementById("productContainer");
    if (!oldContainer) return;

    const mainCategory = oldContainer.closest(".category");
    if (!mainCategory) return;

    const categories = {};

    products.forEach(product => {
      if (product.available === false) return;

      if (!categories[product.category]) {
        categories[product.category] = [];
      }

      categories[product.category].push(product);
    });

    Object.keys(categories).forEach(category => {

      const section = document.createElement("div");
      section.className = "category";

      const heading = document.createElement("h2");
      heading.textContent = category;

      const container = document.createElement("div");
      container.className = "products";

      section.appendChild(heading);
      section.appendChild(container);

      categories[category].forEach(product => {

        const card = document.createElement("product-card");

        card.setAttribute("image", product.image);
        card.setAttribute("name", product.name);
        card.setAttribute("price", product.price);
        card.setAttribute("code", product.code);

        container.appendChild(card);
      });

      mainCategory.parentNode.appendChild(section);
    });

  })
  .catch(error => {
    console.error("Products load error:", error);
  });

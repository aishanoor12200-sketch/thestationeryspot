fetch("data/products.json")
  .then(response => response.json())
  .then(products => {

    if (!Array.isArray(products)) return;

    const categories = {};

    products.forEach(product => {
      if (product.available === false) return;

      if (!categories[product.category]) {
        categories[product.category] = [];
      }

      categories[product.category].push(product);
    });

    Object.keys(categories).forEach(category => {

      const section = document.querySelector(
        `[data-category="${category}"]`
      );

      if (!section) return;

      const container = section.querySelector(".products");

      if (!container) return;

      container.innerHTML = "";

      categories[category].forEach(product => {

        container.innerHTML += `
          <div class="card">

            <div class="img-box">
              <img
                src="${product.image}"
                alt="${product.name}"
                onclick="openImage(this.src)"
              >
            </div>

            <div class="name">${product.name}</div>

            <div class="price">Rs. ${product.price}</div>

            <div class="qty-box">
              <button onclick="changeQty(this, -1)">−</button>
              <span>1</span>
              <button onclick="changeQty(this, 1)">+</button>
            </div>

            <button
              class="add-btn"
              onclick="addToCart(this, '${product.code}')"
            >
              Add to Cart
            </button>

          </div>
        `;
      });
    });

  })
  .catch(error => console.error("Products load error:", error));

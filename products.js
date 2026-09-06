fetch("data/products.json")
  .then(response => response.json())
  .then(products => {

    if (!Array.isArray(products)) return;

    const oldContainer = document.getElementById("productContainer");
    if (!oldContainer) return;

    const mainCategory = oldContainer.closest(".category");
    if (!mainCategory) return;

    mainCategory.innerHTML = "";

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

      section.innerHTML = `
        <h2>${category}</h2>
        <div class="products"></div>
      `;

      const container = section.querySelector(".products");

      categories[category].forEach(product => {

        container.innerHTML += `
          <div class="card">

            <div class="img-box">

              <img
                src="${product.image}"
                loading="lazy"
                width="150"
                height="200"
                onclick="openImage(this.src)"
              >

              <div
                class="floating-icon"
                onclick="addToCart(this,'${product.code}')"
              >🛒</div>

            </div>

            <p class="name">${product.name}</p>

            <p class="price">Rs.${product.price}</p>

            <div class="qty-box">
              <button onclick="decrease(this)">-</button>
              <span class="qty">1</span>
              <button onclick="increase(this)">+</button>
            </div>

            <button
              class="add-btn"
              onclick="addToCart(this,'${product.code}')"
            >
              Add to Cart
            </button>

          </div>
        `;

      });

      mainCategory.appendChild(section);

    });

  })
  .catch(error => console.error("Products load error:", error));

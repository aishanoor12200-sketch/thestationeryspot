fetch("data/products.json")
  .then(response => response.json())
  .then(products => {

    const container = document.getElementById("productContainer");

    if (!container) return;

    // Agar products.json empty hai to existing products ko delete na karo
    if (!Array.isArray(products) || products.length === 0) return;

    container.innerHTML = "";

    products.forEach(product => {

      if (product.available === false) return;

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
  })
  .catch(error => console.error("Products load error:", error));

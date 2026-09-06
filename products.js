fetch("data/products.json")
  .then(response => response.json())
  .then(products => {
    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
      if (product.available === false) return;

      container.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" onclick="openImage(this.src)">
          <h3>${product.name}</h3>
          <p>Rs. ${product.price}</p>
          <button onclick="addToCart(this, '${product.code}')">
            Add to Cart
          </button>
        </div>
      `;
    });
  })
  .catch(error => console.error("Products load error:", error));

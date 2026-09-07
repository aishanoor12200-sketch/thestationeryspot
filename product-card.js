class ProductCard extends HTMLElement {
  connectedCallback() {
    const image = this.getAttribute("image") || "";
    const name = this.getAttribute("name") || "Product";
    const price = this.getAttribute("price") || "0";
    const code = this.getAttribute("code") || "";

    this.outerHTML = `
      <div class="card">
        <div class="img-box">
          <img src="${image}" loading="lazy" width="150" height="200"
               onclick="openImage(this.src)">
          <div class="floating-icon"
               onclick="addToCart(this,'${code}')">🛒</div>
        </div>

        <p class="name">${name}</p>
        <p class="price">Rs.${price}</p>

        <div class="qty-box">
          <button onclick="decrease(this)">-</button>
          <span class="qty">1</span>
          <button onclick="increase(this)">+</button>
        </div>

        <button class="add-btn"
                onclick="addToCart(this,'${code}')">
          Add to Cart
        </button>
      </div>
    `;
  }
}

customElements.define("product-card", ProductCard);

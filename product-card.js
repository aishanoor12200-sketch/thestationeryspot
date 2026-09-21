class ProductCard extends HTMLElement {
  connectedCallback() {
    const image = String(this.getAttribute('image') || '').replace(/^\/+/, '');
    const name = this.getAttribute('name') || 'Product';
    const price = this.getAttribute('price') || '0';
    const code = this.getAttribute('code') || '';
    const card = document.createElement('div'); card.className = 'card';
    const imgBox = document.createElement('div'); imgBox.className = 'img-box';
    const img = document.createElement('img'); img.src = new URL(image, document.baseURI).href; img.alt = name; img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('error', () => imgBox.classList.add('image-missing'));
    img.addEventListener('click', () => window.openImage?.(img.src));
    const cartIcon = document.createElement('button'); cartIcon.className = 'floating-icon'; cartIcon.type = 'button'; cartIcon.textContent = '🛒'; cartIcon.setAttribute('aria-label', `Add ${name} to cart`); cartIcon.addEventListener('click', () => window.addToCart(cartIcon, code));
    imgBox.append(img, cartIcon);
    const nameElement = document.createElement('p'); nameElement.className = 'name'; nameElement.textContent = name;
    const priceElement = document.createElement('p'); priceElement.className = 'price'; priceElement.textContent = `Rs.${price}`;
    const qtyBox = document.createElement('div'); qtyBox.className = 'qty-box';
    const decrease = document.createElement('button'); decrease.type='button'; decrease.textContent='−'; decrease.setAttribute('aria-label','Decrease quantity'); decrease.addEventListener('click',()=>window.decrease(decrease));
    const qty = document.createElement('span'); qty.className='qty'; qty.textContent='1';
    const increase = document.createElement('button'); increase.type='button'; increase.textContent='+'; increase.setAttribute('aria-label','Increase quantity'); increase.addEventListener('click',()=>window.increase(increase)); qtyBox.append(decrease,qty,increase);
    const add = document.createElement('button'); add.className='add-btn'; add.type='button'; add.textContent='Add to Cart'; add.addEventListener('click',()=>window.addToCart(add,code));
    card.append(imgBox,nameElement,priceElement,qtyBox,add); this.replaceChildren(card);
  }
}
if (!customElements.get('product-card')) customElements.define('product-card', ProductCard);

function ensureImagePopup() {
  if (document.getElementById('imagePopup')) return;

  const popup = document.createElement('div');
  popup.id = 'imagePopup';
  popup.className = 'popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', 'Product image preview');
  popup.addEventListener('click', () => {
    popup.style.display = 'none';
    document.body.classList.remove('locked');
  });

  const image = document.createElement('img');
  image.id = 'popupImg';
  image.alt = 'Product preview';
  popup.appendChild(image);
  document.body.appendChild(popup);
}

window.openImage = function openImage(src) {
  ensureImagePopup();
  const popup = document.getElementById('imagePopup');
  const image = document.getElementById('popupImg');
  if (!popup || !image) return;
  image.src = src;
  popup.style.display = 'grid';
  document.body.classList.add('locked');
};

window.closeImage = function closeImage() {
  const popup = document.getElementById('imagePopup');
  if (!popup) return;
  popup.style.display = 'none';
  document.body.classList.remove('locked');
};

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    window.closeImage();
  }
});

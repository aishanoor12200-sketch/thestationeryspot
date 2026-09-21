document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productContainer'); if (!container) return;
  const url = new URL('data/products.json', document.baseURI).href;
  container.innerHTML = '<div class="product-error">Loading your stationery collection…</div>';
  fetch(url, {cache:'no-store'}).then(r => { if(!r.ok) throw new Error(`Products file could not be loaded: ${r.status}`); return r.json(); }).then(products => {
    if (!Array.isArray(products)) throw new Error('Invalid product data');
    container.replaceChildren(); const categories = {};
    products.filter(p => p && p.available !== false && p.category && p.name && p.image).forEach(p => (categories[p.category] ||= []).push(p));
    Object.entries(categories).forEach(([categoryName, items]) => {
      const section = document.createElement('section'); section.className='category';
      const heading = document.createElement('h2'); heading.textContent=categoryName;
      const grid = document.createElement('div'); grid.className='products';
      items.forEach((p,i) => { const card=document.createElement('product-card'); card.setAttribute('image',p.image); card.setAttribute('name',p.name); card.setAttribute('price',p.price); card.setAttribute('code',p.code||''); if(i>=4) card.classList.add('extra-product'); grid.append(card); });
      section.append(heading,grid);
      if(items.length>4){ const wrap=document.createElement('div'); wrap.className='view-all-wrapper'; const btn=document.createElement('button'); btn.className='view-all-btn'; btn.type='button'; btn.textContent='View all products →'; btn.addEventListener('click',()=>{section.classList.toggle('expanded'); btn.textContent=section.classList.contains('expanded')?'Show fewer products ↑':'View all products →';}); wrap.append(btn); section.append(wrap); }
      container.append(section);
    });
    if(!container.children.length) container.innerHTML='<div class="product-error">No products are currently available.</div>';
    window.stationeryProducts = products;
    document.dispatchEvent(new Event('stationeryProductsReady'));
  }).catch(error => { console.error(error); container.innerHTML='<div class="product-error"><strong>We couldn’t load the products.</strong><br>Please refresh the page and try again.</div>'; });
});

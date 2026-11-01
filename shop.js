/* ============================================================
   MEHNDI STUDIO — Shop & Category Navigation Logic
   Supports all Main Product Categories, Subcategories,
   Product Variations, Dynamic DB Prices & Real-Time Sync.
   ============================================================ */

// ── Sync with Database ────────────────────────────────────────
let PRODUCTS = window.MehndiDB ? window.MehndiDB.getAllVariations() : [];
let CATEGORIES = window.MehndiDB ? window.MehndiDB.getCategories() : [];

// ── State ─────────────────────────────────────────────────────
let shopState = {
  category: 'all',
  selectedSubcategory: null,
  selectedSize: null,
  activeVariationSku: null,
  selectionQty: 1,
  search: '',
  maxPrice: 3500,
  sort: 'default',
  showBestSellers: false,
  showNewArrivals: false,
  showOnSale: false,
  wishlist: JSON.parse(localStorage.getItem('mehndi_wishlist') || '[]'),
};

function refreshDataFromDB() {
  if (window.MehndiDB) {
    PRODUCTS = window.MehndiDB.getAllVariations();
    CATEGORIES = window.MehndiDB.getCategories();
  }
}

// Listen to DB updates from Admin Panel
window.addEventListener('mehndi_db_updated', () => {
  refreshDataFromDB();
  buildSidebar();
  renderSelectionFlow();
  renderShopGrid();
});

// ── Wishlist ──────────────────────────────────────────────────
function toggleWishlist(skuOrId) {
  const key = String(skuOrId);
  const idx = shopState.wishlist.indexOf(key);
  if (idx === -1) {
    shopState.wishlist.push(key);
    showToast('❤️ Added to Wishlist!');
  } else {
    shopState.wishlist.splice(idx, 1);
    showToast('💔 Removed from Wishlist');
  }
  localStorage.setItem('mehndi_wishlist', JSON.stringify(shopState.wishlist));
  renderWishlistBtns();
}

function isWishlisted(skuOrId) {
  return shopState.wishlist.includes(String(skuOrId));
}

function renderWishlistBtns() {
  document.querySelectorAll('[data-wishlist-sku]').forEach(btn => {
    const sku = btn.dataset.wishlistSku;
    const active = isWishlisted(sku);
    btn.classList.toggle('wishlisted', active);
    btn.innerHTML = active ? '❤️' : '🤍';
    btn.title = active ? 'Remove from wishlist' : 'Add to wishlist';
  });
}

// ── Filter & Sort ─────────────────────────────────────────────
function getFilteredProducts() {
  refreshDataFromDB();
  let list = [...PRODUCTS];

  if (shopState.category !== 'all') {
    list = list.filter(p => p.categoryId === shopState.category);
  }

  if (shopState.search) {
    const q = shopState.search.toLowerCase();
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (p.variation && p.variation.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  list = list.filter(p => Number(p.price) <= shopState.maxPrice);

  if (shopState.showBestSellers) list = list.filter(p => p.badge && p.badge.includes('Best'));
  if (shopState.showNewArrivals) list = list.filter(p => p.isNew);
  if (shopState.showOnSale) list = list.filter(p => p.original && p.original > p.price);

  switch (shopState.sort) {
    case 'price-asc':  list.sort((a, b) => Number(a.price) - Number(b.price)); break;
    case 'price-desc': list.sort((a, b) => Number(b.price) - Number(a.price)); break;
    case 'rating':     list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)); break;
    case 'newest':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'name-asc':   list.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
  }

  return list;
}

// ── Product Card HTML ─────────────────────────────────────────
function productCardHTML(p, delay = 0) {
  const price = Number(p.price);
  const orig = p.original ? Number(p.original) : null;
  const disc = orig && orig > price ? Math.round((1 - price / orig) * 100) : 0;
  const rating = Number(p.rating || 4.8);
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  const sku = p.sku || p.id;
  const inStock = p.stock !== 'out-of-stock';

  const variantBadge = [p.subCategory, p.variation].filter(Boolean).join(' • ');
  const imgs = p.imgs && p.imgs.length > 0 ? p.imgs : [p.img || 'images/mehndi cone.jpeg'];
  const hasMultipleImgs = imgs.length > 1;

  return `
    <div class="product-card reveal reveal-delay-${Math.min(delay, 4)}" data-sku="${sku}">
      <div class="product-img-wrap">
        <img id="card-img-${sku}" src="${imgs[0]}" alt="${p.name}" loading="lazy">
        <div class="product-badges">
          ${p.badge ? `<span class="badge badge-gold">${p.badge}</span>` : ''}
          ${disc > 0 ? `<span class="badge badge-sale">-${disc}%</span>` : ''}
          ${hasMultipleImgs ? `<span class="badge" style="background:rgba(26,10,8,0.7);color:#fff;backdrop-filter:blur(3px);font-size:0.68rem;">📷 ${imgs.length} Photos</span>` : ''}
          ${!inStock ? `<span class="badge" style="background:#7f1d1d;color:#fff;">Out of Stock</span>` : ''}
        </div>
        <div class="product-actions-overlay">
          <button class="product-action-btn ${isWishlisted(sku) ? 'wishlisted' : ''}" 
            data-wishlist-sku="${sku}" onclick="toggleWishlist('${sku}');event.stopPropagation();"
            title="${isWishlisted(sku) ? 'Remove from wishlist' : 'Add to wishlist'}">
            ${isWishlisted(sku) ? '❤️' : '🤍'}
          </button>
          <button class="product-action-btn" onclick="openProductModal('${sku}');event.stopPropagation();" title="Quick view">👁️</button>
        </div>

        ${hasMultipleImgs ? `
          <div class="card-thumb-bar" onclick="event.stopPropagation();">
            ${imgs.map((imgSrc, idx) => `
              <button type="button" class="card-thumb-dot ${idx === 0 ? 'active' : ''}" 
                onclick="switchCardThumb('${sku}', '${imgSrc.replace(/'/g, "\\'")}', this);event.stopPropagation();"
                title="View image ${idx + 1}" aria-label="View photo ${idx + 1}">
                <img src="${imgSrc}" alt="${p.name} preview ${idx + 1}">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="product-info" onclick="openProductModal('${sku}')" style="cursor:pointer">
        <div class="product-category" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${p.categoryName || 'Mehndi Product'}</span>
          ${variantBadge ? `<span style="font-size:0.7rem;color:var(--gold-dark);font-weight:700;background:rgba(201,151,58,0.12);padding:0.1rem 0.4rem;border-radius:10px;">${variantBadge}</span>` : ''}
        </div>
        <div class="product-name" style="font-size:1rem;margin:0.25rem 0;">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews || 95})</span>
        </div>
        <div class="product-price">
          <span class="price-current">₹${price.toLocaleString()}</span>
          ${orig && orig > price ? `<span class="price-original">₹${orig.toLocaleString()}</span><span class="price-discount">${disc}% off</span>` : ''}
        </div>
        <div style="font-size:0.75rem;margin-top:0.35rem;color:${inStock ? 'var(--emerald)' : '#dc2626'};font-weight:600;">
          ${inStock ? '● In Stock' : '✕ Out of Stock'}
        </div>
      </div>
      <div style="padding: 0 1.25rem 1.25rem;">
        <button class="product-add-btn" onclick="addToCart('${sku}');event.stopPropagation();" ${!inStock ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `;
}

// ── Interactive Product Selection Flow ────────────────────────
function renderSelectionFlow() {
  const container = document.getElementById('productSelectionFlowBox');
  if (!container) return;

  if (shopState.category === 'all') {
    container.innerHTML = `
      <div class="selection-flow-card all-categories-intro" style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem 2rem;margin-bottom:2rem;box-shadow:var(--shadow-card);border:1.5px solid var(--border);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h3 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.25rem;">
              🌿 Mehndi Product Categories
            </h3>
            <p style="font-size:0.875rem;color:var(--text-mid);">
              Select any category below to customize cone types, powder weights, oil sizes, and accessories.
            </p>
          </div>
          <span style="font-size:0.8rem;background:var(--cream);border:1px solid var(--border);border-radius:20px;padding:0.35rem 0.85rem;color:var(--maroon-dark);font-weight:600;">
            Categories • ${PRODUCTS.length} Variations
          </span>
        </div>

        <!-- Category Quick Pills -->
        <div class="category-quick-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:0.6rem;margin-top:1.25rem;">
          ${CATEGORIES.map(cat => `
            <div class="cat-quick-chip" onclick="setCategory('${cat.id}')" style="cursor:pointer;padding:0.6rem 0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--cream);text-align:center;transition:var(--transition);">
              <div style="font-size:1.3rem;">${cat.icon}</div>
              <div style="font-size:0.75rem;font-weight:600;color:var(--maroon-dark);margin-top:0.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cat.name}</div>
            </div>`).join('')}
        </div>
      </div>
    `;
    return;
  }

  const category = CATEGORIES.find(c => c.id === shopState.category);
  if (!category) return;

  const vars = window.MehndiDB ? window.MehndiDB.getVariationsByCategory(category.id) : PRODUCTS.filter(p => p.categoryId === category.id);
  const subcategories = window.MehndiDB ? window.MehndiDB.getSubcategories(category.id) : [];

  // Default selection if not already selected
  if (category.hasSubcategory && (!shopState.selectedSubcategory || !subcategories.includes(shopState.selectedSubcategory))) {
    shopState.selectedSubcategory = subcategories[0] || null;
  }

  const availableSizes = window.MehndiDB ? window.MehndiDB.getSizes(category.id, shopState.selectedSubcategory) : [];
  if (category.hasSize && (!shopState.selectedSize || !availableSizes.includes(shopState.selectedSize))) {
    shopState.selectedSize = availableSizes[0] || null;
  }

  // Find exact active variation
  let activeVar = null;
  if (window.MehndiDB) {
    activeVar = window.MehndiDB.findVariation(category.id, shopState.selectedSubcategory, shopState.selectedSize);
  }
  if (!activeVar && vars.length > 0) activeVar = vars[0];

  shopState.activeVariationSku = activeVar ? activeVar.sku : null;

  const price = activeVar ? Number(activeVar.price) : 0;
  const orig = activeVar && activeVar.original ? Number(activeVar.original) : null;
  const disc = orig && orig > price ? Math.round((1 - price / orig) * 100) : 0;
  const inStock = activeVar && activeVar.stock !== 'out-of-stock';

  // Build breadcrumbs
  const breadcrumbItems = ['Shop', category.name];
  if (shopState.selectedSubcategory) breadcrumbItems.push(shopState.selectedSubcategory);
  if (shopState.selectedSize) breadcrumbItems.push(shopState.selectedSize);

  // Determine available product images for this category / variation
  const flowImgs = (activeVar && activeVar.imgs && activeVar.imgs.length > 0)
    ? activeVar.imgs
    : (category.images || [category.image || 'images/mehndi cone.jpeg']);
  const mainFlowImg = activeVar?.img || flowImgs[0];

  container.innerHTML = `
    <div class="selection-flow-card" style="background:var(--white);border-radius:var(--radius-lg);padding:1.75rem 2rem;margin-bottom:2rem;box-shadow:var(--shadow-card);border:2px solid var(--gold);">
      
      <!-- Responsive 2-column layout: Left image showcase & gallery, Right options and flow -->
      <div class="selection-flow-layout" style="display:grid;grid-template-columns:290px 1fr;gap:2rem;align-items:start;">
        
        <!-- Left: Product Image & Gallery Showcase -->
        <div class="flow-image-showcase">
          <div style="position:relative;border-radius:var(--radius-md);overflow:hidden;background:#fff;border:1.5px solid var(--border);aspect-ratio:1;box-shadow:var(--shadow-card);">
            <img id="flowMainImg" src="${mainFlowImg}" alt="${activeVar ? activeVar.name : category.name}" 
              style="width:100%;height:100%;object-fit:cover;display:block;">
            ${flowImgs.length > 1 ? `
              <span class="badge" style="position:absolute;top:10px;left:10px;background:rgba(26,10,8,0.75);color:#fff;backdrop-filter:blur(4px);font-size:0.75rem;">
                📷 ${flowImgs.length} Images
              </span>
            ` : ''}
          </div>

          <!-- Thumbnails gallery if multiple images -->
          ${flowImgs.length > 1 ? `
            <div style="margin-top:0.75rem;">
              <div style="font-size:0.75rem;font-weight:700;color:var(--text-mid);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.05em;">
                Photo Gallery (${flowImgs.length} images):
              </div>
              <div class="flow-thumbs-list" style="display:flex;gap:0.5rem;overflow-x:auto;padding-bottom:0.25rem;">
                ${flowImgs.map((imgSrc, idx) => `
                  <button type="button" class="flow-thumb-btn ${imgSrc === mainFlowImg ? 'active' : ''}"
                    onclick="switchFlowImg('${imgSrc.replace(/'/g, "\\'")}', this)"
                    title="View photo ${idx + 1}"
                    style="width:62px;height:62px;flex-shrink:0;border-radius:var(--radius-sm);border:2px solid ${imgSrc === mainFlowImg ? 'var(--gold)' : 'var(--border)'};padding:0;background:#fff;cursor:pointer;overflow:hidden;transition:var(--transition);">
                    <img src="${imgSrc}" alt="${category.name} photo ${idx + 1}" style="width:100%;height:100%;object-fit:cover;display:block;">
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Right: Flow Header & Selection Options -->
        <div>
          <!-- Flow Header -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;">
            <div>
              <div style="font-size:0.8rem;color:var(--gold-dark);font-weight:600;margin-bottom:0.25rem;">
                ${breadcrumbItems.join(' › ')}
              </div>
              <h2 style="font-family:var(--font-heading);color:var(--maroon-dark);margin:0;display:flex;align-items:center;gap:0.5rem;font-size:1.6rem;">
                <span>${category.icon}</span> ${category.name}
              </h2>
              <p style="font-size:0.85rem;color:var(--text-mid);margin-top:0.35rem;max-width:650px;">
                ${category.description}
              </p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="setCategory('all')" style="padding:0.4rem 1rem;font-size:0.8rem;">
              ← View All Categories
            </button>
          </div>

          <!-- Step 1: Subcategory Selector (e.g. 9 Cone Types, or 3 Oil Types) -->
          ${category.hasSubcategory && subcategories.length > 0 ? `
            <div style="margin:1.25rem 0;padding:1rem;background:var(--cream);border-radius:var(--radius-md);border:1px solid var(--border);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
                <label style="font-weight:700;font-size:0.875rem;color:var(--maroon-dark);">
                  Step 1: ${category.subcategoryLabel || 'Select Type'} (${subcategories.length} options)
                </label>
                <span style="font-size:0.75rem;color:var(--gold);font-weight:600;">Selected: ${shopState.selectedSubcategory || 'None'}</span>
              </div>
              <div class="variation-chips-wrap" style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                ${subcategories.map(sub => {
                  const active = shopState.selectedSubcategory === sub;
                  return `
                    <button type="button" class="variant-chip ${active ? 'active' : ''}" 
                      onclick="selectFlowSubcategory('${sub.replace(/'/g, "\\'")}')"
                      style="padding:0.5rem 1rem;border-radius:var(--radius-xl);border:1.5px solid ${active ? 'var(--gold)' : 'var(--border)'};background:${active ? 'linear-gradient(135deg,var(--gold),var(--gold-dark))' : 'var(--white)'};color:${active ? 'var(--white)' : 'var(--text-dark)'};font-size:0.85rem;font-weight:${active ? '700' : '500'};cursor:pointer;transition:var(--transition);display:inline-flex;align-items:center;gap:0.35rem;">
                      ${active ? '✓ ' : ''}${sub}
                    </button>`;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Step 2: Size / Weight / Quantity Selector -->
          ${category.hasSize && availableSizes.length > 0 ? `
            <div style="margin:1.25rem 0;padding:1rem;background:var(--cream);border-radius:var(--radius-md);border:1px solid var(--border);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
                <label style="font-weight:700;font-size:0.875rem;color:var(--maroon-dark);">
                  ${category.hasSubcategory ? 'Step 2' : 'Step 1'}: ${category.sizeLabel || 'Select Option'} (${availableSizes.length} available)
                </label>
                <span style="font-size:0.75rem;color:var(--gold);font-weight:600;">Selected: ${shopState.selectedSize || 'None'}</span>
              </div>
              <div class="variation-chips-wrap" style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                ${availableSizes.map(sz => {
                  const active = shopState.selectedSize === sz;
                  return `
                    <button type="button" class="variant-chip ${active ? 'active' : ''}" 
                      onclick="selectFlowSize('${sz.replace(/'/g, "\\'")}')"
                      style="padding:0.5rem 1.1rem;border-radius:var(--radius-xl);border:1.5px solid ${active ? 'var(--maroon)' : 'var(--border)'};background:${active ? 'var(--maroon)' : 'var(--white)'};color:${active ? 'var(--white)' : 'var(--text-dark)'};font-size:0.85rem;font-weight:${active ? '700' : '500'};cursor:pointer;transition:var(--transition);display:inline-flex;align-items:center;gap:0.35rem;">
                      ${active ? '✓ ' : ''}${sz}
                    </button>`;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- No variation notice for single-item categories -->
          ${!category.hasSubcategory && !category.hasSize ? `
            <div style="margin:1rem 0;padding:0.75rem 1rem;background:rgba(201,151,58,0.1);border-radius:var(--radius-sm);border-left:4px solid var(--gold);font-size:0.85rem;color:var(--text-mid);">
              ✅ <strong>Standard Single Unit</strong> — No subcategory or size variation required. Ready to add directly to cart!
            </div>
          ` : ''}

          <!-- Dynamic Selection Action Box (Price, Quantity, Add to Cart) -->
          ${activeVar ? `
            <div class="flow-action-bar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;padding:1.25rem;background:linear-gradient(135deg, rgba(74,15,26,0.04), rgba(201,151,58,0.06));border-radius:var(--radius-md);border:1.5px solid var(--border);">
              <div style="display:flex;align-items:center;gap:1.25rem;">
                <div>
                  <div style="font-size:0.75rem;color:var(--text-light);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Selected Variation Price</div>
                  <div style="display:flex;align-items:baseline;gap:0.6rem;margin-top:0.2rem;">
                    <span style="font-size:1.75rem;font-weight:700;color:var(--maroon-dark);">₹${price.toLocaleString()}</span>
                    ${orig && orig > price ? `
                      <span style="font-size:1rem;color:var(--text-light);text-decoration:line-through;">₹${orig.toLocaleString()}</span>
                      <span class="badge badge-sale" style="font-size:0.75rem;">-${disc}% OFF</span>` : ''}
                  </div>
                  <div style="font-size:0.75rem;margin-top:0.25rem;color:${inStock ? 'var(--emerald)' : '#dc2626'};font-weight:600;">
                    ${inStock ? '● In Stock & Ready to Ship' : '✕ Currently Out of Stock'}
                  </div>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
                <!-- Quantity selector -->
                <div style="display:flex;align-items:center;background:var(--white);border:1.5px solid var(--border);border-radius:var(--radius-xl);padding:0.2rem 0.5rem;">
                  <button class="qty-btn" type="button" onclick="adjustFlowQty(-1)" style="border:none;background:none;cursor:pointer;padding:0.3rem 0.6rem;font-size:1.1rem;font-weight:700;color:var(--maroon-dark);">−</button>
                  <span id="flowQtyDisplay" style="min-width:30px;text-align:center;font-weight:700;font-size:0.95rem;">${shopState.selectionQty || 1}</span>
                  <button class="qty-btn" type="button" onclick="adjustFlowQty(1)" style="border:none;background:none;cursor:pointer;padding:0.3rem 0.6rem;font-size:1.1rem;font-weight:700;color:var(--maroon-dark);">+</button>
                </div>

                <!-- Action buttons -->
                <button class="btn btn-primary" type="button" onclick="addFlowSelectionToCart()" ${!inStock ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''} style="padding:0.75rem 1.75rem;font-size:0.95rem;">
                  🛒 Add to Cart
                </button>
                <button class="btn btn-maroon" type="button" onclick="buyFlowSelectionNow()" ${!inStock ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''} style="padding:0.75rem 1.5rem;font-size:0.95rem;">
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function selectFlowSubcategory(sub) {
  shopState.selectedSubcategory = sub;
  const category = CATEGORIES.find(c => c.id === shopState.category);
  if (category && category.hasSize) {
    const sizes = window.MehndiDB ? window.MehndiDB.getSizes(category.id, sub) : [];
    if (sizes.length > 0 && (!shopState.selectedSize || !sizes.includes(shopState.selectedSize))) {
      shopState.selectedSize = sizes[0];
    }
  }
  renderSelectionFlow();
  renderShopGrid();
}

function selectFlowSize(sz) {
  shopState.selectedSize = sz;
  renderSelectionFlow();
  renderShopGrid();
}

function adjustFlowQty(delta) {
  shopState.selectionQty = Math.max(1, (shopState.selectionQty || 1) + delta);
  const el = document.getElementById('flowQtyDisplay');
  if (el) el.textContent = shopState.selectionQty;
}

function addFlowSelectionToCart() {
  if (!shopState.activeVariationSku) {
    showToast('⚠️ Please select a variation first.');
    return;
  }
  addToCart(shopState.activeVariationSku, shopState.selectionQty || 1);
  shopState.selectionQty = 1;
  const el = document.getElementById('flowQtyDisplay');
  if (el) el.textContent = 1;
}

function buyFlowSelectionNow() {
  if (!shopState.activeVariationSku) {
    showToast('⚠️ Please select a variation first.');
    return;
  }
  addToCart(shopState.activeVariationSku, shopState.selectionQty || 1);
  if (typeof orderOnWhatsApp === 'function') {
    orderOnWhatsApp();
  } else {
    openCheckout();
  }
}

// ── Product Modal (Quick View) ────────────────────────────────
let currentModalSku = null;
let currentImgIdx = 0;
let currentTab = 'description';
let modalQty = 1;

function openProductModal(skuOrId) {
  refreshDataFromDB();
  let p = null;
  if (window.MehndiDB) {
    p = window.MehndiDB.getVariation(skuOrId);
  }
  if (!p) {
    p = PRODUCTS.find(item => item.sku === skuOrId || item.id === skuOrId);
  }
  if (!p) return;

  currentModalSku = p.sku;
  currentImgIdx = 0;
  currentTab = 'description';
  modalQty = 1;
  renderProductModal(p);

  const modalOverlay = document.getElementById('productModalOverlay') || document.getElementById('productModal')?.parentElement;
  if (modalOverlay) {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeProductModal() {
  const modalOverlay = document.getElementById('productModalOverlay') || document.getElementById('productModal')?.parentElement;
  if (modalOverlay) modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderProductModal(p) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const price = Number(p.price);
  const orig = p.original ? Number(p.original) : null;
  const disc = orig && orig > price ? Math.round((1 - price / orig) * 100) : 0;
  const rating = Number(p.rating || 4.8);
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  const inStock = p.stock !== 'out-of-stock';
  const category = CATEGORIES.find(c => c.id === p.categoryId);
  const siblingVars = window.MehndiDB ? window.MehndiDB.getVariationsByCategory(p.categoryId) : [];
  const imgs = p.imgs && p.imgs.length > 0 ? p.imgs : [p.img || 'images/mehndi_cones.jpg'];

  modal.innerHTML = `
    <button class="modal-close" onclick="closeProductModal()">✕</button>
    <div class="modal-gallery">
      <img id="modalMainImg" class="modal-main-img" src="${imgs[0]}" alt="${p.name}">
      <div class="modal-thumbs">
        ${imgs.map((img, i) => `
          <img class="modal-thumb ${i === 0 ? 'active' : ''}" src="${img}" alt="${p.name} ${i + 1}" onclick="switchModalImg(${i})">
        `).join('')}
      </div>
    </div>
    <div class="modal-info">
      <div class="modal-category">${p.categoryName || category?.name || 'Mehndi Product'}</div>
      <h2 class="modal-name">${p.name}</h2>
      
      <div class="modal-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">${rating} (${p.reviews || 95} reviews)</span>
      </div>

      <div class="modal-price-row">
        <span class="modal-price">₹${price.toLocaleString()}</span>
        ${orig && orig > price ? `<span class="modal-original">₹${orig.toLocaleString()}</span><span class="badge badge-sale">${disc}% off</span>` : ''}
      </div>

      <div class="stock-badge ${inStock ? 'in-stock' : 'low-stock'}">
        <span class="stock-dot"></span>
        ${inStock ? 'In Stock & Ready to Dispatch' : 'Out of Stock'}
      </div>

      <!-- Quick Variant Switcher inside Modal -->
      ${siblingVars.length > 1 ? `
        <div style="margin:1rem 0;padding:0.75rem;background:var(--cream);border-radius:var(--radius-sm);border:1px solid var(--border);">
          <div style="font-size:0.78rem;font-weight:700;color:var(--maroon-dark);margin-bottom:0.4rem;">
            Available Options (${siblingVars.length}):
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;max-height:110px;overflow-y:auto;">
            ${siblingVars.map(v => {
              const active = v.sku === p.sku;
              const label = [v.subCategory, v.variation].filter(Boolean).join(' • ') || v.name;
              return `
                <button type="button" onclick="openProductModal('${v.sku}')"
                  style="font-size:0.75rem;padding:0.3rem 0.65rem;border-radius:14px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};background:${active ? 'var(--gold)' : 'var(--white)'};color:${active ? 'var(--white)' : 'var(--text-dark)'};cursor:pointer;font-weight:${active ? '700' : '500'};">
                  ${label}
                </button>`;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div class="modal-tabs">
        <button class="modal-tab ${currentTab === 'description' ? 'active' : ''}" onclick="switchModalTab('description')">Description</button>
        <button class="modal-tab ${currentTab === 'ingredients' ? 'active' : ''}" onclick="switchModalTab('ingredients')">Ingredients</button>
        <button class="modal-tab ${currentTab === 'usage' ? 'active' : ''}" onclick="switchModalTab('usage')">How to Use</button>
        <button class="modal-tab ${currentTab === 'benefits' ? 'active' : ''}" onclick="switchModalTab('benefits')">Benefits</button>
      </div>

      <div class="modal-tab-content" id="modalTabContent">
        ${renderTabContent(p, currentTab)}
      </div>

      <div class="modal-actions" style="margin-top:1.5rem;">
        <div class="modal-qty">
          <button class="qty-btn" onclick="adjustModalQty(-1)">−</button>
          <span class="qty-num" id="modalQty">1</span>
          <button class="qty-btn" onclick="adjustModalQty(1)">+</button>
        </div>
        <button class="btn btn-primary" onclick="addToCartFromModal()" ${!inStock ? 'disabled style="opacity:0.6;"' : ''}>🛒 Add to Cart</button>
        <button class="btn btn-maroon" onclick="buyNowFromModal()" ${!inStock ? 'disabled style="opacity:0.6;"' : ''}>Buy Now</button>
      </div>

      <div style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center;">
        <button class="product-action-btn ${isWishlisted(p.sku) ? 'wishlisted' : ''}" data-wishlist-sku="${p.sku}" onclick="toggleWishlist('${p.sku}')" style="width:36px;height:36px;">
          ${isWishlisted(p.sku) ? '❤️' : '🤍'}
        </button>
        <span style="font-size:0.8rem; color:var(--text-light)">Add to Wishlist</span>
      </div>
    </div>
  `;
}

function renderTabContent(p, tab) {
  switch (tab) {
    case 'description': return `<p>${p.description || 'Premium quality henna product for artists and enthusiasts.'}</p>`;
    case 'ingredients': return `<ul>${(p.ingredients || ['100% Organic Henna Extract', 'Pure Essential Oils']).map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'usage':       return `<ul>${(p.usage || ['Apply to clean dry skin', 'Leave for several hours', 'Avoid contact with water for first 24 hours']).map((u, i) => `<li>${i + 1}. ${u}</li>`).join('')}</ul>`;
    case 'benefits':    return `<ul>${(p.benefits || ['Deep natural stain', 'Gentle on skin', 'Long lasting color']).map(b => `<li>✓ ${b}</li>`).join('')}</ul>`;
    default: return '';
  }
}

function switchModalTab(tab) {
  currentTab = tab;
  const p = window.MehndiDB ? window.MehndiDB.getVariation(currentModalSku) : PRODUCTS.find(i => i.sku === currentModalSku);
  if (!p) return;
  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.textContent.toLowerCase().includes(tab.toLowerCase()) || (tab === 'usage' && t.textContent.includes('How')));
  });
  const contentEl = document.getElementById('modalTabContent');
  if (contentEl) contentEl.innerHTML = renderTabContent(p, tab);
}

function switchModalImg(idx) {
  currentImgIdx = idx;
  const p = window.MehndiDB ? window.MehndiDB.getVariation(currentModalSku) : PRODUCTS.find(i => i.sku === currentModalSku);
  if (!p) return;
  const imgs = p.imgs || [p.img];
  const mainImg = document.getElementById('modalMainImg');
  if (mainImg && imgs[idx]) mainImg.src = imgs[idx];
  document.querySelectorAll('.modal-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}

function adjustModalQty(delta) {
  modalQty = Math.max(1, (modalQty || 1) + delta);
  const el = document.getElementById('modalQty');
  if (el) el.textContent = modalQty;
}

function addToCartFromModal() {
  if (currentModalSku) {
    addToCart(currentModalSku, modalQty || 1);
    closeProductModal();
    openCart();
  }
}

function buyNowFromModal() {
  if (currentModalSku) {
    addToCart(currentModalSku, modalQty || 1);
    closeProductModal();
    if (typeof orderOnWhatsApp === 'function') {
      orderOnWhatsApp();
    } else {
      openCheckout();
    }
  }
}

function buyNow(skuOrId) {
  addToCart(skuOrId);
  if (typeof orderOnWhatsApp === 'function') {
    orderOnWhatsApp();
  } else {
    openCheckout();
  }
}

// ── Shop Page Init ────────────────────────────────────────────
function initShopPage() {
  refreshDataFromDB();
  buildSidebar();
  renderSelectionFlow();
  renderShopGrid();
  initShopSearch();
}

function buildSidebar() {
  const catList = document.getElementById('sidebarCategories');
  if (!catList) return;

  refreshDataFromDB();

  let html = `
    <div class="sidebar-cat-item ${shopState.category === 'all' ? 'active' : ''}" onclick="setCategory('all')">
      <span>🌿 All Products</span>
      <span class="sidebar-cat-count">${PRODUCTS.length}</span>
    </div>
  `;

  html += CATEGORIES.map(cat => {
    const count = PRODUCTS.filter(p => p.categoryId === cat.id).length;
    return `
      <div class="sidebar-cat-item ${shopState.category === cat.id ? 'active' : ''}" onclick="setCategory('${cat.id}')">
        <span>${cat.icon} ${cat.name}</span>
        <span class="sidebar-cat-count">${count}</span>
      </div>`;
  }).join('');

  catList.innerHTML = html;
}

function setCategory(catId) {
  shopState.category = catId;
  shopState.selectedSubcategory = null;
  shopState.selectedSize = null;
  shopState.selectionQty = 1;

  buildSidebar();
  renderSelectionFlow();
  renderShopGrid();

  // Smooth scroll to selection box on mobile
  if (window.innerWidth <= 768) {
    const flowBox = document.getElementById('productSelectionFlowBox');
    if (flowBox) flowBox.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderShopGrid() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  const products = getFilteredProducts();
  const countEl = document.getElementById('shopCount');
  if (countEl) {
    countEl.textContent = `${products.length} product variation${products.length !== 1 ? 's' : ''} available`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-light);">
        <div style="font-size:3rem;margin-bottom:1rem">🌿</div>
        <h3 style="color:var(--maroon-dark)">No products match your criteria</h3>
        <p style="margin-top:0.5rem">Try clearing search or filters to see all available items.</p>
        <button class="btn btn-outline btn-sm" onclick="setCategory('all');document.getElementById('shopSearchInput').value='';shopState.search='';renderShopGrid();" style="margin-top:1rem">Reset All Filters</button>
      </div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => productCardHTML(p, i % 4)).join('');

  setTimeout(() => {
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 50);
}

function initShopSearch() {
  const input = document.getElementById('shopSearchInput');
  if (input) {
    input.addEventListener('input', () => {
      shopState.search = input.value.trim();
      renderShopGrid();
    });
  }

  const sortSel = document.getElementById('shopSort');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      shopState.sort = sortSel.value;
      renderShopGrid();
    });
  }

  const priceSlider = document.getElementById('priceSlider');
  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      shopState.maxPrice = parseInt(priceSlider.value);
      const maxEl = document.getElementById('priceMax');
      if (maxEl) maxEl.textContent = '₹' + priceSlider.value;
      updatePriceSliderFill(priceSlider);
      renderShopGrid();
    });
  }

  document.querySelectorAll('[data-filter]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.dataset.filter === 'bestseller') shopState.showBestSellers = cb.checked;
      if (cb.dataset.filter === 'new')        shopState.showNewArrivals = cb.checked;
      if (cb.dataset.filter === 'sale')       shopState.showOnSale = cb.checked;
      renderShopGrid();
    });
  });
}

function updatePriceSliderFill(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--gold) ${pct}%, var(--cream-dark) ${pct}%)`;
}

// ── Featured Products on Home Page ───────────────────────────
function initHomeFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  refreshDataFromDB();
  const featured = PRODUCTS.slice(0, 6);
  grid.innerHTML = featured.map((p, i) => productCardHTML(p, i)).join('');
  setTimeout(() => {
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 200);
}

// ── Search Overlay ───────────────────────────────────────────
function initSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const input   = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!overlay || !input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    refreshDataFromDB();
    const found = PRODUCTS.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q))
    ).slice(0, 8);

    results.innerHTML = found.length
      ? found.map(p => `
          <div class="search-result-item" onclick="openProductModal('${p.sku}');closeSearch()">
            <img class="search-result-img" src="${p.img}" alt="${p.name}">
            <div>
              <div class="search-result-name">${p.name}</div>
              <div class="search-result-price">₹${Number(p.price).toLocaleString()}</div>
            </div>
          </div>`).join('')
      : '<p style="padding:1rem;color:var(--text-light);text-align:center">No products found</p>';
  });
}

function openSearch()  { document.getElementById('searchOverlay')?.classList.add('open'); document.getElementById('searchInput')?.focus(); }
function closeSearch() { document.getElementById('searchOverlay')?.classList.remove('open'); }

// ── Toast Notification ────────────────────────────────────────
function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ── Expose Globally ───────────────────────────────────────────
window.shopState            = shopState;
window.PRODUCTS             = PRODUCTS;
window.CATEGORIES           = CATEGORIES;
window.productCardHTML      = productCardHTML;
window.renderSelectionFlow  = renderSelectionFlow;
window.selectFlowSubcategory= selectFlowSubcategory;
window.selectFlowSize       = selectFlowSize;
window.adjustFlowQty        = adjustFlowQty;
window.addFlowSelectionToCart = addFlowSelectionToCart;
window.buyFlowSelectionNow  = buyFlowSelectionNow;
window.openProductModal     = openProductModal;
window.closeProductModal    = closeProductModal;
window.switchModalTab       = switchModalTab;
window.switchModalImg       = switchModalImg;
window.adjustModalQty       = adjustModalQty;
window.addToCartFromModal   = addToCartFromModal;
window.buyNowFromModal      = buyNowFromModal;
window.buyNow               = buyNow;
window.toggleWishlist       = toggleWishlist;
window.isWishlisted         = isWishlisted;
window.renderWishlistBtns   = renderWishlistBtns;
window.setCategory          = setCategory;
window.initShopPage         = initShopPage;
window.initHomeFeatured     = initHomeFeatured;
window.initSearchOverlay    = initSearchOverlay;
window.openSearch           = openSearch;
window.closeSearch          = closeSearch;
window.showToast            = showToast;
window.getFilteredProducts  = getFilteredProducts;
window.updatePriceSliderFill= updatePriceSliderFill;
window.refreshDataFromDB    = refreshDataFromDB;

// Intercept in-page category menu clicks for instant transition
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="mehndiproduct.html?cat="]').forEach(link => {
    link.addEventListener('click', e => {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      if (currentPath === 'mehndiproduct.html') {
        const href = link.getAttribute('href');
        const match = href.match(/cat=([^&]+)/);
        if (match && match[1]) {
          e.preventDefault();
          setCategory(match[1]);
          window.history.pushState(null, '', 'mehndiproduct.html?cat=' + match[1]);
          document.querySelector('.mobile-nav')?.classList.remove('open');
          document.querySelector('.hamburger')?.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });
});

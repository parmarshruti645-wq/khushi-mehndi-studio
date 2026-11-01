/* ============================================================
   MEHNDI STUDIO — Cart & WhatsApp Order Module
   Replaces online payment with direct WhatsApp & Call orders.
   Contact Number: +91 78018 75673
   ============================================================ */

const STUDIO_PHONE = '+91 78018 75673';
const STUDIO_PHONE_CLEAN = '917801875673';
const STUDIO_WHATSAPP_BASE = 'https://wa.me/917801875673';
const STUDIO_CALL_URL = 'tel:+917801875673';

// ── Cart State ────────────────────────────────────────────────
let cartItems = JSON.parse(localStorage.getItem('mehndi_cart') || '[]');

function saveCart() {
  localStorage.setItem('mehndi_cart', JSON.stringify(cartItems));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cartItems.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ── Add / Remove / Update ─────────────────────────────────────
function addToCart(identifier, qty = 1, extraOptions = null) {
  let product = null;

  if (window.MehndiDB) {
    if (typeof identifier === 'string') {
      product = window.MehndiDB.getVariation(identifier) || window.MehndiDB.getSoap(identifier);
    } else if (typeof identifier === 'number') {
      const allVars = window.MehndiDB.getAllVariations();
      product = allVars[identifier - 1] || allVars.find(v => v.sku === 'SKU-' + identifier);
    }
  }

  if (!product && window.SOAPS) {
    product = window.SOAPS.find(s => s.sku === identifier || s.id === identifier);
  }

  if (!product && window.DEFAULT_SOAPS) {
    product = window.DEFAULT_SOAPS.find(s => s.sku === identifier || s.id === identifier);
  }

  if (!product && window.PRODUCTS) {
    product = window.PRODUCTS.find(p => p.sku === identifier || p.id === identifier);
  }

  if (!product && typeof identifier === 'object') {
    product = identifier;
  }

  if (!product) {
    console.warn('Product not found for addToCart:', identifier);
    return;
  }

  const categoryId = product.categoryId || product.category || 'mehndi-product';
  const categoryName = product.categoryName || (window.MehndiDB?.getCategory(categoryId)?.name) || (categoryId === 'soap' ? 'Handmade Soap' : 'Mehndi Product');
  const subCategory = product.subCategory || extraOptions?.subCategory || null;
  const variation = extraOptions?.variantName || extraOptions?.variant || extraOptions?.variation || product.variation || null;
  const name = product.name || 'Product';
  const price = Number(extraOptions?.price !== undefined ? extraOptions.price : product.price) || 0;
  const img = product.img || (product.imgs && product.imgs[0]) || 'images/mehndi cone.jpeg';

  const variantSlug = variation ? ('-' + String(variation).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) : '';
  const sku = extraOptions?.customSku || (product.sku ? product.sku + (variation && !product.sku.endsWith(variantSlug) ? variantSlug : '') : (product.id ? String(product.id) + variantSlug : ('sku-' + Date.now())));

  const existing = cartItems.find(i => (i.sku && i.sku === sku) || (i.id && i.id === sku));

  if (existing) {
    existing.qty += qty;
  } else {
    cartItems.push({
      id: sku,
      sku: sku,
      categoryId,
      categoryName,
      subCategory,
      variation,
      name,
      price,
      img,
      qty: Math.max(1, qty)
    });
  }

  saveCart();
  renderCartDrawer();

  const variantText = [subCategory, variation].filter(Boolean).join(' • ');
  const toastMsg = (categoryId === 'soap')
    ? `🧼 Added: ${name}${variantText ? ` (${variantText})` : ''}`
    : (variantText ? `🌿 Added: ${categoryName} (${variantText})` : `🌿 Added: ${name}`);
  showToast(toastMsg);
}

function removeCartItem(identifier) {
  cartItems = cartItems.filter(i => i.sku !== identifier && i.id !== identifier);
  saveCart();
  renderCartDrawer();
}

function updateCartQty(identifier, delta) {
  const item = cartItems.find(i => i.sku === identifier || i.id === identifier);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCartDrawer();
}

// ── Cart Totals ───────────────────────────────────────────────
function getCartSubtotal() {
  return cartItems.reduce((s, i) => s + (Number(i.price) * Number(i.qty)), 0);
}

function getCartShipping() {
  return getCartSubtotal() >= 499 || getCartSubtotal() === 0 ? 0 : 49;
}

function getCartTotal() {
  return getCartSubtotal() + getCartShipping();
}

// ── Render Cart Drawer ────────────────────────────────────────
function renderCartDrawer() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl) return;

  if (cartItems.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h4 style="color:var(--maroon-dark);font-family:var(--font-heading)">Your Cart is Empty</h4>
        <p>Explore our mehndi product categories and add products to order via WhatsApp or phone!</p>
        <a href="mehndiproduct.html" class="btn btn-primary btn-sm" style="margin-top:0.5rem" onclick="closeCart()">Browse Shop</a>
      </div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cartItems.map(item => {
    const itemKey = item.sku || item.id;
    const hasVariant = item.subCategory || item.variation;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.categoryName || item.name}</div>
          ${hasVariant ? `
            <div class="cart-variant-badges" style="display:flex;gap:0.35rem;flex-wrap:wrap;margin:0.2rem 0;">
              ${item.subCategory ? `<span style="font-size:0.7rem;background:var(--cream);border:1px solid var(--border);border-radius:12px;padding:0.1rem 0.5rem;color:var(--maroon-dark);font-weight:600;">${item.subCategory}</span>` : ''}
              ${item.variation ? `<span style="font-size:0.7rem;background:rgba(201,151,58,0.15);border:1px solid var(--gold);border-radius:12px;padding:0.1rem 0.5rem;color:var(--gold-dark);font-weight:600;">${item.variation}</span>` : ''}
            </div>` : ''}
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQty('${itemKey}', -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty('${itemKey}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem('${itemKey}')" title="Remove">🗑️</button>
      </div>`;
  }).join('');

  if (footerEl) {
    footerEl.style.display = 'block';
    const subtotal = getCartSubtotal();
    const shipping = getCartShipping();
    const remainingForFree = Math.max(0, 499 - subtotal);

    footerEl.innerHTML = `
      <div class="cart-total-row">
        <span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span>
      </div>
      <div class="cart-total-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? '<span style="color:var(--emerald);font-weight:600">FREE</span>' : '₹' + shipping}</span>
      </div>
      ${shipping > 0 ? `<p style="font-size:0.75rem;color:var(--text-light);margin:0.25rem 0">Add ₹${remainingForFree} more for free shipping!</p>` : ''}
      <div class="cart-total-row grand">
        <span>Total</span><span>₹${getCartTotal().toLocaleString()}</span>
      </div>

      <!-- WhatsApp Order Action -->
      <button class="cart-checkout-btn" onclick="openCheckout()" style="background:linear-gradient(135deg, #25D366 0%, #128C7E 100%);box-shadow:0 4px 14px rgba(37,211,102,0.35);">
        💬 Order on WhatsApp →
      </button>

      <div style="display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-top:0.75rem;font-size:0.8rem;">
        <a href="${STUDIO_CALL_URL}" style="color:var(--maroon-dark);font-weight:600;text-decoration:none;">📞 Call: ${STUDIO_PHONE}</a>
        <span style="color:var(--border);">•</span>
        <a href="mehndiproduct.html" onclick="closeCart()" style="color:var(--text-light);text-decoration:none;">Continue Shopping</a>
      </div>`;
  }
}

// ── Drawer Open/Close ─────────────────────────────────────────
function openCart() {
  renderCartDrawer();
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Checkout Modal ────────────────────────────────────────────
function openCheckout() {
  closeCart();
  const overlay = document.getElementById('checkoutOverlay');
  if (!overlay) {
    createCheckoutModal();
    return;
  }
  renderCheckoutSummary();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderCheckoutSummary() {
  const summaryBox = document.getElementById('checkoutSummaryBox');
  if (!summaryBox) return;

  summaryBox.innerHTML = `
    <h4 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center;">
      <span>Order Summary (${cartItems.length} items)</span>
      <span style="font-size:0.8rem;color:var(--gold);font-weight:600;">₹${getCartTotal().toLocaleString()}</span>
    </h4>
    <div style="max-height:220px;overflow-y:auto;padding-right:0.25rem;">
      ${cartItems.map(item => {
        const variantText = [item.subCategory, item.variation].filter(Boolean).join(' • ');
        return `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;font-size:0.875rem;padding:0.45rem 0;border-bottom:1px solid var(--border);">
            <div style="flex:1;padding-right:0.75rem;">
              <div style="font-weight:600;color:var(--maroon-dark)">${item.categoryName || item.name}</div>
              ${variantText ? `<div style="font-size:0.75rem;color:var(--gold-dark);font-weight:500;">${variantText}</div>` : ''}
              <div style="font-size:0.75rem;color:var(--text-light)">Qty: ${item.qty} × ₹${item.price.toLocaleString()}</div>
            </div>
            <span style="font-weight:700;color:var(--maroon-dark)">₹${(item.price * item.qty).toLocaleString()}</span>
          </div>`;
      }).join('')}
    </div>
    <div style="margin-top:0.75rem;padding-top:0.5rem;border-top:1.5px dashed var(--border);">
      <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-mid);margin-bottom:0.25rem;">
        <span>Subtotal</span><span>₹${getCartSubtotal().toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-mid);margin-bottom:0.25rem;">
        <span>Shipping</span><span>${getCartShipping() === 0 ? 'FREE' : '₹' + getCartShipping()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.05rem;color:var(--maroon-dark);margin-top:0.5rem;">
        <span>Total Amount</span><span style="color:var(--gold)">₹${getCartTotal().toLocaleString()}</span>
      </div>
    </div>
  `;
}

function createCheckoutModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'checkoutOverlay';
  overlay.innerHTML = `
    <div style="background:var(--white);border-radius:var(--radius-lg);width:min(580px,100%);max-height:92vh;overflow-y:auto;padding:2.25rem;position:relative;box-shadow:var(--shadow-deep);">
      <button class="modal-close" onclick="closeCheckout()">✕</button>
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="font-size:2.2rem;margin-bottom:0.25rem;">🌿</div>
        <h2 style="font-family:var(--font-heading);color:var(--maroon-dark)">Direct WhatsApp & Call Order</h2>
        <p style="font-size:0.85rem;color:var(--text-light)">Order directly with Mehndi Studio on <strong>${STUDIO_PHONE}</strong></p>
      </div>

      <!-- Order Summary with exact variations -->
      <div id="checkoutSummaryBox" style="background:var(--cream);border-radius:var(--radius-md);padding:1.25rem;margin-bottom:1.25rem;border:1px solid var(--border);"></div>

      <!-- Delivery Details (Included automatically in WhatsApp message) -->
      <div style="background:var(--white);border-radius:var(--radius-md);padding:1.25rem;margin-bottom:1.25rem;border:1.5px solid var(--border);">
        <h4 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.4rem;">📍 Delivery Details (Optional)</h4>
        <p style="font-size:0.75rem;color:var(--text-light);margin-bottom:0.75rem;">Your name and address will be neatly formatted into your WhatsApp order message.</p>
        
        <div class="form-group" style="margin-bottom:0.75rem;">
          <label class="form-label" style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem;">Full Name</label>
          <input type="text" class="form-control" placeholder="e.g. Shruti Patel" id="checkoutName" style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);outline:none;">
        </div>
        <div class="form-group" style="margin-bottom:0.75rem;">
          <label class="form-label" style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem;">Phone Number</label>
          <input type="tel" class="form-control" placeholder="+91 78018 75673" id="checkoutPhone" style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);outline:none;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem;">Complete Delivery Address</label>
          <textarea class="form-control" rows="2" placeholder="House/Flat no., Street, City, State, PIN" id="checkoutAddr" style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);outline:none;font-family:inherit;"></textarea>
        </div>
      </div>

      <!-- REPLACED PAYMENT METHOD: 2 CONTACT OPTIONS (WhatsApp Us & Call Us) -->
      <div style="background:var(--cream);border-radius:var(--radius-md);padding:1.25rem;margin-bottom:1.25rem;border:1px solid var(--border);">
        <h4 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.75rem;">
          📞 Direct Studio Contact Options
        </h4>
        <div class="checkout-contact-grid">
          <!-- Option 1: WhatsApp Us -->
          <div class="checkout-contact-card card-whatsapp">
            <div>
              <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:#128C7E;font-size:0.95rem;">
                <svg viewBox="0 0 32 32" width="20" height="20" fill="#25D366"><path d="M16.002 0C7.164 0 0 7.163 0 16.002c0 2.825.738 5.586 2.14 8.016L.092 31.908l8.093-2.123a15.93 15.93 0 0 0 7.817 2.036h.007c8.834 0 16-7.163 16-16.002 0-4.275-1.665-8.295-4.689-11.319C24.295 1.477 20.276 0 16.002 0zm0 29.351h-.006a13.3 13.3 0 0 1-6.78-1.854l-.486-.289-5.045 1.323 1.346-4.918-.316-.503a13.29 13.29 0 0 1-2.042-7.108c0-7.362 5.99-13.352 13.354-13.352 3.567 0 6.92 1.39 9.442 3.912a13.27 13.27 0 0 1 3.91 9.444c0 7.363-5.99 13.353-13.354 13.353zm7.323-9.998c-.401-.201-2.375-1.172-2.743-1.306-.367-.134-.635-.201-.902.201-.268.402-1.037 1.306-1.271 1.574-.234.268-.469.301-.87.1-.401-.201-1.695-.625-3.23-1.993-1.194-1.065-2.001-2.381-2.235-2.783-.234-.402-.025-.619.176-.819.181-.18.401-.469.602-.703.201-.234.268-.402.402-.67.134-.268.067-.502-.034-.703-.1-.201-.903-2.176-1.237-2.979-.326-.783-.657-.677-.903-.689l-.77-.014c-.268 0-.702.1-.1.07.502.368.402 1.405 1.54 1.405 3.754 0 2.214 1.611 4.354 1.835 4.655.224.301 3.169 4.839 7.676 6.786 1.072.463 1.909.74 2.562.947 1.077.342 2.057.294 2.833.178.865-.129 2.375-.971 2.71-1.909.335-.938.335-1.742.234-1.909-.1-.168-.368-.268-.769-.469z"/></svg>
                WhatsApp Us
              </div>
              <div style="font-size:0.8rem;color:var(--text-mid);margin-top:0.25rem;">WhatsApp: <strong>${STUDIO_PHONE}</strong></div>
            </div>
            <a href="${STUDIO_WHATSAPP_BASE}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-chat">
              Chat on WhatsApp
            </a>
          </div>

          <!-- Option 2: Call Us -->
          <div class="checkout-contact-card card-call">
            <div>
              <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--maroon-dark);font-size:0.95rem;">
                <span style="font-size:1.15rem;">📞</span> Call Us
              </div>
              <div style="font-size:0.8rem;color:var(--text-mid);margin-top:0.25rem;">Contact: <strong>${STUDIO_PHONE}</strong></div>
            </div>
            <a href="${STUDIO_CALL_URL}" class="btn-call-studio">
              Call Now
            </a>
          </div>
        </div>
      </div>

      <!-- REPLACED PLACE ORDER BUTTON: WhatsApp & Call Action Buttons -->
      <div class="checkout-action-row">
        <button type="button" class="btn-whatsapp-lg" onclick="orderOnWhatsApp()">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="#ffffff" style="flex-shrink:0;"><path d="M16.002 0C7.164 0 0 7.163 0 16.002c0 2.825.738 5.586 2.14 8.016L.092 31.908l8.093-2.123a15.93 15.93 0 0 0 7.817 2.036h.007c8.834 0 16-7.163 16-16.002 0-4.275-1.665-8.295-4.689-11.319C24.295 1.477 20.276 0 16.002 0zm0 29.351h-.006a13.3 13.3 0 0 1-6.78-1.854l-.486-.289-5.045 1.323 1.346-4.918-.316-.503a13.29 13.29 0 0 1-2.042-7.108c0-7.362 5.99-13.352 13.354-13.352 3.567 0 6.92 1.39 9.442 3.912a13.27 13.27 0 0 1 3.91 9.444c0 7.363-5.99 13.353-13.354 13.353zm7.323-9.998c-.401-.201-2.375-1.172-2.743-1.306-.367-.134-.635-.201-.902.201-.268.402-1.037 1.306-1.271 1.574-.234.268-.469.301-.87.1-.401-.201-1.695-.625-3.23-1.993-1.194-1.065-2.001-2.381-2.235-2.783-.234-.402-.025-.619.176-.819.181-.18.401-.469.602-.703.201-.234.268-.402.402-.67.134-.268.067-.502-.034-.703-.1-.201-.903-2.176-1.237-2.979-.326-.783-.657-.677-.903-.689l-.77-.014c-.268 0-.702.1-.1.07.502.368.402 1.405 1.54 1.405 3.754 0 2.214 1.611 4.354 1.835 4.655.224.301 3.169 4.839 7.676 6.786 1.072.463 1.909.74 2.562.947 1.077.342 2.057.294 2.833.178.865-.129 2.375-.971 2.71-1.909.335-.938.335-1.742.234-1.909-.1-.168-.368-.268-.769-.469z"/></svg>
          Chat on WhatsApp
        </button>
        <a href="${STUDIO_CALL_URL}" class="btn-call-lg">
          📞 Call Now
        </a>
      </div>
      
      <div style="text-align:center;margin-top:0.85rem;font-size:0.75rem;color:var(--text-light);">
        ⚡ Clicking "Chat on WhatsApp" opens WhatsApp with your order items pre-filled!
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  renderCheckoutSummary();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── WhatsApp Order Generator ──────────────────────────────────
function generateWhatsAppOrderMessage(customer = {}) {
  const onlySoaps = cartItems.length > 0 && cartItems.every(i => i.categoryId === 'soap' || (i.categoryName && i.categoryName.toLowerCase().includes('soap')));
  let msg = onlySoaps
    ? `Hello! I want to order the following soaps.\n\n*Soap Order Details:*\n\n`
    : `Hello! I want to place an order.\n\n*Order Details:*\n\n`;

  cartItems.forEach((item, idx) => {
    const isSoap = item.categoryId === 'soap' || (item.categoryName && item.categoryName.toLowerCase().includes('soap'));
    
    if (isSoap) {
      msg += `${idx + 1}. Soap Name: ${item.name}\n`;
      msg += `   Variant: ${item.variation || '1 Bar'}\n`;
      msg += `   Quantity: ${item.qty}\n`;
      msg += `   Price: ₹${Number(item.price * item.qty).toLocaleString()}${item.qty > 1 ? ` (₹${Number(item.price).toLocaleString()} each)` : ''}\n\n`;
    } else {
      msg += `${idx + 1}. Product Name: ${item.categoryName || item.name}\n`;
      if (item.categoryId === 'mehndi-oil' || (item.name && item.name.toLowerCase().includes('oil') && item.subCategory)) {
        if (item.subCategory) msg += `   Oil Type: ${item.subCategory}\n`;
        if (item.variation) msg += `   Selected Size: ${item.variation}\n`;
      } else if (item.categoryId === 'mehndi-cones' || (item.name && item.name.toLowerCase().includes('cone') && item.subCategory)) {
        if (item.subCategory) msg += `   Cone Type: ${item.subCategory}\n`;
        if (item.variation) msg += `   Selected Size: ${item.variation}\n`;
      } else if (item.categoryId === 'mehndi-powder' || (item.name && item.name.toLowerCase().includes('powder') && item.variation)) {
        if (item.variation) msg += `   Selected Weight: ${item.variation}\n`;
      } else {
        if (item.subCategory) msg += `   Selected Type: ${item.subCategory}\n`;
        if (item.variation) msg += `   Selected Size/Quantity: ${item.variation}\n`;
      }
      msg += `   Quantity: ${item.qty}\n`;
      msg += `   Price: ₹${Number(item.price * item.qty).toLocaleString()}\n\n`;
    }
  });

  msg += `Total Amount: ₹${getCartTotal().toLocaleString()}\n\n`;

  // Delivery details if available
  const name = customer.name || document.getElementById('checkoutName')?.value?.trim();
  const phone = customer.phone || document.getElementById('checkoutPhone')?.value?.trim();
  const addr = customer.address || document.getElementById('checkoutAddr')?.value?.trim();

  if (name || phone || addr) {
    msg += `*Delivery Details:*\n`;
    if (name) msg += `Name: ${name}\n`;
    if (phone) msg += `Phone: ${phone}\n`;
    if (addr) msg += `Address: ${addr}\n`;
    msg += `\n`;
  }

  msg += `Please confirm my order and share the next steps.\n\nThank you!`;
  return msg;
}

// ── Place Order via WhatsApp ──────────────────────────────────
function orderOnWhatsApp() {
  if (cartItems.length === 0) {
    showToast('⚠️ Your cart is empty! Please add products before ordering.');
    // If empty, open standard WhatsApp chat
    window.open(STUDIO_WHATSAPP_BASE, '_blank');
    return;
  }

  const name = document.getElementById('checkoutName')?.value?.trim() || '';
  const phone = document.getElementById('checkoutPhone')?.value?.trim() || '';
  const addr = document.getElementById('checkoutAddr')?.value?.trim() || '';

  const orderId = 'MHD-' + Date.now().toString().slice(-6);

  // Preserve exact variations for database storage
  const orderItems = cartItems.map(item => ({
    sku: item.sku || item.id,
    categoryId: item.categoryId,
    categoryName: item.categoryName || item.name,
    subCategory: item.subCategory || null,
    variation: item.variation || null,
    name: item.name,
    price: Number(item.price),
    qty: Number(item.qty),
    total: Number(item.price) * Number(item.qty)
  }));

  const orderData = {
    id: orderId,
    customer: { name, phone, address: addr },
    items: orderItems,
    subtotal: getCartSubtotal(),
    shipping: getCartShipping(),
    total: getCartTotal(),
    paymentMethod: 'WhatsApp Order',
    status: 'Placed'
  };

  // 1. Save to Database so order history is preserved
  if (window.MehndiDB) {
    window.MehndiDB.saveOrder(orderData);
  } else {
    const existingOrders = JSON.parse(localStorage.getItem('mehndi_orders_v2') || '[]');
    existingOrders.unshift(orderData);
    localStorage.setItem('mehndi_orders_v2', JSON.stringify(existingOrders));
  }

  // 2. Generate formatted WhatsApp message
  const msg = generateWhatsAppOrderMessage({ name, phone, address: addr });
  const waUrl = `${STUDIO_WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;

  // 3. Save last order details for preservation
  localStorage.setItem('mehndi_last_order', JSON.stringify(orderData));
  cartItems = [];
  saveCart();
  closeCheckout();

  // 4. Directly open WhatsApp chat
  window.open(waUrl, '_blank');

  // 5. Display success dialog
  const successModal = document.createElement('div');
  successModal.className = 'modal-overlay open';
  successModal.innerHTML = `
    <div style="background:var(--white);border-radius:var(--radius-lg);width:min(480px,92vw);padding:2.5rem;text-align:center;position:relative;box-shadow:var(--shadow-deep);">
      <div style="font-size:3.5rem;margin-bottom:0.75rem;">💬</div>
      <h2 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.4rem;">Order Prepared!</h2>
      <p style="color:var(--text-mid);font-size:0.9rem;margin-bottom:1.25rem;">
        Your order <strong>#${orderId}</strong> details have been prepared for WhatsApp.
      </p>

      <div style="background:var(--cream);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:1.25rem;text-align:left;border:1px solid var(--border);font-size:0.85rem;">
        <div style="color:var(--maroon-dark);font-weight:700;margin-bottom:0.25rem;">Next Step:</div>
        <div style="color:var(--text-mid);line-height:1.5;">
          Please tap <strong>"Send"</strong> in WhatsApp to deliver your order summary to <strong>${STUDIO_PHONE}</strong>. Our team will instantly confirm and arrange delivery!
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.6rem;">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-lg" style="font-size:0.95rem;">
          💬 Open WhatsApp Again
        </a>
        <a href="${STUDIO_CALL_URL}" class="btn btn-call-lg" style="font-size:0.95rem;">
          📞 Call Studio: ${STUDIO_PHONE}
        </a>
        <button class="btn btn-outline" style="margin-top:0.5rem;" onclick="this.closest('.modal-overlay').remove();document.body.style.overflow='';">
          Continue Shopping
        </button>
      </div>
    </div>`;

  document.body.appendChild(successModal);
  successModal.addEventListener('click', e => {
    if (e.target === successModal) {
      successModal.remove();
      document.body.style.overflow = '';
    }
  });
}

// ── Soap Add-To-Cart & Buy Now Helpers ────────────────────────
function addSoapToCart(soapSku, variantName = null, qty = 1) {
  let soap = null;
  if (window.MehndiDB) soap = window.MehndiDB.getSoap(soapSku);
  if (!soap && window.DEFAULT_SOAPS) soap = window.DEFAULT_SOAPS.find(s => s.sku === soapSku || s.id === soapSku);
  if (!soap) {
    console.warn('Soap not found for sku:', soapSku);
    return;
  }

  // Find variant if specified
  let selectedVariant = null;
  if (variantName && soap.variants) {
    selectedVariant = soap.variants.find(v => v.name === variantName);
  }
  if (!selectedVariant && soap.variants && soap.variants.length > 0) {
    selectedVariant = soap.variants[0];
  }

  const vName = selectedVariant ? selectedVariant.name : (soap.unit === 'pouch' ? '200g Value Pack' : '1 Bar');
  const vPrice = selectedVariant ? Number(selectedVariant.price) : Number(soap.price);

  addToCart(soap, qty, {
    variant: vName,
    variantName: vName,
    price: vPrice,
    customSku: `${soap.sku}-${vName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
  });
}

function buySoapNow(soapSku, variantName = null, qty = 1) {
  addSoapToCart(soapSku, variantName, qty);
  if (typeof orderOnWhatsApp === 'function') {
    orderOnWhatsApp();
  } else {
    openCheckout();
  }
}

// ── Init ──────────────────────────────────────────────────────
function initCart() {
  updateCartBadge();
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('searchOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'searchOverlay') closeSearch();
  });
  if (typeof initSearchOverlay === 'function') initSearchOverlay();
}

// ── Expose ────────────────────────────────────────────────────
window.STUDIO_PHONE         = STUDIO_PHONE;
window.STUDIO_WHATSAPP_BASE = STUDIO_WHATSAPP_BASE;
window.STUDIO_CALL_URL      = STUDIO_CALL_URL;
window.cartItems            = cartItems;
window.addToCart            = addToCart;
window.addSoapToCart        = addSoapToCart;
window.buySoapNow           = buySoapNow;
window.removeCartItem       = removeCartItem;
window.updateCartQty        = updateCartQty;
window.openCart             = openCart;
window.closeCart            = closeCart;
window.openCheckout         = openCheckout;
window.closeCheckout        = closeCheckout;
window.orderOnWhatsApp      = orderOnWhatsApp;
window.generateWhatsAppOrderMessage = generateWhatsAppOrderMessage;
window.initCart             = initCart;
window.renderCartDrawer     = renderCartDrawer;
window.getCartTotal         = getCartTotal;
window.getCartSubtotal      = getCartSubtotal;
window.getCartShipping      = getCartShipping;

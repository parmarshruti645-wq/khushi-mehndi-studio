/* ============================================================
   MEHNDI STUDIO — Soap Products Shopping & Ordering Engine
   Connects 22 Handmade Soaps to Unified Cart & WhatsApp Orders.
   ============================================================ */

(function () {
  'use strict';

  // Per-soap selection state: { [sku]: { variant: '1 Bar', qty: 1 } }
  const soapState = {};
  const soapExpanded = {};

  function getSoapData() {
    if (window.MehndiDB && typeof window.MehndiDB.getSoaps === 'function') {
      return window.MehndiDB.getSoaps();
    }
    return window.DEFAULT_SOAPS || [];
  }

  function renderSoapGrid() {
    const container = document.getElementById('soapGrid');
    if (!container) return;

    const soaps = getSoapData();
    if (!soaps || soaps.length === 0) return;

    container.innerHTML = soaps.map(soap => {
      // Default state initialization if not yet set
      if (!soapState[soap.sku]) {
        const firstVar = (soap.variants && soap.variants[0]?.name) || (soap.unit === 'pouch' ? '200g Value Pack' : '1 Bar (Single)');
        soapState[soap.sku] = {
          variant: firstVar,
          qty: 1
        };
      }

      const activeState = soapState[soap.sku];
      const activeVar = soap.variants?.find(v => v.name === activeState.variant) || soap.variants?.[0];
      const displayPrice = activeVar ? Number(activeVar.price) : Number(soap.price);
      const displayOrig = activeVar?.original || soap.original;
      const inStock = soap.stock !== 'out-of-stock';
      const isExpanded = !!soapExpanded[soap.sku];

      return `
        <div class="soap-card ${isExpanded ? 'expanded' : ''}" id="${soap.id}" data-soap-sku="${soap.sku}">
          <!-- Soap Card Image -->
          <div class="soap-img-wrap" onclick="toggleSoapCard('${soap.sku}')" title="Click to view details">
            <img src="${soap.img}" alt="${soap.name}" loading="lazy" onerror="this.onerror=null;this.src='images/soap-placeholder.svg';">
            ${soap.badge ? `<span class="soap-badge">${soap.badge}</span>` : ''}
            ${soap.naturalBadge ? `<span class="soap-natural-badge">${soap.naturalBadge}</span>` : ''}
          </div>

          <!-- Soap Card Body -->
          <div class="soap-body">
            <div onclick="toggleSoapCard('${soap.sku}')" style="cursor:pointer">
              <h3 class="soap-name">${soap.name}</h3>
              <div style="display:flex;align-items:baseline;gap:0.4rem;margin-top:0.35rem;flex-wrap:wrap;">
                <div class="soap-price" id="price-display-${soap.sku}">₹${displayPrice.toLocaleString()}</div>
                ${displayOrig && displayOrig > displayPrice ? `<span style="text-decoration:line-through;color:#999;font-size:0.8rem">₹${displayOrig.toLocaleString()}</span>` : ''}
                <span class="soap-price-label">per ${activeState.variant.includes('Pack') || activeState.variant.includes('Box') ? 'pack' : (soap.unit || 'bar')}</span>
              </div>
              <div style="font-size:0.75rem;margin-top:0.25rem;font-weight:600;color:${inStock ? '#166534' : '#991b1b'};">
                ${inStock ? '● In Stock & Ready to Dispatch' : '✕ Currently Out of Stock'}
              </div>
            </div>

            <!-- Pack / Size Option Selector -->
            ${soap.variants && soap.variants.length > 0 ? `
              <div class="soap-variants-bar" onclick="event.stopPropagation()">
                <div class="soap-variant-label">Select Option:</div>
                <div class="soap-variant-pills">
                  ${soap.variants.map(v => {
                    const isActive = v.name === activeState.variant;
                    return `
                      <button type="button" class="soap-variant-pill ${isActive ? 'active' : ''}"
                        onclick="selectSoapVariant('${soap.sku}', '${v.name.replace(/'/g, "\\'")}', ${v.price});event.stopPropagation();">
                        ${v.name}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Quantity Stepper & Add to Cart / Buy Now -->
            <div class="soap-card-actions" onclick="event.stopPropagation()">
              <div class="soap-qty-picker">
                <button type="button" class="soap-qty-btn" onclick="adjustSoapQty('${soap.sku}', -1);event.stopPropagation();" aria-label="Decrease quantity">−</button>
                <span class="soap-qty-num" id="qty-display-${soap.sku}">${activeState.qty}</span>
                <button type="button" class="soap-qty-btn" onclick="adjustSoapQty('${soap.sku}', 1);event.stopPropagation();" aria-label="Increase quantity">+</button>
              </div>
              <div class="soap-btns-row">
                <button type="button" class="btn-soap-cart" onclick="handleSoapAddToCart('${soap.sku}');event.stopPropagation();" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                  🛒 Add to Cart
                </button>
                <button type="button" class="btn-soap-buy" onclick="handleSoapBuyNow('${soap.sku}');event.stopPropagation();" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            <div class="soap-click-hint" onclick="toggleSoapCard('${soap.sku}')" style="cursor:pointer">
              🔍 Tap to see benefits &amp; details <em class="hint-arrow">▼</em>
            </div>
          </div>

          <!-- Expandable Details Accordion -->
          <div class="soap-details">
            <div class="soap-details-inner">
              <div class="soap-detail-title">✦ Key Benefits</div>
              <ul class="soap-benefit-list">
                ${(soap.benefits || []).map(b => {
                  const parts = b.split(' — ');
                  if (parts.length === 2) {
                    return `<li><strong>${parts[0]}</strong> — ${parts[1]}</li>`;
                  }
                  return `<li>${b}</li>`;
                }).join('')}
              </ul>

              <div class="soap-how-to">
                <strong>🌿 How to Use:</strong>
                Lather with warm water on wet skin, gently massage over face and body for 1-2 minutes, then rinse clean. Keep on a draining dish for long-lasting bar life.
              </div>

              <!-- Quick Action Row Inside Expanded Details -->
              <div style="display:flex;gap:0.5rem;margin-top:1rem;" onclick="event.stopPropagation()">
                <button type="button" class="btn-soap-cart" style="padding:0.75rem;" onclick="handleSoapAddToCart('${soap.sku}');event.stopPropagation();" ${!inStock ? 'disabled style="opacity:0.5;"' : ''}>
                  🛒 Add to Cart
                </button>
                <button type="button" class="btn-soap-buy" style="padding:0.75rem;" onclick="handleSoapBuyNow('${soap.sku}');event.stopPropagation();" ${!inStock ? 'disabled style="opacity:0.5;"' : ''}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── User Interaction Handlers ───────────────────────────────
  function selectSoapVariant(sku, variantName, price) {
    if (!soapState[sku]) soapState[sku] = { variant: variantName, qty: 1 };
    soapState[sku].variant = variantName;

    // Update Card UI without collapsing
    const card = document.querySelector(`.soap-card[data-soap-sku="${sku}"]`);
    if (card) {
      card.querySelectorAll('.soap-variant-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === variantName);
      });
      const priceEl = document.getElementById(`price-display-${sku}`);
      if (priceEl) priceEl.textContent = `₹${Number(price).toLocaleString()}`;
    }
  }

  function adjustSoapQty(sku, delta) {
    if (!soapState[sku]) soapState[sku] = { variant: null, qty: 1 };
    soapState[sku].qty = Math.max(1, (soapState[sku].qty || 1) + delta);

    const qtyEl = document.getElementById(`qty-display-${sku}`);
    if (qtyEl) qtyEl.textContent = soapState[sku].qty;
  }

  function handleSoapAddToCart(sku) {
    const state = soapState[sku] || { variant: null, qty: 1 };
    if (typeof window.addSoapToCart === 'function') {
      window.addSoapToCart(sku, state.variant, state.qty || 1);
    } else if (typeof window.addToCart === 'function') {
      window.addToCart(sku, state.qty || 1, { variant: state.variant });
    }
  }

  function handleSoapBuyNow(sku) {
    const state = soapState[sku] || { variant: null, qty: 1 };
    if (typeof window.buySoapNow === 'function') {
      window.buySoapNow(sku, state.variant, state.qty || 1);
    } else {
      handleSoapAddToCart(sku);
      if (typeof window.orderOnWhatsApp === 'function') {
        window.orderOnWhatsApp();
      } else if (typeof window.openCheckout === 'function') {
        window.openCheckout();
      }
    }
  }

  function toggleSoapCard(sku) {
    soapExpanded[sku] = !soapExpanded[sku];
    // Close other expanded cards for accordion feel
    Object.keys(soapExpanded).forEach(k => {
      if (k !== sku) soapExpanded[k] = false;
    });

    document.querySelectorAll('.soap-card').forEach(card => {
      const cardSku = card.getAttribute('data-soap-sku');
      const isExp = !!soapExpanded[cardSku];
      card.classList.toggle('expanded', isExp);
    });

    const activeCard = document.querySelector(`.soap-card[data-soap-sku="${sku}"]`);
    if (activeCard && soapExpanded[sku]) {
      setTimeout(() => {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  // ── Global Exports ──────────────────────────────────────────
  window.selectSoapVariant   = selectSoapVariant;
  window.adjustSoapQty       = adjustSoapQty;
  window.handleSoapAddToCart = handleSoapAddToCart;
  window.handleSoapBuyNow    = handleSoapBuyNow;
  window.toggleSoapCard      = toggleSoapCard;
  window.renderSoapGrid      = renderSoapGrid;

  // ── Lifecycle Listeners ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderSoapGrid();
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  });

  // Re-render when admin updates prices or stock in real-time
  window.addEventListener('mehndi_soaps_updated', () => {
    renderSoapGrid();
  });

})();


/* ============================================================
   MEHNDI STUDIO — Main JS (Shared Logic)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initRevealAnimations();
  initTestimonialSlider();
  initFAQ();
  initNewsletter();
  if (typeof initCart === 'function') initCart();
  if (typeof initHomeFeatured === 'function') initHomeFeatured();
  if (typeof initShopPage === 'function') initShopPage();
  initProductModal();
  initMobileNav();
  initFloatingWhatsApp();
});

// ── Navigation ────────────────────────────────────────────────
function initNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  // Initial state based on scroll position
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// ── Mobile Nav ───────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));
}

// ── Testimonials Slider ───────────────────────────────────────
function initTestimonialSlider() {
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('testimonialDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoplay;

  function getVisible() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }
  function maxIdx() { return Math.max(0, total - getVisible()); }

  // Build dots
  if (dotsEl && total > 0) {
    dotsEl.innerHTML = Array.from({length: Math.ceil(total/getVisible())}, (_,i) =>
      `<span class="t-dot ${i===0?'active':''}" onclick="goToSlide(${i})"></span>`
    ).join('');
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    const pct = (current / total) * 100;
    track.style.transform = `translateX(-${pct}%)`;
    if (dotsEl) {
      const dotIdx = Math.floor(current / getVisible());
      dotsEl.querySelectorAll('.t-dot').forEach((d,i) => d.classList.toggle('active', i===dotIdx));
    }
  }

  window.goToSlide = (i) => { goTo(i * getVisible()); resetAuto(); };

  document.getElementById('testimonialPrev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('testimonialNext')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() { clearInterval(autoplay); autoplay = setInterval(() => { if(current >= maxIdx()) goTo(0); else goTo(current+1); }, 4500); }
  resetAuto();
  window.addEventListener('resize', () => goTo(current));
}

// ── FAQ Accordion ─────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Newsletter ────────────────────────────────────────────────
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input?.value.includes('@')) {
        if (typeof showToast === 'function') showToast('✅ You\'re subscribed! 10% OFF coupon sent to your email 🎁');
        input.value = '';
      } else {
        if (typeof showToast === 'function') showToast('⚠️ Please enter a valid email');
      }
    });
  });
}

// ── Product Modal Container ───────────────────────────────────
function initProductModal() {
  // Create modal overlay if not present
  if (!document.getElementById('productModal')) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'productModalOverlay';
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.id = 'productModal';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeProductModal(); });
  }

  // Cart elements
  if (!document.getElementById('cartDrawer')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
      <div class="cart-drawer" id="cartDrawer">
        <div class="cart-header">
          <h3>🛒 Your Cart</h3>
          <button class="cart-close" onclick="closeCart()">✕</button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer" id="cartFooter" style="display:none"></div>
      </div>
    `);
  }

  // Search overlay
  if (!document.getElementById('searchOverlay')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="search-overlay" id="searchOverlay">
        <div class="search-box">
          <div class="search-input-row">
            <span>🔍</span>
            <input type="text" id="searchInput" placeholder="Search mehndi products...">
            <button class="search-close-btn" onclick="closeSearch()">✕</button>
          </div>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>
    `);
    document.getElementById('searchOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'searchOverlay') closeSearch();
    });
  }

  if (typeof initSearchOverlay === 'function') initSearchOverlay();
}

// ── Lazy Images ───────────────────────────────────────────────
function lazyLoadImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.src = e.target.dataset.src; io.unobserve(e.target); }
    });
  });
  imgs.forEach(img => io.observe(img));
}

// ── Gallery Lightbox ──────────────────────────────────────────
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !items.length) return;

  const lb = { imgs: Array.from(items).map(i => ({ src: i.querySelector('img').src, title: i.querySelector('.gallery-item-title')?.textContent||'' })), cur: 0 };

  function show(idx) {
    lb.cur = (idx + lb.imgs.length) % lb.imgs.length;
    lightbox.querySelector('img').src = lb.imgs[lb.cur].src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  document.getElementById('lightboxClose')?.addEventListener('click', () => { lightbox.classList.remove('open'); document.body.style.overflow=''; });
  document.getElementById('lightboxPrev')?.addEventListener('click', () => show(lb.cur - 1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => show(lb.cur + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) { lightbox.classList.remove('open'); document.body.style.overflow=''; } });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  show(lb.cur - 1);
    if (e.key === 'ArrowRight') show(lb.cur + 1);
    if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow=''; }
  });
}

// ── Counter Animation ─────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// ── Floating WhatsApp Inquiry Button (Website-Wide) ─────────
function initFloatingWhatsApp() {
  if (document.getElementById('floatingWhatsAppBtn')) return;
  const btn = document.createElement('a');
  btn.id = 'floatingWhatsAppBtn';
  btn.className = 'floating-whatsapp-btn';
  btn.href = 'https://wa.me/917801875673?text=Hello!%20I%20want%20to%20inquire%20about%20your%20mehndi%20products%20and%20bridal%20services.';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat on WhatsApp with Mehndi Studio');
  btn.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.02C9.36 7.02 9.09 7.08 8.87 7.32C8.65 7.55 8.02 8.14 8.02 9.35C8.02 10.56 8.9 11.73 9.02 11.89C9.15 12.06 10.76 14.54 13.22 15.6C13.81 15.85 14.26 16 14.62 16.12C15.22 16.31 15.76 16.28 16.19 16.22C16.68 16.15 17.68 15.61 17.89 15.02C18.1 14.43 18.1 13.92 18.03 13.82C17.97 13.71 17.81 13.65 17.56 13.52C17.31 13.4 16.08 12.8 15.86 12.71C15.63 12.63 15.47 12.59 15.3 12.83C15.14 13.08 14.66 13.65 14.51 13.82C14.37 13.99 14.22 14.01 13.97 13.89C13.72 13.76 12.92 13.5 11.97 12.66C11.23 12 10.73 11.18 10.58 10.93C10.44 10.69 10.57 10.55 10.69 10.43C10.8 10.32 10.94 10.13 11.07 9.99C11.19 9.84 11.23 9.74 11.31 9.57C11.39 9.41 11.35 9.26 11.29 9.14C11.23 9.02 10.73 7.8 10.53 7.29C10.33 6.79 10.12 6.86 9.96 6.85C9.82 6.85 9.65 6.85 9.53 7.02Z"/>
    </svg>
    <span class="floating-whatsapp-tooltip">Chat with us on WhatsApp</span>
  `;
  document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  initGallery();
  initCounters();
});

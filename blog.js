/**
 * Khushi Mehndi Studio — Blog Engine
 * Handles 3 main submenus: Bridal Tips, Product Use, After Care
 * Synchronized with MehndiDB and Admin Panel
 */

(function () {
  'use strict';

  let currentCategory = 'all';

  // Read URL query parameter: ?cat=bridal-tips | product-use | after-care | all
  function getQueryCategory() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat && ['bridal-tips', 'product-use', 'after-care', 'all'].includes(cat.toLowerCase())) {
      return cat.toLowerCase();
    }
    return 'all';
  }

  function initBlog() {
    currentCategory = getQueryCategory();
    renderCategoryPills();
    updateBlogHero();
    renderBlogContent();

    // Listen to admin panel blog updates
    window.addEventListener('mehndi_blogs_updated', () => {
      renderBlogContent();
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      currentCategory = getQueryCategory();
      renderCategoryPills();
      updateBlogHero();
      renderBlogContent();
    });
  }

  // Update Hero section text according to selected category
  function updateBlogHero() {
    const heroTitle = document.getElementById('blogHeroTitle');
    const heroDesc = document.getElementById('blogHeroDesc');
    const heroBreadcrumb = document.getElementById('blogBreadcrumbCat');

    if (!heroTitle) return;

    if (currentCategory === 'bridal-tips') {
      heroTitle.textContent = '👰 Bridal Tips';
      if (heroDesc) heroDesc.textContent = 'Essential wedding henna preparation, 48-hour timelines, and royal bridal design guides.';
      if (heroBreadcrumb) {
        heroBreadcrumb.innerHTML = `<span class="breadcrumb-sep">›</span><a href="blog.html">Blog</a><span class="breadcrumb-sep">›</span>Bridal Tips`;
      }
    } else if (currentCategory === 'product-use') {
      heroTitle.textContent = '🌿 Product Use & Tutorials';
      if (heroDesc) heroDesc.textContent = 'Step-by-step master tutorials for Mehndi Cones, Organic Powder, Bridal Oils, and Henna Tools.';
      if (heroBreadcrumb) {
        heroBreadcrumb.innerHTML = `<span class="breadcrumb-sep">›</span><a href="blog.html">Blog</a><span class="breadcrumb-sep">›</span>Product Use`;
      }
    } else if (currentCategory === 'after-care') {
      heroTitle.textContent = '🌸 Mehndi After Care';
      if (heroDesc) heroDesc.textContent = 'Expert secrets for deep maroon color oxidation, aftercare balms, oils, and 3+ week stain longevity.';
      if (heroBreadcrumb) {
        heroBreadcrumb.innerHTML = `<span class="breadcrumb-sep">›</span><a href="blog.html">Blog</a><span class="breadcrumb-sep">›</span>After Care`;
      }
    } else {
      heroTitle.textContent = '📝 Mehndi Blog';
      if (heroDesc) heroDesc.textContent = 'Tips, trends, tutorials, and inspiration from India\'s henna experts.';
      if (heroBreadcrumb) {
        heroBreadcrumb.innerHTML = `<span class="breadcrumb-sep">›</span>Blog`;
      }
    }
  }

  // Render the category pill buttons (All Posts + exactly 3 submenus)
  function renderCategoryPills() {
    const container = document.getElementById('blogCategoryPills');
    if (!container) return;

    const categories = [
      { id: 'all', name: 'All Posts' },
      { id: 'bridal-tips', name: 'Bridal Tips' },
      { id: 'product-use', name: 'Product Use' },
      { id: 'after-care', name: 'After Care' }
    ];

    container.innerHTML = categories.map(cat => {
      const isActive = currentCategory === cat.id;
      return `
        <button class="pill ${isActive ? 'active' : ''}" 
                onclick="window.selectBlogCategory('${cat.id}')"
                style="cursor:pointer;">
          ${cat.name}
        </button>
      `;
    }).join('');
  }

  // Select a category and update route
  window.selectBlogCategory = function (catId) {
    currentCategory = catId;
    const newUrl = catId === 'all' ? 'blog.html' : `blog.html?cat=${catId}`;
    window.history.pushState({ category: catId }, '', newUrl);

    renderCategoryPills();
    updateBlogHero();
    renderBlogContent();

    // Smooth scroll up to posts section
    const pills = document.getElementById('blogCategoryPills');
    if (pills) {
      pills.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Render both Featured Post and Blog Cards Grid
  function renderBlogContent() {
    if (!window.MehndiDB) return;

    const posts = window.MehndiDB.getBlogsByCategory(currentCategory);
    const featuredContainer = document.getElementById('blogFeaturedPost');
    const gridContainer = document.getElementById('blogGrid');
    const emptyNotice = document.getElementById('blogEmptyNotice');

    if (!posts || posts.length === 0) {
      if (featuredContainer) featuredContainer.style.display = 'none';
      if (gridContainer) gridContainer.innerHTML = '';
      if (emptyNotice) {
        emptyNotice.style.display = 'block';
        emptyNotice.innerHTML = `
          <div style="text-align:center;padding:3rem 1rem;color:var(--text-light);">
            <div style="font-size:3rem;margin-bottom:0.75rem">📝</div>
            <h3 style="color:var(--maroon-dark)">No Articles Found in this Category</h3>
            <p style="font-size:0.9rem;margin-top:0.35rem">Check back soon or explore other categories below.</p>
            <button class="btn btn-primary btn-sm" onclick="selectBlogCategory('all')" style="margin-top:1rem;">View All Posts</button>
          </div>
        `;
      }
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';

    // Featured Post logic
    let featuredPost = posts.find(p => p.featured);
    if (!featuredPost) featuredPost = posts[0];

    // Grid posts (excluding featured post if displaying all, or include all remaining)
    const gridPosts = posts.filter(p => p.id !== featuredPost.id);

    // 1. Render Featured Post
    if (featuredContainer && featuredPost) {
      featuredContainer.style.display = 'block';
      featuredContainer.innerHTML = `
        <div style="background:var(--white);border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-card);margin-bottom:3rem;display:grid;grid-template-columns:1.2fr 1fr;align-items:center;border:1.5px solid var(--border);" class="reveal">
          <img src="${featuredPost.img}" alt="${featuredPost.title}" style="width:100%;height:380px;object-fit:cover;">
          <div style="padding:2.5rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
              <span class="badge badge-gold">⭐ Featured</span>
              <span class="badge" style="background:var(--cream);color:var(--maroon-dark);border:1px solid var(--border);">${featuredPost.categoryName}</span>
            </div>
            <h2 style="font-family:var(--font-heading);color:var(--maroon-dark);margin-bottom:0.85rem;font-size:1.65rem;line-height:1.3;">
              ${featuredPost.title}
            </h2>
            <p style="color:var(--text-mid);line-height:1.75;margin-bottom:1.5rem;font-size:0.92rem;">
              ${featuredPost.excerpt}
            </p>
            <div class="blog-meta" style="margin-bottom:1.5rem;font-size:0.82rem;color:var(--text-light);display:flex;gap:1rem;flex-wrap:wrap;">
              <span>✍️ ${featuredPost.author || 'Mehndi Studio'}</span>
              <span>📅 ${featuredPost.date || 'Recent'}</span>
              <span>⏱️ ${featuredPost.readTime || '5 min read'}</span>
            </div>
            <button onclick="window.openBlogModal('${featuredPost.id}')" class="btn btn-primary" style="cursor:pointer;">
              Read Full Article →
            </button>
          </div>
        </div>
      `;
    }

    // 2. Render Remaining Grid Posts
    if (gridContainer) {
      const displayPosts = gridPosts.length > 0 ? gridPosts : (posts.length === 1 ? [] : posts);
      if (displayPosts.length === 0 && posts.length === 1) {
        gridContainer.innerHTML = '';
        return;
      }

      gridContainer.innerHTML = displayPosts.map((post, idx) => {
        return `
          <div class="blog-card reveal" style="display:flex;flex-direction:column;justify-content:space-between;background:var(--white);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-card);border:1.5px solid var(--border);transition:all 0.3s ease;">
            <div>
              <div style="position:relative;height:220px;overflow:hidden;">
                <img class="blog-img" src="${post.img}" alt="${post.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;">
                <span style="position:absolute;top:0.75rem;left:0.75rem;background:rgba(74,15,26,0.85);color:var(--gold-light);font-size:0.75rem;font-weight:700;padding:0.3rem 0.7rem;border-radius:20px;backdrop-filter:blur(4px);border:1px solid rgba(201,151,58,0.3);">
                  ${post.categoryName}
                </span>
              </div>
              <div class="blog-body" style="padding:1.5rem;">
                <h3 class="blog-title" style="font-family:var(--font-heading);color:var(--maroon-dark);font-size:1.15rem;margin-bottom:0.75rem;line-height:1.4;">
                  ${post.title}
                </h3>
                <p class="blog-excerpt" style="font-size:0.87rem;color:var(--text-mid);line-height:1.65;margin-bottom:1.25rem;">
                  ${post.excerpt}
                </p>
              </div>
            </div>
            <div style="padding:0 1.5rem 1.5rem 1.5rem;">
              <div class="blog-meta" style="font-size:0.78rem;color:var(--text-light);display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:0.75rem;margin-bottom:1rem;">
                <span>📅 ${post.date}</span>
                <span>⏱️ ${post.readTime}</span>
              </div>
              <button onclick="window.openBlogModal('${post.id}')" class="btn btn-outline btn-sm" style="width:100%;text-align:center;cursor:pointer;">
                Read Article →
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ── Article Reader Modal ──────────────────────────────────────
  window.openBlogModal = function (id) {
    if (!window.MehndiDB) return;
    const post = window.MehndiDB.getBlog(id);
    if (!post) return;

    let backdrop = document.getElementById('blogModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'blogModalBackdrop';
      backdrop.className = 'blog-modal-backdrop';
      backdrop.innerHTML = `
        <div class="blog-modal-card" id="blogModalCard">
          <button class="blog-modal-close" onclick="window.closeBlogModal()" title="Close">✕</button>
          <div id="blogModalBody"></div>
        </div>
      `;
      document.body.appendChild(backdrop);

      // Close on clicking backdrop
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) window.closeBlogModal();
      });
    }

    const modalBody = document.getElementById('blogModalBody');
    const paragraphs = (post.content || post.excerpt || '').split('\n\n').map(p => `<p style="line-height:1.8;color:var(--text-dark);margin-bottom:1.2rem;font-size:0.95rem;">${p.trim()}</p>`).join('');

    const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + '?cat=' + (post.category || 'all'));
    const shareText = encodeURIComponent(`Check out this mehndi guide: "${post.title}" from Khushi Mehndi Studio!`);
    const waShareLink = `https://wa.me/?text=${shareText}%20${shareUrl}`;

    modalBody.innerHTML = `
      <div style="position:relative;height:300px;overflow:hidden;border-radius:var(--radius-xl) var(--radius-xl) 0 0;">
        <img src="${post.img}" alt="${post.title}" style="width:100%;height:100%;object-fit:cover;">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(42,24,16,0.9) 0%, rgba(42,24,16,0.2) 60%, transparent 100%);"></div>
        <div style="position:absolute;bottom:1.5rem;left:1.5rem;right:1.5rem;">
          <span style="background:var(--gold);color:var(--white);font-size:0.75rem;font-weight:700;padding:0.3rem 0.75rem;border-radius:20px;">
            ${post.categoryName}
          </span>
          <h2 style="font-family:var(--font-heading);color:var(--white);font-size:1.6rem;margin-top:0.6rem;line-height:1.3;text-shadow:0 2px 8px rgba(0,0,0,0.4);">
            ${post.title}
          </h2>
        </div>
      </div>
      <div style="padding:2rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;padding-bottom:1.25rem;border-bottom:1.5px solid var(--border);margin-bottom:1.5rem;font-size:0.85rem;color:var(--text-mid);">
          <div>
            <span>✍️ By <strong>${post.author || 'Mehndi Studio'}</strong></span> &nbsp;•&nbsp; 
            <span>📅 ${post.date || 'Recent'}</span> &nbsp;•&nbsp; 
            <span>⏱️ ${post.readTime || '5 min read'}</span>
          </div>
          <a href="${waShareLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.4rem;color:#25D366;font-weight:600;text-decoration:none;font-size:0.85rem;">
            <span>💬 Share Article</span>
          </a>
        </div>

        <div style="font-family:var(--font-body);color:var(--text-dark);">
          ${paragraphs}
        </div>

        <div style="margin-top:2rem;padding:1.5rem;background:var(--cream);border-radius:var(--radius-lg);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-weight:700;color:var(--maroon-dark);font-size:1rem;">Need professional bridal henna or custom cones?</div>
            <div style="font-size:0.82rem;color:var(--text-light);margin-top:0.25rem;">Chat directly with our master artists on WhatsApp: +91 78018 75673</div>
          </div>
          <a href="https://wa.me/917801875673?text=${encodeURIComponent(`Hello Khushi Mehndi Studio! I just read your article "${post.title}" and would like to ask a question.`)}" target="_blank" class="btn btn-primary btn-sm">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    `;

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeBlogModal = function () {
    const backdrop = document.getElementById('blogModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Keyboard escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeBlogModal();
  });

  // Self-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
  } else {
    initBlog();
  }

})();


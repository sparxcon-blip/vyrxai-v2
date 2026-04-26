/* ============================================================
   Ravvex — main.js
   ============================================================ */

/* ── Cursor Spotlight ─────────────────────────────────────── */
function initCursorSpotlight() {
  const el = document.getElementById('cursor-spotlight');
  if (!el) return;
  let mx = -999, my = -999, cx = -999, cy = -999;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { el.style.opacity = '1'; visible = true; }
  });
  document.addEventListener('mouseleave', () => { el.style.opacity = '0'; visible = false; });

  function tick() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Card Spotlight (mouse-tracking per card) ─────────────── */
function initCardSpotlights() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    const spotlight = card.querySelector('.card-spotlight');
    if (!spotlight) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      spotlight.style.background =
        `radial-gradient(circle 200px at ${x}px ${y}px, rgba(94,106,210,0.13), transparent)`;
    });
  });
}

/* ── Magnetic Buttons ─────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── Card Tilt ────────────────────────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('.feature-card, .platform-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${ny * -5}deg) rotateY(${nx * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Hero Parallax on Scroll ──────────────────────────────── */
function initHeroParallax() {
  const hero = document.getElementById('hero-parallax');
  if (!hero) return;
  function onScroll() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrollY / (vh * 0.5), 1);
    hero.style.opacity    = 1 - progress;
    hero.style.transform  = `translateY(${scrollY * 0.15}px) scale(${1 - progress * 0.04})`;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Header Scroll State ──────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── Scroll-triggered AOS ─────────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0');
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

/* ── Stat Counters ────────────────────────────────────────── */
function initStatCounters() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateStat(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateStat(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); observer.observe(el); });
}

/* ── Stats Strip Parallax Tilt ────────────────────────────── */
function initStatsParallax() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * 2.5;
    const ry = ((e.clientX - cx) / cx) * -2.5;
    strip.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  document.addEventListener('mouseleave', () => { strip.style.transform = ''; });
}

/* ── Render Testimonials ──────────────────────────────────── */
function renderTestimonials() {
  if (typeof TESTIMONIALS === 'undefined') return;

  function buildCard(t) {
    const initials = t.name.replace('@','').slice(0,2).toUpperCase();
    return `
      <div class="review-card">
        <div class="review-card-top">
          <div class="review-avatar">${initials}</div>
          <div>
            <div class="review-name">${t.name}</div>
            <div class="review-label">${t.label}</div>
          </div>
          <span class="review-stars">★★★★★</span>
        </div>
        <p class="review-body">${t.message}</p>
      </div>`;
  }

  const half = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, half);
  const row2 = TESTIMONIALS.slice(half);

  function fillTrack(id, items) {
    const track = document.getElementById(id);
    if (!track) return;
    track.innerHTML = [...items, ...items].map(buildCard).join('');
  }

  fillTrack('reviews-track-1', row1);
  fillTrack('reviews-track-2', row2);
}

/* ── Render Pricing ───────────────────────────────────────── */
function renderPricing() {
  const container = document.getElementById('pricing-container');
  if (!container || typeof SITE_CONFIG === 'undefined') return;

  container.innerHTML = SITE_CONFIG.plans.map(plan => `
    <div class="pricing-card ${plan.highlighted ? 'highlighted' : 'standard'} spotlight-card">
      <div class="card-spotlight"></div>
      ${plan.highlighted ? '<div class="pricing-badge">Best Value</div>' : ''}
      <div class="pricing-name">${plan.name}</div>
      <div class="pricing-desc">${plan.description}</div>
      <div class="pricing-price-row">
        <span class="pricing-price">${plan.price}</span>
        <span class="pricing-period">${plan.priceLabel}</span>
      </div>
      <ul class="pricing-features">
        ${plan.features.map(f => `
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M13.707 4.293a1 1 0 0 0-1.414 0L6 10.586 3.707 8.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" fill="currentColor"/>
            </svg>
            ${f}
          </li>`).join('')}
      </ul>
      <a href="${SITE_CONFIG.discordLink}" target="_blank" rel="noopener noreferrer"
         class="btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} magnetic"
         style="width:100%;justify-content:center;">
        ${plan.highlighted ? '<span class="btn-shine"></span>' : ''}
        ${plan.cta}
      </a>
    </div>
  `).join('');

  const footnoteLink = document.getElementById('pricing-discord-link');
  if (footnoteLink) footnoteLink.href = SITE_CONFIG.discordLink;

  // Re-init interactive features for dynamically rendered cards
  initMagnetic();
  initCardTilt();
  initCardSpotlights();
}

/* ── Render Start Page ────────────────────────────────────── */
function renderStartPage() {
  const discordBtn = document.getElementById('discord-btn');
  if (discordBtn && typeof SITE_CONFIG !== 'undefined') discordBtn.href = SITE_CONFIG.discordLink;
  const teaserList = document.getElementById('free-trial-features');
  if (!teaserList || typeof SITE_CONFIG === 'undefined') return;
  const free = SITE_CONFIG.plans.find(p => p.name === 'Free Trial');
  if (!free) return;
  teaserList.innerHTML = free.features.map(f => `
    <li>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path d="M13.707 4.293a1 1 0 0 0-1.414 0L6 10.586 3.707 8.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" fill="currentColor"/>
      </svg>
      ${f}
    </li>`).join('');
}

/* ── Wire Discord Links ───────────────────────────────────── */
function wireDiscordLinks() {
  if (typeof SITE_CONFIG === 'undefined') return;
  document.querySelectorAll('[data-discord]').forEach(el => { el.href = SITE_CONFIG.discordLink; });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderTestimonials();
  renderPricing();
  renderStartPage();
  wireDiscordLinks();
  initScrollAnimations();
  initCursorSpotlight();
  initCardSpotlights();
  initMagnetic();
  initCardTilt();
  initHeroParallax();
  initHeaderScroll();
  initMobileMenu();
  initStatCounters();
  initStatsParallax();
});

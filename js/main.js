/* Copyright (c) 2026 ArcAI. All rights reserved. */

/* ── Cursor glow ─────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = -999, my = -999, cx = -999, cy = -999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    cx += (mx - cx) * 0.07;
    cy += (my - cy) * 0.07;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  })();
}

/* ── Magnetic buttons ────────────────────────────────────── */
function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform = '';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

/* ── Parallax tilt on stats strip ────────────────────────── */
function initParallax() {
  const strip = document.querySelector('.stats-strip');
  if (!strip || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * 2.5;
    const ry = ((e.clientX - cx) / cx) * -2.5;
    strip.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  document.addEventListener('mouseleave', () => { strip.style.transform = ''; });
}

/* ── Hero scroll parallax ────────────────────────────────── */
function initHeroParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const progress = Math.min(sy / (window.innerHeight * 0.5), 1);
    hero.style.opacity   = 1 - progress * 0.6;
    hero.style.transform = `translateY(${progress * 35}px)`;
  }, { passive: true });
}

/* ── Stat counters ───────────────────────────────────────── */
function initStatCounters() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateStat(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();
    (function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateStat(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); observer.observe(el); });
}

/* ── Card tilt ───────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.zx-card, .platform-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${ny * 5}deg) rotateY(${-nx * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}

/* ── Card spotlight ──────────────────────────────────────── */
function initCardSpotlight() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.zx-card, .review-card, .pricing-card-inner').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.backgroundImage = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(94,106,210,0.08) 0%, transparent 70%), linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`;
    });
    card.addEventListener('mouseleave', () => { card.style.backgroundImage = ''; });
  });
}

/* ── Header scroll state ─────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Tellter text reveal ─────────────────────────────────── */
/*
 * Walks TEXT_NODE children only — never touches child elements.
 * This means <span class="grad-text">instantly</span> stays intact,
 * and the subtitle <p> is never merged into the heading.
 */
function initTextReveal() {
  const els = document.querySelectorAll('.reveal-text');
  if (!els.length) return;

  function wrapTextNode(textNode) {
    const parts = textNode.nodeValue.split(/(\s+)/);
    const frag  = document.createDocumentFragment();
    parts.forEach(part => {
      if (part.trim()) {
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.textContent = part;
        frag.appendChild(span);
      } else if (part) {
        frag.appendChild(document.createTextNode(part));
      }
    });
    textNode.parentNode.replaceChild(frag, textNode);
  }

  function processNode(node) {
    // Collect text nodes first (avoid live NodeList mutation)
    const textNodes = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
        textNodes.push(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        processNode(child); // recurse into child elements
      }
    });
    textNodes.forEach(wrapTextNode);
  }

  els.forEach(el => {
    processNode(el);
    el.classList.add('reveal-text--ready');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const words = entry.target.querySelectorAll('.reveal-word');
      words.forEach((w, i) => {
        setTimeout(() => w.classList.add('reveal-word--visible'), i * 50);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ── AOS-lite ────────────────────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0');
        setTimeout(() => entry.target.classList.add('aos-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => observer.observe(el));
}

/* ── Render Testimonials ─────────────────────────────────── */
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
  function fillTrack(id, items) {
    const track = document.getElementById(id);
    if (!track) return;
    track.innerHTML = [...items, ...items].map(buildCard).join('');
  }
  fillTrack('reviews-track-1', TESTIMONIALS.slice(0, half));
  fillTrack('reviews-track-2', TESTIMONIALS.slice(half));
}

/* ── Render Pricing ──────────────────────────────────────── */
function renderPricing() {
  const container = document.getElementById('pricing-container');
  if (!container || typeof SITE_CONFIG === 'undefined') return;
  container.innerHTML = SITE_CONFIG.plans.map(plan => `
    <div class="pricing-card ${plan.highlighted ? 'highlighted' : 'standard'}">
      <div class="pricing-card-inner">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M20.293 5.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L10 15.586l10.293-10.293Z" fill="currentColor"/>
              </svg>
              ${f}
            </li>`).join('')}
        </ul>
        <a href="${SITE_CONFIG.discordLink}" target="_blank" rel="noopener noreferrer"
           class="btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} magnetic"
           style="width:100%;justify-content:center;margin-top:auto;">
          ${plan.cta}
        </a>
      </div>
    </div>
  `).join('');
  const footnoteLink = document.getElementById('pricing-discord-link');
  if (footnoteLink) footnoteLink.href = SITE_CONFIG.discordLink;
  initMagnetic();
  initCardTilt();
}

/* ── Render Start page ───────────────────────────────────── */
function renderStartPage() {
  const discordBtn = document.getElementById('discord-btn');
  if (discordBtn && typeof SITE_CONFIG !== 'undefined') discordBtn.href = SITE_CONFIG.discordLink;
  const teaserList = document.getElementById('free-trial-features');
  if (!teaserList || typeof SITE_CONFIG === 'undefined') return;
  const free = SITE_CONFIG.plans.find(p => p.name === 'Free Trial');
  if (!free) return;
  teaserList.innerHTML = free.features.map(f => `
    <li>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path d="M20.293 5.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L10 15.586l10.293-10.293Z" fill="currentColor"/>
      </svg>
      ${f}
    </li>`).join('');
}

/* ── Wire Discord links ──────────────────────────────────── */
function wireDiscordLinks() {
  if (typeof SITE_CONFIG === 'undefined') return;
  document.querySelectorAll('[data-discord]').forEach(el => {
    el.href = SITE_CONFIG.discordLink;
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderTestimonials();
  renderPricing();
  renderStartPage();
  wireDiscordLinks();
  initTextReveal();
  initScrollAnimations();
  initCursorGlow();
  initMagnetic();
  initParallax();
  initHeroParallax();
  initStatCounters();
  initCardTilt();
  initCardSpotlight();
  initHeaderScroll();
  initMobileMenu();
});

/* Copyright (c) 2026 uh.izaak. All rights reserved. */

/* ── Cursor glow ─────────────────────────────────────────── */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = -999, my = -999, cx = -999, cy = -999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function tick() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Magnetic buttons ────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ── Parallax tilt on hero stats strip ───────────────────── */
function initParallax() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * 3;
    const ry = ((e.clientX - cx) / cx) * -3;
    strip.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  document.addEventListener('mouseleave', () => { strip.style.transform = ''; });
}

/* ── Scroll-triggered stat counter ──────────────────────── */
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
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
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

/* ── Card tilt on hover ──────────────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('.zx-card, .platform-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${ny * 6}deg) rotateY(${-nx * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── Tellter-style text reveal (light sweep left → right) ── */
function initTextReveal() {
  const els = document.querySelectorAll('.reveal-text');
  if (!els.length) return;

  els.forEach(el => {
    // wrap each word in a span so we can animate word by word
    const words = el.innerHTML.split(/(\s+)/);
    el.innerHTML = words.map(w =>
      w.trim() ? `<span class="reveal-word">${w}</span>` : w
    ).join('');
    el.classList.add('reveal-text--ready');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const words = entry.target.querySelectorAll('.reveal-word');
      words.forEach((w, i) => {
        setTimeout(() => { w.classList.add('reveal-word--visible'); }, i * 55);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
}

/* ── AOS-lite: fade-up on scroll ─────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0');
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    observer.observe(el);
  });
}

/* ── Render Testimonials (marquee rows) ──────────────────── */
function renderTestimonials() {
  if (typeof TESTIMONIALS === 'undefined') return;

  function buildCard(t) {
    const initials = t.name.replace('@','').slice(0,2).toUpperCase();
    const stars = '<span class="review-stars">★★★★★</span>';
    return `
      <div class="review-card">
        <div class="review-card-top">
          <div class="review-avatar">${initials}</div>
          <div>
            <div class="review-name">${t.name}</div>
            <div class="review-label">${t.label}</div>
          </div>
          ${stars}
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
    // duplicate for seamless loop
    const html = [...items, ...items].map(buildCard).join('');
    track.innerHTML = html;
  }

  fillTrack('reviews-track-1', row1);
  fillTrack('reviews-track-2', row2);

  // legacy container fallback
  const legacy = document.getElementById('testimonials-container');
  if (legacy) {
    legacy.innerHTML = TESTIMONIALS.map(t => buildCard(t)).join('');
  }
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M13.707 4.293a1 1 0 0 0-1.414 0L6 10.586 3.707 8.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" fill="currentColor"/>
              </svg>
              ${f}
            </li>`).join('')}
        </ul>
        <a href="${SITE_CONFIG.discordLink}" target="_blank" rel="noopener noreferrer"
           class="btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} magnetic"
           style="width:100%;justify-content:center;">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path d="M13.707 4.293a1 1 0 0 0-1.414 0L6 10.586 3.707 8.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" fill="currentColor"/>
      </svg>
      ${f}
    </li>`).join('');
}

/* ── Wire Discord links ──────────────────────────────────── */
function wireDiscordLinks() {
  if (typeof SITE_CONFIG === 'undefined') return;
  document.querySelectorAll('[data-discord]').forEach(el => { el.href = SITE_CONFIG.discordLink; });
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
  initStatCounters();
  initCardTilt();
});

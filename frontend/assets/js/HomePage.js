/* ══════════════════════════════════════
   homw1.js — TeamForge Landing Page
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────
     1. NAVBAR — scroll shadow
  ───────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ─────────────────────────────
     2. MOBILE NAV TOGGLE
  ───────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('nav-open');
      }
    });
  }

  /* ─────────────────────────────
     3. SMOOTH SCROLL for nav links
  ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (navbar ? navbar.offsetHeight : 0) + 8;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile nav if open
        if (navLinks) navLinks.classList.remove('nav-open');
      }
    });
  });

  /* ─────────────────────────────
     4. INTERSECTION OBSERVER
        Reveal sections & cards
  ───────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.proj-card, .feat-card, .step-card, .sec-title, .sec-sub, .cta-box'
  );

  // Initially hide everything that will be revealed
  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay || '0';
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, Number(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  // Stagger cards within their grid
  document.querySelectorAll('.proj-card').forEach((el, i) => {
    el.dataset.delay = i * 80;
    observer.observe(el);
  });

  document.querySelectorAll('.feat-card').forEach((el, i) => {
    el.dataset.delay = i * 60;
    observer.observe(el);
  });

  document.querySelectorAll('.step-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
    observer.observe(el);
  });

  document.querySelectorAll('.sec-title, .sec-sub, .cta-box').forEach(el => {
    observer.observe(el);
  });

  /* ─────────────────────────────
     5. PROJECT CARD — hover tilt
  ───────────────────────────── */
  document.querySelectorAll('.proj-card, .feat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .35s ease, box-shadow .35s ease';
    });
  });

  /* ─────────────────────────────
     6. CTA BUTTON — ripple effect
  ───────────────────────────── */
  document.querySelectorAll('.btn-cta-primary, .btn-nav-cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
        background: rgba(255,255,255,.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple .5s ease-out forwards;
        pointer-events: none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id    = 'rippleStyle';
    style.textContent = `
      @keyframes ripple {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────
     7. NAVBAR SCROLLED class style
  ───────────────────────────── */
  if (!document.getElementById('navScrollStyle')) {
    const style = document.createElement('style');
    style.id    = 'navScrollStyle';
    style.textContent = `
      .navbar.scrolled {
        box-shadow: 0 2px 16px rgba(0,0,0,.10);
      }
      .nav-links.nav-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0; right: 0;
        background: #fff;
        border-top: 1px solid #e2e8f2;
        padding: 12px 24px 20px;
        box-shadow: 0 8px 24px rgba(0,0,0,.08);
        gap: 14px;
        z-index: 99;
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────
     8. ACTIVE NAV LINK highlight
        based on scroll position
  ───────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length) {
    const highlightNav = () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
      });
      navAnchors.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // Inject active style
    if (!document.getElementById('navActiveStyle')) {
      const style = document.createElement('style');
      style.id = 'navActiveStyle';
      style.textContent = `.nav-links a.nav-active { color: var(--teal) !important; font-weight: 700; }`;
      document.head.appendChild(style);
    }
  }

  /* ─────────────────────────────
     9. FOOTER year auto-update
  ───────────────────────────── */
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }

  /* ─────────────────────────────
     10. Sign In redirect from CTA
  ───────────────────────────── */
  document.querySelectorAll('.btn-nav-cta, .btn-cta-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      // Only redirect for sign-in buttons, not anchor links
      if (!href || href === '#') {
        e.preventDefault();
        window.location.href = 'login.html';
      }
    });
  });

})();
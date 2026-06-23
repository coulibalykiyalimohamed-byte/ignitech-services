/* ============================================
   IGNITECH SERVICES — script.js
   ============================================ */

'use strict';

// ===== ANNÉE AUTOMATIQUE =====
(function setYear() {
  var el = document.getElementById('annee');
  if (el) el.textContent = new Date().getFullYear();
})();

// ===== MENU HAMBURGER =====
(function initMenu() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.contains('nav-menu--open');
    menu.classList.toggle('nav-menu--open');
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Fermer le menu au clic sur un lien
  var links = menu.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('nav-menu--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer au clic extérieur
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('nav-menu--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ===== NAVBAR SCROLL =====
(function initNavScroll() {
  var header = document.querySelector('.nav-header');
  if (!header) return;

  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      header.style.boxShadow = '0 2px 16px rgba(27, 58, 92, 0.14)';
    } else {
      header.style.boxShadow = '0 1px 8px rgba(27, 58, 92, 0.07)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
})();

// ===== REVEAL AU SCROLL =====
(function initScrollReveal() {
  var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  var targets = document.querySelectorAll(
    '.service-card, .pourquoi-card, .contact-card, .stat-item, .boutique-inner, .apropos-inner, .intervention-content'
  );

  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Classe CSS ajoutée
  document.head.insertAdjacentHTML('beforeend',
    '<style>.is-visible { opacity: 1 !important; transform: translateY(0) !important; }</style>'
  );
})();

// ===== LIEN ACTIF DANS LA NAV =====
(function initActiveNav() {
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('nav-link--active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Style pour le lien actif
  document.head.insertAdjacentHTML('beforeend',
    '<style>.nav-link--active { color: var(--orange) !important; background: var(--gris-clair); }</style>'
  );
})();
// ===== VALIDATION FORMULAIRE =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    let valid = true;
    const fields = contactForm.querySelectorAll('[required]');
    fields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim() || !field.checkValidity()) {
        group.classList.add('has-error');
        valid = false;
      } else {
        group.classList.remove('has-error');
      }
    });
    if (!valid) e.preventDefault();
  });

  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function() {
      const group = this.closest('.form-group');
      if (this.value.trim() && this.checkValidity()) {
        group.classList.remove('has-error');
      }
    });
  });
}

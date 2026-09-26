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
// ===== Bandeau de consentement cookies =====
(function() {
  var CONSENT_KEY = 'ignitech_cookie_consent';
  var consent = localStorage.getItem(CONSENT_KEY);

  function updateConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': value === 'accepted' ? 'granted' : 'denied'
      });
    }
  }

  if (!consent) {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentement aux cookies');
    banner.innerHTML =
      '<p class="cookie-banner-text">Ce site utilise Google Analytics pour mesurer sa fréquentation. Vous pouvez accepter ou refuser ces cookies. <a href="mentions-legales.html" class="cookie-banner-link">En savoir plus</a></p>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="cookie-banner-btn cookie-banner-btn--decline">Refuser</button>' +
        '<button type="button" class="cookie-banner-btn cookie-banner-btn--accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.cookie-banner-btn--accept').addEventListener('click', function() {
      updateConsent('accepted');
      banner.remove();
    });
    banner.querySelector('.cookie-banner-btn--decline').addEventListener('click', function() {
      updateConsent('refused');
      banner.remove();
    });
  }
})();
// ===== Calculateur de puissance climatisation =====
(function () {
  const btn = document.getElementById('calc-btn');
  if (!btn) return;

  const paliers = [
    { max: 9500, btu: 9000, cv: '1 CV' },
    { max: 13500, btu: 12000, cv: '1,5 CV' },
    { max: 19500, btu: 18000, cv: '2 CV' },
    { max: 26000, btu: 24000, cv: '3 CV' },
    { max: Infinity, btu: null, cv: 'Gainable / VRF (nous consulter)' }
  ];

  btn.addEventListener('click', function () {
    const surface = parseFloat(document.getElementById('calc-surface').value);
    const expo = parseFloat(document.getElementById('calc-exposition').value);
    const type = parseFloat(document.getElementById('calc-type').value);

    if (!surface || surface <= 0) {
      alert('Merci de renseigner une surface valide.');
      return;
    }

    const btuBrut = surface * 615 * expo * type;
    const palier = paliers.find(p => btuBrut <= p.max);

    const resultDiv = document.getElementById('calc-result');
    const resultText = document.getElementById('calc-result-text');
    const waLink = document.getElementById('calc-whatsapp-link');

    const libelle = palier.btu
      ? palier.btu.toLocaleString('fr-FR') + ' BTU/h — Split ' + palier.cv
      : 'Plus de 27 000 BTU/h — ' + palier.cv;

    resultText.textContent = libelle;
    resultDiv.hidden = false;

    const message = encodeURIComponent(
      "Bonjour IGNITECH Services, j'ai une pièce de " + surface + ' m² et le calculateur du site recommande environ ' + libelle + '. Je souhaite un devis.'
    );
    waLink.href = 'https://wa.me/2250767010286?text=' + message;
  });
})();
// ===== FORMULAIRE DEVIS EXPRESS - CHAMBRE FROIDE =====
document.addEventListener('DOMContentLoaded', function () {
  const devisBtn = document.getElementById('devis-submit-btn');
  if (!devisBtn) return; // sécurité : si le bloc n'existe pas sur cette page, on ne fait rien

  devisBtn.addEventListener('click', function () {
    const typeInput = document.querySelector('input[name="devis-type"]:checked');
    const secteurInput = document.querySelector('input[name="devis-secteur"]:checked');
    const dimensions = document.getElementById('devis-dimensions').value.trim();
    const erreur = document.getElementById('devis-erreur');

    if (!typeInput) {
      erreur.style.display = 'block';
      return;
    }
    erreur.style.display = 'none';

    const type = typeInput.value;
    const secteur = secteurInput ? secteurInput.value : 'Non précisé';
    const dim = dimensions || 'Non précisé';

    const message = `Bonjour IGNITECH, je souhaite un devis pour une chambre froide.\n\nType : ${type}\nSecteur : ${secteur}\nDimensions/volume : ${dim}`;
    const url = `https://wa.me/2250767010286?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
});
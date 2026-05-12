/*
 * Cookie consent (GDPR opt-in).
 *
 * Stores user choice in localStorage for 365 days. Tracking scripts
 * (GA4 + Microsoft Clarity) are blocked by default and only injected
 * after the user clicks "Accept".
 *
 * Replace the placeholder IDs below with the real ones once you
 * have created the GA4 property and Clarity project.
 */
(function () {
  'use strict';

  // ---------- Configuration ----------
  var GA_MEASUREMENT_ID  = 'GA_MEASUREMENT_ID';   // e.g. 'G-XXXXXXXXXX'
  var CLARITY_PROJECT_ID = 'CLARITY_PROJECT_ID';  // e.g. 'abcdefghij'

  var STORAGE_KEY        = 'cookie_consent';
  var LANG_OVERRIDE_KEY  = 'cookie_consent_lang';
  var POLICY_VERSION     = '1.0';
  var CONSENT_TTL_DAYS   = 365;

  var SUPPORTED = ['en', 'de', 'fr', 'it'];

  var TRANSLATIONS = {
    en: {
      label: 'EN',
      text: 'This website uses cookies to analyze traffic and monitor performance.',
      accept: 'Accept',
      decline: 'Decline',
      privacy: 'Privacy Policy',
      manage: 'Manage Cookies',
      langAria: 'Change banner language',
      closeAria: 'Close cookie banner'
    },
    de: {
      label: 'DE',
      text: 'Diese Website verwendet Cookies, um den Datenverkehr zu analysieren und die Leistung zu überwachen.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
      privacy: 'Datenschutz',
      manage: 'Cookies verwalten',
      langAria: 'Banner-Sprache ändern',
      closeAria: 'Cookie-Banner schließen'
    },
    fr: {
      label: 'FR',
      text: 'Ce site utilise des cookies pour analyser le trafic et mesurer les performances.',
      accept: 'Accepter',
      decline: 'Refuser',
      privacy: 'Politique de confidentialité',
      manage: 'Gérer les cookies',
      langAria: 'Changer la langue de la bannière',
      closeAria: 'Fermer la bannière de cookies'
    },
    it: {
      label: 'IT',
      text: 'Questo sito utilizza cookie per analizzare il traffico e monitorare le prestazioni.',
      accept: 'Accetta',
      decline: 'Rifiuta',
      privacy: 'Informativa sulla privacy',
      manage: 'Gestisci cookie',
      langAria: 'Cambia la lingua del banner',
      closeAria: 'Chiudi banner cookie'
    }
  };

  // ---------- Storage helpers ----------
  function readJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function getConsent() {
    var obj = readJSON(STORAGE_KEY);
    if (!obj || typeof obj.consent_status !== 'boolean') return null;
    var ts = obj.timestamp ? new Date(obj.timestamp).getTime() : NaN;
    if (!isFinite(ts)) return null;
    if (Date.now() - ts > CONSENT_TTL_DAYS * 86400000) return null;
    return obj;
  }

  function setConsent(accepted) {
    var record = {
      consent_status: !!accepted,
      timestamp: new Date().toISOString(),
      policy_version: POLICY_VERSION
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (e) {}
    return record;
  }

  function clearConsent() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // ---------- Language detection ----------
  function detectLang() {
    try {
      var override = localStorage.getItem(LANG_OVERRIDE_KEY);
      if (override && SUPPORTED.indexOf(override) !== -1) return override;
    } catch (e) {}

    var htmlLang = (document.documentElement.lang || '').toLowerCase().split('-')[0];
    if (SUPPORTED.indexOf(htmlLang) !== -1) return htmlLang;

    var path = location.pathname.toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (path.indexOf('/' + SUPPORTED[i] + '/') !== -1) return SUPPORTED[i];
    }
    return 'en';
  }

  function rememberLang(lang) {
    try { localStorage.setItem(LANG_OVERRIDE_KEY, lang); } catch (e) {}
  }

  // ---------- Tracking script injection ----------
  function isPlaceholder(id, name) {
    return !id || id === name;
  }

  function loadGA() {
    if (isPlaceholder(GA_MEASUREMENT_ID, 'GA_MEASUREMENT_ID')) return;
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function loadClarity() {
    if (isPlaceholder(CLARITY_PROJECT_ID, 'CLARITY_PROJECT_ID')) return;
    if (window.__clarityLoaded) return;
    window.__clarityLoaded = true;

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
  }

  function loadAnalytics() {
    loadGA();
    loadClarity();
  }

  // ---------- Banner DOM ----------
  var banner = null;
  var docClickHandler = null;
  var docKeyHandler = null;

  function buildBanner(lang) {
    var t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    var root = document.createElement('div');
    root.className = 'cookie-banner';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-labelledby', 'cookie-banner-text');
    root.setAttribute('aria-live', 'polite');
    root.dataset.lang = lang;

    var langOptions = SUPPORTED.map(function (code) {
      var sel = code === lang ? ' aria-current="true"' : '';
      return '<li role="none"><button type="button" role="menuitem" data-lang="' + code +
             '"' + sel + '>' + TRANSLATIONS[code].label + '</button></li>';
    }).join('');

    root.innerHTML =
      '<div class="cookie-banner-head">' +
        '<div class="cookie-banner-lang-wrap">' +
          '<button type="button" class="cookie-banner-lang" aria-label="' + t.langAria +
            '" aria-haspopup="true" aria-expanded="false">' +
            '<svg class="cookie-banner-globe" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
              '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>' +
            '</svg>' +
            '<span class="cookie-banner-lang-label">' + t.label + '</span>' +
          '</button>' +
          '<ul class="cookie-banner-lang-menu" role="menu" hidden>' + langOptions + '</ul>' +
        '</div>' +
      '</div>' +
      '<p id="cookie-banner-text" class="cookie-banner-text">' + t.text + '</p>' +
      '<p class="cookie-banner-links">' +
        '<a href="privacy-policy.html" class="cookie-banner-link" data-link="privacy">' + t.privacy + '</a>' +
        '<span class="cookie-banner-sep" aria-hidden="true">·</span>' +
        '<a href="cookie-management.html" class="cookie-banner-link" data-link="manage">' + t.manage + '</a>' +
      '</p>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="cookie-banner-btn" data-action="decline">' + t.decline + '</button>' +
        '<button type="button" class="cookie-banner-btn" data-action="accept">' + t.accept + '</button>' +
      '</div>';

    wireBanner(root);
    return root;
  }

  function wireBanner(root) {
    var acceptBtn = root.querySelector('[data-action="accept"]');
    var declineBtn = root.querySelector('[data-action="decline"]');
    var langBtn = root.querySelector('.cookie-banner-lang');
    var langChoices = root.querySelectorAll('[data-lang]');

    if (acceptBtn) acceptBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      accept();
    });
    if (declineBtn) declineBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      decline();
    });
    if (langBtn) langBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleLangMenu(root);
    });
    Array.prototype.forEach.call(langChoices, function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var code = btn.getAttribute('data-lang');
        if (SUPPORTED.indexOf(code) !== -1) {
          rememberLang(code);
          renderBanner(code);
        }
      });
    });
  }

  function attachDocumentHandlers() {
    if (docClickHandler) return;
    docClickHandler = function (e) {
      if (banner && !banner.contains(e.target)) closeLangMenu(banner);
    };
    docKeyHandler = function (e) {
      if (e.key === 'Escape' && banner) closeLangMenu(banner);
    };
    document.addEventListener('click', docClickHandler);
    document.addEventListener('keydown', docKeyHandler);
  }

  function detachDocumentHandlers() {
    if (docClickHandler) document.removeEventListener('click', docClickHandler);
    if (docKeyHandler) document.removeEventListener('keydown', docKeyHandler);
    docClickHandler = null;
    docKeyHandler = null;
  }

  function toggleLangMenu(root) {
    var btn = root.querySelector('.cookie-banner-lang');
    var menu = root.querySelector('.cookie-banner-lang-menu');
    if (!btn || !menu) return;
    var open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
  }

  function closeLangMenu(root) {
    var btn = root.querySelector('.cookie-banner-lang');
    var menu = root.querySelector('.cookie-banner-lang-menu');
    if (!btn || !menu) return;
    if (!menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  function renderBanner(lang) {
    var next = buildBanner(lang);
    if (banner && banner.parentNode) {
      banner.parentNode.replaceChild(next, banner);
    } else {
      document.body.appendChild(next);
    }
    banner = next;
    // Force reflow so the entrance transition fires.
    // eslint-disable-next-line no-unused-expressions
    next.offsetHeight;
    requestAnimationFrame(function () {
      if (banner === next) next.classList.add('cookie-banner-visible');
    });
    attachDocumentHandlers();
  }

  function hideBanner() {
    if (!banner) return;
    var node = banner;
    banner = null;
    detachDocumentHandlers();
    node.classList.remove('cookie-banner-visible');
    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (node.parentNode) node.parentNode.removeChild(node);
    }
    node.addEventListener('transitionend', remove);
    setTimeout(remove, 600);
  }

  function showBanner() {
    if (banner) return;
    renderBanner(detectLang());
  }

  // ---------- Public actions ----------
  function accept() {
    setConsent(true);
    loadAnalytics();
    hideBanner();
    document.dispatchEvent(new CustomEvent('cookieconsent:change', { detail: { status: true } }));
  }

  function decline() {
    setConsent(false);
    hideBanner();
    document.dispatchEvent(new CustomEvent('cookieconsent:change', { detail: { status: false } }));
  }

  function reset() {
    clearConsent();
    document.dispatchEvent(new CustomEvent('cookieconsent:change', { detail: { status: null } }));
    showBanner();
  }

  window.CookieConsent = {
    show: showBanner,
    hide: hideBanner,
    accept: accept,
    decline: decline,
    reset: reset,
    status: getConsent,
    POLICY_VERSION: POLICY_VERSION
  };

  // ---------- Init ----------
  function init() {
    var consent = getConsent();
    if (consent && consent.consent_status === true) {
      loadAnalytics();
      return;
    }
    if (consent && consent.consent_status === false) {
      return; // declined choice persists for 365 days
    }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

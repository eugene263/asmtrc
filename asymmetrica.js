/* =====================================================================
   ASYMMETRICA — landing page interactions
   ===================================================================== */
(function () {
  'use strict';

  /* ---- EN/UK language toggle ------------------------------------------
     Visible text lives in the markup twice, as sibling <span data-lang="uk">
     / <span data-lang="en"> pairs — CSS does the actual showing/hiding
     (see asymmetrica.css), so there's no flash-of-wrong-language while
     this script loads. This module only handles: attributes that can't
     hold two values at once (alt/aria-label/placeholder, via data-en-*),
     the toggle buttons themselves, and persisting the choice. */
  var LANG_KEY = 'spextr-lang';

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'uk'; } catch (e) { return 'uk'; }
  }

  var I18N_ATTRS = [
    { attr: 'alt', dataAttr: 'data-en-alt' },
    { attr: 'aria-label', dataAttr: 'data-en-aria' },
    { attr: 'placeholder', dataAttr: 'data-en-placeholder' }
  ];

  var i18nAttrCache = [];
  I18N_ATTRS.forEach(function (spec) {
    document.querySelectorAll('[' + spec.dataAttr + ']').forEach(function (el) {
      i18nAttrCache.push({
        el: el,
        attr: spec.attr,
        uk: el.getAttribute(spec.attr) || '',
        en: el.getAttribute(spec.dataAttr)
      });
    });
  });

  var i18nTextCache = [];
  document.querySelectorAll('[data-en]').forEach(function (el) {
    if (el.tagName === 'TITLE') return; // handled separately below
    i18nTextCache.push({ el: el, uk: el.textContent, en: el.getAttribute('data-en') });
  });

  var titleEl = document.querySelector('title');
  var metaDescEl = document.querySelector('meta[name="description"]');

  function applyLang(lang) {
    document.documentElement.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang;

    if (titleEl && titleEl.getAttribute('data-en')) {
      // document.title's setter rewrites titleEl's textContent, so the uk
      // original has to be captured once before the first en switch
      if (!titleEl.dataset.ukCache) titleEl.dataset.ukCache = titleEl.textContent;
      document.title = lang === 'en' ? titleEl.getAttribute('data-en') : titleEl.dataset.ukCache;
    }
    if (metaDescEl && metaDescEl.getAttribute('data-en')) {
      // the uk copy only needs capturing once, before it's overwritten
      if (!metaDescEl.dataset.ukCache) metaDescEl.dataset.ukCache = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', lang === 'en' ? metaDescEl.getAttribute('data-en') : metaDescEl.dataset.ukCache);
    }

    i18nAttrCache.forEach(function (item) {
      item.el.setAttribute(item.attr, lang === 'en' ? item.en : item.uk);
    });
    i18nTextCache.forEach(function (item) {
      item.el.textContent = lang === 'en' ? item.en : item.uk;
    });

    document.querySelectorAll('.js-lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    });

    if (window.SPEXTR_relocalizeErrors) window.SPEXTR_relocalizeErrors();
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang(lang);
  }

  window.SPEXTR_getLang = getLang;

  document.querySelectorAll('.js-lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-btn')); });
  });

  applyLang(getLang());

  var GAP = 24;   // matches .marquee__track gap

  /* ---- carousel data --------------------------------------------------
     `ratio` is each image's own width/height so cells can be sized to it
     (via CSS aspect-ratio) instead of a fixed box that crops the photo. */
  var TRACKS = {
    pano: [
      { src: 'assets/pano-1.webp', alt: 'НРК на мховій купині', ratio: 1133 / 780 },
      { src: 'assets/pano-2.webp', alt: 'НРК в ангарі',        ratio: 1133 / 780 },
      { src: 'assets/pano-3.webp', alt: 'НРК у струмку',        ratio: 1121 / 779 }
    ],
    grid: [
      { src: 'assets/grid-1.webp', alt: 'Пульт FPV',            ratio: 1400 / 800 },
      { src: 'assets/grid-2.webp', alt: 'Пілоти на полігоні',   ratio: 1400 / 800 },
      { src: 'assets/grid-3.webp', alt: 'FPV-літак на стенді',  ratio: 1400 / 800 }
    ]
  };

  /* ---- static, manually-browsed carousel (buttons + drag-to-swipe) --- */
  function setupMarquee(section) {
    var key = section.getAttribute('data-track');
    var items = TRACKS[key];
    if (!items) return;

    var track = section.querySelector('[data-role="track"]');

    // duplicate the set so wrapping past the last/first item is seamless
    items.concat(items).forEach(function (it) {
      var cell = document.createElement('div');
      cell.className = 'marquee__cell';
      cell.style.aspectRatio = it.ratio;
      var img = document.createElement('img');
      img.src = it.src;
      img.alt = it.alt;
      img.draggable = false;
      img.loading = 'lazy';
      img.decoding = 'async';
      cell.appendChild(img);
      track.appendChild(cell);
    });

    var cells = track.children;
    var starts = [], setWidth = 0; // recomputed by measure(), since cell
                                    // width depends on aspect-ratio + the
                                    // container's current (breakpoint) height

    function measure() {
      starts = [];
      var pos = 0;
      for (var i = 0; i < items.length; i++) {
        starts.push(pos);
        pos += cells[i].offsetWidth + GAP;
      }
      setWidth = pos;
    }

    var offset = 0, dragging = false, startX = 0, startOffset = 0;
    var snapTimer;

    function apply() {
      var x = ((offset % setWidth) + setWidth) % setWidth;
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }

    function snapTo(newOffset) {
      track.classList.add('is-snapping');
      offset = newOffset;
      apply();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(function () { track.classList.remove('is-snapping'); }, 420);
    }

    // index of the item each button click is currently aiming at; kept as
    // an explicit counter rather than re-derived from `offset` each time,
    // so repeated clicks always land on the next/previous item in order.
    var index = 0;

    function next() {
      index = (index + 1) % items.length;
      var candidate = Math.floor(offset / setWidth) * setWidth + starts[index];
      while (candidate <= offset + 1) candidate += setWidth;
      snapTo(candidate);
    }

    function prev() {
      index = (index - 1 + items.length) % items.length;
      var candidate = Math.floor(offset / setWidth) * setWidth + starts[index];
      while (candidate >= offset - 1) candidate -= setWidth;
      snapTo(candidate);
    }

    var startClientX = 0, startClientY = 0, moved = false, downCell = null;

    section.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.marquee__nav')) return;
      dragging = true;
      moved = false;
      // captured here, not read off the pointerup event: once setPointerCapture
      // below takes effect, later events on this pointer get retargeted to
      // `section` regardless of what's actually under the cursor
      downCell = e.target.closest('.marquee__cell');
      startX = e.clientX;
      startClientX = e.clientX;
      startClientY = e.clientY;
      startOffset = offset;
      track.classList.remove('is-snapping');
      section.style.cursor = 'grabbing';
      if (section.setPointerCapture) section.setPointerCapture(e.pointerId);
    });
    section.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!moved && (Math.abs(e.clientX - startClientX) > 4 || Math.abs(e.clientY - startClientY) > 4)) moved = true;
      offset = startOffset - (e.clientX - startX);
      apply();
    });
    function release() {
      if (!dragging) return;
      // a genuine click (no drag movement) opens the lightbox on whichever
      // cell was under the pointer instead of re-snapping the carousel
      if (!moved && downCell) {
        var cellIndex = Array.prototype.indexOf.call(cells, downCell) % items.length;
        openLightbox(items, cellIndex);
      }
      dragging = false;
      section.style.cursor = 'grab';
      // snap to whichever item boundary ended up closest to the drop point
      var x = ((offset % setWidth) + setWidth) % setWidth;
      var best = 0, bestDist = Infinity;
      for (var i = 0; i < starts.length; i++) {
        var d = Math.min(Math.abs(starts[i] - x), setWidth - Math.abs(starts[i] - x));
        if (d < bestDist) { bestDist = d; best = i; }
      }
      index = best;
      var candidate = Math.floor(offset / setWidth) * setWidth + starts[index];
      if (candidate - offset > setWidth / 2) candidate -= setWidth;
      if (offset - candidate > setWidth / 2) candidate += setWidth;
      snapTo(candidate);
    }
    section.addEventListener('pointerup', release);
    section.addEventListener('pointerleave', function () { release(); });

    var prevBtn = section.querySelector('.js-marquee-prev');
    var nextBtn = section.querySelector('.js-marquee-next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    measure();
    apply();
    var resizeQueued = false;
    window.addEventListener('resize', function () {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () {
        resizeQueued = false;
        measure();
        apply();
      });
    });
  }

  /* ---- lightbox: click-to-zoom for marquee carousel images ----------- */
  var lightbox = document.querySelector('.js-lightbox');
  var lightboxImg = lightbox && lightbox.querySelector('.lightbox__img');
  var lightboxItems = [];
  var lightboxIndex = 0;
  var lightboxReturnFocus = null;

  function updateLightboxImg() {
    var it = lightboxItems[lightboxIndex];
    if (!it || !lightboxImg) return;
    lightboxImg.src = it.src;
    lightboxImg.alt = it.alt;
  }

  function openLightbox(items, idx) {
    if (!lightbox) return;
    lightboxItems = items;
    lightboxIndex = idx;
    lightboxReturnFocus = document.activeElement;
    updateLightboxImg();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-lightbox-open');
    var closeBtn = lightbox.querySelector('.js-lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-lightbox-open');
    if (lightboxReturnFocus && lightboxReturnFocus.focus) lightboxReturnFocus.focus();
  }

  function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightboxImg();
  }

  function lightboxPrev() {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxImg();
  }

  if (lightbox) {
    var lightboxClose = lightbox.querySelector('.js-lightbox-close');
    var lightboxPrevBtn = lightbox.querySelector('.js-lightbox-prev');
    var lightboxNextBtn = lightbox.querySelector('.js-lightbox-next');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', lightboxPrev);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', lightboxNext);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') lightboxNext();
      else if (e.key === 'ArrowLeft') lightboxPrev();
    });
  }

  document.querySelectorAll('.js-drag').forEach(setupMarquee);

  /* ---- auto-scrolling logo/illustration tickers ----------------------
     Continuously scrolls sideways on its own, but can also be grabbed
     and dragged left/right at any time; auto-scroll resumes from wherever
     it was released. Track content is duplicated once in the HTML (2
     identical sets back to back) so wrapping the offset at half the
     track's width loops seamlessly. */
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupAutoScroller(row, speed) {
    var track = row.querySelector('[data-role="track"]');
    if (!track) return;
    if (prefersReducedMotion) speed = 0;

    var setWidth = 0, step = 0;
    function measure() {
      setWidth = track.getBoundingClientRect().width / 2;
      var first = track.children[0];
      var second = track.children[1];
      if (first && second) {
        step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
      } else if (first) {
        step = first.getBoundingClientRect().width;
      }
    }

    var offset = 0, dragging = false, paused = false, startX = 0, startOffset = 0;
    var snapTimer;

    function apply() {
      var x = ((offset % setWidth) + setWidth) % setWidth;
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }

    function snapTo(newOffset) {
      track.classList.add('is-snapping');
      offset = newOffset;
      apply();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(function () { track.classList.remove('is-snapping'); }, 380);
    }

    function next() { snapTo(offset + step); }
    function prev() { snapTo(offset - step); }

    row.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ticker-nav')) return;
      dragging = true;
      startX = e.clientX;
      startOffset = offset;
      track.classList.remove('is-snapping');
      row.classList.add('is-dragging');
      if (row.setPointerCapture) row.setPointerCapture(e.pointerId);
    });
    row.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      offset = startOffset - (e.clientX - startX);
      apply();
    });
    function release() { dragging = false; row.classList.remove('is-dragging'); }
    row.addEventListener('pointerup', release);
    row.addEventListener('pointerleave', function () { release(); paused = false; });
    row.addEventListener('pointerenter', function () { paused = true; });

    var prevBtn = row.querySelector('.js-ticker-prev');
    var nextBtn = row.querySelector('.js-ticker-next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    measure();
    apply();
    var resizeQueued = false;
    window.addEventListener('resize', function () {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () {
        resizeQueued = false;
        measure();
        apply();
      });
    });

    return {
      tick: function () { if (!dragging && !paused) { offset += speed; apply(); } }
    };
  }

  var autoScrollers = [];
  [
    { row: '.partners__row', speed: 0.5 },
    { row: '.media__row', speed: 0.4 },
    { row: '.schemes__row', speed: 0.45 }
  ].forEach(function (cfg) {
    var row = document.querySelector(cfg.row);
    if (!row) return;
    var scroller = setupAutoScroller(row, cfg.speed);
    if (scroller) autoScrollers.push(scroller);
  });
  if (autoScrollers.length) {
    (function loop() {
      autoScrollers.forEach(function (s) { s.tick(); });
      requestAnimationFrame(loop);
    })();
  }

  /* ---- smooth anchor navigation ------------------------------------- */
  document.querySelectorAll('.js-nav').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---- mobile burger menu -------------------------------------------- */
  var burger = document.querySelector('.js-burger');
  var mobileMenu = document.querySelector('.js-mobile-menu');
  var menuBackdrop = document.querySelector('.js-menu-backdrop');
  if (burger && mobileMenu) {
    var closeMenu = function () {
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      if (menuBackdrop) menuBackdrop.classList.remove('is-open');
    };
    var toggleMenu = function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      mobileMenu.classList.toggle('is-open', !open);
      if (menuBackdrop) menuBackdrop.classList.toggle('is-open', !open);
    };
    burger.addEventListener('click', toggleMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
    var menuClose = mobileMenu.querySelector('.js-menu-close');
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- reveal on scroll --------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-on');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-on'); });
  }

  /* ---- back-to-top button ------------------------------------------- */
  var toTop = document.querySelector('.js-top');
  if (toTop) {
    var footer = document.querySelector('.contact__footer');
    // keeps the fixed button from ever drifting on top of the footer's
    // own links/social icons: once the footer's top edge rises within
    // `gap` of the viewport bottom, the button stops tracking the
    // viewport and instead holds `gap` above the footer content.
    var repositionToTop = function () {
      if (!footer) return;
      var gap = parseFloat(getComputedStyle(toTop).getPropertyValue('--to-top-gap')) || 18;
      var footerTop = footer.getBoundingClientRect().top;
      var overlap = window.innerHeight - footerTop + gap;
      toTop.style.bottom = Math.max(gap, overlap) + 'px';
    };
    var onScroll = function () {
      toTop.classList.toggle('is-show', window.scrollY > 600);
      repositionToTop();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', repositionToTop);
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- contact form: validate + toast ------------------------------- */
  var form = document.querySelector('.js-form');
  var toast = document.querySelector('.js-toast');
  var toastTimer;
  if (form) {
    var touched = {};
    form.querySelectorAll('[required]').forEach(function (f) {
      // first pass: only validate once the visitor leaves the field, so
      // errors don't pop up while they're still mid-typing on first pass
      f.addEventListener('blur', function () {
        touched[f.name] = true;
        window.SPEXTR_validateField(f);
      });
      // after that first blur (or a failed submit), keep validating live
      // so a fix is confirmed immediately and a new mistake is caught too
      f.addEventListener('input', function () {
        if (touched[f.name]) window.SPEXTR_validateField(f);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('[required]').forEach(function (f) { touched[f.name] = true; });
      if (!window.SPEXTR_validateForm(form)) return;
      form.reset();
      touched = {};
      if (toast) {
        toast.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          toast.classList.remove('is-show');
        }, 4200);
      }
    });
  }
})();

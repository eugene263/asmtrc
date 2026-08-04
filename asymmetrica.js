/* =====================================================================
   ASYMMETRICA — landing page interactions
   ===================================================================== */
(function () {
  'use strict';

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

    section.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.marquee__nav')) return;
      dragging = true;
      startX = e.clientX;
      startOffset = offset;
      track.classList.remove('is-snapping');
      section.style.cursor = 'grabbing';
      if (section.setPointerCapture) section.setPointerCapture(e.pointerId);
    });
    section.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      offset = startOffset - (e.clientX - startX);
      apply();
    });
    function release() {
      if (!dragging) return;
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
    section.addEventListener('pointerleave', release);

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

    var setWidth = 0;
    function measure() { setWidth = track.getBoundingClientRect().width / 2; }

    var offset = 0, dragging = false, paused = false, startX = 0, startOffset = 0;

    function apply() {
      var x = ((offset % setWidth) + setWidth) % setWidth;
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }

    row.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      startOffset = offset;
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
    var onScroll = function () {
      toTop.classList.toggle('is-show', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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

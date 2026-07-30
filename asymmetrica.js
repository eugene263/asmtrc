/* =====================================================================
   ASYMMETRICA — landing page interactions
   ===================================================================== */
(function () {
  'use strict';

  var GAP = 24;   // matches .marquee__track gap
  var SPEED = 0.4; // px per frame auto-scroll

  /* ---- carousel data ------------------------------------------------ */
  var TRACKS = {
    pano: [
      { src: 'assets/pano-1.png', alt: 'НРК на мховій купині', w: 900 },
      { src: 'assets/pano-2.png', alt: 'НРК в ангарі',        w: 900 },
      { src: 'assets/pano-3.png', alt: 'НРК у струмку',        w: 900 }
    ],
    grid: [
      { src: 'assets/grid-1.png', alt: 'Пульт FPV',            w: 1000 },
      { src: 'assets/grid-2.png', alt: 'Пілоти на полігоні',   w: 1000 },
      { src: 'assets/grid-3.png', alt: 'FPV-літак на стенді',  w: 1000 }
    ]
  };

  /* ---- infinite drag/auto-scroll carousel --------------------------- */
  function setupMarquee(section) {
    var key = section.getAttribute('data-track');
    var items = TRACKS[key];
    if (!items) return;

    var track = section.querySelector('[data-role="track"]');
    var setWidth = items.reduce(function (a, it) { return a + it.w + GAP; }, 0);

    // duplicate the set so the loop is seamless
    items.concat(items).forEach(function (it) {
      var cell = document.createElement('div');
      cell.className = 'marquee__cell';
      cell.style.width = it.w + 'px';
      var img = document.createElement('img');
      img.src = it.src;
      img.alt = it.alt;
      img.draggable = false;
      cell.appendChild(img);
      track.appendChild(cell);
    });

    var offset = 0, dragging = false, startX = 0, startOffset = 0;

    function apply() {
      var x = ((offset % setWidth) + setWidth) % setWidth;
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }

    section.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      startOffset = offset;
      section.style.cursor = 'grabbing';
      if (section.setPointerCapture) section.setPointerCapture(e.pointerId);
    });
    section.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      offset = startOffset - (e.clientX - startX);
      apply();
    });
    function release() { dragging = false; section.style.cursor = 'grab'; }
    section.addEventListener('pointerup', release);
    section.addEventListener('pointerleave', release);

    return {
      tick: function () { if (!dragging) { offset += SPEED; apply(); } }
    };
  }

  var marquees = [];
  document.querySelectorAll('.js-drag').forEach(function (s) {
    var m = setupMarquee(s);
    if (m) marquees.push(m);
  });
  (function loop() {
    marquees.forEach(function (m) { m.tick(); });
    requestAnimationFrame(loop);
  })();

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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var valid = f.value.trim() &&
          (f.type !== 'email' || /.+@.+\..+/.test(f.value));
        f.classList.toggle('is-error', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      form.reset();
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

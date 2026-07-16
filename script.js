/* ============================================================
   English Office — hero interactions
   Lightweight, dependency-free.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Format filters (Online / У Польщі / В Європі) ---- */
  const filterGroup = document.querySelector('.filters');
  if (filterGroup) {
    const chips = filterGroup.querySelectorAll('.chip');
    filterGroup.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chips.forEach(function (c) {
        const active = c === chip;
        c.classList.toggle('chip--active', active);
        c.setAttribute('aria-selected', String(active));
      });
    });
  }

  /* ---- Dropdown toggles (Контакти / UA) ---- */
  document.querySelectorAll('.dropdown').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---- Carousel dots (demo state) ---- */
  const dots = document.querySelectorAll('.carousel-dots .dot');
  dots.forEach(function (dot, i) {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', 'Слайд ' + (i + 1));

    function activate() {
      dots.forEach(function (d) { d.classList.remove('dot--active'); });
      dot.classList.add('dot--active');
    }
    dot.addEventListener('click', activate);
    dot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
})();

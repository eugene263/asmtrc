/* =====================================================================
   Shared mobile burger menu toggle — used on the homepage and every
   product page. Looks for .js-burger / .js-mobile-menu / .js-menu-backdrop
   and no-ops if a page doesn't have them.
   ===================================================================== */
(function () {
  'use strict';

  var burger = document.querySelector('.js-burger');
  var mobileMenu = document.querySelector('.js-mobile-menu');
  var menuBackdrop = document.querySelector('.js-menu-backdrop');
  if (!burger || !mobileMenu) return;

  var closeMenu = function () {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    if (menuBackdrop) menuBackdrop.classList.remove('is-open');
    document.body.classList.remove('is-menu-open');
  };
  var toggleMenu = function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    mobileMenu.classList.toggle('is-open', !open);
    if (menuBackdrop) menuBackdrop.classList.toggle('is-open', !open);
    document.body.classList.toggle('is-menu-open', !open);
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
})();

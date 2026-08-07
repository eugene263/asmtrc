/* =====================================================================
   Shared "заявка" contact form validation — k2.html, kryla.html, gstation.html
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('.js-pc-form');
  var toast = document.querySelector('.js-pc-toast');
  if (!form) return;

  var toastTimer;
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
})();

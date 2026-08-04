/* =====================================================================
   Shared "заявка" contact form validation — k2.html, kryla.html, gstation.html
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('.js-pc-form');
  var toast = document.querySelector('.js-pc-toast');
  if (!form) return;

  var toastTimer;
  form.querySelectorAll('[required]').forEach(function (f) {
    f.addEventListener('input', function () {
      f.classList.remove('is-error');
      var group = f.closest('.pc-field-group') || f.parentElement;
      var errorEl = group && group.querySelector('.pc-field-error');
      if (errorEl) errorEl.classList.remove('is-show');
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!window.SPEXTR_validateForm(form)) return;
    form.reset();
    if (toast) {
      toast.classList.add('is-show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove('is-show');
      }, 4200);
    }
  });
})();

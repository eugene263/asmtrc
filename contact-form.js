/* =====================================================================
   Shared "заявка" contact form validation — k2.html, kryla.html, gstation.html
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('.js-pc-form');
  var toast = document.querySelector('.js-pc-toast');
  if (!form) return;

  var toastTimer;
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
})();

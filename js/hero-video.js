/* =====================================================================
   Mobile-only hero background video. Desktop keeps the static photo —
   the <video> has no source in the markup, so nothing is ever
   downloaded there; only on narrow viewports do we attach a source
   and start playback, swapping it in over the photo once it's ready.
   ===================================================================== */
(function () {
  'use strict';

  var video = document.querySelector('.js-hero-video');
  if (!video) return;
  if (!window.matchMedia || !window.matchMedia('(max-width: 720px)').matches) return;

  var source = document.createElement('source');
  source.src = '../assets/hero-bg-mobile.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);
  video.addEventListener('canplay', function () {
    video.classList.add('is-active');
  }, { once: true });
  video.load();
  var playPromise = video.play();
  if (playPromise && playPromise.catch) playPromise.catch(function () {});
})();

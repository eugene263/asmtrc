/* =====================================================================
   Hero background video, swapped in over the static photo once it's
   ready. The <video> has no <source> in the markup, so nothing is
   downloaded until this script picks one — a small portrait clip on
   narrow viewports, a small landscape clip on wide ones — keeping the
   photo as the instant first paint and as the fallback if playback
   never starts (autoplay blocked, slow connection, load failure).
   ===================================================================== */
(function () {
  'use strict';

  var video = document.querySelector('.js-hero-video');
  if (!video || !window.matchMedia) return;

  var isMobile = window.matchMedia('(max-width: 720px)').matches;
  var src = isMobile ? '../assets/hero-bg-mobile.mp4' : '../assets/hero-bg-desktop.mp4';

  var source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.appendChild(source);
  video.addEventListener('canplay', function () {
    video.classList.add('is-active');
  }, { once: true });
  video.load();
  var playPromise = video.play();
  if (playPromise && playPromise.catch) playPromise.catch(function () {});
})();

'use strict';
// Apply preference before first paint. Storage can be blocked in private browsers.
(() => {
  document.documentElement.classList.add('js');
  let paused = false;
  try { paused = localStorage.getItem('sahil-motion-paused') === 'true'; } catch {}
  document.documentElement.classList.toggle('motion-paused', paused || matchMedia('(prefers-reduced-motion: reduce)').matches);
})();

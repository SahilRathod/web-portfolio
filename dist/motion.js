'use strict';
(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let manualPause = false;
  try { manualPause = localStorage.getItem('sahil-motion-paused') === 'true'; } catch {}
  const listeners = new Set();
  const api = {
    get paused() { return manualPause || media.matches; },
    subscribe(fn) { listeners.add(fn); fn(api.paused); return () => listeners.delete(fn); }
  };
  window.portfolioMotion = api;
  function sync() {
    root.classList.toggle('motion-paused', api.paused);
    document.querySelectorAll('[data-motion-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(api.paused));
      button.setAttribute('aria-label', media.matches ? 'Animations disabled by your device preference' : api.paused ? 'Enable animations' : 'Pause animations');
      button.disabled = media.matches;
      button.querySelector('[data-motion-label]').textContent = api.paused ? 'Motion off' : 'Motion on';
    });
    listeners.forEach(fn => fn(api.paused));
  }
  document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
    manualPause = !manualPause;
    try { localStorage.setItem('sahil-motion-paused', String(manualPause)); } catch {}
    sync();
  }));
  media.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => root.classList.toggle('is-hidden', document.hidden));
  sync();
})();

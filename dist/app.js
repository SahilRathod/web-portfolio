'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const motion = window.portfolioMotion;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const menu = $('.menu-toggle');
  const nav = $('#navigation');
  function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Visibility-based reveals avoid an always-running scroll loop.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending'); entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }), { threshold: .05, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(el => { if (!motion.paused) el.classList.add('is-pending'); observer.observe(el); });
    motion.subscribe(paused => { if (paused) reveals.forEach(el => { el.classList.remove('is-pending'); observer.unobserve(el); }); });
  }

  // Coalesce pointer events into one frame. Z planes are defined in CSS.
  $$('[data-depth]').forEach(scene => {
    let frame = 0; let nextX = 0; let nextY = 0;
    const limit = Number(scene.dataset.depthLimit) || 7;
    function reset() {
      cancelAnimationFrame(frame); frame = 0; scene.classList.remove('is-pointing');
      scene.style.setProperty('--rx', '0deg'); scene.style.setProperty('--ry', '0deg');
      scene.style.setProperty('--lx', '50%'); scene.style.setProperty('--ly', '50%');
    }
    scene.addEventListener('pointermove', event => {
      if (motion.paused || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = scene.getBoundingClientRect();
      nextX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      nextY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0; scene.classList.add('is-pointing');
        scene.style.setProperty('--rx', `${(0.5 - nextY) * limit * 2}deg`);
        scene.style.setProperty('--ry', `${(nextX - 0.5) * limit * 2}deg`);
        scene.style.setProperty('--lx', `${nextX * 100}%`); scene.style.setProperty('--ly', `${nextY * 100}%`);
      });
    }, { passive: true });
    scene.addEventListener('pointerleave', reset); scene.addEventListener('pointercancel', reset);
    finePointer.addEventListener('change', reset); motion.subscribe(paused => { if (paused) reset(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  });
  let scrollFrame = 0;
  function progress() {
    scrollFrame = 0; const distance = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--read', distance > 0 ? Math.min(1, scrollY / distance) : 0);
  }
  function queueProgress() { if (!motion.paused && !scrollFrame) scrollFrame = requestAnimationFrame(progress); }
  addEventListener('scroll', queueProgress, { passive: true }); addEventListener('resize', queueProgress); progress();

  const search = $('#project-search');
  if (search) {
    let category = 'all'; const cards = $$('.project-card');
    function filter() {
      const term = search.value.trim().toLowerCase(); let count = 0;
      cards.forEach(card => {
        const show = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(term);
        card.hidden = !show; if (show) count++;
      });
      $('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'}${term ? ` matching “${search.value.trim()}”` : ''}`;
      $('#empty-results').hidden = count !== 0;
    }
    $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); filter();
    }));
    search.addEventListener('input', filter);
    $('#reset-search').addEventListener('click', () => {
      search.value = ''; category = 'all';
      $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
      filter(); search.focus();
    });
  }
  const range = $('#depth-range');
  if (range) {
    const update = () => { $('.lab-depth').style.setProperty('--layer-depth', range.value); $('#depth-value').value = `${range.value}%`; };
    range.addEventListener('input', update); $('#reset-depth').addEventListener('click', () => { range.value = '65'; update(); }); update();
  }
  const copy = $('[data-copy-email]');
  copy?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copy.dataset.copyEmail); $('#copy-feedback').textContent = 'Email address copied.'; }
    catch { $('#copy-feedback').textContent = 'Copy unavailable. Select the email address above, or open its link.'; }
  });
  $('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault(); const name = $('#contact-name').value.trim(); const message = $('#contact-message').value.trim();
    if (!name || !message) {
      $('#form-status').textContent = 'Please add your name and a short message.';
      (!name ? $('#contact-name') : $('#contact-message')).focus(); return;
    }
    const subject = `${$('#contact-topic').value} — ${name}`;
    const body = `Hi Sahil,\n\n${message}\n\nFrom,\n${name}`;
    location.href = `mailto:${copy.dataset.copyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $('#form-status').textContent = 'Your email app should open a draft. Review and send it there, or use the email link above.';
  });
})();

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../dist/atlas.js'), 'utf8');

function harness(reduced = false) {
  const frames = new Map();
  const listeners = {};
  const canvasEvents = {};
  let frameId = 0;
  let observer;
  let renders = 0;
  const noop = () => {};
  const context = new Proxy({ clearRect: () => renders++ }, { get: (target, key) => target[key] || noop });
  const canvas = { width: 0, height: 0, getContext: () => context, getBoundingClientRect: () => ({ width: 400, height: 400, left: 0, top: 0 }), addEventListener: (event, callback) => canvasEvents[event] = callback };
  const attributes = {};
  const toggle = { setAttribute: (key, value) => attributes[key] = value, addEventListener: (_, callback) => listeners.click = callback };
  const motion = { paused: reduced, subscribe(fn) { listeners.motion = fn; fn(this.paused); } };
  const document = { hidden: false, documentElement: { classList: { toggle: noop } }, querySelector: selector => selector === '#atlas-canvas' ? canvas : toggle, querySelectorAll: () => [], addEventListener: (event, callback) => listeners[event] = callback };
  const environment = {
    document, portfolioMotion: motion, devicePixelRatio: 4,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} },
  };
  environment.window = environment;
  vm.runInNewContext(source, environment);
  return { frames, listeners, canvas, toggle, attributes, document, motion, renders: () => renders, visibility: value => observer([{ isIntersecting: value }]) };
}

test('pixel ratio is capped at 2 and startup creates exactly one frame loop', () => {
  const h = harness();
  assert.equal(h.canvas.width, 800);
  assert.equal(h.canvas.height, 800);
  assert.equal(h.frames.size, 1);
});
test('pause cancels the frame loop; resume does not duplicate it', () => {
  const h = harness();
  h.motion.paused = !h.motion.paused; h.listeners.motion(h.motion.paused);
  assert.equal(h.frames.size, 0);
  h.motion.paused = !h.motion.paused; h.listeners.motion(h.motion.paused);
  h.visibility(true);
  h.visibility(true);
  assert.equal(h.frames.size, 1);
});
test('shared motion preference draws a static illustration and responds to changes', () => {
  const h = harness(true);
  assert.equal(h.frames.size, 0);
  assert.ok(h.renders() > 0);
  h.motion.paused = false;
  h.listeners.motion(false);
  assert.equal(h.frames.size, 1);
  h.motion.paused = true;
  h.listeners.motion(true);
  assert.equal(h.frames.size, 0);
});
test('offscreen canvas stops scheduling work and restarts once on return', () => {
  const h = harness();
  h.visibility(false);
  assert.equal(h.frames.size, 0);
  h.visibility(true);
  assert.equal(h.frames.size, 1);
});
test('background tab suspends motion while preserving a manual pause', () => {
  const h = harness();
  h.document.hidden = true;
  h.listeners.visibilitychange();
  assert.equal(h.frames.size, 0);
  h.document.hidden = false;
  h.listeners.visibilitychange();
  assert.equal(h.frames.size, 1);
  h.motion.paused = !h.motion.paused; h.listeners.motion(h.motion.paused);
  h.document.hidden = true;
  h.listeners.visibilitychange();
  h.document.hidden = false;
  h.listeners.visibilitychange();
  assert.equal(h.frames.size, 0);
});

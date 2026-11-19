import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '../dist');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Exactly one primary heading');
assert.match(html, /<html lang="en">/, 'Document language');
for (const [, href] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}`);
  else if (!/^(https:|mailto:)/.test(href)) assert.ok(existsSync(resolve(root, href)), `Missing asset ${href}`);
  assert.ok(!/^(javascript:|http:)/i.test(href), `Unsafe link ${href}`);
}
const app = readFileSync(resolve(root, 'app.js'), 'utf8');
for (const [, project] of html.matchAll(/data-project="([^"]+)"/g)) assert.match(app, new RegExp(`\\b${project}:`));
for (const [, source] of html.matchAll(/<script[^>]*src="([^"]+)"/g)) assert.ok(!source.startsWith('https:'), 'No external runtime');
const files = ['index.html', 'styles.css', 'app.js', 'atlas.js', 'assets/favicon.svg', 'assets/star.svg'];
const bytes = files.reduce((sum, file) => sum + statSync(resolve(root, file)).size, 0);
assert.ok(bytes < 120_000, `Static payload exceeds budget: ${bytes}`);
assert.ok(!existsSync(resolve(root, 'qa.html')), 'Remove temporary QA page before publication');
console.log(`PASS: anchors, assets, IDs, headings, project keys, secure links and ${bytes.toLocaleString()} byte static payload.`);

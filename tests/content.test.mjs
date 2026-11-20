import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent, validateAsset, validateLink, escapeHTML, loadContent } from '../scripts/content.mjs';
test('actual profile and projects are valid', () => assert.doesNotThrow(loadContent));
test('editable text cannot break out of HTML', () => assert.equal(escapeHTML('<img onerror="x"> & \'test\''), '&lt;img onerror=&quot;x&quot;&gt; &amp; &#39;test&#39;'));
test('assets cannot traverse out of local images', () => {
  for (const p of ['../private.png','assets/../private.png','https://host/photo.png','assets/pic.png" onerror="x','assets/pic.js']) assert.throws(() => validateAsset(p));
  assert.doesNotThrow(() => validateAsset('assets/photos/sahil.webp'));
});
test('public links reject executable protocols and credentials', () => {
  for (const url of ['javascript:alert(1)','http://example.com','https://user:password@example.com']) assert.throws(() => validateLink(url));
  assert.doesNotThrow(() => validateLink('https://github.com/SahilRathod'));
});
test('duplicate slugs cannot overwrite detail pages', () => {
  const {profile,projects} = loadContent(); projects.push(structuredClone(projects[0])); assert.throws(() => validateContent(profile,projects),/unique/);
});
test('new projects accept custom covers and accessible screenshots', () => {
  const {profile,projects} = loadContent(); projects.push({...structuredClone(projects[0]),slug:'next-project',visual:'custom',screenshots:[{src:'assets/photos/project.webp',alt:'Project screen'}]});
  assert.doesNotThrow(() => validateContent(profile,projects)); projects.at(-1).screenshots[0].alt=''; assert.throws(() => validateContent(profile,projects),/alt/);
});

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { loadContent } from './content.mjs';
const root = resolve(import.meta.dirname,'../dist');
const {profile,projects} = loadContent();
const pages = readdirSync(root).filter(f=>f.endsWith('.html'));
const titles = new Set(); let codeBytes = 0;
function checkReference(ref,file) {
  if (/^(https:|mailto:|data:)/.test(ref)) return;
  assert.ok(!/^(javascript:|http:|\/\/)/i.test(ref),`${file}: unsafe reference`);
  const [target,fragment] = ref.split('#'); const destination = resolve(root,target||file);
  assert.ok(destination.startsWith(root+'/') && existsSync(destination),`${file}: missing ${ref}`);
  if (fragment) assert.ok(readFileSync(destination,'utf8').includes(`id="${fragment}"`),`${file}: missing fragment ${ref}`);
}
for (const file of pages) {
  const html = readFileSync(resolve(root,file),'utf8'); codeBytes += Buffer.byteLength(html);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${file}: duplicate IDs`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one primary heading`);
  assert.match(html,/<html lang="en">/); assert.match(html,/<meta name="description" content="[^"]+">/);
  const title = html.match(/<title>(.*?)<\/title>/)[1]; assert.ok(!titles.has(title),'Unique titles'); titles.add(title);
  for (const [,ref] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) checkReference(ref,file);
  for (const [,srcset] of html.matchAll(/\bsrcset="([^"]+)"/g)) for (const item of srcset.split(',')) checkReference(item.trim().split(/\s+/)[0],file);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) { assert.match(tag,/\balt="[^"]*"/); assert.match(tag,/\bwidth="\d+"/); assert.match(tag,/\bheight="\d+"/); }
  assert.ok(!/<script[^>]*src="https?:/.test(html),'No external runtime');
}
for (const file of readdirSync(root).filter(f=>/\.(css|js)$/.test(f))) {
  codeBytes += statSync(resolve(root,file)).size;
  if (file.endsWith('.css')) for (const [,ref] of readFileSync(resolve(root,file),'utf8').matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) checkReference(ref,file);
}
for (const path of [profile.portrait,...projects.flatMap(p=>[p.cover,...p.screenshots.map(s=>s.src)])].filter(Boolean)) assert.ok(existsSync(resolve(root,path)),`Missing configured asset ${path}`);
assert.equal(pages.length,projects.length+7);
assert.ok(codeBytes<300_000,`Code budget exceeded: ${codeBytes}`);
const imageBytes = readdirSync(resolve(root,'assets/art')).reduce((sum,f)=>sum+statSync(resolve(root,'assets/art',f)).size,0);
assert.ok(imageBytes<500_000,`Artwork budget exceeded: ${imageBytes}`);
assert.ok(!existsSync(resolve(root,'qa.html')),'Remove temporary QA host before publishing');
console.log(`PASS: ${pages.length} pages; IDs, titles, assets, fragments, image variants, content; ${codeBytes} B code, ${imageBytes} B artwork.`);

const vendorBytes = readdirSync(resolve(root,'vendor')).reduce((s,f)=>s+statSync(resolve(root,'vendor',f)).size,0);
assert.ok(vendorBytes<900_000,`Vendor budget exceeded: ${vendorBytes}`);
const fontBytes = readdirSync(resolve(root,'assets/fonts')).reduce((s,f)=>s+statSync(resolve(root,'assets/fonts',f)).size,0);
assert.ok(fontBytes<150_000,`Font budget exceeded: ${fontBytes}`);
console.log(`Vendor: ${vendorBytes} B; fonts and notices: ${fontBytes} B. All local.`);

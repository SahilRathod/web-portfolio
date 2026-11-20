import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export const root = resolve(import.meta.dirname, '..');
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateAsset(value) {
  if (value == null) return;
  if (typeof value !== 'string' || !/^assets\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|svg|avif)$/i.test(value) || value.split('/').includes('..')) throw new Error('Invalid local image path');
}
export function validateLink(value) {
  if (value == null) return;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Public links must use HTTPS without credentials');
}
export function validateContent(profile, projects) {
  if (!profile.name || !profile.role || !Array.isArray(profile.bio)) throw new Error('Profile needs name, role and bio');
  if (!/^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(profile.email)) throw new Error('Invalid email');
  if (!/^\d{1,3}% \d{1,3}%$/.test(profile.portraitPosition) || profile.portraitPosition.split(' ').some(v => parseInt(v, 10) > 100)) throw new Error('Portrait position must be percentages from 0 to 100');
  validateAsset(profile.portrait); validateLink(profile.github);
  if (!Array.isArray(projects) || !projects.length) throw new Error('At least one project is required');
  const slugs = new Set();
  for (const p of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw new Error('Project slugs must be unique and URL-safe');
    slugs.add(p.slug);
    if (!['software','experiments'].includes(p.category)) throw new Error('Unknown category');
    if (!['autopilot','jarvis','omnitrix','custom'].includes(p.visual)) throw new Error('Unknown visual');
    if (!p.name || !p.summary || !p.intro || !Array.isArray(p.stack) || !Array.isArray(p.screenshots) || !p.sections?.length || p.sections.some(s => !s.heading || !s.body)) throw new Error('Incomplete project content');
    validateAsset(p.cover); validateLink(p.repository); validateLink(p.liveUrl);
    p.screenshots.forEach(image => { validateAsset(image.src); if (!image.src || !image.alt) throw new Error('Screenshot needs src and alt'); });
  }
}
export function loadContent() {
  const profile = JSON.parse(readFileSync(resolve(root, 'content/profile.json'), 'utf8'));
  const projects = JSON.parse(readFileSync(resolve(root, 'content/projects.json'), 'utf8'));
  validateContent(profile, projects); return { profile, projects };
}

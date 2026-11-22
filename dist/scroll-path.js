// Pure interpolation shared by the scene and its regression tests.
export function samplePath(points, position) {
  if (!points.length) throw new Error('A scroll path needs at least one point');
  if (position <= points[0].at) return {...points[0]};
  if (position >= points.at(-1).at) return {...points.at(-1)};
  const end = points.findIndex(point => point.at >= position);
  const a = points[end - 1], b = points[end];
  const distance = b.at - a.at;
  const t = distance ? Math.max(0, Math.min(1, (position - a.at) / distance)) : 1;
  const eased = t * t * (3 - 2 * t);
  return Object.fromEntries(Object.keys(a).map(key => [key, key === 'at' ? position : a[key] + (b[key] - a[key]) * eased]));
}

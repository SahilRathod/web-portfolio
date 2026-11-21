# Validation — résumé-driven redesign

## Automated

- Deterministic HTML build: 11 pages, unique titles and primary headings.
- Internal links, image dimensions/alt text, asset references, project slugs and content validated.
- Script syntax checks for authored runtime modules.
- Content-safety tests, shared motion tests, legacy atlas regression tests and software-renderer tests.
- The software-renderer regression explicitly verifies that consecutive material changes draw immediately while motion is paused.

## Browser review

Reviewed in the managed Chrome preview on 21 November 2026:

- Desktop home composition and project presentation.
- Pinned stack sequence observed at multiple scroll positions: plane orientation, separation and text emphasis changed with scroll.
- Pause persisted when moving from Home to Lab; resuming removed the paused state.
- Lab geometry, material and separation updated visually; reset restored all defaults.
- Work professional filter yielded one project; unmatched search showed empty state; reset restored four projects.
- Mobile menu opened and navigated to Experience at a 390px frame width.
- Home, Work, Experience, About, Lab and Contact reviewed in the mobile frame. Contact settled at equal document/client width (375px excluding scrollbar); transition-time snapshots can temporarily include the scrollbar width.
- New page console logs contained no application errors after the WebGL capability fallback was added; browser-extension metadata warnings are external to the app.

## Verification limits

This browser has WebGL disabled. The live software-rendered 3D path was exercised. The hardware WebGL path uses the same geometry and state, but its GPU rendering has not been visually verified in this environment. It should be checked on a WebGL2-capable device before claiming complete cross-device coverage.

Mobile review used a narrow browser iframe, not a physical phone. OS reduced-motion and blocked-storage behavior are covered by unit tests; no blanket accessibility certification or Lighthouse score is claimed. Contact draft behavior is implemented with `mailto:` and no message was sent.

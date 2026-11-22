# Add your photos and future projects

## Portrait

1. Put your photo at `dist/assets/photos/sahil.webp` (create the folder if needed).
2. In `content/profile.json`, set `"portrait": "assets/photos/sahil.webp"`.
3. Set `portraitAlt` to a useful description and `portraitPosition` to the crop focus, such as `"50% 40%"`. Values must be 0–100%.
4. Run `node scripts/build.mjs` and `node scripts/check.mjs`.

A 1000 × 1200 portrait works well. About uses a 5:6 crop. With `portrait: null`, the designed SR monogram remains. No fake headshot is used.

Edit your role, level, location, introductory sentence, biography, email and GitHub link in the same file. The styled Sahil/Rathod hero and wordmark live in `scripts/build.mjs` if you ever need to change the identity itself.

## Project

Copy a project object in `content/projects.json`, add it to the array, and replace its text. Give it a unique lower-case, hyphenated slug such as `my-next-project`.

| Field | Value |
| --- | --- |
| `name`, `eyebrow`, `summary`, `intro` | Name, category caption, card description and page introduction |
| `category` | `software` or `experiments` for filtering |
| `status`, `focus`, `stack` | Actual stage, your contribution and technologies |
| `visual` | `custom` for new projects |
| `cover` | `assets/projects/example.webp`, or null for a typographic cover |
| `repository`, `liveUrl` | Real public HTTPS URLs, or null to hide links |
| `sections` | Array of objects with `heading` and `body` text |
| `screenshots` | Array of `{ "src": "assets/projects/screen.webp", "alt": "Useful description", "caption": "Optional caption" }` |

Place project images under `dist/assets/projects/`. Covers around 1600 × 1100 pixels work well. WebP/AVIF keeps downloads small; PNG/JPEG/SVG are also supported. Use images you own or are allowed to publish. Remove personal data from screenshots.

```sh
node scripts/build.mjs
node scripts/check.mjs
node --test tests/*.test.*
```

The builder creates the page, updates Home/Work and next-project links, and removes obsolete generated project pages. Commit content, assets and generated HTML together. No npm packages are needed.

## Design

Colors are CSS variables at the top of `dist/styles.css`. Templates live in `scripts/build.mjs`; interactions are in `dist/app.js`. Figma is only a design source, not a runtime dependency. Never place plugin credentials or account tokens in this repository.

## Résumé and professional work

The `experience` array in `content/profile.json` now populates the Experience page. Each entry has `company`, `role`, `dates`, `body` and `tags`. The profile includes the professional email and LinkedIn URL supplied in the résumé. Street address and phone are not published.

Project `category` accepts `professional`, `software` or `experiments`. `visual` also accepts `bonton`. Set `cover` to your own local image to replace conceptual artwork. For a new project, choose `visual: "custom"`, a unique slug and a real description. Avoid including confidential employer code or data.

Typography, page layout and breakpoint rules are in `dist/styles.css`. Runtime animation lives in `dist/app.js` and `dist/sculpture.js`; these files are authored directly and are not overwritten by the HTML build.

## Personal identity and scroll chapters

The identity badge uses the name, role and location from `content/profile.json`. The layered identity card automatically uses `portrait`, `portraitAlt` and `portraitPosition` from that same file; until a real photo is configured, it shows an original SR monogram.

`scripts/personal.mjs` contains the three personal chapters and About-page notes. `dist/personal.css` contains glass styling and responsive variants. `dist/personal.js` handles pointer-following highlights. No new external image, font or library dependency is required.

Desktop screens at least 900px wide and 650px high receive the pinned horizontal sequence. Smaller viewports, JavaScript-free pages and paused/reduced-motion preferences use stacked chapters. The global motion control disables the pinning and decorative animation.

### Continuous homepage sculpture and text

- `dist/scroll-scene.js` maps real section positions to the object's viewport
  position, scale, rotation and layer separation. The same object travels from
  the hero to the footer, and the path reverses when scrolling upward.
- `dist/scroll-path.js` provides deterministic, clamped interpolation.
- `dist/scroll-story.css` contains the fixed canvas and text-mask presentation.
- `dist/app.js` animates heading words and fills the three-line statement as the
  reader scrolls. Text remains present for assistive technology and without JS.
- `dist/espresso.css` contains the user-selected Color Hunt palette.

The motion toggle and OS reduced-motion preference restore a static hero scene,
remove pinned sections, and show all heading words and text fills immediately.
No mouse-wheel interception is used. The scene shrinks at dense content and on
mobile to keep links and text usable; its canvas never captures clicks.

The résumé contains no portrait. `content/profile.json` still has `portrait:null`.
Set the existing portrait fields after a real photo is supplied; the image will
appear in the story card and About page. Initials are intentionally retained
until then, rather than using a stock person or a generated likeness.

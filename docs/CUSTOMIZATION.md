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

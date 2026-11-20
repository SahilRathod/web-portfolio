# Sahil Rathod — Portfolio

A multi-page personal portfolio in **HTML, CSS and vanilla JavaScript**. Original project illustrations, custom Figma artwork, spatial layers, scroll reveals and accessible motion preferences. No framework, runtime packages, trackers, external fonts or API keys.

## Pages

Home, Work, About, Lab, Contact, three individual project stories and a 404 page. These are real HTML documents with direct URLs and browser history. Native view transitions enhance navigation in supporting browsers.

## Run locally

The generated pages are committed, so viewing the website needs no npm installation:

```powershell
cd web-portfolio
py -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Use `python3` on macOS/Linux. Serving the directory enables browser features that may be restricted for directly opened files.

## Add photos and projects

Edit `content/profile.json` for your biography, contact details and portrait. Edit `content/projects.json` for project stories, covers, screenshots and public links. Then rebuild with Node.js 22 or newer:

```sh
node scripts/build.mjs
node scripts/check.mjs
node --test tests/*.test.*
```

Commit the changed content, images and regenerated `dist/` files together. See [the customization guide](docs/CUSTOMIZATION.md) for exact steps.

| Path | Purpose |
| --- | --- |
| `content/` | Editable profile and project data |
| `scripts/build.mjs` | Shared templates and static page generation |
| `scripts/content.mjs` | Safe text, asset-path and content validation |
| `src/*-visual.html` | Original project concept illustrations |
| `dist/*.html` | Ready-to-host documents |
| `dist/styles.css`, `dist/art.css` | Layout, responsive behavior and artwork |
| `dist/app.js` | Menu, search, depth effects and contact interactions |
| `dist/motion*.js` | Shared motion preference, applied before first paint |
| `dist/atlas.js` | Canvas globe with offscreen/background suspension |
| `tests/`, `docs/` | Regression tests, editing instructions and provenance |

## Motion and contact

“4D layers” describes CSS 3D planes changing over time, with pointer perspective and moving light. It is not a fourth-dimensional renderer. Touch layouts keep a readable composition; scrolling remains native.

The motion control persists between pages and respects system reduced-motion preferences. Content and page navigation work without JavaScript. The contact form prepares a draft in the visitor’s email app. It does not send, collect or store messages.

## Deployment and checks

Serve `dist/` from any static host. No remote build is required. CI validates regenerated HTML, script syntax, links, content, image variants and regression tests. GitHub Pages remains optional: select GitHub Actions in Settings → Pages, then manually run **Deploy GitHub Pages**. The existing review site retains its private audience.

See [QA](docs/QA.md), [new asset provenance](docs/ASSETS.md) and [original plugin contributions](docs/DESIGN-PROVENANCE.md). Project descriptions reflect their actual stage; there are no invented employers, awards, client testimonials or usage metrics.

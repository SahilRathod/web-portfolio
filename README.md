# Sahil Rathod — Builder Atlas

A personal developer portfolio made with **HTML, CSS and JavaScript**. No framework, runtime dependencies, build step, trackers, external fonts or API keys.

## Run locally

Open `dist/index.html` directly, or serve the folder for clipboard support:

```powershell
cd web-portfolio
py -m http.server 8000 --directory dist
```

Visit `http://localhost:8000`. On macOS/Linux use `python3` instead of `py`. No npm installation is needed to run the site.

## Files

| File | Purpose |
| --- | --- |
| `dist/index.html` | Content, semantic structure and no-JavaScript project summaries |
| `dist/styles.css` | Design tokens, responsive layouts and motion preferences |
| `dist/app.js` | Navigation, project filtering, dialogs and clipboard feedback |
| `dist/atlas.js` | Original parametric canvas globe with Orbit and Signal modes |
| `dist/assets/` | Small original SVG brand artwork |
| `scripts/check.mjs` | Dependency-free static validation |
| `docs/` | Design decisions, implementation plan, provenance and QA record |

## Customize

Edit your introduction, links and email in `dist/index.html`. Edit expanded project stories in the `projects` object in `dist/app.js` and keep the no-JavaScript summaries in HTML consistent. Change the palette through the CSS variables at the top of `dist/styles.css`.

Contact opens the visitor’s email application. There is no form backend and no message storage. Clipboard failure displays a readable alternative.

## Verification

Requires Node.js 22+ for the development checks only:

```sh
node --check dist/app.js
node --check dist/atlas.js
node scripts/check.mjs
node --test tests/atlas.test.cjs
```

See `docs/QA.md` for browser checks and limits. Continuous integration repeats these checks on pushes and pull requests.

## Deploy

Any static host can serve `dist/` as the site root; no build command is required. For GitHub Pages, enable GitHub Actions as the Pages source in repository Settings, then run the included **Deploy GitHub Pages** workflow manually. Availability for private repositories depends on your GitHub plan. The workflow does not make the repository public.

## Content accuracy

- Autopilot AI is a local personal project. Its V0.5 README was checked on November 19, 2026. It does not automatically upload to YouTube, transcribe speech or provide production authentication.
- JARVIS is an early exploration, not a finished autonomous assistant.
- Omnitrix is an unofficial fan-made interface experiment; no franchise affiliation or hardware integration is claimed.
- The project illustrations are original conceptual compositions, not screenshots of production systems.
- No invented employers, client endorsements, awards or success metrics are included.

## Repository

Source: https://github.com/SahilRathod/web-portfolio

The **Check portfolio** workflow validates each push and pull request. GitHub Pages remains an optional, manually triggered deployment; configure it in Settings → Pages before running **Deploy GitHub Pages**.

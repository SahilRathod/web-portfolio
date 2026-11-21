# Sahil Rathod — Full stack, full attention

A personal portfolio built with HTML, CSS and JavaScript. Eleven standalone HTML documents, original artwork, résumé-based professional content and a live procedural 3D sculpture. GSAP choreographs the scroll experience; Three.js supplies geometry and WebGL rendering. All runtime libraries and fonts are self-hosted and pinned. No npm installation or API key is needed to view the site.

## Explore

Home · Work · Experience · About · Lab · Contact · four project pages · 404.

Bonton Holidays is presented as a professional contribution at Multiicon. Autopilot AI, JARVIS and Omnitrix are personal projects with honest development-stage descriptions. Conceptual illustrations are not presented as production screenshots.

## Run locally

```powershell
cd web-portfolio
py -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. On macOS/Linux, use `python3`. Serve over HTTP rather than opening an HTML file directly: the sculpture uses JavaScript modules.

## Edit and verify

Profile, experience, email, portrait and biography: `content/profile.json`.
Project descriptions, covers, galleries and links: `content/projects.json`.

```sh
node scripts/build.mjs
node scripts/check.mjs
node --test tests/*.test.*
```

Use Node 22 or newer. Commit content edits together with the regenerated HTML. See [CUSTOMIZATION](docs/CUSTOMIZATION.md).

## Personal identity

A profile badge introduces Sahil by name. Three scroll chapters connect customer-support roots, full-stack work and personal curiosity. The About page adds glass cards for location, languages, local AI and a people-first approach. The existing portrait setting replaces the SR identity artwork when a real photo is added.

## Motion architecture

- `dist/app.js`: native navigation, mobile menu, search/filter, contact drafts and reversible GSAP/ScrollTrigger timelines.
- `dist/sculpture.js`: one shared 3D scene, independent moving layers, pointer rotation, materials and geometry controls.
- `dist/software-renderer.js`: Canvas 2D rendering of the same 3D mesh when WebGL is unavailable. It preserves the Lab controls with a more faceted appearance.
- `dist/motion*.js`: persistent user preference and system reduced-motion support. Pausing removes scroll pinning and reveals content.
- Rendering suspends offscreen and in background tabs. Pixel density is capped; the software animation renderer targets 30 fps.
- Mobile uses a vertical composition with no pinned scroll sequence. Cross-document view transitions enhance supported browsers; normal links remain the baseline.

The contact form prepares an email draft; it does not send or store messages. Content, project links and navigation remain usable without JavaScript. The interactive Lab requires JavaScript.

## Assets and deployment

Self-hosted Space Grotesk and Manrope (SIL OFL), Three.js 0.180.0 (MIT), GSAP/ScrollTrigger 3.13.0 (GSAP Standard License). Notices ship alongside assets. See [ASSETS](docs/ASSETS.md) and [QA](docs/QA.md).

Serve `dist/` from any static host. GitHub Pages workflow remains optional. The existing Sites review deployment retains its current private audience.

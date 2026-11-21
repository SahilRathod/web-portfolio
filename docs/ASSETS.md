# Multi-page upgrade: design and assets

The existing warm paper, cobalt and lime palette is retained. Sahil’s name and full stack developer role lead the homepage. Home, Work, About, Lab and Contact are separate documents, with individual project pages.

## Custom orbit sculpture

- [Figma source file](https://www.figma.com/design/8Dz7INQPX5bOaISqoK5S8T), image node `1:2`.
- Generated through the connected Figma tool on November 19, 2026 using Figma AI credits; reported model `gpt-image-2.5-flare`.
- Brief: interlocking cobalt, chrome and lime ribbons, warm ivory studio, no text or brand marks.
- Requested 2048 pixels; actual output **1024 × 1024**. No 4K claim is made.
- Locally served 640 and 1024 pixel WebP variants in `dist/assets/art/`. No expiring Figma URL or account credentials are used by the website.
- The portrait area remains a monogram until a real photo is supplied.

## Retained artwork

Original HTML/CSS illustrations of Autopilot AI, JARVIS and Omnitrix are extracted into `src/`. These are concept visuals, not production screenshots. The original SVG identity and procedural globe remain.

## References and access limits

Mobbin was requested, but its MCP refused access because the account needs a paid plan. It was not retried without evidence that access had changed, and no Mobbin screen or asset is embedded. A Freepik listing was inspected, but no Freepik asset was licensed or downloaded for this implementation. The actual new graphic came from Figma.

The original plugin contributions and limitations remain in `DESIGN-PROVENANCE.md`.

Cross-document navigation was checked against [Chrome’s official View Transitions documentation](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). The transition is progressive enhancement. Independent developer portfolios inspected for conventions: https://ayushetty.me/projects/portfolio , https://itomdev.com/ , https://www.vandeblaak.com/portfolio/?lang=en . This layout was composed independently.

“4D” is interpreted as independent spatial layers plus time: perspective tilt, floating foreground annotations, moving light, scroll reveals and an interactive depth study. It is not a literal fourth-dimensional renderer. System reduced-motion preference takes priority; visitors can pause motion across pages.

## November 2026 résumé redesign

- Original procedural knot, orbit and polyhedral geometry built with Three.js; shared scene supports WebGL and an original Canvas 2D triangle renderer.
- Original Bonton travel concept composed in HTML/CSS. It is explicitly an illustration, not an employer screenshot.
- Space Grotesk variable font: https://github.com/google/fonts/tree/main/ofl/spacegrotesk
- Manrope variable font: https://github.com/google/fonts/tree/main/ofl/manrope
- Both converted to WOFF2 from the official variable font distributions; SIL OFL notices included in `dist/assets/fonts/`.
- Three.js 0.180.0: official npm distribution mirrored by jsDelivr; MIT notice in `dist/vendor/`.
- GSAP and ScrollTrigger 3.13.0: official npm distribution mirrored by jsDelivr; original header notices retained and license link included in `GSAP-NOTICE.txt`.
- Design research: https://dennissnellenberg.com/ (clear portfolio navigation), https://lusion.co/ (motion-led storytelling), https://bruno-simon.com/ (interactive 3D with controls). These informed principles; no layouts or protected visual assets were copied.
- Prior Figma-created sculpture remains the first-paint/no-JavaScript fallback. Mobbin access remained unavailable under the connected subscription; no Mobbin assets were downloaded or claimed.

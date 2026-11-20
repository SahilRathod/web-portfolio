# Verification — November 20, 2026

The multi-page source was reconstructed after workspace maintenance removed an unpushed working copy. Automated checks and the key browser flows were rerun on the restored implementation.

## Automated checks on rebuilt source

- Nine generated documents: five main pages, three project pages and a 404 page.
- Static checks for unique IDs/titles, one H1 per document, language, descriptions, local links/fragments, configured image paths, image alt text/dimensions and responsive variants.
- No external runtime scripts. Code and artwork stay within 240 KB / 500 KB source budgets respectively.
- All 16 Node tests pass: HTML escaping, asset/link validation, duplicate slugs, future project screenshots, stored motion state, blocked storage, system preference priority, subscribers, globe pixel-ratio cap and animation suspension/scheduling.

## Browser recheck on November 20

Desktop and embedded 390px/320px layouts were inspected. Work filters, zero results/reset, real project navigation, persistent pause, depth slider/reset, Signal mode and mobile menu worked. Home, Work, About, Lab, Contact and the Autopilot detail page had no horizontal document overflow in the checked narrow layouts. Pointer perspective, email copying and form validation had also passed during the November 19 implementation review; their logic is retained.

## Limits

Physical touch devices, Firefox, Safari and screen-reader output were not tested. Reduced-motion scheduling is covered by tests and CSS review rather than a live OS setting change. Native view transitions depend on browser support. No email was sent; launching an external email app was not tested. Clipboard-denied fallback was reviewed in code. No Lighthouse score, accessibility certification, award or global uniqueness guarantee is claimed.

# Verification — November 19, 2026

## Completed

- JavaScript syntax checks for both runtime scripts.
- Dependency-free source validation: unique IDs, one H1, language declaration, internal anchors, local asset existence, project keys, secure external URLs, no external runtime scripts, static payload under 120 KB.
- Five Node tests passed: pixel-ratio cap, single animation scheduler, pause/resume, reduced-motion changes, offscreen suspension and background-tab suspension with pause preserved.
- Chromium desktop preview checked at a 1363px browser viewport. No document horizontal overflow.
- Embedded mobile viewports checked at 390px and 320px outer widths (375px and 305px usable after scrollbar). No document horizontal overflow at either width.
- Mobile menu opens and closes after section navigation.
- Experiment filter displays exactly two projects; All work restores three.
- JARVIS and Autopilot dialogs render the expected project details. Escape closes the dialog, removes the scroll lock and returns focus to its opening button.
- Signal mode and animation pause update their accessible pressed states.
- Copy email reports successful clipboard completion.
- Corrected decorative glyph rendering and narrow-layout annotation overlap after visual inspection.

## Limits

- Safari, Firefox, physical touch devices, screen-reader output and OS-level reduced-motion switching were not tested in the live browser. Reduced-motion scheduling is covered by Node tests; CSS media rules were inspected.
- No Lighthouse score, accessibility certification, award or global uniqueness claim is made.
- No live source demo for the private Autopilot AI repository is claimed.
- Clipboard-denied fallback was reviewed in code but not forced in browser QA.
- The browser logged extension metadata errors from a chrome-extension URL; these are not application exceptions. No application error appeared in the inspected log sample.
- The repository was initialized by Sahil. CI results are available in its Actions tab after upload. The optional GitHub Pages workflow has not been run.

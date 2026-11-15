# Pitch mockup source

Exported from the Claude Design canvas "Keji Visuals — Pitch Mockup" (23 Oct 2026). These are **reference files, not production code**.

| File | Screen |
|---|---|
| `Main.dc.html` | Home (desktop) — includes the hero motion |
| `Story.dc.html` | Wedding story (desktop) — chapters, justified rows, full-screen viewer |
| `Packages.dc.html` | Packages & rates — category tabs, ₦/£ toggle, add-ons, FAQ, enquiry form |
| `Mobile.dc.html` | Three phone screens — home (with hero motion), story, viewer |
| `About.dc.html` | About — chapters ("frames"), sticky index, film-strip reel, timeline (added 15 Nov 2026; Keji photos from his studio shoot) |
| `AboutHeroB.dc.html` | About hero, option B (built 15 Nov 2026): cut-out portrait on an olive glow, status pill, viewfinder corners |
| `canvas.json` | Canvas layout (ignore) |

## Reading the format
Each `.dc.html` is a self-contained design component, not a normal web page:
- Markup inside `<x-dc>`; page CSS (classes, keyframes, reduced-motion rules) inside `<helmet><style>`.
- `{{name}}` holes are filled from `renderVals()` in the `<script type="text/x-dc">` block at the bottom; `<sc-for>` loops and `<sc-if>` conditionals.
- The `<script>` holds the demo data (categories, packages, chapters, FAQ copy) and the interaction logic (hero slideshow timer, viewer, tabs, currency toggle).

When building the Next.js site, port the **layout, tokens, copy, CSS keyframes and interaction behaviour** into React components + Tailwind. Coloured blocks are photo placeholders; `[brackets]` are content Keji hasn't supplied yet.

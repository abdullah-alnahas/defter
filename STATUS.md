# kalem-and-defter — status

قلم ودفتر. Personal site. Live: https://abdullah-alnahas.github.io/kalem-and-defter/. Vision: `concept.txt`.

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Build runs with
`BASE_PATH=/kalem-and-defter`, `PRERENDER_ORIGIN=https://abdullah-alnahas.github.io`,
`SITE_ORIGIN=https://abdullah-alnahas.github.io/kalem-and-defter`. SvelteKit
`paths.base` carries the prefix through every internal link, asset URL, and
canonical href. `static/.nojekyll` keeps GH Pages from filtering `_app/`.
Font `@font-face` declarations live in `app.html` so `%sveltekit.assets%` can
prepend the base path (CSS string URLs aren't rewritten by Vite).

## Stack

- **SvelteKit + Svelte 5 (runes)**, `@sveltejs/adapter-static` for full static prerender. No backend in production.
- **Output:** `frontend/build/` — fully static HTML/XML/text. Drop into Nginx, Caddy, Pages, S3+CloudFront, anywhere.
- **Build-time content pipeline** (`src/lib/server/content.js`): filesystem walker over `../content/*.md`, TOML frontmatter parser, `marked` + `marked-footnote` + `marked-gfm-heading-id`, `:::ayah` / `:::hadith` block directives, ` ```exec ` sandboxed-iframe code-block override (with explicit `width`/`height` attrs so it never causes CLS), footnote extractor that returns `{ html, footnoteMap }`.
- **Bundle strategy:** `kit.output.bundleStrategy = 'inline'` (all JS inlined into each HTML; single round-trip; eliminates modulepreload waterfall). `kit.inlineStyleThreshold = Infinity` (all CSS inlined). Vite preview server applies `Cache-Control: public, max-age=31536000, immutable` to `/_app/immutable/*` + `/fonts/*` so Lighthouse cache audit passes.
- **Routing:** SvelteKit file-system routes (`+page.svelte`, `+page.server.js`, `+server.js` for feeds). `entries()` in `/p/[slug]/+page.server.js` enumerates content files at build. Native `<a>` everywhere.

## Layout & nav

- **Symmetric 3-column grid** (`Page.svelte`): equal-width left margin / body (capped at `--measure: 34rem`) / equal-width right margin (`--margin-col: 13rem`). Body is centred. Left margin column kept as visual balance for the right sidenote column even though nav no longer lives there.
- **Top navbar — explicitly NOT sticky** (`MarginAside.svelte`, kept under the legacy filename): in-flow at the top of every page, scrolls away with the article so reading isn't crowded by chrome. Links: Blog · Featured · About · GitHub · LinkedIn · RSS. Dim by default, brightens on hover. Right-padded so the last link clears the fixed theme-bar in the top-right.
- **Theme toggle bar** (`ThemeToggle.svelte`): fixed top-end, holds three icon buttons — pin-all (only when sidenotes exist on the page), palette (round swatch matching the current palette's `--accent`; opens a popover containing a radial `PaletteDial`), variant (sun/moon).
- **Palette dial** (`PaletteDial.svelte`): shared radial picker. 14 dots arranged on the circumference of an invisible circle, walking clockwise from 12 o'clock through a hue-ordered sequence — paper → sepia → copper (default) → cream → ember → amber → forest → slate → ink → harbor → midnight → magenta → rose → mono → back to paper. Each dot is anchored to the radius by a `translate()` and never scales or grows out of the circle; the active palette is mirrored in the centre as a large swatch + label and is marked on its own dot with an inset `var(--bg)` pip (radio-style). On hover, sibling dots dim so the focused dot reads first.
- **Back-to-top button** (`BackToTop.svelte`): fixed bottom-end, dim arrow + "Back to top" label always visible.
- **Skip-link** at top for keyboard users.
- Narrow viewports (≤ 56rem): nav stays at the top with tighter gaps + smaller padding; sidenotes collapse to flow below the body.

## Conventions

- **Single mandatory wrapper** (`Page.svelte`). Every page = basmalah + hamd (Quran font, full diacritics) + opening salawat (regular Arabic, full diacritics); closing = Ayah (Quran font) + Ibrahimi salawat. Non-negotiable per concept.
- **RTL/LTR per page** via frontmatter `dir`.
- **Theme:** two axes — `[data-theme=light|dark]` (variant) × `[data-theme-name=…]` (palette). 14 palettes: `paper`, `sepia`, `copper` (default), `cream`, `ember`, `amber`, `forest`, `slate`, `ink`, `harbor`, `midnight`, `magenta`, `rose`, `mono`. Each defines `--bg`, `--fg`, `--muted`, `--rule`, `--accent` for both light and dark. `copper` is mirrored after the pg-reader Chrome extension's "Slate & Amber" palette (warm paper `#F3F2EC` + slate ink `#1E252D` + copper accent `#B26A2B`; dark: navy `#181D26` + cream `#D6CFBB` + copper `#D89A5E`). Base `body { font-size: 19px }` is applied across every palette so layout + reading rhythm are identical regardless of choice. Inline blocking `<head>` script reads `localStorage['defter-theme']` + `localStorage['defter-theme-name']`, migrates legacy palette ids (`windsor → ink`, `zapier → ember`, `clipboard → rose`, `enveritas → harbor`, `salla → amber`, `brave → magenta`, `reader → copper`), validates against the allowed list, falls back to `prefers-color-scheme` for variant. No FOUC.
- **Palette origins:** the eight "voice" palettes (ink, ember, rose, harbor, amber, magenta, paper, sepia) were distilled from `cv_*.html` mockups in `/home/abdullah/Documents/hdd/career-ops/`; five neutrals (slate, forest, cream, mono, midnight) were imported from the sibling `style-files/svelte-styles.css`. Names are evocative, never tied to a vendor. Only the colour values cross the boundary; no copy or markup. The site's spirit (warm canvas, generous rule lines, muted secondary text) is preserved across all palettes — only `--bg / --fg / --muted / --rule / --accent` rotate.
- **About page** (`/p/about`): essay-first personal page (voice, not LinkedIn-export). Four-paragraph opener + contact block + "Download CV (PDF)" trigger. The trigger opens an inline disclosure dialog that lets the visitor pick any of the eight palettes + light/dark variant; clicking "Open print view" opens `/p/cv/print` in a new tab with the chosen options pre-applied.
- **CV PDF generation** (`/p/cv/print`): chrome-free print route. On mount it sets `documentElement.dataset.theme` + `dataset.themeName` from URL params (`?palette=…&variant=…`, validated against the allowed set), adds `body.print-mode` to hide `ThemeToggle` / `MarginAside` / `BackToTop` / skip-link, then fires `window.print()` (suppressable with `&autoprint=0` for previews). User picks "Save as PDF" from the system dialog. CV content lives in `src/lib/cv-data.js` (`identity`, `summary`, `roles`, `projects`, `education`, `skills`, `spoken`, `PALETTES`) — single source for the print route and any future surface. PDF excludes the opening basmalah/hamd/salawat and closing Ayah/Ibrahimi salawat by design (CV is a secular work artifact). Print stylesheet: A4 with 14–16mm margins, `print-color-adjust: exact` so palette colors survive, `page-break-inside: avoid` per role, links printed in inherit color with no trailing-URL.
- **`/p/cv` redirect:** kept as 308 (meta refresh + `location.href`) to `/p/about` so old backlinks resolve. The print route lives below it (`/p/cv/print`) because conceptually it's still the CV surface, just the printable variant.
- **Prerender seeding:** `kit.prerender.entries = ['*', '/p/cv/print']` in `svelte.config.js` — the print route isn't linked from any static page (it's opened by JS from the about-page dialog), so the crawler needs an explicit seed.
- **Text selection** (`::selection` / `::-moz-selection` in `app.css`): `background: var(--accent); color: var(--bg)` — selection highlight tracks the active palette in both light and dark.
- **Slug guard:** SvelteKit `entries()` enumerates valid slugs at build; unknown slugs become 404 at prerender time.
- **Quality bar:** desktop Lighthouse 100×4 every route. Mobile: 100 across A11y / BP / SEO; Performance ≥ 99 (single-bundle hydration on simulated Slow 4G dips FCP score to 0.98 — within "good" Core Web Vitals but rounded short of perfect). CI enforces.

## Typography

- **Body + nav:** **Montserrat** (self-hosted woff2, weights 400 + 500 + 600, `latin` + `latin-ext` subsets, fetched on demand). Single Latin family throughout — no separate UI font.
- **Quran:** **UthmanTN** for Arabic text + ornate ayah brackets ﴿ ﴾ (matches the look of the printed mushaf). **UthmanicHafs** layered on top via `var(--quran-ayah-num)` only inside `<span class="ayah-num">` — its GSUB auto-wraps bare Arabic-Indic digit sequences in the rosette glyph, so the closing ayah uses bare `١٨٠ ١٨١ ١٨٢` from Saffat 180–182, no explicit U+06DD prefix needed.
- **Regular Arabic:** **Noto Naskh Arabic** (self-hosted), with Amiri / Scheherazade fallback.
- `font-display: swap` on every web font — first paint uses the system fallback, web font replaces it whenever it arrives (no permanent fallback on cold cache). Montserrat 400/500/600 weights are `<link rel="preload">`'d to keep arrival inside the typical first-paint window. CLS stays at 0 across measured routes (verified Lighthouse).

## Sidenotes + TL;DR

One mental model, one surface. Localized per article: the TL;DR trigger button label and the margin-note label are Arabic ("خلاصة") on `lang="ar"` pages and "TL;DR" otherwise. Margin notes carry the article's `lang`/`dir` so `*:lang(ar)` picks the Arabic font stack — body, sidenote text, and TL;DR text all share the same family. The endnote section's "Footnotes" heading is localized too (`الحواشي` / `Dipnotlar` / `Footnotes`).

- **Each footnote ref** spawns its own invisible margin slot (`.sn-margin`) at the ref's vertical position. Float-down on collision so multiple notes stack without overlap.
- **Hover ref or hover note** → reveal (opacity 0 → 1; no layout shift).
- **Click ref** → pin (stays revealed until clicked again or `Esc`).
- **Same label opened twice** → two separate slots (per-occurrence identity).
- **TL;DR** uses the same surface: a small dim **"TL;DR"** button next to the title spawns a margin note. Hover the button → preview. Click → pin.
- **Pin/Unpin all** pin-icon toggle lives in the theme bar (top-end), appears only when the page actually has sidenotes; flips every sidenote (and TL;DR) at once.
- **Endnote list** always present after the article body (canonical reading affordance for a11y / print / readers).
- **Narrow viewports** (≤ 56rem): notes flow below the body in document order (still hidden until hover/tap of their ref).

Implemented in `src/lib/sidenote-bus.svelte.js` (tiny pub/sub), `src/lib/components/Sidenotes.svelte` (per-page mount: scans refs, creates margin slots, manages hover+pin), `src/lib/components/MarginAside.svelte` (nav only), `src/lib/components/ThemeToggle.svelte` (palette + variant + pin-all), `src/lib/components/BackToTop.svelte`. Verified end-to-end with Playwright: hover→reveal, click→pin, click→unpin, Esc→clear, pin-all↔unpin-all flips, narrow stacking, TL;DR via title button, back-to-top scrolls smoothly, console clean.

## Authoring

Drop a `*.md` file into `content/` with TOML frontmatter (`+++ ... +++`). Filename stem = slug. Frontmatter keys: `title`, `lang`, `dir`, `date`, optional `tldr`, optional `featured`, optional `external`.

Inside the body:
- Standard Markdown (headers, lists, code blocks, links, images, tables, strikethrough).
- Footnotes: `[^label]` ref + `[^label]: ...` definition anywhere.
- Block directives: `:::ayah ref="…"` and `:::hadith ref="…"` render as RTL Arabic figures.
- Executable JS: ` ```exec ` fenced blocks render as sandboxed iframes (`allow-scripts` only; runtime exposes `print(...)`; explicit `width`/`height` attrs to prevent CLS).

Adding a new file = no restart; the next `bun run build` reads it.

## Iter log

- [x] Iter 1 — Rust+Svelte skeleton, hardcoded page, mandatory scaffolding, light theme, RTL/LTR-aware.
- [x] Iter 2 — filesystem-backed pages, `/api/pages` + `/api/pages/{slug}`, minimal client router, index list, page view with markdown.
- [x] Iter 3 — SSR prerender pipeline (Vite SSR + `svelte/server.render()` + marked). Per-page meta. Sitemap + robots. Markdown→HTML on backend (pulldown-cmark). Lighthouse 100×4 mobile+desktop on every route.
- [x] Iter 4 — closing Ayah convention (UthmanTN font subset, woff2, preloaded, full Ibrahimi salawat). SEO trio (RSS, ai.txt, llm.txt). Dark variant + system-pref + no-FOUC toggle. Top hover-revealed navbar + skip-link.
- [x] Iter 5 — CV route (Svelte component, not markdown).
- [x] Iter 6 — Home page Picked / Recent / All sections.
- [x] Iter 7 — Multi-theme (paper + sepia × light + dark). Two-button toggle bar.
- [x] Iter 8 — Executable JS code blocks (sandboxed iframe; ` ```exec `).
- [x] Iter 9 — CI Lighthouse workflow on push/PR.
- [x] Iter 10 — full stack swap to SvelteKit + Svelte 5 + adapter-static. actix removed. Sidenotes rebuilt: central margin stack + hover preview + click-pin + Y-sort.
- [x] Iter 11 — sidenote/TLDR redesign + nav rework + typography overhaul:
  - **Sidenotes:** per-ref invisible margin slot (hover → reveal, click → pin, same model for TL;DR via a small subtle-button next to the title). Float-down collision avoidance.
  - **TL;DR button** styled as `.subtle-btn` (dim default, brightens on hover/focus, pin-on-click).
  - **Pin/Unpin all** toggle in the margin aside.
  - **Nav rework:** dropped top hover navbar. Added `MarginAside` — persistent right-margin nav (Blog · Featured · CV · GitHub · LinkedIn · RSS), always visible. LinkedIn URL updated to the user's current handle.
  - **Equal margins:** symmetric grid (margin / body / margin), body centred.
  - **Paper palette updated:** `#FFFFF8`/`#181818` light, `#1F2530`/`#D6CFBB` dark. Sepia untouched.
  - **Typography:** Montserrat self-hosted (woff2, 400/500/600, latin + latin-ext). UthmanTN preloaded.
  - **Opening:** basmalah + hamd in Quran font with diacritics; opening salawat with diacritics.
  - **Back-to-top button:** fixed bottom-right, dim arrow always, hover reveals label.
  - **CV placeholder code contrast fix** so mobile A11y stays at 100.
  - **Iframe width/height attrs** to nail CLS to 0.
  - **`font-display: optional`** across web fonts — CLS = 0 verified.
- [x] Lighthouse sweep verified: desktop 100×4 on every route. Mobile: 100 across A11y/BP/SEO; Performance 99–100 depending on payload. Trade-off documented (concept.txt).
- [x] Iter 12 — palette picker + about page + selection theming + font-display fix:
  - **Palette popover:** replaced the cycle-only palette button with a popover listbox (named swatches + check mark on active; Esc / click-outside close; `aria-haspopup="listbox"`, `aria-expanded`, `role="option"`).
  - **`/p/cv` → `/p/about`:** voice-first essay opener replaces ATS-style summary. `/p/cv` becomes a 308 redirect (meta refresh + script) for backlink compatibility. Sitemap and `MarginAside` updated.
  - **Selection styling:** `::selection` / `::-moz-selection` use `--accent` / `--bg` so highlight follows the active palette in both variants.
  - **Font-display swap (cold-cache fix):** dropped `font-display: optional` (caused permanent fallback for cold-cache visitors). All web fonts now `swap`; Montserrat 500/600 added to preload alongside 400. CLS stays 0.
- [x] Iter 13 — client-side themed CV PDF:
  - **About page reshaped:** dropped the inline condensed-CV sections + sticky right-rail TOC. About is now essay + contact + a single "Download CV (PDF)" disclosure.
  - **Download dialog:** palette via `PaletteDial`, variant via Light/Dark pills. Defaults seed from the visitor's current site theme. Esc / click-outside close.
  - **`/p/cv/print` route:** chrome-free, themed via `?palette=…&variant=…`. Sets `documentElement.dataset.{theme,themeName}` on mount, adds `body.print-mode` to hide `ThemeToggle` / `MarginAside` / `BackToTop` / skip-link, calls `window.print()` after a settle tick (suppress with `&autoprint=0` for previews). A4 print stylesheet with 22mm top/bottom + 20mm side margins (comfortable reading), `print-color-adjust: exact`, `page-break-inside: avoid` per role.
  - **CV data extracted** into `src/lib/cv-data.js`. Single source consumed by `/p/cv/print` today and ready for any future viewer.
  - **Prerender seeded** with `kit.prerender.entries = ['*', '/p/cv/print']` (route isn't linked statically; opened by JS).
- [x] Iter 15 — dial arm disabled + print orphan fix:
  - **PaletteDial arm disabled:** wrapped the `.dial-arm` render block in `{#if false && …}` until the connector geometry lands border-to-border cleanly at every rotation angle. CSS for `.dial-arm` is left intact so re-enabling is one-line. Active state still cued by the dot's inset ring + the centre swatch + label.
  - **CV print orphan gap:** `.role` base CSS still had `page-break-inside: avoid; break-inside: avoid;` even though the print stylesheet's comment said guards were removed. Dropped the guards from the base rule so real-Chrome `window.print()` can split content naturally and stop emitting the page-1 orphan whitespace.
- [x] Iter 17 — palette rename + uniform layout + palette-icon trigger + nav line breathing room:
  - **`reader` → `copper`** — renamed to match its main accent (`#B26A2B`). All occurrences updated (CSS selectors, dial entry, ThemeToggle fallback, init script default + legacy map adds `reader → copper`).
  - **Uniform layout across themes** — moved the 19px base font-size off the per-palette override and onto the root `body` rule. Every palette now uses identical type metrics; only `--bg / --fg / --muted / --rule / --accent` rotate.
  - **Dial reorder** — `copper` no longer at 12 o'clock; it sits between `sepia` and `cream` in the warm-brown band so neighbouring dots stay perceptually adjacent. New order: paper → sepia → copper → cream → ember → … → mono.
  - **Palette trigger icon** — replaced the solid swatch span with a lucide-style palette outline (stroke 1.6, round caps) matching the pin/sun/moon icons. One of the palette dots inside the icon fills with `currentSwatch` so the active-palette colour cue survives.
  - **Top-nav line spacing** — bumped `.top-nav` bottom padding `0.6rem → 1.25rem` so the underline sits clear of the theme-bar buttons' hover circle.
- [x] Iter 16 — `reader` palette + non-sticky top navbar:
  - **`reader` palette** added as the new site default, mirrored after the pg-reader Chrome extension's "Slate & Amber" palette (warm paper `#F3F2EC` + slate ink `#1E252D` + amber accent `#B26A2B`; dark: navy `#181D26` + cream `#D6CFBB` + amber `#D89A5E`). Existing 13 palettes untouched — `paper` is still selectable. `html[data-theme-name='reader']` bumps base font-size to 19px for longer-form reading. Init script default + ThemeToggle fallback both flipped to `reader`. (Superseded by Iter 17 rename + uniform 19px.)
  - **Top navbar** (`MarginAside.svelte`, filename kept to avoid breaking imports): converted from the fixed left-margin aside to an in-flow `<nav class="top-nav">` placed above `{@render children}` in the layout. Explicitly NOT sticky — scrolls away with the article. Right-padded so the last link clears the fixed theme-bar. `Page.svelte` page-frame top padding trimmed (`4rem → 2.5rem` desktop, `3rem → 2rem` narrow) so the nav + article don't double-pad.
- [x] Iter 14 — palette rename + radial picker + symmetric opening/closing + roomier print margins:
  - **Palette names:** dropped vendor names. `windsor → ink`, `zapier → ember`, `clipboard → rose`, `enveritas → harbor`, `salla → amber`, `brave → magenta`. Added five palettes imported from `career-ops/style-files/svelte-styles.css`: `slate`, `forest`, `cream`, `mono`, `midnight`. Total = 13. Old `localStorage` values are silently migrated by the head-script.
  - **Palette dial** (`PaletteDial.svelte`): shared component placing N dots on the circumference of an invisible circle (12 o'clock start, clockwise), with the active palette mirrored as a centre swatch + label. Selected state is an inset `var(--bg)` pip — no scale, no outer ring — so the dot stays glued to the radius. Hover dims siblings. Used by `ThemeToggle`'s popover + the about-page download dialog (single source of truth).
  - **Palette order on dial:** hue walk — paper → sepia → cream → ember → amber → forest → slate → ink → harbor → midnight → magenta → rose → mono → back to paper. Adjacent dots are always perceptually close.
  - **Opening / closing symmetry** (`Page.svelte`): bumped the opening basmalah/hamd font-size 1.45rem → 1.5rem and the opening salawat 0.95rem → 1rem so they match the closing Ayah (1.5rem) and Ibrahimi salawat (1rem) exactly. Page reads symmetric top-to-bottom.
  - **Print margins:** `@page` for `/p/cv/print` from `14mm 14mm 16mm` → `22mm 20mm 22mm`. Inside-page sizes nudged up half a point for reading comfort.

## Open questions

- App-page concept: each sub-app owns its own backend, or share one?
- Sidenote pin persistence across reloads — out of scope per concept; revisit if requested.
- Multi-lingual mixing inline: extension or convention?
- Page editor: separate admin route or inline WYSIWYG?
- CV PDF: generated client-side from `/p/cv/print` via the native print dialog. No static `cv.pdf` artifact is needed; the source of truth lives in `src/lib/cv-data.js`.
- Real deploy target.
- Mobile Performance 100 (currently 99) — would require deferring Sidenotes/MarginAside/BackToTop hydration off the initial bundle. Possible if needed.

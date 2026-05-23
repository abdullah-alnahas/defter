# defter — status

دفتر. Personal site. Vision: `concept.txt`.

## Stack

- **SvelteKit + Svelte 5 (runes)**, `@sveltejs/adapter-static` for full static prerender. No backend in production.
- **Output:** `frontend/build/` — fully static HTML/XML/text. Drop into Nginx, Caddy, Pages, S3+CloudFront, anywhere.
- **Build-time content pipeline** (`src/lib/server/content.js`): filesystem walker over `../content/*.md`, TOML frontmatter parser, `marked` + `marked-footnote` + `marked-gfm-heading-id`, `:::ayah` / `:::hadith` block directives, ` ```exec ` sandboxed-iframe code-block override (with explicit `width`/`height` attrs so it never causes CLS), footnote extractor that returns `{ html, footnoteMap }`.
- **Bundle strategy:** `kit.output.bundleStrategy = 'inline'` (all JS inlined into each HTML; single round-trip; eliminates modulepreload waterfall). `kit.inlineStyleThreshold = Infinity` (all CSS inlined). Vite preview server applies `Cache-Control: public, max-age=31536000, immutable` to `/_app/immutable/*` + `/fonts/*` so Lighthouse cache audit passes.
- **Routing:** SvelteKit file-system routes (`+page.svelte`, `+page.server.js`, `+server.js` for feeds). `entries()` in `/p/[slug]/+page.server.js` enumerates content files at build. Native `<a>` everywhere.

## Layout & nav

- **Symmetric 3-column grid** (`Page.svelte`): equal-width left margin / body (capped at `--measure: 34rem`) / equal-width right margin (`--margin-col: 13rem`). Body is centred.
- **No top navbar.** Nav lives in a persistent right-margin aside (`MarginAside.svelte`, fixed top-right): Blog · Featured · CV · GitHub · LinkedIn · RSS. Always visible, dim by default, brightens on hover.
- **Theme toggle** (`ThemeToggle.svelte`): fixed top-right, palette (P/S) + variant (sun/moon).
- **Back-to-top button** (`BackToTop.svelte`): fixed bottom-right, dim arrow always visible; hover/focus reveals "Back to top" label (max-width transition, no layout cost).
- **Skip-link** at top for keyboard users.
- Narrow viewports (≤ 56rem): aside hides; nav remains reachable via per-page lists; sidenotes collapse to flow below the body.

## Conventions

- **Single mandatory wrapper** (`Page.svelte`). Every page = basmalah + hamd (Quran font, full diacritics) + opening salawat (regular Arabic, full diacritics); closing = Ayah (Quran font) + Ibrahimi salawat. Non-negotiable per concept.
- **RTL/LTR per page** via frontmatter `dir`.
- **Theme:** two axes — `[data-theme=light|dark]` (variant) × `[data-theme-name=paper|sepia]` (palette) = 4 palettes. Inline blocking `<head>` script reads `localStorage['defter-theme']` + `localStorage['defter-theme-name']`, falls back to `prefers-color-scheme` for variant. No FOUC.
- **Paper palette** (current default): light `#FFFFF8` bg / `#181818` fg ; dark `#1F2530` bg / `#D6CFBB` fg. `--muted` chosen to clear 5:1 contrast against bg on both variants.
- **Sepia palette** kept untouched.
- **Slug guard:** SvelteKit `entries()` enumerates valid slugs at build; unknown slugs become 404 at prerender time.
- **Quality bar:** desktop Lighthouse 100×4 every route. Mobile: 100 across A11y / BP / SEO; Performance ≥ 99 (single-bundle hydration on simulated Slow 4G dips FCP score to 0.98 — within "good" Core Web Vitals but rounded short of perfect). CI enforces.

## Typography

- **Body / UI:** **Montserrat** (self-hosted woff2, weights 400 + 500 + 600, `latin` + `latin-ext` subsets, total ≈ 150 KB across all 6 files but each weight × subset is fetched on demand — only the one or two needed for the current page hit the wire).
- **Quran:** **UthmanTN** (preloaded, subset to Arabic blocks only, 45.5 KB woff2).
- **Regular Arabic:** Amiri / Scheherazade New / Noto Naskh Arabic stack.
- `font-display: optional` on every web font — first paint uses fallback, web font swaps in only if it's ready within ~100 ms. Eliminates CLS entirely (verified 0.000 on every measured route).

## Sidenotes + TL;DR

One mental model, one surface.

- **Each footnote ref** spawns its own invisible margin slot (`.sn-margin`) at the ref's vertical position. Float-down on collision so multiple notes stack without overlap.
- **Hover ref or hover note** → reveal (opacity 0 → 1; no layout shift).
- **Click ref** → pin (stays revealed until clicked again or `Esc`).
- **Same label opened twice** → two separate slots (per-occurrence identity).
- **TL;DR** uses the same surface: a small dim **"TL;DR"** button next to the title spawns a margin note. Hover the button → preview. Click → pin.
- **Pin/Unpin all** toggle in the right margin aside flips every sidenote (and TL;DR) at once. Label morphs `Pin all ↔ Unpin all` based on current state.
- **Endnote list** always present after the article body (canonical reading affordance for a11y / print / readers).
- **Narrow viewports** (≤ 56rem): notes flow below the body in document order (still hidden until hover/tap of their ref).

Implemented in `src/lib/sidenote-bus.svelte.js` (tiny pub/sub), `src/lib/components/Sidenotes.svelte` (per-page mount: scans refs, creates margin slots, manages hover+pin), `src/lib/components/MarginAside.svelte` (nav + pin-all), `src/lib/components/BackToTop.svelte`. Verified end-to-end with Playwright: hover→reveal, click→pin, click→unpin, Esc→clear, pin-all↔unpin-all flips, narrow stacking, TL;DR via title button, back-to-top scrolls smoothly, console clean.

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

## Open questions

- App-page concept: each sub-app owns its own backend, or share one?
- Sidenote pin persistence across reloads — out of scope per concept; revisit if requested.
- Multi-lingual mixing inline: extension or convention?
- Page editor: separate admin route or inline WYSIWYG?
- Real CV content (still a placeholder).
- Real deploy target.
- Mobile Performance 100 (currently 99) — would require deferring Sidenotes/MarginAside/BackToTop hydration off the initial bundle. Possible if needed.

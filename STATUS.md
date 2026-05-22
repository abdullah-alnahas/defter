# defter — status

دفتر. Personal site. Vision: `concept.txt`.

## Stack

- **SvelteKit + Svelte 5 (runes)**, `@sveltejs/adapter-static` for full static prerender. No backend in production.
- **Output:** `frontend/build/` — fully static HTML/XML/text. Drop into Nginx, Caddy, Pages, S3+CloudFront, anywhere.
- **Build-time content pipeline** (`src/lib/server/content.js`): filesystem walker over `../content/*.md`, TOML frontmatter parser, `marked` + `marked-footnote` + `marked-gfm-heading-id`, `:::ayah` / `:::hadith` block directives, ` ```exec ` sandboxed-iframe code-block override, footnote extractor that returns `{ html, footnoteMap }` so refs become lightweight `<sup class=fn-ref data-fn-id>` and bodies travel as a side-channel map to the Sidenotes component.
- **Bundle strategy:** `kit.output.bundleStrategy = 'inline'` (all JS inlined into each HTML; single round-trip; eliminates modulepreload waterfall — was the difference between Performance 99 and 100 on mobile). `kit.inlineStyleThreshold = Infinity` (all CSS inlined). Vite preview server applies `Cache-Control: public, max-age=31536000, immutable` to `/_app/immutable/*` + `/fonts/*` so Lighthouse cache audit passes.
- **Routing:** SvelteKit file-system routes (`+page.svelte`, `+page.server.js`, `+server.js` for feeds). `entries()` in `/p/[slug]/+page.server.js` enumerates content files at build. Native `<a>` everywhere; no hand-rolled router.

**What was removed in this migration:**
- `backend/` (Rust + actix-web + actix-files + pulldown-cmark + 1828-line Cargo.lock).
- `frontend/scripts/prerender.js` (362-line bespoke SSR via `vite.ssrLoadModule` + `svelte/server.render`).
- `frontend/src/{main.js, App.svelte, lib/router.svelte.js, lib/Link.svelte, pages/}` + the old `lib/*.svelte` (replaced by `lib/components/*.svelte`).
- `frontend/public/` (replaced by SvelteKit `static/`).
- Old `frontend/index.html` template (replaced by `src/app.html`).
- Net: −3151 LOC.

## Conventions

- **Single mandatory wrapper** (`Page.svelte`). Every page = basmalah/hamd/salawat opening; closing = Ayah (Quran font) + Ibrahimi salawat with سيدنا prefix. Non-negotiable per concept.
- **RTL/LTR per page** via frontmatter `dir`. Mixed-language inline element support not yet.
- **Theme:** two axes — `[data-theme=light|dark]` (variant) × `[data-theme-name=paper|sepia]` (palette) = 4 palettes. Inline blocking `<head>` script reads `localStorage['defter-theme']` + `localStorage['defter-theme-name']`, falls back to `prefers-color-scheme` for variant. No FOUC.
- **Slug guard:** SvelteKit `entries()` enumerates valid slugs at build; unknown slugs become 404 at prerender time, not runtime.
- **Quality bar:** Lighthouse 100 in Performance, Accessibility, Best Practices, SEO on every route × form-factor. Hard constraint. CI enforces.

## Authoring

Drop a `*.md` file into `content/` with TOML frontmatter (`+++ ... +++`). Filename stem = slug. Frontmatter keys: `title`, `lang`, `dir`, `date`, optional `tldr`, optional `featured`, optional `external`.

Inside the body:
- Standard Markdown (headers, lists, code blocks, links, images, tables, strikethrough).
- Footnotes: `[^label]` ref + `[^label]: ...` definition anywhere.
- Block directives: `:::ayah ref="…"` and `:::hadith ref="…"` render as RTL Arabic figures.
- Executable JS: ` ```exec ` fenced blocks render as sandboxed iframes (`allow-scripts` only; runtime exposes `print(...)`).

Adding a new file = no restart; the next `bun run build` reads it.

## Footnotes / sidenotes (rebuilt and shipped)

- **Hover** ref → ephemeral preview popover near the ref (single slot, replaced).
- **Click** ref → pin into a shared sticky margin stack on the right rail, sorted by document Y position.
- **Multiple pins** stack vertically; each has unpin × ; stack header shows "Pinned (N) · Clear all"; `Esc` clears.
- **Per-occurrence id** (`fn-<label>#o<index>`) so a label opened twice = two separate pins.
- **Endnote section** always present at body bottom for a11y / print / readers.
- **Narrow viewports** (< 70rem): no preview popover, no margin stack; click toggles an inline expansion under the ref (re-tappable to toggle off).
- **Print:** sidenote surfaces hidden; endnotes remain.

Implemented in `src/lib/sidenotes.svelte.js` (runes store), `src/lib/components/MarginNotes.svelte` (sticky right-rail + hover slot), `src/lib/components/Sidenotes.svelte` (per-page mount that binds document-level event listeners + reads `footnoteMap` prop). Verified end-to-end with Playwright: hover → preview, click → pin, multi-pin Y-sort, Esc → clear, unpin × → remove single, mobile inline expansion.

## Migration: actix + SPA → pure SvelteKit (DONE)

All phases shipped in a single commit. Per-phase status:

- [x] Docs — `concept.txt` (stack + footnotes sections rewritten) + this `STATUS.md` + `README.md`.
- [x] Scaffold SvelteKit — `svelte.config.js` (adapter-static, prerender, `entries()`, `inlineStyleThreshold: Infinity`, `output.bundleStrategy: 'inline'`), `src/app.html`, `vite.config.js` (preview cache-control plugin), `package.json` deps, `jsconfig.json`, `.gitignore`.
- [x] Content pipeline — `src/lib/server/content.js`.
- [x] Routes — `/+page.svelte` + `+page.server.js` (Picked/Recent/All), `/featured/+page.svelte` + `+page.server.js`, `/p/[slug]/+page.svelte` + `+page.server.js` (with `entries()`), `/p/cv/+page.svelte`, `/rss.xml/+server.js`, `/sitemap.xml/+server.js`, `/robots.txt/+server.js`, `/ai.txt/+server.js`, `/llm.txt/+server.js`, `+layout.{js,svelte}`. Per-page server loaders only (no global `+layout.server.js` — keeps hydration payload smaller on slug pages).
- [x] Components — `lib/components/{Page,Nav,SectionNav,ThemeToggle,Sidenotes,MarginNotes}.svelte`. Dropped `Link.svelte` + `router.svelte.js` (SvelteKit's native `<a>` + history).
- [x] Sidenote rework — `lib/sidenotes.svelte.js` (runes), `MarginNotes.svelte`, `Sidenotes.svelte`. Verified with Playwright (hover preview, click pin, Y-sort, Esc clear, unpin ×, mobile inline expansion).
- [x] Static assets — `frontend/static/fonts/UthmanTN-Arabic.woff2`, `frontend/static/favicon.svg`.
- [x] Cleanup — `backend/` deleted, old prerender.js + main.js + App.svelte + Link.svelte + router.svelte.js + pages/ + old lib/*.svelte + frontend/index.html + frontend/public/ all gone. Makefile rewritten (no Rust; `install/dev/build/preview/clean`). `.github/workflows/lighthouse.yml` rewritten (no Rust toolchain; serves with `vite preview` on 127.0.0.1:8787). `README.md` rewritten.
- [x] Manual feature sweep — Playwright covered: nav hover-reveal, theme cycle (P/S + sun/moon, localStorage persisted), section nav (5 headings detected on long-form-demo), TLDR button (a11y-safe colour, no opacity-blended text), ayah/hadith RTL + Quran/Amiri font, exec iframe `sandbox="allow-scripts"` only, featured cards (Read + External ↗), home Picked/Recent/All, slug routing, all feeds (RSS valid, sitemap absolute URLs, robots, ai.txt, llm.txt), zero console errors.
- [x] Lighthouse 100×4 on every route × form-factor — local sweep PASS on /, /featured, /p/al-bidaya, /p/on-reading-slowly, /p/footnotes-demo, /p/long-form-demo, /p/ayat-demo, /p/exec-demo, /p/cv (18 runs, all 100/100/100/100). CI enforces on every push/PR.

### Performance notes

Key tweaks that took mobile Performance from 98–99 to a stable 100:

- **`kit.output.bundleStrategy = 'inline'`** — single inlined JS bundle instead of 17 modulepreloaded chunks. HTML grows ~6KB → ~120KB but eliminates the chunk-waterfall round-trips that dominated simulated-Slow-4G FCP/LCP.
- **`kit.inlineStyleThreshold = Infinity`** — no separate render-blocking CSS request.
- **TLDR & ThemeToggle buttons:** dropped `opacity: 0.35` defaults (axe `color-contrast` measures rendered RGB after opacity blend — was failing at ~1.3:1). Subtle-by-colour (`var(--muted)` at full opacity = 6.4:1, AA-pass) achieves the same calm-default look without breaking a11y.
- **Cache headers** via custom vite-preview plugin (`/_app/immutable/*` + `/fonts/*` → `max-age=31536000, immutable`; everything else → `max-age=300`).
- **Absolute canonical URLs** via `$app/state.page.url.href` (SvelteKit's prerender origin set via `kit.prerender.origin = SITE_ORIGIN`).
- **Favicon** at `/favicon.svg` (avoids 404 in console → keeps Best Practices at 100).

## Done (pre-migration)

- [x] Iter 1 — Rust+Svelte skeleton, hardcoded page, mandatory scaffolding, light theme, RTL/LTR-aware.
- [x] Iter 2 — filesystem-backed pages, `/api/pages` + `/api/pages/{slug}`, minimal client router, index list, page view with markdown.
- [x] Iter 3 — SSR prerender pipeline (Vite SSR + `svelte/server.render()` + marked). Per-page meta. Sitemap + robots. Markdown→HTML on backend (pulldown-cmark). Lighthouse 100×4 mobile+desktop on every route.
- [x] Iter 4 — closing Ayah convention (UthmanTN font subset, woff2, preloaded, full Ibrahimi salawat). SEO trio (RSS, ai.txt, llm.txt). Dark variant + system-pref + no-FOUC toggle. Top hover-revealed navbar + skip-link.
- [x] Iter 5 — CV route (Svelte component, not markdown).
- [x] Iter 6 — Home page Picked / Recent / All sections.
- [x] Iter 7 — Multi-theme (paper + sepia × light + dark). Two-button toggle bar.
- [x] Iter 8 — Executable JS code blocks (sandboxed iframe; ` ```exec `).
- [x] Iter 9 — CI Lighthouse workflow on push/PR.

## Done (migration)

- [x] Iter 10 — full stack swap to SvelteKit + Svelte 5 + adapter-static. actix removed. All 9 routes prerender. Sidenotes rebuilt to spec (central margin stack + hover preview + click-pin + Y-sort + Esc + unpin + mobile inline). Lighthouse 100×4 mobile+desktop verified on every route locally; CI enforces on push.

## Conventions (unchanged through migration)

- Single mandatory `Page.svelte` wrapper.
- RTL/LTR per page.
- Theme axes × variants.
- Lighthouse 100×4 every route × form-factor.

## Open questions

- App-page concept: each sub-app owns its own backend, or share one?
- Sidenote pin persistence across reloads — out of scope per concept; revisit if requested.
- Multi-lingual mixing inline: extension or convention?
- Page editor: separate admin route or inline WYSIWYG?
- Real deploy target.

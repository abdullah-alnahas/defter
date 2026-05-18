# defter — status

دفتر. Personal site. Vision: `concept.txt`.

## Stack

- **Backend:** Rust + `actix-web` 4, `actix-files` 0.6, `serde`, `toml` 0.8, `pulldown-cmark` 0.12 (server-side Markdown → HTML). Release: LTO + `strip`.
- **Frontend:** Svelte 5 (runes), Vite 6, Bun lockfile. Zero client runtime deps (`marked` is devDep only — used by prerender script).
- **Content:** filesystem `content/*.md`, TOML frontmatter (`title`, `lang`, `dir`, `date`). Slug = filename stem.
- **Runtime:** backend reads filesystem per request (no cache). Binds `127.0.0.1:8787`. Serves `frontend/dist/` (prerendered HTML per route, hashed JS/CSS assets, `sitemap.xml`, `robots.txt`). `/p/{slug}` resolves to `dist/p/{slug}/index.html`; missing slug falls back to SPA shell.

## Layout

```
backend/src/main.rs               actix server, /api/pages routes, /p/{slug} → prerendered HTML, SPA fallback
backend/src/page.rs               frontmatter split + parse + markdown→HTML (pulldown-cmark) + load_one/load_all
frontend/index.html               template with %LANG% %DIR% %TITLE% %DESCRIPTION% %CANONICAL% %DATA% <!--ssr-outlet--> placeholders
frontend/vite.config.js           svelte plugin + dev placeholder-filler plugin
frontend/scripts/prerender.js     vite SSR + svelte/server.render(); emits dist/index.html, dist/p/<slug>/index.html, sitemap.xml, robots.txt
frontend/src/main.js              hydrate() when prerendered children present, else mount(); reads window.__DEFTER__
frontend/src/App.svelte           accepts data prop; router switch (path /p/{slug} → PageView, else IndexPage)
frontend/src/app.css              theme tokens: `:root` static (--measure, --serif, --arabic, --quran), `[data-theme=light|dark]` variable (--bg, --fg, --muted, --rule); @font-face for UthmanTN
frontend/src/lib/Page.svelte      <main> + mandatory basmalah/hamd/salawat wrapper
frontend/src/lib/ThemeToggle.svelte  top-right hover-revealed light↔dark toggle (writes localStorage, updates dataset.theme)
frontend/src/lib/router.svelte.js ~15 line history-API router + setPath() for SSR
frontend/src/lib/Link.svelte      client-side <a>, intercepts plain clicks
frontend/src/pages/IndexPage.svelte  list pages (initial prop → SSR; falls back to fetch)
frontend/src/pages/PageView.svelte   one page (initial prop → SSR; body is server-rendered HTML, no marked on client)
content/*.md                      sample pages (al-bidaya AR/RTL, on-reading-slowly EN/LTR)
```

## API

- `GET /api/pages` → `[PageMeta]` sorted by date desc. `PageMeta = { slug, title, lang, dir, date }`.
- `GET /api/pages/{slug}` → `Page = PageMeta + body` where `body` is server-rendered **HTML** (pulldown-cmark). 404 on missing or path traversal attempt.
- `GET /p/{slug}` → serves prerendered `dist/p/{slug}/index.html`; falls back to SPA shell if file missing.
- `GET /` → serves prerendered `dist/index.html`.

## Conventions

- Single mandatory wrapper (`Page.svelte`). Every page = basmalah/hamd/salawat opening; closing = Ayah (Quran font) + Ibrahimi salawat with سيدنا prefix. Non-negotiable per concept.
- RTL/LTR per-page via frontmatter `dir`. Mixed-language inline element support not yet.
- Theme: light + dark variants on single theme. Tokens in `app.css` under `[data-theme=light|dark]`. Selection: inline `<head>` script reads `localStorage['defter-theme']`, falls back to `prefers-color-scheme`. No FOUC. Toggle UI not yet built.
- Slug guard: rejects `/`, `..`, empty (`page.rs:84`, also enforced in `main.rs` `/p/{slug}` handler).
- No restart on content add — re-read every request.
- **Quality bar:** Lighthouse 100 in Performance, Accessibility, Best Practices, SEO on every page. Hard constraint. See `## Lighthouse 100` below for blockers.

## Done

- [x] Iter 1 — Rust+Svelte skeleton, hardcoded page, mandatory scaffolding, light theme, RTL/LTR-aware.
- [x] Iter 2 — filesystem-backed pages, `/api/pages` + `/api/pages/{slug}`, minimal client router, index list, page view with markdown, two sample pages (EN/LTR + AR/RTL).
- [x] Build pipeline — `make install/run/release/dev/build/clean`.
- [x] SPA fallback — unknown routes serve `index.html`.
- [x] Date-desc sort on listing.
- [x] Path traversal guard on slug.
- [x] **Lighthouse 100 (Performance · A11y · Best Practices · SEO)** on `/`, `/p/al-bidaya`, `/p/on-reading-slowly`. Achieved via:
  - SSR prerender at build (`frontend/scripts/prerender.js`) using Vite SSR loader + `svelte/server.render()`. Every route emits `dist/{path}/index.html` with full content baked in.
  - Per-page `<title>`, `<meta description>`, `<link rel=canonical>`, Open Graph, Twitter card, and per-page `<html lang dir>`.
  - Components refactored: `IndexPage`/`PageView` accept `initial` prop, use `$derived` + `$effect` so SSR has resolved data and client hydrates cleanly.
  - `main.js` switches to `hydrate()` when target has prerendered children, falls back to `mount()`.
  - Backend `/p/{slug}` route serves prerendered file (path-traversal guarded); SPA shell fallback retained if slug not in dist (stale-build safety).
  - `<main>` landmark added in `Page.svelte` (a11y).
  - `dist/sitemap.xml` + `dist/robots.txt` generated by prerender with absolute `SITE_ORIGIN` URLs.
  - `frontend/index.html` is now a template with placeholders (`%LANG%`, `%DIR%`, `%TITLE%`, `%DESCRIPTION%`, `%CANONICAL%`, `%DATA%`, `<!--ssr-outlet-->`); Vite dev plugin fills sensible defaults so `bun run dev` still works.
- [x] **Closing-Ayah convention** — Quran font (`UthmanTN` subset, 45.5 KB woff2) bundled, preloaded, and applied to closing Ayah in `Page.svelte`. Ibrahimi salawat with سيدنا prefix rendered below. See `### Page closing block`.

## TODO

### Navigation
- [ ] Hidden top navbar (reveal on hover): CV, Blog, GitHub, LinkedIn, RSS, Featured.
- [ ] Featured view — single centered column of project cards (description, external link, internal link).
- [ ] Hidden left section navigator (reveal on hover) for in-page TOC.
- [ ] TL;DR button per published page (hidden, reveal on hover).

### Theming
- [x] **Dark variant infra** — `[data-theme="light"]` / `[data-theme="dark"]` selectors in `app.css`. Single theme for now, dark+light variants both shipped. Tokens (`--bg`, `--fg`, `--muted`, `--rule`) swap; static tokens (`--measure`, `--serif`, `--arabic`, `--quran`) stay on `:root`. Dark variant sets `color-scheme: dark` for native widgets.
- [x] **System-pref auto-detect** (`prefers-color-scheme`) — inline blocking `<script>` in `<head>` (runs before paint, no FOUC) reads `localStorage['defter-theme']`; falls back to `matchMedia('(prefers-color-scheme: dark)')`. Sets `document.documentElement.dataset.theme`. `<meta name="color-scheme" content="light dark">` declared.
- [x] **Persistence** — inline init reads `localStorage['defter-theme']` (key reserved for future toggle). Honored on every prerendered page load.
- [x] Theme switcher UI — `lib/ThemeToggle.svelte`. Fixed top/inset-inline-end (RTL-aware) icon button, sun/moon SVG, opacity 0.35 → 1 on hover/focus. Two-state toggle (light ↔ dark): writes `localStorage['defter-theme']` and updates `document.documentElement.dataset.theme` synchronously. `aria-label` reflects target state. Render-gated on client mount to avoid SSR/CSR mismatch.
- [ ] Multi-theme: more than one named theme, each with light + dark variant (concept calls for "several themes"). Add `[data-theme-name="..."]` orthogonal to `[data-theme]`.
- [x] WCAG AA contrast verified on both variants (light `#1a1a1a/#fbfaf7` ≈ 16:1; dark `#ece8df/#14130f` ≈ 15:1; muted tokens ≥ 6:1 both).
- [x] Lighthouse 100 (mobile + desktop) preserved after theme infra change.

### Content elements
- [ ] Ayah element (custom block in markdown — syntax TBD, e.g. `:::ayah`).
- [ ] Hadith element (custom block — syntax TBD).
- [ ] Executed JS code block (sandboxed inline demo).
- [ ] Markdown extras audit: images, audio, video, link previews.
- [ ] Mixed-language inline support within single element.

### Footnotes / sidenotes
- [ ] Markdown footnote syntax (`[^1]` / `[^1]: ...`) parsed by `pulldown-cmark` (enable `FOOTNOTES` option).
- [ ] Render footnotes as margin sidenotes (desktop): hidden by default, fade-in on hover over ref, fade-out on hover out.
- [ ] Click ref to pin/unpin sidenote (persistent visibility).
- [ ] Endnote section rendered after article body (full list, traditional numbered).
- [ ] Mobile: sidenote collapses into tap-triggered inline expansion under the ref.
- [ ] Keyboard equivalent (focus ref → reveal sidenote; Enter to pin).
- [ ] RTL layout: sidenotes mirror to left margin when `dir="rtl"`.

### Page types
- [ ] CV page (arbitrary code, single page).
- [ ] App page concept — backend+frontend or frontend-only sub-apps.
- [ ] Blog post standardized design (separate from arbitrary app pages).

### SEO / discoverability
- [x] `sitemap.xml` (generated from page list at build).
- [x] `robots.txt` (generated at build with absolute `SITE_ORIGIN` sitemap URL).
- [x] Open Graph / Twitter card meta per page (via prerender template).
- [x] `ai.txt` — Spawning AI policy (allow-all). Generated by prerender.
- [x] `llm.txt` — llmstxt.org-style site summary (concept named it `llm.txt`, not `llms.txt`). Lists posts, RSS, sitemap. Generated by prerender.
- [x] RSS feed — `/rss.xml` RSS 2.0 with `atom:link rel=self`, RFC 822 `pubDate`, per-post description (re-uses `extractDescription`). Autodiscovery `<link rel=alternate type=application/rss+xml>` added in `index.html` template.

### Editor
- [ ] In-browser page editor — covers blog elements (markdown, exec code, ayah, hadith).
- [ ] Auth for editor.
- [ ] Persistence beyond filesystem (DB? still filesystem with editor write?).

### Home page
- [ ] Decide: blog view default vs other. Picked blogs + recent + full list candidate.

### Polish
- [ ] Plenty of negative space pass.
- [ ] Reading-mode optimization (calm, single focus).
- [ ] Accessibility audit (focus states, contrast, keyboard nav for hover-revealed UI).

### Page closing block
- [x] Bundle Quran font — `UthmanTN_v2-0.ttf` subset to Arabic ranges (U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF) → `frontend/public/fonts/UthmanTN-Arabic.woff2` (45.5 KB woff2). Subset built via `pyftsubset --layout-features='*' --flavor=woff2`.
- [x] `@font-face` (`--quran` var) in `app.css` with `font-display: swap` + `unicode-range`. Preload `<link rel=preload as=font crossorigin>` injected via `index.html` template — fires on every prerendered route.
- [x] `Page.svelte` closing: closing Ayah in `--quran` font (`﴿...﴾`) + full Ibrahimi salawat with سيدنا prefix on each mention of سيدنا محمد and سيدنا إبراهيم. Replaces prior bare salawat/hamd.
- [x] Lighthouse 100 (mobile, 3 runs) on `/p/al-bidaya` after change. CLS 0, LCP 1.2s.

### Lighthouse 100 (Performance · A11y · Best Practices · SEO)
- [x] **Prerender** every route at build into static `.html` (full content, correct `<title>`, `<meta description>`, `<html lang dir>`).
- [x] Set `<html lang>` and `dir` per page (via prerender template).
- [x] Per-page `<title>`, `<meta description>`, Open Graph, Twitter card.
- [x] `<main>` landmark in `Page.svelte`.
- [x] `sitemap.xml` + `robots.txt` (absolute sitemap URL) generated by prerender.
- [x] Lighthouse 100 on `/`, `/p/al-bidaya`, `/p/on-reading-slowly` — **both desktop and mobile presets**.
- [x] Markdown → HTML moved to backend (`pulldown-cmark`); `marked` dropped from client bundle. Client JS: 94KB→52KB (33→20 gz).
- [ ] Keyboard-equivalent for hover-revealed controls (navbar, section nav, TL;DR) — will apply once those are built.
- [ ] WCAG AA contrast audit on every future theme variant.
- [ ] Image policy: explicit `width`/`height`, modern format, lazy-load below fold (applies once images authored).
- [ ] Preload critical assets (closing-Ayah font once added).
- [ ] CI step: run Lighthouse against every prerendered route, fail build below 100.
- [ ] CSP review: replace `'unsafe-inline'` style-src with hashed/nonced styles once build pipeline emits stable hashes.
- [ ] Set real `SITE_ORIGIN` env var for production builds (currently defaults to `http://127.0.0.1:8787`).

### Infra
- [ ] Deploy target chosen.
- [ ] CI.
- [ ] Caching layer if filesystem-per-request becomes hot.

## Open questions

- Page editor: separate admin UI or inline WYSIWYG?
- Exec code blocks: iframe sandbox? Web Worker? CSP?
- Ayah/Hadith: hand-authored or pull from dataset (e.g. quran.com API, sunnah.com)?
- "Pages" abstraction unifies blog + CV + apps — at what point do app pages need their own backend routes vs static SPA assets?
- Multi-lingual mixing: per-element `lang`/`dir` overrides inside markdown — extension or convention?

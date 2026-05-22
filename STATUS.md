# defter — status

دفتر. Personal site. Vision: `concept.txt`.

## Stack (in migration — see "Migration: actix+SPA → pure SvelteKit" below)

**Target (in progress):**
- **SvelteKit + Svelte 5 (runes)**, `@sveltejs/adapter-static` for full static prerender.
- **No backend.** All routes (`/`, `/featured`, `/p/[slug]`, `/p/cv`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/ai.txt`, `/llm.txt`) are prerendered to static `.html`/`.xml`/`.txt` at build time. Production = static folder served by any HTTP server (Nginx, Caddy, Pages, S3+CloudFront, etc.).
- **Content pipeline:** filesystem `content/*.md` with TOML frontmatter. Loaders run inside `+page.server.js` during prerender — `marked` + `marked-footnote` + `marked-gfm-heading-id` + custom preprocessors (`:::ayah`, `:::hadith`, ` ```exec ` fenced blocks, sidenote injector).
- **Tooling:** Bun for install + script runner; Vite (via SvelteKit) for dev/build/preview.

**Previous stack (being removed):**
- Rust + actix-web backend serving prerendered HTML from `frontend/dist/` + a `/api/pages` JSON endpoint.
- Standalone `frontend/scripts/prerender.js` SSR-rendering Svelte via `vite.ssrLoadModule()` + `svelte/server.render()`.
- Hand-rolled `lib/router.svelte.js` + `lib/Link.svelte`.

**Rationale for the move:** actix's only job was static-serving + a JSON list that the SSR script already had access to at build time. Two languages, two processes, two deploy targets, and a bespoke SSR pipeline for a fully prerenderable site — net negative. SvelteKit replaces all of it with one routing convention, one loader convention, one config, one dev server. Rust will return when an *app page* (concept.txt) needs a real backend.

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

## Footnotes / sidenotes (rebuilt — see migration below)

The sidenote behavior described in `concept.txt` is being rebuilt during the migration:

- **Hover** ref → ephemeral preview popover near the ref (single slot, replaced).
- **Click** ref → pin into a shared sticky margin stack, sorted by document Y position.
- **Multiple pins** stack vertically; each has unpin × ; stack has "Pinned (N) · Clear all" header; `Esc` clears.
- **Per-occurrence id** so a label opened twice = two separate pins.
- **Endnote section** always present at body bottom for a11y / print / readers.
- **Narrow viewports** (< 70rem): no preview popover; click toggles inline expansion under the ref.

This replaces the previous "one sidenote per ref injected next to the paragraph" approach, which broke when multiple refs were near each other and didn't match the concept.

## Migration: actix + SPA → pure SvelteKit

### Phases

1. **Docs** — update `concept.txt` (stack + footnotes) + this `STATUS.md`.
2. **Scaffold SvelteKit** — `svelte.config.js` (adapter-static, prerender, `entries()` for `/p/[slug]`), `src/app.html` (theme-init script + font preload + RSS link), `package.json` deps.
3. **Content pipeline** (`src/lib/server/content.js`) — filesystem walker, TOML frontmatter parser, marked + marked-footnote + marked-gfm-heading-id, directives preprocessor, exec renderer, sidenote injector (returns `{ html, footnoteMap }`), heading extractor.
4. **Routes** — `+layout.server.js` (shared page list), `/+page.svelte`, `/featured/+page.svelte`, `/p/[slug]/+page.svelte` + `+page.server.js` (with `entries()`), `/p/cv/+page.svelte`, `/rss.xml/+server.js`, `/sitemap.xml/+server.js`, `/robots.txt/+server.js`, `/ai.txt/+server.js`, `/llm.txt/+server.js`.
5. **Components** — port `Page.svelte`, `Nav.svelte`, `SectionNav.svelte`, `ThemeToggle.svelte`. Drop `Link.svelte` + `router.svelte.js` (SvelteKit handles routing).
6. **Sidenote rework** — new `sidenotes.svelte.js` runes store + `MarginNotes.svelte` (sticky stack + hover slot) + `Sidenotes.svelte` wrapper (binds events to `.fn-ref` after hydration, reads `window.__FN__` body map).
7. **Static assets** — move `frontend/public/fonts/` → `frontend/static/fonts/`.
8. **Cleanup** — delete `backend/`, old `frontend/scripts/prerender.js`, old `src/{main.js,App.svelte,lib/router.svelte.js,lib/Link.svelte,pages/}`, old `frontend/index.html`. Replace Makefile + `.github/workflows/lighthouse.yml` (no Rust; build SvelteKit; serve with `vite preview` for Lighthouse).
9. **Verify** — manual sweep + Lighthouse 100×4 mobile+desktop on every route.

### Migration TODO

- [ ] Scaffold SvelteKit project
- [ ] Port content pipeline
- [ ] Implement routes
- [ ] Port shared components
- [ ] Rebuild sidenote system
- [ ] Move static assets
- [ ] Delete old stack + update Makefile + CI + README
- [ ] Manual feature sweep
- [ ] Lighthouse 100×4 on every route × form-factor (CI must stay green)

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

## Done (migration — fill in as each phase ships)

- [ ] _(populated during migration)_

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

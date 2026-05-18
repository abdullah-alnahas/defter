# defter

دفتر — Turkish/Arabic for "notebook." Personal website.

Vision: see `concept.txt`.

## Stack

- **Backend:** Rust + actix-web (`backend/`). Markdown → HTML on the server (`pulldown-cmark`).
- **Frontend:** Svelte 5 + Vite SPA (`frontend/`), built with Bun. SSR-prerendered to static `.html` per route.
- Backend serves prerendered `frontend/dist/` (HTML, fonts, sitemap, robots, RSS, ai.txt, llm.txt). Unknown routes fall back to SPA shell.

## Layout

```
backend/         actix-web server (serves SPA + /api/pages + prerendered HTML)
  src/page.rs            frontmatter parsing + filesystem loader + markdown→HTML
frontend/        Vite + Svelte SPA
  index.html             template with %LANG%/%DIR%/%TITLE%/... placeholders, inline theme-init script
  public/fonts/          subsetted Quran font (UthmanTN, woff2)
  scripts/prerender.js   SSR build: emits dist/*.html, sitemap.xml, robots.txt, rss.xml, ai.txt, llm.txt
  src/
    App.svelte           top-level router switch
    app.css              theme tokens (`[data-theme=light|dark]`), @font-face for UthmanTN
    lib/Page.svelte      mandatory basmalah/hamd/salawat scaffolding + closing Ayah + Ibrahimi salawat
    lib/ThemeToggle.svelte  top-right hover-revealed light↔dark toggle
    lib/Nav.svelte       top hidden navbar (Blog / Featured / CV / GitHub / LinkedIn / RSS) + skip-link
    lib/SectionNav.svelte left-edge hover-revealed in-page TOC (h2/h3 from rendered body)
    lib/router.svelte.js minimal history-API router
    lib/Link.svelte      client-side <a>
    pages/               IndexPage, PageView
content/         markdown pages with TOML frontmatter (source of all blog content)
fonts/           full unsubsetted source fonts (UthmanicHafs, UthmanTN, Besmellah)
concept.txt      project vision (source of truth)
STATUS.md        current iteration status, layout, conventions, done/TODO
```

## API

- `GET /api/pages` → list of page metadata, sorted by date desc
- `GET /api/pages/{slug}` → full page (metadata + **server-rendered HTML body**)
- `GET /p/{slug}` → prerendered HTML (falls back to SPA shell if missing)
- `GET /rss.xml`, `/sitemap.xml`, `/robots.txt`, `/ai.txt`, `/llm.txt` → static files emitted by prerender

## Authoring a page

Drop a `*.md` file into `content/` with TOML frontmatter:

```
+++
title = "..."
lang = "en"     # or ar, tr
dir  = "ltr"    # or rtl
date = "2026-05-07"
tldr = "..."    # optional; renders a hover-revealed TL;DR button next to the title
+++

Markdown body here.
```

Footnotes use standard Markdown syntax: `[^label]` inline ref, `[^label]: ...` definition anywhere in the body. Rendered as superscript refs with hover-revealed margin sidenotes (desktop) or tap-to-expand inline cards (mobile); endnote list always appears at the end of the body.

Filename (without `.md`) is the slug. No restart needed — backend reads filesystem on every request.

## Run

```sh
make install       # frontend deps (first time)
make run           # build frontend + run backend → http://127.0.0.1:8787
make release       # same, optimized backend
make dev           # frontend HMR only (no backend) → http://localhost:5173
make build         # frontend production build only
make clean         # nuke dist, node_modules, target
```

## Iteration status

**Iter 1 (done):** Rust+Svelte skeleton, one hardcoded page, mandatory scaffolding, single light theme, RTL/LTR aware.

**Iter 2 (done):** Filesystem-backed pages in `content/*.md` with TOML frontmatter. Backend exposes `/api/pages` + `/api/pages/{slug}`. Frontend has minimal client router, index list, page view with markdown rendering.

**Iter 3 (done):** SSR prerender pipeline (every route emits static `.html` with full content baked in). Per-page `<title>` / meta / OG / Twitter. Sitemap + robots. Markdown → HTML moved to backend (`pulldown-cmark`). Lighthouse 100 (mobile + desktop, all four categories) on every prerendered route.

**Iter 4 (done):** Closing-Ayah convention — UthmanTN Quran font subset (woff2, preloaded). `Page.svelte` closing now renders the Ayah in Quran font + full Ibrahimi salawat with سيدنا. SEO trio: RSS feed (`/rss.xml`), `ai.txt`, `llm.txt`. Dark theme variant + system-pref auto-detect (no FOUC) + top-right hover-revealed light↔dark toggle with `localStorage` persistence. Top hover-revealed navbar (Blog / Featured / CV / GitHub / LinkedIn / RSS) with keyboard skip-link.

**Not yet:** Featured view, section nav, TL;DR, multi-theme, footnote sidenotes, exec code blocks, Ayah/Hadith elements, page editor, CV, app pages, persistence beyond filesystem, multilingual mixing within a single element.

See `STATUS.md` for the full per-area breakdown.

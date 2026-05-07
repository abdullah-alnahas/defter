# defter

دفتر — Turkish/Arabic for "notebook." Personal website.

Vision: see `concept.txt`.

## Stack

- **Backend:** Rust + actix-web (`backend/`)
- **Frontend:** Svelte 5 + Vite SPA (`frontend/`), built with Bun
- Backend serves frontend `dist/` with SPA fallback to `index.html`.

## Layout

```
backend/         actix-web server (serves SPA + /api/pages)
  src/page.rs            frontmatter parsing + filesystem loader
frontend/        Vite + Svelte SPA
  src/
    App.svelte           top-level router switch
    lib/Page.svelte      mandatory basmalah/hamd/salawat scaffolding
    lib/router.svelte.js minimal history-API router
    lib/Link.svelte      client-side <a>
    pages/               IndexPage, PageView
content/         markdown pages with TOML frontmatter (source of all blog content)
concept.txt      project vision (source of truth)
```

## API

- `GET /api/pages` → list of page metadata, sorted by date desc
- `GET /api/pages/{slug}` → full page (metadata + markdown body)

## Authoring a page

Drop a `*.md` file into `content/` with TOML frontmatter:

```
+++
title = "..."
lang = "en"     # or ar, tr
dir  = "ltr"    # or rtl
date = "2026-05-07"
+++

Markdown body here.
```

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

**Iter 2 (done):** Filesystem-backed pages in `content/*.md` with TOML frontmatter. Backend exposes `/api/pages` + `/api/pages/{slug}`. Frontend has minimal client router, index list, page view with markdown rendering via `marked`. Two sample pages: one EN/LTR, one AR/RTL.

**Not yet (deliberately):** navbar (hidden until hover), themes, executable code blocks, ayah/hadith elements, page editor, RSS, sitemap, CV, app pages, persistence beyond filesystem, multilingual mixing within a single element.

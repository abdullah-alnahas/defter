# kalem-and-defter

قلم ودفتر — Arabic for "pen and notebook." Personal website.

**Live:** https://abdullah-alnahas.github.io/kalem-and-defter/

Vision: see `concept.txt`. Per-iteration status: see `STATUS.md`.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`: builds with
`BASE_PATH=/kalem-and-defter`, publishes `frontend/build/` to GitHub Pages.
For a different host or repo name, override `BASE_PATH`, `PRERENDER_ORIGIN`,
and `SITE_ORIGIN` in the workflow `env` block.

## Themes

Palette switcher in the top-end toggle bar cycles through eight palettes:
`paper` (default), `sepia`, `windsor`, `zapier`, `clipboard`, `enveritas`,
`salla`, `brave`. The non-paper/sepia palettes are distilled from the
`cv_*.html` mockups in `/home/abdullah/Documents/hdd/career-ops/`. Each
palette redefines `--bg`, `--fg`, `--muted`, `--rule`, `--accent` for both
light and dark variants; layout, type, and spacing don't change.

## Stack

- **SvelteKit + Svelte 5 (runes)** with `@sveltejs/adapter-static` — pure static prerender, no runtime server in production.
- **Markdown pipeline** at build time inside `+page.server.js` loaders: `marked` + `marked-footnote` + `marked-gfm-heading-id` + custom preprocessors (`:::ayah`, `:::hadith`, ` ```exec ` fenced blocks, sidenote injector).
- **Typography:** Montserrat (body + nav), Noto Naskh Arabic (Arabic body), UthmanicHafs (Quran). All self-hosted woff2 subsets.
- **Bun** for install + scripts; **Vite** under the hood (SvelteKit's bundler).
- **No backend.** Output is a static `build/` folder — drop into Nginx, Caddy, Pages, S3+CloudFront, anywhere static.

## Layout

```
frontend/
  src/
    app.html                              template (theme-init script, font preload, RSS link)
    app.css                               font-faces, theme tokens, sidenote/exec/ayah/button styles
    lib/
      server/content.js                   filesystem walker, frontmatter parser, marked pipeline, footnote extractor
      sidenote-bus.svelte.js              tiny pub/sub: Sidenotes ↔ ThemeToggle (pin-all toggle)
      components/
        Page.svelte                       mandatory wrapper (basmalah/hamd with Quran font + diacritics, title row with TLDR trigger, body, closing Ayah + Ibrahimi salawat). Symmetric 3-col grid (margin/body/margin).
        ThemeToggle.svelte                icon bar at top-end: pin-all (when sidenotes exist) + P/S palette + sun/moon variant
        MarginAside.svelte                persistent left-margin nav (fixed top-start)
        BackToTop.svelte                  fixed bottom-end, dim arrow + always-visible "Back to top" label
        Sidenotes.svelte                  per-page mount: scans refs, creates margin slots, binds hover/click/pin
    routes/
      +layout.{js,svelte}                 global prerender, skip-link, mounts ThemeToggle + MarginAside + BackToTop
      +page.svelte                        home (Picked / All)
      featured/+page.svelte               featured-cards view
      p/[slug]/{+page.server.js,+page.svelte}   markdown pages (entries() enumerates content/*.md)
      p/cv/+page.svelte                   CV (Svelte component, not from markdown)
      rss.xml/+server.js                  RSS 2.0 feed
      sitemap.xml/+server.js              sitemap
      robots.txt/+server.js               robots
      ai.txt/+server.js                   Spawning AI policy
      llm.txt/+server.js                  LLM-readable site summary
  static/
    fonts/UthmanicHafs-Arabic.woff2       Quran font (≈ 96 KB) — auto-rosette around Arabic-Indic digits
    fonts/NotoNaskhArabic-400-arabic.woff2 Arabic body (≈ 54 KB)
    fonts/Montserrat-{400,500,600}-{latin,latin-ext}.woff2   body + nav font (≈ 18–32 KB each)
    favicon.svg                           inline SVG glyph (د)
  svelte.config.js                        adapter-static, prerender, $content alias → ../content
  vite.config.js                          sveltekit() plugin + cache-control headers for preview
content/                                  *.md with TOML frontmatter — source of all blog content
```

## Authoring a page

Drop a `*.md` file into `content/` with TOML frontmatter:

```
+++
title = "..."
lang = "en"      # or ar, tr
dir  = "ltr"     # or rtl
date = "2026-05-22"
tldr = "..."     # optional; spawns a dim TL;DR button next to the title (hover → preview, click → pin)
featured = true  # optional; appears on /featured as a card
external = "https://..." # optional; external link on the featured card
+++

Markdown body here.
```

External links (`http://` / `https://`) in markdown automatically open in a new tab with `rel="noopener noreferrer"` and pick up a ↗ arrow on hover. Same for the nav aside's GitHub / LinkedIn entries.

Footnotes use standard Markdown syntax: `[^label]` inline ref, `[^label]: ...` definition.
- Each ref → invisible margin slot at its vertical position.
- Hover ref or note → reveal. Click ref → pin. Click again → unpin. `Esc` clears all.
- Pin/Unpin-all pin-icon toggle lives in the theme bar (top-end), appears only when the page has sidenotes.
- Endnote list always present at body bottom (a11y / print / readers).
- Narrow viewport (≤ 56rem): notes flow below the body in document order.

### Executable JS code blocks

Fenced code with the `exec` info-string renders as a sandboxed iframe:

````
```exec
print('hello');
print(2 + 2);
```
````

Sandbox is `allow-scripts` only. Runtime exposes `print(...)`; thrown errors render in red. Explicit `width`/`height` attributes prevent CLS.

### Ayah / Hadith blocks

```
:::ayah ref="Al-Baqarah 2:255"
اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ
:::

:::hadith ref="صحيح البخاري"
إنَّما الأعمالُ بالنِّيَّاتِ
:::
```

Both render as bordered figures with `lang="ar" dir="rtl"`. Ayah uses the Quran font; Hadith uses the regular Arabic stack.

Filename (without `.md`) is the slug. New file = next build picks it up.

## Run

```sh
make install   # frontend deps (first time)
make dev       # SvelteKit dev server → http://localhost:5173
make build     # static prerender → frontend/build/
make preview   # serve frontend/build/ → http://127.0.0.1:8787
make run       # alias for preview
make clean     # nuke build / node_modules / .svelte-kit
```

## Quality bar

- **Desktop:** Lighthouse 100 in Performance, Accessibility, Best Practices, SEO on every route. Hard constraint, enforced by `.github/workflows/lighthouse.yml` on every push/PR to `main`.
- **Mobile:** 100 across A11y / BP / SEO; Performance ≥ 99 (the inlined hydration bundle + Montserrat preload puts FCP at 1.0–1.4 s on simulated Slow 4G — within "good" Core Web Vitals but rounded just short of perfect). CLS = 0 verified.

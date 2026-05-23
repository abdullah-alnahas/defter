# defter

دفتر — Turkish/Arabic for "notebook." Personal website.

Vision: see `concept.txt`. Per-iteration status: see `STATUS.md`.

## Stack

- **SvelteKit + Svelte 5 (runes)** with `@sveltejs/adapter-static` — pure static prerender, no runtime server in production.
- **Markdown pipeline** at build time inside `+page.server.js` loaders: `marked` + `marked-footnote` + `marked-gfm-heading-id` + custom preprocessors (`:::ayah`, `:::hadith`, ` ```exec ` fenced blocks, sidenote injector).
- **Typography:** Montserrat self-hosted (woff2, 400/500/600, latin + latin-ext); UthmanTN preloaded for the Quran-font opening lines.
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
      sidenote-bus.svelte.js              tiny pub/sub: Sidenotes ↔ MarginAside (pin-all toggle)
      components/
        Page.svelte                       mandatory wrapper (basmalah/hamd with Quran font + diacritics, title row with TLDR trigger, body, closing Ayah + Ibrahimi salawat). Symmetric 3-col grid (margin/body/margin).
        SectionNav.svelte                 hover-revealed left in-page TOC
        ThemeToggle.svelte                two-button bar: P/S palette + sun/moon variant (fixed top-right)
        MarginAside.svelte                persistent right-margin nav + pin-all (fixed top-right)
        BackToTop.svelte                  fixed bottom-right, dim arrow → hover reveals label
        Sidenotes.svelte                  per-page mount: scans refs, creates margin slots, binds hover/click/pin
    routes/
      +layout.{js,svelte}                 global prerender, skip-link, mounts ThemeToggle + MarginAside + BackToTop
      +page.svelte                        home (Picked / Recent / All)
      featured/+page.svelte               featured-cards view
      p/[slug]/{+page.server.js,+page.svelte}   markdown pages (entries() enumerates content/*.md)
      p/cv/+page.svelte                   CV (Svelte component, not from markdown)
      rss.xml/+server.js                  RSS 2.0 feed
      sitemap.xml/+server.js              sitemap
      robots.txt/+server.js               robots
      ai.txt/+server.js                   Spawning AI policy
      llm.txt/+server.js                  LLM-readable site summary
  static/
    fonts/UthmanTN-Arabic.woff2           Quran-font Arabic subset (45.5 KB)
    fonts/Montserrat-{400,500,600}-{latin,latin-ext}.woff2   body font (≈ 18–32 KB each)
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

Footnotes use standard Markdown syntax: `[^label]` inline ref, `[^label]: ...` definition.
- Each ref → invisible margin slot at its vertical position.
- Hover ref or note → reveal. Click ref → pin. Click again → unpin. `Esc` clears all.
- Pin/Unpin-all toggle lives in the right margin aside.
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
- **Mobile:** 100 across A11y / BP / SEO; Performance ≥ 99 (the inlined hydration bundle + Montserrat + UthmanTN preload puts FCP at 1.0–1.4 s on simulated Slow 4G — within "good" Core Web Vitals but rounded just short of perfect). CLS = 0 verified.

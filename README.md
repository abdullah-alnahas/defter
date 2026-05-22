# defter

دفتر — Turkish/Arabic for "notebook." Personal website.

Vision: see `concept.txt`. Per-iteration status: see `STATUS.md`.

## Stack

- **SvelteKit + Svelte 5 (runes)** with `@sveltejs/adapter-static` — pure static prerender, no runtime server in production.
- **Markdown pipeline** at build time inside `+page.server.js` loaders: `marked` + `marked-footnote` + `marked-gfm-heading-id` + custom preprocessors (`:::ayah`, `:::hadith`, ` ```exec ` fenced blocks, sidenote injector).
- **Bun** for install + scripts; **Vite** under the hood (SvelteKit's bundler).
- **No backend.** Output is a static `build/` folder — drop into Nginx, Caddy, Pages, S3+CloudFront, anywhere static.

## Layout

```
frontend/
  src/
    app.html                              template (theme-init script, font preload, RSS link)
    app.css                               theme tokens + sidenote/exec/ayah styles
    lib/
      server/content.js                   filesystem walker, frontmatter parser, marked pipeline, footnote extractor
      sidenotes.svelte.js                 runes state: hover / pin / unpin / clearPins
      components/
        Page.svelte                       mandatory wrapper (basmalah/title/TLDR/body/closing Ayah + Ibrahimi salawat)
        Nav.svelte                        hover-revealed top navbar + skip-link
        SectionNav.svelte                 hover-revealed left in-page TOC
        ThemeToggle.svelte                two-button bar: P/S palette + sun/moon variant
        Sidenotes.svelte                  hydration: binds events to .fn-ref + mounts MarginNotes
        MarginNotes.svelte                sticky right rail (pinned stack + hover preview slot)
    routes/
      +layout.{js,server.js,svelte}       global prerender, page-list loader, layout shell
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
  svelte.config.js                        adapter-static, prerender, $content alias → ../content
  vite.config.js                          sveltekit() plugin
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
tldr = "..."     # optional; renders a hover-revealed TL;DR button
featured = true  # optional; appears on /featured as a card
external = "https://..." # optional; external link on the featured card
+++

Markdown body here.
```

Footnotes use standard Markdown syntax: `[^label]` inline ref, `[^label]: ...` definition.
- Hover (desktop) → ephemeral preview popover near the ref.
- Click → pin into the right-margin stack (sorted by document position).
- Multiple pins stack vertically with unpin × per item + "Clear all" header. `Esc` clears all.
- Narrow viewport: click renders an inline expansion under the ref instead.
- Endnote list always present at body bottom (a11y / print / readers).

### Executable JS code blocks

Fenced code with the `exec` info-string renders as a sandboxed iframe:

````
```exec
print('hello');
print(2 + 2);
```
````

Sandbox is `allow-scripts` only. Runtime exposes `print(...)`; thrown errors render in red.

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

Lighthouse 100 in Performance, Accessibility, Best Practices, SEO on every route × form-factor (mobile + desktop). Hard constraint, enforced by `.github/workflows/lighthouse.yml` on every push/PR to `main`.

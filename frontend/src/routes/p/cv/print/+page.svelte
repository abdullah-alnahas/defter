<script>
  /**
   * CV print route. Renders a chrome-free, themed CV ready for the browser's
   * native "Save as PDF" print flow. Opened in a new tab from /p/about with
   * ?palette=<id>&variant=<light|dark>; on mount we set the documentElement
   * dataset (so all --bg / --fg / --accent variables resolve correctly), mark
   * the body as `print-mode` (CSS hides the global chrome), and fire
   * window.print(). The user picks "Save as PDF" from the system dialog.
   */
  import { page } from '$app/state';
  import {
    identity, summary, roles, projects, education, skills, spoken, PALETTES,
  } from '$lib/cv-data.js';

  const ALLOWED_VARIANTS = new Set(['light', 'dark']);
  const ALLOWED_PALETTES = new Set(PALETTES.map((p) => p.id));

  const palette = $derived.by(() => {
    const q = page.url.searchParams.get('palette');
    return q && ALLOWED_PALETTES.has(q) ? q : 'paper';
  });
  const variant = $derived.by(() => {
    const q = page.url.searchParams.get('variant');
    return q && ALLOWED_VARIANTS.has(q) ? q : 'light';
  });
  const autoprint = $derived(page.url.searchParams.get('autoprint') !== '0');

  let mounted = $state(false);
  let prevTheme;
  let prevName;

  $effect(() => {
    const root = document.documentElement;
    prevTheme = root.dataset.theme;
    prevName = root.dataset.themeName;
    root.dataset.theme = variant;
    root.dataset.themeName = palette;
    document.body.classList.add('print-mode');
    mounted = true;
    if (autoprint) {
      // Give fonts + layout a tick to settle before opening the system dialog.
      const id = setTimeout(() => window.print(), 350);
      return () => {
        clearTimeout(id);
        document.body.classList.remove('print-mode');
        if (prevTheme !== undefined) root.dataset.theme = prevTheme;
        if (prevName !== undefined) root.dataset.themeName = prevName;
      };
    }
    return () => {
      document.body.classList.remove('print-mode');
      if (prevTheme !== undefined) root.dataset.theme = prevTheme;
      if (prevName !== undefined) root.dataset.themeName = prevName;
    };
  });
</script>

<svelte:head>
  <title>CV — {identity.name}</title>
  <meta name="robots" content="noindex" />
  <!-- Force the chrome off at SSR time as well as in JS — without this the
       skip-link / theme bar / nav / back-to-top can briefly render into the
       PDF before the on-mount class flip applies. -->
  <style>
    .skip, .theme-bar, .margin-aside, .back-to-top { display: none !important; }
  </style>
</svelte:head>

<main id="main-content" class="cv-doc" lang="en" dir="ltr" class:is-ready={mounted}>
  <header class="cv-hero">
    <h1>{identity.name} <span class="surname">({identity.surname})</span></h1>
    <p class="role-line">{identity.role}</p>
    <p class="meta-line">{identity.location}</p>
    <ul class="contact-row">
      {#each identity.links as l (l.href)}
        <li><a href={l.href}>{l.label}</a></li>
      {/each}
    </ul>
  </header>

  <section class="cv-section">
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>

  <section class="cv-section">
    <h2>Work Experience</h2>
    {#each roles as r (r.org + r.dates)}
      <article class="role">
        <header class="role-head">
          <div>
            <h3>{r.org} <span class="loc">— {r.location}</span></h3>
            <p class="role-title">{r.title}</p>
          </div>
          <time>{r.dates}</time>
        </header>
        <ul>
          {#each r.bullets as b}<li>{b}</li>{/each}
        </ul>
        <p class="tech"><strong>Technologies:</strong> {r.tech}</p>
      </article>
    {/each}
  </section>

  <section class="cv-section">
    <h2>Projects</h2>
    <ul class="defs">
      {#each projects as p}<li><strong>{p.title}</strong> — {p.body}</li>{/each}
    </ul>
  </section>

  <section class="cv-section">
    <h2>Education</h2>
    <ul class="defs">
      {#each education as e}<li><strong>{e.title}</strong> — {e.body}</li>{/each}
    </ul>
  </section>

  <section class="cv-section">
    <h2>Skills</h2>
    <dl class="skills">
      {#each skills as [k, v]}
        <dt>{k}</dt><dd>{v}</dd>
      {/each}
    </dl>
  </section>

  <section class="cv-section">
    <h2>Languages</h2>
    <ul class="inline">
      {#each spoken as l}<li>{l}</li>{/each}
    </ul>
  </section>

  <p class="print-hint" aria-hidden="true">
    If the print dialog didn't appear, use your browser's <kbd>Ctrl/⌘ + P</kbd>
    shortcut and choose "Save as PDF".
  </p>
</main>

<style>
  /* Hide site chrome whenever the print route is mounted. Uses :global
     because ThemeToggle / MarginAside / BackToTop / skip-link live outside
     this component (rendered by the root +layout.svelte) and we can't
     rebind them without leaving the document. */
  :global(body.print-mode .theme-bar),
  :global(body.print-mode .margin-aside),
  :global(body.print-mode .back-to-top),
  :global(body.print-mode .skip) {
    display: none !important;
  }
  :global(body.print-mode) { background: var(--bg); }

  .cv-doc {
    max-width: 48rem;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.55;
    font-size: 0.95rem;
  }

  .cv-hero {
    margin: 0 0 1.6rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--rule);
  }
  .cv-hero h1 {
    margin: 0 0 0.2rem;
    font-size: 1.65rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--accent);
  }
  .cv-hero h1 .surname { color: var(--muted); font-weight: 400; }
  .cv-hero .role-line {
    margin: 0 0 0.15rem;
    color: var(--fg);
    font-size: 0.98rem;
  }
  .cv-hero .meta-line {
    margin: 0 0 0.6rem;
    color: var(--muted);
    font-size: 0.88rem;
  }
  .cv-hero .contact-row {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.1rem;
    font-size: 0.86rem;
  }
  .cv-hero .contact-row a {
    color: var(--accent);
    text-decoration: none;
  }

  .cv-section { margin: 0 0 1.4rem; }
  .cv-section h2 {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 0.65rem;
  }
  .cv-section p { margin: 0 0 0.6rem; }

  .role {
    margin: 0 0 1rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid var(--rule);
  }
  .role:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .role-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-bottom: 0.35rem;
  }
  .role-head h3 {
    margin: 0;
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--fg);
  }
  .role-head h3 .loc {
    color: var(--muted);
    font-weight: 400;
    font-size: 0.9rem;
  }
  .role-head .role-title {
    margin: 0.1rem 0 0;
    color: var(--accent);
    font-size: 0.9rem;
  }
  .role-head time {
    color: var(--muted);
    font-size: 0.84rem;
    font-variant-numeric: tabular-nums;
    flex: 0 0 auto;
  }
  .role ul {
    margin: 0 0 0.45rem;
    padding-inline-start: 1.05rem;
  }
  .role ul li {
    margin-bottom: 0.2rem;
    line-height: 1.5;
  }
  .role .tech {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
    line-height: 1.5;
  }
  .role .tech strong { color: var(--fg); font-weight: 500; }

  .defs { list-style: none; padding: 0; margin: 0; }
  .defs li { margin: 0 0 0.4rem; line-height: 1.55; }
  .defs li strong { color: var(--accent); font-weight: 600; }

  .skills {
    display: grid;
    grid-template-columns: 11rem 1fr;
    gap: 0.4rem 1rem;
    margin: 0;
  }
  .skills dt {
    color: var(--accent);
    font-weight: 500;
    font-size: 0.88rem;
  }
  .skills dd {
    margin: 0;
    color: var(--fg);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .inline {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 1.1rem;
  }

  .print-hint {
    margin-top: 2.5rem;
    color: var(--muted);
    font-size: 0.78rem;
  }
  .print-hint kbd {
    font: inherit;
    background: var(--rule);
    border-radius: 3px;
    padding: 0 0.35em;
  }

  /* ---------- Print stylesheet ----------
     Generous, book-like margins so the printed CV reads comfortably:
     30 mm top / 28 mm sides / 30 mm bottom on A4 leaves an obvious frame of
     whitespace around the content. An internal `max-width: 160mm` on the
     body acts as a safety net if the visitor overrides the browser print
     dialog to "None" / "Minimum" — the content stays inside a sane line
     measure regardless. */
  @page {
    size: A4;
    margin: 30mm 28mm;
  }
  @media print {
    :global(html), :global(body) {
      background: var(--bg) !important;
      color: var(--fg) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cv-doc {
      max-width: 160mm;
      margin: 0 auto;
      padding: 0;
      font-size: 10.5pt;
      line-height: 1.55;
    }
    .cv-hero { margin-bottom: 1.4rem; padding-bottom: 0.9rem; }
    .cv-hero h1 { font-size: 18pt; }
    .cv-hero .role-line { font-size: 11pt; }
    .cv-hero .meta-line { font-size: 9.5pt; }
    .cv-hero .contact-row { font-size: 9pt; gap: 0.2rem 0.9rem; }
    .cv-section { margin-bottom: 1.25rem; }
    .cv-section h2 { font-size: 9pt; margin-bottom: 0.55rem; }
    /* Let everything flow naturally across pages. Page-break-inside: avoid
       on whole roles created huge orphan gaps when a long role wouldn't fit
       on the current page; widows/orphans give the typesetter enough
       wiggle room to avoid awkward single-line breaks without locking
       entire blocks. */
    /* Pure flow — no break-inside / widows / orphans guards. Earlier
       attempts to keep roles atomic created giant orphan gaps when a long
       role didn't fit on the current page. The role-head is laid out as
       a grid in print so the time slot sits flush-right without making
       the whole header an unbreakable flex container. */
    .role { margin-bottom: 0.95rem; padding-bottom: 0.7rem; }
    .role-head {
      display: grid;
      grid-template-columns: 1fr auto;
      column-gap: 1rem;
      align-items: baseline;
    }
    .role-head > :first-child { grid-column: 1; }
    .role-head time { grid-column: 2; grid-row: 1; align-self: baseline; }
    .role-head h3 { font-size: 11pt; }
    .role-head .role-title { font-size: 10pt; }
    .role-head time { font-size: 9pt; }
    .role ul li { margin-bottom: 0.2rem; line-height: 1.5; }
    .role .tech { font-size: 9pt; line-height: 1.5; }
    .skills { gap: 0.4rem 1rem; }
    .skills dt { font-size: 9.5pt; }
    .skills dd { font-size: 9.5pt; }
    .print-hint { display: none; }
    a { color: inherit; text-decoration: none; }
    a[href]:after { content: ''; } /* don't append URLs after links */
  }
</style>

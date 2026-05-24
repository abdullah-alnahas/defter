<script>
  import Page from '$lib/components/Page.svelte';
  import PaletteDial from '$lib/components/PaletteDial.svelte';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { PALETTES } from '$lib/cv-data.js';
  const canonical = $derived(page.url.href);

  /* Per-variant accent colours mirrored from ThemeToggle so the dial can
     paint the dots in the right hue without mounting the palette into the
     document. Keep this in sync with the values in app.css + ThemeToggle. */
  const SWATCH = {
    paper:    { light: '#1E252D',                  dark: '#D6CFBB' },
    sepia:    { light: '#6b3a12',                  dark: '#d6a86a' },
    ink:      { light: '#1e3a8a',                  dark: '#6ec7ff' },
    ember:    { light: '#ff4f00',                  dark: '#ff7a40' },
    rose:     { light: '#C12A58',                  dark: '#e84a78' },
    harbor:   { light: '#002060',                  dark: '#6e8cff' },
    amber:    { light: '#c08a18',                  dark: '#FFD21E' },
    magenta:  { light: '#d9156f',                  dark: '#ff1893' },
    slate:    { light: 'oklch(0.55 0.16 250)',     dark: 'oklch(0.78 0.13 250)' },
    forest:   { light: 'oklch(0.50 0.13 150)',     dark: 'oklch(0.78 0.13 150)' },
    cream:    { light: 'oklch(0.58 0.16 35)',      dark: 'oklch(0.78 0.13 35)'  },
    mono:     { light: 'oklch(0.30 0 0)',          dark: 'oklch(0.92 0 0)'      },
    midnight: { light: 'oklch(0.55 0.18 290)',     dark: 'oklch(0.82 0.14 290)' },
  };

  /* CV download modal state. Lets the visitor pick a palette and a variant
     before opening the chrome-free /p/cv/print route in a new tab. The print
     route auto-fires window.print() so they can save as PDF. */
  let downloadOpen = $state(false);
  let palette = $state('paper');
  let variant = $state('light');
  let triggerEl;
  let dialogEl;

  $effect(() => {
    if (!downloadOpen) return;
    /* Seed defaults from the visitor's current site theme so the printed CV
       matches whatever they're already reading in. */
    const root = document.documentElement;
    if (PALETTES.some((p) => p.id === root.dataset.themeName)) {
      palette = root.dataset.themeName;
    }
    if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') {
      variant = root.dataset.theme;
    }
    function onKey(e) {
      if (e.key === 'Escape') closeDialog();
    }
    function onClick(e) {
      if (dialogEl && !dialogEl.contains(e.target) && !triggerEl?.contains(e.target)) {
        closeDialog();
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  });

  function openDialog() {
    downloadOpen = true;
  }
  function closeDialog() {
    downloadOpen = false;
    triggerEl?.focus();
  }
  function openPrint() {
    const url = `${base}/p/cv/print?palette=${encodeURIComponent(palette)}&variant=${encodeURIComponent(variant)}`;
    window.open(url, '_blank', 'noopener');
    closeDialog();
  }
</script>

<svelte:head>
  <title>About — Abdullah AL NAHAS</title>
  <meta name="description" content="Senior AI Engineer working on NLP, search, and recommender systems in Arabic, English, and Turkish. Istanbul, GMT+3." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="About — Abdullah AL NAHAS" />
  <meta property="og:description" content="Senior AI Engineer · NLP · Search · Recommender Systems · GenAI." />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title="" lang="en" dir="ltr">
  <header class="about-hero">
    <h1>Abdullah AL NAHAS <span class="surname">(BAKIRCI)</span></h1>
    <p class="role-line">Senior AI Engineer · NLP · Search · Recommender Systems</p>
    <p class="meta-line">Istanbul, Turkey · GMT+3</p>
  </header>

  <section class="essay">
    <p>
      Hi — I'm Abdullah. I build AI systems that ship, usually in NLP, semantic
      search, or recommendation, and often involving Arabic, Turkish, and
      English text at scale.
    </p>
    <p>
      For the last seven years I've worked on the unglamorous parts of applied
      AI: data pipelines that don't lose records, deduplication that survives
      messy real-world input, ranking systems that hold up under load, and LLM
      pipelines that don't quietly hallucinate. Most recently I've been
      building a multi-stage POI cleansing and enrichment pipeline at Hudhud
      Maps, processing 70K+ records per city across Saudi Arabia. Before that:
      semantic search and catalog enrichment at Klevu, an LLM-assisted support
      pipeline at SAP, humanitarian NLP at Data Friendly Space, and a forum
      recommender at DonanimHaber.
    </p>
    <p>
      Outside paid work I'm a core contributor to
      <a href="https://ansari.chat" rel="noopener noreferrer external" target="_blank">Ansari</a>,
      an open-source Islamic AI assistant — I built its A/B prompt-comparison
      tooling, CI, and Mawsuah knowledge integration. I also placed top-5 in
      the Topcoder RAG Challenge.
    </p>
    <p>
      Based in Istanbul (GMT+3), comfortable across distributed teams in EMEA,
      MENA, and US time zones.
    </p>
  </section>

  <section class="contact-block">
    <h2>Contact</h2>
    <ul class="contact">
      <li><a href="mailto:abdullah.nahass@gmail.com">abdullah.nahass@gmail.com</a></li>
      <li><a href="https://www.linkedin.com/in/abdullah-al-nahas-537bb967/" rel="me noopener noreferrer external" target="_blank">LinkedIn</a></li>
      <li><a href="https://github.com/abdullah-alnahas" rel="me noopener noreferrer external" target="_blank">GitHub</a></li>
      <li><a href="https://huggingface.co/abdullah-alnahas" rel="me noopener noreferrer external" target="_blank">Hugging Face</a></li>
    </ul>
  </section>

  <section class="cv-block">
    <h2>CV</h2>
    <p class="cv-blurb">
      Want the detailed work history? Download a one-page CV themed to match
      whichever palette you like best.
    </p>
    <div class="cv-disclosure">
      <button
        type="button"
        class="cv-trigger"
        aria-haspopup="dialog"
        aria-expanded={downloadOpen}
        aria-controls="cv-dialog"
        bind:this={triggerEl}
        onclick={openDialog}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 4v12" />
          <path d="m7 11 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
        Download CV (PDF)
      </button>

      {#if downloadOpen}
        <div
          class="cv-dialog"
          role="dialog"
          aria-modal="false"
          aria-label="Download CV"
          id="cv-dialog"
          bind:this={dialogEl}
        >
          <div class="field">
            <span class="field-label">Palette</span>
            <PaletteDial
              palettes={PALETTES}
              value={palette}
              variant={variant}
              swatchMap={SWATCH}
              onSelect={(id) => (palette = id)}
            />
          </div>

          <div class="field">
            <span class="field-label">Variant</span>
            <div class="variant-row">
              <label class:is-active={variant === 'light'}>
                <input type="radio" name="cv-variant" value="light" bind:group={variant} />
                <span>Light</span>
              </label>
              <label class:is-active={variant === 'dark'}>
                <input type="radio" name="cv-variant" value="dark" bind:group={variant} />
                <span>Dark</span>
              </label>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="btn-secondary" onclick={closeDialog}>Cancel</button>
            <button type="button" class="btn-primary" onclick={openPrint}>
              Open print view
            </button>
          </div>
          <p class="dialog-hint">
            Opens in a new tab and triggers the print dialog — choose "Save as
            PDF" to download.
          </p>
        </div>
      {/if}
    </div>
  </section>
</Page>

<style>
  .about-hero {
    margin: 0 0 2.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rule);
  }
  .about-hero h1 {
    margin: 0 0 0.25rem;
    font-size: 1.85rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--accent);
  }
  .about-hero h1 .surname { color: var(--muted); font-weight: 400; }
  .about-hero .role-line {
    margin: 0 0 0.15rem;
    color: var(--fg);
    font-size: 1.02rem;
  }
  .about-hero .meta-line {
    margin: 0;
    color: var(--muted);
    font-size: 0.92rem;
  }

  .essay p {
    margin: 0 0 1.1rem;
    line-height: 1.75;
    color: var(--fg);
  }
  .essay p:last-child { margin-bottom: 0; }
  .essay a { color: var(--accent); }

  .contact-block, .cv-block { margin-top: 2.5rem; }
  .contact-block h2, .cv-block h2 {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 1rem;
  }

  .contact {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.2rem;
    font-size: 0.95rem;
  }
  .contact a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 160ms ease;
  }
  .contact a:hover, .contact a:focus-visible { border-bottom-color: var(--accent); }

  .cv-blurb {
    margin: 0 0 0.85rem;
    color: var(--fg);
    line-height: 1.6;
  }

  .cv-disclosure { position: relative; }

  .cv-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: 999px;
    color: var(--fg);
    cursor: pointer;
    font: inherit;
    font-size: 0.88rem;
    padding: 0.45rem 0.9rem 0.45rem 0.75rem;
    transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
  }
  .cv-trigger:hover,
  .cv-trigger:focus-visible,
  .cv-trigger[aria-expanded="true"] {
    color: var(--accent);
    border-color: var(--accent);
    outline: none;
  }
  .cv-trigger:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .cv-dialog {
    margin-top: 0.9rem;
    padding: 1rem 1.1rem;
    background: var(--bg);
    border: 1px solid var(--rule);
    border-radius: 0.5rem;
    box-shadow: 0 8px 24px -10px rgba(0,0,0,0.18);
    max-width: 30rem;
  }
  .field { margin-bottom: 1rem; }
  .field:last-of-type { margin-bottom: 0.6rem; }
  .field-label {
    display: block;
    color: var(--muted);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .variant-row { display: inline-flex; gap: 0.5rem; }
  .variant-row label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--rule);
    border-radius: 999px;
    cursor: pointer;
    font-size: 0.84rem;
    color: var(--fg);
    transition: border-color 140ms ease, color 140ms ease;
  }
  .variant-row label:hover { border-color: var(--accent); }
  .variant-row label.is-active {
    color: var(--accent);
    border-color: var(--accent);
  }
  .variant-row input { position: absolute; opacity: 0; pointer-events: none; }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  .btn-primary, .btn-secondary {
    font: inherit;
    font-size: 0.86rem;
    padding: 0.45rem 0.95rem;
    border-radius: 999px;
    cursor: pointer;
    transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
  }
  .btn-secondary {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--muted);
  }
  .btn-secondary:hover, .btn-secondary:focus-visible {
    color: var(--fg);
    border-color: var(--fg);
    outline: none;
  }
  .btn-primary {
    background: var(--accent);
    color: var(--bg);
    border: 1px solid var(--accent);
  }
  .btn-primary:hover, .btn-primary:focus-visible {
    background: color-mix(in srgb, var(--accent) 85%, var(--fg));
    outline: none;
  }

  .dialog-hint {
    margin: 0.7rem 0 0;
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.5;
  }

  @media (max-width: 32rem) {
    .actions { flex-direction: column-reverse; }
    .actions button { width: 100%; }
  }
</style>

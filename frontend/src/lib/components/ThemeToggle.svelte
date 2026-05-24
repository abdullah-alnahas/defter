<script>
  import { bus, pinAll, unpinAll } from '../sidenote-bus.svelte.js';
  import { PALETTES } from '../cv-data.js';
  import PaletteDial from './PaletteDial.svelte';

  let theme = $state('light');
  let themeName = $state('paper');
  let mounted = $state(false);
  let paletteOpen = $state(false);
  let popoverEl;
  let paletteBtnEl;

  const NAMES = PALETTES.map((p) => p.id);
  /* Per-variant accent colours. Kept inline so the trigger and the dial
     reflect the right hue immediately without forcing a paint round-trip. */
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
  const currentSwatch = $derived(SWATCH[themeName]?.[theme] ?? '#888');
  const currentLabel  = $derived(PALETTES.find((p) => p.id === themeName)?.label ?? 'Paper');

  $effect(() => {
    const root = document.documentElement;
    theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    themeName = NAMES.includes(root.dataset.themeName) ? root.dataset.themeName : 'paper';
    mounted = true;
  });

  $effect(() => {
    if (!paletteOpen) return;
    function onDocClick(e) {
      if (popoverEl?.contains(e.target)) return;
      if (paletteBtnEl?.contains(e.target)) return;
      paletteOpen = false;
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        paletteOpen = false;
        paletteBtnEl?.focus();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  });

  function toggleVariant() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('defter-theme', next); } catch {}
    theme = next;
  }

  function selectPalette(id) {
    document.documentElement.dataset.themeName = id;
    try { localStorage.setItem('defter-theme-name', id); } catch {}
    themeName = id;
    /* Keep the dial open so the user can keep dialling — the centre
       updates in place, which is the whole point of the radial picker. */
  }

  function togglePin() {
    if (bus.anyPinned) unpinAll(); else pinAll();
  }
</script>

{#if mounted}
  <div class="theme-bar" role="group" aria-label="Theme controls">
    {#if bus.total > 0}
      <button
        type="button"
        class="theme-btn pin"
        class:is-on={bus.anyPinned}
        aria-pressed={bus.anyPinned}
        aria-label={bus.anyPinned ? 'Unpin all sidenotes' : 'Pin all sidenotes'}
        title={bus.anyPinned ? 'Unpin all sidenotes' : 'Pin all sidenotes'}
        onclick={togglePin}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 17v5" />
          <path d="M9 10.76V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4.76a2 2 0 0 0 1.11 1.79l1.78.9A2 2 0 0 1 19 15.24V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-.76a2 2 0 0 1 1.11-1.79l1.78-.9A2 2 0 0 0 9 10.76Z" />
        </svg>
      </button>
    {/if}

    <div class="palette-wrap">
      <button
        type="button"
        class="theme-btn palette"
        bind:this={paletteBtnEl}
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        aria-label={`Palette: ${currentLabel}. Open palette picker.`}
        title={`Palette: ${currentLabel}`}
        onclick={() => paletteOpen = !paletteOpen}
      >
        <span class="swatch" style="background:{currentSwatch}" aria-hidden="true"></span>
      </button>

      {#if paletteOpen}
        <div
          class="palette-popover"
          role="dialog"
          aria-label="Choose palette"
          tabindex="-1"
          bind:this={popoverEl}
        >
          <PaletteDial
            palettes={PALETTES}
            value={themeName}
            variant={theme}
            swatchMap={SWATCH}
            onSelect={selectPalette}
          />
        </div>
      {/if}
    </div>

    <button
      type="button"
      class="theme-btn variant"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onclick={toggleVariant}
    >
      {#if theme === 'dark'}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      {/if}
    </button>
  </div>
{/if}

<style>
  .theme-bar {
    position: fixed;
    top: 1rem;
    inset-inline-end: 1rem;
    display: inline-flex;
    gap: 0.4rem;
    z-index: 10;
  }

  .theme-btn {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 50%;
    color: var(--muted);
    cursor: pointer;
    transition: color 200ms ease, border-color 200ms ease, background 200ms ease;
    padding: 0;
    font: inherit;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
  }
  .theme-bar:hover .theme-btn,
  .theme-btn:hover,
  .theme-btn:focus-visible,
  .theme-btn.is-on,
  .theme-btn[aria-expanded="true"] {
    color: var(--fg);
    border-color: var(--rule);
    background: var(--bg);
  }
  .theme-btn:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
  }

  .swatch {
    display: block;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.18);
    flex: 0 0 auto;
  }

  .palette-wrap { position: relative; display: inline-flex; }

  .palette-popover {
    position: absolute;
    top: calc(100% + 0.55rem);
    inset-inline-end: 0;
    padding: 0.7rem;
    background: var(--bg);
    border: 1px solid var(--rule);
    border-radius: 0.85rem;
    box-shadow: 0 10px 28px -10px rgba(0,0,0,0.22), 0 3px 8px -3px rgba(0,0,0,0.10);
    z-index: 11;
    animation: pop-in 140ms ease-out;
  }
  @keyframes pop-in {
    from { opacity: 0; transform: translateY(-3px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-btn { transition: none; }
    .palette-popover { animation: none; }
  }
</style>

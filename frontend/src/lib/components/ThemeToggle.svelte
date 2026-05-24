<script>
  import { bus, pinAll, unpinAll } from '../sidenote-bus.svelte.js';

  let theme = $state('light');
  let themeName = $state('paper');
  let mounted = $state(false);

  const NAMES = ['paper', 'sepia', 'windsor', 'zapier', 'clipboard', 'enveritas', 'salla', 'brave'];
  /* Swatch = the same colour the CSS exposes as --accent for each palette × variant.
     Kept inline (not read from getComputedStyle) so the button reflects the
     *next* palette in the cycle without forcing a paint round-trip. */
  const SWATCH = {
    paper:     { light: '#1E252D', dark: '#D6CFBB' },
    sepia:     { light: '#6b3a12', dark: '#d6a86a' },
    windsor:   { light: '#1e3a8a', dark: '#6ec7ff' },
    zapier:    { light: '#ff4f00', dark: '#ff7a40' },
    clipboard: { light: '#C12A58', dark: '#e84a78' },
    enveritas: { light: '#002060', dark: '#6e8cff' },
    salla:     { light: '#c08a18', dark: '#FFD21E' },
    brave:     { light: '#d9156f', dark: '#ff1893' },
  };
  const nextPaletteName = $derived(NAMES[(NAMES.indexOf(themeName) + 1) % NAMES.length]);
  const currentSwatch = $derived(SWATCH[themeName]?.[theme] ?? '#888');

  $effect(() => {
    const root = document.documentElement;
    theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    themeName = NAMES.includes(root.dataset.themeName) ? root.dataset.themeName : 'paper';
    mounted = true;
  });

  function toggleVariant() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('defter-theme', next); } catch {}
    theme = next;
  }

  function cyclePalette() {
    const idx = NAMES.indexOf(themeName);
    const next = NAMES[(idx + 1) % NAMES.length];
    document.documentElement.dataset.themeName = next;
    try { localStorage.setItem('defter-theme-name', next); } catch {}
    themeName = next;
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
    <button
      type="button"
      class="theme-btn palette"
      aria-label={`Palette: ${themeName}. Click for ${nextPaletteName}.`}
      title={`Palette: ${themeName} → ${nextPaletteName}`}
      onclick={cyclePalette}
    >
      <span class="swatch" style="background:{currentSwatch}" aria-hidden="true"></span>
    </button>
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
  .theme-btn.is-on {
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
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-btn { transition: none; }
  }
</style>

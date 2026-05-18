<script>
  let theme = $state('light');
  let themeName = $state('paper');
  let mounted = $state(false);

  const NAMES = ['paper', 'sepia'];

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
</script>

{#if mounted}
  <div class="theme-bar" role="group" aria-label="Theme controls">
    <button
      type="button"
      class="theme-btn palette"
      aria-label={`Palette: ${themeName}. Click to switch.`}
      title={`Palette: ${themeName}`}
      onclick={cyclePalette}
    >{themeName === 'sepia' ? 'S' : 'P'}</button>
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
    opacity: 0.35;
    transition: opacity 200ms ease, color 200ms ease, border-color 200ms ease, background 200ms ease;
    padding: 0;
    font: inherit;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
  }
  .theme-bar:hover .theme-btn,
  .theme-btn:hover,
  .theme-btn:focus-visible {
    opacity: 1;
    color: var(--fg);
    border-color: var(--rule);
    background: var(--bg);
  }
  .theme-btn:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-btn { transition: none; }
  }
</style>

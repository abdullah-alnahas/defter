<script>
  let theme = $state('light');
  let mounted = $state(false);

  $effect(() => {
    theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    mounted = true;
  });

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('defter-theme', next);
    } catch {}
    theme = next;
  }
</script>

{#if mounted}
  <button
    type="button"
    class="theme-toggle"
    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    onclick={toggle}
  >
    {#if theme === 'dark'}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    {/if}
  </button>
{/if}

<style>
  .theme-toggle {
    position: fixed;
    top: 1rem;
    inset-inline-end: 1rem;
    width: 2.25rem;
    height: 2.25rem;
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
    z-index: 10;
  }

  .theme-toggle:hover,
  .theme-toggle:focus-visible {
    opacity: 1;
    color: var(--fg);
    border-color: var(--rule);
    background: var(--bg);
  }

  .theme-toggle:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle { transition: none; }
  }
</style>

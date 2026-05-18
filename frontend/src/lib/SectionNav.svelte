<script>
  let { headings = [] } = $props();
</script>

{#if headings.length >= 2}
  <div class="snav-zone">
    <nav class="snav" aria-label="Sections">
      <ol>
        {#each headings as h (h.id)}
          <li class="lvl-{h.level}">
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        {/each}
      </ol>
    </nav>
  </div>
{/if}

<style>
  .snav-zone {
    position: fixed;
    top: 4rem;
    inset-inline-start: 0;
    width: 1.5rem;
    height: calc(100vh - 6rem);
    z-index: 15;
  }

  .snav {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    max-height: 100%;
    overflow-y: auto;
    width: 14rem;
    padding: 0.75rem 1rem;
    background: var(--bg);
    border: 1px solid transparent;
    border-radius: 4px;
    opacity: 0;
    transform: translateX(-0.5rem);
    transition: opacity 200ms ease, transform 200ms ease, border-color 200ms ease;
    pointer-events: none;
  }
  /* RTL mirrors translate direction */
  :global([dir='rtl']) .snav { transform: translateX(0.5rem); }

  .snav-zone:hover .snav,
  .snav-zone:focus-within .snav {
    opacity: 1;
    transform: translateX(0);
    border-color: var(--rule);
    pointer-events: auto;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  li { margin: 0 0 0.35rem; }
  .lvl-3 { padding-inline-start: 1rem; font-size: 0.8rem; }

  a {
    color: var(--muted);
    text-decoration: none;
    display: block;
    padding: 0.1rem 0;
  }
  a:hover, a:focus-visible {
    color: var(--fg);
  }
  a:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
  }

  /* hide on narrow viewports — endnote-style affordance not yet built for mobile section nav */
  @media (max-width: 60rem) {
    .snav-zone { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .snav { transition: none; }
  }
</style>

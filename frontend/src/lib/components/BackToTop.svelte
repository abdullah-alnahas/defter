<script>
  /**
   * Back-to-top button — fixed bottom-right.
   * Always visible but dim (muted color); hover/focus brightens + reveals "Back to top" label.
   */
  function onClick(e) {
    e.preventDefault();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
</script>

<button
  type="button"
  class="subtle-btn back-to-top"
  onclick={onClick}
  aria-label="Back to top"
  title="Back to top"
>
  <span class="arrow" aria-hidden="true">↑</span>
  <span class="label">Back to top</span>
</button>

<style>
  .back-to-top {
    position: fixed;
    inset-inline-end: 1.25rem;
    bottom: 1.25rem;
    z-index: 9;
    /* Default state: dim arrow only — label hidden. */
  }
  .back-to-top .label {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
    transition: max-width 220ms ease, opacity 180ms ease;
  }
  .back-to-top:hover .label,
  .back-to-top:focus-visible .label {
    max-width: 8rem;
    opacity: 1;
  }
  .back-to-top .arrow {
    font-size: 1rem;
    line-height: 1;
  }

  @media print {
    .back-to-top { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .back-to-top .label { transition: none; }
  }
</style>

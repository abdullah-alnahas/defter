<script>
  import '../app.css';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import MarginAside from '$lib/components/MarginAside.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  let { children } = $props();
</script>

<a class="skip" href="#main-content">Skip to content</a>

{@render children?.()}

<ThemeToggle />
<MarginAside />
<BackToTop />

<style>
  .skip {
    position: fixed;
    top: -3rem;
    inset-inline-start: 0.5rem;
    background: var(--fg);
    color: var(--bg);
    padding: 0.5rem 0.85rem;
    text-decoration: none;
    border-radius: 4px;
    z-index: 30;
    transition: top 150ms ease;
  }
  .skip:focus {
    top: 0.5rem;
    outline: 2px solid var(--fg);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .skip { transition: none; }
  }
</style>

<script>
  import Link from './Link.svelte';
</script>

<a class="skip" href="#main-content">Skip to content</a>

<div class="nav-zone">
  <nav aria-label="Primary">
    <ul>
      <li><Link to="/">Blog</Link></li>
      <li><Link to="/featured">Featured</Link></li>
      <li><Link to="/p/cv">CV</Link></li>
      <li><a href="https://github.com/abdullah-alnahas" rel="me noopener">GitHub</a></li>
      <li><a href="https://www.linkedin.com/in/abdullah-alnahas" rel="me noopener">LinkedIn</a></li>
      <li><a href="/rss.xml" type="application/rss+xml">RSS</a></li>
    </ul>
  </nav>
</div>

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
  .skip:focus { top: 0.5rem; outline: 2px solid var(--fg); outline-offset: 2px; }

  .nav-zone {
    position: fixed;
    top: 0;
    /* leave a gap for the theme bar in the top-right corner */
    inset-inline-start: 0;
    inset-inline-end: 6rem;
    height: 2.5rem;
    z-index: 20;
  }

  nav {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
    background: var(--bg);
    border-bottom: 1px solid transparent;
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity 200ms ease, transform 200ms ease, border-color 200ms ease;
    pointer-events: none;
  }

  .nav-zone:hover nav,
  .nav-zone:focus-within nav {
    opacity: 1;
    transform: translateY(0);
    border-bottom-color: var(--rule);
    pointer-events: auto;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin: 0;
    padding: 0.6rem 1.25rem;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 0.92rem;
  }

  li { margin: 0; }

  nav :global(a) {
    color: var(--muted);
    text-decoration: none;
    padding: 0.15rem 0.1rem;
    border-bottom: 1px solid transparent;
    transition: color 150ms ease, border-color 150ms ease;
  }

  nav :global(a:hover),
  nav :global(a:focus-visible) {
    color: var(--fg);
    border-bottom-color: var(--rule);
    outline: none;
  }

  nav :global(a:focus-visible) {
    outline: 2px solid var(--fg);
    outline-offset: 3px;
    border-bottom-color: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    .skip, nav { transition: none; }
  }
</style>

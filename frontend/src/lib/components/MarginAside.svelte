<script>
  /**
   * Top navigation bar — primary site links.
   * NOT sticky: scrolls away with the page so reading isn't crowded by chrome
   * (theme toggle stays fixed for quick palette / variant flips). Earlier
   * this was a fixed left-margin aside; the page now uses a top bar instead,
   * matching the pg-reader reading layout where the navigation sits above the
   * article and the page itself is the focal point.
   * (Pin/Unpin-all sidenote toggle lives in ThemeToggle bar.)
   */
  import { base } from '$app/paths';
  const links = [
    { href: `${base}/`, label: 'Blog' },
    { href: `${base}/featured`, label: 'Featured' },
    { href: `${base}/p/about`, label: 'About' },
    { href: 'https://github.com/abdullah-alnahas', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/abdullah-al-nahas-537bb967/', label: 'LinkedIn', external: true },
    { href: `${base}/rss.xml`, label: 'RSS', type: 'application/rss+xml' },
  ];
</script>

<nav class="top-nav" aria-label="Site navigation">
  <ul>
    {#each links as l (l.href)}
      <li>
        <a
          href={l.href}
          target={l.external ? '_blank' : undefined}
          rel={l.external ? 'me noopener noreferrer external' : undefined}
          type={l.type}
        >{l.label}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .top-nav {
    /* In-flow at the top of the page — explicitly NOT sticky. Right padding
       leaves room for the fixed theme-bar (top:1rem, right:1rem) so the
       last nav link never tucks beneath the palette button. */
    padding: 1rem 7rem 1.25rem 1.25rem;
    border-bottom: 1px solid var(--rule);
    background: var(--bg);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.1rem;
    font-size: 0.82rem;
    /* Match the rest of the site UI — pre-fix this was Space Grotesk via an
       override that wasn't loaded. Inherit from body so nav, theme toggle,
       and article chrome read as one family. */
    font-family: inherit;
  }
  li { margin: 0; }
  a {
    color: var(--muted);
    text-decoration: none;
    transition: color 160ms ease;
    border-bottom: 1px solid transparent;
    padding-bottom: 1px;
  }
  a:hover,
  a:focus-visible {
    color: var(--fg);
    border-bottom-color: var(--rule);
  }
  a:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
    border-bottom-color: transparent;
  }

  @media (max-width: 40rem) {
    .top-nav { padding: 0.85rem 1rem 0.6rem; }
    ul { gap: 0.85rem; font-size: 0.78rem; }
  }

  @media print {
    .top-nav { display: none; }
  }
</style>

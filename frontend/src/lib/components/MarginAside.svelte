<script>
  /**
   * Left-margin aside — primary nav links.
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

<aside class="margin-aside" aria-label="Site navigation">
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
</aside>

<style>
  .margin-aside {
    position: fixed;
    top: 4rem;
    inset-inline-start: 1.25rem;
    width: 9rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    z-index: 9;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.82rem;
    text-align: start;
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

  /* Hide aside on very narrow viewports — nav is still reachable via the inline page list links. */
  @media (max-width: 56rem) {
    .margin-aside { display: none; }
  }

  @media print {
    .margin-aside { display: none; }
  }
</style>

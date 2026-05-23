<script>
  /**
   * Right-margin aside — always visible.
   * Holds the primary nav links + the global Pin/Unpin-all sidenote toggle.
   */
  import { bus, pinAll, unpinAll } from '../sidenote-bus.svelte.js';

  const links = [
    { href: '/', label: 'Blog' },
    { href: '/featured', label: 'Featured' },
    { href: '/p/cv', label: 'CV' },
    { href: 'https://github.com/abdullah-alnahas', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/abdullah-al-nahas-537bb967/', label: 'LinkedIn', external: true },
    { href: '/rss.xml', label: 'RSS', type: 'application/rss+xml' },
  ];

  function onToggle() {
    if (bus.anyPinned) unpinAll(); else pinAll();
  }
</script>

<aside class="margin-aside" aria-label="Site navigation">
  <ul>
    {#each links as l (l.href)}
      <li>
        <a
          href={l.href}
          rel={l.external ? 'me noopener' : undefined}
          type={l.type}
        >{l.label}</a>
      </li>
    {/each}
  </ul>

  {#if bus.total > 0}
    <button
      type="button"
      class="subtle-btn pin-all"
      class:is-on={bus.anyPinned}
      onclick={onToggle}
      aria-pressed={bus.anyPinned}
      aria-label={bus.anyPinned ? 'Unpin all sidenotes' : 'Pin all sidenotes'}
      title={bus.anyPinned ? 'Unpin all sidenotes' : 'Pin all sidenotes'}
    >{bus.anyPinned ? 'Unpin all' : 'Pin all'}</button>
  {/if}
</aside>

<style>
  .margin-aside {
    position: fixed;
    top: 4rem;
    inset-inline-end: 1.25rem;
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
    text-align: end;
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

  .pin-all { align-self: end; }

  /* Hide aside on very narrow viewports — nav is still reachable via the inline page list links. */
  @media (max-width: 56rem) {
    .margin-aside { display: none; }
  }

  @media print {
    .margin-aside { display: none; }
  }
</style>

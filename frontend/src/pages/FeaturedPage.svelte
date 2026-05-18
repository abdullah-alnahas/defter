<script>
  import Page from '../lib/Page.svelte';
  import Link from '../lib/Link.svelte';

  let { initial = null } = $props();

  let fetched = $state(null);
  let error = $state(null);
  let all = $derived(initial ?? fetched);
  let featured = $derived((all ?? []).filter((p) => p.featured));

  $effect(() => {
    if (initial) return;
    fetch('/api/pages')
      .then((r) => r.json())
      .then((p) => (fetched = p))
      .catch((e) => (error = e.message));
  });
</script>

<Page title="Featured" dir="ltr" lang="en">
  {#if error}
    <p class="muted">Failed to load: {error}</p>
  {:else if all === null}
    <p class="muted">Loading…</p>
  {:else if featured.length === 0}
    <p class="muted">No featured pages yet.</p>
  {:else}
    <ul class="cards">
      {#each featured as p (p.slug)}
        <li class="card" dir={p.dir} lang={p.lang}>
          <h2><Link to={`/p/${p.slug}`}>{p.title}</Link></h2>
          {#if p.tldr}
            <p class="desc">{p.tldr}</p>
          {/if}
          <p class="links">
            <Link to={`/p/${p.slug}`}>Read</Link>
            {#if p.external}
              <a href={p.external} rel="noopener">External ↗</a>
            {/if}
          </p>
        </li>
      {/each}
    </ul>
  {/if}
</Page>

<style>
  .cards {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .card {
    padding: 1.1rem 1.25rem;
    border: 1px solid var(--rule);
    border-radius: 5px;
    background: transparent;
  }
  .card h2 {
    margin: 0 0 0.35rem;
    font-size: 1.15rem;
    font-weight: 500;
  }
  .card h2 :global(a) {
    color: var(--fg);
    text-decoration: none;
  }
  .card h2 :global(a:hover),
  .card h2 :global(a:focus-visible) {
    text-decoration: underline;
  }
  .desc { margin: 0 0 0.5rem; color: var(--muted); font-size: 0.95rem; }
  .links { margin: 0; font-size: 0.92rem; display: flex; gap: 1rem; }
  .links :global(a),
  .links a {
    color: var(--muted);
    text-decoration: none;
  }
  .links :global(a:hover),
  .links a:hover,
  .links :global(a:focus-visible),
  .links a:focus-visible {
    color: var(--fg);
    text-decoration: underline;
  }
  .muted { color: var(--muted); }
</style>

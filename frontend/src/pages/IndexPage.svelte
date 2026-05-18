<script>
  import Page from '../lib/Page.svelte';
  import Link from '../lib/Link.svelte';

  let { initial = null } = $props();

  let fetched = $state(null);
  let error = $state(null);
  let pages = $derived(initial ?? fetched);

  $effect(() => {
    if (initial) return;
    fetch('/api/pages')
      .then((r) => r.json())
      .then((p) => (fetched = p))
      .catch((e) => (error = e.message));
  });
</script>

<Page title="Pages" dir="ltr" lang="en">
  {#if error}
    <p class="muted">Failed to load: {error}</p>
  {:else if pages === null}
    <p class="muted">Loading…</p>
  {:else if pages.length === 0}
    <p class="muted">No pages yet.</p>
  {:else}
    <ul class="page-list">
      {#each pages as p (p.slug)}
        <li dir={p.dir} lang={p.lang}>
          <Link to={`/p/${p.slug}`}>{p.title}</Link>
          <time datetime={p.date}>{p.date}</time>
        </li>
      {/each}
    </ul>
  {/if}
</Page>

<style>
  .page-list { list-style: none; padding: 0; margin: 0; }
  .page-list li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--rule);
  }
  .page-list li:last-child { border-bottom: none; }
  time { color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
  .muted { color: var(--muted); }
</style>

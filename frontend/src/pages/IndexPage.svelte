<script>
  import Page from '../lib/Page.svelte';
  import Link from '../lib/Link.svelte';

  let { initial = null } = $props();

  let fetched = $state(null);
  let error = $state(null);
  let pages = $derived(initial ?? fetched);
  let picked = $derived((pages ?? []).filter((p) => p.featured));
  let recent = $derived((pages ?? []).slice(0, 3));
  let all = $derived(pages ?? []);

  $effect(() => {
    if (initial) return;
    fetch('/api/pages')
      .then((r) => r.json())
      .then((p) => (fetched = p))
      .catch((e) => (error = e.message));
  });

  function row(p) {
    return p;
  }
</script>

<Page title="" dir="ltr" lang="en">
  {#if error}
    <p class="muted">Failed to load: {error}</p>
  {:else if pages === null}
    <p class="muted">Loading…</p>
  {:else if pages.length === 0}
    <p class="muted">No pages yet.</p>
  {:else}
    {#if picked.length > 0}
      <section class="block">
        <h2 class="block-h">Picked</h2>
        <ul class="page-list">
          {#each picked as p (p.slug)}
            <li dir={p.dir} lang={p.lang}>
              <Link to={`/p/${p.slug}`}>{p.title}</Link>
              <time datetime={p.date}>{p.date}</time>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    <section class="block">
      <h2 class="block-h">Recent</h2>
      <ul class="page-list">
        {#each recent as p (p.slug)}
          <li dir={p.dir} lang={p.lang}>
            <Link to={`/p/${p.slug}`}>{p.title}</Link>
            <time datetime={p.date}>{p.date}</time>
          </li>
        {/each}
      </ul>
    </section>

    {#if all.length > recent.length}
      <section class="block">
        <h2 class="block-h">All</h2>
        <ul class="page-list">
          {#each all as p (p.slug)}
            <li dir={p.dir} lang={p.lang}>
              <Link to={`/p/${p.slug}`}>{p.title}</Link>
              <time datetime={p.date}>{p.date}</time>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</Page>

<style>
  .block { margin: 0 0 2.5rem; }
  .block:last-child { margin-bottom: 0; }
  .block-h {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 0.8rem;
  }
  .page-list { list-style: none; padding: 0; margin: 0; }
  .page-list li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.55rem 0;
    border-bottom: 1px solid var(--rule);
  }
  .page-list li:last-child { border-bottom: none; }
  time { color: var(--muted); font-size: 0.88rem; font-variant-numeric: tabular-nums; }
  .muted { color: var(--muted); }
</style>

<script>
  import Page from '$lib/components/Page.svelte';
  import { page } from '$app/state';
  let { data } = $props();
  const pages = $derived(data.pages);
  const picked = $derived(pages.filter((p) => p.featured));
  const recent = $derived(pages.slice(0, 3));
  const all = $derived(pages);
  const canonical = $derived(page.url.href);
</script>

<svelte:head>
  <title>defter — دفتر</title>
  <meta name="description" content="A personal notebook. Blog posts, projects, and notes." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="defter — دفتر" />
  <meta property="og:description" content="A personal notebook. Blog posts, projects, and notes." />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title="" dir="ltr" lang="en">
  {#if pages.length === 0}
    <p class="muted">No pages yet.</p>
  {:else}
    {#if picked.length > 0}
      <section class="block">
        <h2 class="block-h">Picked</h2>
        <ul class="page-list">
          {#each picked as p (p.slug)}
            <li dir={p.dir} lang={p.lang}>
              <a href={`/p/${p.slug}`}>{p.title}</a>
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
            <a href={`/p/${p.slug}`}>{p.title}</a>
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
              <a href={`/p/${p.slug}`}>{p.title}</a>
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
  .page-list a { color: var(--fg); text-decoration: none; }
  .page-list a:hover, .page-list a:focus-visible { text-decoration: underline; }
  time { color: var(--muted); font-size: 0.88rem; font-variant-numeric: tabular-nums; }
  .muted { color: var(--muted); }
</style>

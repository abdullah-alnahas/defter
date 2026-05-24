<script>
  import Page from '$lib/components/Page.svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  let { data } = $props();
  const pages = $derived(data.pages);
  const picked = $derived(pages.filter((p) => p.featured));
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
            <li>
              <a href={`${base}/p/${p.slug}`} dir={p.dir} lang={p.lang}>{p.title}</a>
              <time datetime={p.date}>{p.date}</time>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    <section class="block">
      <h2 class="block-h">All</h2>
      <ul class="page-list">
        {#each all as p (p.slug)}
          <li>
            <a href={`${base}/p/${p.slug}`} dir={p.dir} lang={p.lang}>{p.title}</a>
            <time datetime={p.date}>{p.date}</time>
          </li>
        {/each}
      </ul>
    </section>
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
  .page-list a {
    color: var(--fg);
    text-decoration: none;
    min-width: 0;
    overflow-wrap: anywhere;
    text-align: start;
  }
  .page-list a:hover, .page-list a:focus-visible { text-decoration: underline; }
  /* Date stays in Latin body font even on Arabic items (li is LTR, but inherit shouldn't switch). */
  time {
    color: var(--muted);
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    font-family: var(--body);
    flex: 0 0 auto;
  }
  .muted { color: var(--muted); }
</style>

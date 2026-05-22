<script>
  import Page from '$lib/components/Page.svelte';
  import { page } from '$app/state';
  let { data } = $props();
  const featured = $derived(data.pages.filter((p) => p.featured));
  const canonical = $derived(page.url.href);
</script>

<svelte:head>
  <title>Featured — defter</title>
  <meta name="description" content="Featured pages: projects, demos, and writing worth surfacing." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Featured — defter" />
  <meta property="og:description" content="Featured pages: projects, demos, and writing worth surfacing." />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title="Featured" dir="ltr" lang="en">
  {#if featured.length === 0}
    <p class="muted">No featured pages yet.</p>
  {:else}
    <ul class="cards">
      {#each featured as p (p.slug)}
        <li class="card" dir={p.dir} lang={p.lang}>
          <h2><a href={`/p/${p.slug}`}>{p.title}</a></h2>
          {#if p.tldr}
            <p class="desc">{p.tldr}</p>
          {/if}
          <p class="links">
            <a href={`/p/${p.slug}`}>Read</a>
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
  .card h2 a { color: var(--fg); text-decoration: none; }
  .card h2 a:hover, .card h2 a:focus-visible { text-decoration: underline; }
  .desc { margin: 0 0 0.5rem; color: var(--muted); font-size: 0.95rem; }
  .links { margin: 0; font-size: 0.92rem; display: flex; gap: 1rem; }
  .links a { color: var(--muted); text-decoration: none; }
  .links a:hover, .links a:focus-visible { color: var(--fg); text-decoration: underline; }
  .muted { color: var(--muted); }
</style>

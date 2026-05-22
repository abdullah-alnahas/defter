<script>
  import Page from '$lib/components/Page.svelte';
  import Sidenotes from '$lib/components/Sidenotes.svelte';
  import { page } from '$app/state';
  let { data } = $props();
  const p = $derived(data.page);
  const canonical = $derived(page.url.href);
</script>

<svelte:head>
  <title>{p.title} — defter</title>
  <meta name="description" content={p.description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={`${p.title} — defter`} />
  <meta property="og:description" content={p.description} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title={p.title} dir={p.dir} lang={p.lang} tldr={p.tldr} headings={p.headings}>
  {@html p.body}
</Page>

<Sidenotes footnoteMap={p.footnoteMap} />

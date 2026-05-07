<script>
  import { marked } from 'marked';
  import Page from '../lib/Page.svelte';

  let { slug } = $props();

  let pagePromise = $derived(
    fetch(`/api/pages/${slug}`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
  );
</script>

{#await pagePromise}
  <Page title="" dir="ltr" lang="en">
    <p class="muted">Loading…</p>
  </Page>
{:then p}
  <Page title={p.title} dir={p.dir} lang={p.lang}>
    {@html marked.parse(p.body)}
  </Page>
{:catch err}
  <Page title="Not found" dir="ltr" lang="en">
    <p class="muted">{err.message}</p>
  </Page>
{/await}

<style>
  .muted { color: var(--muted); }
</style>

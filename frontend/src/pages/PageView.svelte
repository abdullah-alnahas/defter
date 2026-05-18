<script>
  import Page from '../lib/Page.svelte';

  let { slug, initial = null } = $props();

  function deriveHeadings(html) {
    if (!html) return [];
    const pattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    return [...html.matchAll(pattern)].map((g) => ({
      level: parseInt(g[1], 10),
      id: g[2],
      text: g[3].replace(/<[^>]+>/g, '').trim(),
    }));
  }

  let fetched = $state(null);
  let fetchedSlug = $state(null);
  let error = $state(null);

  let page = $derived(
    initial && initial.slug === slug ? initial : fetchedSlug === slug ? fetched : null
  );

  $effect(() => {
    if (initial && initial.slug === slug) return;
    if (fetchedSlug === slug && fetched) return;
    const requested = slug;
    error = null;
    fetch(`/api/pages/${requested}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((p) => {
        if (slug === requested) {
          fetched = p;
          fetchedSlug = requested;
        }
      })
      .catch((e) => {
        if (slug === requested) error = e.message;
      });
  });
</script>

{#if error}
  <Page title="Not found" dir="ltr" lang="en">
    <p class="muted">{error}</p>
  </Page>
{:else if !page}
  <Page title="" dir="ltr" lang="en">
    <p class="muted">Loading…</p>
  </Page>
{:else}
  <Page title={page.title} dir={page.dir} lang={page.lang} tldr={page.tldr ?? null} headings={page.headings ?? deriveHeadings(page.body)}>
    {@html page.body}
  </Page>
{/if}

<style>
  .muted { color: var(--muted); }
</style>

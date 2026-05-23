<script>
  import Page from '$lib/components/Page.svelte';
  import { page } from '$app/state';
  const canonical = $derived(page.url.href);
</script>

<svelte:head>
  <title>CV — defter</title>
  <meta name="description" content="CV — profile, roles, projects, publications, education." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="CV — defter" />
  <meta property="og:description" content="CV — profile, roles, projects, publications, education." />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title="CV" lang="en" dir="ltr">
  <p class="placeholder">
    This page is reserved for the CV. The component lives at
    <code>frontend/src/routes/p/cv/+page.svelte</code> — replace this placeholder with the
    real content (or wire it to a structured data source).
  </p>

  <h2>Outline</h2>
  <ul>
    <li>Profile · contact · pronouns / niyyah</li>
    <li>Roles · projects · publications</li>
    <li>Education · languages · references</li>
  </ul>
</Page>

<style>
  .placeholder {
    color: var(--muted);
    border-inline-start: 3px solid var(--rule);
    padding-inline-start: 0.9rem;
    margin: 0 0 1.5rem;
  }
  code {
    font-size: 0.92em;
    color: var(--fg);
    background: var(--rule);
    padding: 0.05em 0.3em;
    border-radius: 3px;
  }
</style>

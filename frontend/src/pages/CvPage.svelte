<script>
  import Page from '../lib/Page.svelte';
</script>

<Page title="CV" lang="en" dir="ltr">
  <p class="placeholder">
    This page is reserved for the CV. The component lives at
    <code>frontend/src/pages/CvPage.svelte</code> — replace this placeholder with the
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
    background: var(--rule);
    padding: 0.05em 0.3em;
    border-radius: 3px;
  }
</style>

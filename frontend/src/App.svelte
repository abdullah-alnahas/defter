<script>
  import './app.css';
  import { router } from './lib/router.svelte.js';
  import IndexPage from './pages/IndexPage.svelte';
  import PageView from './pages/PageView.svelte';

  let slug = $derived(
    router.path.startsWith('/p/') ? router.path.slice(3) : null
  );
</script>

{#if slug}
  <PageView {slug} />
{:else}
  <IndexPage />
{/if}

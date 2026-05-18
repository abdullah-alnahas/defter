<script>
  import './app.css';
  import { router } from './lib/router.svelte.js';
  import IndexPage from './pages/IndexPage.svelte';
  import PageView from './pages/PageView.svelte';
  import ThemeToggle from './lib/ThemeToggle.svelte';
  import Nav from './lib/Nav.svelte';

  let { data = {} } = $props();

  let slug = $derived(
    router.path.startsWith('/p/') ? router.path.slice(3) : null
  );
</script>

<Nav />

{#if slug}
  <PageView {slug} initial={data.page} />
{:else}
  <IndexPage initial={data.pages} />
{/if}

<ThemeToggle />

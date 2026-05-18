<script>
  import './app.css';
  import { router } from './lib/router.svelte.js';
  import IndexPage from './pages/IndexPage.svelte';
  import PageView from './pages/PageView.svelte';
  import FeaturedPage from './pages/FeaturedPage.svelte';
  import CvPage from './pages/CvPage.svelte';
  import ThemeToggle from './lib/ThemeToggle.svelte';
  import Nav from './lib/Nav.svelte';

  let { data = {} } = $props();

  let slug = $derived(
    router.path.startsWith('/p/') ? router.path.slice(3) : null
  );
  let isFeatured = $derived(router.path === '/featured');
  let isCv = $derived(slug === 'cv');
</script>

<Nav />

{#if isCv}
  <CvPage />
{:else if slug}
  <PageView {slug} initial={data.page} />
{:else if isFeatured}
  <FeaturedPage initial={data.pages} />
{:else}
  <IndexPage initial={data.pages} />
{/if}

<ThemeToggle />

<!-- /p/cv → /p/about (308). See +page.js. This file exists only so SvelteKit
     keeps the route registered during prerender. -->
<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <meta http-equiv="refresh" content={`0; url=${base}/p/about`} />
  <link rel="canonical" href={`${base}/p/about`} />
  <title>Redirecting…</title>
</svelte:head>

<p>Redirecting to <a href={`${base}/p/about`}>about</a>…</p>

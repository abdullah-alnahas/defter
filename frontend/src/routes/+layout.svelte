<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  let { children } = $props();
</script>

<Nav />
{@render children?.()}
<ThemeToggle />

<script>
  import { router } from './router.svelte.js';
  let { to, children, ...rest } = $props();

  function onclick(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.navigate(to);
  }
</script>

<a href={to} {onclick} {...rest}>{@render children?.()}</a>

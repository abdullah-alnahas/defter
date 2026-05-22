<script>
  import { sidenotes, unpin, clearPins } from '../sidenotes.svelte.js';
  const pinned = $derived(sidenotes.pinned);
  const hover = $derived(sidenotes.hover);
</script>

{#if pinned.length > 0}
  <aside class="fn-margin-stack" aria-label="Pinned footnotes">
    <div class="fn-stack-header">
      <span>Pinned ({pinned.length})</span>
      <button type="button" class="fn-stack-clear" onclick={clearPins} aria-label="Clear all pinned footnotes">Clear all</button>
    </div>
    {#each pinned as p (p.key)}
      <div class="fn-pin">
        <div class="fn-pin-head">
          <span class="sn-num">{p.num}.</span>
          <button type="button" class="fn-pin-unpin" onclick={() => unpin(p.key)} aria-label={`Unpin footnote ${p.num}`}>unpin ✕</button>
        </div>
        <div class="fn-pin-body">{@html p.html}</div>
      </div>
    {/each}
  </aside>
{/if}

{#if hover && !pinned.some((p) => p.key === hover.key)}
  <div class="fn-hover-preview" role="note" style="left: {hover.x}px; top: {hover.y}px;">
    <span class="sn-num">{hover.num}.</span>
    <span>{@html hover.html}</span>
  </div>
{/if}

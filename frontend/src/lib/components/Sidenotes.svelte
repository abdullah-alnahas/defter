<script>
  /**
   * Sidenotes — per-ref margin slot + TL;DR slot.
   *
   * For each <sup.fn-ref> in the article body, create an invisible <div.sn-margin>
   * absolutely positioned inside `.sn-margin-col` at the ref's Y coordinate.
   * Float down to avoid collision with the previous note.
   *
   * Interaction (same for sidenotes and TL;DR):
   *   - hover ref OR hover note → reveal (opacity 0 → 1)
   *   - click ref/button        → pin (stays revealed)
   *   - click again             → unpin
   *   - Esc                     → clear all pins
   *
   * Endnote section (rendered by marked-footnote) is untouched.
   */
  import { onMount } from 'svelte';
  import { configure, setBus, reset } from '../sidenote-bus.svelte.js';

  /** @type {{ footnoteMap: Record<string, {num:string,html:string}>, tldr: string|null }} */
  let { footnoteMap = {}, tldr = null } = $props();

  let marginEl;

  function buildNoteEl({ tldrText, num, html }) {
    const note = document.createElement('aside');
    note.className = tldrText != null ? 'sn-margin is-tldr' : 'sn-margin';
    note.setAttribute('role', 'note');
    if (tldrText != null) {
      const label = document.createElement('span');
      label.className = 'sn-label';
      label.textContent = 'TL;DR';
      note.appendChild(label);
      const p = document.createElement('p');
      p.textContent = tldrText;
      note.appendChild(p);
    } else {
      if (num) {
        const n = document.createElement('span');
        n.className = 'sn-num';
        n.textContent = `${num}.`;
        note.appendChild(n);
        note.appendChild(document.createTextNode(' '));
      }
      const range = document.createRange();
      note.appendChild(range.createContextualFragment(html));
    }
    return note;
  }

  /** @type {Array<{ref:Element,note:HTMLElement,hovered:boolean,pinned:boolean}>} */
  let groups = [];

  function update(g) {
    const vis = g.hovered || g.pinned;
    g.note.classList.toggle('is-visible', vis);
    g.ref.classList.toggle('is-active', vis);
    g.ref.classList.toggle('is-pinned', g.pinned);
    if (g.ref.tagName === 'BUTTON') {
      g.ref.classList.toggle('is-on', g.pinned);
    }
    publishBus();
  }

  function publishBus() {
    const anyPinned = groups.some((g) => g.pinned);
    setBus({ total: groups.length, anyPinned });
  }

  function attach(ref, note) {
    const g = { ref, note, hovered: false, pinned: false };
    const setHover = (on) => { g.hovered = on; update(g); };
    ref.addEventListener('pointerenter', () => setHover(true));
    ref.addEventListener('pointerleave', () => setHover(false));
    ref.addEventListener('focusin', () => setHover(true));
    ref.addEventListener('focusout', () => setHover(false));
    note.addEventListener('pointerenter', () => setHover(true));
    note.addEventListener('pointerleave', () => setHover(false));
    ref.addEventListener('click', (e) => {
      e.preventDefault();
      g.pinned = !g.pinned;
      update(g);
    });
    ref.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        g.pinned = !g.pinned;
        update(g);
      }
    });
    return g;
  }

  function layout() {
    if (!marginEl) return;
    const isStacked = marginEl.classList.contains('is-stacked');
    if (isStacked) {
      marginEl.style.minHeight = '';
      for (const g of groups) {
        g.note.style.position = 'relative';
        g.note.style.top = '';
        g.note.style.marginBottom = '0.75rem';
        g.note.style.paddingInlineStart = '0.9rem';
        g.note.style.borderInlineStart = '2px solid var(--rule)';
      }
      return;
    }

    const containerRect = marginEl.getBoundingClientRect();
    const ordered = [...groups].sort((a, b) =>
      a.ref.getBoundingClientRect().top - b.ref.getBoundingClientRect().top
    );
    let lastBottom = 0;
    for (const g of ordered) {
      g.note.style.position = 'absolute';
      g.note.style.marginBottom = '';
      g.note.style.paddingInlineStart = '';
      g.note.style.borderInlineStart = '';
      const refRect = g.ref.getBoundingClientRect();
      const desiredTop = refRect.top - containerRect.top;
      const top = Math.max(desiredTop, lastBottom + 14);
      g.note.style.top = `${top}px`;
      lastBottom = top + g.note.offsetHeight;
    }
    marginEl.style.minHeight = `${Math.max(0, lastBottom)}px`;
  }

  function applyMode() {
    if (!marginEl) return;
    const stacked = window.matchMedia('(max-width: 56rem)').matches;
    marginEl.classList.toggle('is-stacked', stacked);
  }

  function clearAll() {
    for (const g of groups) { g.pinned = false; g.hovered = false; update(g); }
  }
  function pinAll() {
    for (const g of groups) { g.pinned = true; update(g); }
  }

  onMount(() => {
    if (!marginEl) return;

    // Footnote refs
    const refs = Array.from(document.querySelectorAll('sup.fn-ref'));
    for (const ref of refs) {
      const id = ref.getAttribute('data-fn-id');
      const entry = footnoteMap[id];
      if (!entry) continue;
      const note = buildNoteEl({ num: entry.num, html: entry.html });
      marginEl.appendChild(note);
      groups.push(attach(ref, note));
    }

    // TL;DR — bound to the [data-tldr-trigger] button in the title row.
    if (tldr) {
      const trigger = document.querySelector('[data-tldr-trigger]');
      if (trigger) {
        const note = buildNoteEl({ tldrText: tldr });
        marginEl.appendChild(note);
        groups.push(attach(trigger, note));
      }
    }

    configure({ pinAll, unpinAll: clearAll });
    publishBus();

    applyMode();
    layout();

    const onResize = () => { applyMode(); layout(); };
    window.addEventListener('resize', onResize, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('load', layout, { once: true });

    const onKey = (e) => { if (e.key === 'Escape') clearAll(); };
    document.addEventListener('keydown', onKey);

    const ro = new ResizeObserver(layout);
    const article = document.querySelector('#main-content article');
    if (article) ro.observe(article);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      ro.disconnect();
      reset();
    };
  });
</script>

<div class="sn-margin-col" bind:this={marginEl} aria-hidden="true"></div>

<script>
  import { onMount } from 'svelte';
  import MarginNotes from './MarginNotes.svelte';
  import {
    sidenotes,
    togglePin,
    showHover,
    hideHover,
    clearPins,
    isPinned,
  } from '../sidenotes.svelte.js';

  /** @type {{ footnoteMap: Record<string, {num:string,html:string}> }} */
  let { footnoteMap = {} } = $props();

  function occurrenceIdFor(ref) {
    const id = ref.getAttribute('data-fn-id');
    const sameRefs = document.querySelectorAll(`sup.fn-ref[data-fn-id="${CSS.escape(id)}"]`);
    let idx = 0;
    for (const node of sameRefs) {
      if (node === ref) return `o${idx}`;
      idx++;
    }
    return 'o0';
  }

  function entryFor(ref) {
    const id = ref.getAttribute('data-fn-id');
    const entry = footnoteMap[id];
    if (!entry) return null;
    return { id, occ: occurrenceIdFor(ref), num: entry.num, html: entry.html };
  }

  function isNarrow() {
    return window.matchMedia('(max-width: 69.99rem)').matches;
  }

  function clearInlineExpansions() {
    document.querySelectorAll('.fn-inline').forEach((n) => n.remove());
  }

  /** Build DOM fragment from a trusted HTML string (markdown source is ours). */
  function fragmentFromTrustedHtml(html) {
    const range = document.createRange();
    return range.createContextualFragment(html);
  }

  function renderInlineUnder(ref, { id, num, html }) {
    const existing = ref.parentElement?.querySelector(`.fn-inline[data-fn-id="${CSS.escape(id)}"]`);
    if (existing) { existing.remove(); return; }
    clearInlineExpansions();
    const block = document.createElement('aside');
    block.className = 'fn-inline';
    block.setAttribute('data-fn-id', id);
    block.setAttribute('role', 'note');
    const numEl = document.createElement('span');
    numEl.className = 'sn-num';
    numEl.textContent = `${num}.`;
    block.appendChild(numEl);
    block.appendChild(document.createTextNode(' '));
    block.appendChild(fragmentFromTrustedHtml(html));
    ref.insertAdjacentElement('afterend', block);
  }

  function refreshActiveMarks() {
    document.querySelectorAll('sup.fn-ref').forEach((ref) => {
      const id = ref.getAttribute('data-fn-id');
      const occ = occurrenceIdFor(ref);
      ref.classList.toggle('is-pinned', isPinned(id, occ));
    });
  }

  function onPointerOver(e) {
    const ref = e.target.closest && e.target.closest('sup.fn-ref');
    if (!ref || isNarrow()) return;
    const entry = entryFor(ref);
    if (!entry) return;
    const rect = ref.getBoundingClientRect();
    showHover({ ...entry, x: rect.left, y: rect.bottom + 6 });
    ref.classList.add('is-active');
  }

  function onPointerOut(e) {
    const ref = e.target.closest && e.target.closest('sup.fn-ref');
    if (!ref) return;
    hideHover();
    ref.classList.remove('is-active');
  }

  function onFocusIn(e) {
    const ref = e.target.closest && e.target.closest('sup.fn-ref');
    if (!ref || isNarrow()) return;
    const entry = entryFor(ref);
    if (!entry) return;
    const rect = ref.getBoundingClientRect();
    showHover({ ...entry, x: rect.left, y: rect.bottom + 6 });
    ref.classList.add('is-active');
  }

  function onFocusOut(e) {
    const ref = e.target.closest && e.target.closest('sup.fn-ref');
    if (!ref) return;
    hideHover();
    ref.classList.remove('is-active');
  }

  function onClick(e) {
    const a = e.target.closest && e.target.closest('sup.fn-ref a[data-footnote-ref]');
    if (!a) return;
    const ref = a.closest('sup.fn-ref');
    if (!ref) return;
    e.preventDefault();
    const entry = entryFor(ref);
    if (!entry) return;
    if (isNarrow()) {
      renderInlineUnder(ref, entry);
      return;
    }
    const rect = ref.getBoundingClientRect();
    const anchorY = window.scrollY + rect.top;
    togglePin({ ...entry, anchorY });
    refreshActiveMarks();
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      clearPins();
      hideHover();
      clearInlineExpansions();
      refreshActiveMarks();
    }
  }

  onMount(() => {
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  });

  $effect(() => {
    void sidenotes.pinned;
    if (typeof document !== 'undefined') refreshActiveMarks();
  });
</script>

<MarginNotes />

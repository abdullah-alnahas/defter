/**
 * Sidenote state. Reset on navigation. Two surfaces:
 *   - ephemeral hover preview (one slot, replaced on each hover)
 *   - pinned stack sorted by document Y position
 *
 * Identity is `${id}#${occurrenceId}` so the same footnote label
 * opened twice produces two separate pins (per-occurrence identity).
 */

const state = $state({
  /** @type {Array<{key:string,id:string,occ:string,num:string,html:string,anchorY:number}>} */
  pinned: [],
  /** @type {null|{key:string,id:string,occ:string,num:string,html:string,x:number,y:number}} */
  hover: null,
});

export const sidenotes = state;

export function makeKey(id, occ) { return `${id}#${occ}`; }

export function togglePin({ id, occ, num, html, anchorY }) {
  const key = makeKey(id, occ);
  if (state.pinned.some((p) => p.key === key)) {
    state.pinned = state.pinned.filter((p) => p.key !== key);
  } else {
    state.pinned = [...state.pinned, { key, id, occ, num, html, anchorY }]
      .sort((a, b) => a.anchorY - b.anchorY);
  }
}

export function unpin(key) {
  state.pinned = state.pinned.filter((p) => p.key !== key);
}

export function clearPins() {
  state.pinned = [];
}

export function isPinned(id, occ) {
  return state.pinned.some((p) => p.key === makeKey(id, occ));
}

export function showHover({ id, occ, num, html, x, y }) {
  state.hover = { key: makeKey(id, occ), id, occ, num, html, x, y };
}

export function hideHover() {
  state.hover = null;
}

export function resetAll() {
  state.pinned = [];
  state.hover = null;
}

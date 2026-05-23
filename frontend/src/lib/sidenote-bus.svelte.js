/**
 * Tiny pub/sub between Sidenotes (per-page) and MarginAside (global).
 *
 *   - Sidenotes calls `configure({ pinAll, unpinAll })` and `setBus({ total, anyPinned })`
 *     so the aside knows when to render the toggle and which label to show.
 *   - MarginAside reads `bus` reactively (runes) and calls `pinAll()` / `unpinAll()`.
 */

let pinAllImpl = () => {};
let unpinAllImpl = () => {};

export const bus = $state({ total: 0, anyPinned: false });

export function configure({ pinAll, unpinAll }) {
  pinAllImpl = pinAll || (() => {});
  unpinAllImpl = unpinAll || (() => {});
}

export function setBus(next) {
  Object.assign(bus, next);
}

export function pinAll() { pinAllImpl(); }
export function unpinAll() { unpinAllImpl(); }

export function reset() {
  pinAllImpl = () => {};
  unpinAllImpl = () => {};
  bus.total = 0;
  bus.anyPinned = false;
}

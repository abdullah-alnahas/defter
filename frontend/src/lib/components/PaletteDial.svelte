<script>
  /**
   * Radial palette picker. Renders N dots around the circumference of an
   * invisible circle, with the currently-selected palette mirrored as a
   * large swatch + label at the centre. A thin arm connects the centre to
   * the active dot. Click a dot → fire onSelect(id); centre + arm follow
   * immediately.
   *
   * Props
   *   palettes  — [{ id, label, swatch? }]
   *   value     — currently-selected palette id
   *   variant   — 'light' | 'dark' (controls which swatch hue to render)
   *   swatchMap — { id: { light: color, dark: color } }
   *   onSelect  — (id) => void
   *   radius    — px (default 78)
   *   dot       — px diameter (default 22)
   *   showLabel — boolean (default true), turn off to hide centre label
   */
  let {
    palettes,
    value,
    variant = 'light',
    swatchMap,
    onSelect,
    radius = 78,
    dot = 22,
    showLabel = true,
  } = $props();

  const positions = $derived.by(() => {
    const n = palettes.length;
    return palettes.map((p, i) => {
      const angleDeg = -90 + (360 / n) * i;
      const angleRad = angleDeg * (Math.PI / 180);
      return {
        ...p,
        x: Math.cos(angleRad) * radius,
        y: Math.sin(angleRad) * radius,
        angleDeg,
      };
    });
  });

  /* Target angle of the active palette in degrees. We accumulate this into
     `armAngle` so the arm always rotates by the shortest signed delta —
     without that, going from mono (i = last) back to paper (i = 0) would
     animate almost a full revolution instead of one step backwards. */
  const targetAngle = $derived.by(() => {
    const i = palettes.findIndex((p) => p.id === value);
    if (i < 0) return null;
    return -90 + (360 / palettes.length) * i;
  });

  let armAngle = $state(null);
  $effect(() => {
    const t = targetAngle;
    if (t === null) return;
    if (armAngle === null) {
      armAngle = t;
      return;
    }
    /* Normalise (t - current) to the [-180, 180] interval, then add the
       delta to the *cumulative* rotation. The CSS transform will animate
       the short way round every time. */
    const delta = ((t - armAngle) % 360 + 540) % 360 - 180;
    armAngle = armAngle + delta;
  });

  function swatchFor(id) {
    const entry = swatchMap?.[id];
    if (entry && typeof entry === 'object') return entry[variant] ?? entry.light ?? '#888';
    const p = palettes.find((pp) => pp.id === id);
    return p?.swatch ?? '#888';
  }

  const currentSwatch = $derived(swatchFor(value));
  const currentLabel  = $derived(palettes.find((p) => p.id === value)?.label ?? '');

  /* Arm length: from the edge of the centre swatch (1.2rem radius) to the
     near edge of the active dot (radius minus half-dot minus a hair of gap).
     Kept in CSS so it can read from --radius / --dot / --center-r. */
</script>

<div
  class="dial-stage"
  style="--radius:{radius}px; --dot:{dot}px;"
>
  {#if armAngle !== null}
    <div
      class="dial-arm"
      style="transform: rotate({armAngle}deg);"
      aria-hidden="true"
    ></div>
  {/if}

  <div class="dial-center">
    <span class="center-swatch" style="background:{currentSwatch}" aria-hidden="true"></span>
    {#if showLabel}
      <span class="center-label">{currentLabel}</span>
    {/if}
  </div>

  {#each positions as p (p.id)}
    <button
      type="button"
      class="dial-dot"
      class:is-active={p.id === value}
      aria-label={p.label}
      aria-pressed={p.id === value}
      title={p.label}
      style="transform: translate({p.x}px, {p.y}px);"
      onclick={() => onSelect?.(p.id)}
    >
      <span
        class="dot-swatch"
        style="background:{swatchFor(p.id)}"
        aria-hidden="true"
      ></span>
    </button>
  {/each}
</div>

<style>
  .dial-stage {
    /* Half-width of the centre swatch — used to start the arm at the edge
       of the centre and end it at the inside of the active dot. */
    --center-r: 1.2rem;

    position: relative;
    width: calc(2 * var(--radius) + var(--dot) + 1.4rem);
    height: calc(2 * var(--radius) + var(--dot) + 1.4rem);
    margin: 0 auto;
  }

  /* Arm pivots at the centre of the stage and is sized to span exactly
     from the outer edge of the centre swatch to the inner edge of the
     chosen dot — so it visually connects the two nearest border points
     and nothing more. The element itself is the line; no gradient
     masking, so the endpoints are pixel-exact. */
  .dial-arm {
    --arm-w: 2.5px;
    --arm-len: calc(var(--radius) - var(--center-r) - var(--dot) / 2);

    position: absolute;
    top: 50%;
    left: calc(50% + var(--center-r));
    width: var(--arm-len);
    height: var(--arm-w);
    margin-top: calc(var(--arm-w) / -2);
    background: var(--fg);
    opacity: 0.55;
    border-radius: calc(var(--arm-w) / 2);
    /* Pivot around the stage centre, which is offset (-center-r) from
       this element's own left edge. Rotating about that point keeps the
       arm always radiating from the centre swatch's edge. */
    transform-origin: calc(-1 * var(--center-r)) 50%;
    pointer-events: none;
    z-index: 0;
    transition: transform 280ms cubic-bezier(.2,.7,.2,1);
  }

  .dial-center {
    position: absolute;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    pointer-events: none;
    user-select: none;
    z-index: 2;
  }
  .center-swatch {
    width: calc(var(--center-r) * 2);
    height: calc(var(--center-r) * 2);
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.14), 0 1px 6px -2px rgba(0,0,0,0.18);
    transition: background 220ms ease;
  }
  .center-label {
    font-size: 0.74rem;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    /* Label sits below the centre swatch but must stay legible when the arm
       passes underneath. The label paints a tiny halo of --bg so the line
       fades out behind the glyphs even when both share a column. */
    position: relative;
    z-index: 3;
    background: var(--bg);
    padding: 0.05rem 0.4rem;
    border-radius: 999px;
  }

  /* Each dot is anchored to the circle border by its translate() — it must
     NOT scale up on hover or selection, otherwise it would drift outside
     that border. Selection is shown by thickening the dot's own ring; the
     arm provides the second cue. Non-selected dots stay full-opacity so
     the dial reads as a flat colour wheel. */
  .dial-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--dot);
    height: var(--dot);
    margin-top: calc(var(--dot) / -2);
    margin-left: calc(var(--dot) / -2);
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: box-shadow 160ms ease;
  }
  .dial-dot:focus-visible { outline: none; }

  .dial-dot .dot-swatch {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.18);
    transition: box-shadow 160ms ease;
  }
  /* Active state — a thicker inset ring in the page foreground colour,
     framed by a thin halo of --bg so it reads against any swatch hue. The
     ring sits *inside* the dot bounds, leaving the dot's geometric centre
     exactly on the radius (no drift). */
  .dial-dot.is-active .dot-swatch {
    box-shadow:
      inset 0 0 0 2px var(--bg),
      inset 0 0 0 3px var(--fg);
  }
  .dial-dot:focus-visible .dot-swatch {
    box-shadow:
      inset 0 0 0 2px var(--bg),
      inset 0 0 0 3px var(--accent);
  }

  @media (prefers-reduced-motion: reduce) {
    .center-swatch, .dial-dot, .dial-dot .dot-swatch, .dial-arm {
      transition: none;
    }
  }
</style>

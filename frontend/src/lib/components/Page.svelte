<script>
  import SectionNav from './SectionNav.svelte';
  let { title, dir = 'ltr', lang = 'en', tldr = null, headings = [], children } = $props();
  let open = $state(false);
</script>

<SectionNav {headings} />

<main id="main-content">
  <article {dir} {lang}>
    <header class="opening" lang="ar" dir="rtl">
      <p>بسم الله الرحمن الرحيم</p>
      <p>الحمد لله رب العالمين</p>
      <p>وأفضل الصلاة وأتم التسليم على سيدنا محمد وعلى آله وصحبه أجمعين</p>
    </header>

    {#if title}
      <div class="title-row">
        <h1>{title}</h1>
        {#if tldr}
          <button
            type="button"
            class="tldr-btn"
            aria-expanded={open}
            aria-controls="tldr-card"
            onclick={() => (open = !open)}
          >TL;DR</button>
        {/if}
      </div>
      {#if tldr && open}
        <aside id="tldr-card" class="tldr-card" lang="en" dir="ltr">{tldr}</aside>
      {/if}
    {/if}

    <section class="body">
      {@render children?.()}
    </section>

    <footer class="closing" lang="ar" dir="rtl">
      <p class="ayah">﴿سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ * وَسَلَامٌ عَلَى الْمُرْسَلِينَ * وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾</p>
      <p class="salawat">اللّهُمَّ صَلِّ على سيِّدِنا مُحمَّدٍ وعلى آلِ سيِّدِنا مُحمَّدٍ، كَما صَلَّيْتَ على سيِّدِنا إبراهيمَ وعلى آلِ سيِّدِنا إبراهيمَ، إنَّكَ حَميدٌ مَجيدٌ. اللّهُمَّ بارِكْ على سيِّدِنا مُحمَّدٍ وعلى آلِ سيِّدِنا مُحمَّدٍ، كَما بارَكْتَ على سيِّدِنا إبراهيمَ وعلى آلِ سيِّدِنا إبراهيمَ، إنَّكَ حَميدٌ مَجيدٌ.</p>
    </footer>
  </article>
</main>

<style>
  main { display: block; }
  article {
    max-width: var(--measure);
    margin: 4rem auto;
    padding: 0 1.5rem;
  }

  .opening, .closing {
    color: var(--muted);
    text-align: center;
    font-size: 0.95rem;
    line-height: 2;
  }
  .opening p, .closing p { margin: 0; }

  .opening {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--rule);
    margin-bottom: 3rem;
  }

  .closing {
    padding-top: 2rem;
    border-top: 1px solid var(--rule);
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .closing .ayah {
    font-family: var(--quran);
    font-size: 1.5rem;
    line-height: 2.2;
    color: var(--fg);
  }

  .closing .salawat {
    font-size: 1rem;
    line-height: 2;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 500;
    margin: 0;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin: 0 0 2rem;
  }

  /*
   * Default state stays subtle through *color choice* (muted on bg = 6.4:1, passes AA)
   * instead of opacity, because opacity-blended text fails axe color-contrast.
   * Hover/focus brightens to --fg + adds the rule-coloured border.
   */
  .tldr-btn {
    background: transparent;
    border: 1px solid transparent;
    color: var(--muted);
    font: inherit;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    padding: 0.2rem 0.55rem;
    cursor: pointer;
    border-radius: 3px;
    transition: color 180ms ease, border-color 180ms ease;
    flex: 0 0 auto;
  }
  .title-row:hover .tldr-btn,
  .tldr-btn:hover,
  .tldr-btn:focus-visible {
    color: var(--fg);
    border-color: var(--rule);
  }
  .tldr-btn:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 2px;
    border-color: transparent;
  }
  .tldr-btn[aria-expanded='true'] {
    color: var(--fg);
    border-color: var(--rule);
  }

  .tldr-card {
    margin: 0 0 2rem;
    padding: 0.9rem 1.1rem;
    background: var(--rule);
    border-radius: 4px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--fg);
  }

  @media (prefers-reduced-motion: reduce) {
    .tldr-btn { transition: none; }
  }

  .body :global(p) { margin: 0 0 1.2rem; }
</style>

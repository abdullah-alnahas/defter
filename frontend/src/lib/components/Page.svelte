<script>
  import SectionNav from './SectionNav.svelte';
  import Sidenotes from './Sidenotes.svelte';
  let {
    title,
    dir = 'ltr',
    lang = 'en',
    tldr = null,
    headings = [],
    footnoteMap = {},
    children,
  } = $props();

  let tldrTriggerEl;
</script>

<SectionNav {headings} />

<main id="main-content">
  <div class="page-frame">
    <article {dir} {lang}>
      <header class="opening" lang="ar" dir="rtl">
        <p class="quran">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p class="quran">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</p>
        <p class="salawat-open">وَأَفْضَلُ الصَّلَاةِ وَأَتَمُّ التَّسْلِيمِ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ وَصَحْبِهِ أَجْمَعِينَ</p>
      </header>

      {#if title}
        <div class="title-row">
          <h1>{title}</h1>
          {#if tldr}
            <button
              type="button"
              class="subtle-btn tldr-trigger"
              data-tldr-trigger
              bind:this={tldrTriggerEl}
              aria-label="Reveal TL;DR"
            >TL;DR</button>
          {/if}
        </div>
      {/if}

      <section class="body">
        {@render children?.()}
      </section>

      <footer class="closing" lang="ar" dir="rtl">
        <p class="ayah">﴿سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ * وَسَلَامٌ عَلَى الْمُرْسَلِينَ * وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾</p>
        <p class="salawat">اللّهُمَّ صَلِّ على سيِّدِنا مُحمَّدٍ وعلى آلِ سيِّدِنا مُحمَّدٍ، كَما صَلَّيْتَ على سيِّدِنا إبراهيمَ وعلى آلِ سيِّدِنا إبراهيمَ، إنَّكَ حَميدٌ مَجيدٌ. اللّهُمَّ بارِكْ على سيِّدِنا مُحمَّدٍ وعلى آلِ سيِّدِنا مُحمَّدٍ، كَما بارَكْتَ على سيِّدِنا إبراهيمَ وعلى آلِ سيِّدِنا إبراهيمَ، إنَّكَ حَميدٌ مَجيدٌ.</p>
      </footer>
    </article>

    <Sidenotes {footnoteMap} {tldr} />
  </div>
</main>

<style>
  main { display: block; }

  /*
   * Symmetric grid: equal-width left/right margin columns + capped body in the middle.
   * Body width = min(--measure, viewport-after-margins). Sidenotes live in the right
   * margin (Sidenotes.svelte places them as position:absolute inside .sn-margin-col).
   */
  .page-frame {
    display: grid;
    grid-template-columns:
      var(--margin-col)
      minmax(0, var(--measure))
      var(--margin-col);
    column-gap: 2rem;
    justify-content: center;
    align-items: start;
    padding: 4rem 1rem;
  }
  .page-frame > article { grid-column: 2; min-width: 0; }
  .page-frame > :global(.sn-margin-col) { grid-column: 3; min-width: 0; }

  @media (max-width: 56rem) {
    .page-frame {
      grid-template-columns: minmax(0, 1fr);
      column-gap: 0;
      padding: 3rem 1.25rem;
    }
    .page-frame > article { grid-column: 1; }
    .page-frame > :global(.sn-margin-col) { grid-column: 1; margin-top: 2rem; }
  }

  article { min-width: 0; }

  /* Opening — basmalah + hamd in Quran font, opening salawat in regular Arabic, all with diacritics. */
  .opening {
    color: var(--fg);
    text-align: center;
    line-height: 2;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--rule);
    margin-bottom: 3rem;
  }
  .opening p { margin: 0 0 0.4rem; }
  .opening p:last-child { margin-bottom: 0; }
  .opening .quran {
    font-family: var(--quran);
    font-size: 1.45rem;
    line-height: 2.2;
  }
  .opening .salawat-open {
    margin-top: 0.8rem;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 2;
  }

  .closing {
    padding-top: 2rem;
    border-top: 1px solid var(--rule);
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: var(--muted);
    text-align: center;
  }
  .closing p { margin: 0; }
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
    font-size: 1.65rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 2rem;
    flex-wrap: wrap;
  }
  .tldr-trigger { flex: 0 0 auto; }

  .body :global(p) { margin: 0 0 1.2rem; }
</style>

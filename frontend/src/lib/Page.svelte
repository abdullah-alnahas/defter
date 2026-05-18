<script>
  let { title, dir = 'ltr', lang = 'en', children } = $props();
</script>

<main id="main-content">
  <article {dir} {lang}>
    <header class="opening" lang="ar" dir="rtl">
      <p>بسم الله الرحمن الرحيم</p>
      <p>الحمد لله رب العالمين</p>
      <p>وأفضل الصلاة وأتم التسليم على سيدنا محمد وعلى آله وصحبه أجمعين</p>
    </header>

    {#if title}
      <h1>{title}</h1>
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
    margin: 0 0 2rem;
  }

  .body :global(p) { margin: 0 0 1.2rem; }
</style>

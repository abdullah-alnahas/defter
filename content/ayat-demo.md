+++
title = "Ayah and Hadith elements"
lang = "en"
dir = "ltr"
date = "2026-05-16"
tldr = "Markdown directives :::ayah and :::hadith render bordered, centered blocks. Ayah uses the Quran font (UthmanTN); Hadith uses the regular Arabic stack."
+++

The content authoring layer accepts a small set of named directives in addition to standard Markdown. Each one renders as a styled block element.

## Ayah

The `:::ayah` directive renders the enclosed Arabic text in the Quran font, centered, with horizontal rules above and below. An optional `ref="..."` becomes the figcaption.

:::ayah ref="Al-Baqarah 2:255"
اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ
:::

## Hadith

The `:::hadith` directive uses the same block treatment but renders in the regular Arabic font, since hadith collections traditionally don't use Quranic mushaf typography.

:::hadith ref="صحيح البخاري"
إنَّما الأعمالُ بالنِّيَّاتِ، وإنَّما لكلِّ امرئٍ ما نوى
:::

Both directives carry `lang="ar" dir="rtl"` automatically, regardless of the enclosing page's direction.

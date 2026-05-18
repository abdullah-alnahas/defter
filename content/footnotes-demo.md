+++
title = "Footnotes demo"
lang = "en"
dir = "ltr"
date = "2026-05-18"
tldr = "Footnotes render as superscript refs with a margin sidenote on hover (wide screens) or tap-to-expand inline (narrow). The endnote list is always present for readers and assistive tech."
+++

This page demonstrates inline footnote references[^slow] and the endnote list that follows the article body.

Footnotes are written in Markdown using the `[^label]` syntax for the reference and `[^label]:` for the definition[^syntax]. Labels can be numeric or named — defter renders them in document order regardless.

The closing Ayah and the Ibrahimi salawat are not affected by the footnote section — they always appear last, beneath any rendered endnotes[^closing].

[^slow]: This builds on the earlier note about reading slowly. A footnote is a structured pause — a small detour the reader can take or skip.

[^syntax]: Named labels (`[^slow]`) make the source easier to keep coherent when notes are added or reordered. The rendered number is assigned at render time.

[^closing]: The closing block lives in the page wrapper, not the markdown body — that placement is enforced by `Page.svelte`, not by markdown convention.

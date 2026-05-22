import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { gfmHeadingId } from 'marked-gfm-heading-id';

/**
 * Resolved relative to frontend/ (process.cwd() during `bun run build` and `bun run dev`).
 * Survives SvelteKit's bundling, which would otherwise break import.meta.url-based paths.
 */
const contentDir = path.resolve(process.cwd(), '..', 'content');

export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'http://127.0.0.1:8787';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const m = marked.setOptions({}).use(gfmHeadingId()).use(markedFootnote());
m.use({
  renderer: {
    code(token) {
      const lang = token.lang || '';
      const code = token.text || '';
      if (lang === 'exec') {
        const escapedSrcdoc = escapeHtml(execIframeSrcdoc(code));
        return `<figure class="exec"><iframe sandbox="allow-scripts" loading="lazy" referrerpolicy="no-referrer" srcdoc="${escapedSrcdoc}" title="Executable code block"></iframe><figcaption>Live code (sandboxed)</figcaption></figure>\n`;
      }
      return false;
    },
  },
});

function execIframeSrcdoc(userJs) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin: 0; padding: 0.6rem 0.8rem; font: 14px ui-sans-serif,system-ui,sans-serif; color: #222; background: #fff; }
    #out { white-space: pre-wrap; font: 13px ui-monospace,monospace; }
    .err { color: #c00; }
    @media (prefers-color-scheme: dark) {
      body { color: #eee; background: #1a1a1a; }
      .err { color: #ff7a7a; }
    }
  </style></head><body><div id="out"></div><script>
    (function(){
      var out = document.getElementById('out');
      function show(v, cls){
        var d = document.createElement('div');
        if (cls) d.className = cls;
        d.textContent = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
        out.appendChild(d);
      }
      window.print = function(){ for (var i=0; i<arguments.length; i++) show(arguments[i]); };
      try { ${userJs} }
      catch(e){ show(e && e.message || e, 'err'); }
    })();
  </${'script'}></body></html>`;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('Missing TOML frontmatter');
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const str = line.match(/^\s*(\w+)\s*=\s*"(.*)"\s*$/);
    if (str) { meta[str[1]] = str[2]; continue; }
    const bool = line.match(/^\s*(\w+)\s*=\s*(true|false)\s*$/);
    if (bool) { meta[bool[1]] = bool[2] === 'true'; continue; }
  }
  return { meta, body: match[2] };
}

function preprocessDirectives(md) {
  return md.replace(
    /:::(ayah|hadith)(?:\s+ref="([^"]+)")?\r?\n([\s\S]*?)\r?\n:::/g,
    (_, kind, ref, content) => {
      const refHtml = ref ? `\n<figcaption>${escapeHtml(ref)}</figcaption>` : '';
      return `<figure class="${kind}" lang="ar" dir="rtl">\n<blockquote>${content.trim()}</blockquote>${refHtml}\n</figure>`;
    }
  );
}

/**
 * Rewrites marked-footnote refs to <sup class="fn-ref" data-fn-id="…">…</sup>
 * Returns { html, footnoteMap: { [label]: { num, html } } } so the runtime
 * can populate the margin stack from a side-channel rather than inlining bodies.
 */
function extractFootnotes(html) {
  const footnoteMap = {};
  const sectionMatch = html.match(/<section class="footnotes" data-footnotes>([\s\S]*?)<\/section>/);
  if (sectionMatch) {
    const liPattern = /<li id="footnote-([^"]+)">([\s\S]*?)<\/li>/g;
    for (const li of sectionMatch[1].matchAll(liPattern)) {
      const label = li[1];
      const body = li[2]
        .replace(/\s*<a [^>]*data-footnote-backref[^>]*>[\s\S]*?<\/a>/g, '')
        .trim();
      footnoteMap[label] = { html: body };
    }
  }
  const refPattern = /<sup>(<a id="footnote-ref-([^"]+)"[^>]*data-footnote-ref[^>]*>([^<]*)<\/a>)<\/sup>/g;
  const out = html.replace(refPattern, (_, aTag, label, num) => {
    if (footnoteMap[label]) footnoteMap[label].num = num;
    return `<sup class="fn-ref" data-fn-id="${label}">${aTag}</sup>`;
  });
  return { html: out, footnoteMap };
}

function extractHeadings(html) {
  const out = [];
  const pattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const g of html.matchAll(pattern)) {
    out.push({ level: parseInt(g[1], 10), id: g[2], text: g[3].replace(/<[^>]+>/g, '').trim() });
  }
  return out;
}

export function extractDescription(body, fallback = '') {
  const para = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)[0] || fallback;
  return para.replace(/\s+/g, ' ').slice(0, 160).trim();
}

let cache = null;

export async function loadAllPages() {
  if (cache) return cache;
  const files = (await readdir(contentDir)).filter((f) => f.endsWith('.md'));
  const pages = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const raw = await readFile(path.join(contentDir, f), 'utf8');
    const { meta, body: bodyMarkdown } = parseFrontmatter(raw);
    const rawHtml = marked.parse(preprocessDirectives(bodyMarkdown));
    const { html, footnoteMap } = extractFootnotes(rawHtml);
    pages.push({
      slug,
      title: meta.title,
      lang: meta.lang,
      dir: meta.dir,
      date: meta.date,
      tldr: meta.tldr || null,
      featured: meta.featured === true,
      external: meta.external || null,
      body: html,
      footnoteMap,
      headings: extractHeadings(html),
      description: extractDescription(bodyMarkdown, meta.title),
    });
  }
  pages.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = pages;
  return pages;
}

export async function loadPage(slug) {
  const all = await loadAllPages();
  return all.find((p) => p.slug === slug) || null;
}

export async function listPagesMeta() {
  const all = await loadAllPages();
  return all.map(({ body, footnoteMap, headings, ...rest }) => rest);
}

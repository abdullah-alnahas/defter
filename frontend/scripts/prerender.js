import { createServer } from 'vite';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { gfmHeadingId } from 'marked-gfm-heading-id';

marked.use(gfmHeadingId());
marked.use(markedFootnote());

function extractHeadings(html) {
  const out = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const id = m[2];
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    out.push({ level, id, text });
  }
  return out;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(frontendRoot, '..');
const contentDir = path.join(projectRoot, 'content');
const distDir = path.join(frontendRoot, 'dist');
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'http://127.0.0.1:8787';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escapeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/-->/g, '--\\>');

function parseFrontmatter(raw) {
  const m = raw.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('Missing TOML frontmatter');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*(\w+)\s*=\s*"(.*)"\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: m[2] };
}

function extractDescription(body, fallback = '') {
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

function injectSidenotes(html) {
  const sectionMatch = html.match(/<section class="footnotes" data-footnotes>([\s\S]*?)<\/section>/);
  if (!sectionMatch) return html;
  const defs = {};
  const liRe = /<li id="footnote-([^"]+)">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(sectionMatch[1])) !== null) {
    const label = m[1];
    const body = m[2]
      .replace(/\s*<a [^>]*data-footnote-backref[^>]*>[\s\S]*?<\/a>/g, '')
      .trim();
    defs[label] = body;
  }
  const refRe = /<sup>(<a id="footnote-ref-([^"]+)"[^>]*data-footnote-ref[^>]*>([^<]*)<\/a>)<\/sup>/g;
  return html.replace(refRe, (_, aTag, label, num) => {
    const def = defs[label] || '';
    return `<span class="fn-anchor"><sup>${aTag}</sup><span class="sidenote" role="note" id="sidenote-${label}"><span class="sn-num">${num}.</span> ${def}</span></span>`;
  });
}

async function loadContent() {
  const files = (await readdir(contentDir)).filter((f) => f.endsWith('.md'));
  const pages = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const raw = await readFile(path.join(contentDir, f), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const parsedHtml = injectSidenotes(marked.parse(body));
    pages.push({
      slug,
      title: meta.title,
      lang: meta.lang,
      dir: meta.dir,
      date: meta.date,
      tldr: meta.tldr || undefined,
      bodyMarkdown: body,
      body: parsedHtml,
      headings: extractHeadings(parsedHtml),
    });
  }
  pages.sort((a, b) => (a.date < b.date ? 1 : -1));
  return pages;
}

const stripBody = ({ body, bodyMarkdown, ...rest }) => rest;
const stripMarkdown = ({ bodyMarkdown, ...rest }) => rest;

function fill(template, { lang, dir, title, description, canonical, data, body }) {
  return template
    .replace(/%LANG%/g, escapeHtml(lang))
    .replace(/%DIR%/g, escapeHtml(dir))
    .replace(/%TITLE%/g, escapeHtml(title))
    .replace(/%DESCRIPTION%/g, escapeHtml(description))
    .replace(/%CANONICAL%/g, escapeHtml(canonical))
    .replace(/%DATA%/g, escapeJson(data))
    .replace('<!--ssr-outlet-->', body);
}

async function main() {
  const pages = await loadContent();
  if (pages.length === 0) {
    console.error('No content found in', contentDir);
    process.exit(1);
  }

  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');

  const vite = await createServer({
    root: frontendRoot,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'error',
  });

  const { render } = await vite.ssrLoadModule('svelte/server');
  const { default: App } = await vite.ssrLoadModule('/src/App.svelte');
  const router = await vite.ssrLoadModule('/src/lib/router.svelte.js');

  // ----- Index route -----
  router.setPath('/');
  const indexData = { pages: pages.map(stripBody) };
  const { body: indexBody } = render(App, { props: { data: indexData } });
  await writeFile(
    path.join(distDir, 'index.html'),
    fill(template, {
      lang: 'en',
      dir: 'ltr',
      title: 'defter — دفتر',
      description: 'A personal notebook. Blog posts, projects, and notes.',
      canonical: SITE_ORIGIN + '/',
      data: indexData,
      body: indexBody,
    })
  );
  console.log('rendered /');

  // ----- Per-page routes -----
  for (const p of pages) {
    const route = `/p/${p.slug}`;
    router.setPath(route);
    const data = { page: stripMarkdown(p) };
    const { body } = render(App, { props: { data } });
    const description = extractDescription(p.bodyMarkdown, p.title);
    const outDir = path.join(distDir, 'p', p.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(
      path.join(outDir, 'index.html'),
      fill(template, {
        lang: p.lang,
        dir: p.dir,
        title: `${p.title} — defter`,
        description,
        canonical: SITE_ORIGIN + route,
        data,
        body,
      })
    );
    console.log(`rendered ${route}`);
  }

  // ----- sitemap.xml -----
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_ORIGIN}/</loc><lastmod>${today}</lastmod></url>
${pages.map((p) => `  <url><loc>${SITE_ORIGIN}/p/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('wrote sitemap.xml');

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
  await writeFile(path.join(distDir, 'robots.txt'), robots);
  console.log('wrote robots.txt');

  // ----- rss.xml (RSS 2.0) -----
  const toRfc822 = (ymd) => {
    const d = new Date(`${ymd}T00:00:00Z`);
    return d.toUTCString();
  };
  const rssItems = pages.map((p) => {
    const url = `${SITE_ORIGIN}/p/${p.slug}`;
    const desc = extractDescription(p.bodyMarkdown, p.title);
    return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <description>${escapeHtml(desc)}</description>
    </item>`;
  }).join('\n');
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>defter — دفتر</title>
    <link>${SITE_ORIGIN}/</link>
    <description>A personal notebook. Blog posts, projects, and notes.</description>
    <atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
${rssItems}
  </channel>
</rss>
`;
  await writeFile(path.join(distDir, 'rss.xml'), rss);
  console.log('wrote rss.xml');

  // ----- ai.txt (Spawning AI usage policy — allow) -----
  const aitxt = `# ai.txt — AI training and usage policy for ${SITE_ORIGIN}
# Spec: https://spawning.ai/ai-txt

User-Agent: *
Allow: /
`;
  await writeFile(path.join(distDir, 'ai.txt'), aitxt);
  console.log('wrote ai.txt');

  // ----- llm.txt (LLM-readable site summary; concept-named llm.txt; see llmstxt.org for llms.txt) -----
  const llmIndex = pages
    .map((p) => `- [${p.title}](${SITE_ORIGIN}/p/${p.slug}): ${extractDescription(p.bodyMarkdown, p.title)}`)
    .join('\n');
  const llmtxt = `# defter — دفتر

> A personal notebook. Blog posts, projects, and notes. Each page opens with basmalah/hamd/salawat and closes with the Ayah of Surat as-Saffat (verses 180-182) followed by the Ibrahimi salawat.

## Posts

${llmIndex}

## Feeds

- [RSS](${SITE_ORIGIN}/rss.xml)
- [Sitemap](${SITE_ORIGIN}/sitemap.xml)
`;
  await writeFile(path.join(distDir, 'llm.txt'), llmtxt);
  console.log('wrote llm.txt');

  await vite.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

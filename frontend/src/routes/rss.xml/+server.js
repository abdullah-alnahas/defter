import { loadAllPages, SITE_ORIGIN } from '$lib/server/content.js';

export const prerender = true;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const toRfc822 = (ymd) => new Date(`${ymd}T00:00:00Z`).toUTCString();

export async function GET() {
  const pages = await loadAllPages();
  const items = pages.map((p) => {
    const url = `${SITE_ORIGIN}/p/${p.slug}`;
    return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <description>${escapeHtml(p.description)}</description>
    </item>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>defter — دفتر</title>
    <link>${SITE_ORIGIN}/</link>
    <description>A personal notebook. Blog posts, projects, and notes.</description>
    <atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

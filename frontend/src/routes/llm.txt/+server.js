import { loadAllPages, SITE_ORIGIN } from '$lib/server/content.js';

export const prerender = true;

export async function GET() {
  const pages = await loadAllPages();
  const index = pages
    .map((p) => `- [${p.title}](${SITE_ORIGIN}/p/${p.slug}): ${p.description}`)
    .join('\n');
  const body = `# defter — دفتر

> A personal notebook. Blog posts, projects, and notes. Each page opens with basmalah/hamd/salawat and closes with the Ayah of Surat as-Saffat (verses 180-182) followed by the Ibrahimi salawat.

## Posts

${index}

## Other views

- [Featured](${SITE_ORIGIN}/featured) — curated subset of posts and projects.

## Feeds

- [RSS](${SITE_ORIGIN}/rss.xml)
- [Sitemap](${SITE_ORIGIN}/sitemap.xml)
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

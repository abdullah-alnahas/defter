import { loadAllPages, SITE_ORIGIN } from '$lib/server/content.js';

export const prerender = true;

export async function GET() {
  const pages = await loadAllPages();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url><loc>${SITE_ORIGIN}/</loc><lastmod>${today}</lastmod></url>`,
    `  <url><loc>${SITE_ORIGIN}/featured</loc><lastmod>${today}</lastmod></url>`,
    `  <url><loc>${SITE_ORIGIN}/p/cv</loc><lastmod>${today}</lastmod></url>`,
    ...pages.map((p) => `  <url><loc>${SITE_ORIGIN}/p/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`),
  ].join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

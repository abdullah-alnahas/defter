import { SITE_ORIGIN } from '$lib/server/content.js';

export const prerender = true;

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

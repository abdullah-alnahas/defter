import { SITE_ORIGIN } from '$lib/server/content.js';

export const prerender = true;

export function GET() {
  const body = `# ai.txt — AI training and usage policy for ${SITE_ORIGIN}
# Spec: https://spawning.ai/ai-txt

User-Agent: *
Allow: /
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

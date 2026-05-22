import { listPagesMeta } from '$lib/server/content.js';

export const prerender = true;

export async function load() {
  const pages = await listPagesMeta();
  return { pages };
}

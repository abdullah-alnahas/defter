import { error } from '@sveltejs/kit';
import { loadAllPages, loadPage } from '$lib/server/content.js';

export const prerender = true;

export async function entries() {
  const pages = await loadAllPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
  const page = await loadPage(params.slug);
  if (!page) throw error(404, 'Not found');
  return { page };
}

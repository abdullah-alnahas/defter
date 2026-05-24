import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      strict: true,
    }),
    paths: {
      base: process.env.BASE_PATH ?? '',
    },
    prerender: {
      handleHttpError: 'fail',
      handleMissingId: 'fail',
      origin: process.env.PRERENDER_ORIGIN || 'http://127.0.0.1:8787',
      /* /p/cv/print isn't reached by the crawler (opened by JS from the
         about page's download modal with query params), so seed it. */
      entries: ['*', '/p/cv/print'],
    },
    /** Inline all CSS into the page (no separate render-blocking stylesheet requests). */
    inlineStyleThreshold: Infinity,
    /** Inline all JS too — single round-trip, no modulepreload waterfall. */
    output: { bundleStrategy: 'inline' },
    alias: {
      $content: '../content',
    },
  },
};

export default config;

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
    prerender: {
      handleHttpError: 'fail',
      handleMissingId: 'fail',
      origin: process.env.SITE_ORIGIN || 'http://127.0.0.1:8787',
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

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const DEV_DEFAULTS = {
  LANG: 'en',
  DIR: 'ltr',
  TITLE: 'defter (dev)',
  DESCRIPTION: 'dev mode',
  CANONICAL: 'http://localhost:5173/',
  DATA: '{}',
};

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'defter-placeholders-dev',
      transformIndexHtml: {
        order: 'pre',
        handler(html, ctx) {
          if (!ctx.server) return html;
          let out = html;
          for (const [k, v] of Object.entries(DEV_DEFAULTS)) {
            out = out.replace(new RegExp(`%${k}%`, 'g'), v);
          }
          return out.replace('<!--ssr-outlet-->', '');
        },
      },
    },
  ],
  build: { outDir: 'dist', emptyOutDir: true },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
});

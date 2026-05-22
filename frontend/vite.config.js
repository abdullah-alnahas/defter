import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * Preview-server cache headers. SvelteKit hashed assets and our pinned font
 * are immutable forever; everything else gets a short TTL.
 */
const immutableCachePlugin = {
  name: 'defter-preview-cache-headers',
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (url.startsWith('/_app/immutable/') || url.startsWith('/fonts/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (url === '/favicon.svg') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [sveltekit(), immutableCachePlugin],
});

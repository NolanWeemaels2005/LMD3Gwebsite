import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import site from './src/data/site.json';

const productionBase = '/LMD3Gwebsite/';

export default defineConfig({
  plugins: [react(), {
    name: 'local-page-redirects',
    configureServer(server) {
      // Keep existing local bookmarks working while serving local pages at /.
      server.middlewares.use((request, response, next) => {
        const url = request.url ?? '/';
        if (url === productionBase.slice(0, -1) || url.startsWith(productionBase)) {
          response.writeHead(302, { Location: '/' + url.slice(productionBase.length) });
          response.end();
          return;
        }
        next();
      });
    },
  }],
  base: new URL(site.url).pathname,
  build: {
    // WebKit can retain a failed modulepreload in its cache across reloads.
    // Let dynamic imports load their JS normally; keep CSS and entry preloads.
    modulePreload: {
      resolveDependencies: (_filename, dependencies, context) => context.hostType === 'js'
        ? dependencies.filter(dependency => !dependency.endsWith('.js'))
        : dependencies,
    },
  },
});

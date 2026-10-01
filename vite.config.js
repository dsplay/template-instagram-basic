/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pkg from './package.json' with { type: 'json' };
import templateManifest from '@dsplay/template-manifest/vite-plugin';

// index.html loads `public/dsplay-data.js` as a plain <script src>, not an ES module import, so it
// never enters Vite's module graph — Vite's dev server only reloads/HMRs files it's tracking
// through that graph, so editing dsplay-data.js otherwise does nothing in the browser until a
// manual refresh. This watches that one file directly and forces a full reload on change.
function watchDsplayData() {
  let dataFile;
  return {
    name: 'watch-dsplay-data',
    configureServer(server) {
      dataFile = resolve(server.config.publicDir, 'dsplay-data.js');
      server.watcher.add(dataFile);
    },
    handleHotUpdate({ file, server }) {
      if (file === dataFile) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [
    watchDsplayData(),
    react(),
    legacy({
      targets: pkg.browserslist,
    }),
    templateManifest(),
  ],
  build: {
    outDir: 'build',
    // oxc's minifier ignores the legacy chunk's target and reintroduces ?./?? after Babel expands them; terser doesn't.
    minify: 'terser',
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.js'],
  },
});

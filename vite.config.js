/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pkg from './package.json' with { type: 'json' };
import templateManifest from '@dsplay/template-manifest/vite-plugin';

export default defineConfig({
  base: './',
  plugins: [
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

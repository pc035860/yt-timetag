/* global __dirname */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        explorer: resolve(__dirname, 'explorer.html'),
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-is', 'scheduler'],
          lodash: ['lodash'],
          fontAwesome: [
            '@fortawesome/fontawesome-svg-core',
            '@awesome.me/kit-ea44dc83ec',
          ],
          jsYaml: ['js-yaml'],
        },
      },
    },
  },
});

/* global __dirname, process */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const defaultEntryPointConfig = { main: true, explorer: true };

const SOURCEMAP = Boolean(process.env.SOURCEMAP ?? 0);

export default function generateViteConfig(
  entryPointConfig = defaultEntryPointConfig
) {
  const input = {};
  if (entryPointConfig.main) {
    input.main = resolve(__dirname, 'index.html');
  }
  if (entryPointConfig.explorer) {
    input.explorer = resolve(__dirname, 'explorer.html');
  }

  return defineConfig({
    base: '',
    plugins: [react()],
    build: {
      sourcemap: SOURCEMAP,
      rollupOptions: {
        input,
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
}

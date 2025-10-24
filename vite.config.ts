import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';

const outDir = './dist';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: './assets',
          dest: './',
        },
        {
          src: './metadata.json',
          dest: './',
        },
        {
          src: './dapp-logo.png',
          dest: './',
        },
      ],
    }),
    tailwindcss(),
  ],
  build: {
    outDir,
    copyPublicDir: false,
  },
  define: {
    'import.meta.env.AIRMONEY_PACKAGE_VERSION': JSON.stringify(version),
  },
  publicDir: 'assets',
});

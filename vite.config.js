import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/weber-site/', // Базовый путь для GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stories: resolve(__dirname, 'stories.html'),
        fullText: resolve(__dirname, 'full-text.html'),
      },
    },
  },
});
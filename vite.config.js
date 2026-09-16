import { defineConfig } from 'vite';

export default defineConfig({
  base: '/weber-site/', // Базовый путь для GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
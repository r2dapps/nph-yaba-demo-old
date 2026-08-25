import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-github-pages',
      closeBundle() {
        const dist = path.resolve(__dirname, 'dist');
        const index = path.join(dist, 'index.html');
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, path.join(dist, '404.html'));
        }
        fs.writeFileSync(path.join(dist, '.nojekyll'), '');
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

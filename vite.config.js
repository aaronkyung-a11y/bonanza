import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Set base to './' for maximum portability (works on GitHub Pages project pages,
// custom domains, and local preview). If you deploy to a user/org root page,
// change this to '/'.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
});

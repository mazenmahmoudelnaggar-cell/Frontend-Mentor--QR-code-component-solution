import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 8000,
    host: "0.0.0.0",
    open: true,
    strictPort: true,
    hmr: { overlay: false }
  },
  build: { outDir: 'dist' },
  css: { devSourcemap: false }
});

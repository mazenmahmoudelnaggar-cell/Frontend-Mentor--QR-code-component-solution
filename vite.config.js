
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8000,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});

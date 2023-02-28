import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [eslint()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 4101,
    open: true,
  },
  build: {
    assetsDir: './',
    sourcemap: command === 'serve',
    rollupOptions: {
      output: {
        manualChunks: {
          'pixi-venders': ['pixi.js', '@pixi/tilemap'],
        },
      },
    },
  },
}));

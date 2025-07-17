import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { e2eAppPort } from '../e2e-apps-setup.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ifex-viewer'),
        },
      },
    }),
  ],
  preview: {
    port: e2eAppPort,
  },
  server: {
    port: e2eAppPort,
  },
});

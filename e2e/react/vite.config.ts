import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { e2eAppPort } from '../e2e-apps-setup.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: e2eAppPort,
  },
  server: {
    port: e2eAppPort,
  },
});

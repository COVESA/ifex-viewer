import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', '**/stencil/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: './test-setup.ts',
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
    },
  }),
);

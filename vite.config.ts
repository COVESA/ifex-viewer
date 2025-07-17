import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue({ features: { customElement: true } }), dts({ tsconfigPath: './tsconfig.app.json', rollupTypes: true }), tailwindcss()],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'IfexViewer',
      fileName: format => `ifex-viewer.${format}.js`,
      formats: ['es'],
    },
  },
  // TODO: consider having one build for the web component and one for the vue component or one for the web component with vue as external dependency so vue isn't included in the web component
});

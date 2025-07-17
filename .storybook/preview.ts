import { withThemeByClassName } from '@storybook/addon-themes';
import { type Preview, setup, type VueRenderer } from '@storybook/vue3';
import { type App } from 'vue';

import '../src/style.css';
import '../node_modules/highlight.js/styles/vs2015.min.css';

import { createPinia } from 'pinia';

const pinia = createPinia();

setup((app: App) => {
  app.use(pinia);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;

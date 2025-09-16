import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'IFEX Viewer Documentation',
  base: '/ifex-viewer/',
  description: 'The IFEX Viewer is a web component designed to display API specifications created with the Interface Exchange Framework (IFEX).',
  themeConfig: {
    logo: './logo.svg',
    siteTitle: false,
    search: {
      provider: "local",
    },
    nav: [
      { text: 'Guide', link: '/guide/about/introduction' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Playground', link: '/playground/' },
    ],
    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: 'About',
            items: [{ text: 'What is the IFEX Viewer?', link: 'about/introduction' }],
          },
          {
            text: 'Integration',
            items: [
              { text: 'Getting started', link: 'integration/getting-started' },
              { text: 'Usage', link: 'integration/usage' },
            ],
          },
        ],
      },
    },
    footer: {
      message: 'Released under the Apache-2.0 License.',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/COVESA/ifex-viewer' }],
  },
});

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { defineCustomElement } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

const pinia = createPinia();

export const IfexViewerWc = defineCustomElement(App, {
  configureApp(app) {
    app.use(pinia);
  },
});

customElements.define('ifex-viewer', IfexViewerWc);

// register global typings
declare module 'vue' {
  export interface GlobalComponents {
    IfexViewer: typeof IfexViewerWc;
  }
}

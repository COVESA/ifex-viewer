/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { GutterMarker } from '@codemirror/view';

class ErrorMarkerWithMessage extends GutterMarker {
  /* eslint-disable-next-line no-unused-vars */
  constructor(readonly messages: string[]) {
    super();
  }

  toDOM() {
    const el = document.createElement('div');
    el.textContent = '!';
    el.title = this.messages.join('\n');
    el.setAttribute('class', 'error-marker');
    return el;
  }
}

export default ErrorMarkerWithMessage;

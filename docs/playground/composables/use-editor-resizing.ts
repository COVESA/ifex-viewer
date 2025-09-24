/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ref, ShallowRef } from 'vue';

export const useEditorResizing = (codemirrorInstance: Readonly<ShallowRef<HTMLElement | null>>) => {
  const editorSize = ref(0);
  const ifexViewerSize = ref(0);

  const startResizing = () => {
    // Reset initialOffset when starting a new resize operation
    initialOffset = 0;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', resize);
      // Reset initialOffset after resizing is complete
      initialOffset = 0;
    });
  };

  let initialOffset = 0;

  const resize = (event: MouseEvent) => {
    if (!codemirrorInstance.value) {
      return;
    }

    const container = document.querySelector('.playground-container') as HTMLElement;
    if (!container) {
      return;
    }

    const { left } = codemirrorInstance.value.getBoundingClientRect();
    const containerWidth = container.offsetWidth;

    // Calculate the initial offset only on the first resize event
    // This should be the difference between mouse position and current editor right edge
    if (initialOffset === 0) {
      initialOffset = event.x - (left + editorSize.value + 35); // +35 to account for the current padding/gap
    }

    // Calculate new editor size without the jump
    const newEditorSize = event.x - left - initialOffset - 35; // -35 for consistent spacing

    // Ensure the sizes remain within bounds (accounting for minimum sizes and gaps)
    const minEditorSize = 200; // Minimum editor width
    const minViewerSize = 200; // Minimum viewer width
    const totalGap = 70; // Total gap/padding (35px each side)

    if (newEditorSize >= minEditorSize && containerWidth - newEditorSize - totalGap >= minViewerSize) {
      editorSize.value = newEditorSize;

      // Calculate and set the width of the ifex-viewer
      ifexViewerSize.value = containerWidth - newEditorSize - totalGap;
    }
  };

  return { editorSize, ifexViewerSize, startResizing };
};

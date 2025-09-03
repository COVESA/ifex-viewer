<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useData } from 'vitepress';
import { IfexSpecificationItem } from '../../src/types';
import { simpleSpecificationMock } from '../../src/tests/mocks/specification';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup, EditorView } from 'codemirror';
import { Compartment, EditorState, RangeSet, RangeSetBuilder } from '@codemirror/state';
import YAML, { Document as YAMLDocument, YAMLError } from 'yaml';
import { gutter, GutterMarker, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import ErrorMarkerWithMessage from './ErrorMarkerWithMessage';

const codemirrorInstance = useTemplateRef<HTMLElement>('editor');
const ifexViewerInstance = useTemplateRef<HTMLElement>('ifex-viewer');

const mounted = ref(false);
const { isDark } = useData();

const view = ref<null | EditorView>(null);

const specifications = defineModel<string>({ default: simpleSpecificationMock });

const specificationYAMLDocs = computed<YAMLDocument[]>(() => YAML.parseAllDocuments(specifications.value));

const editorsValidationErrors = computed(() => {
  let errorCount = 0;
  const errors: { message: string; linePos: YAMLError['linePos'] }[] = [];

  // TODO: enhance to cover ifex specific validation rules
  for (const doc of specificationYAMLDocs.value) {
    if (doc.errors.length > 0) {
      errorCount = errorCount + doc.errors.length;
      for (const error of doc.errors) {
        errors.push({ message: error.message, linePos: error.linePos });
      }
    }
  }

  return { errorCount, errors };
});

const ifexSpecificationItems = computed<IfexSpecificationItem[]>(() =>
  specificationYAMLDocs.value
    .map(
      (spec, index): IfexSpecificationItem => ({
        filename: `layer-${index + 1}.yml`, // Generate arbitrary file name to match interface
        content: spec.errors.length > 0 ? '' : spec.toString().replace(/^---\n/, ''), // Remove document start marker and the newline immediately after it
      }),
    )
    .filter(spec => spec.content.trim() !== ''),
);

const errorGutter = (errorMap: Map<number, string[]>) => {
  return gutter({
    class: 'cm-error-gutter',
    markers(view: EditorView): RangeSet<GutterMarker> {
      const builder = new RangeSetBuilder<GutterMarker>();

      for (const [lineNum, messages] of errorMap.entries()) {
        const line = view.state.doc.line(lineNum);
        const marker = new ErrorMarkerWithMessage(messages);
        builder.add(line.from, line.from, marker);
      }

      return builder.finish();
    },
    initialSpacer: () => new ErrorMarkerWithMessage([]),
  });
};

const errorMap = computed<Map<number, string[]>>(() => {
  const lines = new Map<number, string[]>();
  for (const err of editorsValidationErrors.value.errors) {
    if (!err.linePos) {
      continue;
    }

    if (lines.has(err.linePos[0].line)) {
      lines.get(err.linePos[0].line)?.push(err.message);
    } else {
      lines.set(err.linePos[0].line, [err.message]);
    }
  }
  return lines;
});

const errorGutterCompartment = new Compartment();

onMounted(() => {
  // Workaround for lazy loading web components in SSR
  import('../../dist/ifex-viewer.es.js').then(() => {
    mounted.value = true;
  });

  const parentElement = document.getElementById(SCROLL_CONTAINER_ID)?.parentElement;
  if (parentElement) {
    const parentWidth = parentElement.offsetWidth;
    editorSize.value = parentWidth / 2 - 19; // 50% - 1rem (16px) - 3px

    ifexViewerSize.value = parentWidth / 2 - 19; // 50% - 1rem (16px) - 3px
  }

  const initialEditorState = EditorState.create({
    doc: simpleSpecificationMock,
    extensions: [
      oneDark,
      basicSetup,
      yaml(),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          specifications.value = update.state.doc.toString();
        }
      }),
      errorGutterCompartment.of(errorGutter(errorMap.value)),
    ],
  });

  // Custom styles for codemirror are located in custom.css
  view.value = new EditorView({
    state: initialEditorState,
    parent: codemirrorInstance.value,
  });
});

onBeforeUnmount(() => {
  if (view.value) {
    view.value.destroy();
  }
});

watch(errorMap, newErrorMap => {
  if (!view.value) return;
  // Updates error gutter with new errors
  view.value.dispatch({
    effects: errorGutterCompartment.reconfigure(errorGutter(newErrorMap)),
  });
});

const editorSize = ref(0);
const ifexViewerSize = ref(0);

const SCROLL_CONTAINER_ID = 'scroll-container';

const startResizing = () => {
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', resize);
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
  if (initialOffset === 0) {
    initialOffset = event.x - editorSize.value - left;
  }

  // Adjust editorSize by subtracting the initial offset
  const newEditorSize = event.x - left - initialOffset;

  // Ensure the sizes remain within bounds
  if (newEditorSize > 0 && newEditorSize < containerWidth) {
    editorSize.value = newEditorSize;

    // Calculate and set the width of the ifex-viewer
    ifexViewerSize.value = containerWidth - newEditorSize;
  }
};
</script>

<template>
  <div class="playground-container">
    <div :id="SCROLL_CONTAINER_ID" ref="editor" class="editor" :style="{ width: editorSize + 'px' }"></div>
    <div class="resizer" data-testid="resizer" @mousedown="startResizing"></div>
    <div v-if="mounted" class="ifex-viewer-playground-container" :style="{ width: ifexViewerSize + 'px' }">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <ifex-viewer
        ref="ifex-viewer"
        :style="{ width: ifexViewerSize + 'px' }"
        :specifications="ifexSpecificationItems"
        :layout="{ sidenavPosition: 'right' }"
        :class="isDark ? 'ifex-viewer-playground dark' : 'ifex-viewer-playground'"
      ></ifex-viewer>
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 75vh;
  gap: 2rem;
  margin-top: 2rem;
  overflow: hidden;
}

.ifex-viewer-playground-container {
  height: 50vh;
}

.ifex-viewer-playground {
  display: block;
  height: 100%;
}

.editor {
  height: 50vh;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-input-border-color);
  padding: 0.25rem;
  box-sizing: border-box;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.resizer {
  display: none; /* Hide by default, only show on larger screens */
}

@media (min-width: 768px) {
  .playground-container {
    flex-direction: row;
  }

  .editor {
    height: 100%;
    max-height: 75vh;
  }

  .ifex-viewer-playground-container {
    height: 100%;
    max-height: 75vh;
  }

  .resizer {
    display: block;
    cursor: col-resize;
    width: 6px;
    background-color: var(--vp-c-gray-1);
    border-left: 2px solid var(--vp-c-gray-1);
    border-right: 2px solid var(--vp-c-gray-1);
    transition:
      background-color 0.2s,
      border-color 0.2s;
    position: relative;
  }

  .resizer:hover {
    border-left-color: var(--vp-c-gray-soft);
    border-right-color: var(--vp-c-gray-soft);
    background-color: var(--vp-c-gray-soft);
  }

  .resizer::before {
    content: '⋮'; /* Unicode character for vertical dots */
    font-size: 1rem;
    color: var(--vp-c-neutral);
    text-align: center;
    position: absolute;
    width: 8px;
    background-color: var(--vp-c-gray-1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Ensure it doesn't interfere with dragging */
  }
}
</style>

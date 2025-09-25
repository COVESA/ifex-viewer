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
import { useEditorSync } from './composables/use-editor-sync';
import { useEditorResizing } from './composables/use-editor-resizing.js';

const codemirrorInstance = useTemplateRef<HTMLElement>('editor');
const viewerRef = useTemplateRef<HTMLElement>('viewer');

const mounted = ref(false);
const { isDark } = useData();

const view = ref<null | EditorView>(null);

const specifications = ref<string>(simpleSpecificationMock);

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
const syncEditorPosition = defineModel<boolean>({ default: true });
const selectedEditorNode = ref<string>('');

const { getDotNotationPathOfSelectedNode } = useEditorSync(specificationYAMLDocs);
watch(selectedEditorNode, newValue => {
  if (syncEditorPosition.value && newValue && mounted.value) {
    (viewerRef.value as any)?.selectNode(newValue);
  }
});

const SCROLL_CONTAINER_ID = 'scroll-container';

const { editorSize, ifexViewerSize, startResizing } = useEditorResizing(codemirrorInstance);

const calculateSizes = () => {
  const parentElement = document.getElementById(SCROLL_CONTAINER_ID)?.parentElement;
  if (parentElement) {
    const parentWidth = parentElement.offsetWidth;
    const totalGap = 70; // Total gap/padding (35px each side)
    const availableWidth = parentWidth - totalGap;

    // If sizes haven't been set yet, use 50/50 split
    if (editorSize.value === 0 && ifexViewerSize.value === 0) {
      editorSize.value = availableWidth / 2;
      ifexViewerSize.value = availableWidth / 2;
    } else {
      // Maintain the current ratio when resizing
      const currentTotal = editorSize.value + ifexViewerSize.value;
      if (currentTotal > 0) {
        const editorRatio = editorSize.value / currentTotal;
        editorSize.value = availableWidth * editorRatio;
        ifexViewerSize.value = availableWidth * (1 - editorRatio);
      } else {
        // Fallback to 50/50 if something went wrong
        editorSize.value = availableWidth / 2;
        ifexViewerSize.value = availableWidth / 2;
      }
    }
  }
};

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const handleWindowResize = () => {
  // Debounce the resize calculation to avoid excessive recalculations
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    calculateSizes();
    resizeTimeout = null;
  }, 100);
};

onMounted(() => {
  // Workaround for lazy loading web components in SSR
  import('../../dist/ifex-viewer.es.js').then(() => {
    mounted.value = true;
  });

  calculateSizes();

  // Add window resize listener
  window.addEventListener('resize', handleWindowResize);

  const initialEditorState = EditorState.create({
    doc: simpleSpecificationMock,
    extensions: [
      oneDark,
      basicSetup,
      yaml(),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(updated => {
        if (updated.docChanged) {
          specifications.value = updated.state.doc.toString();
        }
        if (updated.selectionSet && syncEditorPosition.value) {
          selectedEditorNode.value = getDotNotationPathOfSelectedNode(updated.state);
        }
      }),
      errorGutterCompartment.of(errorGutter(errorMap.value)),
    ],
  });

  // Custom styles for codemirror are located in custom.css
  view.value = new EditorView({
    state: initialEditorState,
    parent: codemirrorInstance.value || undefined,
  });
});

onBeforeUnmount(() => {
  if (view.value) {
    view.value.destroy();
  }

  // Remove window resize listener
  window.removeEventListener('resize', handleWindowResize);

  // Clear any pending resize timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
    resizeTimeout = null;
  }
});

watch(errorMap, newErrorMap => {
  if (!view.value) return;
  // Updates error gutter with new errors
  view.value.dispatch({
    effects: errorGutterCompartment.reconfigure(errorGutter(newErrorMap)),
  });
});
</script>

<template>
  <div class="container">
    <div class="action-row">
      <label class="sync-toggle" title="When enabled the cursor position in the editor will be synced with the viewer.">
        <input v-model="syncEditorPosition" type="checkbox" name="sync-editor-position" />
        Sync cursor position with viewer
      </label>
    </div>
    <div class="playground-container">
      <div :id="SCROLL_CONTAINER_ID" ref="editor" class="editor" :style="{ width: editorSize + 'px' }"></div>
      <div class="resizer" data-testid="resizer" @mousedown="startResizing"></div>
      <div v-if="mounted" class="ifex-viewer-playground-container" :style="{ width: ifexViewerSize + 'px' }">
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <ifex-viewer
          ref="viewer"
          :style="{ width: ifexViewerSize + 'px' }"
          :specifications="ifexSpecificationItems"
          :layout="{ sidenavPosition: 'right' }"
          :class="isDark ? 'ifex-viewer-playground dark' : 'ifex-viewer-playground'"
        ></ifex-viewer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  margin-top: 2rem;
  align-items: flex-end;
  flex-direction: column;
}

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

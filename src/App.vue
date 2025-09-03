<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div
    data-testid="ifex-viewer-container"
    :class="currentSidenavPosition === 'left' ? 'flex-row' : 'flex-row-reverse'"
    class="h-full flex min-h-full border border-gray-300 dark:border-gray-200 rounded-md overflow-hidden"
  >
    <template v-if="activeView?.length">
      <Sidenav
        :selected-node-id="selectedNode?.id ?? ''"
        :tree-model="activeView"
        :show-tabs="hasMoreThanOneLayer"
        :sidenav-position="currentSidenavPosition"
        @node-selected="onNodeSelected"
        @view-tab-changed="viewerModelStore.changeSelectedView"
        @sidenav-position-changed="changeSidenavPosition"
      />

      <div class="flex justify-center w-full pt-6 px-8 bg-white dark:bg-gray-800 overflow-auto scrollbar-gutter">
        <div class="w-full max-w-5xl flex flex-col gap-2">
          <Breadcrumbs :breadcrumbs="breadcrumbs" @breadcrumb-selected="onBreadcrumbSelected" />
          <div data-testid="detail-page-container">
            <component :is="detailPage.component" v-if="selectedNode && detailPage" :key="detailPage.key" v-bind="detailPage.props" @select-datatype-node="onNodeSelected">
              <template #[getHeadlineSlotName(detailPage.props.dotNotationFullPath)]>
                <slot :name="getHeadlineSlotName(getPublicSlotName(detailPage.props.dotNotationFullPath))"></slot>
              </template>

              <template v-for="childrenDotNotationFullPath of detailPage.props.childrenDotNotationFullPaths || []" #[childrenDotNotationFullPath]>
                <slot :name="getPublicSlotName(childrenDotNotationFullPath)"></slot>
              </template>
            </component>

            <div v-else>No item selected.</div>

            <!-- Spacer element to force that there is a padding between the last element of the detail page and the border of the viewer -->
            <div class="h-8"></div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="flex justify-center items-center flex-1 text-gray-600">
      <div class="flex gap-2 items-center">
        <ExclamationTriangleIcon class="shrink-0 size-7 text-yellow-600" />
        <h2>No API specifications have been provided!</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { Breadcrumb, BreadcrumbsIconType } from './components/breadcrumbs/types';
import Sidenav from './components/sidenav/Sidenav.vue';
import { ClipboardCopiedEvent, CopiedSuccessfulEventKey, IfexViewerProps, NodeSelectedEvent, SidenavPosition } from './types';
import { useDetailPageSelection } from './use-detail-page-selection';
import { findNodeByPath, getFullDotNotationPath, getFullPathToNode } from './utils/tree/tree';
import Breadcrumbs from './components/breadcrumbs/Breadcrumbs.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { useComplexDatatypesStore } from './stores/complex-datatypes/complex-datatypes.store.ts';
import { useViewerModelStore } from './stores/viewer-model/viewer-model.store.ts';
import { storeToRefs } from 'pinia';

const {
  specifications,
  layout = {
    sidenavPosition: 'left',
  },
} = defineProps<IfexViewerProps>();

const viewerModelStore = useViewerModelStore();
const { viewerModel, activeView, viewerModelWithoutApi } = storeToRefs(viewerModelStore);
const { changeSelection, detailPage, selectCoreLayer, selectedNode } = useDetailPageSelection(activeView, viewerModelWithoutApi);

// Keep track of the previously active node in order to restore the selection when the viewerModel changes (e.g. new specifications are loaded)
const previouslyActiveNode = ref<string | null>(null);

watch(
  () => specifications,
  (newSpecifications, oldSpecifications) => {
    if (!newSpecifications) {
      return;
    }

    if (selectedNode.value?.id) {
      const currentlySelectedNodeId = selectedNode.value.id;
      previouslyActiveNode.value = getFullDotNotationPath(currentlySelectedNodeId, viewerModelWithoutApi.value);
    }

    const nonEmptySpecifications = newSpecifications.filter(spec => !!spec?.content);

    if (nonEmptySpecifications?.length !== oldSpecifications?.length) {
      viewerModelStore.setSpecifications(nonEmptySpecifications);
    }

    let specificationsChanged = false;
    nonEmptySpecifications.forEach(newSpec => {
      const matchingNewSpec = oldSpecifications?.find(oldSpec => oldSpec.filename === newSpec.filename);
      if (matchingNewSpec) {
        if (matchingNewSpec.content !== newSpec.content) {
          specificationsChanged = true;
        }
      } else {
        specificationsChanged = true;
      }
    });

    if (specificationsChanged) {
      viewerModelStore.setSpecifications(nonEmptySpecifications);
    }
  },
  { immediate: true },
);

const emits = defineEmits<{
  specloaded: [];
  clipboardcopiedsuccessful: [payload: ClipboardCopiedEvent];
  nodeselected: [payload: NodeSelectedEvent];
  sidenavPositionChanged: [payload: SidenavPosition];
}>();

const hasMoreThanOneLayer = computed(() => viewerModel.value.layeredView.length > 1);

const onNodeSelected = (nodeId: string) => {
  changeSelection(nodeId);

  const dotNotationPath = getFullPathToNode(nodeId, viewerModelWithoutApi.value)
    ?.map(({ node }) => node.name)
    .join('.');

  if (dotNotationPath) {
    emits('nodeselected', { path: dotNotationPath });
  }
};

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const selectedNodeVal = selectedNode.value;
  if (!selectedNodeVal || selectedNode.value?.type === 'api') {
    return [];
  }

  const breadcrumbTypesWithIcon: BreadcrumbsIconType[] = ['api', 'interface', 'namespace'];

  const pathToNode = getFullPathToNode(selectedNodeVal.id, activeView.value) || [];
  return pathToNode.map(({ node, id, type }) => ({
    nodeId: id,
    text: node.name || 'Unknown',
    icon: breadcrumbTypesWithIcon.includes(type as BreadcrumbsIconType) ? (type as BreadcrumbsIconType) : undefined,
  }));
});

const onBreadcrumbSelected = (nodeId: string) => changeSelection(nodeId);

const onClipboardCopied = (payload: ClipboardCopiedEvent) => emits('clipboardcopiedsuccessful', payload);

provide(CopiedSuccessfulEventKey, onClipboardCopied);

const getHeadlineSlotName = (fullPath: string) => `${fullPath}-headline`;

// We provide a public slot name in which the dot notation is always lowercase.
// This is to ensure that the slot name is always the same, regardless of the casing of the dot notation in the
// parent application.
const getPublicSlotName = (dotNoationPath: string) => dotNoationPath.toLowerCase();

const complexDatatypeStore = useComplexDatatypesStore();

const newSpecLoaded = () => {
  previouslyActiveNode.value = null;
  complexDatatypeStore.setComplexDatatypes(activeView.value);
  emits('specloaded');
};

watch(
  activeView,
  () => {
    if (!previouslyActiveNode.value) {
      selectCoreLayer();
      newSpecLoaded();
      return;
    }

    const node = findNodeByPath(previouslyActiveNode.value, '', viewerModelWithoutApi.value);

    if (node?.id) {
      changeSelection(node.id);
    } else {
      selectCoreLayer();
    }

    newSpecLoaded();
  },
  { immediate: true },
);

const currentSidenavPosition = ref(layout.sidenavPosition);

const changeSidenavPosition = () => {
  currentSidenavPosition.value = currentSidenavPosition.value === 'left' ? 'right' : 'left';
  emits('sidenavPositionChanged', currentSidenavPosition.value);
};

/**
 * Selects a node in the sidenav by the given path.
 * @param path Path has the dot notation path starting from the root node (e.g. root-namespace.nested-namespace.method-1).
 * Depending on the APIs structure, the dot notation path might not be unique.
 */
const selectNode = (path: string) => {
  const node = findNodeByPath(path, '', viewerModelWithoutApi.value);
  if (node?.id) {
    changeSelection(node.id);
  }
};

defineExpose({
  selectNode,
});
</script>

<style>
/**
  DO NOT REMOVE!
  This global import of the styles is responsible for sharing it across the application.
*/
@import './style.css';
@import 'highlight.js/styles/vs2015.min.css';

/** Overwrite highlight.js styles */
.hljs-attr,
.hljs-attribute {
  color: #569cd6;
}
</style>

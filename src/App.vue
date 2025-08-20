<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="h-full flex min-h-full border border-gray-300 dark:border-gray-200 rounded-md overflow-hidden">
    <template v-if="activeView?.length">
      <Sidenav
        :selected-node-id="selectedNode?.id ?? ''"
        :tree-model="activeView"
        :show-tabs="hasMoreThanOneLayer"
        @node-selected="onNodeSelected"
        @view-tab-changed="changeSelectedView"
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
import { getViewerModel, ViewerModel } from './model/specification-model';
import { ClipboardCopiedEvent, CopiedSuccessfulEventKey, IfexViewerProps, NodeSelectedEvent } from './types';
import { IFEXTreeModelNode } from './types/node';
import { useDetailPageSelection } from './use-detail-page-selection';
import { findNodeByPath, getFullPathToNode } from './utils/tree/tree';
import Breadcrumbs from './components/breadcrumbs/Breadcrumbs.vue';
import { ViewTabs } from './components/sidenav/types.ts';
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { useComplexDatatypesStore } from './stores/complex-datatypes/complex-datatypes.store.ts';

const { specifications } = defineProps<IfexViewerProps>();

const givenSpecifications = ref<IfexViewerProps['specifications']>([]);

watch(
  () => specifications,
  (newSpecifications, oldSpecifications) => {
    if (!newSpecifications) {
      return;
    }

    const nonEmptySpecifications = newSpecifications.filter(spec => !!spec?.content);

    if (nonEmptySpecifications?.length !== oldSpecifications?.length) {
      givenSpecifications.value = nonEmptySpecifications;
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
      givenSpecifications.value = nonEmptySpecifications;
    }
  },
  { immediate: true },
);

const emits = defineEmits<{ specloaded: []; clipboardcopiedsuccessful: [payload: ClipboardCopiedEvent]; nodeselected: [payload: NodeSelectedEvent] }>();

const selectedView = ref<'mergeView' | 'layeredView'>('mergeView');

const changeSelectedView = (updatedView: string) => {
  selectedView.value = (updatedView as ViewTabs) === ViewTabs.LAYERED_VIEW ? 'layeredView' : 'mergeView';
};

const viewerModel = computed<ViewerModel>(() => {
  if (!Array.isArray(givenSpecifications.value) || !givenSpecifications.value?.length) {
    return {
      mergeView: null,
      layeredView: [],
    };
  }

  return getViewerModel(givenSpecifications.value);
});

const activeView = computed<IFEXTreeModelNode[]>(() => {
  if (selectedView.value === 'mergeView') {
    return viewerModel.value.mergeView ? [viewerModel.value.mergeView] : [];
  }

  return viewerModel.value.layeredView;
});

const viewerModelWithoutApi = computed(() => removeApiElements(activeView.value));

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

const { changeSelection, detailPage, selectCoreLayer, selectedNode } = useDetailPageSelection(activeView, viewerModelWithoutApi);

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

watch(
  activeView,
  () => {
    selectCoreLayer();
    complexDatatypeStore.setComplexDatatypes(activeView.value);
    emits('specloaded');
  },
  { immediate: true },
);

const removeApiElements = (tree: IFEXTreeModelNode[]): IFEXTreeModelNode[] => {
  const result: IFEXTreeModelNode[] = [];

  tree.forEach(node => {
    if (node.type === 'api' && node.children) {
      result.push(...node.children);
    }
  });

  return result;
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

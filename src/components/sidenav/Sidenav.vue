<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div ref="sidenavEl" :class="sidenavPosition === 'left' ? 'flex-row' : 'flex-row-reverse'" class="flex h-full self-stretch bg-gray-100 dark:bg-gray-900" data-testid="sidenav">
    <div class="flex flex-col h-full">
      <div class="p-4 flex justify-between items-center">
        <h1>
          <img src="../../assets/logo.svg" type="image/svg+xml" class="h-10" alt="IFEX Logo" />
        </h1>
        <button
          class="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
          data-testid="btn-change-sidenav-position"
          title="Change the position of the side-navigation"
          @click="emits('sidenavPositionChanged')"
        >
          <ViewLeftIcon v-if="sidenavPosition === 'left'" data-testid="view-left-icon" class="size-6" />
          <ViewRightIcon v-else data-testid="view-right-icon" class="size-6" />
        </button>
      </div>
      <div
        :id="SCROLL_CONTAINER_ID"
        :style="{ width: sidenavSize + 'px' }"
        class="flex flex-col gap-2 h-full border-t border-t-gray-300 px-4 pt-3 pb-7 overflow-auto self-stretch relative scrollbar-gutter"
      >
        <!-- top-auto class required so that the div stays sticky only on the x-axis -->
        <div class="flex flex-col gap-3 sticky left-0 top-auto bg-gray-100 dark:bg-gray-900">
          <Tabs v-if="showTabs" :tabs="[ViewTabs.MERGE_VIEW, ViewTabs.LAYERED_VIEW]" data-testid="view-tabs" @tab-changed="onTabChange" />

          <SearchInput @query-updated="value => (searchValue = value)" />

          <div v-if="!searchValue" class="flex justify-between items-center">
            <Text class="text-md tracking-wide">Specification</Text>

            <Button
              v-if="allNodesExpanded"
              class="text-base flex items-center gap-1"
              variant="secondary"
              size="s"
              title="Collapse all nodes"
              data-testid="sidenav-collapse-btn"
              @clicked="collapseAllNodes"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5 stroke-gray-900 dark:stroke-gray-100">
                <g id="Frame">
                  <path id="Vector" d="M15.75 5L12 8.75L8.25 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path id="Vector_2" d="M15.75 18.5L12 14.75L8.25 18.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              </svg>
              Collapse
            </Button>
            <Button
              v-else
              class="text-base flex items-center gap-1"
              variant="secondary"
              size="s"
              title="Expand all nodes"
              data-testid="sidenav-expand-btn"
              @clicked="expandAllNodes"
            >
              <ChevronUpDownIcon class="size-5 dark:text-gray-100" />Expand
            </Button>
          </div>
        </div>

        <SearchResults
          v-if="searchValue.length"
          :search-results="searchResults"
          :search-query="searchValue"
          @search-result-selected="searchResult => onNodeSelected(searchResult.id)"
        />

        <template v-else>
          <template v-for="node of treeNodes" :key="node.id">
            <SidenavItem :node="node" @toggle-children="onToggleChildren" @selected="onNodeSelected" />
          </template>
        </template>
      </div>
    </div>
    <div
      class="block cursor-col-resize w-[6px] bg-gray-300 border-x-2 border-l-gray-100 dark:border-l-gray-900 border-r-white dark:border-r-gray-800 hover:border-x-gray-600 dark:bg-gray-400 hover:bg-gray-600 transition-colors"
      data-testid="resizer"
      @mousedown="startResizing"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import Button from '../shared/components/button/Button.vue';
import { useTree } from './composables/use-tree';
import SidenavItem from './sidenav-item/SidenavItem.vue';
import { SidenavProps, ViewTabs } from './types';
import Tabs from '../shared/components/tabs/Tabs.vue';
import SearchInput from './search-input/SearchInput.vue';
import { useSearch } from './composables/use-search.ts';
import Text from '../shared/components/text/Text.vue';
import SearchResults from './search-results/SearchResults.vue';
import ViewLeftIcon from '../shared/components/icons/ViewLeftIcon.vue';
import ViewRightIcon from '../shared/components/icons/ViewRightIcon.vue';

const { treeModel, selectedNodeId, showTabs = true, sidenavPosition } = defineProps<SidenavProps>();

// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{ (e: 'nodeSelected', nodeId: string): void; (e: 'viewTabChanged', tabName: ViewTabs): void; (e: 'sidenavPositionChanged'): void }>();

const SCROLL_CONTAINER_ID = 'scroll-container';

const searchValue = ref('');

const treeModelRef = computed(() => treeModel);

const { searchResults } = useSearch(searchValue, treeModelRef);

const { collapseAllNodes, expandAllNodes, onToggleChildren, treeNodes, allNodesExpanded } = useTree(treeModelRef, () => selectedNodeId);

const onNodeSelected = (nodeId: string) => {
  emits('nodeSelected', nodeId);
};

const sidenavSize = ref(350); // TODO: set initial size dynamically by the current screensize
const sidenavEl = ref<HTMLDivElement | null>(null);

// TODO: set min-width for sidenav
const startResizing = () => {
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', resize);
  });
};

const onTabChange = (tabName: string) => {
  emits('viewTabChanged', tabName as ViewTabs);
  // When switching tabs we want to collapse all nodes
  // Otherwise the collapse button could possibly be in
  // the wrong state when switching forth and back
  // between tabs because the nodes have different ids in the tree
  expandAllNodes();
};

const resize = (event: MouseEvent) => {
  if (!sidenavEl.value) {
    return;
  }

  const { left, right } = sidenavEl.value.getBoundingClientRect();

  if (sidenavPosition === 'left') {
    sidenavSize.value = event.x - left;
  } else {
    sidenavSize.value = right - event.x;
  }
};
</script>

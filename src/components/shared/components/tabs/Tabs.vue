<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="bg-gray-200 dark:bg-gray-800 p-[3px] rounded-md flex relative h-10">
    <div class="slider absolute inset-y-[3px] inset-x-[3px] bg-gray-100 dark:bg-gray-700 rounded-md shadow-md transition-all duration-500 ease-out" :style="sliderStyle"></div>
    <button
      v-for="tab of tabs"
      :key="tab"
      class="cursor-pointer relative z-10 rounded-md text-base py-1 px-4 flex-1 tracking-wide transition-colors duration-200 text-ellipsis text-nowrap overflow-hidden"
      :class="{ 'text-gray-700 dark:text-gray-300 cursor-default': tab === activeTab, 'text-gray-700 dark:text-gray-300': tab !== activeTab }"
      role="tab"
      :aria-selected="tab === activeTab"
      @click="setActiveTab(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { TabsProps } from './types.ts';
import { ref, computed } from 'vue';

const { tabs } = defineProps<TabsProps>();

const emits = defineEmits<{ (e: 'tabChanged', tab: string): void }>(); // eslint-disable-line no-unused-vars

const activeTab = ref(tabs[0]);
const activeTabIndex = computed(() => tabs.indexOf(activeTab.value));

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  emits('tabChanged', tab);
};

const sliderStyle = computed(() => ({
  width: `calc(${100 / tabs.length}% - 3px)`,
  transform: `translateX(${activeTabIndex.value * 100}%)`,
}));
</script>

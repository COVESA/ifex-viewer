<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div
    class="w-full h-10 border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-3 pr-1 rounded-md flex items-center hover:border-primary focus-within:border-primary transition-colors duration-300 text-gray-500 gap-1"
  >
    <MagnifyingGlassIcon class="size-6 shrink-0 mr-2" />
    <input
      ref="searchInput"
      v-model="searchValue"
      class="w-full h-full outline-hidden dark:bg-gray-800 [&::-webkit-search-cancel-button]:hidden"
      placeholder="Search ..."
      type="search"
    />
    <Button v-if="searchValue.length" aria-label="Reset search" size="s" @click="resetSearchValue"><XMarkIcon class="size-5 cursor-pointer text-gray-400" /></Button>
    <div class="border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 border text-sm px-1 py-0.5 text-gray-400 rounded-md text-nowrap">
      <template v-if="getPlatform() === Platform.MacOs">&#8984; G</template>
      <template v-else>Ctrl+G</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '../../shared/components/button/Button.vue';
import { watchDebounced, useEventListener } from '@vueuse/core';
import { useTemplateRef } from 'vue';

enum Platform {
  MacOs = 'MacOs', // eslint-disable-line no-unused-vars
  Windows = 'Windows', // eslint-disable-line no-unused-vars
  Other = 'Meta', // eslint-disable-line no-unused-vars
}

const emits = defineEmits<{
  queryUpdated: [query: string];
}>();

const searchValue = defineModel<string>({ default: '' });

const input = useTemplateRef<HTMLInputElement>('searchInput');

watchDebounced(searchValue, () => emits('queryUpdated', searchValue.value), { debounce: 350, maxWait: 500 });

const resetSearchValue = () => (searchValue.value = '');

const handleKeydown = (event: KeyboardEvent) => {
  const isMacOs = getPlatform() === Platform.MacOs;
  const firstKey = isMacOs ? event.metaKey : event.ctrlKey;

  if (input.value && firstKey && event.key === 'g') {
    event.preventDefault();
    input.value.focus();
  }
};

useEventListener(window, 'keydown', handleKeydown);

const getPlatform = () => {
  let platform = 'other';
  if ('userAgentData' in navigator) {
    platform = (navigator.userAgentData as { platform: string }).platform.toLowerCase();
  } else if ('platform' in navigator) {
    platform = navigator.platform.toLowerCase();
  }

  if (platform.includes('mac')) {
    return Platform.MacOs;
  } else if (platform.includes('win')) {
    return Platform.Windows;
  } else {
    return Platform.Other;
  }
};
</script>

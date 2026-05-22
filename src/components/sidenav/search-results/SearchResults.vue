<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="flex flex-col">
    <p v-if="searchResults.length === 0" class="text-center text-gray-400">
      No search results found<template v-if="searchQuery.length > 0"> for "{{ searchQuery }}"</template>.
    </p>
    <template v-else>
      <div
        v-for="(searchResult, i) of searchResults"
        :key="searchResult.title"
        class="flex items-center justify-between p-2 focus:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-500"
        :class="{ 'border-b border-gray-200 dark:border-gray-700': i !== searchResults.length - 1 }"
        data-testid="search-result-item"
        @click="emits('searchResultSelected', searchResult)"
      >
        <div class="overflow-hidden">
          <h6 class="text-md dark:text-gray-200 overflow-hidden text-ellipsis text-nowrap">{{ searchResult.title }}</h6>
          <p class="text-gray-400 overflow-hidden text-ellipsis text-nowrap text-sm">{{ searchResult.description }}</p>
        </div>
        <Badge size="s" :type="searchResult.type" class="ml-1 shrink-0" />
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { SearchResult, SearchResultsProps } from './types.ts';
import Badge from '../../shared/components/badge/Badge.vue';

defineProps<SearchResultsProps>();

const emits = defineEmits<{ (e: 'searchResultSelected', searchResult: SearchResult): void }>();
</script>

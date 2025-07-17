<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="flex justify-start items-center gap-3 h-6 w-full" data-testid="breadcrumbs">
    <template v-for="(breadcrumb, i) of breadcrumbs" :key="breadcrumb.nodeId">
      <LayerIcon
        v-if="breadcrumb.icon === 'api'"
        class="size-6 shrink-0"
        :class="{
          'text-gray-900 dark:text-gray-200': breadcrumbs.length - 1 === i,
          'text-gray-600 dark:text-gray-400': breadcrumbs.length - 1 !== i,
        }"
      />
      <CpuChipIcon
        v-if="breadcrumb.icon === 'interface'"
        class="size-6 shrink-0"
        :class="{
          'text-gray-900 dark:text-gray-200': breadcrumbs.length - 1 === i,
          'text-gray-600 dark:text-gray-400': breadcrumbs.length - 1 !== i,
        }"
      />
      <NamespaceIcon
        v-if="breadcrumb.icon === 'namespace'"
        class="size-6 shrink-0"
        :class="{
          'text-gray-900 dark:text-gray-200': breadcrumbs.length - 1 === i,
          'text-gray-600 dark:text-gray-400': breadcrumbs.length - 1 !== i,
        }"
      />

      <button
        :data-testid="'breadcrumb-' + breadcrumb.nodeId"
        class="text-base text-ellipsis overflow-hidden text-nowrap text-left"
        :class="{
          'cursor-default text-gray-900 dark:text-gray-200': breadcrumbs.length - 1 === i,
          'cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-200 transition-colors': breadcrumbs.length - 1 !== i,
        }"
        :title="breadcrumb.text"
        @click="selectBreadcrumb(breadcrumb.nodeId, breadcrumbs.length - 1 === i)"
      >
        {{ breadcrumb.text }}
      </button>
      <ChevronRightIcon v-if="breadcrumbs.length - 1 !== i" class="size-4 text-gray-600 dark:text-gray-400 shrink-0" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ChevronRightIcon, CpuChipIcon } from '@heroicons/vue/24/outline';
import { BreadcrumbsProps } from './types';
import LayerIcon from '../shared/components/icons/LayerIcon.vue';
import NamespaceIcon from '../shared/components/icons/NamespaceIcon.vue';

defineProps<BreadcrumbsProps>();

// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{ (e: 'breadcrumbSelected', nodeId: string): void }>();

const selectBreadcrumb = (nodeId: string, isLast: boolean) => {
  if (!isLast) {
    emits('breadcrumbSelected', nodeId);
  }
};
</script>

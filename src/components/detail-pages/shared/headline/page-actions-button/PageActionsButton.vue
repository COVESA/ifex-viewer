<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="flex ml-auto relative">
    <Button size="s" variant="tertiary" class="flex gap-1.5 rounded-l-xl rounded-r-none" @click="copy(yamlData)">
      <div v-if="copied">
        <ClipboardDocumentCheckIcon class="size-5" />
      </div>
      <div v-else>
        <ClipboardDocumentIcon class="size-5" />
      </div>
      YAML
    </Button>
    <Button
      size="s"
      variant="tertiary"
      class="ignore-open-dropdown-btn rounded-l-none rounded-r-xl border-l-0"
      data-testid="btn-expand-view-options"
      @clicked="dropdownOpen = !dropdownOpen"
    >
      <ChevronUpIcon v-if="dropdownOpen" class="size-4" />
      <ChevronDownIcon v-else class="size-4" />
    </Button>
    <div v-if="dropdownOpen" ref="dropdown" class="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-10">
      <ul class="p-1.5">
        <li>
          <Button size="s" variant="secondary" class="w-full hover:!bg-gray-100 dark:hover:!bg-gray-900" @clicked="toggleYamlView"> View as YAML </Button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside, useClipboard } from '@vueuse/core';
import { computed, inject, ref, useTemplateRef, watch } from 'vue';
import { CopiedSuccessfulEventKey } from '../../../../../types.ts';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
import Button from '../../../../shared/components/button/Button.vue';
import { PageActionsButtonProps } from './types.ts';
import YAML from 'yaml';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';

const { rawData } = defineProps<PageActionsButtonProps>();

const emits = defineEmits(['toggle-yaml-view']);

const dropdownOpen = ref(false);

const { copy, copied } = useClipboard();

const yamlData = computed(() => {
  try {
    return YAML.stringify(rawData);
  } catch (error) {
    return `Failed to convert data to YAML: err ${error}`;
  }
});

const clipboardcopiedsuccessful = inject(CopiedSuccessfulEventKey);

watch(copied, () => {
  // Check exactly for true because copied will be reset to false after a while
  // and, we don't want to emit the event again
  if (copied.value === true && clipboardcopiedsuccessful) {
    clipboardcopiedsuccessful({ data: yamlData.value, type: 'nodeYamlContent' });
  }
});

const dropdownRef = useTemplateRef<HTMLElement>('dropdown');
const ignoreElSelector = '.ignore-open-dropdown-btn';

onClickOutside(dropdownRef, () => (dropdownOpen.value = false), { ignore: [ignoreElSelector] });

const toggleYamlView = () => {
  emits('toggle-yaml-view');
  dropdownOpen.value = false;
};
</script>

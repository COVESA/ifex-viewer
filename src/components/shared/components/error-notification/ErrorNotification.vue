<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="grid grid-cols-[1.7rem_auto_1.7rem] notification-grid rounded-md bg-gray-100 dark:bg-gray-900 p-4 gap-x-4 gap-y-3 items-start" data-testid="error-notification">
    <ExclamationCircleIcon class="shrink-0 size-7 text-red-600 col-start-1 col-end-2 self-center" />
    <h4 class="col-start-2 col-end-3 text-lg font-medium leading-5 mt-1 text-gray-900 dark:text-gray-200 text-ellipsis text-nowrap overflow-hidden self-center">
      Error in {{ validationError.instancePath }}
    </h4>
    <ToggleButton class="col-start-3 col-end-4 self-center" :expanded="false" @toggled="expandedState => (detailsExpanded = expandedState)" />

    <div class="flex flex-col gap-3 w-full col-start-2 col-end-4">
      <Text v-if="validationError.message?.length">{{ validationError.message }}</Text>

      <div v-if="detailsExpanded" data-testid="error-notification-details" class="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md py-2 pl-4 pr-12 relative">
        <div class="absolute right-2 top-2">
          <CopyButton size="m" :data="JSON.stringify(validationError)" clip-board-action-type="validationError" />
        </div>

        <!-- We need to overwrite the styling of highlight.js like background because here again because it can't
        inherit it from parent div because of lower specificity -->
        <pre><code ref="code" class="text-wrap break-all text-sm bg-white! dark:bg-gray-800!">{{ JSON.stringify(validationError) }}</code></pre>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid';
import { ErrorNotificationProps } from './types';
import { ref, useTemplateRef, watch } from 'vue';
import Text from '../text/Text.vue';
import CopyButton from '../copy-button/CopyButton.vue';
import ToggleButton from '../toggle-button/ToggleButton.vue';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);
defineProps<ErrorNotificationProps>();

const detailsExpanded = ref(false);

const codeBlock = useTemplateRef<HTMLElement>('code');

watch(codeBlock, () => {
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value);
  }
});
</script>

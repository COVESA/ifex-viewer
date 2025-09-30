<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <Button size="s" variant="tertiary" class="flex gap-1.5 ml-auto" @click="copy(yamlData)">
    <div v-if="copied" data-testid="copy-successful-btn">
      <ClipboardDocumentCheckIcon class="size-5" />
    </div>
    <div v-else data-testid="copy-btn">
      <ClipboardDocumentIcon class="size-5" />
    </div>
    YAML
  </Button>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { computed, inject, watch } from 'vue';
import { CopiedSuccessfulEventKey } from '../../../../../types.ts';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
import Button from '../../../../shared/components/button/Button.vue';
import { PageActionsButtonProps } from './types.ts';
import YAML from 'yaml';

const { rawData } = defineProps<PageActionsButtonProps>();

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
</script>

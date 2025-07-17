<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <!--  TODO: accessibility -> label for button etc. -->
  <Button :size="size" @clicked="copy(data)">
    <div v-if="copied" data-testid="copy-successful-btn">
      <ClipboardDocumentCheckIcon :class="iconSize" />
    </div>
    <div v-else data-testid="copy-btn">
      <ClipboardDocumentIcon :class="iconSize" />
    </div>
  </Button>
</template>
<script setup lang="ts">
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
import { useClipboard } from '@vueuse/core';
import { computed, inject, watch } from 'vue';
import { CopiedSuccessfulEventKey } from '../../../../types';
import Button from '../button/Button.vue';
import { CopyButtonProps } from './types';

const { size = 'm', data, clipBoardActionType = 'dotNotation' } = defineProps<CopyButtonProps>();

const { copy, copied } = useClipboard();

const iconSize = computed(() => {
  const sizeClasses = {
    s: 'size-5',
    m: 'size-6',
    l: 'size-7',
  };

  return sizeClasses[size];
});

const clipboardcopiedsuccessful = inject(CopiedSuccessfulEventKey);

watch(copied, () => {
  // Check exactly for true because copied will be reset to false after a while
  // and, we don't want to emit the event again
  if (copied.value === true && clipboardcopiedsuccessful) {
    clipboardcopiedsuccessful({ data, type: clipBoardActionType });
  }
});
</script>

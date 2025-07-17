<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="flex flex-col gap-3" data-testid="headline">
    <div class="flex gap-3 items-center">
      <h2 class="font-medium text-3xl dark:text-gray-100 text-ellipsis overflow-hidden" data-testid="headline-title" :title="headline">{{ headline }}</h2>
      <Badge v-if="pageType" :type="pageType" />
      <slot></slot>
    </div>

    <div v-if="dotNotation?.length" class="flex gap-2 items-center">
      <span class="text-sm italic tracking-wide text-gray-700 dark:text-gray-300 text-ellipsis overflow-hidden">{{ dotNotation }}</span>
      <CopyButton :data="dotNotation" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { HeadlineProps } from './types';
import Badge from '../../../shared/components/badge/Badge.vue';
import CopyButton from '../../../shared/components/copy-button/CopyButton.vue';

defineProps<HeadlineProps>();
</script>

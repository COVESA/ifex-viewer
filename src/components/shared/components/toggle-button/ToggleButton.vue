<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <Button data-testid="toggle-btn" class="text-base flex items-center" @clicked="toggleExpandedState">
    <span v-if="expandedState" :class="toggleBtnStyles" data-testid="toggle-expanded-icon">
      <ChevronUpIcon class="size-5" />
      <template v-if="withLabel">Collapse</template>
    </span>
    <span v-else :class="toggleBtnStyles" data-testid="toggle-collapsed-icon">
      <ChevronDownIcon class="size-5" />
      <template v-if="withLabel">Expand</template>
    </span>
  </Button>
</template>
<script lang="ts" setup>
import { ToggleButtonProps } from './types';
import Button from '../button/Button.vue';
import { ref } from 'vue';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(defineProps<ToggleButtonProps>(), { expanded: true, withLabel: false });

// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{ (e: 'toggled', expandedState: boolean): void }>();

const expandedState = ref(props.expanded);

const toggleBtnStyles = 'flex items-center gap-1 text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors leading-4';

const toggleExpandedState = () => {
  expandedState.value = !expandedState.value;
  emits('toggled', expandedState.value);
};
</script>

<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <!-- TODO: emit focus event, etc. -->
  <button
    :class="`${sizeClasses} ${variantClasses} block p-1 text-gray-900 dark:text-gray-300 hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-900 hover:text-gray-600 focus:text-gray-600 dark:hover:text-gray-400 dark:focus:text-gray-400 rounded-lg cursor-pointer transition-colors`"
    @click="emits('clicked')"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ButtonProps, ButtonSize, ButtonVariant } from './types';

const props = withDefaults(defineProps<ButtonProps>(), { size: 'm', variant: 'primary' });

const emits = defineEmits(['clicked']);

const sizeClasses = computed(() => {
  const sizeClassesMap: Record<ButtonSize, string> = {
    s: 'h-7 w-auto text-sm',
    m: 'h-8 w-auto',
    l: 'h-9 w-auto',
  };

  return sizeClassesMap[props.size];
});

const variantClasses = computed(() => {
  const variantClassesMap: Record<ButtonVariant, string> = {
    primary: '',
    secondary: 'dark:bg-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:border-gray-700',
    tertiary: 'px-3 border border-gray-300 dark:bg-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:border-gray-700',
  };

  return variantClassesMap[props.variant];
});
</script>

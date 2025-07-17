<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div :class="classes" :data-testid="`badge-${type}`">
    <template v-if="requiresSlot">
      <div class="text-ellipsis text-nowrap overflow-hidden">
        <slot></slot>
      </div>
    </template>
    <span v-else class="text-ellipsis text-nowrap overflow-hidden">{{ label }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { BadgeType, BadgeSize, BadgeProps } from './types';

const props = withDefaults(defineProps<BadgeProps>(), { size: 'm', type: 'primary' });

const stylesMap: {
  base: string;
  type: Record<BadgeType, string>;
  size: Record<BadgeSize, string>;
} = {
  base: 'tracking-wide flex justify-center items-center rounded-xl text-center text-base px-4 max-w-full min-w-0',
  type: {
    primary: 'bg-primary text-white',
    secondary: 'bg-gray-500 text-gray-100',
    method: 'bg-yellow-800 text-yellow-300',
    event: 'bg-blue-800 text-blue-300',
    struct: 'bg-gray-800 text-gray-300 dark:bg-gray-300 dark:text-gray-800',
    interface: 'bg-blue-800 text-blue-200',
    namespace: 'bg-blue-500 text-blue-100',
    primitiveType: 'bg-green-800 text-green-300',
    complexType: 'bg-gray-800 text-gray-300 dark:bg-gray-300 dark:text-gray-800',
    enumeration: 'bg-gray-700 text-gray-200',
    typedef: 'bg-gray-600 text-gray-100',
    property: 'bg-gray-300 text-gray-800',
  },
  size: { s: 'h-5 text-xs', m: 'h-6 text-sm', l: 'h-7 text-base' },
};

const requiresSlot = computed(() => {
  const badgeType = props.type;
  return badgeType === 'primary' || badgeType === 'primitiveType' || badgeType === 'complexType' || badgeType === 'secondary';
});

const classes = computed(() => {
  const { base, type, size } = stylesMap;

  const classes = [base];

  const typesClass = type[props.type];
  if (typesClass) {
    classes.push(typesClass);
  }

  const sizeClass = size[props.size];
  if (sizeClass) {
    classes.push(sizeClass);
  }

  return classes.join(' ');
});

const label = computed(() => {
  switch (props.type) {
    case 'interface':
      return 'Interface';
    case 'namespace':
      return 'Namespace';
    case 'event':
      return 'Event';
    case 'method':
      return 'Method';
    case 'struct':
      return 'Struct';
    case 'enumeration':
      return 'Enumeration';
    case 'typedef':
      return 'Typedef';
    case 'property':
      return 'Property';
    case 'primary':
    case 'secondary':
    default:
      return '';
  }
});
</script>

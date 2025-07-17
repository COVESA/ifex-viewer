<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div :id="'sidenav-item-' + node.id" :data-testid="'sidenav-item-' + node.id" class="flex flex-col min-w-full w-max self-stretch">
    <div
      :class="{
        [`${styles.nodeType.base}`]: node?.type !== 'wrapper',
        [`${styles.nodeType.base} ${styles.nodeType.wrapper}`]: node?.type === 'wrapper',
        [`${styles.nodeType.base} ${styles.nodeType.selected}`]: node?.selected,
      }"
      :style="{ 'padding-left': nodePadding }"
    >
      <button v-if="node.children?.length" data-testid="sidenav-item-toggle" @click="emits('toggleChildren', { id: node.id, expanded: !node.expanded })">
        <ChevronRightIcon :class="chevronClasses" />
      </button>
      <div v-if="node.type === 'interface'" data-testid="sidenav-item-interface-icon"><CpuChipIcon class="size-6 dark:text-gray-100" /></div>
      <div v-if="node.type === 'api'" data-testid="sidenav-item-layer-icon">
        <LayerIcon class="size-6 dark:text-gray-100" />
      </div>
      <div v-if="node.type === 'namespace'" data-testid="sidenav-item-namespace-icon">
        <NamespaceIcon class="size-6 dark:text-gray-100" />
      </div>
      <button
        data-testid="sidenav-item-node"
        :class="{
          [`${styles.node?.base} ${styles.node?.default}`]: node.type !== 'wrapper' && !node.selected,
          [`${styles.node?.base} ${styles.node?.selected}`]: node.selected,
          [`${styles.node?.wrapper}`]: node.type === 'wrapper',
        }"
        :tabindex="node.type === 'wrapper' ? -1 : undefined"
        @click="onSelected"
      >
        {{ node.label }}
        <span v-if="node.hasError" data-testid="sidenav-item-error-icon"><ExclamationCircleIcon class="size-6 text-red-600" /></span>
      </button>
      <template v-if="node.badges?.length">
        <Badge v-for="badge of node.badges" :key="badge.label" :type="badge.type" size="s">{{ badge.label }}</Badge>
      </template>
    </div>

    <template v-if="node.children?.length && node.expanded">
      <SidenavItem v-for="child of node.children" :key="child.id" :node="child" @toggle-children="evt => emits('toggleChildren', evt)" @selected="evt => emits('selected', evt)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid';
import { NodeToggleEvent, SidenavItemProps } from './types';
import { computed } from 'vue';
import { ChevronRightIcon, CpuChipIcon } from '@heroicons/vue/24/outline';
import Badge from '../../shared/components/badge/Badge.vue';
import LayerIcon from '../../shared/components/icons/LayerIcon.vue';
import NamespaceIcon from '../../shared/components/icons/NamespaceIcon.vue';

type StylesMap = {
  nodeType: { base: string; wrapper: string; selected: string };
  chevronIcon: { base: string; wrapper: string; default: string; expanded: string };
  node: { base: string; default: string; selected: string; wrapper: string };
};

const props = defineProps<SidenavItemProps>();

// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{ (e: 'toggleChildren', event: NodeToggleEvent): void; (e: 'selected', nodeId: string): void }>();

const styles = computed<StylesMap>(() => ({
  nodeType: {
    base: 'flex gap-3 items-center mb-1 leading-4	h-8 pr-4 transition-colors',
    wrapper: 'text-gray-400 dark:text-gray-300 select-none',
    selected: 'bg-gray-200 dark:bg-gray-800 rounded-md text-primary',
  },
  chevronIcon: {
    base: 'size-4 transition-all cursor-pointer',
    wrapper: 'text-gray-400 dark:text-gray-100 hover:text-gray-300 focus:text-gray-300 dark:hover:text-gray-200 dark:focus:text-gray-200',
    default: 'text-gray-900 dark:text-gray-300 hover:text-gray-700 focus:text-gray-700 dark:hover:text-gray-200 dark:focus:text-gray-200',
    expanded: 'rotate-90',
  },
  node: {
    base: 'cursor-pointer transition-colors dark:text-gray-100 text-nowrap select-none inline-flex gap-3 items-center',
    default: 'hover:text-gray-300 dark:hover-text-gray-200 focus:text-gray-300',
    selected: 'dark:text-primary hover:text-primary-light focus:text-primary-light dark:hover:text-primary-light dark:focus:text-primary-light',
    wrapper: 'cursor-default',
  },
}));

const chevronClasses = computed(() => {
  const node = props.node;
  const { base, wrapper, default: defaultClass, expanded } = styles.value.chevronIcon;

  const classes = [base];

  if (node?.type === 'wrapper') {
    classes.push(wrapper);
  } else {
    classes.push(defaultClass);
  }

  if (node?.expanded) {
    classes.push(expanded);
  }

  return classes.join(' ');
});

const nodePadding = computed(() => {
  // JIT compiler of tailwind doesn't support to build class names dynamically thats why we have to use inline style for that
  const padding = (props.node?.level || 0) * 32 + 16; // +16 because we want to have some padding in front of the chevron icon when the node is selected
  return `${padding}px`;
});

const onSelected = () => {
  if (props.node.type !== 'wrapper') {
    emits('selected', props.node.id);
  }
};
</script>

<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div
    class="w-full h-10 border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-3 pr-1 rounded-md flex items-center hover:border-primary focus-within:border-primary transition-colors duration-300 text-gray-500 gap-1"
  >
    <MagnifyingGlassIcon class="size-6 shrink-0 mr-2" />
    <input
      ref="searchInput"
      v-model="searchValue"
      class="w-full h-full outline-hidden dark:bg-gray-800 [&::-webkit-search-cancel-button]:hidden"
      placeholder="Search ..."
      type="search"
    />
    <Button v-if="searchValue.length" aria-label="Reset search" size="s" @click="resetSearchValue"><XMarkIcon class="size-5 cursor-pointer text-gray-400" /></Button>
    <div class="border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 border text-sm px-1 py-0.5 text-gray-400 rounded-md text-nowrap">
      {{ displayShortcut }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '../../shared/components/button/Button.vue';
import { watchDebounced, useEventListener } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';
import { IfexViewerSearchShortcut } from '../../../types.ts';

type Platform = 'mac' | 'windows' | 'linux' | 'other';

interface ParsedShortcut {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const emits = defineEmits<{
  queryUpdated: [query: string];
}>();

const { searchShortcut } = defineProps<{
  searchShortcut?: IfexViewerSearchShortcut;
}>();

const searchValue = defineModel<string>({ default: '' });

const input = useTemplateRef<HTMLInputElement>('searchInput');
const defaultShortcuts: Record<Exclude<Platform, 'other'>, string> = {
  mac: 'Meta+G',
  windows: 'Control+G',
  linux: 'Control+G',
};
const modifierNames = ['meta', 'cmd', 'command', 'control', 'ctrl', 'alt', 'option', 'shift'];

watchDebounced(searchValue, () => emits('queryUpdated', searchValue.value), { debounce: 350, maxWait: 500 });

const resetSearchValue = () => (searchValue.value = '');

const shortcut = computed(() => {
  const platform = getPlatform();
  const configuredShortcut = platform === 'other' ? searchShortcut?.default : searchShortcut?.[platform] ?? searchShortcut?.default;
  const parsedShortcut = configuredShortcut ? parseShortcut(configuredShortcut) : undefined;

  return parsedShortcut ?? parseShortcut(platform === 'mac' ? defaultShortcuts.mac : defaultShortcuts.windows)!;
});

const displayShortcut = computed(() => {
  const { key, metaKey, ctrlKey, altKey, shiftKey } = shortcut.value;
  const modifiers = [
    metaKey && (getPlatform() === 'mac' ? '⌘' : 'Meta'),
    ctrlKey && 'Ctrl',
    altKey && 'Alt',
    shiftKey && 'Shift',
  ].filter(Boolean);

  return [...modifiers, key.toUpperCase()].join(getPlatform() === 'mac' ? ' ' : '+');
});

const handleKeydown = (event: KeyboardEvent) => {
  const configuredShortcut = shortcut.value;

  if (
    input.value &&
    matchesShortcutKey(event, configuredShortcut.key) &&
    event.metaKey === configuredShortcut.metaKey &&
    event.ctrlKey === configuredShortcut.ctrlKey &&
    event.altKey === configuredShortcut.altKey &&
    event.shiftKey === configuredShortcut.shiftKey
  ) {
    event.preventDefault();
    input.value.focus();
  }
};

useEventListener(window, 'keydown', handleKeydown);

const getPlatform = () => {
  let platform = 'other';
  if ('userAgentData' in navigator) {
    platform = (navigator.userAgentData as { platform: string }).platform.toLowerCase();
  } else if ('platform' in navigator) {
    platform = navigator.platform.toLowerCase();
  }

  if (platform.includes('mac')) {
    return 'mac';
  } else if (platform.includes('win')) {
    return 'windows';
  } else if (platform.includes('linux')) {
    return 'linux';
  }

  return 'other';
};

const matchesShortcutKey = (event: KeyboardEvent, key: string) =>
  event.key.toLowerCase() === key || event.code.toLowerCase() === key || (key.length === 1 && event.code.toLowerCase() === `key${key}`);

const parseShortcut = (value: string): ParsedShortcut | undefined => {
  const shortcutParts = value
    .toLowerCase()
    .split('+')
    .map(part => part.trim())
    .filter(Boolean);
  const key = shortcutParts.pop() ?? '';
  const hasInvalidParts = !key || modifierNames.includes(key) || shortcutParts.some(part => !modifierNames.includes(part));

  if (hasInvalidParts) {
    return;
  }

  return {
    key,
    metaKey: shortcutParts.some(part => ['meta', 'cmd', 'command'].includes(part)),
    ctrlKey: shortcutParts.some(part => ['control', 'ctrl'].includes(part)),
    altKey: shortcutParts.some(part => ['alt', 'option'].includes(part)),
    shiftKey: shortcutParts.includes('shift'),
  };
};
</script>

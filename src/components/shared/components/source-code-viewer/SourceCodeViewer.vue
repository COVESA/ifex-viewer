<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div data-testid="source-code-editor" :class="`relative pr-12 w-full bg-gray-100 dark:bg-gray-900 rounded-md ${styling.bgColorLightTheme} ${styling.bgColorDarkTheme}`">
    <div class="absolute right-2 top-2">
      <CopyButton :data="unknownPropsYaml" clip-board-action-type="sourcecode" />
    </div>
    <!-- We need to overwrite the styling of highlight.js like background because here again because it can't
    inherit it from parent div because of lower specificity -->
    <pre><code ref="code" :class="`whitespace-pre-wrap rounded-md ${styling.bgColorLightTheme} ${styling.bgColorDarkTheme}`">{{ unknownPropsYaml }}</code></pre>
  </div>
</template>
<script setup lang="ts">
import { SourceCodeViewerProps } from './types.ts';
import { computed, useTemplateRef, watch } from 'vue';
import * as YAML from 'yaml';
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import CopyButton from '../copy-button/CopyButton.vue';

hljs.registerLanguage('yaml', yaml);

const {
  code,
  styling = {
    bgColorLightTheme: 'bg-gray-100!',
    bgColorDarkTheme: 'dark:bg-gray-900!',
  },
} = defineProps<SourceCodeViewerProps>();

const unknownPropsYaml = computed(() => YAML.stringify(code));

const codeBlock = useTemplateRef<HTMLElement>('code');

watch(codeBlock, () => {
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value);
  }
});
</script>

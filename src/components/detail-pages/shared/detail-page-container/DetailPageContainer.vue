<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <section class="flex flex-col gap-8">
    <slot name="headline"></slot>
    <div v-if="validationErrors?.length" class="flex flex-col gap-2">
      <ErrorNotification v-for="validationError of validationErrors" :key="JSON.stringify(validationError)" :validation-error="validationError" />
    </div>
    <slot name="above-description"></slot>
    <Text v-if="description?.length" data-testid="detail-page-description">{{ description }}</Text>
    <slot></slot>
    <!--    TODO: add tooltip for explaining what is meant by custom properties -->
    <template v-if="hasCustomProperties">
      <div class="flex flex-col gap-4">
        <h3 class="text-2xl font-medium dark:text-gray-100">Custom properties</h3>
        <SourceCodeViewer :code="customProperties!" />
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import ErrorNotification from '../../../shared/components/error-notification/ErrorNotification.vue';
import Text from '../../../shared/components/text/Text.vue';
import { DetailPageContainerProps } from './types';
import SourceCodeViewer from '../../../shared/components/source-code-viewer/SourceCodeViewer.vue';
import { computed } from 'vue';

const { customProperties } = defineProps<DetailPageContainerProps>();

const hasCustomProperties = computed(() => customProperties && Object.keys(customProperties).length > 0);
</script>

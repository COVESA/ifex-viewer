<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <!-- v-bind has to be the first attribute, otherwise it will overwrite other props declared before -->
  <Badge v-if="isPrimitiveType" v-bind="$props" type="primitiveType">{{ datatype }}</Badge>
  <Badge v-else v-bind="$props" type="complexType" @click="emits('selected')">
    <div class="flex items-center gap-2 cursor-pointer hover:opacity-90 focus:opacity-90 transition-opacity">
      <span class="text-ellipsis text-nowrap overflow-hidden">
        {{ datatype }}
      </span>
      <span data-testid="complex-datatype-linkout">
        <ArrowTopRightOnSquareIcon class="size-4 shrink-0" />
      </span>
    </div>
  </Badge>
</template>
<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import Badge from '../badge/Badge.vue';
import { DataTypeBadgeProps, primitiveDataTypes } from './types.ts';
import { computed } from 'vue';

const { datatype } = defineProps<DataTypeBadgeProps>();

import type { PrimitiveDataType } from './types.ts';

const emits = defineEmits(['selected']);

const isPrimitiveType = computed(() => datatype.startsWith('variant<') || primitiveDataTypes.includes(datatype as PrimitiveDataType));
</script>

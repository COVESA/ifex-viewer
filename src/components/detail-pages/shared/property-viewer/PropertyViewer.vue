<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <div class="flex flex-col gap-4" data-testid="property-viewer">
    <!-- TODO: we could provide some tooltip text what the rendered properties/arguments are about. -->
    <h3 class="flex items-center gap-3 text-2xl font-medium dark:text-gray-100">
      {{ headline }}

      <ToggleButton class="text-base" :with-label="true" :expanded="true" @toggled="expanded => (propertiesExpanded = expanded)" />
    </h3>

    <div v-if="propertiesExpanded" class="flex flex-col gap-5 bg-gray-100 dark:bg-gray-900 p-4 rounded-md" data-testid="property-viewer-container">
      <div v-for="property of properties" :key="property.name" class="flex flex-col gap-3">
        <div class="flex gap-3 items-center">
          <span v-if="property.name?.length" class="text-red-600 dark:text-red-500 text-ellipsis text-nowrap overflow-hidden">{{ property.name }}</span>
          <DataTypeBadge :datatype="property.datatype" @selected="emits('selectDatatype', property.datatype)">{{ property.datatype }}</DataTypeBadge>
          <Badge v-if="property.range" type="secondary">Range::[{{ property.range }}]</Badge>
          <Badge v-if="property.arraysize" type="secondary">Arraysize::[{{ property.arraysize.toString() }}]</Badge>
          <slot :name="parentDotNotationFullPath + '.' + property.name"></slot>
        </div>
        <Text v-if="property.description?.length">{{ property.description }}</Text>
        <SourceCodeViewer
          v-if="Object.keys(getCustomProperties(property, knownArgumentOrErrorProperties)).length > 0"
          :code="getCustomProperties(property, knownArgumentOrErrorProperties)"
          :styling="{ bgColorLightTheme: 'bg-white!', bgColorDarkTheme: 'dark:bg-gray-800!' }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ToggleButton from '../../../shared/components/toggle-button/ToggleButton.vue';
import { PropertyViewerProps } from './types';
import Badge from '../../../shared/components/badge/Badge.vue';
import Text from '../../../shared/components/text/Text.vue';
import SourceCodeViewer from '../../../shared/components/source-code-viewer/SourceCodeViewer.vue';
import { Argument, Error } from '../../../../types/ifex-core.ts';
import { getCustomProperties } from '../../../../utils/get-custom-properties/get-custom-properties.ts';
import DataTypeBadge from '../../../shared/components/datatype-badge/DataTypeBadge.vue';

defineProps<PropertyViewerProps>();

const propertiesExpanded = ref(true);

type KnownArgumentOrErrorProperties = Record<keyof (Error | Argument), undefined>;

const knownArgumentOrErrorProperties: KnownArgumentOrErrorProperties = {
  name: undefined,
  description: undefined,
  arraysize: undefined,
  datatype: undefined,
  range: undefined,
};

const emits = defineEmits<{ selectDatatype: [datatype: string] }>();
</script>

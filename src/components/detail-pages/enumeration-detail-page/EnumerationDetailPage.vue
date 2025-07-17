<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="enumeration.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="enumeration.name" :dot-notation="dotNotationFullPath" page-type="enumeration">
        <template #default>
          <DataTypeBadge :datatype="enumeration.datatype" @selected="selectDatatypeNode"> {{ enumeration.datatype }}</DataTypeBadge>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>

    <template #default>
      <div class="flex flex-col gap-4">
        <h3 class="text-2xl font-medium dark:text-gray-100">Options</h3>
        <div class="flex flex-col gap-5 bg-gray-100 dark:bg-gray-900 p-4 rounded-md" data-testid="property-viewer-container">
          <div v-for="option of enumeration.options" :key="option.name" class="flex flex-col gap-3">
            <div class="flex gap-3 items-center">
              <span class="text-red-600 dark:text-red-500">{{ option.name }}</span>
              <Badge type="secondary">Value::[{{ option.value }}]</Badge>
              <slot :name="dotNotationFullPath + '.' + option.name"></slot>
            </div>
            <Text v-if="option.description?.length">{{ option.description }}</Text>
            <SourceCodeViewer
              v-if="Object.keys(getCustomProperties(option, knownOptionProperties)).length > 0"
              :code="getCustomProperties(option, knownOptionProperties)"
              :styling="{ bgColorLightTheme: 'bg-white!', bgColorDarkTheme: 'dark:bg-gray-800!' }"
            />
          </div>
        </div>
      </div>
    </template>
  </DetailPageContainer>
</template>
<script setup lang="ts">
import Badge from '../../shared/components/badge/Badge.vue';
import Text from '../../shared/components/text/Text.vue';
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import { EnumerationDetailPageProps } from './types';
import { Enumeration, Option } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import SourceCodeViewer from '../../shared/components/source-code-viewer/SourceCodeViewer.vue';
import DataTypeBadge from '../../shared/components/datatype-badge/DataTypeBadge.vue';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { enumeration } = defineProps<EnumerationDetailPageProps>();

type KnownEnumerationProperties = Record<keyof Enumeration, undefined>;

const knownEnumerationProperties: KnownEnumerationProperties = {
  name: undefined,
  description: undefined,
  datatype: undefined,
  options: undefined,
};

const customProps = computed(() => getCustomProperties(enumeration, knownEnumerationProperties));

type KnownOptionProperties = Record<keyof Option, undefined>;

const knownOptionProperties: KnownOptionProperties = {
  name: undefined,
  description: undefined,
  value: undefined,
};

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = () => {
  const nodeId = getNodeIdOfComplexDatatype(enumeration.datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

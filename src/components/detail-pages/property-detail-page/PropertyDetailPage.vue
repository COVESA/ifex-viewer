<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="propertyData.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="propertyData.name" :dot-notation="dotNotationFullPath" page-type="property">
        <template #default>
          <DataTypeBadge :datatype="propertyData.datatype" @selected="selectDatatypeNode"> {{ propertyData.datatype }}</DataTypeBadge>
          <Badge v-if="propertyData.arraysize !== undefined" type="secondary" data-testid="badge-arraysize-metadata">Arraysize::[{{ propertyData.arraysize }}]</Badge>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>
  </DetailPageContainer>
</template>
<script setup lang="ts">
import Badge from '../../shared/components/badge/Badge.vue';
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import { PropertyDetailPageProps } from './types';
import { Property } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import DataTypeBadge from '../../shared/components/datatype-badge/DataTypeBadge.vue';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { propertyData } = defineProps<PropertyDetailPageProps>();

type KnownPropertyDataProperties = Record<keyof Property, undefined>;

const knownPropertyDataProperties: KnownPropertyDataProperties = {
  name: undefined,
  description: undefined,
  arraysize: undefined,
  datatype: undefined,
};

const customProps = computed(() => getCustomProperties(propertyData, knownPropertyDataProperties));

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = () => {
  const nodeId = getNodeIdOfComplexDatatype(propertyData.datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

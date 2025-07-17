<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="event.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="event.name" :dot-notation="dotNotationFullPath" page-type="event">
        <template #default> <slot :name="dotNotationFullPath + '-headline'"></slot> </template>
      </Headline>
    </template>

    <template #default>
      <PropertyViewer
        v-if="event.input?.length"
        headline="Input"
        :properties="event.input as ArgumentWithCustomProperties[]"
        :parent-dot-notation-full-path="dotNotationFullPath"
        @select-datatype="selectDatatypeNode"
      >
        <template v-for="childrenDotNotationPath in childrenDotNotationFullPaths" #[childrenDotNotationPath]>
          <slot :name="childrenDotNotationPath"></slot>
        </template>
      </PropertyViewer>
    </template>
  </DetailPageContainer>
</template>
<script setup lang="ts">
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import PropertyViewer from '../shared/property-viewer/PropertyViewer.vue';
import { EventDetailPageProps } from './types';
import { ArgumentWithCustomProperties, Event } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { event } = defineProps<EventDetailPageProps>();

type KnownEventProperties = Record<keyof Event, undefined>;

const knownEventProperties: KnownEventProperties = {
  name: undefined,
  description: undefined,
  input: undefined,
};

const customProps = computed(() => getCustomProperties(event, knownEventProperties));

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = (datatype: string) => {
  const nodeId = getNodeIdOfComplexDatatype(datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

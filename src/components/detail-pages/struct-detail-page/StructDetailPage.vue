<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="struct.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="struct.name" :dot-notation="dotNotationFullPath" page-type="struct">
        <template #default>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>

    <template #default>
      <PropertyViewer
        v-if="struct.members?.length"
        headline="Members"
        :properties="struct.members as ArgumentWithCustomProperties[]"
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
import { StructDetailPageProps } from './types';
import { ArgumentWithCustomProperties, Struct } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { struct } = defineProps<StructDetailPageProps>();

type KnownStructProperties = Record<keyof Struct, undefined>;

const knownStructProperties: KnownStructProperties = {
  name: undefined,
  description: undefined,
  members: undefined,
};

const customProps = computed(() => getCustomProperties(struct, knownStructProperties));

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = (datatype: string) => {
  const nodeId = getNodeIdOfComplexDatatype(datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="typedef.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="typedef.name" :dot-notation="dotNotationFullPath" page-type="typedef">
        <template #default>
          <Badge v-if="typedef.datatypes?.length" type="primitiveType"> Variant type</Badge>
          <DataTypeBadge v-if="!typedef.datatypes?.length && typedef.datatype" :datatype="typedef.datatype" @selected="selectDatatypeNode"> {{ typedef.datatype }}</DataTypeBadge>
          <Badge v-if="typedef.arraysize !== undefined" type="secondary" data-testid="badge-arraysize-metadata">Arraysize::[{{ typedef.arraysize }}]</Badge>
          <Badge v-if="typedef.min !== undefined" type="secondary" data-testid="badge-min-metadata">Min::[{{ typedef.min }}]</Badge>
          <Badge v-if="typedef.max !== undefined" type="secondary" data-testid="badge-max-metadata">Max::[{{ typedef.max }}]</Badge>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>
    <!--TODO: show hint when no datatype and no datatypes are specified?-->
    <template #above-description>
      <div v-if="typedef.datatypes?.length" data-testid="datatypes">
        <h3 class="text-2xl font-medium mb-4 dark:text-gray-100">Datatypes</h3>
        <div class="flex gap-2">
          <template v-for="(datatype, i) of typedef.datatypes" :key="datatype">
            <Badge type="primitiveType"> {{ datatype }}</Badge>
            <span v-if="i < typedef.datatypes.length - 1">or</span>
          </template>
        </div>
      </div>
    </template>
  </DetailPageContainer>
</template>
<script setup lang="ts">
import { TypedefDetailPageProps } from './types';
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import Badge from '../../shared/components/badge/Badge.vue';
import { Typedef } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import DataTypeBadge from '../../shared/components/datatype-badge/DataTypeBadge.vue';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { typedef, dotNotationFullPath } = defineProps<TypedefDetailPageProps>();

type KnownTypedefProperties = Record<keyof Typedef, undefined>;

const knownTypedefProperties: KnownTypedefProperties = {
  name: undefined,
  description: undefined,
  arraysize: undefined,
  datatype: undefined,
  datatypes: undefined,
  min: undefined,
  max: undefined,
};

const customProps = computed(() => getCustomProperties(typedef, knownTypedefProperties));

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = () => {
  if (!typedef.datatype) {
    return;
  }

  const nodeId = getNodeIdOfComplexDatatype(typedef.datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

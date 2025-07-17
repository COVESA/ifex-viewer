<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="method.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="method.name" :dot-notation="dotNotationFullPath" page-type="method">
        <template #default>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>

    <template #[dotNotationFullPath]>
      <slot :name="dotNotationFullPath"></slot>
    </template>

    <template #default>
      <PropertyViewer
        v-if="method.input?.length"
        headline="Input"
        :properties="method.input as ArgumentWithCustomProperties[]"
        :parent-dot-notation-full-path="dotNotationFullPath"
        @select-datatype="selectDatatypeNode"
      >
        <template v-for="inputDotNotationPath in inputDotNotationPaths" #[inputDotNotationPath]>
          <slot :name="inputDotNotationPath"></slot>
        </template>
      </PropertyViewer>
      <PropertyViewer
        v-if="method.output?.length"
        headline="Output"
        :properties="method.output as ArgumentWithCustomProperties[]"
        :parent-dot-notation-full-path="dotNotationFullPath"
        @select-datatype="selectDatatypeNode"
      >
        <template v-for="outputDotNotationPath in outputDotNotationPaths" #[outputDotNotationPath]>
          <slot :name="outputDotNotationPath"></slot>
        </template>
      </PropertyViewer>
      <PropertyViewer
        v-if="method.returns?.length"
        headline="Returns"
        :properties="method.returns as ArgumentWithCustomProperties[]"
        :parent-dot-notation-full-path="dotNotationFullPath"
        @select-datatype="selectDatatypeNode"
      >
        <template v-for="returnsDotNotationPath in returnsDotNotationPaths" #[returnsDotNotationPath]>
          <slot :name="returnsDotNotationPath"></slot>
        </template>
      </PropertyViewer>
      <PropertyViewer
        v-if="method.errors?.length"
        headline="Errors"
        :properties="method.errors as ErrorWithCustomProperties[]"
        :parent-dot-notation-full-path="dotNotationFullPath"
        @select-datatype="selectDatatypeNode"
      >
        <template v-for="errorsDotNotationPath in errorsDotNotationPaths" #[errorsDotNotationPath]>
          <slot :name="errorsDotNotationPath"></slot>
        </template>
      </PropertyViewer>
    </template>
  </DetailPageContainer>
</template>
<script lang="ts" setup>
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import PropertyViewer from '../shared/property-viewer/PropertyViewer.vue';
import { MethodDetailPageProps } from './types';
import { ArgumentWithCustomProperties, ErrorWithCustomProperties, Method } from '../../../types/ifex-core.ts';
import { computed } from 'vue';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';
import { useGetComplexDatatypeNode } from '../../../composables/use-get-complex-datatype-node.ts';

const { method, dotNotationFullPath, childrenDotNotationFullPaths } = defineProps<MethodDetailPageProps>();

type KnownMethodProperties = Record<keyof Method, undefined>;

const knownMethodProperties: KnownMethodProperties = {
  name: undefined,
  description: undefined,
  input: undefined,
  errors: undefined,
  output: undefined,
  returns: undefined,
};

const customProps = computed(() => getCustomProperties(method, knownMethodProperties));

const getLastElementOfDotNotation = (dotNotationPath: string) => {
  const dotNotationParts = dotNotationPath.split('.');
  return dotNotationParts[dotNotationParts.length - 1];
};

const inputDotNotationPaths = computed(
  () =>
    childrenDotNotationFullPaths?.filter(path => {
      const matchingInputArgument = method.input?.find(input => input.name === getLastElementOfDotNotation(path));
      return Boolean(matchingInputArgument);
    }) ?? [],
);
const outputDotNotationPaths = computed(
  () =>
    childrenDotNotationFullPaths?.filter(path => {
      const matchingInputArgument = method.output?.find(output => output.name === getLastElementOfDotNotation(path));
      return Boolean(matchingInputArgument);
    }) ?? [],
);
const returnsDotNotationPaths = computed(
  () =>
    childrenDotNotationFullPaths?.filter(path => {
      const matchingInputArgument = method.returns?.find(returns => returns.name === getLastElementOfDotNotation(path));
      return Boolean(matchingInputArgument);
    }) ?? [],
);
const errorsDotNotationPaths = computed(
  () =>
    childrenDotNotationFullPaths?.filter(path => {
      const matchingInputArgument = method.errors?.find(errors => errors.name === getLastElementOfDotNotation(path));
      return Boolean(matchingInputArgument);
    }) ?? [],
);

const emits = defineEmits<{ selectDatatypeNode: [nodeId: string] }>();

const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

const selectDatatypeNode = (datatype: string) => {
  const nodeId = getNodeIdOfComplexDatatype(datatype);
  if (nodeId) {
    emits('selectDatatypeNode', nodeId);
  }
};
</script>

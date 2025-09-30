<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="data.description" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="data.name" :page-type="type" :dot-notation="dotNotationFullPath" :node-raw-data="data">
        <template #default>
          <Badge v-if="version" data-testid="grouped-version-badge">{{ version }}</Badge>
          <slot :name="dotNotationFullPath + '-headline'"></slot>
        </template>
      </Headline>
    </template>
  </DetailPageContainer>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { getVersion } from '../../../utils/version/version';
import Badge from '../../shared/components/badge/Badge.vue';
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import { GroupedDetailPageProps } from './types';
import { Interface, Namespace } from '../../../types/ifex-core.ts';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';

const { data, type } = defineProps<GroupedDetailPageProps>();

const version = computed(() => getVersion(data.major_version, data.minor_version));

type KnownInterfaceProperties = Record<keyof Interface, undefined>;

const knownInterfaceProperties: KnownInterfaceProperties = {
  name: undefined,
  description: undefined,
  methods: undefined,
  events: undefined,
  properties: undefined,
  namespaces: undefined,
  enumerations: undefined,
  version_label: undefined,
  typedefs: undefined,
  minor_version: undefined,
  structs: undefined,
  major_version: undefined,
  includes: undefined,
};

type KnownNamespaceProperties = Record<keyof Namespace, undefined>;

const knownNamespaceProperties: KnownNamespaceProperties = {
  ...knownInterfaceProperties,
  interface: undefined,
};

const customProps = computed(() => getCustomProperties(data, type === 'interface' ? knownInterfaceProperties : knownNamespaceProperties));
</script>

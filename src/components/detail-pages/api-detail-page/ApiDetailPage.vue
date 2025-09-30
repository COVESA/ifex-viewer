<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
-->
<template>
  <DetailPageContainer :description="api.description || ''" :validation-errors="validationErrors" :custom-properties="customProps">
    <template #headline>
      <Headline :headline="api.name ?? 'API'" :node-raw-data="api">
        <template #default>
          <Badge v-if="apiVersion?.length" data-testid="api-version-badge">{{ apiVersion }}</Badge>
        </template>
      </Headline>
    </template>
    <div v-if="api.includes?.length">
      <h3 class="text-2xl font-medium mb-4 dark:text-gray-100">Includes</h3>
      <ul class="list-disc list-inside dark:text-gray-200">
        <li v-for="include of api.includes" :key="include.file">{{ include.file }}</li>
      </ul>
    </div>
  </DetailPageContainer>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { getVersion } from '../../../utils/version/version';
import Badge from '../../shared/components/badge/Badge.vue';
import DetailPageContainer from '../shared/detail-page-container/DetailPageContainer.vue';
import Headline from '../shared/headline/Headline.vue';
import { ApiDetailPageProps } from './types';
import { AST } from '../../../types/ifex-core.ts';
import { getCustomProperties } from '../../../utils/get-custom-properties/get-custom-properties.ts';

const { api } = defineProps<ApiDetailPageProps>();

const apiVersion = computed(() => getVersion(api.major_version, api.minor_version));

type KnownASTProperties = Record<keyof AST, undefined>;

const knownASTProperties: KnownASTProperties = {
  name: undefined,
  description: undefined,
  major_version: undefined,
  minor_version: undefined,
  includes: undefined,
  filetype: undefined,
  namespaces: undefined,
  schema: undefined,
};

const customProps = computed(() => getCustomProperties(api, knownASTProperties));
</script>

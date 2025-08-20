/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IfexSpecificationItem } from '../../types.ts';
import { getViewerModel, ViewerModel } from '../../model/specification-model.ts';

export const useViewerModelStore = defineStore('viewer-model', () => {
  const specifications = ref<IfexSpecificationItem[]>([]);

  const setSpecifications = (specs: IfexSpecificationItem[]) => {
    specifications.value = specs;
  };

  const viewerModel = computed<ViewerModel>(() => {
    if (!Array.isArray(specifications.value) || !specifications.value?.length) {
      return {
        mergeView: null,
        layeredView: [],
      };
    }

    return getViewerModel(specifications.value);
  });

  return {
    setSpecifications,
    viewerModel,
  };
});

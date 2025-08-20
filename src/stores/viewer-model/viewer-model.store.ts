/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IfexSpecificationItem } from '../../types.ts';
import { getViewerModel, ViewerModel } from '../../model/specification-model.ts';
import { ViewTabs } from '../../components/sidenav/types.ts';
import { IFEXTreeModelNode } from '../../types/node.ts';

export type activeViewTypes = 'mergeView' | 'layeredView';

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

  const selectedView = ref<activeViewTypes>('mergeView');

  const changeSelectedView = (updatedView: ViewTabs) => {
    selectedView.value = updatedView === ViewTabs.LAYERED_VIEW ? 'layeredView' : 'mergeView';
  };

  const activeView = computed<IFEXTreeModelNode[]>(() => {
    if (selectedView.value === 'mergeView') {
      return viewerModel.value.mergeView ? [viewerModel.value.mergeView] : [];
    }

    return viewerModel.value.layeredView;
  });

  return {
    setSpecifications,
    viewerModel,
    changeSelectedView,
    activeView,
    selectedView,
  };
});

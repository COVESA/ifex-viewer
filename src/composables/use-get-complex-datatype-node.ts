/**
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { useComplexDatatypesStore } from '../stores/complex-datatypes/complex-datatypes.store.ts';
import { useViewerModelStore } from '../stores/viewer-model/viewer-model.store.ts';
import { storeToRefs } from 'pinia';
import { findNodeByPath } from '../utils/tree/tree.ts';

export const useGetComplexDatatypeNode = () => {
  const complexDatatypesStore = useComplexDatatypesStore();
  const viewerModelStore = useViewerModelStore();
  const { viewerModelWithoutApi } = storeToRefs(viewerModelStore);

  const getNodeIdOfComplexDatatype = (name: string) => {
    let node = complexDatatypesStore.getComplexDatatypeByName(name);
    if (!node) {
      // Try to find the node by the given path
      // Datatypes can be defined either as path or just by name
      node = findNodeByPath(name, '', viewerModelWithoutApi.value);

      // If still no node found, return
      if (!node) {
        return;
      }
    }

    return node.id;
  };

  return {
    getNodeIdOfComplexDatatype,
  };
};

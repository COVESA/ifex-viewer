/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { defineStore } from 'pinia';
import { IFEXTreeModelNode } from '../types/node.ts';
import { computed, ref } from 'vue';

export const useComplexDatatypesStore = defineStore('complex-datatypes', () => {
  const complexDatatypesRef = ref<IFEXTreeModelNode[]>([]);
  const complexDatatypes = computed(() => complexDatatypesRef.value);

  const setComplexDatatypes = (treeModel: IFEXTreeModelNode[]) => {
    complexDatatypesRef.value = treeModel.flatMap(function collectDatatypes(node) {
      let result: IFEXTreeModelNode[] = [];
      if (node.type === 'struct' || node.type === 'enumeration' || node.type === 'typedef') {
        result.push(node);
      }
      if (node.children && node.children.length > 0) {
        result = result.concat(node.children.flatMap(collectDatatypes));
      }
      return result;
    });
  };

  const getComplexDatatypeByName = (name: string) => {
    return complexDatatypes.value.find(datatype => datatype.node.name === name);
  };

  return { complexDatatypes, setComplexDatatypes, getComplexDatatypeByName };
});

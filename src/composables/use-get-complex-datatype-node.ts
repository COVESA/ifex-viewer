/**
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { useComplexDatatypesStore } from '../stores/complex-datatypes.store.ts';

export const useGetComplexDatatypeNode = () => {
  const complexDatatypesStore = useComplexDatatypesStore();

  const getNodeIdOfComplexDatatype = (name: string) => {
    const node = complexDatatypesStore.getComplexDatatypeByName(name);
    if (!node) {
      return;
    }

    return node.id;
  };

  return {
    getNodeIdOfComplexDatatype,
  };
};

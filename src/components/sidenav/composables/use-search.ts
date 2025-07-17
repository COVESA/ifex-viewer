/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { computed, Ref } from 'vue';
import { IFEXTreeModelNode } from '../../../types/node.ts';
import { SearchResult } from '../search-results/types.ts';
import { BadgeType } from '../../shared/components/badge/types.ts';
import { Interface, Namespace } from '../../../types/ifex-core.ts';

export const useSearch = (searchValue: Ref<string>, treeNodes: Ref<IFEXTreeModelNode[]>) => {
  const searchResults = computed(() => {
    if (!searchValue.value) {
      return [];
    }

    return filterTreeNodes(treeNodes.value, searchValue.value.toLowerCase());
  });

  const filterTreeNodes = (treeNodes: IFEXTreeModelNode[], searchValue: string): SearchResult[] => {
    const filteredNodes: SearchResult[] = [];

    for (const treeNode of treeNodes) {
      const children = filterTreeNodes(treeNode.children || [], searchValue);

      if (children.length > 0) {
        for (const child of children) {
          filteredNodes.push(child);
        }
      }

      const isApiNode = treeNode.type === 'api'; // API nodes are not searchable
      if (isApiNode) {
        continue;
      }

      let nodeToSearchIn = treeNode.node;

      const isNamespaceOrInterfaceNode = treeNode.type === 'namespace' || treeNode.type === 'interface';
      if (isNamespaceOrInterfaceNode) {
        const currTreeNode = treeNode.node as Namespace | Interface;
        // We don't want to search in the children of the namespace or interface node (e.g. its methods)
        // to prevent showing the parent node in the search results if the search value is found in its children
        const namespaceOrInterface: Namespace | Interface = {
          name: currTreeNode.name || '',
          description: treeNode.node.description || '',
          major_version: currTreeNode.major_version || undefined,
          minor_version: currTreeNode.minor_version || undefined,
          version_label: currTreeNode.version_label || '',
        };
        nodeToSearchIn = namespaceOrInterface;
      }

      const contentFoundInNode = searchInContent(nodeToSearchIn, searchValue);
      if (contentFoundInNode) {
        const searchResult: SearchResult = {
          id: treeNode.id,
          title: treeNode.node.name || '',
          description: treeNode.node.description || '',
          type: treeNode.type as BadgeType,
        };
        filteredNodes.push(searchResult);
      }
    }

    return filteredNodes;
  };

  const searchInContent = (valueToSearchIn: IFEXTreeModelNode['node'] | string | number, searchValue: string): boolean => {
    if (typeof valueToSearchIn === 'string') {
      return valueToSearchIn.toLowerCase().includes(searchValue);
    }

    if (typeof valueToSearchIn === 'number') {
      return valueToSearchIn.toString().includes(searchValue);
    }

    if (Array.isArray(valueToSearchIn)) {
      return valueToSearchIn.some(item => searchInContent(item, searchValue));
    }

    if (typeof valueToSearchIn === 'object' && valueToSearchIn !== null) {
      return Object.values(valueToSearchIn).some(value => searchInContent(value, searchValue));
    }

    return false;
  };

  return { searchResults };
};

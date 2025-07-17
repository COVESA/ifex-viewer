/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { computed, Ref, ref } from 'vue';
import { AST, Namespace } from '../../../types/ifex-core';
import { IFEXTreeModelNode, NodeType } from '../../../types/node';
import { NodeToggleEvent } from '../sidenav-item/types';
import { TreeNode } from '../types';
import { getVersion } from '../../../utils/version/version.ts';

export const useTree = (treeModel: Ref<IFEXTreeModelNode[]>, selectedNodeId: () => string) => {
  const collapsedNodes = ref<string[]>([]);

  const treeNodes = computed<TreeNode[]>(() => createTreeNodes(treeModel.value, -1));

  const createTreeNodes = (treeNodes: IFEXTreeModelNode[], parentLevel: number): TreeNode[] => {
    return treeNodes.map(treeNode => {
      const { node, type } = treeNode;
      const level = parentLevel + 1;
      const children: TreeNode[] = [];

      if (treeNode.type !== 'interface' && (node as Namespace).interface) {
        // interface can exist only once in a namespace, thats why we can use find here
        const interfaceNode = treeNode.children?.find(child => child.type === 'interface');
        if (interfaceNode) {
          children.push(...createTreeNodes([interfaceNode], level));
        }
      }

      const namespaces = getChildrenOfType(treeNode.children || [], 'namespace');
      children.push(...createTreeNodes(namespaces || [], level));

      const methods = getChildrenOfType(treeNode.children || [], 'method');
      children.push(...createTreeNodesWithWrapper(methods, 'Methods', level));

      const events = getChildrenOfType(treeNode.children || [], 'event');
      children.push(...createTreeNodesWithWrapper(events, 'Events', level));

      const structs = getChildrenOfType(treeNode.children || [], 'struct');
      children.push(...createTreeNodesWithWrapper(structs, 'Structs', level));

      const enumerations = getChildrenOfType(treeNode.children || [], 'enumeration');
      children.push(...createTreeNodesWithWrapper(enumerations, 'Enumerations', level));

      const typedefs = getChildrenOfType(treeNode.children || [], 'typedef');
      children.push(...createTreeNodesWithWrapper(typedefs, 'Typedefs', level));

      const properties = getChildrenOfType(treeNode.children || [], 'property');
      children.push(...createTreeNodesWithWrapper(properties, 'Properties', level));

      return {
        id: treeNode.id,
        label: node.name || '',
        type,
        level,
        expanded: !isNodeCollapsed(treeNode.id),
        children,
        hasError: !!treeNode.validationErrors?.length,
        selected: selectedNodeId() === treeNode.id,
        badges: getBadges(treeNode),
      };
    });
  };

  const getBadges = (treeModelNode: IFEXTreeModelNode): TreeNode['badges'] => {
    let badges: TreeNode['badges'] = [];

    const node = treeModelNode.node as AST;

    const nodeHasVersion = node.major_version !== undefined || node.minor_version !== undefined;

    if (treeModelNode.type === 'api' && nodeHasVersion) {
      badges = [{ type: 'primary', label: getVersion(node.major_version, node.minor_version) }];
    }

    return badges;
  };

  const getChildrenOfType = (children: IFEXTreeModelNode[], type: NodeType) => {
    return children.filter(child => child.type === type);
  };

  const isNodeCollapsed = (nodeId: string) => {
    return !!collapsedNodes.value.find(collapsedNodeId => collapsedNodeId === nodeId)?.length;
  };

  const createTreeNodesWithWrapper = (nodes: IFEXTreeModelNode[], typeLabel: string, parentLevel: number): TreeNode[] => {
    if (!nodes?.length) return [];
    const wrapperLevel = parentLevel + 1;

    const children = nodes.map(
      ({ id, node, type, validationErrors }): TreeNode => ({
        id,
        label: node.name || '',
        type,
        level: wrapperLevel + 1, // Children are one level deeper
        expanded: true,
        hasError: !!validationErrors?.length,
        children: [],
        selected: selectedNodeId() === id,
      }),
    );
    const childIds = children.map(child => child.id);
    const id = `${typeLabel}-wrapper-${childIds.join('+')}`;
    // Create a wrapper node for the group because they don't exist in
    // the viewer model itself as they're needed only for the sidenav ui
    const wrapperNode: TreeNode = {
      id,
      label: typeLabel,
      type: 'wrapper',
      level: wrapperLevel,
      expanded: !isNodeCollapsed(id),
      children,
    };

    return [wrapperNode];
  };

  const onToggleChildren = ({ id, expanded }: NodeToggleEvent) => {
    if (expanded) {
      collapsedNodes.value = collapsedNodes.value.filter(nodeId => nodeId !== id);
    } else {
      collapsedNodes.value.push(id);
    }
  };

  const expandAllNodes = () => (collapsedNodes.value = []);

  const getAllNodeIds = (nodes: TreeNode[]) => {
    const ids: string[] = [];
    for (const node of nodes) {
      ids.push(node.id);

      if (node.children?.length) {
        const childrenIds = getAllNodeIds(node.children);
        ids.push(...childrenIds);
      }
    }

    return ids;
  };

  const collapseAllNodes = () => {
    collapsedNodes.value = getAllNodeIds(treeNodes.value);
  };

  const allNodesExpanded = computed(() => collapsedNodes.value.length === 0);

  return { treeNodes, onToggleChildren, expandAllNodes, collapseAllNodes, allNodesExpanded };
};

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { v4 as uuid } from 'uuid';
import { Enumeration, Event, Interface, Method, Namespace, Property, Struct, Typedef } from '../../types/ifex-core';
import { ErrorObject } from 'ajv';
import { NodeType, IFEXTreeModelNode } from '../../types/node';

const getLeafValidationErrors = (currentNodePath: string, validationErrors: Map<string, ErrorObject[]>) => {
  let matchingValidationErrors: ErrorObject[] = [];

  const keys: string[] = Array.from(validationErrors.keys());
  keys.forEach(key => {
    // Child properties within the current leaf node may have associated validation errors.
    // These errors need to be included in the leaf node's error object. For instance, an error might be
    // present at a deeper level in the path, such as '/namespaces/0/methods/1/input/0'. However, the
    // current node's path is '/namespaces/0/methods/1'. To ensure we capture all relevant errors,
    // we must check not only the exact match of the current node's path but also any sub-paths wich
    // start with currentNodePath.
    const keyMatchesPath = key.startsWith(currentNodePath);
    if (keyMatchesPath) {
      const errors = validationErrors.get(key) || [];
      matchingValidationErrors.push(...errors);
    }
  });

  return matchingValidationErrors;
};

const createLeafNode = (
  nodes: Array<Event | Struct | Method | Enumeration | Typedef | Property>,
  type: NodeType,
  path: string,
  validationErrors: Map<string, ErrorObject[]> = new Map<string, ErrorObject[]>(),
): IFEXTreeModelNode[] => {
  if (!nodes?.length) return [];

  return nodes.map((node, currNodeIndex) => {
    const leafNode: IFEXTreeModelNode = {
      id: uuid(),
      type,
      node,
    };

    const currentNodePath = `${path}/${currNodeIndex}`;
    const matchingValidationErrors = getLeafValidationErrors(currentNodePath, validationErrors);
    if (matchingValidationErrors?.length) {
      leafNode.validationErrors = matchingValidationErrors;
    }

    return leafNode;
  });
};

const createTypedefLeafNodes = (nodes: Array<Typedef>, path: string, validationErrors: Map<string, ErrorObject[]> = new Map<string, ErrorObject[]>()): IFEXTreeModelNode[] => {
  if (!nodes?.length) return [];

  nodes.forEach((node, currNodeIndex) => {
    if (node.datatypes?.length || node.datatype) {
      return;
    }

    const currPath = `${path}/${currNodeIndex}`;
    if (validationErrors.get(currPath)) {
      const existingErrors = validationErrors.get(currPath) || [];
      validationErrors.set(currPath, [
        ...existingErrors,
        {
          instancePath: currPath,
          keyword: 'missingProperties',
          params: {},
          schemaPath: '#/missingProperties',
          message: 'Should have at least one of the following: datatype or datatypes.',
        },
      ]);
    } else {
      validationErrors.set(currPath, [
        {
          instancePath: currPath,
          keyword: 'missingProperties',
          params: {},
          schemaPath: '#/missingProperties',
          message: 'Should have at least one of the following: datatype or datatypes.',
        },
      ]);
    }
  });

  return createLeafNode(nodes, 'typedef', path, validationErrors);
};

export const createTreeModel = (
  nodes: Array<Namespace | Interface>,
  path: string = '',
  validationErrors: Map<string, ErrorObject[]> = new Map<string, ErrorObject[]>(),
  isInterface = false,
): IFEXTreeModelNode[] => {
  return nodes.map((node, currNodeIndex): IFEXTreeModelNode => {
    const currentPath = `${path}/${currNodeIndex}`;
    const children = [];

    if (!isInterface && (node as Namespace).interface) {
      children.push(...createTreeModel([(node as Namespace).interface!], `${currentPath}/interfaces`, validationErrors, true));
    }

    children.push(...createTreeModel(node.namespaces || [], `${currentPath}/namespaces`, validationErrors));

    children.push(...createLeafNode(node.methods || [], 'method', `${currentPath}/methods`, validationErrors));

    children.push(...createLeafNode(node.events || [], 'event', `${currentPath}/events`, validationErrors));

    children.push(...createLeafNode(node.structs || [], 'struct', `${currentPath}/structs`, validationErrors));

    children.push(...createLeafNode(node.enumerations || [], 'enumeration', `${currentPath}/enumerations`, validationErrors));

    children.push(...createTypedefLeafNodes(node.typedefs || [], `${currentPath}/typedefs`, validationErrors));

    children.push(...createLeafNode(node.properties || [], 'property', `${currentPath}/properties`, validationErrors));

    const treeModelNode: IFEXTreeModelNode = {
      id: uuid(),
      type: isInterface ? 'interface' : 'namespace',
      children,
      node,
    };

    // For namespaces or instances we use only the validation errors where the instance path
    // is an exact match otherwise we would get all validation errors from the respective leafs
    // as well.
    const matchingValidationErrors = validationErrors.get(currentPath);
    if (matchingValidationErrors?.length) {
      treeModelNode.validationErrors = matchingValidationErrors;
    }

    return treeModelNode;
  });
};

export const findNodeById = (nodeId: string, tree: IFEXTreeModelNode[]): IFEXTreeModelNode | undefined => {
  for (const node of tree) {
    if (node.id === nodeId) {
      return node;
    } else {
      if (node.children) {
        const selection = findNodeById(nodeId, node.children || []);
        if (selection) {
          return selection;
        }
      }
    }
  }

  return undefined;
};

export const findNodeByPath = (fullPath: string, path: string, tree: IFEXTreeModelNode[]): IFEXTreeModelNode | undefined => {
  for (const node of tree) {
    const currentPath = `${path.length ? `${path}.` : ''}${node.node.name}`;

    if (currentPath === fullPath) {
      return node;
    } else {
      if (node.children) {
        const selection = findNodeByPath(fullPath, currentPath, node.children || []);
        if (selection) {
          return selection;
        }
      }
    }
  }

  return undefined;
};

export const getFullPathToNode = (nodeId: string, tree: IFEXTreeModelNode[], path: IFEXTreeModelNode[] = []): IFEXTreeModelNode[] | null => {
  for (const node of tree) {
    path.push(node);

    if (node.id === nodeId) {
      return path;
    } else {
      if (node.children) {
        const result = getFullPathToNode(nodeId, node.children || [], path);
        if (result) {
          return result;
        }
      }

      path.pop();
    }
  }

  return null;
};

// TODO: add test
export const getFullDotNotationPath = (nodeId: string, viewerModel: IFEXTreeModelNode[]) => {
  const path = getFullPathToNode(nodeId, viewerModel);
  const namesOnly = path?.map(item => item.node.name || '') || [];

  return namesOnly.join('.');
};

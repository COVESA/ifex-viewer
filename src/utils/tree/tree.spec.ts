/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ErrorObject } from 'ajv';
import { Method, Namespace, Typedef } from '../../types/ifex-core';
import { createTreeModel, findNodeById, findNodeByPath, getFullPathToNode } from './tree';
import { enumerationMock } from '../../tests/mocks/enumeration';
import { eventMock } from '../../tests/mocks/events';
import { methodMock } from '../../tests/mocks/methods';
import { structMock } from '../../tests/mocks/structs';
import { typedefMock } from '../../tests/mocks/typedef';
import { IFEXTreeModelNode } from '../../types/node';
import { MockInstance, vi } from 'vitest';
import * as uuid from 'uuid';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

vi.mock('uuid');

describe('tree', () => {
  let uuidSpy: MockInstance;

  beforeEach(() => (uuidSpy = vi.spyOn(uuid, 'v4')));

  afterEach(() => vi.restoreAllMocks());

  describe('should generate tree', () => {
    it('with namespaces only', () => {
      const id1 = '1234';
      const id2 = '12345';
      uuidSpy.mockReturnValueOnce(id1).mockReturnValue(id2);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
        },
      ];

      const expected: IFEXTreeModelNode[] = [
        {
          id: id1,
          node: nodes[0],
          type: 'namespace',
          children: [],
        },
        { id: id2, node: nodes[1], type: 'namespace', children: [] },
      ];

      const tree = createTreeModel(nodes);

      expect(tree).toEqual(expected);
    });

    it('with namespaces, methods, events, structs, typedefs and enums', () => {
      // It's not relevant for the test here if a unique id is generated.
      // We could use chained mockReturnValueOnce but we have to couple the
      // order of the mock ids exactly to the order they will be used in the
      // createTreeModel function.
      const id = '1234';

      uuidSpy.mockReturnValue(id);

      const typedefWithDataTypes: Typedef = { ...typedefMock, datatypes: ['string', 'CustomStruct'] };
      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          enumerations: [enumerationMock],
          methods: [methodMock],
          structs: [structMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
          typedefs: [typedefMock, typedefWithDataTypes],
        },
      ];

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: methodMock,
              type: 'method',
            },
            {
              id,
              node: structMock,
              type: 'struct',
            },
            {
              id,
              node: enumerationMock,
              type: 'enumeration',
            },
          ],
        },
        {
          id,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id,
              node: eventMock,
              type: 'event',
            },
            {
              id,
              node: typedefMock,
              type: 'typedef',
            },
            {
              id,
              node: typedefWithDataTypes,
              type: 'typedef',
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes);

      expect(tree).toEqual(expected);
    });

    it('with interface node', () => {
      // It's not relevant for the test here if a unique id is generated.
      // We could use chained mockReturnValueOnce but we have to couple the
      // order of the mock ids exactly to the order they will be used in the
      // createTreeModel function.
      const id = '1234';

      uuidSpy.mockReturnValue(id);

      const interfaceMethod: Method = { ...methodMock, name: 'Method in interface' };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          interface: { name: 'Interface', methods: [interfaceMethod] },
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              type: 'interface',
              node: nodes[0].interface!,
              children: [
                {
                  id,
                  node: interfaceMethod,
                  type: 'method',
                },
              ],
            },
            {
              id,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes);

      expect(tree).toEqual(expected);
    });

    it('with nested namespace', () => {
      // It's not relevant for the test here if a unique id is generated.
      // We could use chained mockReturnValueOnce but we have to couple the
      // order of the mock ids exactly to the order they will be used in the
      // createTreeModel function.
      const id = '1234';

      uuidSpy.mockReturnValue(id);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'Nested Namespace Method' };
      const secondNestedNamespaceMethod: Method = { ...methodMock, name: '2nd Nested Namespace Method' };

      const nestedNamespace: Namespace = {
        name: 'Nested Namespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod, secondNestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              type: 'namespace',
              node: nodes[0].namespaces![0],
              children: [
                {
                  id,
                  node: nestedNamespaceMethod,
                  type: 'method',
                },
                {
                  id,
                  node: secondNestedNamespaceMethod,
                  type: 'method',
                },
              ],
            },
            {
              id,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes);

      expect(tree).toEqual(expected);
    });
  });

  describe('findNodeById', () => {
    it('should find nested node by id', () => {
      // For this test it's esential to have unique ids for each node.
      const namespaceNodeId = '1';
      const nestedNamespaceNodeId = '2';
      const nestedNamespaceMethodNodeId = '3';
      const namespaceMethodNodeId = '4';
      const secondNamespaceNodeId = '5';
      const eventNodeID = '6';

      const nodeIdToFind = nestedNamespaceNodeId;

      uuidSpy
        .mockReturnValueOnce(namespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceMethodNodeId)
        .mockReturnValueOnce(namespaceMethodNodeId)
        .mockReturnValueOnce(secondNamespaceNodeId)
        .mockReturnValue(eventNodeID);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'Nested Namespace Method' };

      const nestedNamespace: Namespace = {
        name: 'Nested Namespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const nestedNamespaceTreeNode: IFEXTreeModelNode = {
        id: nestedNamespaceNodeId,
        type: 'namespace',
        node: nodes[0].namespaces![0],
        children: [
          {
            id: nestedNamespaceMethodNodeId,
            node: nestedNamespaceMethod,
            type: 'method',
          },
        ],
      };

      const tree: IFEXTreeModelNode[] = [
        {
          id: namespaceNodeId,
          node: nodes[0],
          type: 'namespace',
          children: [
            nestedNamespaceTreeNode,
            {
              id: namespaceMethodNodeId,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id: secondNamespaceNodeId,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id: eventNodeID,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const result = findNodeById(nodeIdToFind, tree);

      expect(result).toEqual(nestedNamespaceTreeNode);
    });

    it('should not find node in tree because it does not exist', () => {
      // For this test it's esential to have unique ids for each node.
      const namespaceNodeId = '1';
      const nestedNamespaceNodeId = '2';
      const nestedNamespaceMethodNodeId = '3';
      const namespaceMethodNodeId = '4';
      const secondNamespaceNodeId = '5';
      const eventNodeID = '6';

      const nodeIdToFind = 'fake-id';

      uuidSpy
        .mockReturnValueOnce(namespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceMethodNodeId)
        .mockReturnValueOnce(namespaceMethodNodeId)
        .mockReturnValueOnce(secondNamespaceNodeId)
        .mockReturnValue(eventNodeID);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'Nested Namespace Method' };

      const nestedNamespace: Namespace = {
        name: 'Nested Namespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const nestedNamespaceTreeNode: IFEXTreeModelNode = {
        id: nestedNamespaceNodeId,
        type: 'namespace',
        node: nodes[0].namespaces![0],
        children: [
          {
            id: nestedNamespaceMethodNodeId,
            node: nestedNamespaceMethod,
            type: 'method',
          },
        ],
      };

      const tree: IFEXTreeModelNode[] = [
        {
          id: namespaceNodeId,
          node: nodes[0],
          type: 'namespace',
          children: [
            nestedNamespaceTreeNode,
            {
              id: namespaceMethodNodeId,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id: secondNamespaceNodeId,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id: eventNodeID,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const result = findNodeById(nodeIdToFind, tree);

      expect(result).toBeUndefined();
    });
  });

  describe('findNodeByPath', () => {
    const setup = () => {
      // For this test it's esential to have unique ids for each node.
      const namespaceNodeId = '1';
      const nestedNamespaceNodeId = '2';
      const nestedNamespaceMethodNodeId = '3';
      const namespaceMethodNodeId = '4';
      const secondNamespaceNodeId = '5';
      const eventNodeID = '6';

      uuidSpy
        .mockReturnValueOnce(namespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceMethodNodeId)
        .mockReturnValueOnce(namespaceMethodNodeId)
        .mockReturnValueOnce(secondNamespaceNodeId)
        .mockReturnValue(eventNodeID);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'nested-namespace-method' };

      const nestedNamespace: Namespace = {
        name: 'nested-amespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'namespace-2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const nestedNamespaceMethodNode: IFEXTreeModelNode = {
        id: nestedNamespaceMethodNodeId,
        node: nestedNamespaceMethod,
        type: 'method',
      };

      const nestedNamespaceTreeNode: IFEXTreeModelNode = {
        id: nestedNamespaceNodeId,
        type: 'namespace',
        node: nodes[0].namespaces![0],
        children: [nestedNamespaceMethodNode],
      };

      const tree: IFEXTreeModelNode[] = [
        {
          id: namespaceNodeId,
          node: nodes[0],
          type: 'namespace',
          children: [
            nestedNamespaceTreeNode,
            {
              id: namespaceMethodNodeId,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id: secondNamespaceNodeId,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id: eventNodeID,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      return { tree, nodes, nestedNamespaceTreeNode, nestedNamespaceMethodNode };
    };

    it('should find root node by path', () => {
      const { tree, nodes } = setup();

      const path = `${nodes[1].name}`;

      const result = findNodeByPath(path, '', tree);

      expect(result).toEqual(tree[1]);
    });

    it('should find leaf by path', () => {
      const { tree, nodes, nestedNamespaceTreeNode, nestedNamespaceMethodNode } = setup();

      const path = `${nodes[0].name}.${nestedNamespaceTreeNode.node.name}.${nestedNamespaceMethodNode.node.name}`;

      const result = findNodeByPath(path, '', tree);

      expect(result).toEqual(nestedNamespaceMethodNode);
    });

    it('should find nested node by path', () => {
      const { tree, nodes, nestedNamespaceTreeNode } = setup();

      const path = `${nodes[0].name}.${nestedNamespaceTreeNode.node.name}`;

      const result = findNodeByPath(path, '', tree);

      expect(result).toEqual(nestedNamespaceTreeNode);
    });

    it('should find no node when unknown path is provided', () => {
      const { tree, nodes } = setup();

      const path = `${nodes[1].name}.some-unknown-path`;

      const result = findNodeByPath(path, '', tree);

      expect(result).toBeUndefined();
    });

    it('should return first found node if there are duplications', () => {
      const { tree } = setup();

      const treeWithDuplications: IFEXTreeModelNode[] = [
        tree[0],
        {
          ...tree[1],
          node: {
            ...tree[1].node,
            name: tree[0].node.name, // Assign same name as in first namespace to simulate duplicated nodes
          },
        },
      ];

      const path = `${treeWithDuplications[1].node.name}`;

      const result = findNodeByPath(path, '', treeWithDuplications);

      expect(result).toEqual(tree[0]);
    });
  });

  describe('getFullPathToNode', () => {
    it('should return full path of the node to look for', () => {
      // For this test it's esential to have unique ids for each node.
      const namespaceNodeId = '1';
      const nestedNamespaceNodeId = '2';
      const nestedNamespaceMethodNodeId = '3';
      const namespaceMethodNodeId = '4';
      const secondNamespaceNodeId = '5';
      const eventNodeID = '6';

      const nodeIdToFind = nestedNamespaceMethodNodeId;

      uuidSpy
        .mockReturnValueOnce(namespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceMethodNodeId)
        .mockReturnValueOnce(namespaceMethodNodeId)
        .mockReturnValueOnce(secondNamespaceNodeId)
        .mockReturnValue(eventNodeID);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'Nested Namespace Method' };

      const nestedNamespace: Namespace = {
        name: 'Nested Namespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const tree: IFEXTreeModelNode[] = [
        {
          id: namespaceNodeId,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id: nestedNamespaceNodeId,
              type: 'namespace',
              node: nodes[0].namespaces![0],
              children: [
                {
                  id: nestedNamespaceMethodNodeId,
                  node: nestedNamespaceMethod,
                  type: 'method',
                },
              ],
            },
            {
              id: namespaceMethodNodeId,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id: secondNamespaceNodeId,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id: eventNodeID,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const namespaceNode = tree[0];
      const nestedNamespaceNode = tree[0].children![0];
      const nestedNamespaceMethodNode = tree[0].children![0].children![0];
      const expectedPath: IFEXTreeModelNode[] = [namespaceNode, nestedNamespaceNode, nestedNamespaceMethodNode];

      const result = getFullPathToNode(nodeIdToFind, tree);

      expect(result).toEqual(expectedPath);
    });

    it('should return no path for non existing node', () => {
      // For this test it's esential to have unique ids for each node.
      const namespaceNodeId = '1';
      const nestedNamespaceNodeId = '2';
      const nestedNamespaceMethodNodeId = '3';
      const namespaceMethodNodeId = '4';
      const secondNamespaceNodeId = '5';
      const eventNodeID = '6';

      const nodeIdToFind = 'fake-id';

      uuidSpy
        .mockReturnValueOnce(namespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceNodeId)
        .mockReturnValueOnce(nestedNamespaceMethodNodeId)
        .mockReturnValueOnce(namespaceMethodNodeId)
        .mockReturnValueOnce(secondNamespaceNodeId)
        .mockReturnValue(eventNodeID);

      const nestedNamespaceMethod: Method = { ...methodMock, name: 'Nested Namespace Method' };

      const nestedNamespace: Namespace = {
        name: 'Nested Namespace',
        description: 'Lorem ipsum',
        methods: [nestedNamespaceMethod],
      };

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [nestedNamespace],
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          events: [eventMock],
        },
      ];

      const tree: IFEXTreeModelNode[] = [
        {
          id: namespaceNodeId,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id: nestedNamespaceNodeId,
              type: 'namespace',
              node: nodes[0].namespaces![0],
              children: [
                {
                  id: nestedNamespaceMethodNodeId,
                  node: nestedNamespaceMethod,
                  type: 'method',
                },
              ],
            },
            {
              id: namespaceMethodNodeId,
              node: methodMock,
              type: 'method',
            },
          ],
        },
        {
          id: secondNamespaceNodeId,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id: eventNodeID,
              node: eventMock,
              type: 'event',
            },
          ],
        },
      ];

      const result = getFullPathToNode(nodeIdToFind, tree);

      expect(result).toBeNull();
    });
  });

  describe('should append error objects correctly', () => {
    it('for namespaces', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
        },
      ];

      const instancePath = '/namespaces/1';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [],
        },
        { id, node: nodes[1], type: 'namespace', children: [], validationErrors: [errorObject] },
      ];

      const tree = createTreeModel(nodes, '/namespaces', new Map([[instancePath, [errorObject]]]));

      expect(tree).toEqual(expected);
    });

    it('for nested namespaces', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [
            {
              name: 'Nested namespace',
              description: 'Lorem ipsum',
            },
          ],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
        },
      ];

      const instancePath = '/namespaces/0/namespaces/0';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].namespaces![0],
              type: 'namespace',
              validationErrors: [errorObject],
              children: [],
            },
          ],
        },
        { id, node: nodes[1], type: 'namespace', children: [] },
      ];

      const tree = createTreeModel(nodes, '/namespaces', new Map([[instancePath, [errorObject]]]));

      expect(tree).toEqual(expected);
    });

    it('for interfaces', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          namespaces: [
            {
              name: 'Nested namespace',
              description: 'Lorem ipsum',
              interface: {
                name: 'Interface',
              },
            },
          ],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          interface: {
            name: 'Interface 2',
          },
        },
      ];

      const instancePath = '/namespaces/1/interfaces/0';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };
      const nestedInterfaceInstancePath = '/namespaces/0/namespaces/0/interfaces/0';
      const nestedInterfaceErrorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].namespaces![0],
              type: 'namespace',
              children: [
                {
                  id,
                  node: nodes[0].namespaces![0].interface!,
                  type: 'interface',
                  validationErrors: [nestedInterfaceErrorObject],
                  children: [],
                },
              ],
            },
          ],
        },
        { id, node: nodes[1], type: 'namespace', children: [{ id, node: nodes[1].interface!, type: 'interface', validationErrors: [errorObject], children: [] }] },
      ];

      const tree = createTreeModel(
        nodes,
        '/namespaces',
        new Map([
          [instancePath, [errorObject]],
          [nestedInterfaceInstancePath, [nestedInterfaceErrorObject]],
        ]),
      );

      expect(tree).toEqual(expected);
    });

    it('for leaf nodes', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          methods: [methodMock, { ...methodMock, name: 'Method 2' }, { ...methodMock, name: 'Method 3' }],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          methods: [methodMock],
        },
      ];

      const instancePath = '/namespaces/0/methods/2';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].methods![0],
              type: 'method',
            },
            {
              id,
              node: nodes[0].methods![1],
              type: 'method',
            },
            {
              id,
              node: nodes[0].methods![2],
              type: 'method',
              validationErrors: [errorObject],
            },
          ],
        },
        {
          id,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[1].methods![0],
              type: 'method',
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes, '/namespaces', new Map([[instancePath, [errorObject]]]));

      expect(tree).toEqual(expected);
    });

    it('for leaf nodes with errors in child properties', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          methods: [methodMock],
        },
        {
          name: 'Namespace 2',
          description: 'Lorem ipsum',
          methods: [methodMock],
          events: [eventMock],
        },
      ];

      const instancePath = '/namespaces/1/events/0';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };
      const nestedPropInstancePath = '/namespaces/1/events/0/inputs/0';
      const nestedPropErrorObject: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].methods![0],
              type: 'method',
            },
          ],
        },
        {
          id,
          node: nodes[1],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[1].methods![0],
              type: 'method',
            },
            {
              id,
              node: nodes[1].events![0],
              type: 'event',
              validationErrors: [errorObject, nestedPropErrorObject],
            },
          ],
        },
      ];

      const tree = createTreeModel(
        nodes,
        '/namespaces',
        new Map([
          [instancePath, [errorObject]],
          [nestedPropInstancePath, [nestedPropErrorObject]],
        ]),
      );

      expect(tree).toEqual(expected);
    });

    it('for typedef with missing datatype and datatypes', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          // Either datatype or datatypes should be defined even though the API allows for both to be undefined
          typedefs: [{ ...typedefMock, datatypes: undefined, datatype: undefined }],
        },
      ];

      const instancePath = '/namespaces/0/typedefs/0';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'missingProperties',
        params: {},
        schemaPath: '#/missingProperties',
        message: 'Should have at least one of the following: datatype or datatypes.',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].typedefs![0],
              type: 'typedef',
              validationErrors: [errorObject],
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes, '/namespaces', new Map([]));

      expect(tree).toEqual(expected);
    });

    it('for typedef with missing datatype and datatypes and already existing validation errors', () => {
      const id = '1234';
      uuidSpy.mockReturnValue(id);

      const nodes: Namespace[] = [
        {
          name: 'Namespace',
          description: 'Lorem ipsum',
          // Either datatype or datatypes should be defined even though the API allows for both to be undefined
          typedefs: [{ ...typedefMock, datatypes: undefined, datatype: undefined }],
        },
      ];

      const instancePath = '/namespaces/0/typedefs/0';
      const errorObject: ErrorObject = {
        instancePath,
        keyword: 'missingProperties',
        params: {},
        schemaPath: '#/missingProperties',
        message: 'Should have at least one of the following: datatype or datatypes.',
      };
      const existingError: ErrorObject = {
        instancePath,
        keyword: 'additionalProperties',
        params: {},
        schemaPath: '#/additionalProperties',
        message: 'must NOT have additional properties',
      };

      const expected: IFEXTreeModelNode[] = [
        {
          id,
          node: nodes[0],
          type: 'namespace',
          children: [
            {
              id,
              node: nodes[0].typedefs![0],
              type: 'typedef',
              validationErrors: [existingError, errorObject],
            },
          ],
        },
      ];

      const tree = createTreeModel(nodes, '/namespaces', new Map([[instancePath, [existingError]]]));

      expect(tree).toEqual(expected);
    });
  });
});

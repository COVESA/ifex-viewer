import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, it, MockInstance, vi, expect } from 'vitest';
import { useGetComplexDatatypeNode } from './use-get-complex-datatype-node.ts';
import { useComplexDatatypesStore } from '../stores/complex-datatypes/complex-datatypes.store.ts';
import { IfexSpecificationItem } from '../types.ts';
import { useViewerModelStore } from '../stores/viewer-model/viewer-model.store.ts';
import * as uuid from 'uuid';

vi.mock('uuid');

describe('useGetComplexDatatypeNode', () => {
  let uuidSpy: MockInstance;

  beforeEach(() => {
    setActivePinia(createPinia());
    uuidSpy = vi.spyOn(uuid, 'v4');
  });
  afterEach(() => vi.restoreAllMocks());

  it('should return node ID for complex datatype by name', () => {
    const structNodeId = 'struct-node-id';
    uuidSpy
      .mockReturnValueOnce('namespace-id') // will be used for the namespace node
      .mockReturnValueOnce(structNodeId) // will be used for the struct node
      .mockReturnValue('namespace-node-id'); // will be used for the namespace child node in the api node

    const specs: IfexSpecificationItem[] = [
      {
        filename: 'core-layer.yml',
        content: `
name: "Galactic Empire Core Layer"
namespaces:
  - name: "GalacticEmpire"
    major_version: 1
    minor_version: 0
    structs:
      - name: "Battleship"
        description: "A struct representing a Battleship in the Imperial fleet"
        members:
          - name: "model"
            datatype: "string"
            description: "The model of the starship"
    `,
      },
    ];

    const viewerModelStore = useViewerModelStore();
    viewerModelStore.setSpecifications(specs);

    const complexDatatypesStore = useComplexDatatypesStore();
    complexDatatypesStore.setComplexDatatypes(viewerModelStore.activeView);

    const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

    const nodeId = getNodeIdOfComplexDatatype('Battleship');

    expect(nodeId).toBe(structNodeId);
  });

  it('should return node ID for complex datatype by path', () => {
    const structNodeId = 'struct-node-id';
    uuidSpy
      .mockReturnValueOnce('namespace-id') // will be used for the namespace node
      .mockReturnValueOnce(structNodeId) // will be used for the struct node
      .mockReturnValue('namespace-node-id'); // will be used for the namespace child node in the api node

    const specs: IfexSpecificationItem[] = [
      {
        filename: 'core-layer.yml',
        content: `
name: "Galactic Empire Core Layer"
namespaces:
  - name: "GalacticEmpire"
    major_version: 1
    minor_version: 0
    structs:
      - name: "Battleship"
        description: "A struct representing a Battleship in the Imperial fleet"
        members:
          - name: "model"
            datatype: "string"
            description: "The model of the starship"
    `,
      },
    ];

    const viewerModelStore = useViewerModelStore();
    viewerModelStore.setSpecifications(specs);

    const complexDatatypesStore = useComplexDatatypesStore();
    complexDatatypesStore.setComplexDatatypes(viewerModelStore.activeView);

    const { getNodeIdOfComplexDatatype } = useGetComplexDatatypeNode();

    const nodeId = getNodeIdOfComplexDatatype('GalacticEmpire.Battleship');

    expect(nodeId).toBe(structNodeId);
  });
});

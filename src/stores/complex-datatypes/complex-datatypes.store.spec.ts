/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { createPinia, setActivePinia } from 'pinia';
import { useComplexDatatypesStore } from './complex-datatypes.store.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { viewerModelComplexDatatypesMock } from '../../tests/mocks/viewer-model.ts';
import { IFEXTreeModelNode } from '../../types/node.ts';

describe('useComplexDatatypesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should set complex datatypes by given tree nodes', () => {
    const expected: IFEXTreeModelNode[] = [
      {
        id: '21dfbe7c-0fa5-4c38-a563-becddbd804ba',
        node: {
          description: 'A struct representing a Battleship in the Imperial fleet',
          members: [
            {
              datatype: 'string',
              description: 'The model of the starship',
              name: 'model',
            },
            {
              datatype: 'number',
              description: 'The number of weapons the starship can carry',
              name: 'weaponCapacity',
            },
          ],
          name: 'Battleship',
        },
        type: 'struct',
      },
      {
        id: '85a8002d-4884-4d0a-8434-d801fd17cc77',
        node: {
          description: 'A struct representing a starship in the Imperial fleet',
          members: [
            {
              datatype: 'string',
              description: 'The model of the starship',
              name: 'model',
            },
            {
              datatype: 'number',
              description: "The rating of the starship's hyperdrive",
              name: 'hyperdriveRating',
            },
          ],
          name: 'Starship',
        },
        type: 'struct',
      },
      {
        id: 'a16581a4-8931-4339-ac69-1c65eab812ef',
        node: {
          datatype: 'string',
          description: 'Enumeration of ranks within the Imperial Army',
          name: 'Rank',
          options: [
            {
              description: 'Lowest rank within the stormtrooper ranks',
              name: 'Private',
              value: 'PRIVATE',
            },
            {
              description: 'A non-commissioned officer rank',
              name: 'Sergeant',
              value: 'SERGEANT',
            },
          ],
        },
        type: 'enumeration',
      },
      {
        id: 'be0acdff-126f-4621-90ee-535c32565ddf',
        node: {
          datatypes: ['string', 'SectorDetails'],
          description: 'Represents galactic coordinates for navigation and targeting',
          name: 'GalacticCoordinates',
        },
        type: 'typedef',
      },
    ];

    const complexDatatypesStore = useComplexDatatypesStore();

    complexDatatypesStore.setComplexDatatypes(viewerModelComplexDatatypesMock.layeredView);

    expect(complexDatatypesStore.complexDatatypes).toEqual(expected);
  });

  it('should find complex datatypes by name', () => {
    const complexDatatypesStore = useComplexDatatypesStore();
    complexDatatypesStore.setComplexDatatypes(viewerModelComplexDatatypesMock.layeredView);
    const expected: IFEXTreeModelNode = {
      id: 'be0acdff-126f-4621-90ee-535c32565ddf',
      node: {
        datatypes: ['string', 'SectorDetails'],
        description: 'Represents galactic coordinates for navigation and targeting',
        name: 'GalacticCoordinates',
      },
      type: 'typedef',
    };

    const result = complexDatatypesStore.getComplexDatatypeByName('GalacticCoordinates');

    expect(result).toEqual(expected);
  });
});

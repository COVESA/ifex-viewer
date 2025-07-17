import { Struct, StructWithCustomProperties } from '../../types/ifex-core';

export const structMock: Struct = {
  name: 'Starship',
  description: 'A struct representing a starship in the Imperial fleet',
  members: [
    {
      name: 'model',
      datatype: 'string',
      description: 'The model of the starship',
    },
    {
      name: 'weaponCapacity',
      datatype: 'number',
      description: 'The number of weapons the starship can carry',
    },
    {
      name: 'hyperdriveRating',
      datatype: 'number',
      description: "The rating of the starship's hyperdrive",
    },
  ],
};

export const structWithCustomPropertiesMock: StructWithCustomProperties = {
  ...structMock,
  mapper: 'starshipMapper',
  technicalOwner: 'Darth Vader',
};

import { Typedef, TypedefWithCustomProperties } from '../../types/ifex-core';

export const typedefMock: Typedef = {
  name: 'GalacticCoordinates',
  datatype: 'object',
  description: 'Represents galactic coordinates for navigation and targeting',
};

export const typedefWithCustomPropertiesMock: TypedefWithCustomProperties = {
  ...typedefMock,
  mapper: 'galacticCoordinatesMapper',
  technicalOwner: 'Darth Vader',
};

import { Property, PropertyWithCustomProperties } from '../../types/ifex-core';

export const propertyMock: Property = {
  name: 'emperor',
  datatype: 'string',
  description: 'The current Emperor of the Galactic Empire',
  arraysize: 10,
};

// IFEX Property node which has custom properties defined in e.g. deployment layer
export const propertyWithCustomPropertiesMock: PropertyWithCustomProperties = {
  ...propertyMock,
  mapper: 'emperorMapper',
};

import { Enumeration, EnumerationWithCustomProperties, OptionWithCustomProperties } from '../../types/ifex-core';

export const enumerationMock: Enumeration = {
  name: 'Rank',
  datatype: 'string',
  options: [
    {
      name: 'Private',
      value: 'PRIVATE',
      description: 'Lowest rank within the stormtrooper ranks',
    },
    {
      name: 'Sergeant',
      value: 'SERGEANT',
      description: 'A non-commissioned officer rank',
    },
    {
      name: 'General',
      value: 'GENERAL',
      description: 'High-ranking officer, commanding multiple regiments',
    },
  ],
  description: 'Enumeration of ranks within the Imperial Army',
};

export const enumerationWithCustomPropertiesMock: EnumerationWithCustomProperties = {
  ...enumerationMock,
  options: [
    ...(enumerationMock.options as OptionWithCustomProperties[]),
    {
      name: 'Commander',
      value: 'COMMANDER',
      description: 'High-ranking officer, commanding multiple regiments',
      directAccessToDeathStar: true,
    },
  ],
  custom_properties: {
    customProperty1: 'value1',
    customProperty2: 'value2',
  },
};

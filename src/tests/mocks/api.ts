import { ASTWithCustomProperties, IFEXCoreIDL } from '../../types/ifex-core';
import { namespaceMock, namespaceWithInterfaceMock } from './namespace';

export const apiMock: IFEXCoreIDL = {
  name: 'GalacticEmpireAPI',
  description: 'API for the operations and command structure of the Galactic Empire',
  includes: [{ file: 'droid.yml', description: 'Configuration for droids' }],
  major_version: 2,
  minor_version: 3,
  namespaces: [namespaceMock, namespaceWithInterfaceMock],
};

export const apiWithCustomPropertiesMock: ASTWithCustomProperties = {
  ...apiMock,
  patch_version: 1,
  custom_fields: {
    name: 'secretPlans',
    description: 'Encoded secret plans of the Empire',
    properties: {
      forceSensitiveIndividuals: {
        description: 'List of known force-sensitive individuals',
        items: {
          individualName: {
            description: 'Name of the force-sensitive individual',
            datatype: 'string',
          },
          midichlorianCount: {
            description: 'Midichlorian count of the individual',
            datatype: 'number',
          },
        },
        datatype: 'array',
      },
    },
  },
};

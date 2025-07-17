import { Namespace, NamespaceWithCustomProperties } from '../../types/ifex-core';
import { enumerationMock } from './enumeration';
import { eventMock } from './events';
import { interfaceMock } from './interface';
import { methodMock } from './methods';
import { structMock } from './structs';

export const namespaceMock: Namespace = {
  name: 'GalacticEmpire',
  description: 'Namespace for operations related to the Galactic Empire',
  major_version: 1,
  minor_version: 0,
  version_label: 'v1.0',
  events: [eventMock],
  methods: [
    methodMock,
    {
      name: 'deployStarfleet',
      description: 'Deploys a starfleet to a specified location',
      input: [
        {
          name: 'destination',
          datatype: 'string',
          description: 'The target destination for the starfleet',
        },
      ],
      errors: [
        {
          datatype: 'string',
          name: 'InsufficientFundsError',
          description: 'Raised when the Empire does not have enough resources to deploy the fleet',
        },
      ],
    },
  ],
  structs: [structMock],
  enumerations: [enumerationMock],
};

export const namespaceWithInterfaceMock: Namespace = {
  ...namespaceMock,
  interface: interfaceMock,
};

export const nestedNamespaceMock: Namespace = {
  ...namespaceMock,
  namespaces: [
    {
      name: 'ImperialIntelligence',
      description: 'Namespace for Imperial intelligence operations',
      major_version: 1,
      minor_version: 0,
      methods: [
        {
          name: 'gatherIntelligence',
          description: 'Gathers intelligence on specified targets',
          input: [
            {
              name: 'target',
              datatype: 'string',
              description: 'The target to gather intelligence on',
            },
          ],
          output: [
            {
              name: 'intelligenceReport',
              datatype: 'string',
              description: 'A report containing the gathered intelligence',
            },
          ],
        },
      ],
    },
    {
      name: 'ImperialNavy',
      description: 'Namespace for operations related to the Imperial Navy',
      major_version: 1,
      minor_version: 0,
      methods: [
        {
          name: 'deployTIEFighters',
          description: 'Deploys TIE fighters to patrol a specified sector',
          input: [
            {
              name: 'sector',
              datatype: 'string',
              description: 'The sector to patrol',
            },
            {
              name: 'numberOfFighters',
              datatype: 'number',
              description: 'The number of TIE fighters to deploy',
            },
          ],
          output: [
            {
              name: 'patrolStatus',
              datatype: 'string',
              description: 'Status of the TIE fighter deployment',
            },
          ],
        },
      ],
    },
  ],
};

export const namespaceWithCustomPropertiesMock: NamespaceWithCustomProperties = {
  ...namespaceMock,
  patch_version: '1',
  custom_properties: {
    customProperty1: 'value1',
    customProperty2: 'value2',
  },
};

import { Interface, InterfaceWithCustomProperties } from '../../types/ifex-core';

export const interfaceMock: Interface = {
  name: 'EmpireCommand',
  description: 'Interface for command operations within the Galactic Empire',
  major_version: 1,
  minor_version: 0,
  version_label: 'v1.0',
  methods: [
    {
      name: 'assignMission',
      description: 'Assigns a mission to a particular unit or operative',
      input: [
        {
          name: 'unitId',
          datatype: 'string',
          description: 'The ID of the unit or operative',
        },
        {
          name: 'missionDetails',
          datatype: 'string',
          description: 'A description of the mission objectives',
        },
      ],
      output: [
        {
          name: 'missionId',
          datatype: 'string',
          description: 'The ID of the assigned mission',
        },
      ],
    },
    {
      name: 'reportStatus',
      description: 'Reports the current status of a particular sector or operation',
      input: [
        {
          name: 'sector',
          datatype: 'string',
          description: 'The sector for which to report status',
        },
      ],
      output: [
        {
          name: 'statusReport',
          datatype: 'string',
          description: 'A detailed report of the current status',
        },
      ],
    },
  ],
  events: [
    {
      name: 'RebelActivityDetected',
      description: 'Event triggered when rebel activity is detected within a sector',
      input: [
        {
          name: 'sector',
          datatype: 'string',
          description: 'The sector where the activity was detected',
        },
        {
          name: 'levelOfThreat',
          datatype: 'string',
          description: 'The assessed level of threat from the activity',
        },
      ],
    },
  ],
  properties: [
    {
      name: 'fleetReadyStatus',
      datatype: 'boolean',
      description: 'Indicates whether the fleet is ready for deployment',
    },
  ],
};

export const interfaceWithCustomPropertiesMock: InterfaceWithCustomProperties = {
  ...interfaceMock,
  patch_version: '1',
  custom_properties: {
    target: 'empire-command-service',
    technology: 'REST',
    protocol: 'HTTP',
  },
};

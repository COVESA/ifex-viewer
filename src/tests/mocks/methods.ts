import { Method, MethodWithCustomProperties } from '../../types/ifex-core';

export const methodMock: Method = {
  name: 'recruitStormtrooper',
  description: 'Recruits a new stormtrooper to the Imperial Army',
  input: [
    {
      name: 'name',
      datatype: 'string',
      description: 'Name of the recruit',
    },
    {
      name: 'planetOfOrigin',
      datatype: 'string',
      description: 'Planet where the recruit was born',
    },
  ],
  output: [
    {
      name: 'stormtrooperId',
      datatype: 'string',
      description: 'The ID of the newly recruited stormtrooper',
    },
  ],
  returns: [{ name: 'stormtroopers', datatype: 'array' }],
  errors: [
    {
      datatype: 'string',
      name: 'InsufficientFundsError',
      description: 'Raised when the Empire does not have enough resources to deploy the fleet',
    },
  ],
};

export const methodWithCustomPropertiesMock: MethodWithCustomProperties = {
  ...methodMock,
  target: 'stormtrooper-recruitment-service',
  technology: 'REST',
  protocol: 'HTTP',
};

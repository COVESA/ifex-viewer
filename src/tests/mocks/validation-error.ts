import { ErrorObject } from 'ajv';

export const validationErrorMock: ErrorObject = {
  keyword: 'invalid-protocol',
  instancePath: '/namespaces/0/droids/1/R2-D2/0/communication',
  schemaPath: '#/properties/communication/properties/protocol',
  params: {
    protocol: 'x-wing-comms',
  },
  propertyName: 'protocol',
  message: 'The protocol specified is not supported for this droid model.',
  schema: {
    protocol: ['binary', 'astromech', 'galactic-basic'],
  },
  parentSchema: {
    type: 'object',
    properties: {
      communication: {
        type: 'object',
        properties: {
          protocol: {
            type: 'string',
            enum: ['binary', 'astromech', 'galactic-basic'],
          },
        },
        required: ['protocol'],
      },
    },
  },
  data: {
    protocol: 'x-wing-comms', // The actual data that was invalid
  },
};

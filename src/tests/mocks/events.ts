import { Event, EventWithCustomProperties } from '../../types/ifex-core';

export const eventMock: Event = {
  name: 'DeathStarDestroyed',
  description: 'Event triggered when a Death Star is destroyed',
  input: [
    {
      name: 'deathStarId',
      datatype: 'string',
      description: 'The ID of the destroyed Death Star',
    },
    {
      name: 'destroyedBy',
      datatype: 'string',
      description: 'The name of the entity responsible for the destruction',
    },
  ],
};

export const eventWithCustomPropertiesMock: EventWithCustomProperties = {
  ...eventMock,
  custom_arguments: {
    channel: 'deathStarChannel',
    broadcast: true,
  },
};

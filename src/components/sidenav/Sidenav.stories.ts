import type { Meta, StoryObj } from '@storybook/vue3';

import { enumerationMock } from '../../tests/mocks/enumeration';
import { eventMock } from '../../tests/mocks/events';
import { interfaceMock } from '../../tests/mocks/interface';
import { methodMock } from '../../tests/mocks/methods';
import { namespaceMock } from '../../tests/mocks/namespace';
import { propertyMock } from '../../tests/mocks/properties';
import { structMock } from '../../tests/mocks/structs';
import { typedefMock } from '../../tests/mocks/typedef';
import Sidenav from './Sidenav.vue';
import { v4 as uuid } from 'uuid';

const meta: Meta<typeof Sidenav> = {
  component: Sidenav,
};

export default meta;
type Story = StoryObj<typeof Sidenav>;

export const Default: Story = {
  render: args => ({
    components: { Sidenav },
    setup() {
      return { args };
    },
    template: '<Sidenav v-bind="args" />',
  }),
  args: {
    selectedNodeId: '3',
    treeModel: [
      {
        id: uuid(),
        node: namespaceMock,
        type: 'namespace',
        children: [
          {
            id: uuid(),
            node: { ...namespaceMock, name: 'Imperial Navy' },
            type: 'namespace',
            children: [
              { id: uuid(), node: methodMock, type: 'method' },
              { id: uuid(), node: { ...methodMock, name: 'deployTIEFighter' }, type: 'method' },
            ],
          },
          { id: uuid(), node: propertyMock, type: 'property' },
        ],
      },
      {
        id: uuid(),
        node: interfaceMock,
        type: 'interface',
        children: [
          { type: 'event', id: uuid(), node: eventMock },
          { id: uuid(), node: enumerationMock, type: 'enumeration' },
          { id: uuid(), node: structMock, type: 'struct' },
          { id: uuid(), node: typedefMock, type: 'typedef' },
        ],
      },
    ],
  },
};

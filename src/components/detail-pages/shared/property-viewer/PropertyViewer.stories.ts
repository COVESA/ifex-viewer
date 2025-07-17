import { Meta, StoryObj } from '@storybook/vue3';
import PropertyViewer from './PropertyViewer.vue';
import { methodMock } from '../../../../tests/mocks/methods';
import { ArgumentWithCustomProperties } from '../../../../types/ifex-core.ts';

const meta: Meta<typeof PropertyViewer> = {
  component: PropertyViewer,
};

export default meta;
type Story = StoryObj<typeof PropertyViewer>;

export const Primary: Story = {
  render: args => ({
    components: { PropertyViewer },
    setup() {
      return { args };
    },
    template: '<PropertyViewer v-bind="args" />',
  }),
  args: { headline: 'Input', properties: methodMock.input as ArgumentWithCustomProperties[] },
};

export const WithMetadata: Story = {
  render: args => ({
    components: { PropertyViewer },
    setup() {
      return { args };
    },
    template: '<PropertyViewer v-bind="args" />',
  }),
  args: {
    headline: 'Input',
    properties: [
      { ...methodMock.input![0], arraysize: 10 },
      { ...methodMock.input![0], range: '0...100' },
    ],
    parentDotNotationFullPath: 'root.namespace.method',
  },
};

export const ErrorVisualization: Story = {
  render: args => ({
    components: { PropertyViewer },
    setup() {
      return { args };
    },
    template: '<PropertyViewer v-bind="args" />',
  }),
  args: {
    headline: 'Errors',
    properties: [
      { name: '404', datatype: 'string', description: 'Something went wrong' },
      { datatype: 'uint8', description: 'Error code' },
    ],
    parentDotNotationFullPath: 'root.namespace.method',
  },
};

export const WithCustomProperties: Story = {
  render: args => ({
    components: { PropertyViewer },
    setup() {
      return { args };
    },
    template: '<PropertyViewer v-bind="args" />',
  }),
  args: {
    headline: 'Inputs',
    properties: [
      { ...methodMock.input![0], arraysize: 10, example: 'Darth Vader' },
      { ...methodMock.input![0], range: '0...100', example: 'Tatooine', default: 'Hoth' },
    ],
    parentDotNotationFullPath: 'root.namespace.method',
  },
};

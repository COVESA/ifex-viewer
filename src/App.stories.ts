import type { Meta, StoryObj } from '@storybook/vue3-vite';

import App from './App.vue';
import { customLayerSpecificationItemMock, specificationItemMock, specificationMockWithValidationErrors, specificationWithTwoDocs } from './tests/mocks/specification';

const meta: Meta<typeof App> = {
  component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const Primary: Story = {
  render: args => ({
    components: { App },
    setup() {
      return { args };
    },
    template: '<App v-bind="args" />',
  }),
  args: {
    specifications: [specificationItemMock],
  },
};

export const WithValidationErrors: Story = {
  render: args => ({
    components: { App },
    setup() {
      return { args };
    },
    template: '<App v-bind="args" />',
  }),
  args: {
    specifications: [{ ...specificationItemMock, content: specificationMockWithValidationErrors }],
  },
};

export const WithMultipleLayers: Story = {
  render: args => ({
    components: { App },
    setup() {
      return { args };
    },
    template: '<App v-bind="args" />',
  }),
  args: {
    specifications: [{ ...specificationItemMock, content: specificationWithTwoDocs }, customLayerSpecificationItemMock],
  },
};

export const NoFiles: Story = {
  render: args => ({
    components: { App },
    setup() {
      return { args };
    },
    template: '<App v-bind="args" />',
  }),
  args: {
    specifications: [],
  },
};

export const PartiallyEmptyFile: Story = {
  render: args => ({
    components: { App },
    setup() {
      return { args };
    },
    template: '<App v-bind="args" />',
  }),
  args: {
    specifications: [{ ...specificationItemMock, content: specificationWithTwoDocs }, null as any],
  },
};

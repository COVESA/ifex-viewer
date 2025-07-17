import { Meta, StoryObj } from '@storybook/vue3';
import { typedefMock } from '../../../tests/mocks/typedef';
import TypedefDetailPage from './TypedefDetailPage.vue';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const meta: Meta<typeof TypedefDetailPage> = {
  component: TypedefDetailPage,
};

export default meta;
type Story = StoryObj<typeof TypedefDetailPage>;

export const Primary: Story = {
  render: args => ({
    components: { TypedefDetailPage },
    setup() {
      return { args };
    },
    template: '<TypedefDetailPage v-bind="args" />',
  }),
  args: { typedef: typedefMock, dotNotationFullPath: `namespaces.${typedefMock.name}` },
};

export const WithArraysize: Story = {
  render: args => ({
    components: { TypedefDetailPage },
    setup() {
      return { args };
    },
    template: '<TypedefDetailPage v-bind="args" />',
  }),
  args: { typedef: { ...typedefMock, arraysize: 5 }, dotNotationFullPath: `namespaces.${typedefMock.name}` },
};

export const WithMinMax: Story = {
  render: args => ({
    components: { TypedefDetailPage },
    setup() {
      return { args };
    },
    template: '<TypedefDetailPage v-bind="args" />',
  }),
  args: { typedef: { ...typedefMock, min: 0, max: 100 }, dotNotationFullPath: `namespaces.${typedefMock.name}` },
};

export const WithAllMetadata: Story = {
  render: args => ({
    components: { TypedefDetailPage },
    setup() {
      return { args };
    },
    template: '<TypedefDetailPage v-bind="args" />',
  }),
  args: { typedef: { ...typedefMock, arraysize: 10, min: 0, max: 100 }, dotNotationFullPath: `namespaces.${typedefMock.name}` },
};

export const WithValidationErrors: Story = {
  render: args => ({
    components: { TypedefDetailPage },
    setup() {
      return { args };
    },
    template: '<TypedefDetailPage v-bind="args" />',
  }),
  args: { typedef: { ...typedefMock, min: 0, max: 100 }, validationErrors: [validationErrorMock], dotNotationFullPath: `namespaces.${typedefMock.name}` },
};

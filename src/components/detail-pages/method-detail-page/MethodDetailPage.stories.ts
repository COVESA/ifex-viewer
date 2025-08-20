import { Meta, StoryObj } from '@storybook/vue3-vite';
import { namespaceMock } from '../../../tests/mocks/namespace';
import MethodDetailPage from './MethodDetailPage.vue';
import { methodMock } from '../../../tests/mocks/methods';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const meta: Meta<typeof MethodDetailPage> = {
  component: MethodDetailPage,
};

export default meta;
type Story = StoryObj<typeof MethodDetailPage>;

export const Primary: Story = {
  render: args => ({
    components: { MethodDetailPage },
    setup() {
      return { args };
    },
    template: '<MethodDetailPage v-bind="args" />',
  }),
  args: { method: methodMock, dotNotationFullPath: `namespaces.${namespaceMock.name}` },
};

export const OnlyInputs: Story = {
  render: args => ({
    components: { MethodDetailPage },
    setup() {
      return { args };
    },
    template: '<MethodDetailPage v-bind="args" />',
  }),
  args: { method: { ...methodMock, returns: undefined, output: undefined, errors: undefined }, dotNotationFullPath: `namespaces.${namespaceMock.name}` },
};

export const OnlyReturns: Story = {
  render: args => ({
    components: { MethodDetailPage },
    setup() {
      return { args };
    },
    template: '<MethodDetailPage v-bind="args" />',
  }),
  args: { method: { ...methodMock, input: undefined, output: undefined, errors: undefined }, dotNotationFullPath: `namespaces.${namespaceMock.name}` },
};

export const OnlyErrors: Story = {
  render: args => ({
    components: { MethodDetailPage },
    setup() {
      return { args };
    },
    template: '<MethodDetailPage v-bind="args" />',
  }),
  args: { method: { ...methodMock, input: undefined, output: undefined, returns: undefined }, dotNotationFullPath: `namespaces.${namespaceMock.name}` },
};

export const WithValidationErrors: Story = {
  render: args => ({
    components: { MethodDetailPage },
    setup() {
      return { args };
    },
    template: '<MethodDetailPage v-bind="args" />',
  }),
  args: { method: { ...methodMock }, dotNotationFullPath: `namespaces.${namespaceMock.name}`, validationErrors: [validationErrorMock] },
};

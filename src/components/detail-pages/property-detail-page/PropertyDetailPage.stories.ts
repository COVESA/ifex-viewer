import { Meta, StoryObj } from '@storybook/vue3';
import { validationErrorMock } from '../../../tests/mocks/validation-error';
import PropertyDetailPage from './PropertyDetailPage.vue';
import { propertyMock } from '../../../tests/mocks/properties';

const meta: Meta<typeof PropertyDetailPage> = {
  component: PropertyDetailPage,
};

export default meta;
type Story = StoryObj<typeof PropertyDetailPage>;

export const Primary: Story = {
  render: args => ({
    components: { PropertyDetailPage },
    setup() {
      return { args };
    },
    template: '<PropertyDetailPage v-bind="args" />',
  }),
  args: { propertyData: propertyMock, dotNotationFullPath: `namespaces.${propertyMock.name}` },
};

export const WithValidationErrors: Story = {
  render: args => ({
    components: { PropertyDetailPage },
    setup() {
      return { args };
    },
    template: '<PropertyDetailPage v-bind="args" />',
  }),
  args: { propertyData: propertyMock, validationErrors: [validationErrorMock], dotNotationFullPath: `namespaces.${propertyMock.name}` },
};

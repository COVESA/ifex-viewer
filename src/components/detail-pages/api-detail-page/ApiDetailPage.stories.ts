import { Meta, StoryObj } from '@storybook/vue3';
import ApiDetailPage from './ApiDetailPage.vue';
import { apiMock } from '../../../tests/mocks/api';

const meta: Meta<typeof ApiDetailPage> = {
  component: ApiDetailPage,
};

export default meta;
type Story = StoryObj<typeof ApiDetailPage>;

export const Default: Story = {
  render: args => ({
    components: { ApiDetailPage },
    setup() {
      return { args };
    },
    template: '<ApiDetailPage v-bind="args" />',
  }),
  args: { api: { ...apiMock, includes: undefined } },
};

export const WithIncludes: Story = {
  render: args => ({
    components: { ApiDetailPage },
    setup() {
      return { args };
    },
    template: '<ApiDetailPage v-bind="args" />',
  }),
  args: { api: apiMock },
};

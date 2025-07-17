import { Meta, StoryObj } from '@storybook/vue3';
import { enumerationMock } from '../../../tests/mocks/enumeration';
import EnumerationDetailPage from './EnumerationDetailPage.vue';

const meta: Meta<typeof EnumerationDetailPage> = {
  component: EnumerationDetailPage,
};

export default meta;
type Story = StoryObj<typeof EnumerationDetailPage>;

export const Default: Story = {
  render: args => ({
    components: { EnumerationDetailPage },
    setup() {
      return { args };
    },
    template: '<EnumerationDetailPage v-bind="args" />',
  }),
  args: { enumeration: { ...enumerationMock } },
};

import { Meta, StoryObj } from '@storybook/vue3';
import FallbackPage from './FallbackPage.vue';

const meta: Meta<typeof FallbackPage> = {
  component: FallbackPage,
};

export default meta;
type Story = StoryObj<typeof FallbackPage>;

export const Primary: Story = {
  render: args => ({
    components: { FallbackPage },
    setup() {
      return { args };
    },
    template: '<FallbackPage v-bind="args" />',
  }),
};

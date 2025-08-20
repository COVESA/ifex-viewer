import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SearchInput from './SearchInput.vue';

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: args => ({
    components: { SearchInput },
    setup() {
      return { args };
    },
    template: '<SearchInput v-bind="args" />',
  }),
  args: {},
};

import { Meta, StoryObj } from '@storybook/vue3-vite';
import Tabs from './Tabs.vue';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Primary: Story = {
  render: args => ({
    components: { Tabs },
    setup() {
      return { args };
    },
    template: '<Tabs v-bind="args"  />',
  }),
  args: {
    tabs: ['Tab 1', 'Tab 2'],
  },
};

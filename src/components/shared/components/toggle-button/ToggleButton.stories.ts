import { Meta, StoryObj } from '@storybook/vue3-vite';
import ToggleButton from './ToggleButton.vue';

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Primary: Story = {
  render: args => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args" />',
  }),
  args: {},
};

export const WithLabel: Story = {
  render: args => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args" />',
  }),
  args: {
    withLabel: true,
  },
};

export const InitiallyCollapsed: Story = {
  render: args => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args" />',
  }),
  args: {
    withLabel: true,
    expanded: false,
  },
};

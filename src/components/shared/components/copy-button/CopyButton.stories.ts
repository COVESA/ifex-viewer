import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CopyButton from './CopyButton.vue';

const meta: Meta<typeof CopyButton> = {
  component: CopyButton,
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Primary: Story = {
  render: args => ({
    components: { CopyButton },
    setup() {
      return { args };
    },
    template: '<CopyButton v-bind="args" />',
  }),
  args: {
    data: 'In a galaxy far, far away, where Jedi and Sith often play, Lightsabers gleam, in a Force-filled dream, May the Force be with you every day!',
  },
};

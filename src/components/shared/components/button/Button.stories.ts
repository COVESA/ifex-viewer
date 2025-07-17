import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Primary</Button>',
  }),
  args: {
    variant: 'primary',
    size: 'm',
  },
};

export const Secondary: Story = {
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Secondary</Button>',
  }),
  args: {
    variant: 'secondary',
    size: 'm',
  },
};

export const SizeS: Story = {
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Small button</Button>',
  }),
  args: {
    variant: 'primary',
    size: 's',
  },
};

export const SizeM: Story = {
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Medium button</Button>',
  }),
  args: {
    variant: 'primary',
    size: 'm',
  },
};

export const SizeL: Story = {
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Large button</Button>',
  }),
  args: {
    variant: 'primary',
    size: 'l',
  },
};

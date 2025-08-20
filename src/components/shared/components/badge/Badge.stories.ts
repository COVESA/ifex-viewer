import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Badge from './Badge.vue';

const meta: Meta<typeof Badge> = {
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const WithSlot: Story = {
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">Primary</Badge>',
  }),
  args: {
    type: 'primary',
    size: 'm',
  },
};

export const IfexType: Story = {
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args"/>',
  }),
  args: {
    type: 'namespace',
    size: 'm',
  },
};

export const SizeSBadge: Story = {
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args"/>',
  }),
  args: {
    type: 'method',
    size: 's',
  },
};

export const SizeMBadge: Story = {
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args"/>',
  }),
  args: {
    type: 'method',
    size: 'm',
  },
};

export const SizeLBadge: Story = {
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args"/>',
  }),
  args: {
    type: 'method',
    size: 'l',
  },
};

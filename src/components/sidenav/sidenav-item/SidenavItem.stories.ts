import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SidenavItem from './SidenavItem.vue';

const meta: Meta<typeof SidenavItem> = {
  component: SidenavItem,
};

export default meta;
type Story = StoryObj<typeof SidenavItem>;

export const LeafNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'recruitStormtrooper',
      level: 1,
      type: 'method',
      expanded: true,
    },
  },
};

export const SelectedNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'recruitStormtrooper',
      level: 1,
      type: 'method',
      expanded: true,
      selected: true,
    },
  },
};

export const WithError: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'recruitStormtrooper',
      level: 1,
      type: 'method',
      expanded: true,
      hasError: true,
    },
  },
};

export const WrapperNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'Methods',
      level: 1,
      type: 'wrapper',
      expanded: true,
      children: [
        { id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: true },
        { id: '123456', label: 'recruitStormtrooper', level: 2, type: 'method', expanded: true },
      ],
    },
  },
};

export const NamespaceNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'Imperial Navy',
      level: 1,
      type: 'namespace',
      expanded: true,
      children: [
        { id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: true },
        { id: '123456', label: 'recruitStormtrooper', level: 2, type: 'method', expanded: true },
      ],
    },
  },
};

export const NestedNamespaceNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'Imperial Navy',
      level: 1,
      type: 'namespace',
      expanded: true,
      children: [
        {
          id: '12345',
          label: 'Fleet Command',
          level: 2,
          type: 'namespace',
          expanded: true,
          children: [
            {
              id: '1234',
              label: 'Events',
              level: 3,
              type: 'wrapper',
              expanded: true,
              children: [{ id: '123456', label: 'Death Star destroyed', level: 4, type: 'event', expanded: true }],
            },
          ],
        },
        {
          id: '1234567',
          label: 'Methods',
          level: 2,
          type: 'wrapper',
          expanded: true,
          children: [
            { id: '12345678', label: 'deployTIEFighters', level: 3, type: 'method', expanded: true },
            { id: '123456789', label: 'recruitStormtrooper', level: 3, type: 'method', expanded: true },
          ],
        },
      ],
    },
  },
};

export const InterfaceNode: Story = {
  render: args => ({
    components: { SidenavItem },
    setup() {
      return { args };
    },
    template: '<SidenavItem v-bind="args">Primary</SidenavItem>',
  }),
  args: {
    node: {
      id: '1234',
      label: 'Imperial Navy',
      level: 1,
      type: 'interface',
      expanded: true,
    },
  },
};

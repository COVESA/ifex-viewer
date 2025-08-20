import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Breadcrumbs from './Breadcrumbs.vue';

const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Primary: Story = {
  render: args => ({
    components: { Breadcrumbs },
    setup() {
      return { args };
    },
    template: '<Breadcrumbs v-bind="args" />',
  }),
  args: {
    breadcrumbs: [
      {
        text: 'Galactice Empire',
        nodeId: '1',
      },
      {
        text: 'recruitStormtrooper',
        nodeId: '2',
      },
    ],
  },
};

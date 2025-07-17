import { Meta, StoryObj } from '@storybook/vue3';
import SourceCodeViewer from './SourceCodeViewer.vue';
import { codeMock } from '../../../../tests/mocks/code.ts';

const meta: Meta<typeof SourceCodeViewer> = {
  component: SourceCodeViewer,
};

export default meta;
type Story = StoryObj<typeof SourceCodeViewer>;

export const Primary: Story = {
  render: args => ({
    components: { SourceCodeViewer },
    setup() {
      return { args };
    },
    template: '<SourceCodeViewer v-bind="args" />',
  }),
  args: {
    code: codeMock,
  },
};

import { Meta, StoryObj } from '@storybook/vue3-vite';
import { structMock } from '../../../tests/mocks/structs';
import StructDetailPage from './StructDetailPage.vue';

const meta: Meta<typeof StructDetailPage> = {
  component: StructDetailPage,
};

export default meta;
type Story = StoryObj<typeof StructDetailPage>;

export const Primary: Story = {
  render: args => ({
    components: { StructDetailPage },
    setup() {
      return { args };
    },
    template: '<StructDetailPage v-bind="args" />',
  }),
  args: { struct: structMock, dotNotationFullPath: `namespaces.${structMock.name}` },
};

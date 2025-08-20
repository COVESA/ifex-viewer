import { Meta, StoryObj } from '@storybook/vue3-vite';
import { interfaceMock } from '../../../tests/mocks/interface';
import { namespaceMock } from '../../../tests/mocks/namespace';
import GroupedDetailPage from './GroupedDetailPage.vue';

const meta: Meta<typeof GroupedDetailPage> = {
  component: GroupedDetailPage,
};

export default meta;
type Story = StoryObj<typeof GroupedDetailPage>;

export const NamespaceDetailPage: Story = {
  render: args => ({
    components: { GroupedDetailPage },
    setup() {
      return { args };
    },
    template: '<GroupedDetailPage v-bind="args" />',
  }),
  args: { data: namespaceMock, type: 'namespace', dotNotationFullPath: `namespaces.${namespaceMock.name}` },
};

export const InterfaceDetailPage: Story = {
  render: args => ({
    components: { GroupedDetailPage },
    setup() {
      return { args };
    },
    template: '<GroupedDetailPage v-bind="args" />',
  }),
  args: { data: interfaceMock, type: 'interface', dotNotationFullPath: `namespaces.interface.${namespaceMock.name}` },
};

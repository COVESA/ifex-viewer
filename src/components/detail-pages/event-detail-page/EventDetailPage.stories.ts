import { Meta, StoryObj } from '@storybook/vue3-vite';
import { eventMock } from '../../../tests/mocks/events';
import EventDetailPage from './EventDetailPage.vue';

const meta: Meta<typeof EventDetailPage> = {
  component: EventDetailPage,
};

export default meta;
type Story = StoryObj<typeof EventDetailPage>;

export const Primary: Story = {
  render: args => ({
    components: { EventDetailPage },
    setup() {
      return { args };
    },
    template: '<EventDetailPage v-bind="args" />',
  }),
  args: { event: eventMock, dotNotationFullPath: `namespaces.${eventMock.name}` },
};

import { Meta, StoryObj } from '@storybook/vue3-vite';
import ErrorNotification from './ErrorNotification.vue';
import { validationErrorMock } from '../../../../tests/mocks/validation-error';

const meta: Meta<typeof ErrorNotification> = {
  component: ErrorNotification,
};

export default meta;
type Story = StoryObj<typeof ErrorNotification>;

export const Primary: Story = {
  render: args => ({
    components: { ErrorNotification },
    setup() {
      return { args };
    },
    template: '<ErrorNotification v-bind="args" />',
  }),
  args: {
    validationError: validationErrorMock,
  },
};

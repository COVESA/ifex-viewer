import { Meta, StoryObj } from '@storybook/vue3';
import DetailPageContainer from './DetailPageContainer.vue';
import Headline from '../headline/Headline.vue';
import { validationErrorMock } from '../../../../tests/mocks/validation-error';
import { codeMock } from '../../../../tests/mocks/code.ts';

const meta: Meta<typeof DetailPageContainer> = {
  component: DetailPageContainer,
};

export default meta;
type Story = StoryObj<typeof DetailPageContainer>;

export const Primary: Story = {
  render: args => ({
    components: { DetailPageContainer, Headline },
    setup() {
      return { args };
    },
    template: `
      <DetailPageContainer v-bind="args">
        <template #headline>
          <Headline headline="Galactic Empire" />
        </template>
        <div>
          Imagine a picture of Darth Vader here ...
        </div>
      </DetailPageContainer>`,
  }),
  args: {
    description:
      'The Galactic Empire in Star Wars is a tyrannical regime led by Emperor Palpatine, characterized by its oppressive rule, military dominance, and the dark influence of the Sith.',
  },
};

export const WithValidationErrors: Story = {
  render: args => ({
    components: { DetailPageContainer, Headline },
    setup() {
      return { args };
    },
    template: `
      <DetailPageContainer v-bind="args">
        <template #headline>
          <Headline headline="Galactic Empire" />
        </template>
        <div>
          Imagine a picture of Darth Vader here ...
        </div>
      </DetailPageContainer>`,
  }),
  args: {
    description:
      'The Galactic Empire in Star Wars is a tyrannical regime led by Emperor Palpatine, characterized by its oppressive rule, military dominance, and the dark influence of the Sith.',
    validationErrors: [validationErrorMock],
  },
};

export const WithCustomProperties: Story = {
  render: args => ({
    components: { DetailPageContainer, Headline },
    setup() {
      return { args };
    },
    template: `
      <DetailPageContainer v-bind="args">
        <template #headline>
          <Headline headline="Galactic Empire" />
        </template>
        <div>
          Imagine a picture of Darth Vader here ...
        </div>
      </DetailPageContainer>`,
  }),
  args: {
    description:
      'The Galactic Empire in Star Wars is a tyrannical regime led by Emperor Palpatine, characterized by its oppressive rule, military dominance, and the dark influence of the Sith.',
    customProperties: codeMock,
  },
};

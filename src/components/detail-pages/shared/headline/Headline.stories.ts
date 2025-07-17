import { Meta, StoryObj } from '@storybook/vue3';
import Headline from './Headline.vue';
import Badge from '../../../shared/components/badge/Badge.vue';

const meta: Meta<typeof Headline> = {
  component: Headline,
};

export default meta;
type Story = StoryObj<typeof Headline>;

export const Primary: Story = {
  render: args => ({
    components: { Headline },
    setup() {
      return { args };
    },
    template: '<Headline v-bind="args" />',
  }),
  args: {
    headline: 'getStormtrooper',
    pageType: 'method',
    dotNotation: 'GalacticEmpire.getStormtrooper',
  },
};

export const WithAdditionalBadges: Story = {
  render: args => ({
    components: { Headline, Badge },
    setup() {
      return { args };
    },
    template: `
        <Headline v-bind="args">
            <template #default>
                <Badge type="primitiveType">String</Badge>
            </template>
        </Headline>`,
  }),
  args: { headline: 'emperor', pageType: 'property', dotNotation: 'GalacticEmpire.emperor' },
};

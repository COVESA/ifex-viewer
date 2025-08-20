import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SearchResults from './SearchResults.vue';

const meta: Meta<typeof SearchResults> = {
  component: SearchResults,
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const Default: Story = {
  render: args => ({
    components: { SearchResults },
    setup() {
      return { args };
    },
    template: '<SearchResults v-bind="args" />',
  }),
  args: {
    searchResults: [
      {
        id: '1',
        title: 'GalacticEmpire',
        description:
          "The Galactic Empire, declared as the First Galactic Empire, and also known as the New Order, the Old Empire, the First Empire, Palpatine's New Order, the Imperium or simply the Empire, was the galactic government established by Supreme Chancellor Palpatine to replace the Galactic Republic in 19 BBY and bring Sith rule to the galaxy.",
        type: 'namespace',
      },
      {
        id: '2',
        title: 'getStarship',
        description: 'Starship query.',
        type: 'method',
      },
    ],
    searchQuery: '',
  },
};

export const NoResults: Story = {
  render: args => ({
    components: { SearchResults },
    setup() {
      return { args };
    },
    template: '<SearchResults v-bind="args" />',
  }),
  args: {
    searchResults: [],
    searchQuery: '',
  },
};

export const NoResultsWithQuery: Story = {
  render: args => ({
    components: { SearchResults },
    setup() {
      return { args };
    },
    template: '<SearchResults v-bind="args" />',
  }),
  args: {
    searchResults: [],
    searchQuery: 'Some search query',
  },
};

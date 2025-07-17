/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { getTestOptions } from '../../../tests/base-test-options.ts';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import SearchResults from './SearchResults.vue';
import { SearchResult, SearchResultsProps } from './types.ts';

const renderComponent = (props: SearchResultsProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(SearchResults, { ...options, props });

  return { user, emitted };
};

describe('SearchResults', () => {
  it('should render no search results found', async () => {
    renderComponent({ searchResults: [], searchQuery: '' });

    expect(screen.getByText('No search results found.')).toBeInTheDocument();
  });

  it('should render no search results found for given search query', async () => {
    const searchQuery = 'test';
    renderComponent({ searchResults: [], searchQuery });

    expect(screen.getByText(`No search results found for "${searchQuery}".`)).toBeInTheDocument();
  });

  it('should render given search results', async () => {
    const searchQuery = 'test';
    const searchResults: SearchResultsProps['searchResults'] = [
      {
        id: '1',
        title: 'GalacticEmpire',
        description:
          "The Galactic Empire, declared as the First Galactic Empire, and also known as the New Order, the Old Empire, the First Empire, Palpatine's New Order, the Imperium or simply the Empire, was the galactic government established by Supreme Chancellor Palpatine to replace the Galactic Republic in 19 BBY and bring Sith rule to the galaxy.",
        type: 'namespace',
      },
      { id: '2', title: 'getStarship', description: 'Starship query.', type: 'method' },
    ];
    renderComponent({
      searchResults,
      searchQuery,
    });

    expect(screen.getAllByTestId('search-result-item')).toHaveLength(2);
    expect(screen.queryByText(`No search results found for "${searchQuery}".`)).not.toBeInTheDocument();
  });

  it('should emit selected search result', async () => {
    const searchQuery = 'test';
    const searchResults: SearchResult[] = [
      {
        id: '1',
        title: 'GalacticEmpire',
        description:
          "The Galactic Empire, declared as the First Galactic Empire, and also known as the New Order, the Old Empire, the First Empire, Palpatine's New Order, the Imperium or simply the Empire, was the galactic government established by Supreme Chancellor Palpatine to replace the Galactic Republic in 19 BBY and bring Sith rule to the galaxy.",
        type: 'namespace',
      },
      { id: '2', title: 'getStarship', description: 'Starship query.', type: 'method' },
    ];
    const { emitted, user } = renderComponent({
      searchResults,
      searchQuery,
    });

    await user.click(screen.getByText(searchResults[1].title));

    expect(emitted().searchResultSelected).toEqual([[searchResults[1]]]);
  });
});

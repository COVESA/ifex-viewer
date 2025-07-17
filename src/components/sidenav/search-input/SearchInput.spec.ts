/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { getTestOptions } from '../../../tests/base-test-options.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import Search from './SearchInput.vue';

const renderComponent = () => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Search, { ...options });

  return { user, emitted };
};

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should emit given text', async () => {
    const text = 'search text';
    const { emitted, user } = renderComponent();

    await user.type(screen.getByRole('searchbox'), text);

    vi.advanceTimersByTime(350);

    expect(emitted().queryUpdated).toEqual([[text]]);
  });

  it('should clear input when clicking on clear text button', async () => {
    const text = 'search';
    const { emitted, user } = renderComponent();

    await user.type(screen.getByRole('searchbox'), text);

    vi.advanceTimersByTime(350);

    await user.click(screen.getByRole('button', { name: 'Reset search' }));

    vi.advanceTimersByTime(350);

    expect(emitted().queryUpdated).toEqual([[text], ['']]);
  });

  it('should display the clear icon only after text is entered', async () => {
    const text = 'search';
    const { user } = renderComponent();

    expect(screen.queryByRole('button', { name: 'Reset search' })).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), text);

    vi.advanceTimersByTime(350);

    expect(screen.getByRole('button', { name: 'Reset search' })).toBeInTheDocument();
  });

  it('should focus search input on mac devices', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    const { user } = renderComponent();

    await user.keyboard('{Meta>}g{/Meta}');

    const searchInput = screen.getByRole('searchbox');
    expect(document.activeElement).toBe(searchInput);
    expect(screen.getByText('⌘ G')).toBeInTheDocument();
    expect(screen.queryByText('Ctrl+G')).not.toBeInTheDocument();
  });

  it('should focus search input on windows devices', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });
    const { user } = renderComponent();

    await user.keyboard('{Control>}g{/Control}');

    const searchInput = screen.getByRole('searchbox');
    expect(document.activeElement).toBe(searchInput);
    expect(screen.getByText('Ctrl+G')).toBeInTheDocument();
    expect(screen.queryByText('⌘ G')).not.toBeInTheDocument();
  });
});

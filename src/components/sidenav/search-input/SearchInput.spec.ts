/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { getTestOptions } from '../../../tests/base-test-options.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import Search from './SearchInput.vue';
import { IfexViewerSearchShortcut } from '../../../types.ts';

const renderComponent = (props: { searchShortcut?: IfexViewerSearchShortcut } = {}) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Search, { ...options, props });

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

  it('should focus search input with the configured macOS shortcut', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { mac: 'Meta+K' } });

    await user.keyboard('{Meta>}k{/Meta}');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('⌘ K')).toBeInTheDocument();
  });

  it('should focus search input with the configured Windows shortcut', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { windows: 'Control+L' } });

    await user.keyboard('{Control>}l{/Control}');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('Ctrl+L')).toBeInTheDocument();
  });

  it('should focus search input with the configured Linux shortcut', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux x86_64',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { linux: 'Alt+F' } });

    await user.keyboard('{Alt>}f{/Alt}');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('Alt+F')).toBeInTheDocument();
  });

  it('should focus search input with a configured single-key shortcut', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { windows: 'F' } });

    await user.keyboard('f');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('F')).toBeInTheDocument();
  });

  it('should focus search input with a configured three-part shortcut', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux x86_64',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { linux: 'Control+Alt+F' } });

    await user.keyboard('{Control>}{Alt>}f{/Alt}{/Control}');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('Ctrl+Alt+F')).toBeInTheDocument();
  });

  it('should focus search input when a macOS modifier changes the key value', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    renderComponent({ searchShortcut: { mac: 'Meta+Option+L' } });

    fireEvent.keyDown(window, { key: 'ł', code: 'KeyL', metaKey: true, altKey: true });

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('⌘ Alt L')).toBeInTheDocument();
  });

  it('should use the default shortcut when the configured shortcut is invalid', async () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux x86_64',
      configurable: true,
    });
    const { user } = renderComponent({ searchShortcut: { linux: 'Control+Shift' } });

    await user.keyboard('{Control>}g{/Control}');

    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(screen.getByText('Ctrl+G')).toBeInTheDocument();
  });
});

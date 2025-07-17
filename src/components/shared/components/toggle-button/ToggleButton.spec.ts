/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../../tests/base-test-options';
import ToggleButton from './ToggleButton.vue';
import { ToggleButtonProps } from './types';

const renderComponent = (props: ToggleButtonProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(ToggleButton, { ...options, props });

  return { user, emitted };
};

describe('ToggleButton', () => {
  it('should toggle button on click', async () => {
    const getToggleButton = () => screen.getByTestId('toggle-btn');

    const { user } = renderComponent({});

    const expandedState = screen.getByTestId('toggle-expanded-icon');
    const collapsedStateHidden = screen.queryByTestId('toggle-collapsed-icon');

    expect(expandedState).toBeInTheDocument();
    expect(collapsedStateHidden).not.toBeInTheDocument();

    await user.click(getToggleButton());

    const collapsedState = screen.getByTestId('toggle-collapsed-icon');
    const expandedStateHidden = screen.queryByTestId('toggle-expanded-icon');

    expect(collapsedState).toBeInTheDocument();
    expect(expandedStateHidden).not.toBeInTheDocument();
  });

  it('should render toggle button with label when given', async () => {
    const getToggleButton = () => screen.getByTestId('toggle-btn');

    const { user } = renderComponent({ withLabel: true });

    const expandedState = screen.getByText('Collapse');
    const collapsedStateHidden = screen.queryByText('Expand');

    expect(expandedState).toBeInTheDocument();
    expect(collapsedStateHidden).not.toBeInTheDocument();

    await user.click(getToggleButton());

    const collapsedState = screen.getByText('Expand');
    const expandedStateHidden = screen.queryByText('Collapse');

    expect(collapsedState).toBeInTheDocument();
    expect(expandedStateHidden).not.toBeInTheDocument();
  });

  it('should emit event with expanded state on click', async () => {
    const { user, emitted } = renderComponent({});

    await user.click(screen.getByTestId('toggle-btn'));

    expect(emitted('toggled')).toEqual([[false]]);
  });
});

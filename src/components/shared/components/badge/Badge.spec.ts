/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../../tests/base-test-options';
import Badge from './Badge.vue';
import { BadgeProps } from './types';

type Slots = Record<string, any>;

const renderComponent = (props: BadgeProps, slots?: Slots) => {
  const { options, user } = getTestOptions({});

  render(Badge, { ...options, props, slots });

  return { user };
};

describe('Badge', () => {
  it('should render correct text for ifex element badge types', () => {
    const props: BadgeProps = { type: 'namespace', size: 'm' };
    renderComponent({
      ...props,
    });

    expect(screen.getByText('Namespace')).toBeInTheDocument();
  });

  it('should render given slot for primary badge', () => {
    const text = 'Hello world';
    const props: BadgeProps = { type: 'primary', size: 'm' };
    renderComponent(
      {
        ...props,
      },
      { default: text },
    );

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});

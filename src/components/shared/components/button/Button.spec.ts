/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../../tests/base-test-options';
import Button from './Button.vue';
import { ButtonProps } from './types';

const renderComponent = (props: ButtonProps, slotContent: string) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Button, { ...options, props, slots: { default: slotContent } });

  return { user, emitted };
};

describe('Button', () => {
  it.each<ButtonProps>([{ variant: 'primary' }, { variant: 'secondary' }])('should render correct text for ifex element Button types', props => {
    const slotContent = 'This is a button';
    renderComponent(
      {
        ...props,
      },
      slotContent,
    );

    expect(screen.getByText(slotContent)).toBeInTheDocument();
  });

  it('should emit click event', async () => {
    const slotContent = 'This is a button';
    const { user, emitted } = renderComponent({}, slotContent);

    const button = screen.getByText(slotContent);
    await user.click(button);

    expect(emitted('clicked')).toBeTruthy();
  });
});

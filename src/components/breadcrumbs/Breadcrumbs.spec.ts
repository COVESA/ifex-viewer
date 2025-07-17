/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './Breadcrumbs.vue';
import { Breadcrumb, BreadcrumbsProps } from './types';
import { getTestOptions } from '../../tests/base-test-options.ts';

const renderComponent = (props: BreadcrumbsProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Breadcrumbs, { ...options, props });

  return { user, emitted };
};

describe('Breadcumbs', () => {
  it('should prevent the last breadcrumb item from being clickable', async () => {
    const breadcrumbs: Breadcrumb[] = [
      {
        nodeId: '1',
        text: 'First breadcrumb',
      },
      {
        nodeId: '2',
        text: 'Second breadcrumb',
      },
    ];
    const { user, emitted } = renderComponent({
      breadcrumbs,
    });

    const breadcrumbEl = screen.getByTestId(`breadcrumb-${breadcrumbs[1].nodeId}`);

    await user.click(breadcrumbEl);

    expect(emitted('breadcrumbSelected')).toBeFalsy();
  });

  it('should render clickable breadcrumbs when it is not the last item', async () => {
    const breadcrumbs: Breadcrumb[] = [
      {
        nodeId: '1',
        text: 'First breadcrumb',
      },
      {
        nodeId: '2',
        text: 'Second breadcrumb',
      },
    ];
    const { user, emitted } = renderComponent({
      breadcrumbs,
    });

    const breadcrumbEl = screen.getByTestId(`breadcrumb-${breadcrumbs[0].nodeId}`);

    await user.click(breadcrumbEl);

    expect(emitted('breadcrumbSelected')).toEqual([[breadcrumbs[0].nodeId]]);
  });
});

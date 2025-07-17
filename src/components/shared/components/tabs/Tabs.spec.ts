/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../../tests/base-test-options';
import Tabs from './Tabs.vue';
import { describe, it, expect } from 'vitest';
import { TabsProps } from './types.ts';

const renderComponent = (props: TabsProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Tabs, { ...options, props });

  return { user, emitted };
};

describe('Tabs', () => {
  it('should switch between tabs', async () => {
    const activeTab = 'Tab 1';
    const inactiveTab = 'Tab 2';
    const { user, emitted } = renderComponent({ tabs: [activeTab, inactiveTab] });

    await user.click(screen.getByText(inactiveTab));

    expect(emitted('tabChanged')).toEqual([[inactiveTab]]);
  });
});

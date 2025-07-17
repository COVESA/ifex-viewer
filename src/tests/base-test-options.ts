/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import type { Component, Directive } from 'vue';
import { CopiedSuccessfulEventKey } from '../types.ts';
import { vi } from 'vitest';

// Copy of stub types from vue test utils because they're not exported there
type Stub = boolean | Component | Directive;
type Stubs = Record<string, Stub> | Array<string>;

export interface TestOptions {
  /**
   * Specific mocks for your tests.
   */
  mocks?: any;
  stubs?: Stubs;
  /**
   * If `true` is passed, a pinia instance will be created with `stubActions: false`. Use the object type, if you want to modify the default `stubActions`
   */
  usePinia?: { stubActions?: boolean } | boolean;
}

/**
 * Use this for setting up required test options in a reusable way.
 */
export const getTestOptions = (testOptions: TestOptions) => {
  const { mocks, stubs, usePinia } = testOptions;

  const plugins = [];

  if (testOptions.usePinia) {
    const stubActionsValue = typeof usePinia === 'boolean' ? false : (usePinia?.stubActions ?? false);

    plugins.push(createTestingPinia({ stubActions: stubActionsValue }));
  }

  const user = userEvent.setup();

  return {
    options: {
      global: {
        mocks,
        stubs,
        plugins,
        provide: {
          [CopiedSuccessfulEventKey]: vi.fn(),
        },
      },
    },
    user,
  };
};

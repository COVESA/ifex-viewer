/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../../tests/base-test-options';
import { methodMock } from '../../../../tests/mocks/methods';
import Headline from './Headline.vue';
import { HeadlineProps } from './types';

const renderComponent = (props: HeadlineProps, slots?: Record<string, string>) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Headline, { ...options, props, slots });

  return { user, emitted };
};

describe('Headline', () => {
  it('should render headline with dot notation and page type badge', () => {
    const headline = methodMock.name;
    const dotNotation = `GalacticEmpire.${methodMock.name}`;
    renderComponent({ headline, pageType: 'method', dotNotation, nodeRawData: methodMock });

    const headlineEl = screen.getByText(headline);
    const dotNotationEl = screen.getByText(dotNotation);
    const methodBadge = screen.getByText('Method');

    expect(headlineEl).toBeInTheDocument();
    expect(dotNotationEl).toBeInTheDocument();
    expect(methodBadge).toBeInTheDocument();
  });

  it('should render additional badges', () => {
    const badgeContentNr = 'Int';
    const badgeContentRange = '0...100';
    const slots = {
      badges: `<div>${badgeContentNr}</div><div>${badgeContentRange}</div>`,
    };
    const headline = methodMock.name;
    const dotNotation = `GalacticEmpire.${methodMock.name}`;
    renderComponent({ headline, pageType: 'method', dotNotation, nodeRawData: methodMock }, slots);

    const headlineEl = screen.getByText(headline);

    expect(headlineEl).toBeInTheDocument();
  });
});

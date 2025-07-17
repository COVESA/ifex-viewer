/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen, within } from '@testing-library/vue';
import { getTestOptions } from '../../../tests/base-test-options';
import EnumerationDetailPage from './EnumerationDetailPage.vue';
import { EnumerationDetailPageProps } from './types';
import { describe, expect, it } from 'vitest';
import { enumerationMock, enumerationWithCustomPropertiesMock } from '../../../tests/mocks/enumeration';

const renderComponent = (props: EnumerationDetailPageProps) => {
  const { options, user } = getTestOptions({ usePinia: true });

  render(EnumerationDetailPage, { ...options, props });

  return { user };
};

describe('EnumerationDetailPage', () => {
  it('should render enumeration detail page', () => {
    const dotNotationFullPath = `namespace.enumerations.${enumerationMock.name}`;
    renderComponent({ enumeration: enumerationMock, dotNotationFullPath, validationErrors: [] });

    const enumerationTitle = screen.getByText(enumerationMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const datatype = screen.getByText(enumerationMock.datatype);

    const privateOption = screen.getByText(enumerationMock.options![0].name);
    const sergeantOption = screen.getByText(enumerationMock.options![1].name);
    const generalOption = screen.getByText(enumerationMock.options![2].name);

    const validationErrors = screen.queryByTestId('error-notification');

    expect(enumerationTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(datatype).toBeInTheDocument();
    expect(privateOption).toBeInTheDocument();
    expect(sergeantOption).toBeInTheDocument();
    expect(generalOption).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should render custom properties if enumeration has custom properties', () => {
    const dotNotationFullPath = `namespace.enumerations.${enumerationMock.name}`;
    renderComponent({ enumeration: enumerationWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });

  it('should not show custom properties of an enum option if there are none', () => {
    const dotNotationFullPath = `namespace.enumerations.${enumerationMock.name}`;
    renderComponent({ enumeration: enumerationMock, dotNotationFullPath });

    expect(within(screen.getByTestId('property-viewer-container')).queryByTestId('source-code-editor')).not.toBeInTheDocument();
  });

  it('should show custom properties of an enum option', () => {
    const dotNotationFullPath = `namespace.enumerations.${enumerationMock.name}`;
    renderComponent({ enumeration: enumerationWithCustomPropertiesMock, dotNotationFullPath });

    expect(within(screen.getByTestId('property-viewer-container')).getByText('directAccessToDeathStar', { exact: false })).toBeInTheDocument();
  });
});

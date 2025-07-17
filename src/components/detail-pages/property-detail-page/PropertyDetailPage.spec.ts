/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen, within } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../tests/base-test-options';
import { propertyMock, propertyWithCustomPropertiesMock } from '../../../tests/mocks/properties';
import { Property } from '../../../types/ifex-core';
import PropertyDetailPage from './PropertyDetailPage.vue';
import { PropertyDetailPageProps } from './types';

const renderComponent = (props: PropertyDetailPageProps) => {
  const { options } = getTestOptions({ usePinia: true });

  render(PropertyDetailPage, { ...options, props });
};

describe('PropertyDetailPage', () => {
  it('should render property detail page without metadata', () => {
    const dotNotationFullPath = `namespace.properties.${propertyMock.name}`;
    renderComponent({ propertyData: { ...propertyMock, arraysize: undefined }, dotNotationFullPath, validationErrors: [] });

    const propertyTitle = screen.getByText(propertyMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const datatype = screen.getByText(propertyMock.datatype);

    const validationErrors = screen.queryByTestId('error-notification');
    const arraysizeMetadata = screen.queryByTestId('badge-arraysize-metadata');

    expect(propertyTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(datatype).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
    expect(arraysizeMetadata).not.toBeInTheDocument();
  });

  it('should render arraysize metadata', () => {
    const propertyData: Property = { ...propertyMock, arraysize: 10 };
    const dotNotationFullPath = `namespace.properties.${propertyMock.name}`;
    renderComponent({ propertyData, dotNotationFullPath, validationErrors: [] });

    const arrasizeMetadata = within(screen.getByTestId('badge-arraysize-metadata')).getByText(`Arraysize::[${propertyData.arraysize}]`);

    expect(arrasizeMetadata).toBeInTheDocument();
  });

  it('should render arraysize metadata when it is 0', () => {
    const propertyData: Property = { ...propertyMock, arraysize: 0 };
    const dotNotationFullPath = `namespace.properties.${propertyMock.name}`;
    renderComponent({ propertyData, dotNotationFullPath, validationErrors: [] });

    const arrasizeMetadata = within(screen.getByTestId('badge-arraysize-metadata')).getByText(`Arraysize::[${propertyData.arraysize}]`);

    expect(arrasizeMetadata).toBeInTheDocument();
  });

  it('should render custom properties if property has custom properties', () => {
    const dotNotationFullPath = `namespace.properties.${propertyMock.name}`;
    renderComponent({ propertyData: propertyWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });
});

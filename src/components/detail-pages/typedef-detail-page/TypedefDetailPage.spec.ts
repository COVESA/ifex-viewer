/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen, within } from '@testing-library/vue';
import { getTestOptions } from '../../../tests/base-test-options';
import TypedefDetailPage from './TypedefDetailPage.vue';
import { TypedefDetailPageProps } from './types';
import { describe, expect, it } from 'vitest';
import { typedefMock, typedefWithCustomPropertiesMock } from '../../../tests/mocks/typedef';
import { Typedef } from '../../../types/ifex-core';

const renderComponent = (props: TypedefDetailPageProps) => {
  const { options } = getTestOptions({ usePinia: true });

  render(TypedefDetailPage, { ...options, props });
};

describe('TypedefDetailPage', () => {
  it('should render typedef detail page without metadata', () => {
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef: typedefMock, dotNotationFullPath, validationErrors: [] });

    const typedefTitle = screen.getByText(typedefMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const datatype = screen.getByText(typedefMock.datatype!);

    const validationErrors = screen.queryByTestId('error-notification');
    const arraysizeMetadata = screen.queryByTestId('badge-arraysize-metadata');
    const minMetadata = screen.queryByTestId('badge-min-metadata');
    const maxMetadata = screen.queryByTestId('badge-max-metadata');

    expect(typedefTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(datatype).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
    expect(arraysizeMetadata).not.toBeInTheDocument();
    expect(minMetadata).not.toBeInTheDocument();
    expect(maxMetadata).not.toBeInTheDocument();
  });

  it('should render arraysize metadata', () => {
    const typedef: Typedef = { ...typedefMock, arraysize: 10 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const arrasizeMetadata = within(screen.getByTestId('badge-arraysize-metadata')).getByText(`Arraysize::[${typedef.arraysize}]`);

    expect(arrasizeMetadata).toBeInTheDocument();
  });

  it('should render arraysize metadata when it is 0', () => {
    const typedef: Typedef = { ...typedefMock, arraysize: 0 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const arrasizeMetadata = within(screen.getByTestId('badge-arraysize-metadata')).getByText(`Arraysize::[${typedef.arraysize}]`);

    expect(arrasizeMetadata).toBeInTheDocument();
  });

  it('should render min metadata', () => {
    const typedef: Typedef = { ...typedefMock, min: 10 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const minMetadata = within(screen.getByTestId('badge-min-metadata')).getByText(`Min::[${typedef.min}]`);

    expect(minMetadata).toBeInTheDocument();
  });

  it('should render min metadata when it is 0', () => {
    const typedef: Typedef = { ...typedefMock, min: 0 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const minMetadata = within(screen.getByTestId('badge-min-metadata')).getByText(`Min::[${typedef.min}]`);

    expect(minMetadata).toBeInTheDocument();
  });

  it('should render max metadata', () => {
    const typedef: Typedef = { ...typedefMock, max: 10 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const maxMetadata = within(screen.getByTestId('badge-max-metadata')).getByText(`Max::[${typedef.max}]`);

    expect(maxMetadata).toBeInTheDocument();
  });

  it('should render max metadata when it is 0', () => {
    const typedef: Typedef = { ...typedefMock, max: 0 };
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef, dotNotationFullPath, validationErrors: [] });

    const maxMetadata = within(screen.getByTestId('badge-max-metadata')).getByText(`Max::[${typedef.max}]`);

    expect(maxMetadata).toBeInTheDocument();
  });

  it('should render custom properties if typedef has custom properties', () => {
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef: typedefWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });

  it('should render variant type correctly', () => {
    const dotNotationFullPath = `namespace.typedefs.${typedefMock.name}`;
    renderComponent({ typedef: { ...typedefWithCustomPropertiesMock, datatype: undefined, datatypes: ['string', 'boolean'] }, dotNotationFullPath });

    const variantTypeTag = within(screen.getByTestId('headline')).getByText('Variant type');
    const dataTypes = screen.getByTestId('datatypes');
    const stringType = within(dataTypes).getByText('string');
    const booleanType = within(dataTypes).getByText('boolean');

    expect(variantTypeTag).toBeInTheDocument();
    expect(stringType).toBeInTheDocument();
    expect(booleanType).toBeInTheDocument();
  });
});

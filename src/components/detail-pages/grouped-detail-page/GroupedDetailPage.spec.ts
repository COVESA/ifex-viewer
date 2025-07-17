/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../tests/base-test-options';
import { namespaceMock, namespaceWithCustomPropertiesMock } from '../../../tests/mocks/namespace';
import GroupedDetailPage from './GroupedDetailPage.vue';
import { GroupedDetailPageProps } from './types';
import { interfaceMock, interfaceWithCustomPropertiesMock } from '../../../tests/mocks/interface';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const renderComponent = (props: GroupedDetailPageProps) => {
  const { options, user } = getTestOptions({});

  render(GroupedDetailPage, { ...options, props });

  return { user };
};

describe('GroupedDetailPage', () => {
  it('should render namespace detail page', () => {
    const dotNotationFullPath = `namespaces.${namespaceMock.name}`;
    renderComponent({ data: namespaceMock, dotNotationFullPath, type: 'namespace', validationErrors: [] });

    const namespaceTitle = screen.getByText(namespaceMock.name!);
    const namespaceVersion = screen.getByText(`v${namespaceMock.major_version!}.${namespaceMock.minor_version!}`);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const validationErrors = screen.queryByTestId('error-notification');

    expect(namespaceTitle).toBeInTheDocument();
    expect(namespaceVersion).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should render interface detail page', () => {
    const dotNotationFullPath = `namespaces.interface.${interfaceMock.name}`;
    renderComponent({ data: interfaceMock, dotNotationFullPath, type: 'interface', validationErrors: [] });

    const interfaceTitle = screen.getByText(interfaceMock.name!);
    const interfaceVersion = screen.getByText(`v${interfaceMock.major_version!}.${interfaceMock.minor_version!}`);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const validationErrors = screen.queryByTestId('error-notification');

    expect(interfaceTitle).toBeInTheDocument();
    expect(interfaceVersion).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should show errors when given', () => {
    const dotNotationFullPath = `namespaces.interface.${interfaceMock.name}`;
    renderComponent({ data: interfaceMock, dotNotationFullPath, type: 'interface', validationErrors: [validationErrorMock] });

    const validationErrors = screen.getByTestId('error-notification');

    expect(validationErrors).toBeInTheDocument();
  });

  it('should not render version of given element when there is none', () => {
    const dotNotationFullPath = `namespaces.interface.${interfaceMock.name}`;
    renderComponent({
      data: { ...interfaceMock, major_version: undefined, minor_version: undefined },
      validationErrors: [validationErrorMock],
      type: 'interface',
      dotNotationFullPath,
    });

    const versionBadge = screen.queryByTestId('grouped-version-badge');

    expect(versionBadge).not.toBeInTheDocument();
  });

  it('should render custom properties if namespace has custom properties', () => {
    const dotNotationFullPath = `namespaces.interface.${interfaceMock.name}`;
    renderComponent({ data: namespaceWithCustomPropertiesMock, type: 'namespace', dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });

  it('should render custom properties if interface has custom properties', () => {
    const dotNotationFullPath = `namespaces.interface.${interfaceMock.name}`;
    renderComponent({ data: interfaceWithCustomPropertiesMock, type: 'interface', dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });
});

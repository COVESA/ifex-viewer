/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen, within } from '@testing-library/vue';
import { getTestOptions } from '../../../tests/base-test-options';
import { MethodDetailPageProps } from './types';
import MethodDetailPage from './MethodDetailPage.vue';
import { methodMock, methodWithCustomPropertiesMock } from '../../../tests/mocks/methods';
import { describe, expect, it } from 'vitest';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const renderComponent = (props: MethodDetailPageProps) => {
  const { options, user } = getTestOptions({ usePinia: true });

  render(MethodDetailPage, { ...options, props });

  return { user };
};

describe('MethodDetailPage', () => {
  it('should render method detail page metadata', () => {
    const dotNotationFullPath = `namespace.methods.${methodMock.name}`;
    renderComponent({ method: methodMock, dotNotationFullPath, validationErrors: [] });

    const methodTitle = screen.getByText(methodMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const validationErrors = screen.queryByTestId('error-notification');
    const propertyViewers = screen.getAllByTestId('property-viewer');

    expect(methodTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(propertyViewers).toHaveLength(4);
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should show errors when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: methodMock, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const validationErrors = screen.getByTestId('error-notification');

    expect(validationErrors).toBeInTheDocument();
  });

  it('should render input arguments when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: { ...methodMock, errors: undefined, output: undefined, returns: undefined }, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const propertyViewer = screen.getByTestId('property-viewer');
    const nameInput = within(propertyViewer).getByText(methodMock.input![0].name);
    const planetOfOriginInput = within(propertyViewer).getByText(methodMock.input![1].name);

    expect(nameInput).toBeInTheDocument();
    expect(planetOfOriginInput).toBeInTheDocument();
  });

  it('should render output arguments when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: { ...methodMock, errors: undefined, input: undefined, returns: undefined }, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const propertyViewer = screen.getByTestId('property-viewer');
    const stormtrooperIdOutput = within(propertyViewer).getByText(methodMock.output![0].name);

    expect(stormtrooperIdOutput).toBeInTheDocument();
  });

  it('should render output arguments when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: { ...methodMock, errors: undefined, input: undefined, returns: undefined }, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const propertyViewer = screen.getByTestId('property-viewer');
    const stormtrooperIdOutput = within(propertyViewer).getByText(methodMock.output![0].name);

    expect(stormtrooperIdOutput).toBeInTheDocument();
  });

  it('should render returns arguments when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: { ...methodMock, errors: undefined, input: undefined, output: undefined }, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const propertyViewer = screen.getByTestId('property-viewer');
    const stormtroopersReturns = within(propertyViewer).getByText(methodMock.returns![0].name);

    expect(stormtroopersReturns).toBeInTheDocument();
  });

  it('should render error arguments when given', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: { ...methodMock, returns: undefined, input: undefined, output: undefined }, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const propertyViewer = screen.getByTestId('property-viewer');
    const stormtroopersReturns = within(propertyViewer).getByText(methodMock.errors![0].name!);

    expect(stormtroopersReturns).toBeInTheDocument();
  });

  it('should render custom properties if method has custom properties', () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    renderComponent({ method: methodWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });

  it('should toggle view and show node content as yaml', async () => {
    const dotNotationFullPath = `namespaces.methods.${methodMock.name}`;
    const { user } = renderComponent({ method: methodMock, dotNotationFullPath });

    expect(screen.getByText(methodMock.description!)).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Returns')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.queryByTestId('node-yaml-view')).not.toBeInTheDocument();

    const expandDropdownButton = screen.getByTestId('btn-expand-view-options');
    await user.click(expandDropdownButton);

    const yamlViewButton = screen.getByText('View as YAML');
    await user.click(yamlViewButton);

    expect(screen.queryByText(methodMock.description!)).not.toBeInTheDocument();
    expect(screen.queryByText('Input')).not.toBeInTheDocument();
    expect(screen.queryByText('Output')).not.toBeInTheDocument();
    expect(screen.queryByText('Returns')).not.toBeInTheDocument();
    expect(screen.queryByText('Errors')).not.toBeInTheDocument();
    expect(screen.getByTestId('node-yaml-view')).toBeInTheDocument();
  });
});

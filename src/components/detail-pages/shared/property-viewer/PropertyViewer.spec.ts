/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../../tests/base-test-options';
import { methodMock } from '../../../../tests/mocks/methods';
import PropertyViewer from './PropertyViewer.vue';
import { PropertyViewerProps } from './types';
import { describe, expect, it } from 'vitest';
import { ArgumentWithCustomProperties } from '../../../../types/ifex-core.ts';

const renderComponent = (props: PropertyViewerProps) => {
  const { options, user } = getTestOptions({});

  render(PropertyViewer, { ...options, props });

  return { user };
};

describe('PropertyViewer', () => {
  it('should render property viewer details', () => {
    const headline = 'Inputs';
    renderComponent({ headline, properties: methodMock.input! as ArgumentWithCustomProperties[], parentDotNotationFullPath: 'root.namespace.method' });

    const headlineEl = screen.getByText(headline);

    const nameInput = screen.getByText(methodMock.input![0].name);
    const nameDescription = screen.getByText(methodMock.input![0].description!);

    const planetOfOriginInput = screen.getByText(methodMock.input![1].name);
    const planetOfOriginDescription = screen.getByText(methodMock.input![1].description!);

    const dataTypes = screen.getAllByText('string');

    expect(headlineEl).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(nameDescription).toBeInTheDocument();
    expect(planetOfOriginInput).toBeInTheDocument();
    expect(planetOfOriginDescription).toBeInTheDocument();
    expect(dataTypes).toHaveLength(2);
  });

  it('should show additional metadata of argument', () => {
    const headline = 'Inputs';
    const range = '0..100';
    const arraysize = 10;

    renderComponent({ headline, properties: [{ ...methodMock.input![0], range, arraysize }], parentDotNotationFullPath: 'root.namespace.method' });

    const rangeMetadata = screen.getByText(`Range::[${range}]`);
    const arraysizeMetadata = screen.getByText(`Arraysize::[${arraysize.toString()}]`);

    expect(rangeMetadata).toBeInTheDocument();
    expect(arraysizeMetadata).toBeInTheDocument();
  });

  it('should collapse and expand property viewer content', async () => {
    const headline = 'Inputs';

    const { user } = renderComponent({ headline, properties: methodMock.input! as ArgumentWithCustomProperties[], parentDotNotationFullPath: 'root.namespace.method' });

    expect(screen.getByTestId('property-viewer-container')).toBeInTheDocument();

    await user.click(screen.getByText('Collapse'));

    expect(screen.queryByTestId('property-viewer-container')).not.toBeInTheDocument();

    await user.click(screen.getByText('Expand'));

    expect(screen.getByTestId('property-viewer-container')).toBeInTheDocument();
  });

  it('should not show custom properties of an argument if there are none', () => {
    const headline = 'Inputs';

    renderComponent({ headline, properties: [...methodMock.input!] as ArgumentWithCustomProperties[], parentDotNotationFullPath: 'root.namespace.method' });

    expect(screen.queryByTestId('source-code-editor')).not.toBeInTheDocument();
  });

  it('should show custom properties of an argument', () => {
    const headline = 'Inputs';
    const customProps = {
      required: 'boolean',
      readonly: 'boolean',
    };

    const arg = { ...methodMock.input![0], ...customProps };

    renderComponent({ headline, properties: [arg] });

    const [required, readonly] = Object.keys(customProps);

    expect(screen.getByText(required, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(readonly, { exact: false })).toBeInTheDocument();
  });
});

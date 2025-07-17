/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../tests/base-test-options';
import { ApiDetailPageProps } from './types';
import ApiDetailPage from './ApiDetailPage.vue';
import { apiMock, apiWithCustomPropertiesMock } from '../../../tests/mocks/api';
import { describe, it, expect } from 'vitest';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const renderComponent = (props: ApiDetailPageProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(ApiDetailPage, { ...options, props });

  return { user, emitted };
};

describe('ApiDetailPage', () => {
  it('should render api details without includes and validation errors', () => {
    renderComponent({ api: { ...apiMock, includes: [] }, validationErrors: [] });

    const apiTitle = screen.getByText(apiMock.name!);
    const apiVersion = screen.getByText(`v${apiMock.major_version!}.${apiMock.minor_version!}`);
    const includesList = screen.queryByTestId('api-includes-list');
    const validationErrors = screen.queryByTestId('error-notification');

    expect(apiTitle).toBeInTheDocument();
    expect(apiVersion).toBeInTheDocument();
    expect(includesList).not.toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should render api details with includes', () => {
    renderComponent({ api: apiMock, validationErrors: [] });

    const includeStatement = screen.getByText(apiMock.includes![0].file);

    expect(includeStatement).toBeInTheDocument();
  });

  it('should render api details with validation errors', () => {
    renderComponent({ api: apiMock, validationErrors: [validationErrorMock] });

    const errorNotification = screen.getByTestId('error-notification');

    expect(errorNotification).toBeInTheDocument();
  });

  it('should not render api version when there is none', () => {
    renderComponent({ api: { ...apiMock, major_version: undefined, minor_version: undefined }, validationErrors: [validationErrorMock] });

    const versionBadge = screen.queryByTestId('api-version-badge');

    expect(versionBadge).not.toBeInTheDocument();
  });

  it('should render custom properties if api has custom properties', () => {
    renderComponent({ api: apiWithCustomPropertiesMock });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });
});

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import DetailPageContainer from './DetailPageContainer.vue';
import { DetailPageContainerProps } from './types';
import { getTestOptions } from '../../../../tests/base-test-options';
import { render, screen } from '@testing-library/vue';
import { apiMock } from '../../../../tests/mocks/api';
import { describe, expect, it } from 'vitest';
import { validationErrorMock } from '../../../../tests/mocks/validation-error';
import { codeMock } from '../../../../tests/mocks/code.ts';

const renderComponent = (props: DetailPageContainerProps, slots: Record<string, string>) => {
  const { options, user } = getTestOptions({});

  render(DetailPageContainer, { ...options, props, slots });

  return { user };
};

describe('DetailPageContainer', () => {
  it('should render page container with headline, description and main content', () => {
    const headline = apiMock.name!;
    const description = apiMock.description!;
    const mainContent = 'Main content';
    renderComponent(
      { description },
      {
        headline,
        default: `<div data-testid="main-content">${mainContent}</div>`,
      },
    );

    const apiTitle = screen.getByText(headline);
    const descriptionEl = screen.getByText(description);
    const mainContentText = screen.getByText(mainContent);

    expect(apiTitle).toBeInTheDocument();
    expect(descriptionEl).toBeInTheDocument();
    expect(mainContentText).toBeInTheDocument();
  });

  it('should render given error notifications', () => {
    const headline = apiMock.name!;
    const description = apiMock.description!;
    const mainContent = 'Main content';
    renderComponent(
      { description, validationErrors: [validationErrorMock, validationErrorMock] },
      {
        headline,
        default: `<div data-testid="main-content">${mainContent}</div>`,
      },
    );

    const errorNotifications = screen.getAllByTestId('error-notification');

    expect(errorNotifications).toHaveLength(2);
  });

  it('should not render description if not given', () => {
    const headline = apiMock.name!;
    const mainContent = 'Main content';
    renderComponent(
      { description: '', validationErrors: [validationErrorMock, validationErrorMock] },
      {
        headline,
        default: `<div data-testid="main-content">${mainContent}</div>`,
      },
    );

    const description = screen.queryByTestId('detail-page-description');

    expect(description).not.toBeInTheDocument();
  });

  it('should render unknown props section if unknown props are given', () => {
    const headline = apiMock.name!;
    const mainContent = 'Main content';
    renderComponent(
      { description: 'Some description', customProperties: codeMock },
      {
        headline,
        default: `<div data-testid="main-content">${mainContent}</div>`,
      },
    );

    const sectionTitle = screen.getByText('Custom properties');

    const [method] = Object.keys(codeMock);
    const [visibility, visibilityInternal, visibilityExternal] = Object.keys(codeMock.custom_properties!);

    expect(sectionTitle).toBeInTheDocument();
    // exact:false because we need to find the text inside the whole code block
    expect(screen.getByText(method, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(visibility, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(visibilityInternal, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(visibilityExternal, { exact: false })).toBeInTheDocument();
  });

  it('should not render unknown props section when no unknown props are given', () => {
    const headline = apiMock.name!;
    const mainContent = 'Main content';
    renderComponent(
      { description: 'Some description', customProperties: {} },
      {
        headline,
        default: `<div data-testid="main-content">${mainContent}</div>`,
      },
    );

    const sectionTitle = screen.queryByText('Custom properties');
    const codeViewer = screen.queryByTestId('source-code-editor');

    expect(sectionTitle).not.toBeInTheDocument();
    expect(codeViewer).not.toBeInTheDocument();
  });
});

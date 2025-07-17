/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../../tests/base-test-options';
import { validationErrorMock } from '../../../../tests/mocks/validation-error';
import ErrorNotification from './ErrorNotification.vue';
import { ErrorNotificationProps } from './types';
import { it, expect, describe } from 'vitest';

const renderComponent = (props: ErrorNotificationProps) => {
  const { options, user } = getTestOptions({});

  render(ErrorNotification, { ...options, props });

  return { user };
};

describe('ErrorNotification', () => {
  it('should render error notification with collapsed details', () => {
    renderComponent({ validationError: validationErrorMock });

    const errorTitle = screen.getByText(`Error in ${validationErrorMock.instancePath}`);
    const errorMessage = screen.getByText(validationErrorMock.message!);
    const errorDetails = screen.queryByTestId('error-notification-details');

    expect(errorTitle).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(errorDetails).not.toBeInTheDocument();
  });

  it('should render error notification and expand details', async () => {
    const { user } = renderComponent({ validationError: validationErrorMock });

    const errorTitle = screen.getByText(`Error in ${validationErrorMock.instancePath}`);
    const errorMessage = screen.getByText(validationErrorMock.message!);
    const hiddenErrorDetails = screen.queryByTestId('error-notification-details');

    expect(errorTitle).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(hiddenErrorDetails).not.toBeInTheDocument();

    await user.click(screen.getByTestId('toggle-btn'));

    const errorDetails = screen.getByTestId('error-notification-details');
    expect(errorDetails).toBeInTheDocument();
  });
});

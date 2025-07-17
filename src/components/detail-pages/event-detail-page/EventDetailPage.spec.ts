/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { eventMock, eventWithCustomPropertiesMock } from '../../../tests/mocks/events';
import EventDetailPage from './EventDetailPage.vue';
import { getTestOptions } from '../../../tests/base-test-options';
import { describe, expect, it } from 'vitest';
import { EventDetailPageProps } from './types';
import { validationErrorMock } from '../../../tests/mocks/validation-error';

const renderComponent = (props: EventDetailPageProps) => {
  const { options, user } = getTestOptions({ usePinia: true });

  render(EventDetailPage, { ...options, props });

  return { user };
};

describe('EventDetailPage', () => {
  it('should render method detail page', () => {
    const dotNotationFullPath = `namespaces.${eventMock.name}`;
    renderComponent({ event: eventMock, dotNotationFullPath, validationErrors: [] });

    const eventTitle = screen.getByText(eventMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);
    const deathStarIdInput = screen.getByText(eventMock.input![0].name);
    const destroyedByInput = screen.getByText(eventMock.input![1].name);
    const validationErrors = screen.queryByTestId('error-notification');

    expect(eventTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(deathStarIdInput).toBeInTheDocument();
    expect(destroyedByInput).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should show errors when given', () => {
    const dotNotationFullPath = `namespaces.events.${eventMock.name}`;
    renderComponent({ event: eventMock, dotNotationFullPath, validationErrors: [validationErrorMock] });

    const validationErrors = screen.getByTestId('error-notification');

    expect(validationErrors).toBeInTheDocument();
  });

  it('should render custom properties if event has custom properties', () => {
    const dotNotationFullPath = `namespaces.events.${eventMock.name}`;
    renderComponent({ event: eventWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });
});

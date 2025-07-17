/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { getTestOptions } from '../../../tests/base-test-options';
import StructDetailPage from './StructDetailPage.vue';
import { StructDetailPageProps } from './types';
import { structMock, structWithCustomPropertiesMock } from '../../../tests/mocks/structs';
import { describe, expect, it } from 'vitest';

const renderComponent = (props: StructDetailPageProps) => {
  const { options } = getTestOptions({ usePinia: true });

  render(StructDetailPage, { ...options, props });
};

describe('StructDetailPage', () => {
  it('should render struct detail page', () => {
    const dotNotationFullPath = `namespace.structs.${structMock.name}`;
    renderComponent({ struct: structMock, dotNotationFullPath, validationErrors: [] });

    const structTitle = screen.getByText(structMock.name!);
    const dotNotation = screen.getByText(dotNotationFullPath);

    const modelMember = screen.getByText(structMock.members![0].name);
    const weaponCapacityMember = screen.getByText(structMock.members![1].name);
    const hyperdriveRatingMember = screen.getByText(structMock.members![2].name);

    const validationErrors = screen.queryByTestId('error-notification');

    expect(structTitle).toBeInTheDocument();
    expect(dotNotation).toBeInTheDocument();
    expect(modelMember).toBeInTheDocument();
    expect(weaponCapacityMember).toBeInTheDocument();
    expect(hyperdriveRatingMember).toBeInTheDocument();
    expect(validationErrors).not.toBeInTheDocument();
  });

  it('should render custom properties if struct has custom properties', () => {
    const dotNotationFullPath = `namespace.structs.${structMock.name}`;
    renderComponent({ struct: structWithCustomPropertiesMock, dotNotationFullPath });

    const customPropertiesSection = screen.getByText('Custom properties');

    expect(customPropertiesSection).toBeInTheDocument();
  });
});

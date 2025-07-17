/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { getTestOptions } from '../../../../tests/base-test-options';
import DataTypeBadge from './DataTypeBadge.vue';
import { DataTypeBadgeProps, PrimitiveDataType, primitiveDataTypes } from './types';

type Slots = Record<string, any>;

const renderComponent = (props: DataTypeBadgeProps, slots?: Slots) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(DataTypeBadge, { ...options, props, slots });

  return { user, emitted };
};

describe('DataTypeBadge', () => {
  it.each<PrimitiveDataType>([...primitiveDataTypes])('should render primitive datatype badge for %s', datatype => {
    const props: DataTypeBadgeProps = { datatype, size: 'm' };
    renderComponent({
      ...props,
    });

    expect(screen.getByText(datatype)).toBeInTheDocument();
    expect(screen.getByTestId('badge-primitiveType')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-complexType')).not.toBeInTheDocument();
  });

  it('should render correct badge for complex datatype', () => {
    const props: DataTypeBadgeProps = { datatype: 'MyStruct', size: 'm' };
    renderComponent({
      ...props,
    });

    expect(screen.getByText(props.datatype)).toBeInTheDocument();
    expect(screen.getByTestId('badge-complexType')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-primitiveType')).not.toBeInTheDocument();
  });

  it('should render primitive datatype badge for variant types', () => {
    const props: DataTypeBadgeProps = { datatype: 'variant<string,MyStruct>', size: 'm' };
    renderComponent({
      ...props,
    });

    expect(screen.getByText(props.datatype)).toBeInTheDocument();
    expect(screen.getByTestId('badge-primitiveType')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-complexType')).not.toBeInTheDocument();
  });

  it('should show linkout icon for complex datatype', () => {
    const props: DataTypeBadgeProps = { datatype: 'MyStruct', size: 'm' };
    renderComponent({
      ...props,
    });

    expect(screen.getByText(props.datatype)).toBeInTheDocument();
    expect(screen.getByTestId('complex-datatype-linkout')).toBeInTheDocument();
  });

  it('should not emit event when clicking on primitive datatype', async () => {
    const props: DataTypeBadgeProps = { datatype: 'string', size: 'm' };
    const { user, emitted } = renderComponent({
      ...props,
    });

    await user.click(screen.getByText(props.datatype));

    expect(emitted('selected')).toBeFalsy();
  });

  it('should emit event when clicking on complex datatype', async () => {
    const props: DataTypeBadgeProps = { datatype: 'MyStruct', size: 'm' };
    const { user, emitted } = renderComponent({
      ...props,
    });

    await user.click(screen.getByText(props.datatype));

    expect(emitted('selected')).toBeTruthy();
  });
});

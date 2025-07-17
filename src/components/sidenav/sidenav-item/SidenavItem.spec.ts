/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, it, expect } from 'vitest';
import { getTestOptions } from '../../../tests/base-test-options';
import { render, screen } from '@testing-library/vue';
import SidenavItem from './SidenavItem.vue';
import { NodeToggleEvent, SidenavItemProps } from './types';
import { TreeNode } from '../types';

const renderComponent = (props: SidenavItemProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(SidenavItem, { ...options, props });

  return { user, emitted };
};

describe('SidenavItem', () => {
  it('should render leaf node correctly', () => {
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'recruitStormtrooper', level: 1, type: 'method' } };
    renderComponent({
      ...props,
    });

    const label = screen.getByText(props.node.label);
    const toggle = screen.queryByTestId('sidenav-item-toggle');
    const errorIcon = screen.queryByTestId('sidenav-item-error-icon');

    expect(label).toBeInTheDocument();
    expect(toggle).not.toBeInTheDocument();
    expect(errorIcon).not.toBeInTheDocument();
  });

  it('should render error icon when error state given', () => {
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'recruitStormtrooper', level: 1, type: 'method', hasError: true } };
    renderComponent({
      ...props,
    });

    const label = screen.getByText(props.node.label);
    const errorIcon = screen.getByTestId('sidenav-item-error-icon');

    expect(label).toBeInTheDocument();
    expect(errorIcon).toBeInTheDocument();
  });

  it('should render interface icon for interface node type', () => {
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'Imperial Navy', level: 1, type: 'interface' } };
    renderComponent({
      ...props,
    });

    const interfaceIcon = screen.getByTestId('sidenav-item-interface-icon');

    expect(interfaceIcon).toBeInTheDocument();
  });

  it('should render version for layer', () => {
    const expectedVersion = 'v.1.3';
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'Imperial Navy', level: 1, type: 'api', badges: [{ type: 'primary', label: expectedVersion }] } };
    renderComponent({
      ...props,
    });

    const version = screen.getByText(expectedVersion);

    expect(version).toBeInTheDocument();
  });

  it('should render layer icon for api node type', () => {
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'Imperial Navy', level: 1, type: 'api' } };
    renderComponent({
      ...props,
    });

    const layerIcon = screen.getByTestId('sidenav-item-layer-icon');

    expect(layerIcon).toBeInTheDocument();
  });

  it('should render toggle when item has children', () => {
    const props: SidenavItemProps = {
      node: {
        expanded: true,
        id: '1234',
        label: 'Imperial Navy',
        level: 1,
        type: 'namespace',
        children: [{ id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false }],
      },
    };
    renderComponent({
      ...props,
    });

    const toggle = screen.getByTestId('sidenav-item-toggle');

    expect(toggle).toBeInTheDocument();
  });

  it('should render no toggle when item has no children', () => {
    const props: SidenavItemProps = { node: { expanded: true, id: '1234', label: 'Imperial Navy', level: 1, type: 'interface', children: [] } };
    renderComponent({
      ...props,
    });

    const toggle = screen.queryByTestId('sidenav-item-toggle');

    expect(toggle).not.toBeInTheDocument();
  });

  it('should render children of node', async () => {
    const props: SidenavItemProps = {
      node: {
        expanded: true,
        id: '1234',
        label: 'Imperial Navy',
        level: 1,
        type: 'interface',
        children: [{ id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false }],
      },
    };
    renderComponent({
      ...props,
    });

    const interfaceLabel = screen.getByText(props.node.label);
    const methodLabel = screen.getByText(props.node.children![0].label);

    expect(interfaceLabel).toBeInTheDocument();
    expect(methodLabel).toBeInTheDocument();
  });

  it('should emit the correct event when the toggle is clicked and the node is already expanded', async () => {
    const nodeToToggleId = '1234';
    const props: SidenavItemProps = {
      node: {
        expanded: true, // Node is expanded
        id: nodeToToggleId,
        label: 'Imperial Navy',
        level: 1,
        type: 'interface',
        children: [{ id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false }],
      },
    };
    const expectedEvent: NodeToggleEvent = {
      id: nodeToToggleId,
      expanded: false,
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const interfaceLabel = screen.getByText(props.node.label);
    const methodLabel = screen.getByText(props.node.children![0].label);

    expect(interfaceLabel).toBeInTheDocument();
    expect(methodLabel).toBeInTheDocument();

    const toggle = screen.getByTestId('sidenav-item-toggle');
    await user.click(toggle);

    expect(emitted('toggleChildren')).toEqual([[expectedEvent]]);
  });

  it('should emit the correct event when the toggle is clicked and the node is not expanded yet', async () => {
    const nodeToToggleId = '1234';
    const props: SidenavItemProps = {
      node: {
        expanded: false, // Node is not expanded
        id: nodeToToggleId,
        label: 'Imperial Navy',
        level: 1,
        type: 'interface',
        children: [{ id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false }],
      },
    };
    const expectedEvent: NodeToggleEvent = {
      id: nodeToToggleId,
      expanded: true,
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const interfaceLabel = screen.getByText(props.node.label);
    const methodLabel = screen.queryByText(props.node.children![0].label);

    expect(interfaceLabel).toBeInTheDocument();
    expect(methodLabel).not.toBeInTheDocument();

    const toggle = screen.getByTestId('sidenav-item-toggle');
    await user.click(toggle);

    expect(emitted('toggleChildren')).toEqual([[expectedEvent]]);
  });

  it('should emit selected event', async () => {
    const methodNode: TreeNode = { id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false };
    const props: SidenavItemProps = {
      node: {
        expanded: true,
        id: '1234',
        label: 'Imperial Navy',
        level: 1,
        type: 'interface',
        children: [methodNode],
      },
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const toggle = screen.getByText(methodNode.label);
    await user.click(toggle);

    expect(emitted('selected')).toEqual([[methodNode.id]]);
  });

  it('should NOT emit selected event for wrapper node', async () => {
    const methodNode: TreeNode = { id: '12345', label: 'getStormtrooper', level: 2, type: 'method', expanded: false };
    const wrapperNode: TreeNode = {
      expanded: true,
      id: '1234',
      label: 'Methods',
      level: 1,
      type: 'wrapper',
      children: [methodNode],
    };
    const props: SidenavItemProps = {
      node: {
        id: '123',
        label: 'Interface',
        expanded: true,
        level: 0,
        type: 'interface',
        children: [wrapperNode],
      },
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const toggle = screen.getByText(wrapperNode.label);
    await user.click(toggle);

    expect(emitted('selected')).toBeFalsy();
  });
});

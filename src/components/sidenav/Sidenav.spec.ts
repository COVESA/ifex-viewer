/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/vue';
import { getTestOptions } from '../../tests/base-test-options';
import { SidenavProps, ViewTabs } from './types';
import Sidenav from './Sidenav.vue';
import { namespaceMock, namespaceWithInterfaceMock } from '../../tests/mocks/namespace';
import { methodMock } from '../../tests/mocks/methods';
import { interfaceMock } from '../../tests/mocks/interface';
import { eventMock } from '../../tests/mocks/events';
import { enumerationMock } from '../../tests/mocks/enumeration';
import { structMock } from '../../tests/mocks/structs';
import { typedefMock } from '../../tests/mocks/typedef';
import { propertyMock } from '../../tests/mocks/properties';
import { Namespace } from '../../types/ifex-core';
import { IFEXTreeModelNode } from '../../types/node';
import { flushPromises } from '@vue/test-utils';

const renderComponent = (props: SidenavProps) => {
  const { options, user } = getTestOptions({});

  const { emitted } = render(Sidenav, { ...options, props });

  return { user, emitted };
};

describe('Sidenav', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render all nodes of the given tree', () => {
    const otherNamespace: Namespace = { ...namespaceMock, name: 'Other namespace' };
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '1',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '8', node: otherNamespace, type: 'namespace', children: [{ id: '2', node: methodMock, type: 'method' }] },
            { id: '9', node: propertyMock, type: 'property' },
          ],
        },
        {
          id: '3',
          node: interfaceMock,
          type: 'interface',
          children: [
            { type: 'event', id: '4', node: eventMock },
            { id: '5', node: enumerationMock, type: 'enumeration' },
            { id: '6', node: structMock, type: 'struct' },
            { id: '7', node: typedefMock, type: 'typedef' },
          ],
        },
      ],
    };
    renderComponent({
      ...props,
    });

    const rootNamespaceLabel = screen.getByText(namespaceMock.name);
    const nestedNamespaceLabel = screen.getByText(otherNamespace.name);
    const methodLabel = screen.getByText(methodMock.name);
    const propertyLabel = screen.getByText(propertyMock.name);
    const interfaceLabel = screen.getByText(interfaceMock.name);
    const eventLabel = screen.getByText(eventMock.name);
    const enumLabel = screen.getByText(enumerationMock.name);
    const structLabel = screen.getByText(structMock.name);
    const typedefLabel = screen.getByText(typedefMock.name);

    expect(rootNamespaceLabel).toBeInTheDocument();
    expect(nestedNamespaceLabel).toBeInTheDocument();
    expect(methodLabel).toBeInTheDocument();
    expect(propertyLabel).toBeInTheDocument();
    expect(interfaceLabel).toBeInTheDocument();
    expect(eventLabel).toBeInTheDocument();
    expect(enumLabel).toBeInTheDocument();
    expect(structLabel).toBeInTheDocument();
    expect(typedefLabel).toBeInTheDocument();
  });

  it('should emit event when node was selected', async () => {
    const nodeIdToSelect = '1';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: nodeIdToSelect,
          node: namespaceMock,
          type: 'namespace',
          children: [{ id: '9', node: propertyMock, type: 'property' }],
        },
      ],
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const namespaceLabel = screen.getByText(namespaceMock.name);
    await user.click(namespaceLabel);

    expect(emitted('nodeSelected')).toEqual([[nodeIdToSelect]]);
  });

  it('should collapse node on click', async () => {
    const propertyNodeId = '9';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [{ id: propertyNodeId, node: propertyMock, type: 'property' }],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    const propertyLabel = screen.getByText(propertyMock.name);
    expect(propertyLabel).toBeInTheDocument();

    const wrapperNode = screen.getByTestId(`sidenav-item-Properties-wrapper-${propertyNodeId}`);
    const propertyWrapperNodeToggle = within(wrapperNode).getByTestId('sidenav-item-toggle');
    await user.click(propertyWrapperNodeToggle);

    const hiddenPropertNode = screen.queryByText(propertyMock.name);
    expect(hiddenPropertNode).not.toBeInTheDocument();
  });

  it('should display all nodes in their previously expanded state when the parent node is expanded again', async () => {
    const interfaceNodeId = '2';
    const getMethodWrapperLabel = () => screen.getByText('Methods');
    const getPropertyWrapperLabel = () => screen.getByText('Properties');
    const getMethodLabel = () => screen.getByText(methodMock.name);
    const getPropertyLabel = () => screen.getByText(propertyMock.name);
    const getInterfaceNodeToggle = () => within(screen.getByTestId(`sidenav-item-${interfaceNodeId}`)).getAllByTestId('sidenav-item-toggle')[0];

    const propertyNodeId = '4';
    const treeModel: IFEXTreeModelNode[] = [
      {
        id: '1',
        node: namespaceWithInterfaceMock,
        type: 'namespace',
        children: [
          {
            id: interfaceNodeId,
            node: interfaceMock,
            type: 'interface',
            children: [
              { id: '3', node: methodMock, type: 'method' },
              { id: propertyNodeId, node: propertyMock, type: 'property' },
            ],
          },
        ],
      },
    ];
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '1',
      treeModel,
    };
    const { user } = renderComponent({
      ...props,
    });

    expect(getMethodWrapperLabel()).toBeInTheDocument();
    expect(getPropertyWrapperLabel()).toBeInTheDocument();
    expect(getMethodLabel()).toBeInTheDocument();
    expect(getPropertyLabel()).toBeInTheDocument();

    // Collapse property wrapper node
    const wrapperNode = screen.getByTestId(`sidenav-item-Properties-wrapper-${propertyNodeId}`);
    const propertyWrapperNodeToggle = within(wrapperNode).getByTestId('sidenav-item-toggle');
    await user.click(propertyWrapperNodeToggle);

    // Property node should be hidden now
    const hiddenPropertyNode = screen.queryByText(propertyMock.name);
    expect(hiddenPropertyNode).not.toBeInTheDocument();

    await user.click(getInterfaceNodeToggle());

    // All other children of interface should be hideen as well
    const hiddenMethodLabel = screen.queryByText(methodMock.name);
    expect(hiddenMethodLabel).not.toBeInTheDocument();
    const hiddenMethodWrapperLabel = screen.queryByText('Methods');
    expect(hiddenMethodWrapperLabel).not.toBeInTheDocument();
    const hiddenPropertyWrapperLabel = screen.queryByText('Properties');
    expect(hiddenPropertyWrapperLabel).not.toBeInTheDocument();

    // Expand interface node again
    await user.click(getInterfaceNodeToggle());

    expect(getMethodWrapperLabel()).toBeInTheDocument();
    expect(getPropertyWrapperLabel()).toBeInTheDocument();
    expect(getMethodLabel()).toBeInTheDocument();
    // Property node was hidden before interface node was collapsed so this
    // node should also be hidden after interface node was expanded again
    const stillHiddenPropertyNode = screen.queryByText(propertyMock.name);
    expect(stillHiddenPropertyNode).not.toBeInTheDocument();
  });

  it('should collapse all nodes', async () => {
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceWithInterfaceMock,
          type: 'namespace',
          children: [
            {
              id: '2',
              node: interfaceMock,
              type: 'interface',
              children: [{ id: '3', node: methodMock, type: 'method' }],
            },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    const interfaceLabel = screen.getByText(interfaceMock.name);
    const methodWrapperLabel = screen.getByText('Methods');
    const methodLabel = screen.getByText(methodMock.name);

    expect(interfaceLabel).toBeInTheDocument();
    expect(methodWrapperLabel).toBeInTheDocument();
    expect(methodLabel).toBeInTheDocument();

    await user.click(screen.getByTestId('sidenav-collapse-btn'));

    const hiddenInterfaceLabel = screen.queryByText(interfaceMock.name);
    const hiddenMethodWrapperLabel = screen.queryByText('Methods');
    const hiddenMethodLabel = screen.queryByText(methodMock.name);

    expect(hiddenInterfaceLabel).not.toBeInTheDocument();
    expect(hiddenMethodWrapperLabel).not.toBeInTheDocument();
    expect(hiddenMethodLabel).not.toBeInTheDocument();

    // Root node should be still in the DOM
    const namespaceLabel = screen.getByText(namespaceMock.name);
    expect(namespaceLabel).toBeInTheDocument();
  });

  it('should expand all nodes after all are collapsed', async () => {
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceWithInterfaceMock,
          type: 'namespace',
          children: [
            {
              id: '2',
              node: interfaceMock,
              type: 'interface',
              children: [{ id: '3', node: methodMock, type: 'method' }],
            },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    // Collapse all first
    await user.click(screen.getByTestId('sidenav-collapse-btn'));

    const hiddenInterfaceLabel = screen.queryByText(interfaceMock.name);
    const hiddenMethodWrapperLabel = screen.queryByText('Methods');
    const hiddenMethodLabel = screen.queryByText(methodMock.name);

    expect(hiddenInterfaceLabel).not.toBeInTheDocument();
    expect(hiddenMethodWrapperLabel).not.toBeInTheDocument();
    expect(hiddenMethodLabel).not.toBeInTheDocument();

    // Root node should be still in the DOM
    const namespaceLabel = screen.getByText(namespaceMock.name);
    expect(namespaceLabel).toBeInTheDocument();

    // Expand all again
    await user.click(screen.getByTestId('sidenav-expand-btn'));

    const interfaceLabel = screen.getByText(interfaceMock.name);
    const methodWrapperLabel = screen.getByText('Methods');
    const methodLabel = screen.getByText(methodMock.name);

    expect(interfaceLabel).toBeInTheDocument();
    expect(methodWrapperLabel).toBeInTheDocument();
    expect(methodLabel).toBeInTheDocument();
  });

  it('should start resizing on mousemove over resizer', async () => {
    const nodeIdToSelect = '1';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: nodeIdToSelect,
          node: namespaceMock,
          type: 'namespace',
          children: [{ id: '9', node: propertyMock, type: 'property' }],
        },
      ],
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const namespaceLabel = screen.getByText(namespaceMock.name);
    await user.click(namespaceLabel);

    expect(emitted('nodeSelected')).toEqual([[nodeIdToSelect]]);
  });

  it('should emit event when tab changed', async () => {
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [{ id: '9', node: propertyMock, type: 'property' }],
        },
      ],
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const tabName = ViewTabs.LAYERED_VIEW;
    const layeredViewTab = screen.getByText(tabName);
    await user.click(layeredViewTab);

    expect(emitted('viewTabChanged')).toEqual([[tabName]]);
  });

  it('should filter and display search results matching the search term', async () => {
    const searchValue = 'Stormtrooper';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '2', node: propertyMock, type: 'property' },
            { id: '3', node: methodMock, type: 'method' },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    expect(screen.getByText(namespaceMock.name)).toBeInTheDocument();
    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
    expect(screen.getByText(propertyMock.name)).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, searchValue);

    vi.advanceTimersByTime(350);
    await flushPromises();

    const allNodes = screen.queryAllByTestId(/^sidenav-item/);
    expect(allNodes).toHaveLength(0);

    const searchResults = screen.queryAllByTestId('search-result-item');
    expect(searchResults).toHaveLength(1);

    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
  });

  it('should reset search correctly', async () => {
    const searchValue = 'Stormtrooper';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '2', node: propertyMock, type: 'property' },
            { id: '3', node: methodMock, type: 'method' },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, searchValue);

    vi.advanceTimersByTime(350);
    await flushPromises();

    const allNodes = screen.queryAllByTestId(/^sidenav-item/);
    expect(allNodes).toHaveLength(0);

    const searchResults = screen.queryAllByTestId('search-result-item');
    expect(searchResults).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Reset search' }));

    vi.advanceTimersByTime(350);
    await flushPromises();

    expect(screen.getByText(namespaceMock.name)).toBeInTheDocument();
    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
    expect(screen.getByText(propertyMock.name)).toBeInTheDocument();
  });

  it('should filter and display nodes matching a in-sensitive search term', async () => {
    const searchValue = 'STORMtrooPer';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '2', node: propertyMock, type: 'property' },
            { id: '3', node: methodMock, type: 'method' },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    expect(screen.getByText(namespaceMock.name)).toBeInTheDocument();
    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
    expect(screen.getByText(propertyMock.name)).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, searchValue);

    vi.advanceTimersByTime(350);
    await flushPromises();

    const searchResults = screen.queryAllByTestId('search-result-item');
    expect(searchResults).toHaveLength(1);

    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
  });

  it('should find number values', async () => {
    const searchValue = '10';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '1',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '2', node: propertyMock, type: 'property' },
            { id: '3', node: methodMock, type: 'method' },
          ],
        },
      ],
    };
    const { user } = renderComponent({
      ...props,
    });

    expect(screen.getByText(namespaceMock.name)).toBeInTheDocument();
    expect(screen.getByText(methodMock.name)).toBeInTheDocument();
    expect(screen.getByText(propertyMock.name)).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, searchValue);

    vi.advanceTimersByTime(350);
    await flushPromises();

    const searchResults = screen.queryAllByTestId('search-result-item');
    expect(searchResults).toHaveLength(1);

    expect(screen.getByText(propertyMock.name)).toBeInTheDocument(); // Has arraysize property with 10 value
    expect(screen.queryByText(namespaceMock.name)).not.toBeInTheDocument();
    expect(screen.queryByText(methodMock.name)).not.toBeInTheDocument();
  });

  it('should emit selected node from search results view', async () => {
    const searchValue = 'STORMtrooPer';
    const selectedNodeId = '3';
    const props: SidenavProps = {
      sidenavPosition: 'left',
      selectedNodeId: '9',
      treeModel: [
        {
          id: '1',
          node: namespaceMock,
          type: 'namespace',
          children: [
            { id: '2', node: propertyMock, type: 'property' },
            { id: selectedNodeId, node: methodMock, type: 'method' },
          ],
        },
      ],
    };
    const { user, emitted } = renderComponent({
      ...props,
    });

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, searchValue);

    vi.advanceTimersByTime(350);
    await flushPromises();

    const searchResults = screen.queryAllByTestId('search-result-item');
    expect(searchResults).toHaveLength(1);

    await user.click(screen.getByText(methodMock.name));

    expect(emitted('nodeSelected')).toEqual([[selectedNodeId]]);
  });
});

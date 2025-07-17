/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, it, expect } from 'vitest';
import { namespaceMock, namespaceWithCustomPropertiesMock } from '../../tests/mocks/namespace.ts';
import { getCustomProperties } from './get-custom-properties.ts';
import { Namespace } from '../../types/ifex-core.ts';

describe('get-custom-properties', () => {
  const knownNamespaceProperties: Record<keyof Namespace, undefined> = {
    description: undefined,
    minor_version: undefined,
    properties: undefined,
    events: undefined,
    enumerations: undefined,
    includes: undefined,
    interface: undefined,
    major_version: undefined,
    methods: undefined,
    name: undefined,
    version_label: undefined,
    typedefs: undefined,
    structs: undefined,
    namespaces: undefined,
  };

  it('should return no custom properties', () => {
    const result = getCustomProperties(namespaceMock, knownNamespaceProperties);

    expect(result).toEqual({});
  });

  it('should all given custom properties', () => {
    const result = getCustomProperties(namespaceWithCustomPropertiesMock, knownNamespaceProperties);

    expect(result).toEqual({
      patch_version: '1',
      custom_properties: {
        customProperty1: 'value1',
        customProperty2: 'value2',
      },
    });
  });
});

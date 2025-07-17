/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, expect, it } from 'vitest';
import { mergeDocuments } from './merge-layers.ts';

describe('merge-layers', () => {
  it('should return empty object when no document was provided', () => {
    const result = mergeDocuments({});
    expect(result).toEqual([{}, null]);
  });

  it('should not merge when only one document provided', () => {
    const mockA = {
      config: {
        name: 'mainConfig',
        setting1: 'value1',
      },
      data: 'value2',
    };

    const expected = mockA;

    const result = mergeDocuments(mockA);
    expect(result).toEqual([expected, null]);
  });

  it('should merge 2 documents into one document', () => {
    const mockA = {
      config: {
        name: 'mainConfig',
        setting1: 'value1',
      },
      users: [
        {
          name: 'user1',
          age: 20,
        },
        { name: 'user2', age: 50 },
      ],
      data: 'value2',
    };

    const mockB = {
      config: {
        name: 'mainConfig',
        setting1: 'newValue1',
        setting2: 'value2',
      },
      users: [
        {
          name: 'user1',
          age: 20,
        },
        { name: 'user2', age: 53 },
      ],
      additionalData: 'value3',
    };

    const expected = {
      config: {
        name: 'mainConfig',
        setting1: 'newValue1',
        setting2: 'value2',
      },
      users: [
        {
          name: 'user1',
          age: 20,
        },
        { name: 'user2', age: 53 },
      ],
      data: 'value2',
      additionalData: 'value3',
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([expected, null]);
  });

  it('should merge 2 arrays and remove all duplicate entries', () => {
    const mockA = {
      config: {
        name: 'mainConfig',
        setting1: 'value1',
      },
      users: ['user1', 'user2'],
    };

    const mockB = {
      config: {
        name: 'mainConfig',
        setting1: 'newValue1',
        setting2: 'value2',
      },
      users: ['user1', 'user3'],
    };

    const expected = {
      config: {
        name: 'mainConfig',
        setting1: 'newValue1',
        setting2: 'value2',
      },
      users: ['user1', 'user2', 'user3'],
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([expected, null]);
  });

  it('should merge more than 2 documents into one document', () => {
    const mockA = {
      config: {
        name: 'mainConfig',
        setting1: 'value1',
      },
      data: 'data',
    };

    const mockB = {
      array: ['value1', 'value2'],
      config: {
        name: 'mainConfig',
        setting1: 'overwrite setting 1',
        setting2: 'add setting 2',
      },
      additionalData: 'additionalData',
    };

    const mockC = {
      config: {
        name: 'mainConfig',
        setting2: 'overwrite setting 2 again',
      },
      additionalData: 'overwrite additional data',
      custom_properties: {
        custom1: 'custom1',
        custom2: 'custom2',
      },
    };

    const mockD = {
      additionalData: 'overwrite additional data again',
      array: ['value3', 'value4', 'value5'],
      custom_properties: {
        custom1: 'custom1',
        custom2: {
          custom3: 'custom3',
          custom4: 'custom4',
        },
      },
    };

    const expected = {
      config: {
        name: 'mainConfig',
        setting1: 'overwrite setting 1',
        setting2: 'overwrite setting 2 again',
      },
      array: ['value1', 'value2', 'value3', 'value4', 'value5'],
      data: 'data',
      additionalData: 'overwrite additional data again',
      custom_properties: {
        custom1: 'custom1',
        custom2: {
          custom3: 'custom3',
          custom4: 'custom4',
        },
      },
    };

    const result = mergeDocuments(mockA, mockB, mockC, mockD);
    expect(result).toEqual([expected, null]);
  });

  it('should return an error when base layer does not have consistent usage of name attribute', () => {
    const mockA = {
      users: [
        {
          name: {
            mismatch: 'string',
          },
        },
        {
          name: 'Test',
        },
      ],
    };

    const mockB = {
      users: [],
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([null, new Error('cannot merge lower and higher layer slice: base layer does not seem to have consistent usage of name attribute')]);
  });

  it('should return an error when overlay layer does not have consistent usage of name attribute', () => {
    const mockA = {
      users: [],
    };

    const mockB = {
      users: [
        {
          name: {
            mismatch: 'string',
          },
        },
        {
          name: 'Test',
        },
      ],
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([null, new Error('cannot merge lower and higher layer slice: overlay layer does not seem to have consistent usage of name attribute')]);
  });

  it('should return empty array when base and overlay layer do not have array items', () => {
    const mockA = {
      users: [],
    };

    const mockB = {
      users: [],
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([{ users: [] }, null]);
  });

  it('should return an error when child node of base layer has not consistent usage of name attribute', () => {
    const mockA = {
      users: [
        {
          name: 'test',
          users: [
            {
              name: {
                mismatch: 'initial value',
              },
            },
            {
              name: 'Test',
            },
          ],
        },
      ],
    };

    const mockB = {
      users: [
        {
          name: 'test',
          users: [
            {
              name: {
                mismatch: 'overwrite',
              },
            },
            {
              name: 'Test',
            },
          ],
        },
      ],
    };

    const result = mergeDocuments(mockA, mockB);
    expect(result).toEqual([
      null,
      new Error(
        'cannot merge lower and higher layer slice: cannot merge documents: cannot merge lower and higher layer slice: base layer does not seem to have consistent usage of name attribute',
      ),
    ]);
  });
});

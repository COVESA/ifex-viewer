/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { BadgeProps } from '../badge/types.ts';

export interface DataTypeBadgeProps extends BadgeProps {
  datatype: PrimitiveDataType | string;
}

export type PrimitiveDataType =
  | 'uint8'
  | 'uint8[]'
  | 'int8'
  | 'int8[]'
  | 'uint16'
  | 'uint16[]'
  | 'int16'
  | 'int16[]'
  | 'uint32'
  | 'uint32[]'
  | 'int32'
  | 'int32[]'
  | 'uint64'
  | 'uint64[]'
  | 'int64'
  | 'int64[]'
  | 'boolean'
  | 'boolean[]'
  | 'float'
  | 'float[]'
  | 'double'
  | 'double[]'
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'object'
  | 'array'
  | 'any'
  | 'opaque';

export const primitiveDataTypes: PrimitiveDataType[] = [
  'uint8',
  'uint8[]',
  'int8',
  'int8[]',
  'uint16',
  'uint16[]',
  'int16',
  'int16[]',
  'uint32',
  'uint32[]',
  'int32',
  'int32[]',
  'uint64',
  'uint64[]',
  'int64',
  'int64[]',
  'boolean',
  'boolean[]',
  'float',
  'float[]',
  'double',
  'double[]',
  'string',
  'string[]',
  'number',
  'number[]',
  'object',
  'array',
  'any',
  'opaque',
];

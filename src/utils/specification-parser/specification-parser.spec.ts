/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, expect, it } from 'vitest';
import { specificationItemMock, specificationMock, specificationWithTwoDocs } from '../../tests/mocks/specification.ts';
import { parseSpecifications } from './specification-parser.ts';

describe('specification-parser', () => {
  it('should parse yaml file to a json structure', () => {
    const result = parseSpecifications([specificationItemMock]);

    expect(result).toHaveLength(1);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0].filename).toEqual(specificationItemMock.filename);
  });

  it('should parse yaml file containing multiple documents correctly', () => {
    const filename = 'my-file';
    const result = parseSpecifications([{ filename: `${filename}.yml`, content: specificationWithTwoDocs }]);

    expect(result).toHaveLength(2);
    expect(result[0].filename).toEqual(filename);
    expect(result[1].filename).toEqual(`${filename} (2)`);
  });

  it('should parse multiple yaml files', () => {
    const coreLayerFilename = 'my-core-layer-file';
    const customLayerFilename = 'my-custom-layer-file';
    const result = parseSpecifications([
      { filename: `${coreLayerFilename}.yml`, content: specificationMock },
      { filename: `${customLayerFilename}.yml`, content: specificationWithTwoDocs },
    ]);

    expect(result).toHaveLength(3);
    expect(result[0].filename).toEqual(coreLayerFilename);
    expect(result[1].filename).toEqual(customLayerFilename);
    expect(result[2].filename).toEqual(`${customLayerFilename} (2)`);
  });
});

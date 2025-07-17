/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { getViewerModel } from './specification-model.ts';
import {
  simpleSpecificationMock,
  simpleSpecificationMockWithValidationErrors,
  specificationMock,
  specificationMockWithValidationErrors,
  specificationWithTwoDocs,
} from '../tests/mocks/specification.ts';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import * as uuid from 'uuid';
import { IfexSpecificationItem } from '../types.ts';

vi.mock('uuid');

describe('specification-model', () => {
  let uuidSpy: MockInstance;

  beforeEach(() => (uuidSpy = vi.spyOn(uuid, 'v4')));

  afterEach(() => vi.restoreAllMocks());

  it('should create viewer model for one file', () => {
    uuidSpy.mockReturnValue('uuid');

    const result = getViewerModel([{ filename: 'filename.yml', content: simpleSpecificationMock }]);

    expect(result).toMatchSnapshot();
  });

  it('should create viewer model for one file with validation errors', () => {
    uuidSpy.mockReturnValue('uuid');

    const result = getViewerModel([{ filename: 'filename.yml', content: simpleSpecificationMockWithValidationErrors }]);

    expect(result).toMatchSnapshot();
  });

  it('should create viewer model for multiple specifications', () => {
    uuidSpy.mockReturnValue('uuid');

    const given: IfexSpecificationItem[] = [
      { filename: 'core-layer.yml', content: specificationWithTwoDocs },
      { filename: 'custom-layer.yml', content: specificationMock },
    ];

    const result = getViewerModel(given);

    expect(result.layeredView).toHaveLength(3);
    expect(result).toMatchSnapshot();
  });

  it('should return empty array when no specification is given', () => {
    const given: IfexSpecificationItem[] = [];

    const result = getViewerModel(given);

    expect(result.mergeView).toBeNull();
    expect(result.layeredView).toHaveLength(0);
  });

  it('should validate only the core layer of the layered view', () => {
    const given: IfexSpecificationItem[] = [
      { filename: 'core-layer.yml', content: specificationMockWithValidationErrors },
      { filename: 'custom-layer.yml', content: specificationMockWithValidationErrors },
    ];

    const result = getViewerModel(given);

    const mergedDoc = result.mergeView!;
    const coreLayer = result.layeredView[0];
    const customLayer = result.layeredView[1];

    expect(mergedDoc.validationErrors).toBeUndefined();
    expect(coreLayer.children![0].validationErrors).toHaveLength(2);
    expect(customLayer.children![0].validationErrors).toBeUndefined();
  });

  it('should use file type as root node name', () => {
    uuidSpy.mockReturnValue('uuid');
    const filetype = 'IFEX Core IDL';
    const given: IfexSpecificationItem[] = [
      {
        filename: `api.yml`,
        content: `
name: "GalacticEmpire"
filetype: "${filetype}"
namespaces:
  - name: "GalacticEmpire"
    description1: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const result = getViewerModel(given);

    expect(result.layeredView).toHaveLength(1);
    expect(result.layeredView[0].node.name).toEqual(filetype);
  });

  it('should use AST as layer name when no file type is given', () => {
    uuidSpy.mockReturnValue('uuid');
    const astName = 'GalacticEmpire';
    const given: IfexSpecificationItem[] = [
      {
        filename: `api.yml`,
        content: `
name: "${astName}"
namespaces:
  - name: "GalacticEmpire"
    description1: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const result = getViewerModel(given);

    expect(result.layeredView).toHaveLength(1);
    expect(result.layeredView[0].node.name).toEqual(astName);
  });

  it('should use filename as layer name when no AST name is given', () => {
    uuidSpy.mockReturnValue('uuid');
    const filename = 'core-layer';
    const given: IfexSpecificationItem[] = [
      {
        filename: `${filename}.yml`,
        content: `
namespaces:
  - name: "GalacticEmpire"
    description1: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const result = getViewerModel(given);

    expect(result.layeredView).toHaveLength(1);
    expect(result.layeredView[0].node.name).toEqual(filename);
  });

  it('should use fallback name when no filename and no AST name is given for layer', () => {
    uuidSpy.mockReturnValue('uuid');

    const given: IfexSpecificationItem[] = [
      {
        filename: '',
        content: `
namespaces:
  - name: "GalacticEmpire"
    description1: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const result = getViewerModel(given);

    expect(result.layeredView).toHaveLength(1);
    expect(result.layeredView[0].node.name).toEqual('Unknown layer');
  });
});

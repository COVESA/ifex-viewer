/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { IFEXCoreIDL } from '../types/ifex-core';
import { v4 as uuid } from 'uuid';
import { createTreeModel } from '../utils/tree/tree';
import Ajv2020 from 'ajv/dist/2020';
import { ErrorObject } from 'ajv';
import IFEXJsonSchema from '../types/ifex-core-schema.json';
import { IFEXTreeModelNode } from '../types/node';
import { IfexSpecificationItem, ParsedIfexSpecificationItem } from '../types.ts';
import { parseSpecifications } from '../utils/specification-parser/specification-parser.ts';
import { mergeDocuments } from '../utils/merge-layers/merge-layers.ts';

export interface ViewerModel {
  mergeView: IFEXTreeModelNode | null;
  layeredView: IFEXTreeModelNode[];
}

// TODO: don't use ErrorObject of ajv directly, create a custom error object
const validateSpecification = (specification: IFEXCoreIDL) => {
  const ajv = new Ajv2020({
    allErrors: true, // We want to collect all errors so we can visualize them in the detail page, etc.
  });
  ajv.validate(IFEXJsonSchema, specification);

  return ajv.errors || [];
};

const createCoreLayerTreeModelNode = (coreLayer: ParsedIfexSpecificationItem): IFEXTreeModelNode => {
  const validationErrors = validateSpecification(coreLayer.content);
  const mergedValidationErrors = new Map<string, ErrorObject[]>();

  if (validationErrors?.length) {
    validationErrors.forEach(error => {
      if (mergedValidationErrors.has(error.instancePath)) {
        mergedValidationErrors.set(error.instancePath, [...(mergedValidationErrors.get(error.instancePath) || []), error]);
      } else {
        mergedValidationErrors.set(error.instancePath, [error]);
      }
    });
  }

  const rootLevelValidationError = mergedValidationErrors.get(''); // empty string = root element

  return {
    id: uuid(),
    node: { ...coreLayer.content, name: getLayerName(coreLayer.content.filetype, coreLayer.content.name, coreLayer.filename) }, // TODO: adjust test and check file types in doc
    type: 'api',
    validationErrors: rootLevelValidationError || [],
    children: [...createTreeModel(coreLayer.content.namespaces || [], '/namespaces', mergedValidationErrors)],
  };
};

const getLayerName = (fileType?: string, layerName?: string, filename?: string): string => {
  if (fileType) {
    return fileType;
  }

  if (layerName) {
    return layerName;
  }

  if (filename) {
    return filename;
  }

  return 'Unknown layer'; // TODO: add a count for each unknown layer e.g Layer 1, Layer 2, ...
};

const getMergeView = (parsedSpecifications: ParsedIfexSpecificationItem[]): IFEXTreeModelNode | null => {
  const specContents = parsedSpecifications.map(spec => spec.content as Record<string, unknown>);
  const [mergedDocument] = mergeDocuments(...specContents);

  if (!mergedDocument) {
    return null;
  }

  return {
    id: uuid(),
    node: { ...mergedDocument, name: 'Merged document' },
    type: 'api',
    children: [...createTreeModel(mergedDocument?.namespaces || [], '/namespaces')],
  };
};

export const getViewerModel = (specifications: IfexSpecificationItem[]): ViewerModel => {
  const parsedSpecifications = parseSpecifications(specifications);

  if (parsedSpecifications.length === 0) {
    return { mergeView: null, layeredView: [] };
  }

  const mergeView = getMergeView(parsedSpecifications);

  const layeredView = parsedSpecifications.map((parsedSpecification, index): IFEXTreeModelNode => {
    // We assume that the first document is the core layer. This has to be challenged over time.
    if (index === 0) {
      return createCoreLayerTreeModelNode(parsedSpecification);
    } else {
      return {
        id: uuid(),
        node: { ...parsedSpecification.content, name: getLayerName(parsedSpecification.content.filetype, parsedSpecification.content.name, parsedSpecification.filename) },
        type: 'api',
        validationErrors: [],
        children: [...createTreeModel(parsedSpecification.content.namespaces || [], '/namespaces')],
      };
    }
  });

  return { mergeView, layeredView };
};

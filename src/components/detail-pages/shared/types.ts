/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ErrorObject } from 'ajv';

export interface DetailPageBaseProps {
  /**
   * `dotNotationFullPath` represents the path to a node in the YAML specification using dot notation.
   */
  dotNotationFullPath: string;
  /**
   * `childrenDotNotationFullPath` is used for identifying the path to the children of the given node (e.g. inputs or outputs).
   * Not all nodes have children, so this is optional.
   */
  childrenDotNotationFullPaths?: string[];
  validationErrors?: ErrorObject[];
}

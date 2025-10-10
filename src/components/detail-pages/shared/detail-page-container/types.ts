/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ErrorObject } from 'ajv';
import { IFEXTreeModelNode } from '../../../../types/node.ts';

export interface DetailPageContainerProps {
  description?: string;
  validationErrors?: ErrorObject[];
  customProperties?: Record<string, unknown>;
  showYamlView?: boolean;
  rawData?: IFEXTreeModelNode['node'];
}

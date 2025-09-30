/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { BadgeType } from '../../../shared/components/badge/types';
import { IFEXTreeModelNode } from '../../../../types/node.ts';

export interface HeadlineProps {
  headline: string;
  dotNotation?: string;
  pageType?: BadgeType;
  /**
   * The raw data of the node to be used in the copy button.
   */
  nodeRawData: IFEXTreeModelNode['node'];
}

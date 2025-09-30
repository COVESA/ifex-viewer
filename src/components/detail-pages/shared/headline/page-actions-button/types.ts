/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */
import { IFEXTreeModelNode } from '../../../../../types/node.ts';

export interface PageActionsButtonProps {
  /**
   * The raw data to be transformed into yaml and then copied to clipboard
   */
  rawData: IFEXTreeModelNode['node'];
}

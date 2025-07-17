/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { IFEXTreeModelNode, NodeType } from '../../types/node';
import { BadgeType } from '../shared/components/badge/types.ts';

export interface SidenavProps {
  treeModel: IFEXTreeModelNode[];
  selectedNodeId: string;
  showTabs?: boolean;
}

export interface TreeNode {
  id: string;
  label: string;
  level: number;
  type: NodeType;
  children?: TreeNode[];
  selected?: boolean;
  expanded: boolean;
  hasError?: boolean;
  badges?: {
    type: BadgeType;
    label: string;
  }[];
}

export enum ViewTabs {
  MERGE_VIEW = 'Merge View',
  LAYERED_VIEW = 'Layered View',
}

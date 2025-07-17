/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { TreeNode } from '../types';

export interface SidenavItemProps {
  node: TreeNode;
}

export interface NodeToggleEvent {
  id: string;
  expanded: boolean;
}

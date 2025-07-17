/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { NodeType } from '../../types/node.ts';

export interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export type BreadcrumbsIconType = Extract<NodeType, 'api' | 'interface' | 'namespace'>;

export interface Breadcrumb {
  nodeId: string;
  text: string;
  icon?: BreadcrumbsIconType;
}

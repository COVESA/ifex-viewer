/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Interface, Namespace } from '../../../types/ifex-core';
import { NodeType } from '../../../types/node';
import { DetailPageBaseProps } from '../shared/types';

export type GroupedDetailPageTypes = Exclude<NodeType, 'api' | 'enumeration' | 'wrapper' | 'event' | 'method' | 'struct' | 'typedef' | 'property'>;

export interface GroupedDetailPageProps extends DetailPageBaseProps {
  data: Namespace | Interface;
  type: GroupedDetailPageTypes;
}

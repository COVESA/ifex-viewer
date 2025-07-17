/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { NodeType } from '../../../../types/node';

export interface BadgeProps {
  type?: BadgeType;
  size?: BadgeSize;
}

export type BadgeType = Exclude<'primary' | 'secondary' | 'primitiveType' | 'complexType' | NodeType, 'wrapper' | 'api'>;

export type BadgeSize = 's' | 'm' | 'l';

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { BadgeType } from '../../../shared/components/badge/types';

export interface HeadlineProps {
  headline: string;
  dotNotation?: string;
  pageType?: BadgeType;
}

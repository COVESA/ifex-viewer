/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Enumeration } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types';

export interface EnumerationDetailPageProps extends DetailPageBaseProps {
  enumeration: Enumeration;
}

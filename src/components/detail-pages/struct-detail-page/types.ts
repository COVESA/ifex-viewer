/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Struct } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types';

export interface StructDetailPageProps extends DetailPageBaseProps {
  struct: Struct;
}

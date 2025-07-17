/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Method } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types';

export interface MethodDetailPageProps extends DetailPageBaseProps {
  method: Method;
}

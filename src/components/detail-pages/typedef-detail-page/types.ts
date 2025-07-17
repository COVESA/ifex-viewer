/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Typedef } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types';

export interface TypedefDetailPageProps extends DetailPageBaseProps {
  typedef: Typedef;
}

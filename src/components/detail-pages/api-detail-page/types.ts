/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { IFEXCoreIDL } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types.ts';

// Omits dotNotationFullPath because AST / API element does not have a dotNotationFullPath
export interface ApiDetailPageProps extends Omit<DetailPageBaseProps, 'dotNotationFullPath'> {
  api: IFEXCoreIDL;
}

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ArgumentWithCustomProperties, ErrorWithCustomProperties } from '../../../../types/ifex-core';

export interface PropertyViewerProps {
  headline: string;
  properties: ArgumentWithCustomProperties[] | ErrorWithCustomProperties[];
  parentDotNotationFullPath?: string;
}

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { Property } from '../../../types/ifex-core';
import { DetailPageBaseProps } from '../shared/types';

export interface PropertyDetailPageProps extends DetailPageBaseProps {
  propertyData: Property;
}

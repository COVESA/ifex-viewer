/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { DetailPageBaseProps } from '../shared/types';
import { Event } from '../../../types/ifex-core';

export interface EventDetailPageProps extends DetailPageBaseProps {
  event: Event;
}

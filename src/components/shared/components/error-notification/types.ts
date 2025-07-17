/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ErrorObject } from 'ajv';

export interface ErrorNotificationProps {
  validationError: ErrorObject;
}

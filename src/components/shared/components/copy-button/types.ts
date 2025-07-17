/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ClipboardActionType } from '../../../../types';
import { ButtonSize } from '../button/types';

export interface CopyButtonProps {
  data: string;
  size?: ButtonSize;
  clipBoardActionType?: ClipboardActionType;
}

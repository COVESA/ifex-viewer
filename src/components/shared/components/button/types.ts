/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

export interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export type ButtonSize = 's' | 'm' | 'l';

export type ButtonVariant = 'primary' | 'secondary';

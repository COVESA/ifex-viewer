/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

export interface SourceCodeViewerProps {
  code: Record<string, unknown>;
  styling?: {
    bgColorLightTheme: string;
    bgColorDarkTheme: string;
  };
}

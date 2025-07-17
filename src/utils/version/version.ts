/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

export const getVersion = (majorVersion: number = 0, minorVersion: number = 0) => {
  if (majorVersion === 0 && minorVersion === 0) {
    return '';
  }

  return `v${majorVersion}.${minorVersion}`;
};

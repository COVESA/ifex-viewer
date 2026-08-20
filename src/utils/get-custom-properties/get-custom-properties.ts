/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { isUnsafeKey } from '../unsafe-keys/unsafe-keys.ts';

export const getCustomProperties = <T>(node: T, knownProperties: Record<keyof T, undefined>) => {
  const allKnownProperties = Object.keys(knownProperties) as (keyof T)[];
  const unknownKeys = Object.keys(node as object).filter(
    key => !isUnsafeKey(key) && !allKnownProperties.includes(key as keyof T),
  );

  const unknownPropsObj: Record<string, unknown> = {};

  for (const key of unknownKeys) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      unknownPropsObj[key] = node[key as keyof T];
    }
  }

  return unknownPropsObj;
};

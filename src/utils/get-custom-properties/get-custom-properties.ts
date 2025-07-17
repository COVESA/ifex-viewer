/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

export const getCustomProperties = <T>(node: T, knownProperties: Record<keyof T, undefined>) => {
  const allKnownProperties = Object.keys(knownProperties) as (keyof T)[];
  const unknownKeys = Object.keys(node as object).filter(key => !allKnownProperties.includes(key as keyof T));

  const unknownPropsObj: Record<string, unknown> = {};

  for (const key of unknownKeys) {
    unknownPropsObj[key] = node[key as keyof T];
  }

  return unknownPropsObj;
};

/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
export const isUnsafeKey = (key: string): boolean => UNSAFE_KEYS.has(key);

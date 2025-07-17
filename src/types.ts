/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { InjectionKey } from 'vue';
import { AST } from './types/ifex-core';

export interface IfexViewerProps {
  specifications: IfexSpecificationItem[];
}

export interface IfexSpecificationItem {
  filename: string;
  content: string;
}

export interface ParsedIfexSpecificationItem {
  filename: string;
  content: AST;
}

/**
 * TODO: add documentation what each type stands for
 */
export type ClipboardActionType = 'dotNotation' | 'validationError' | 'sourcecode';

export interface ClipboardCopiedEvent {
  type: ClipboardActionType;
  data: string;
}

// eslint-disable-next-line no-unused-vars
export const CopiedSuccessfulEventKey = Symbol() as InjectionKey<(payload: ClipboardCopiedEvent) => void>;

export interface NodeSelectedEvent {
  path: string;
}

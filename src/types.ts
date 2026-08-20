/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { InjectionKey } from 'vue';
import { AST } from './types/ifex-core';

export type SidenavPosition = 'left' | 'right';

export interface IfexViewerLayout {
  /**
   * Determines whether the side navigation is positioned on the left or right side of the viewer.
   */
  sidenavPosition: SidenavPosition;
}

export interface IfexViewerSearchShortcut {
  /**
   * Shortcut used on macOS. Use modifier names such as `Meta`, `Control`, `Alt`, and `Shift`.
   */
  mac?: string;
  /**
   * Shortcut used on Windows. Use modifier names such as `Meta`, `Control`, `Alt`, and `Shift`.
   */
  windows?: string;
  /**
   * Shortcut used on Linux. Use modifier names such as `Meta`, `Control`, `Alt`, and `Shift`.
   */
  linux?: string;
  /**
   * Shortcut used when no platform-specific shortcut is configured or the platform cannot be determined.
   */
  default?: string;
}

export interface IfexViewerProps {
  /**
   * An array of IFEX specification items to be displayed in the viewer.
   */
  specifications: IfexSpecificationItem[];
  /**
   * Specifies the layout configuration for the IFEX viewer.
   */
  layout: IfexViewerLayout;
  /**
   * Configures the keyboard shortcut that focuses the sidenav search input.
   * Defaults to `Meta+G` on macOS and `Control+G` on other platforms.
   */
  searchShortcut?: IfexViewerSearchShortcut;
}

/**
 * Represents a single IFEX specification file with its filename and content.
 * - `filename`: The name of the specification file (e.g. your-spec.yml).
 * - `content`: The content of the specification file in YAML format as a string.
 */
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
export type ClipboardActionType = 'dotNotation' | 'validationError' | 'sourcecode' | 'nodeYamlContent';

export interface ClipboardCopiedEvent {
  type: ClipboardActionType;
  data: string;
}

// eslint-disable-next-line no-unused-vars
export const CopiedSuccessfulEventKey = Symbol() as InjectionKey<(payload: ClipboardCopiedEvent) => void>;

export interface NodeSelectedEvent {
  path: string;
}

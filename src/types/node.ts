/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { ErrorObject } from 'ajv';
import { AST, Enumeration, Interface, Namespace, Struct, Property, Typedef, Event, Method } from './ifex-core';

export type NodeType = 'api' | 'namespace' | 'interface' | 'wrapper' | LeafNodeType; // TODO: consider renaming type api to layer

export type LeafNodeType = 'event' | 'method' | 'enumeration' | 'struct' | 'typedef' | 'property';

export interface IFEXTreeModelNode {
  id: string;
  type: NodeType;
  node: AST | Enumeration | Event | Interface | Method | Namespace | Struct | Property | Typedef;
  children?: IFEXTreeModelNode[];
  validationErrors?: ErrorObject[];
}

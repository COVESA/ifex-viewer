/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

/**
 * This file can be used to validate IFEX Core IDL files, which are normally written in YAML, not JSON.
 * The schema is not the source-of-truth but an artifact generated from the source-of-truth, so it should be consistent
 */

export type IFEXCoreIDL = AST;

export interface AST {
  name?: string;
  description?: string;
  major_version?: number;
  minor_version?: number;
  includes?: Include[];
  namespaces?: Namespace[];
  filetype?: string;
  schema?: string;
}

export interface Include {
  file: string;
  description?: string;
}

export interface Namespace {
  name: string;
  description?: string;
  major_version?: number;
  minor_version?: number;
  version_label?: string;
  events?: Event[];
  methods?: Method[];
  typedefs?: Typedef[];
  includes?: Include[];
  structs?: Struct[];
  enumerations?: Enumeration[];
  properties?: Property[];
  namespaces?: Namespace[];
  interface?: Interface;
}

export interface Interface {
  name: string;
  description?: string;
  major_version?: number;
  minor_version?: number;
  version_label?: string;
  events?: Event[];
  methods?: Method[];
  typedefs?: Typedef[];
  includes?: Include[];
  structs?: Struct[];
  enumerations?: Enumeration[];
  properties?: Property[];
  namespaces?: Namespace[];
}

export interface Event {
  name: string;
  description?: string;
  input?: Argument[];
}

export interface Argument {
  name: string;
  datatype: string;
  description?: string;
  arraysize?: number;
  range?: string;
}

export interface Method {
  name: string;
  description?: string;
  errors?: Error[];
  input?: Argument[];
  output?: Argument[];
  returns?: Argument[];
}

export interface Error {
  datatype: string;
  name?: string;
  description?: string;
  arraysize?: number;
  range?: string;
}

export interface Typedef {
  name: string;
  datatype?: string;
  datatypes?: string[];
  description?: string;
  arraysize?: number;
  min?: number;
  max?: number;
}

export interface Struct {
  name: string;
  description?: string;
  members?: Member[];
}

export interface Member {
  name: string;
  datatype: string;
  description?: string;
  arraysize?: number;
}

export interface Enumeration {
  name: string;
  datatype: string;
  options: Option[];
  description?: string;
}

export interface Option {
  name: string;
  value: number | string;
  description?: string;
}

export interface Property {
  name: string;
  datatype: string;
  description?: string;
  arraysize?: number;
}

export interface ASTWithCustomProperties extends AST {
  [key: string]: unknown;
}

export interface NamespaceWithCustomProperties extends Namespace {
  [key: string]: unknown;
}

export interface InterfaceWithCustomProperties extends Interface {
  [key: string]: unknown;
}

export interface EventWithCustomProperties extends Event {
  [key: string]: unknown;
}

export interface MethodWithCustomProperties extends Method {
  [key: string]: unknown;
}

export interface TypedefWithCustomProperties extends Typedef {
  [key: string]: unknown;
}

export interface StructWithCustomProperties extends Struct {
  [key: string]: unknown;
}

export interface EnumerationWithCustomProperties extends Enumeration {
  options: OptionWithCustomProperties[];
  [key: string]: unknown;
}

export interface PropertyWithCustomProperties extends Property {
  [key: string]: unknown;
}

export interface ErrorWithCustomProperties extends Error {
  [key: string]: unknown;
}

export interface ArgumentWithCustomProperties extends Argument {
  [key: string]: unknown;
}

export interface OptionWithCustomProperties extends Option {
  [key: string]: unknown;
}

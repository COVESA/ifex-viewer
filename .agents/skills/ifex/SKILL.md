---
name: ifex
description: Knowledge of the IFEX Core IDL (Interface Exchange format, a.k.a. ifex-core / Vehicle Service Catalog format) — the YAML-based interface description language that this project's viewer renders. Use this skill whenever working with IFEX spec files (.yaml/.json), the IFEX JSON Schema (src/types/ifex-core-schema.json), the IFEX AST types (src/types/ifex-core.ts), or any task that involves parsing, validating, merging, or displaying namespaces, interfaces, methods, events, properties, typedefs, structs, enumerations, or layers/overlays/deployment files. Also use when the user mentions IFEX, "Vehicle Service Catalog", VSC, or asks what a given IFEX YAML construct means.
---

# IFEX Core IDL

IFEX (Interface Exchange) is a YAML-based Interface Description Language for
defining APIs, independent of programming language, transport protocol, or
target environment. It is the format this project's `<ifex-viewer>` web
component parses and renders. Full authoritative docs:

- Core spec (structure, node types, versioning): https://covesa.github.io/ifex/specification/
- Developer manual (mappings, generators, layer types): https://covesa.github.io/ifex/developers-manual/
- FAQ (layers/overlays terminology): https://covesa.github.io/ifex/faq/
- Machine-readable schema for the current repo: [ifex-core-schema.json](../../../src/types/ifex-core-schema.json)
- TypeScript AST types mirroring the schema: [ifex-core.ts](../../../src/types/ifex-core.ts)

When you need exact field names/optionality for a node type, check the JSON
schema (`src/types/ifex-core-schema.json`) of the
core spec over guessing — the schema is generated from the source-of-truth
AST and is authoritative for this repo.

## File shape

Every IFEX YAML file's root is an **AST**/`Namespace`-like object with a
mandatory `name` and, optionally, `description`, `major_version`,
`minor_version`, `includes`, and `namespaces` (a list of top-level
`Namespace` objects). There is no top-level `service:` keyword (removed from
the language).

## Core concepts (node types)

| Node | Purpose | Key fields |
|---|---|---|
| **Namespace** | Logical grouping of methods/events/properties/types; can nest arbitrarily deep; isolates names from sibling namespaces | `name` (req), `description`, `major_version`, `minor_version`, `version_label`, `events`, `methods`, `typedefs`, `structs`, `enumerations`, `properties`, `namespaces`, `includes`, `interface` |
| **Interface** | The "public API" subset of a Namespace's contents; does NOT introduce a new visibility level; only one per Namespace; cannot nest another Interface | Same optional fields as Namespace, minus `interface` itself |
| **Method** | An RPC — has input/output/return params and errors; reliable/guaranteed delivery | `name` (req), `description`, `input[]`, `output[]`, `returns[]`, `errors[]` |
| **Event** | Fire-and-forget message, no return value, no delivery guarantee | `name` (req), `description`, `input[]` |
| **Property** | An observable, gettable/settable/subscribable shared data item (≈ a VSS signal) | `name`, `datatype` (req), `description`, `arraysize` |
| **Argument** | An input/output/return parameter of a Method or Event | `name`, `datatype` (req), `description`, `arraysize`, `range` |
| **Error** | A named error return type for a Method (multiple independent error types allowed, unlike a single enum) | `datatype` (req), `name`, `description`, `arraysize`, `range` |
| **Struct** / **Member** | Aggregate/composite data type and its fields | Struct: `name` (req), `description`, `members[]`. Member: `name`, `datatype` (req), `description`, `arraysize` |
| **Enumeration** / **Option** | Named set of integer/string-valued options | Enumeration: `name`, `datatype`, `options[]` (req); Option: `name`, `value` (req) |
| **Typedef** | Alias/constrained type, or a variant type via `datatypes` (list, mutually exclusive with `datatype`) | `name` (req), `datatype` OR `datatypes[]`, `description`, `arraysize`, `min`, `max` |
| **Include** | Merges another IFEX file's structs/typedefs/enumerations/methods/events/properties into the hosting namespace | `file` (req), `description` |

Fundamental (primitive) types (same as VSS): `uint8`, `int8`, `uint16`,
`int16`, `uint32`, `int32`, `uint64`, `int64`, `boolean`, `float`, `double`,
`string`.

## Layers, overlays, and deployment files

IFEX keeps the core interface description generic and pushes
target/protocol-specific detail into separate **layer** files:

- **Layer Type**: a category of extra metadata (e.g. a D-Bus or SOME/IP
  mapping), usually with its own schema, documented in the developer manual.
- **Layer instance**: an actual file conforming to a Layer Type's schema.
- **Overlay**: a layer file using the *same* schema as an original IFEX file,
  which extends or redefines parts of it (e.g. adding a parameter to an
  existing event, or narrowing a typedef's range). Tools typically merge
  same-named list objects recursively and apply "last file wins" for
  conflicting scalar values, but this is tool-defined behavior, not part of
  the core spec.
- **Deployment layer**: a layer that adds environment-specific keys (e.g.
  `dbus_interface`) that are not valid in plain IFEX Core IDL.

This project's `utils/merge-layers` and `utils/specification-parser`
implement this merge behavior for the viewer — check those before assuming
layer-merge semantics.

## Versioning

Namespaces and Interfaces may declare `major_version`, `minor_version`, and a
free-form `version_label`, following Semantic Versioning: minor bumps =
backward-compatible additions, major bumps = breaking changes. Avoid
`patch_version` in new designs (see spec's Interface Versioning chapter for
rationale).

## When you need more detail

- Exact required/optional fields for a node → read the relevant
  `definitions.<NodeName>` entry in [ifex-core-schema.json](../../../src/types/ifex-core-schema.json).
- How a concept should be modeled in ambiguous cases (e.g. Method vs. Event
  vs. Property, sync vs. async, streaming) → fetch the "Feature concept
  details" / "Data Streams" sections of the core specification.
- Target-specific mapping (D-Bus, Protobuf/gRPC, datatype mapping, generators)
  → fetch the developer manual's "Mapping documents" pages.
- Terminology disputes (layer vs. overlay vs. layer type vs. layer
  specification) → fetch the FAQ.

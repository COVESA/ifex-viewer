# IFEX Viewer — Copilot Instructions

## Purpose
IFEX Viewer is a framework-agnostic **Web Component** (published as `@covesa/ifex-viewer` on npm) that renders IFEX Core IDL API specifications.

## Structure
- `src/` — the actual library (Vue 3 + TypeScript), built into the distributable web component.
- `docs/` — VitePress documentation site (guide/API/examples) plus an interactive Playground demo. Not library code.
- `e2e/angular`, `e2e/react`, `e2e/vue` — minimal sample host apps used only to verify the web component embeds correctly in each framework. Not library or app code to feature-develop.

## Data flow (src/)
1. Raw spec files (yaml/json + filename) are passed into `<ifex-viewer>` via the `specifications` prop.
2. `utils/specification-parser` parses raw content into typed spec items.
3. `utils/merge-layers` merges core + custom/deployment layers.
4. `model/specification-model.ts` validates each layer against the IFEX JSON Schema (Ajv) and builds an `IFEXTreeModelNode` tree.
5. Pinia stores (`stores/`) hold state that is **shared across the whole app** (e.g. the viewer model). Never put component-local state in a store.
6. `components/` render the UI from the store/model (e.g. `sidenav`, `breadcrumbs`, `detail-pages/<element-type>`).

## Component convention
Every component consists of three files: the `.vue` component, a `.spec.ts` unit test, and a `.stories.ts` file covering its most important states.

## Testing
- **Unit tests (Vitest, `*.spec.ts`)**: must cover happy, error, and edge cases. (Detailed unit-testing guide will live in a separate rules file.)
- **`App.spec.ts`**: integration tests for whole-application flows.
- **Storybook (`*.stories.ts`)**: documents/visualizes component states.
- **Playwright (`e2e/`)**: only tests conditions passed from outside (e.g. layout info) and the most important happy flows — nothing else.

## Code style
TypeScript strict mode is enabled; respect ESLint rules. (Detailed style rules will live in a separate rules file.)

## Constraints
- Must remain a framework-agnostic Web Component — no assumptions that break when embedded in Angular/React/Vue hosts.
- The public API (`specifications`) is published to npm and must stay backward compatible.

## Commands
- Dev server: `pnpm storybook` (do **not** use `pnpm dev`).
- Unit tests: `pnpm test`
- E2E tests: `pnpm playwright`
- Lint: `pnpm lint`
- Typecheck: `vue-tsc -b --noEmit`

## Commits
- Commits must be signed off per DCO (`git commit -s`, adding a `Signed-Off-By:` line).
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages.

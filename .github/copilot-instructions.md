# Copilot Instructions for IFEX Viewer

## Project Overview
- **IFEX Viewer** is a web component for visualizing API specifications defined in the Interface Exchange Framework (IFEX Core IDL).
- Built primarily with **Vue 3**, **TailwindCSS**, and **Storybook**. See `src/` for main code, and `docs/` for documentation.
- The viewer is framework-agnostic and can be embedded in any web project as a custom element (`<ifex-viewer>`).

## Architecture & Key Patterns
- **src/** contains the main Vue component (`App.vue`), composables, stores, and utility modules. Major subcomponents are in `src/components/` (e.g., `breadcrumbs/`, `detail-pages/`, `sidenav/`).
- **Data Flow:** API specifications are passed as a `specifications` property to the viewer. Parsing and rendering logic is in `src/model/` and `src/utils/`.
- **Layer Support:** The viewer supports custom and deployment layers in IFEX specs. See `src/utils/merge-layers/` and related detail page components.
- **Testing:**
  - Unit tests: Vitest (`*.spec.ts` in `src/`)
  - E2E tests: Playwright (`e2e/` folder, with example apps for React, Vue, Angular)
- **Storybook:** Stories for components are in `*.stories.ts` files (e.g., `src/App.stories.ts`).

## Developer Workflows
- **Install dependencies:**
  - `pnpm install` (preferred)
  - Or use `npm`/`yarn` as needed
- **Build:**
  - `pnpm build` or `npm run build` (uses Vite)
- **Dev server:**
  - `pnpm dev` or `npm run dev` (Vite dev server)
- **Test:**
  - Unit: `pnpm test` or `npm run test` (Vitest)
  - E2E: `pnpm e2e` or run Playwright manually
- **Lint:**
  - `pnpm lint` or `npm run lint` (ESLint config in root)

## Conventions & Patterns
- **TypeScript:** All source is typed; types are in `src/types.ts` and `src/types/`.
- **Component Structure:**
  - Use composition API and organize logic in composables (`src/composables/`).
  - Shared UI elements in `src/components/shared/components/`.
- **Testing:**
  - Place unit tests next to source files (`*.spec.ts`).
  - E2E apps (`e2e/react/`, `e2e/vue/`, `e2e/angular/`) are minimal wrappers for integration testing.
- **Documentation:**
  - Main docs in `docs/` (see `docs/guide/` for usage and integration).

## Integration Points
- **External:**
  - Consumes IFEX Core IDL specs (see [IFEX Spec](https://covesa.github.io/ifex/ifex-specification)).
  - Can be used as an npm package: `@covesa/ifex-viewer`.
- **Internal:**
  - Uses Vue, TailwindCSS, and Storybook for development and documentation.

## References
- Main entry: `src/main.ts`, `src/App.vue`
- Example usage: See README and docs/guide/
- Contribution: See `CONTRIBUTING.md`

---
For questions, see `MAINTAINERS.md` or open an issue.

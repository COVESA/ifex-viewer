---
paths: ['**/*.spec.ts']
applyTo: '**/*.spec.ts'
description: 'Use when generating or editing unit test files. Covers Testing Library patterns, project-specific test helpers, and mocking rules.'
---

# Unit Test Coding Instructions

Follow these rules when generating or editing test files in this project.

---

## 1. Testing philosophy

Every test must answer: **Does the software work as its user expects?**

Write tests against the public, observable interface used by the relevant user:

- **UI components:** interact like an end user (rendered output, accessible controls, visible feedback).
- **Public utilities/composables:** call the public API and assert returned values/errors.
- **Service boundaries:** assert request/response behavior and externally visible effects.

Never create a "test-only user" that can access internals real users do not see.

### Design heuristic

Before each assertion, answer:

1. Who is the user of this behavior?
2. What action or input can that user provide?
3. What outcome can that user observe?
4. Would this test still pass after a behavior-preserving refactor?

If an assertion needs knowledge the relevant user does not have (private state, helper internals, lifecycle hooks), you are testing implementation details — rewrite it.

### Refactor resilience

A good test:

- **Fails** when behavior is broken.
- **Passes** when internals are reorganized but behavior is unchanged.

---

## 2. Test file naming and location

- Format: `{ComponentName}.spec.ts`
- Location: same directory as the file under test.

---

## 3. Test structure and naming

- Every `it()` description must start with `should`.
- Use flat `describe` for simple components. Nest by behavior/state for complex ones:

```typescript
describe('MyComponent', () => {
  describe('when user is admin', () => {
    it('should show the delete button', () => {});
    it('should allow bulk actions', () => {});
  });

  describe('when API returns an error', () => {
    it('should show error notification', () => {});
  });
});
```

---

## 4. renderComponent pattern

Always use the `renderComponent` pattern with the `getTestOptions` test options helper:

```typescript
import { render, screen } from '@testing-library/vue';
import { getTestOptions } from './tests/base-test-options';
import { ComponentProps } from './ComponentName.vue';

const defaultProps: ComponentProps = {
  appId: 'test-app-id',
  isActive: true,
};

const renderComponent = (props: Partial<ComponentProps> = {}) => {
  const { options, i18n, user } = getTestOptions({
    pinia: true,
    stubs: { RouterLink: true },
  });

  render(ComponentName, {
    ...options,
    props: { ...defaultProps, ...props },
  });

  return { i18n, user };
};
```

- Define a `defaultProps` object with sensible defaults for happy-path tests.
- Accept `Partial<Props>` to override individual props per test.
- Never set component internals (state, refs, internal methods) directly — drive behavior through props, route/state setup, and user interaction.
- Avoid adding setup within `beforeEach` unless it is not possible to do so in `renderComponent`.¸

---

## 5. Testing Library queries

Prefer user-observable queries in this order:

1. `getByRole` (with `name`) — buttons, textboxes, headings
2. `getByLabelText` — form fields
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` — **last resort**

Rules:

- Never use `querySelector`, class selectors, tag selectors, or DOM-traversal assertions.
- Use `findBy*` for elements that appear asynchronously.
- Use `queryBy*` only to assert an element does **not** exist.
- Use `within()` for scoped queries inside a specific container.

```typescript
import { within } from '@testing-library/vue';

const row = screen.getByTestId('row-1');
expect(within(row).getByText('Active')).toBeInTheDocument();
```

---

## 6. Mocking boundaries — what NOT to mock

**Never mock child UI components.** Render the full component tree and assert on what the user sees.

Acceptable stubs (only these):

- `RouterLink`, `RouterView` — navigation targets outside the page
- Heavy third-party components that break jsdom (map widgets, rich-text editors)

Do not assert internal orchestration ("helper X was called once with Y") when the meaningful behavior is observable through public outcomes.

---

## 7. Testing composables

### Reactive composables (need Vue provide/inject or component lifecycle)

```typescript
import { render } from '@testing-library/vue';
import { defineComponent } from 'vue';

const renderComposable = () => {
  const { options } = getTestOptions({ pinia: true, vueQuery: true });
  let composable: ReturnType<typeof useMyComposable> | undefined;

  const TestComponent = defineComponent({
    setup() {
      composable = useMyComposable();
      return {};
    },
    template: '<span />',
  });

  render(TestComponent, options);
  return { composable: composable! };
};

describe('useMyComposable', () => {
  it('should compute result correctly', () => {
    const { composable } = renderComposable();
    expect(composable.vm.computeResult(input)).toEqual(expected);
  });
});
```

### Pure/stateless composables (no Vue reactivity dependencies)

Call directly — no wrapper needed:

```typescript
const { computeResult } = useMyHelper();
expect(computeResult(input)).toEqual(expected);
```

---

## 8. User interactions

Always use the `user` object returned by the test options helper. Never import `userEvent` from `@testing-library/user-event` directly.

```typescript
const { user } = renderComponent();
await user.type(screen.getByRole('textbox', { name: i18n.global.t('form.name') }), 'My Value');
await user.click(screen.getByRole('button', { name: i18n.global.t('common.submit') }));
```

---

## 9. Parameterized tests

Use `it.each` for testing multiple input/output combinations:

```typescript
it.each<{ input: string; expected: Status }>([
  { input: 'active', expected: Status.ACTIVE },
  { input: 'draft', expected: Status.DRAFT },
])('should map "$input" to $expected', ({ input, expected }) => {
  expect(mapStatus(input)).toBe(expected);
});
```

---

## 10. Validation

After generating tests, run the following commands to validate:

```bash
pnpm test
pnpm lint
pnpm vue-tsc -b --noEmit
```

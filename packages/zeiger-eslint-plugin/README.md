# zeiger-eslint-plugin

ESLint plugin for [Zeiger](https://www.npmjs.com/package/zeiger) - ensures proper usage of Zeiger hooks with dependency arrays.

Zeiger is a library for creating memoized collection item selectors for [Zustand](https://github.com/pmndrs/zustand) that eliminates unnecessary re-renders. This ESLint plugin helps you use Zeiger correctly by catching common mistakes with dependency arrays.

## Installation

```bash
npm install --save-dev zeiger-eslint-plugin
# or
pnpm add -D zeiger-eslint-plugin
# or
yarn add -D zeiger-eslint-plugin
```

## Usage

### Flat Config (ESLint 9+)

```js
import zeigerPlugin from 'zeiger-eslint-plugin';

export default [
  {
    plugins: {
      zeiger: zeigerPlugin,
    },
    rules: {
      ...zeigerPlugin.configs.recommended.rules,
    },
  },
];
```

### Legacy Config (ESLint 8)

```json
{
  "plugins": ["zeiger"],
  "extends": ["plugin:zeiger/recommended"]
}
```

## Rules

### `zeiger/zeiger-deps`

Ensures that Zeiger hooks created with `createCollectionPointer` or `createCollectionItemPointer` have:

1. Non-empty dependency arrays
2. All listed dependencies are actually used in the code

#### Examples

**❌ Empty dependency array:**

```tsx
const useUsersPointer = createCollectionPointer(useStore, 'users');
const users = useUsersPointer([]); // Error: dependency array must not be empty
```

**❌ Unused dependency:**

```tsx
const useUserPointer = createCollectionItemPointer(useStore, 'users', 'id');
const user = useUserPointer('1', ['firstName', 'surname', 'email']);

// Only firstName and email are used
return (
  <div>
    {user?.firstName} - {user?.email}
  </div>
);
// Error: Property 'surname' is listed in dependency array but not used
```

**✅ Correct usage:**

```tsx
const useUserPointer = createCollectionItemPointer(useStore, 'users', 'id');
const user = useUserPointer('1', ['firstName', 'email']);

return (
  <div>
    {user?.firstName} - {user?.email}
  </div>
);
```

## Autofix

The plugin supports automatic fixing of unused dependencies. When you run ESLint with the `--fix` flag, it will automatically remove unused properties from dependency arrays:

```bash
eslint --fix .
```

**Example:**

```tsx
// Before
const user = useUserPointer('1', ['firstName', 'surname', 'email']);
return (
  <div>
    {user?.firstName} - {user?.email}
  </div>
);

// After autofix
const user = useUserPointer('1', ['firstName', 'email']);
return (
  <div>
    {user?.firstName} - {user?.email}
  </div>
);
```

## Why This Plugin?

Zeiger hooks use dependency arrays to specify which properties to subscribe to. This plugin helps you:

- **Avoid unnecessary subscriptions** - Catch unused properties in dependency arrays
- **Prevent empty arrays** - Ensure you're always subscribing to at least one property
- **Maintain code quality** - Keep your Zeiger hooks clean and efficient
- **Automatic fixes** - Remove unused dependencies with ESLint's autofix feature

## License

MIT

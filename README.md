# Zeiger

Fine-grained, memoized collection selectors for [Zustand](https://github.com/pmndrs/zustand). Subscribe only to what you need and avoid unnecessary re-renders.

## Packages

| Package                                                     | Description                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [**zeiger**](./packages/zeiger)                             | Core library. Create collection and collection-item pointers for fine-grained reactivity in Zustand stores.      |
| [**zeiger-eslint-plugin**](./packages/zeiger-eslint-plugin) | ESLint plugin. Enforces correct use of Zeiger hooks (non-empty deps, no unused properties) with autofix support. |

## Development

```bash
pnpm install
pnpm build
pnpm test
```

See individual package READMEs for usage and API details.

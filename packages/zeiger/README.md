# Zeiger

Simplified memoized collection item selectors for [Zustand](https://github.com/pmndrs/zustand).

Zeiger eliminates unnecessary re-renders when working with collections in Zustand stores by providing fine-grained, memoized selectors that only trigger updates when the specific properties you care about actually change.

## Installation

```bash
npm install zeiger zustand
```

```bash
pnpm add zeiger zustand
```

```bash
yarn add zeiger zustand
```

## The Problem

When working with collections in Zustand, selecting items often causes unnecessary re-renders:

```tsx
// This re-renders whenever ANY property of ANY todo changes
const todos = useStore((state) => state.todos);

// Even with shallow comparison, changes to unrelated properties cause re-renders
const todos = useStore((state) => state.todos, shallow);
```

## The Solution

Zeiger provides pointer factories that create memoized selectors, only re-rendering when the specific properties you depend on change:

```tsx
// Only re-renders when 'id' or 'title' of any todo changes
const todos = useTodosPointer(['id', 'title']);

// Only re-renders when 'completed' of this specific todo changes
const todo = useTodoItemPointer('todo-1', ['completed']);
```

## API Reference

### `createCollectionPointer`

Creates a hook for selecting multiple items from a collection with fine-grained reactivity.

```ts
function createCollectionPointer<Store, CollectionKey>(
  store: Store,
  collectionKey: CollectionKey
): (
  deps: PropertyKey[],
  filterFn?: (item: Item, state: State) => boolean
) => Pick<Item, Dep>[];
```

#### Parameters

| Parameter       | Type                         | Description                                 |
| --------------- | ---------------------------- | ------------------------------------------- |
| `store`         | `UseBoundStore<StoreApi<S>>` | Your Zustand store                          |
| `collectionKey` | `keyof State`                | The key of the array property in your store |

#### Returns

A hook function that accepts:

| Parameter  | Type                       | Description                                |
| ---------- | -------------------------- | ------------------------------------------ |
| `deps`     | `(keyof Item)[]`           | Array of property keys to select and track |
| `filterFn` | `(item, state) => boolean` | Optional filter function                   |

#### Example

```tsx
import { create } from 'zustand';
import { createCollectionPointer } from 'zeiger';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

interface Store {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const useStore = create<Store>(() => ({
  todos: [],
  filter: 'all',
}));

// Create the pointer
const useTodosPointer = createCollectionPointer(useStore, 'todos');

// In your component
function TodoList() {
  // Only re-renders when 'id' or 'title' changes
  const todos = useTodosPointer(['id', 'title']);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

// With filtering
function ActiveTodoList() {
  const activeTodos = useTodosPointer(
    ['id', 'title'],
    (todo) => !todo.completed
  );

  return (
    <ul>
      {activeTodos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

---

### `createCollectionItemPointer`

Creates a hook for selecting a single item from a collection by its unique identifier.

```ts
function createCollectionItemPointer<Store, CollectionKey, UniqueKey>(
  store: Store,
  collectionKey: CollectionKey,
  itemUniqueKey: UniqueKey
): (
  itemUniqueValue: string,
  deps: PropertyKey[]
) => Pick<Item, Dep> | undefined;
```

#### Parameters

| Parameter       | Type                         | Description                                  |
| --------------- | ---------------------------- | -------------------------------------------- |
| `store`         | `UseBoundStore<StoreApi<S>>` | Your Zustand store                           |
| `collectionKey` | `keyof State`                | The key of the array property in your store  |
| `itemUniqueKey` | `keyof Item`                 | The property used to uniquely identify items |

#### Returns

A hook function that accepts:

| Parameter         | Type             | Description                                |
| ----------------- | ---------------- | ------------------------------------------ |
| `itemUniqueValue` | `string`         | The unique identifier value of the item    |
| `deps`            | `(keyof Item)[]` | Array of property keys to select and track |

Returns `undefined` if the item is not found.

#### Example

```tsx
import { create } from 'zustand';
import { createCollectionItemPointer } from 'zeiger';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

interface Store {
  todos: Todo[];
}

const useStore = create<Store>(() => ({
  todos: [],
}));

// Create the pointer with 'id' as the unique key
const useTodoItemPointer = createCollectionItemPointer(useStore, 'todos', 'id');

// In your component
function TodoItem({ todoId }: { todoId: string }) {
  // Only re-renders when 'title' or 'completed' of THIS todo changes
  const todo = useTodoItemPointer(todoId, ['title', 'completed']);

  if (!todo) return null;

  return (
    <div>
      <span
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      >
        {todo.title}
      </span>
    </div>
  );
}
```

## Benefits

- **Eliminates unnecessary re-renders** - Components only update when their specific dependencies change
- **Fine-grained reactivity** - Select exactly which properties to track per component
- **Type-safe** - Full TypeScript support with autocomplete for collection keys and item properties. The returned object type only includes properties listed in `deps`, so TypeScript will error if you try to access unlisted properties.
- **Minimal API** - Just two functions to learn
- **Built-in filtering** - Filter collections without additional selectors
- **Zero configuration** - Works out of the box with any Zustand store
- **Lightweight** - Tiny bundle size with no external dependencies beyond Zustand

## ESLint Plugin

For the best development experience, use [zeiger-eslint-plugin](https://www.npmjs.com/package/zeiger-eslint-plugin) to automatically catch common mistakes:

- Empty dependency arrays
- Unused properties in dependency arrays

```bash
npm install --save-dev zeiger-eslint-plugin
```

See the [plugin documentation](https://www.npmjs.com/package/zeiger-eslint-plugin) for setup instructions.

## Type Safety

Zeiger is fully typed. When you specify properties in the `deps` array, the returned object is typed to only include those properties. This means TypeScript will catch errors at compile time if you try to access a property that wasn't listed in deps:

```tsx
const useTodosPointer = createCollectionPointer(useStore, 'todos');

function TodoList() {
  const todos = useTodosPointer(['id', 'title']);

  return (
    <ul>
      {todos.map((todo) => (
        // ✅ Works - 'id' and 'title' are in deps
        <li key={todo.id}>{todo.title}</li>

        // ❌ TypeScript Error - 'completed' is not in deps
        // Property 'completed' does not exist on type 'Pick<Todo, "id" | "title">'
        <span>{todo.completed}</span>
      ))}
    </ul>
  );
}
```

This ensures that your component's dependencies are always in sync with what you actually use, preventing subtle bugs where you forget to add a property to deps.

## When to Use Zeiger

Zeiger is particularly useful when:

- You have large collections where items update frequently
- Different components need different properties from the same collection
- You want to optimize list rendering performance
- You need to select individual items by ID without re-rendering the entire list

## License

MIT

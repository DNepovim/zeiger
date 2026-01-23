import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';
import { createCollectionItemPointer } from './createCollectionItemPointer';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  priority: number;
}

interface Store {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

const createTestStore = (initialTodos: Todo[] = []) =>
  create<Store>((set) => ({
    todos: initialTodos,
    addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
    removeTodo: (id) =>
      set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
    toggleTodo: (id) =>
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      })),
    updateTodo: (id, updates) =>
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
  }));

describe('createCollectionItemPointer', () => {
  it('should return undefined for non-existent item', () => {
    const useStore = createTestStore([]);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('non-existent', ['id', 'title'])
    );

    expect(result.current).toBeUndefined();
  });

  it('should return selected properties from item', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
      {
        id: '2',
        title: 'Second',
        completed: true,
        description: 'Desc 2',
        priority: 2,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('1', ['id', 'title'])
    );

    expect(result.current).toEqual({ id: '1', title: 'First' });
  });

  it('should find correct item by unique key', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
      {
        id: '2',
        title: 'Second',
        completed: true,
        description: 'Desc 2',
        priority: 2,
      },
      {
        id: '3',
        title: 'Third',
        completed: false,
        description: 'Desc 3',
        priority: 3,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('2', ['title', 'completed'])
    );

    expect(result.current).toEqual({ title: 'Second', completed: true });
  });

  it('should select single property', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() => useTodoItemPointer('1', ['completed']));

    expect(result.current).toEqual({ completed: false });
  });

  it('should update when relevant properties change', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('1', ['title', 'completed'])
    );

    expect(result.current).toEqual({ title: 'First', completed: false });

    act(() => {
      useStore.getState().toggleTodo('1');
    });

    expect(result.current).toEqual({ title: 'First', completed: true });
  });

  it('should not update when non-selected properties change', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useTodoItemPointer('1', ['id', 'title']);
    });

    const initialRenderCount = renderCount;
    expect(result.current).toEqual({ id: '1', title: 'First' });

    act(() => {
      useStore.getState().updateTodo('1', { description: 'New description' });
    });

    // Should not cause a re-render since description is not in deps
    expect(renderCount).toBe(initialRenderCount);
    expect(result.current).toEqual({ id: '1', title: 'First' });
  });

  it('should return undefined when item is removed', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('1', ['id', 'title'])
    );

    expect(result.current).toEqual({ id: '1', title: 'First' });

    act(() => {
      useStore.getState().removeTodo('1');
    });

    expect(result.current).toBeUndefined();
  });

  it('should find item when it is added', () => {
    const useStore = createTestStore([]);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    const { result } = renderHook(() =>
      useTodoItemPointer('1', ['id', 'title'])
    );

    expect(result.current).toBeUndefined();

    act(() => {
      useStore.getState().addTodo({
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      });
    });

    expect(result.current).toEqual({ id: '1', title: 'First' });
  });

  it('should not update when other items change', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'First',
        completed: false,
        description: 'Desc 1',
        priority: 1,
      },
      {
        id: '2',
        title: 'Second',
        completed: false,
        description: 'Desc 2',
        priority: 2,
      },
    ];
    const useStore = createTestStore(todos);
    const useTodoItemPointer = createCollectionItemPointer(
      useStore,
      'todos',
      'id'
    );

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useTodoItemPointer('1', ['title', 'completed']);
    });

    const initialRenderCount = renderCount;
    expect(result.current).toEqual({ title: 'First', completed: false });

    act(() => {
      useStore.getState().updateTodo('2', { title: 'Updated Second' });
    });

    // Should not cause a re-render since item '2' changed, not item '1'
    expect(renderCount).toBe(initialRenderCount);
    expect(result.current).toEqual({ title: 'First', completed: false });
  });

  it('should work with different unique key types', () => {
    interface Product {
      sku: string;
      name: string;
      price: number;
    }

    interface ProductStore {
      products: Product[];
    }

    const useProductStore = create<ProductStore>(() => ({
      products: [
        { sku: 'ABC123', name: 'Widget', price: 9.99 },
        { sku: 'DEF456', name: 'Gadget', price: 19.99 },
      ],
    }));

    const useProductPointer = createCollectionItemPointer(
      useProductStore,
      'products',
      'sku'
    );

    const { result } = renderHook(() =>
      useProductPointer('DEF456', ['name', 'price'])
    );

    expect(result.current).toEqual({ name: 'Gadget', price: 19.99 });
  });
});

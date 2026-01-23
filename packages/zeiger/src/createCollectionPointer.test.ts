import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';
import { createCollectionPointer } from './createCollectionPointer';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  priority: number;
}

interface Store {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (todo: Todo) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

const createTestStore = (initialTodos: Todo[] = []) =>
  create<Store>((set) => ({
    todos: initialTodos,
    filter: 'all',
    addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
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
    setFilter: (filter) => set({ filter }),
  }));

describe('createCollectionPointer', () => {
  it('should return empty array for empty collection', () => {
    const useStore = createTestStore([]);
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() => useTodosPointer(['id', 'title']));

    expect(result.current).toEqual([]);
  });

  it('should return selected properties from all items', () => {
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() => useTodosPointer(['id', 'title']));

    expect(result.current).toEqual([
      { id: '1', title: 'First' },
      { id: '2', title: 'Second' },
    ]);
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() => useTodosPointer(['completed']));

    expect(result.current).toEqual([{ completed: false }]);
  });

  it('should filter items when filterFn is provided', () => {
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() =>
      useTodosPointer(['id', 'title'], (todo) => !todo.completed)
    );

    expect(result.current).toEqual([
      { id: '1', title: 'First' },
      { id: '3', title: 'Third' },
    ]);
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() => useTodosPointer(['id', 'title']));

    expect(result.current).toEqual([{ id: '1', title: 'First' }]);

    act(() => {
      useStore.getState().updateTodo('1', { title: 'Updated' });
    });

    expect(result.current).toEqual([{ id: '1', title: 'Updated' }]);
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useTodosPointer(['id', 'title']);
    });

    const initialRenderCount = renderCount;
    expect(result.current).toEqual([{ id: '1', title: 'First' }]);

    act(() => {
      useStore.getState().updateTodo('1', { description: 'New description' });
    });

    // Should not cause a re-render since description is not in deps
    expect(renderCount).toBe(initialRenderCount);
    expect(result.current).toEqual([{ id: '1', title: 'First' }]);
  });

  it('should update when collection length changes', () => {
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() => useTodosPointer(['id']));

    expect(result.current).toEqual([{ id: '1' }]);

    act(() => {
      useStore.getState().addTodo({
        id: '2',
        title: 'Second',
        completed: false,
        description: 'Desc 2',
        priority: 2,
      });
    });

    expect(result.current).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should filter using state in filterFn', () => {
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
    const useTodosPointer = createCollectionPointer(useStore, 'todos');

    const { result } = renderHook(() =>
      useTodosPointer(['id', 'title'], (todo, state) => {
        if (state.filter === 'all') return true;
        if (state.filter === 'active') return !todo.completed;
        return todo.completed;
      })
    );

    expect(result.current).toEqual([
      { id: '1', title: 'First' },
      { id: '2', title: 'Second' },
    ]);

    act(() => {
      useStore.getState().setFilter('completed');
    });

    expect(result.current).toEqual([{ id: '2', title: 'Second' }]);
  });
});

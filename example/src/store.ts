import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createCollectionPointer, createCollectionItemPointer } from 'zeiger';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface StoreState {
  users: User[];
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
}

export const useStore = create<StoreState>()(
  immer((set) => ({
    users: [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'Developer',
        department: 'Engineering',
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'Designer',
        department: 'Product',
      },
      {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'Manager',
        department: 'Operations',
      },
      {
        id: '4',
        name: 'Diana Ross',
        email: 'diana@example.com',
        role: 'Analyst',
        department: 'Finance',
      },
      {
        id: '5',
        name: 'Edward Norton',
        email: 'edward@example.com',
        role: 'Developer',
        department: 'Engineering',
      },
    ],
    updateUser: (id, updates) =>
      set((state) => {
        const user = state.users.find((u) => u.id === id);
        if (user) {
          Object.assign(user, updates);
        }
      }),
  }))
);

// Create zeiger pointers for optimized selections
export const useUsersPointer = createCollectionPointer(useStore, 'users');
export const useUserPointer = createCollectionItemPointer(
  useStore,
  'users',
  'id'
);

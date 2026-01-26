import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createCollectionPointer, createCollectionItemPointer } from 'zeiger';

export interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  role: string;
  department: string;
}

interface StoreState {
  users: User[];
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
}

export const useUsersStore = create<StoreState>()(
  immer((set) => ({
    users: [
      {
        id: '1',
        firstName: 'Alice',
        surname: 'Johnson',
        email: 'alice@example.com',
        role: 'Developer',
        department: 'Engineering',
      },
      {
        id: '2',
        firstName: 'Bob',
        surname: 'Smith',
        email: 'bob@example.com',
        role: 'Designer',
        department: 'Product',
      },
      {
        id: '3',
        firstName: 'Charlie',
        surname: 'Brown',
        email: 'charlie@example.com',
        role: 'Manager',
        department: 'Operations',
      },
      {
        id: '4',
        firstName: 'Diana',
        surname: 'Ross',
        email: 'diana@example.com',
        role: 'Analyst',
        department: 'Finance',
      },
      {
        id: '5',
        firstName: 'Edward',
        surname: 'Norton',
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

export const useUsersPointer = createCollectionPointer(useUsersStore, 'users');
export const useUserPointer = createCollectionItemPointer(
  useUsersStore,
  'users',
  'id'
);

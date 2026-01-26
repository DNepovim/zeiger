import { useUsersStore } from '../../usersStore';
import { UserRow } from './UserRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function UserList() {
  const users = useUsersStore((state) => state.users);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Users List (Zustand)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Watch the render counts - each cell subscribes using plain zustand. When
        you edit a user's name, notice how more cells rerender compared to
        zeiger. The number in parentheses shows each cell's render count.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} userId={user.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useUsersPointer } from '../../usersStore';
import { UserRow } from './UserRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function UserList() {
  const users = useUsersPointer(['id']);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Users List (Zeiger)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Watch the render counts - each cell subscribes only to its specific
        field using zeiger! When you edit a user's name, only the name cell
        rerenders. The number in parentheses shows each cell's render count.
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
          {users.map((user: { id: string }) => (
            <UserRow key={user.id} userId={user.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useUserPointer } from '../../usersStore';
import { NameCell } from './NameCell';
import { EmailCell } from './EmailCell';
import { RoleCell } from './RoleCell';
import { DepartmentCell } from './DepartmentCell';
import { TableRow } from '@/components/ui/table';

interface UserRowProps {
  userId: string;
}

export function UserRow({ userId }: UserRowProps) {
  const user = useUserPointer(userId, ['id']);

  if (!user) {
    return null;
  }

  return (
    <TableRow>
      <NameCell userId={userId} />
      <EmailCell userId={userId} />
      <RoleCell userId={userId} />
      <DepartmentCell userId={userId} />
    </TableRow>
  );
}

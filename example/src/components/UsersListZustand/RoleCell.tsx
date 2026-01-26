import { useEffect, useRef, useState } from 'react';
import { useUsersStore } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface RoleCellProps {
  userId: string;
}

export function RoleCell({ userId }: RoleCellProps) {
  const role = useUsersStore(
    (state) => state.users.find((u) => u.id === userId)?.role
  );

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevRoleRef = useRef(role);

  useEffect(() => {
    renderCount.current += 1;
    if (prevRoleRef.current !== undefined && role !== prevRoleRef.current) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (role) {
      prevRoleRef.current = role;
    }
  }, [role]);

  if (!role) {
    return <TableCell>-</TableCell>;
  }

  return (
    <TableCell
      className={cn(
        'transition-colors',
        isHighlighted && 'bg-yellow-100 dark:bg-yellow-900/20'
      )}
    >
      <div className="flex items-center gap-2">
        <span>{role}</span>
        <span className="text-xs text-muted-foreground">
          ({renderCount.current})
        </span>
      </div>
    </TableCell>
  );
}

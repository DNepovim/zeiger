import { useEffect, useRef, useState } from 'react';
import { useUserPointer } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface RoleCellProps {
  userId: string;
}

export function RoleCell({ userId }: RoleCellProps) {
  const user = useUserPointer(userId, ['role']);

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevRoleRef = useRef(user?.role);

  useEffect(() => {
    renderCount.current += 1;
    if (
      prevRoleRef.current !== undefined &&
      user?.role !== prevRoleRef.current
    ) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (user?.role) {
      prevRoleRef.current = user.role;
    }
  }, [user?.role]);

  if (!user) {
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
        <span>{user.role}</span>
        <span className="text-xs text-muted-foreground">
          ({renderCount.current})
        </span>
      </div>
    </TableCell>
  );
}

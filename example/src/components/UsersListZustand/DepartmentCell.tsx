import { useEffect, useRef, useState } from 'react';
import { useUsersStore } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DepartmentCellProps {
  userId: string;
}

export function DepartmentCell({ userId }: DepartmentCellProps) {
  const department = useUsersStore(
    (state) => state.users.find((u) => u.id === userId)?.department
  );

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevDepartmentRef = useRef(department);

  useEffect(() => {
    renderCount.current += 1;
    if (
      prevDepartmentRef.current !== undefined &&
      department !== prevDepartmentRef.current
    ) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (department) {
      prevDepartmentRef.current = department;
    }
  }, [department]);

  if (!department) {
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
        <span>{department}</span>
        <span className="text-xs text-muted-foreground">
          ({renderCount.current})
        </span>
      </div>
    </TableCell>
  );
}

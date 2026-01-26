import { useEffect, useRef, useState } from 'react';
import { useUsersStore } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface EmailCellProps {
  userId: string;
}

export function EmailCell({ userId }: EmailCellProps) {
  const email = useUsersStore(
    (state) => state.users.find((u) => u.id === userId)?.email
  );

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevEmailRef = useRef(email);

  useEffect(() => {
    renderCount.current += 1;
    if (prevEmailRef.current !== undefined && email !== prevEmailRef.current) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (email) {
      prevEmailRef.current = email;
    }
  }, [email]);

  if (!email) {
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
        <span>{email}</span>
        <span className="text-xs text-muted-foreground">
          ({renderCount.current})
        </span>
      </div>
    </TableCell>
  );
}

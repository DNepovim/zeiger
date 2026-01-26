import { useEffect, useRef, useState } from 'react';
import { useUserPointer } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface NameCellProps {
  userId: string;
}

export function NameCell({ userId }: NameCellProps) {
  const user = useUserPointer(userId, ['firstName', 'surname']);

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevFirstNameRef = useRef(user?.firstName);
  const prevSurnameRef = useRef(user?.surname);

  const fullName = user ? `${user.firstName} ${user.surname}` : '';

  useEffect(() => {
    renderCount.current += 1;
    const nameChanged =
      prevFirstNameRef.current !== user?.firstName ||
      prevSurnameRef.current !== user?.surname;

    if (nameChanged && prevFirstNameRef.current !== undefined) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (user?.firstName) {
      prevFirstNameRef.current = user.firstName;
    }
    if (user?.surname) {
      prevSurnameRef.current = user.surname;
    }
  }, [user?.firstName, user?.surname]);

  if (!user) {
    return <TableCell className="font-medium">-</TableCell>;
  }

  return (
    <TableCell
      className={cn(
        'font-medium transition-colors',
        isHighlighted && 'bg-yellow-100 dark:bg-yellow-900/20'
      )}
    >
      <div className="flex items-center gap-2">
        <span>{fullName}</span>
        <span className="text-xs text-muted-foreground">
          ({renderCount.current})
        </span>
      </div>
    </TableCell>
  );
}

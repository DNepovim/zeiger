import { useEffect, useRef, useState } from 'react';
import { useUsersStore } from '../../usersStore';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface NameCellProps {
  userId: string;
}

export function NameCell({ userId }: NameCellProps) {
  const firstName = useUsersStore(
    (state) => state.users.find((u) => u.id === userId)?.firstName
  );
  const surname = useUsersStore(
    (state) => state.users.find((u) => u.id === userId)?.surname
  );

  const renderCount = useRef(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevFirstNameRef = useRef(firstName);
  const prevSurnameRef = useRef(surname);

  const fullName = firstName && surname ? `${firstName} ${surname}` : '';

  useEffect(() => {
    renderCount.current += 1;
    const nameChanged =
      prevFirstNameRef.current !== firstName ||
      prevSurnameRef.current !== surname;

    if (nameChanged && prevFirstNameRef.current !== undefined) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      return () => clearTimeout(timer);
    }
    if (firstName) {
      prevFirstNameRef.current = firstName;
    }
    if (surname) {
      prevSurnameRef.current = surname;
    }
  }, [firstName, surname]);

  if (!firstName || !surname) {
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

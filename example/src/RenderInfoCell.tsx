import { useEffect, useRef } from 'react';
import { useUserPointer } from './usersStore';
import { TableCell } from '@/components/ui/table';

interface RenderInfoCellProps {
  userId: string;
}

export function RenderInfoCell({ userId }: RenderInfoCellProps) {
  const user = useUserPointer(userId, [
    'firstName',
    'surname',
    'email',
    'role',
    'department',
  ]);

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  }, [user]);

  if (!user) {
    return <TableCell className="text-xs text-muted-foreground">-</TableCell>;
  }

  return (
    <TableCell className="text-xs text-muted-foreground">
      <div className="flex flex-col">
        <span>Row renders: {renderCount.current}</span>
        <span className="text-[10px] mt-1 opacity-70">
          (Cells render independently)
        </span>
      </div>
    </TableCell>
  );
}

import type { ColumnDef, RowData } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import type { Row } from '@/ai/shema';
import { cn } from '@/lib/utils';

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: <custom>
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const defaultColumn: Partial<ColumnDef<Row>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue || '');
    const [isEditing, setIsEditing] = useState(false);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
      setIsEditing(false);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue || '');
    }, [initialValue]);

    if (isEditing) {
      return (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          // biome-ignore lint/a11y/noAutofocus: <>
          autoFocus
          className={cn(
            'w-full min-w-0 px-3 py-2 bg-transparent border-input outline-none',
            'placeholder:text-muted-foreground disabled:opacity-50',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset',
          )}
        />
      );
    }

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <>
      <div
        onClick={() => setIsEditing(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsEditing(true);
          }
        }}
        className="w-full min-w-0 px-3 py-2 cursor-pointer break-words focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-inset"
      >
        {value as string}
      </div>
    );
  },
};

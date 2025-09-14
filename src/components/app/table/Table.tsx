import { useChat } from '@ai-sdk/react';
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import type { Row } from '@/ai/shema';
import { Artifact } from '@/components/ai-elements/artifact';
import { useChatContext } from '@/contexts/chat-context';
import { processMessage } from '@/lib/processMessage';

const columnHelper = createColumnHelper<Row>();

const columns: ColumnDef<Row>[] = [
  columnHelper.display({
    id: 'rowNumber',
    cell: ({ row }) => row.index + 1,
  }),
  {
    accessorKey: 'title',
    header: 'Наименование',
  },
  {
    accessorKey: 'amount',
    header: 'Количество',
  },
];

const gridTemplateColumns = '50px 1fr 120px';

export const Table = () => {
  const { chat } = useChatContext();
  const { messages } = useChat({ chat });
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === 'text')
          processMessage(part).then((message) => {
            if (message.tableRows) {
              setRows(message.tableRows);
            }
          });
      }
    }
  }, [messages]);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Artifact className="w-2/3 h-full">
      <div className="divide-y divide-background h-full flex flex-col">
        <div className="bg-stone-800 grid" style={{ gridTemplateColumns }}>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div key={header.id} className="px-3 py-2 text-left font-medium">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </div>
            )),
          )}
        </div>
        <div className="divide-y divide-background overflow-auto flex-1">
          {table.getRowModel().rows.map((row, index) => (
            <div
              key={row.id}
              className={`grid ${index % 2 === 0 ? 'bg-stone-900' : 'bg-stone-800'}`}
              style={{ gridTemplateColumns }}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="px-3 py-2 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Artifact>
  );
};

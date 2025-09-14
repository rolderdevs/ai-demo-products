import { useChat } from '@ai-sdk/react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import type { Row } from '@/ai/shema';
import { Artifact } from '@/components/ai-elements/artifact';
import { useChatContext } from '@/contexts/chat-context';
import { processMessage } from '@/lib/processMessage';

export const Table = () => {
  const { chat } = useChatContext();
  const { messages } = useChat({ chat });
  const [columns, setColumns] = useState<ColumnDef<Row>[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === 'text')
          processMessage(part).then((message) => {
            if (message.tableColumns && message.tableRows) {
              setRows(message.tableRows);
              setColumns(message.tableColumns);
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
    <Artifact className="w-4/5 h-full">
      <div className="h-full overflow-auto">
        <table className="w-full">
          <thead className="bg-stone-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? 'bg-stone-900' : 'bg-stone-800'}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Artifact>
  );
};

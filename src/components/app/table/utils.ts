import type { ColumnDef } from '@tanstack/react-table';
import { utils, writeFile } from 'xlsx';
import type { Row } from '@/ai/shared';

export const exportToXlsx = (
  columns: ColumnDef<Row>[],
  rows: Record<string, unknown>[],
) => {
  // Получаем заголовки из колонок (header всегда строка)
  const headers = columns.map((col) => col.header as string);

  // Создаем массив для экспорта с правильными заголовками
  const dataWithHeaders = rows.map((row) => {
    const newRow: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      const typedCol = col as { accessorKey: string };
      const key = typedCol.accessorKey;
      if (key && key in row) {
        newRow[headers[index]] = row[key];
      }
    });
    return newRow;
  });

  const ws = utils.json_to_sheet(dataWithHeaders);

  // Расчет оптимальной ширины колонок
  const MIN_WIDTH = 10; // Минимальная ширина в символах
  const MAX_WIDTH = 100; // Максимальная ширина в символах

  const colWidths: number[] = [];

  // Начинаем с ширины заголовков
  headers.forEach((header, index) => {
    colWidths[index] = header.length;
  });

  // Проходим по данным и находим максимальную ширину для каждой колонки
  dataWithHeaders.forEach((row) => {
    Object.values(row).forEach((value, index) => {
      const cellLength = String(value ?? '').length;
      colWidths[index] = Math.max(colWidths[index] || 0, cellLength);
    });
  });

  // Применяем ограничения и устанавливаем ширину колонок
  ws['!cols'] = colWidths.map((width) => ({
    wch: Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH),
  }));

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Экспорт');
  writeFile(wb, `Экспорт_от_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

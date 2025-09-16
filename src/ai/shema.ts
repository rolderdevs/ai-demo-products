import { z } from 'zod';

export const columnSchema = z.object({
  accessorKey: z.string().describe('Название ключа в данных, например title.'),
  header: z.string().describe('Заголовок для столбца таблицы'),
}).describe('Всегда используй английские название для ключей JSON.');

export const rowSchema = z
  .looseObject({})
  .describe(
    'Структура объекта строки должна строго соответсвовать заданным accessorKey в столбцах. Всегда используй английские название для ключей JSON.',
  );

export const messageSchema = z.object({
  text: z.string().describe('Сообщение пользователю'),
  tableColumns: z.optional(z.array(columnSchema)),
  tableRows: z.optional(z.array(rowSchema)),
});

export type Message = z.infer<typeof messageSchema>;
export type Row = z.infer<typeof rowSchema>;

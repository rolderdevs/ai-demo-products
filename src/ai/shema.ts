import { z } from 'zod';

export const columnSchema = z.object({
  accessorKey: z.string().describe('Название ключа в данных, например title'),
  header: z.string().describe('Заголовок для столбца таблицы'),
  width: z
    .optional(z.number().min(50))
    .describe(
      'Ширина столбца. Нужно устанавливать только когда ширину можно предсказать',
    ),
});

export const rowSchema = z
  .looseObject({})
  .describe(
    'Структура объекта строки должна строго соответсвовать заданным accessorKey в столбцах',
  );

export const messageSchema = z.object({
  text: z
    .string()
    .describe(
      'Сообщение пользователю. Не используй двоеточие, т.к. сообщения и таблица разделены. Таблица находится справа.',
    ),
  tableColumns: z
    .optional(z.array(columnSchema))
    .describe(
      'Не создавай колонок, когда для них нет данных и сообщи об этом пользователю.',
    ),
  tableRows: z.optional(z.array(rowSchema)),
});

export type Message = z.infer<typeof messageSchema>;
export type Row = z.infer<typeof rowSchema>;

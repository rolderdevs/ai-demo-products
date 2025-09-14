import { z } from 'zod';

export const columnSchema = z
  .object({
    accessorKey: z.string().describe('Название ключа в данных, например title'),
    header: z.string().describe('Заголовок для столбца таблицы'),
    width: z
      .optional(z.number().min(50))
      .describe(
        'Ширина столбца. Нужно устанавливать только когда ширину можно предсказать',
      ),
  })
  .describe(
    'Прежде чем создавать столбец, проверь есть ли для него данные. Никогда не создавай колонок с пустыми данными.',
  );

export const rowSchema = z
  .looseObject({})
  .describe(
    'Структура объекта строки должна строго соответсвовать заданным accessorKey в столбцах.',
  );

export const messageSchema = z.object({
  text: z.string().describe('Сообщение пользователю'),
  tableColumns: z.optional(z.array(columnSchema)),
  tableRows: z.optional(z.array(rowSchema)),
});

export type Message = z.infer<typeof messageSchema>;
export type Row = z.infer<typeof rowSchema>;

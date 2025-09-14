import { z } from 'zod';

export const rowSchema = z.object({
  title: z.string().describe('Наименование позиции/товара'),
  amount: z.string().describe('Количество'),
});

export const messageSchema = z.object({
  text: z
    .string()
    .describe(
      'Сообщение пользователю. Не используй двоеточие, т.к. сообщения и таблица разделены',
    ),
  tableRows: z.optional(z.array(rowSchema)),
});

export type Message = z.infer<typeof messageSchema>;
export type Row = z.infer<typeof rowSchema>;

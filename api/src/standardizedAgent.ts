import {
  convertToModelMessages,
  type LanguageModel,
  Output,
  smoothStream,
  streamText,
  type UIMessage,
} from 'ai';
import z from 'zod';
import {
  columnSchema,
  openRouterProviderOptions,
  systemPromt,
} from './shared.js';

const rowSchema = z
  .object({
    index: z
      .number()
      .min(0)
      .describe('Порядковый номер строки. Название столбца - #'),
    title: z.string('').describe('Наименование'),
    article: z
      .string('')
      .describe(
        'Артикул - это уникальный идентификатор. Он не может быть одинаковым для разных строк. Название столбца - Артикул',
      ),
    amount: z.number().min(0).nullable().describe('Количество'),
    unitName: z.string('').describe('Единица измерения'),
    date: z.string('').describe('Дата поставки'),
    comment: z.string('').describe('Комментарий'),
  })
  .describe(
    'Стандартизированная структура данных таблицы. Всегда ставь пустую строку для строковых полей, если нет данных.',
  );

const messageSchema = z.object({
  text: z.string().describe('Сообщение пользователю'),
  tableColumns: z.optional(z.array(columnSchema)),
  tableRows: z.optional(z.array(rowSchema)),
});

export const standardizedAgent = (
  model: LanguageModel,
  messages: UIMessage[],
) =>
  streamText({
    model,
    messages: convertToModelMessages(messages),
    system: systemPromt,
    providerOptions: openRouterProviderOptions,
    experimental_output: Output.object({ schema: messageSchema }),
    experimental_transform: smoothStream(),
  });

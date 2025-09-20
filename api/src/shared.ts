import type { OpenRouterProviderOptions } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

export const headers = {
  'Content-Type': 'text/event-stream',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
};

export const openRouterProviderOptions = {
  openrouter: {
    reasoning: {
      enabled: true,
      effort: 'medium',
    },
  } satisfies OpenRouterProviderOptions,
};

export const systemPromt = `# Правила работы с данными таблицы
- Никогда не выводи в структуру таблицы, если данные и так актуальны.
- Если выводишь структуру таблицы, значит ОБЯЗАТЕЛЬНО выводи и структуру колонок.
- Столбцы с пустыми данными важны, не исключай их.
- Таблица находится справа от твоих сообщений. Учти это.
- Делай короткое резюме о содержании таблицы, когда создаешь ее первый раз.
- Делай короткое резюме об изменении содержания таблицы, когда меняешь ее.`;

export const columnSchema = z
  .object({
    accessorKey: z
      .string()
      .describe('Название ключа в данных, например title.'),
    header: z.string().describe('Заголовок для столбца таблицы'),
  })
  .describe('Всегда используй английские название для ключей JSON.');

export const rowSchema = z
  .looseObject({})
  .describe(
    'Гибкая структура данных таблицы. Структура объекта строки должна строго соответсвовать заданным accessorKey в столбцах. Всегда используй английские название для ключей JSON.',
  );

export const messageSchema = z.object({
  text: z.string().describe('Сообщение пользователю'),
  tableColumns: z.optional(z.array(columnSchema)),
  tableRows: z.optional(z.array(rowSchema)),
});

export type Message = z.infer<typeof messageSchema>;
export type Row = z.infer<typeof rowSchema>;

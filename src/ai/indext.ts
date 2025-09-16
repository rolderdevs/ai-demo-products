import {
  createOpenRouter,
  type OpenRouterProviderOptions,
} from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, Output, streamText, type UIMessage } from 'ai';
import { messageSchema, type Row } from './shema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter();

export const streamAi = async (req: Request) => {
  const { messages, tableData }: { messages: UIMessage[]; tableData: Row[] } =
    await req.json();

  console.log(tableData);

  const result = streamText({
    model: openrouter.chat('google/gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: `# Правила оформления сообщений пользователю

## Данные таблицы
- Исходные данные в таблице появляются только когда ТЫ их создал
- Пользователь может их редактировать
- "АКТУАЛЬНЫЕ ДАННЫЕ ТАБЛИЦЫ" ВСЕГДА важнее исходных данных
- Никогда не выводи в схему таблицу, если данные и так актуальны

## Форма сообщений о данных таблицы
- Таблица находится справа от твоих сообщений. Учти это.
- Делай короткое резюме о содержании таблицы, когда создаешь ее первый раз.
- Делай короткое резюме об изменении содержания таблицы, когда меняешь ее.${
      tableData
        ? `

## АКТУАЛЬНЫЕ ДАННЫЕ ТАБЛИЦЫ:
${JSON.stringify(tableData, null, 2)}`
        : ''
    }
`,
    providerOptions: {
      openrouter: {
        reasoning: {
          enabled: true,
          effort: 'medium',
        },
      } satisfies OpenRouterProviderOptions,
    },
    experimental_output: Output.object({ schema: messageSchema }),
  });

  return result.toUIMessageStreamResponse();
};

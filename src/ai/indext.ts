import {
  createOpenRouter,
  type OpenRouterProviderOptions,
} from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, Output, streamText, type UIMessage } from 'ai';
import { messageSchema } from './shema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter();

export const streamAi = async (req: Request) => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter.chat('google/gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    // system: 'Слева пользователь видит твои сообщения, српава таблицу.',
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

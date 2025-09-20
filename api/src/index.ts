import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { UIMessage } from 'ai';
import { classificationAgent } from './classificationAgent';
import { flexibleAgent } from './flexibleAgent';
import { standardizedAgent } from './standardizedAgent';

import 'dotenv/config';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter();
const model = openrouter.chat('google/gemini-2.5-flash');

let mode: 'flexible' | 'standardized' = 'flexible';

export const streamAi = async (messages: UIMessage[]) => {
  const lastUserMessageIndex =
    messages
      .map((m, i) => ({ message: m, index: i }))
      .filter(({ message }) => message.role === 'user')
      .pop()?.index || 1;
  const lastUserMessage = messages[lastUserMessageIndex];
  const hasFile = lastUserMessage.parts.some((part) => part.type === 'file');

  if (hasFile) {
    mode = 'flexible';

    const result = flexibleAgent(model, messages);
    return result.toUIMessageStreamResponse();
  } else {
    const parts = lastUserMessage.parts;
    const lastPartIndex =
      parts
        .map((part, i) => ({ part, index: i }))
        .filter(({ part }) => part.type === 'text')
        .pop()?.index || 0;
    const lastPart = parts[lastPartIndex];
    if (lastPart.type === 'text') {
      mode = await classificationAgent(model, mode, lastPart.text);
    }

    console.log('Mode:', mode);

    if (mode === 'flexible') {
      const result = flexibleAgent(model, messages);
      return result.toUIMessageStreamResponse();
    } else if (mode === 'standardized') {
      const result = standardizedAgent(model, messages);
      return result.toUIMessageStreamResponse({
        headers: {
          'Content-Encoding': 'none',
        },
      });
    }
  }
};

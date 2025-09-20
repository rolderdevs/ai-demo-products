import {
  convertToModelMessages,
  type LanguageModel,
  Output,
  smoothStream,
  streamText,
  type UIMessage,
} from 'ai';
import {
  messageSchema,
  openRouterProviderOptions,
  systemPromt,
} from './shared.js';

export const flexibleAgent = (model: LanguageModel, messages: UIMessage[]) =>
  streamText({
    model,
    messages: convertToModelMessages(messages),
    system: systemPromt,
    providerOptions: openRouterProviderOptions,
    experimental_output: Output.object({ schema: messageSchema }),
    experimental_transform: smoothStream(),
  });

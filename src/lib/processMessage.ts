import { parsePartialJson, type TextUIPart } from 'ai';
import type { Message } from '@/ai/shema';

export const processMessage = async (part: TextUIPart): Promise<Message> => {
  if (!part.text.startsWith('{')) {
    return { text: part.text };
  }

  try {
    // parsePartialJson возвращает промис с результатом
    // biome-ignore lint/suspicious/noExplicitAny: <parsePartialJson>
    const result = (await parsePartialJson(part.text)) as any;
    return result?.value || { text: part.text };
  } catch (error) {
    console.error('Error parsing partial JSON:', error);
    return { text: part.text }; // Fallback к исходному тексту
  }
};

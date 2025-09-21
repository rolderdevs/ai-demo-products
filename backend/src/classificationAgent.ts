import { generateObject, type LanguageModel } from 'ai';
import z from 'zod';

export const classificationAgent = async (
  model: LanguageModel,
  mode: 'flexible' | 'standardized',
  query: string,
) => {
  const { object: classification } = await generateObject({
    model,
    schema: z.object({
      type: z.enum(['flexible', 'standardized']),
    }),
    prompt: `#Определи режим работы

## Правила:
1. Если пользователь прямо пишет "Приведи к стандарту" - standardized.
2. Если пользователь просит добавить или удалить колонку - flexible.
3. Во всех остальных случаях - текущий режим.

## Текущий режим: ${mode}

## Запрос:
${query}`,
  });

  return classification.type;
};

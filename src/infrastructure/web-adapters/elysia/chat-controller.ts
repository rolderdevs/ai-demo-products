/**
 * Chat Controller - HTTP API endpoints для чата
 *
 * Предоставляет REST API для взаимодействия с чатом.
 * Следует принципам Clean Architecture - только маршрутизация и валидация HTTP.
 */

import type { CreateChatUseCase } from '@application/use-cases/create-chat';
import type { GetChatUseCase } from '@application/use-cases/get-chat';
import type { SendMessageUseCase } from '@application/use-cases/send-message';
import { Elysia, t } from 'elysia';

/**
 * Создает контроллер чата с внедренными зависимостями
 */
export function createChatController(
  createChatUseCase: CreateChatUseCase,
  getChatUseCase: GetChatUseCase,
  sendMessageUseCase: SendMessageUseCase,
) {
  return (
    new Elysia({ prefix: '/api/chat' })
      // Создание нового чата
      .post(
        '/',
        async ({ body }) => {
          try {
            const chat = await createChatUseCase.execute(body.title);
            return {
              success: true,
              data: chat,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';
            return {
              success: false,
              error: message,
            };
          }
        },
        {
          body: t.Object({
            title: t.String({ minLength: 1, maxLength: 100 }),
          }),
          detail: {
            summary: 'Создать новый чат',
            tags: ['Chat'],
          },
        },
      )

      // Создание чата с автоматическим заголовком
      .post(
        '/auto',
        async () => {
          try {
            const chat = await createChatUseCase.createWithAutoTitle();
            return {
              success: true,
              data: chat,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';
            return {
              success: false,
              error: message,
            };
          }
        },
        {
          detail: {
            summary: 'Создать чат с автоматическим заголовком',
            tags: ['Chat'],
          },
        },
      )

      // Получение чата по ID
      .get(
        '/:id',
        async ({ params: { id }, set }) => {
          try {
            const chat = await getChatUseCase.execute(id);

            if (!chat) {
              set.status = 404;
              return {
                success: false,
                error: 'Chat not found',
              };
            }

            return {
              success: true,
              data: chat,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';
            set.status = 400;
            return {
              success: false,
              error: message,
            };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            summary: 'Получить чат по ID',
            tags: ['Chat'],
          },
        },
      )

      // Получение только сообщений чата
      .get(
        '/:id/messages',
        async ({ params: { id }, set }) => {
          try {
            const messages = await getChatUseCase.getMessages(id);
            return {
              success: true,
              data: messages,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';

            if (message.includes('not found')) {
              set.status = 404;
            } else {
              set.status = 400;
            }

            return {
              success: false,
              error: message,
            };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            summary: 'Получить сообщения чата',
            tags: ['Chat'],
          },
        },
      )

      // Отправка сообщения в чат
      .post(
        '/:id/message',
        async ({ params: { id }, body, set }) => {
          try {
            const [userMessage, aiMessage] = await sendMessageUseCase.execute(
              id,
              body.content,
            );

            return {
              success: true,
              data: {
                userMessage,
                aiMessage,
                total: 2,
              },
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';

            if (message.includes('not found')) {
              set.status = 404;
            } else {
              set.status = 400;
            }

            return {
              success: false,
              error: message,
            };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            content: t.String({ minLength: 1, maxLength: 10000 }),
          }),
          detail: {
            summary: 'Отправить сообщение в чат',
            tags: ['Chat'],
          },
        },
      )

      // Служебный endpoint для проверки работы API
      .get(
        '/health',
        () => ({
          success: true,
          message: 'Chat API is working',
          timestamp: new Date().toISOString(),
        }),
        {
          detail: {
            summary: 'Проверка работы Chat API',
            tags: ['Health'],
          },
        },
      )
  );
}

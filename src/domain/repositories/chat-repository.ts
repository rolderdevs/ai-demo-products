/**
 * Минимальный интерфейс репозитория для чата
 *
 * Содержит только то, что действительно нужно для простого AI чата:
 * - Создать чат
 * - Добавить сообщение
 * - Получить историю сообщений
 */

import type {
  Chat,
  CreateChatData,
  CreateMessageData,
  Message,
} from '../entities/message';

/**
 * Базовый интерфейс репозитория чатов
 *
 * Следует принципу минимальности - только необходимые операции
 */
export interface ChatRepository {
  /**
   * Создает новый чат
   */
  createChat(data: CreateChatData): Promise<Chat>;

  /**
   * Получает чат по ID с его сообщениями
   */
  getChat(id: string): Promise<Chat | null>;

  /**
   * Добавляет сообщение в чат
   */
  addMessage(data: CreateMessageData): Promise<Message>;

  /**
   * Получает сообщения чата в хронологическом порядке
   */
  getMessages(chatId: string): Promise<Message[]>;
}
